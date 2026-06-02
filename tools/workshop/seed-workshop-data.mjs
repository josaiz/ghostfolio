#!/usr/bin/env node

import path from 'node:path';

import {
  DATASET_FILES,
  DEMO_MARKER,
  activityRowKey,
  activityTupleKey,
  apiRequest,
  csvRowToActivity,
  ensureDataset,
  ensureGhostfolioIsUp,
  extractActivityRowKey,
  getAccounts,
  getActivities,
  getAuthToken,
  getBaseUrl,
  getCurrentUser,
  parseCsvFile,
  printStep
} from './lib/workshop-data.mjs';

async function main() {
  const baseUrl = getBaseUrl();

  printStep(`Checking Ghostfolio at ${baseUrl}`);
  await ensureGhostfolioIsUp(baseUrl);

  printStep('Checking workshop dataset');
  const { importDir } = ensureDataset();

  printStep('Authenticating');
  const authToken = await getAuthToken({ baseUrl });
  const user = await getCurrentUser({ authToken, baseUrl });
  const permissions = new Set(user.permissions ?? []);

  if (!permissions.has('createAccount') || !permissions.has('createActivity')) {
    throw new Error(
      'The authenticated user does not have permissions to create accounts and activities. Use the admin security token created during setup.'
    );
  }

  printStep('Ensuring demo accounts exist');
  let accounts = await getAccounts({ authToken, baseUrl });
  const accountResults = [];

  for (const definition of DATASET_FILES) {
    let account = findAccountByName(accounts, definition.accountName);
    let status = 'already existed';

    if (!account) {
      account = await apiRequest({
        authToken,
        baseUrl,
        method: 'POST',
        path: '/api/v1/account',
        body: {
          balance: 0,
          comment: `${DEMO_MARKER}; account created by seed-workshop-data`,
          currency: definition.currency,
          isExcluded: false,
          name: definition.accountName,
          platformId: null
        }
      });
      status = 'created';
      accounts = await getAccounts({ authToken, baseUrl });
    }

    accountResults.push({
      account,
      accountName: definition.accountName,
      fileName: definition.fileName,
      status
    });
  }

  printStep('Checking already imported workshop activities');
  const existingActivities = await getActivities({ authToken, baseUrl });
  const existingRowKeys = new Set(
    existingActivities.map(extractActivityRowKey).filter(Boolean)
  );
  const existingTupleKeys = new Set(existingActivities.map(activityTupleKey));

  printStep('Importing demo activities');
  const importResults = [];

  for (const accountResult of accountResults) {
    const filePath = path.join(importDir, accountResult.fileName);
    const csvRows = parseCsvFile(filePath);
    const activitiesToImport = [];
    let skipped = 0;

    for (const { item, rowNumber } of csvRows) {
      const activity = csvRowToActivity({
        accountId: accountResult.account.id,
        fileName: accountResult.fileName,
        item,
        rowNumber
      });

      const rowKey = activityRowKey({
        fileName: accountResult.fileName,
        rowNumber
      });

      if (existingRowKeys.has(rowKey) || existingTupleKeys.has(activityTupleKey(activity))) {
        skipped += 1;
        continue;
      }

      activitiesToImport.push(activity);
    }

    let imported = 0;

    if (activitiesToImport.length > 0) {
      await apiRequest({
        authToken,
        baseUrl,
        method: 'POST',
        path: '/api/v1/import?dryRun=true',
        body: {
          activities: activitiesToImport
        }
      });

      const response = await apiRequest({
        authToken,
        baseUrl,
        method: 'POST',
        path: '/api/v1/import?dryRun=false',
        body: {
          activities: activitiesToImport
        }
      });

      imported = response?.activities?.length ?? activitiesToImport.length;
    }

    importResults.push({
      accountName: accountResult.accountName,
      imported,
      skipped
    });
  }

  console.log('\nWorkshop seed completed\n');
  console.log('Accounts:');
  for (const accountResult of accountResults) {
    console.log(`- ${accountResult.accountName}: ${accountResult.status}`);
  }

  console.log('\nActivities imported:');
  for (const importResult of importResults) {
    console.log(
      `- ${importResult.accountName}: ${importResult.imported} imported, ${importResult.skipped} skipped`
    );
  }

  console.log('\nOpen Ghostfolio:');
  console.log(baseUrl);
}

function findAccountByName(accounts, name) {
  return accounts.find(
    (account) => account.name?.toLowerCase() === name.toLowerCase()
  );
}

main().catch((error) => {
  console.error(`\nERROR: ${error.message}`);
  process.exit(1);
});
