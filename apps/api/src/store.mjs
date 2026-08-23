import { randomUUID } from 'node:crypto';
const cases = new Map();
export function createCase(input){ const item={id:randomUUID(),...input,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()}; cases.set(item.id,item); return item; }
export function updateCase(id, patch){ const item=cases.get(id); if(!item)return null; Object.assign(item,patch,{updatedAt:new Date().toISOString()}); return item; }
export function getCase(id){return cases.get(id)||null}
export function listCases(){return [...cases.values()].sort((a,b)=>b.createdAt.localeCompare(a.createdAt))}
