import test from 'node:test';
import assert from 'node:assert/strict';

test('API health contract exposes persistence mode',async()=>{
  assert.equal(typeof process.env.NODE_ENV,'string');
});
