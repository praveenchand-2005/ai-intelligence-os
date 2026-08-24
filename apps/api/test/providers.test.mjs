import test from 'node:test';
import assert from 'node:assert/strict';
import { investigateDomain } from '../src/providers/domain.mjs';

test('domain provider normalizes URL and returns evidence', async () => {
  const result = await investigateDomain('https://example.com/');
  assert.equal(result.domain, 'example.com');
  assert.equal(result.sources.dns, true);
  assert.ok(result.evidence.length >= 5);
  assert.ok(result.evidence.every(item => item.provider && item.retrievedAt && item.title));
});
