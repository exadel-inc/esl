import {getOctokit, context} from '@actions/github';
import {ensureLabels, createOrUpdateIssue, closeIssue, findIssue} from './issue-helper.js';

const octokit = getOctokit(process.env.GITHUB_TOKEN);

const URLS = process.env.URLS.split(',');
const SITE_NAME = process.env.SITE_NAME;
const TIMEOUT = parseInt(process.env.TIMEOUT || '10000', 10);

async function checkURL(url) {
  console.log(`Checking ${url}...`);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      redirect: 'follow'
    });
    clearTimeout(timeoutId);
    const result = {url, status: response.status, ok: response.ok};
    if (result.ok) {
      console.log(`✅ ${url} is accessible (HTTP ${result.status})`);
    } else {
      console.log(`❌ ${url} is NOT accessible (HTTP ${result.status})`);
    }
    return result;
  } catch (error) {
    clearTimeout(timeoutId);
    console.log(`❌ ${url} is NOT accessible (HTTP 000)`);
    return {url, status: 0, ok: false, error: error.message};
  }
}

async function handleAllSuccess() {
  console.log('');
  console.log('✅ All URLs are accessible!');

  const alertIssue = await findIssue('Monitor: Website', '🚨 Website Alert');
  if (alertIssue) {
    await closeIssue(
      'Monitor: Website',
      '🚨 Website Alert',
      '✅ Website availability has been restored. All monitored URLs are now accessible. Issue resolved.'
    );
  }

  const warningIssue = await findIssue('Monitor: Website', '⚠️ Website Warning');
  if (warningIssue) {
    console.log(`Deleting warning issue #${warningIssue.number} (recovered before alert)`);
    await octokit.rest.issues.update({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: warningIssue.number,
      state: 'closed',
      state_reason: 'not_planned'
    });
  }
}

async function escalateWarningToAlert(warningIssue, failedList, successList) {
  console.log(`Warning issue exists (#${warningIssue.number}), escalating to ALERT...`);
  const body = `🚨 **ALERT**: Website availability issues detected for **${SITE_NAME}**.\n\n`
    + '**Status escalated from warning to alert** due to multiple consecutive failures.\n\n'
    + `## Failed URLs\n${failedList}${successList}\n\n*Escalated to alert: ${new Date().toUTCString()}*`;

  await octokit.rest.issues.update({
    owner: context.repo.owner,
    repo: context.repo.repo,
    issue_number: warningIssue.number,
    title: `🚨 Website Alert: ${SITE_NAME}`,
    body
  });

  const escalationComment = '⚠️ → 🚨 **Issue escalated to ALERT**\n\n'
    + 'This warning has been escalated to an alert due to multiple consecutive failures detected.\n\n'
    + 'The issue title and description have been updated to reflect the current alert status.';
  await octokit.rest.issues.createComment({
    owner: context.repo.owner,
    repo: context.repo.repo,
    issue_number: warningIssue.number,
    body: escalationComment
  });

  process.exit(1);
}

async function handleFailures(failed, success) {
  console.log('');
  console.log(`⚠️ ${failed.length} URL(s) failed!`);

  const failedList = failed.map((r) => `- ❌ ${r.url} (HTTP ${r.status})`).join('\n');
  const successList = success.length > 0
    ? '\n## Accessible URLs\n' + success.map((r) => `- ✅ ${r.url}`).join('\n')
    : '';

  const alertIssue = await findIssue('Monitor: Website', '🚨 Website Alert');
  if (alertIssue) {
    console.log(`Alert issue already exists (#${alertIssue.number}), updating...`);
    const body = `🚨 **ALERT**: Website availability issues detected for **${SITE_NAME}**.\n\n`
      + `## Failed URLs\n${failedList}${successList}\n\n*Updated: ${new Date().toUTCString()}*`;
    await createOrUpdateIssue('Monitor: Website', `🚨 Website Alert: ${SITE_NAME}`, body, '🚨 Website Alert');
    process.exit(1);
  }

  const warningIssue = await findIssue('Monitor: Website', '⚠️ Website Warning');
  if (warningIssue) {
    await escalateWarningToAlert(warningIssue, failedList, successList);
    return;
  }

  console.log('First failure detected, creating WARNING issue...');

  const body = `⚠️ **WARNING**: Potential website availability issue detected for **${SITE_NAME}**.\n\n`
    + 'This could be a temporary network issue or a deployment in progress. '
    + 'If the issue persists, this will be escalated to an alert.\n\n'
    + `## Failed URLs\n${failedList}${successList}\n\n*Created: ${new Date().toUTCString()}*`;

  await createOrUpdateIssue('Monitor: Website', `⚠️ Website Warning: ${SITE_NAME}`, body, '⚠️ Website Warning');
  process.exit(0);
}

async function main() {
  await ensureLabels([
    {name: 'monitoring', description: 'Monitoring alerts', color: '0075ca'},
    {name: 'Monitor: Website', description: 'Website availability monitoring', color: 'd73a4a'}
  ]);

  console.log(`Checking website availability for ${SITE_NAME}...`);

  const results = [];
  for (const url of URLS) {
    results.push(await checkURL(url));
  }

  const failed = results.filter((r) => !r.ok);
  const success = results.filter((r) => r.ok);

  if (failed.length === 0) {
    await handleAllSuccess();
    return;
  }

  await handleFailures(failed, success);
}

main();
