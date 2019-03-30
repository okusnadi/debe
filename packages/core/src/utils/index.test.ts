import {
  toISO,
  createLog,
  log as logging,
  ensureArray,
  generate,
  setIdGenerator,
  isArgsWithCallback,
  extractCallback
} from './index';

test('utils:toISO', () => {
  const date = new Date();
  expect(date.toISOString()).toBe(toISO(date));
});

test('utils:log', () => {
  const log = createLog('test');
  log.error('Test', 1);
  log.warn('Test', 2);
  log.info('Test', 3);
  logging.enable();
  log.error('Test', 1);
  log.warn('Test', 2);
  log.info('Test', 3);
  logging.disable();
});

test('utils:array', () => {
  expect(ensureArray(null).length).toBe(0);
  expect(ensureArray(1).length).toBe(1);
  expect(ensureArray([]).length).toBe(0);
  expect(ensureArray([1, 2]).length).toBe(2);
});

test('utils:id', () => {
  let ids: string[] = [];
  for (let i = 0; i < 10000; i++) {
    ids.push(generate());
  }
  const uniques = ids.filter((v, i) => ids.indexOf(v) === i);
  expect(uniques.length).toBe(ids.length);
  setIdGenerator(() => '123');
  expect(generate()).toBe('123');
});

test('utils:args', () => {
  expect(isArgsWithCallback([1, 2, 3])).toBe(false);
  expect(isArgsWithCallback([1, 2, () => true])).toBe(true);
  expect(typeof extractCallback([1, 2, () => true])[0]).toBe('function');
  expect(extractCallback([1, 2, () => true])[1]).toBe(1);
  expect(extractCallback([1, 2, 3])[0]).toBe(undefined);
  expect(extractCallback([1, 2, 3])[1]).toBe(1);
});
