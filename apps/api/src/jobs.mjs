import { randomUUID } from 'node:crypto';
const jobs=new Map();
export function enqueue(type,payload){const job={id:randomUUID(),type,payload,status:'queued',createdAt:new Date().toISOString(),attempts:0};jobs.set(job.id,job);return job;}
export function getJob(id){return jobs.get(id)||null;}
export function listJobs(){return [...jobs.values()].sort((a,b)=>b.createdAt.localeCompare(a.createdAt));}
export async function runJob(id,worker){const job=jobs.get(id);if(!job)return null;job.status='running';job.startedAt=new Date().toISOString();job.attempts++;try{job.result=await worker(job.payload);job.status='completed';job.completedAt=new Date().toISOString();}catch(e){job.status='failed';job.error=e?.message||'job failed';job.completedAt=new Date().toISOString();}return job;}
