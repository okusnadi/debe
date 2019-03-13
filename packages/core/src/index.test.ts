import { join } from 'path';
import { ensureDirSync, removeSync } from 'fs-extra';
import { sqlight, generate } from './index';
import { betterSQLite3 } from '@sqlight/better-sqlite3';

const schema = [
  {
    name: 'lorem',
    index: ['hallo', 'hallo2']
  },
  {
    name: 'lorem2',
    index: ['hallo', 'hallo2']
  }
];
const dbDir = join(__dirname, '../../../.temp/sqlight');
removeSync(dbDir);
ensureDirSync(dbDir);
const getDBDir = () => join(dbDir, generate() + '.db');

test('simple', async () => {
  const db = sqlight(betterSQLite3(getDBDir()), schema);
  await db.insert('lorem', { hallo: 'ok' });
  await db.insert('lorem', { hallo: 'ok2' });
  const result = await db.all('lorem', {});
  expect(result.length).toBe(2);
});

test('complex', async () => {
  const db = sqlight(betterSQLite3(getDBDir()), schema);
  let listenerResult: any;
  const close = await db.allSubscription(
    'lorem',
    { limit: 1, orderBy: ['rev ASC'] },
    items => (listenerResult = items)
  );
  let listenerResult2: any;
  const close2 = await db.allSubscription(
    'lorem',
    { orderBy: ['rev ASC'] },
    items => (listenerResult2 = items)
  );
  await db.insert('lorem', { hallo: 'ok' });
  await db.insert('lorem', { hallo: 'ok', id: 1 });
  await db.insert('lorem', { hallo: 'ok3', id: 2 });
  await db.insert('lorem', { hallo: 'ok2', hallo2: 'ok', id: 1 });
  await db.insert('lorem', { hallo2: 'ok55', id: 1 });
  const all = await db.all('lorem', {});
  const all2 = await db.all('lorem', {
    limit: 1,
    where: ['hallo2 = ?', 'ok55']
  });
  const all3 = await db.all('lorem', {
    limit: 1,
    where: ['hallo = ?', 'ok3']
  });
  expect(all.length).toBe(3);
  expect(all2.length).toBe(1);
  expect(all3.length).toBe(1);
  expect(all2[0] ? all2[0]['hallo2'] : '').toBe('ok55');
  expect(all3[0] ? all3[0]['hallo'] : '').toBe('ok3');
  expect(listenerResult).toBeTruthy();
  expect(listenerResult2).toBeTruthy();
  expect(listenerResult && listenerResult.length).toBe(1);
  expect(listenerResult2 && listenerResult2.length).toBe(3);
  setTimeout(close, 500);
  setTimeout(close2, 500);
});
