import { join } from 'path';
import { ensureDirSync, removeSync } from 'fs-extra';
import { generate } from '@debe/core';
import { createBetterSQLite3Client } from './index';
const sql = require('better-sqlite3');

const schema = [
  {
    name: 'lorem',
    index: ['hallo', 'hallo2']
  }
];
const dbDir = join(__dirname, '../../../.temp/better-sqlite3');
removeSync(dbDir);
ensureDirSync(dbDir);
const getDBDir = () => join(dbDir, generate() + '.db');

test('sqlite3', async () => {
  const db = createBetterSQLite3Client(sql(getDBDir()), schema);
  await db.connect();
  await db.insert('lorem', { hallo: 'ok' });
  await db.insert('lorem', { hallo: 'ok2' });
  const result = await db.all('lorem', {});
  expect(result.length).toBe(2);
});
