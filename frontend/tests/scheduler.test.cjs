const { test } = require('node:test');
const assert = require('node:assert/strict');
const { advanceScheduler, cancelInScheduler, creditBalance, estimateCredits, resourceAvailability, submitToScheduler, validateSubmission, EXECUTION_MS, QUEUE_DELAY_MS } = require('../.test-build/lib/scheduler.js');
const { createDemoState } = require('../.test-build/data/mock-data.js');
const { MockHPCService, STORAGE_KEY, isDemoState } = require('../.test-build/services/mock-hpc-service.js');

const NOW = Date.parse('2026-11-05T08:00:00.000Z');
const input = { name: 'Test workload', workload: 'Scientific simulation', cpu: 4, gpu: 0, ramGb: 8, runtimeMinutes: 60, description: '', simulateFailure: false };
const fresh = () => ({ ...createDemoState(NOW), jobs: [] });
const submit = (state = fresh(), fields = {}, id = 'UC-TEST', now = NOW) => submitToScheduler(state, { ...input, ...fields }, id, now);

test('resource-based pricing includes CPU, GPU, RAM, and requested wall time', () => {
  assert.equal(estimateCredits(input), 2.4);
  assert.equal(estimateCredits({ ...input, cpu: 8, gpu: 2, ramGb: 64, runtimeMinutes: 90 }), 34.8);
});
test('rejects missing fields, unsupported workloads, invalid ranges, fractions, and non-finite resources', () => {
  for (const fields of [{ name: '  ' }, { workload: '' }, { cpu: 0 }, { cpu: 65 }, { cpu: 1.5 }, { gpu: -1 }, { gpu: 5 }, { ramGb: 257 }, { runtimeMinutes: 0 }, { runtimeMinutes: 1441 }, { ramGb: NaN }, { cpu: Infinity }, { description: 'x'.repeat(501) }]) {
    assert.ok(Object.keys(validateSubmission({ ...input, ...fields }, 250)).length > 0, JSON.stringify(fields));
  }
  assert.deepEqual(validateSubmission(input, 2.4), {});
});
test('submission reserves credits and leaves source state unchanged', () => {
  const source = fresh(); const { state, job } = submit(source);
  assert.equal(source.jobs.length, 0);
  assert.equal(job.status, 'Pending');
  assert.equal(creditBalance(state).reserved, 2.4);
  assert.equal(creditBalance(state).available, 247.6);
});
test('rejects unaffordable submissions and duplicate IDs without modifying history', () => {
  const source = fresh(); source.grants[0].amount = 1;
  assert.throws(() => submit(source), /Insufficient credits/);
  assert.equal(source.jobs.length, 0);
  const result = submit();
  assert.throws(() => submit(result.state), /Duplicate job ID/);
});
test('pending -> running -> completed releases resources and charges once', () => {
  let { state } = submit();
  state = advanceScheduler(state, NOW + QUEUE_DELAY_MS - 1);
  assert.equal(state.jobs[0].status, 'Pending');
  state = advanceScheduler(state, NOW + QUEUE_DELAY_MS);
  assert.equal(state.jobs[0].status, 'Running');
  assert.equal(resourceAvailability(state.jobs).cpu.available, 124);
  state = advanceScheduler(state, NOW + QUEUE_DELAY_MS + EXECUTION_MS);
  assert.equal(state.jobs[0].status, 'Completed');
  assert.equal(state.jobs[0].progress, 100);
  assert.equal(resourceAvailability(state.jobs).cpu.available, 128);
  assert.deepEqual(creditBalance(state), { granted: 250, reserved: 0, consumed: 2.4, available: 247.6, starter: 250 });
  assert.deepEqual(creditBalance(advanceScheduler(state, NOW + 1000000)), creditBalance(state));
});
test('queue respects capacity and admits a waiting job when resources are released', () => {
  const fields = { cpu: 64, gpu: 4, ramGb: 256 };
  let { state } = submit(fresh(), fields, 'one');
  state = submit(state, fields, 'two').state;
  state = submit(state, fields, 'three').state;
  state = advanceScheduler(state, NOW + QUEUE_DELAY_MS);
  assert.equal(resourceAvailability(state.jobs).runningJobs, 2);
  assert.equal(resourceAvailability(state.jobs).queuedJobs, 1);
  assert.equal(resourceAvailability(state.jobs).cpu.available, 0);
  state = advanceScheduler(state, NOW + QUEUE_DELAY_MS + EXECUTION_MS);
  assert.equal(state.jobs.find(j => j.id === 'three').status, 'Running');
  assert.equal(resourceAvailability(state.jobs).runningJobs, 1);
});
test('offline replay matches frequent updates, including queued work', () => {
  let { state } = submit(fresh(), { cpu: 64, gpu: 4, ramGb: 256 }, 'one');
  state = submit(state, { cpu: 64, gpu: 4, ramGb: 256 }, 'two').state;
  state = submit(state, { cpu: 64, gpu: 4, ramGb: 256 }, 'three').state;
  let frequent = state;
  for (let offset = 0; offset <= 120000; offset += 1000) frequent = advanceScheduler(frequent, NOW + offset);
  const offline = advanceScheduler(state, NOW + 120000);
  assert.deepEqual(offline, frequent);
  assert.equal(offline.jobs.every(j => j.status === 'Completed'), true);
});
test('pending cancellation refunds the full reservation', () => {
  const result = submit();
  const state = cancelInScheduler(result.state, result.job.id, NOW + 1000);
  assert.equal(state.jobs[0].status, 'Cancelled');
  assert.equal(creditBalance(state).available, 250);
  assert.equal(creditBalance(state).reserved, 0);
});
test('running cancellation charges the elapsed fraction and releases unused credits', () => {
  const result = submit();
  const state = cancelInScheduler(result.state, result.job.id, NOW + QUEUE_DELAY_MS + EXECUTION_MS / 2);
  assert.equal(state.jobs[0].chargedCredits, 1.2);
  assert.equal(creditBalance(state).available, 248.8);
  assert.equal(resourceAvailability(state.jobs).cpu.available, 128);
  assert.throws(() => cancelInScheduler(state, result.job.id, NOW + 40000), /Only pending or running/);
});
test('cancellation race at completion does not refund a completed job', () => {
  const result = submit();
  assert.throws(() => cancelInScheduler(result.state, result.job.id, NOW + 60000), /Only pending or running/);
  assert.throws(() => cancelInScheduler(result.state, 'missing', NOW), /could not be found/);
});
test('failure is explicit and releases half the reservation', () => {
  const result = submit(fresh(), { simulateFailure: true });
  const state = advanceScheduler(result.state, NOW + 60000);
  assert.equal(state.jobs[0].status, 'Failed');
  assert.equal(state.jobs[0].progress, 50);
  assert.equal(state.jobs[0].chargedCredits, 1.2);
  assert.equal(creditBalance(state).reserved, 0);
});
test('clock rollback does not reverse job states or consume negative credits', () => {
  const result = submit();
  const state = advanceScheduler(result.state, NOW + 30000);
  assert.deepEqual(advanceScheduler(state, NOW - 5000), state);
});
test('stored data validation rejects malformed jobs and accepts seeded data', () => {
  assert.equal(isDemoState(createDemoState(NOW)), true);
  assert.equal(isDemoState(null), false);
  assert.equal(isDemoState({ ...fresh(), jobs: [{}] }), false);
  assert.equal(isDemoState({ ...fresh(), grants: [{ amount: -20 }] }), false);
});
test('service persists jobs, generates unique IDs, and supports demo top-ups', async () => {
  const storage = new Map();
  global.window = { localStorage: { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value) } };
  const service = new MockHPCService();
  const initial = await service.getDashboard();
  const first = await service.submitJob(input);
  const second = await service.submitJob(input);
  assert.notEqual(first.id, second.id);
  assert.match(first.id, /^UC-[A-F0-9-]{36}$/);
  const reloaded = await new MockHPCService().getDashboard();
  assert.ok(reloaded.jobs.some(j => j.id === first.id));
  assert.equal(reloaded.credits.reserved, 4.8);
  await service.addDemoCredits(100);
  const toppedUp = await service.getDashboard();
  assert.equal(toppedUp.credits.granted, initial.credits.granted + 100);
  await assert.rejects(() => service.addDemoCredits(123), /Choose one/);
  await service.cancelJob(first.id);
  assert.equal((await service.getDashboard()).jobs.find(j => j.id === first.id).status, 'Cancelled');
  assert.ok(storage.has(STORAGE_KEY));
  delete global.window;
});
test('blocked storage degrades to a usable in-memory demo with a warning', async () => {
  global.window = { localStorage: { getItem() { throw new Error('blocked'); }, setItem() { throw new Error('blocked'); } } };
  const service = new MockHPCService();
  assert.match((await service.getDashboard()).storageWarning, /session only/);
  const job = await service.submitJob(input);
  assert.ok((await service.getDashboard()).jobs.some(j => j.id === job.id));
  delete global.window;
});
test('unreadable and incompatible saved state do not crash the workspace', async () => {
  for (const raw of ['{bad json', JSON.stringify({ version: 99 })]) {
    global.window = { localStorage: { getItem: () => raw, setItem() {} } };
    const data = await new MockHPCService().getDashboard();
    assert.ok(data.storageWarning);
    assert.ok(data.jobs.length > 0);
  }
  delete global.window;
});
