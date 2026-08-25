import { randomUUID } from 'node:crypto';
import { dbEnabled, saveCase, listPersistedCases, getPersistedCase } from './db.mjs';
const cases = new Map();
export async function createCase(input){ const item={id:randomUUID(),...input,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()}; cases.set(item.id,item); await saveCase(item); return item; }
export async function updateCase(id, patch){ const item=cases.get(id) || await getPersistedCase(id); if(!item)return null; Object.assign(item,patch,{updatedAt:new Date().toISOString()}); cases.set(id,item); await saveCase(item); return item; }
export async function getCase(id){ if(cases.has(id))return cases.get(id); const item=await getPersistedCase(id); if(item)cases.set(id,item); return item; }
export async function listCases(){ const persisted=await listPersistedCases(); if(persisted){for(const x of persisted)cases.set(x.id,x);return persisted;} return [...cases.values()].sort((a,b)=>b.createdAt.localeCompare(a.createdAt)); }
export { dbEnabled };
