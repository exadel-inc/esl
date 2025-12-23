import {getOctokit, context} from '@actions/github';

const octokit = getOctokit(process.env.GITHUB_TOKEN);
const {owner, repo} = context.repo;

export async function ensureLabels(labels) {
  for (const {name, description, color} of labels) {
    try {
      await octokit.rest.issues.createLabel({owner, repo, name, description, color});
    } catch (error) {
      if (error.status !== 422) throw error; // 422 = already exists
    }
  }
}

export async function findIssue(label, searchTerm) {
  const {data} = await octokit.rest.issues.listForRepo({
    owner,
    repo,
    labels: label,
    state: 'open'
  });
  return data.find((issue) => issue.title.includes(searchTerm));
}

export async function createOrUpdateIssue(label, title, body, searchTerm) {
  const existing = await findIssue(label, searchTerm);

  if (existing) {
    console.log(`Updating issue #${existing.number}`);
    await octokit.rest.issues.update({
      owner,
      repo,
      issue_number: existing.number,
      body
    });
    return existing.number;
  }

  console.log(`Creating new issue: ${title}`);
  const {data} = await octokit.rest.issues.create({
    owner,
    repo,
    title,
    body,
    labels: [label, 'monitoring']
  });
  return data.number;
}

export async function closeIssue(label, searchTerm, comment) {
  const existing = await findIssue(label, searchTerm);

  if (existing) {
    console.log(`Closing issue #${existing.number}`);
    await octokit.rest.issues.createComment({
      owner,
      repo,
      issue_number: existing.number,
      body: comment
    });
    await octokit.rest.issues.update({
      owner,
      repo,
      issue_number: existing.number,
      state: 'closed',
      state_reason: 'completed'
    });
  }
}
