import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createCase, updateCase, getCase, listCases } from './store.mjs';
import { collect } from './investigation.mjs';
import { initDb, dbEnabled } from './db.mjs';
import { register, login, authHeader } from './auth.mjs';
const port=Number(process.env.PORT||8787); const webRoot=join(fileURLToPath(new URL('../../web/',import.meta.url)));
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8'};
const json=(res,s,b)=>{res.writeHead(s,{'content-type':'application/json; charset=utf-8','cache-control':'no-store'});res.end(JSON.stringify(b));};
const read=req=>new Promise((resolve,reject)=>{let b='';req.on('data',c=>b+=c);req.on('end',()=>{try{resolve(b?JSON.parse(b):{})}catch(e){reject(e)}});req.on('error',reject)});
const staticFile=async(res,p)=>{try{const safe=normalize(p).replace(/^([.][.][/\\])+/, '');const f=join(webRoot,safe==='/'?'index.html':safe.replace(/^[/\\]/,''));res.writeHead(200,{'content-type':types[extname(f)]||'application/octet-stream'});res.end(await readFile(f));return true}catch{return false}};
const server=http.createServer(async(req,res)=>{const u=new URL(req.url||'/',`http://${req.headers.host||'localhost'}`);
 if(req.method==='GET'&&u.pathname==='/api/health')return json(res,200,{ok:true,service:'aio-api',mode:'live',persistence:dbEnabled()?'postgres':'memory'});
 if(req.method==='POST'&&u.pathname==='/api/auth/register')try{const b=await read(req);return json(res,201,register(String(b.email||''),String(b.password||'')))}catch(e){return json(res,400,{error:e.message})}
 if(req.method==='POST'&&u.pathname==='/api/auth/login')try{const b=await read(req);return json(res,200,login(String(b.email||''),String(b.password||'')))}catch(e){return json(res,401,{error:e.message})}
 if(req.method==='GET'&&u.pathname==='/api/auth/me'){const s=authHeader(req);return s?json(res,200,{authenticated:true,email:s.email}):json(res,401,{authenticated:false})}
 if(req.method==='GET'&&u.pathname==='/api/providers')return json(res,200,{items:[{id:'iana-rdap',name:'IANA RDAP',status:'operational'},{id:'cloudflare-doh',name:'Cloudflare DNS-over-HTTPS',status:'operational'},{id:'email-dns',name:'Email DNS resolver',status:'operational'}]});
 if(req.method==='GET'&&u.pathname==='/api/cases'){if(!authHeader(req))return json(res,401,{error:'authentication required'});return json(res,200,{items:await listCases()});}
 if(req.method==='POST'&&u.pathname==='/api/investigations'){if(!authHeader(req))return json(res,401,{error:'authentication required'});try{const body=await read(req);const target=String(body.target||'').trim();if(!target)return json(res,400,{error:'target is required'});const item=await createCase({target,status:'collecting',evidence:[],findings:[],sources:[]});try{const r=await collect(target);return json(res,202,await updateCase(item.id,{status:'completed',kind:r.kind,result:r.result,evidence:r.evidence,sources:[...new Set(r.evidence.map(e=>e.provider))],message:r.message,completedAt:new Date().toISOString()}));}catch{return json(res,202,await updateCase(item.id,{status:'degraded',error:'Provider collection failed'}));}}catch{return json(res,400,{error:'invalid JSON'})}}
 if(req.method==='GET'&&u.pathname.startsWith('/api/investigations/')){if(!authHeader(req))return json(res,401,{error:'authentication required'});const item=await getCase(u.pathname.split('/').pop());return item?json(res,200,item):json(res,404,{error:'not found'})}
 if(req.method==='GET'&&await staticFile(res,u.pathname))return;return json(res,404,{error:'not found'});});
initDb().then(()=>server.listen(port,()=>console.log(`AIO listening on ${port}`))).catch(e=>{console.error('db init failed',e);server.listen(port,()=>console.log(`AIO listening on ${port} without database`))});
