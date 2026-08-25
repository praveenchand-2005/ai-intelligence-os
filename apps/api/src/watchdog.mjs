import { randomUUID } from 'node:crypto';
import { enqueue, runJob, listJobs } from './jobs.mjs';
const watches=new Map();
export function createWatch(input){const watch={id:randomUUID(),target:String(input.target||'').trim(),intervalMinutes:Math.max(60,Number(input.intervalMinutes||1440)),status:'active',lastRunAt:null,lastResult:null,createdAt:new Date().toISOString()};if(!watch.target)throw Error('target is required');watches.set(watch.id,watch);return watch;}
export function listWatches(){return [...watches.values()].sort((a,b)=>b.createdAt.localeCompare(a.createdAt));}
export function getWatch(id){return watches.get(id)||null;}
export function pauseWatch(id){const w=watches.get(id);if(!w)return null;w.status='paused';return w;}
export function resumeWatch(id){const w=watches.get(id);if(!w)return null;w.status='active';return w;}
export async function executeWatch(id,collector){const w=watches.get(id);if(!w||w.status!=='active')return null;const job=enqueue('watchdog',{watchId:id,target:w.target});w.lastRunAt=new Date().toISOString();const done=await runJob(job.id,async p=>collector(p.target));w.lastResult=done.result||{error:done.error||null,status:done.status};return {watch:w,job:done};}
export function watchdogStatus(){return {active:listWatches().filter(w=>w.status==='active').length,paused:listWatches().filter(w=>w.status==='paused').length,jobs:listJobs().length};}
