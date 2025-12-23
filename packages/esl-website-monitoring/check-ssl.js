import tls from 'tls';
import {ensureLabels, createOrUpdateIssue, closeIssue} from './issue-helper.js';

const DOMAIN = process.env.DOMAIN;
const WARNING_DAYS = parseInt(process.env.WARNING_DAYS || '30', 10);
const TIMEOUT = parseInt(process.env.TIMEOUT || '15000', 10);

async function getSSLExpiry(domain) {
  return new Promise((resolve, reject) => {
    const socket = tls.connect(443, domain, {servername: domain}, () => {
      const cert = socket.getPeerCertificate();
      socket.end();
      resolve(new Date(cert.valid_to));
    });

    socket.setTimeout(TIMEOUT);
    socket.on('timeout', () => {
      socket.destroy();
      reject(new Error('Connection timeout'));
    });
    socket.on('error', reject);
  });
}

async function handleSSLExpiring(daysUntilExpiry, expiry) {
  console.log(`⚠️ SSL certificate expires in ${daysUntilExpiry} days!`);

  const expiryDate = expiry.toISOString().split('T')[0];
  const body = `SSL certificate for ${DOMAIN} expires in **${daysUntilExpiry} days** (on ${expiryDate}).\n\n`
    + 'Please renew the certificate before expiration.\n\n*Updated: ' + new Date().toUTCString() + '*';

  await createOrUpdateIssue(
    'Monitor: SSL Certificate',
    `⚠️ SSL Certificate Expiring Soon: ${DOMAIN}`,
    body,
    'SSL Certificate Expiring Soon'
  );

  process.exit(1);
}

async function handleSSLError(error) {
  console.log('');
  console.error(`❌ Error: Could not check SSL certificate for ${DOMAIN}.`);
  console.error(`Error: ${error.message}`);

  const body = `Could not check SSL certificate for ${DOMAIN}.\n\n**Error:** ${error.message}\n\n`
    + 'This may indicate a network issue or certificate problem.\n\nPlease investigate.\n\n'
    + '*Updated: ' + new Date().toUTCString() + '*';

  await createOrUpdateIssue(
    'Monitor: SSL Certificate',
    `❌ SSL Certificate Check Failed: ${DOMAIN}`,
    body,
    'SSL Certificate Check Failed'
  );

  process.exit(2);
}

async function main() {
  await ensureLabels([
    {name: 'monitoring', description: 'Monitoring alerts', color: '0075ca'},
    {name: 'Monitor: SSL Certificate', description: 'SSL certificate monitoring', color: 'd73a4a'}
  ]);

  console.log(`Checking SSL certificate for ${DOMAIN}...`);

  try {
    const expiry = await getSSLExpiry(DOMAIN);
    const daysUntilExpiry = Math.floor((expiry - Date.now()) / (1000 * 60 * 60 * 24));

    console.log('');
    console.log(`Days until SSL expiry: ${daysUntilExpiry}`);

    if (daysUntilExpiry < WARNING_DAYS) {
      await handleSSLExpiring(daysUntilExpiry, expiry);
      return;
    }

    console.log(`✅ SSL certificate is valid for ${daysUntilExpiry} more days`);

    await closeIssue(
      'Monitor: SSL Certificate',
      'SSL Certificate Expiring Soon',
      `✅ SSL certificate is now valid for ${daysUntilExpiry} more days. Issue resolved.`
    );
  } catch (error) {
    await handleSSLError(error);
  }
}

main();
