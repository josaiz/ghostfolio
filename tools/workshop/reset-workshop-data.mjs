#!/usr/bin/env node

import readline from 'node:readline';

import {
  DATASET_FILES,
  DEMO_MARKER,
  apiRequest,
  ensureGhostfolioIsUp,
  getAccounts,
  getActivities,
  getAuthToken,
  getBaseUrl,
  printStep
} from './lib/workshop-data.mjs';

async function main() {
  const force = process.argv.includes('--force') || process.argv.includes('-Force');
  const baseUrl = getBaseUrl();

  printStep(`Checking Ghostfolio at ${baseUrl}`);
  await ensureGhostfolioIsUp(baseUrl);

  if (!force) {
    const confirmed = await confirm(
      'This will delete only activities marked as WORKSHOP_DEMO_DATA and seed-created empty demo accounts. Continue? [y/N] '
    );

    if (!confirmed) {
      console.log('Aborted.');
      return;
    }
  }

  printStep('Authenticating');
  const authToken = await getAuthToken({ baseUrl });

  printStep('Finding workshop activities');
  let activities = await getActivities({ authToken, baseUrl });
  const workshopActivities = activities.filter((activity) =>
    activity.comment?.includes(DEMO_MARKER)
  );

  for (const activity of workshopActivities) {
    await apiRequest({
      authToken,
      baseUrl,
      method: 'DELETE',
      path: `/api/v1/activities/${activity.id}`
    });
  }

  printStep('Removing empty seed-created demo accounts');
  const accounts = await getAccounts({ authToken, baseUrl });
  activities = await getActivities({ authToken, baseUrl });
  const remainingActivityAccountIds = new Set(
    activities.map((activity) => activity.accountId).filter(Boolean)
  );
  const demoNames = new Set(DATASET_FILES.map(({ accountName }) => accountName));
  const accountResults = [];

  for (const account of accounts) {
    if (!demoNames.has(account.name)) {
      continue;
    }

    if (!account.comment?.includes(DEMO_MARKER)) {
      accountResults.push({
        name: account.name,
        status: 'kept (account was not created by seed)'
      });
      continue;
    }

    if (remainingActivityAccountIds.has(account.id)) {
      accountResults.push({
        name: account.name,
        status: 'kept (still has non-workshop activities)'
      });
      continue;
    }

    await apiRequest({
      authToken,
      baseUrl,
      method: 'DELETE',
      path: `/api/v1/account/${account.id}`
    });

    accountResults.push({
      name: account.name,
      status: 'deleted'
    });
  }

  console.log('\nWorkshop reset completed\n');
  console.log(`Activities deleted: ${workshopActivities.length}`);

  console.log('\nAccounts:');
  if (accountResults.length === 0) {
    console.log('- No seed-created demo accounts found');
  } else {
    for (const accountResult of accountResults) {
      console.log(`- ${accountResult.name}: ${accountResult.status}`);
    }
  }

  console.log('\nOpen Ghostfolio:');
  console.log(baseUrl);
}

async function confirm(question) {
  if (!process.stdin.isTTY) {
    return false;
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return await new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(['y', 'yes'].includes(answer.trim().toLowerCase()));
    });
  });
}

main().catch((error) => {
  console.error(`\nERROR: ${error.message}`);
  process.exit(1);
});
