import pg from 'pg';
const {Pool}=pg;
let pool=null;
export function getPool(){
  if(!process.env.DATABASE_URL) return null;
  pool ??= new Pool({connectionString:process.env.DATABASE_URL,ssl:process.env.DATABASE_URL.includes('render.com')?{rejectUnauthorized:false}:undefined,max:5});
  return pool;
}
export async function persistCase(item){
  const db=getPool(); if(!db)return item;
  await db.query(`insert into investigation_cases(id,target,kind,status,result,created_at,updated_at) values($1,$2,$3,$4,$5,$6,$7) on conflict(id) do update set kind=$3,status=$4,result=$5,updated_at=$7`,[item.id,item.target,item.kind,item.status,item.result||null,item.createdAt,item.updatedAt]);
  for(const e of item.evidence||[]) await db.query(`insert into evidence(case_id,provider,title,summary,source_url,observed_at,retrieved_at,payload) values($1,$2,$3,$4,$5,$6,$7,$8)`,[item.id,e.provider,e.title,e.summary,e.url||null,e.observedAt||null,e.retrievedAt||new Date(),e.raw||null]);
  return item;
}
export async function durableCases(){const db=getPool();if(!db)return null;const {rows}=await db.query('select * from investigation_cases order by created_at desc limit 100');return rows;}
