import { enqueue, runJob } from './jobs.mjs';
const watches=new Map();
export function createSchedule({watchId,intervalMinutes=60}){const item={watchId,intervalMinutes:Math.max(60,Number(intervalMinutes)||60),enabled:true,nextRunAt:new Date(Date.now()+Math.max(60,Number(intervalMinutes)||60)*60000).toISOString()};watches.set(watchId,item);return item;}
export function getSchedule(watchId){return watches.get(watchId)||null;}
export function listSchedules(){return [...watches.values()];}
export async function tick(runWatch){const now=Date.now();const due=[...watches.values()].filter(x=>x.enabled&&Date.parse(x.nextRunAt)<=now);const results=[];for(const s of due){const job=enqueue('watchdog',{watchId:s.watchId});await runJob(job.id,runWatch);s.lastRunAt=new Date().toISOString();s.nextRunAt=new Date(Date.now()+s.intervalMinutes*60000).toISOString();results.push(job);}return results;}
