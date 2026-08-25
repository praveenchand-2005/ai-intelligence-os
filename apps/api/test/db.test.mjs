import test from 'node:test';
import assert from 'node:assert/strict';
import { dbEnabled } from '../src/db.mjs';

test('database adapter is disabled without DATABASE_URL',()=>{
  const previous=process.env.DATABASE_URL;
  delete process.env.DATABASE_URL;
  assert.equal(dbEnabled(),false);
  if(previous!==undefined)process.env.DATABASE_URL=previous;
});
