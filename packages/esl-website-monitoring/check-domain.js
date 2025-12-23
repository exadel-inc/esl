import whoiser from 'whoiser';
import {ensureLabels, createOrUpdateIssue, closeIssue} from './issue-helper.js';

const DOMAIN = process.env.DOMAIN;
const WARNING_DAYS = parseInt(process.env.WARNING_DAYS || '60', 10);

async function getDomainExpiry(domain) {
  const data = await whoiser(domain, {timeout: 15000});

  // whoiser returns object with whois server names as keys
  // Iterate through all servers to find expiry date
  const possibleFields = [
    'Expiry Date',
    'Registry Expiry Date',
    'Registrar Registration Expiration Date',
    'Expiration Date',
    'paid-till',
    'Expiration Time'
  ];

  for (const serverData of Object.values(data)) {
    if (!serverData || typeof serverData !== 'object') continue;

    for (const field of possibleFields) {
      if (serverData[field]) {
        return new Date(serverData[field]);
      }
    }
  }

  throw new Error('Could not find expiry date in whois data');
}

async function handleDomainExpiring(daysUntilExpiry, expiry) {
  console.log(`⚠️ Domain expires in ${daysUntilExpiry} days!`);

  const expiryDate = expiry.toISOString().split('T')[0];
  const body = `Domain ${DOMAIN} expires in **${daysUntilExpiry} days** (on ${expiryDate}).\n\n`
    + 'Please renew the domain before expiration.\n\n*Updated: ' + new Date().toUTCString() + '*';

  await createOrUpdateIssue(
    'Monitor: Domain',
    `⚠️ Domain Expiring Soon: ${DOMAIN}`,
    body,
    'Domain Expiring Soon'
  );

  process.exit(1);
}

async function handleDomainError(error) {
  console.log('');
  console.error(`❌ Error: Could not check domain expiry for ${DOMAIN}.`);
  console.error(`Error: ${error.message}`);

  const body = `Could not determine the domain expiry date for **${DOMAIN}**.\n\n**Error:** ${error.message}\n\n`
    + 'This may indicate a change in whois output format, a monitoring failure, or a domain issue.\n\n'
    + 'Please investigate.\n\n*Updated: ' + new Date().toUTCString() + '*';

  await createOrUpdateIssue(
    'Monitor: Domain',
    `❌ Domain Check Failed: ${DOMAIN}`,
    body,
    'Domain Check Failed'
  );

  process.exit(2);
}

async function main() {
  await ensureLabels([
    {name: 'monitoring', description: 'Monitoring alerts', color: '0075ca'},
    {name: 'Monitor: Domain', description: 'Domain expiry monitoring', color: 'd73a4a'}
  ]);

  console.log(`Checking domain expiry for ${DOMAIN}...`);

  try {
    const expiry = await getDomainExpiry(DOMAIN);
    const daysUntilExpiry = Math.floor((expiry - Date.now()) / (1000 * 60 * 60 * 24));

    console.log('');
    console.log(`Days until domain expiry: ${daysUntilExpiry}`);

    if (daysUntilExpiry < WARNING_DAYS) {
      await handleDomainExpiring(daysUntilExpiry, expiry);
      return;
    }

    console.log(`✅ Domain is valid for ${daysUntilExpiry} more days`);

    await closeIssue(
      'Monitor: Domain',
      'Domain Expiring Soon',
      `✅ Domain is now valid for ${daysUntilExpiry} more days. Issue resolved.`
    );
  } catch (error) {
    await handleDomainError(error);
  }
}

main();
