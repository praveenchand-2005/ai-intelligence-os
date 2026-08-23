import test from 'node:test';
import assert from 'node:assert/strict';

const module = await import('../apps/api/src/providers/domain.mjs');

test('domain provider exports investigation entrypoint', () => {
  assert.equal(typeof module.investigateDomain, 'function');
});

test('provider rejects an invalid domain before upstream access', async () => {
  await assert.rejects(() => module.investigateDomain('not-a-domain'), /invalid domain/);
});
