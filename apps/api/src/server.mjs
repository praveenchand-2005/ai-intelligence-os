import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createCase, updateCase, getCase, listCases } from './store.mjs';
import { collect } from './investigation.mjs';
import { buildGraph } from './graph.mjs';
import { initDb, dbEnabled } from './db.mjs';
import { register, login, authHeader } from './auth.mjs';
import { createWatch, listWatches, pauseWatch, resumeWatch, executeWatch, watchdogStatus } from './watchdog.mjs';
import { ensureWatchdogSchema, saveWatch } from './watchdog-store.mjs';
import { listAlerts, markRead } from './alerts.mjs';
const port=Number(process.env.PORT||8787);const webRoot=join(fileURLToPath(new URL('../../web/',import.meta.url)));const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8'};
const json=(res,s,b)=>{res.writeHead(s,{'content-type':'application/json; charset=utf-8','cache-control':'no-store'});res.end(JSON.stringify(b))};
const read=req=>new Promise((resolve,reject)=>{let b='';req.on('data',c=>b+=c);req.on('end',()=>{try{resolve(b?JSON.parse(b):{})}catch(e){reject(e)}});req.on('error',reject)});
const staticFile=async(res,p)=>{try{const safe=normalize(p).replace(/^([.][.][/\\])+/, '');const f=join(webRoot,safe==='/'?'index.html':safe.replace(/^[/\\]/,''));res.writeHead(200,{'content-type':types[extname(f)]||'application/octet-stream'});res.end(await readFile(f));return true}catch{return false}};
const server=http.createServer(async(req,res)=>{const u=new URL(req.url||'/',`http://${req.headers.host||'localhost'}`);const auth=async()=>await authHeader(req);
if(req.method==='GET'&&u.pathname==='/api/health')return json(res,200,{ok:true,service:'aio-api',mode:'live',persistence:dbEnabled()?'postgres':'memory'});
if(req.method==='POST'&&u.pathname==='/api/auth/register')try{const b=await read(req);return json(res,201,await register(String(b.email||''),String(b.password||'')))}catch(e){return json(res,400,{error:e.message})}
if(req.method==='POST'&&u.pathname==='/api/auth/login')try{const b=await read(req);return json(res,200,await login(String(b.email||''),String(b.password||'')))}catch(e){return json(res,401,{error:e.message})}
if(req.method==='GET'&&u.pathname==='/api/auth/me'){const s=await auth();return s?json(res,200,{authenticated:true,email:s.email}):json(res,401,{authenticated:false})}
if(req.method==='GET'&&u.pathname==='/api/providers')return json(res,200,{items:[{id:'iana-rdap',name:'IANA RDAP',status:'operational'},{id:'cloudflare-doh',name:'Cloudflare DNS-over-HTTPS',status:'operational'},{id:'email-dns',name:'Email DNS resolver',status:'operational'}]});
if(req.method==='GET'&&u.pathname==='/api/cases'){if(!await auth())return json(res,401,{error:'authentication required'});return json(res,200,{items:await listCases()})}
if(u.pathname==='/api/watchdog'&&req.method==='GET'){if(!await auth())return json(res,401,{error:'authentication required'});return json(res,200,{items:listWatches(),status:watchdogStatus()})}
if(u.pathname==='/api/watchdog'&&req.method==='POST'){if(!await auth())return json(res,401,{error:'authentication required'});try{const w=createWatch(await read(req));await saveWatch(w);return json(res,201,w)}catch(e){return json(res,400,{error:e.message})}}
const wm=u.pathname.match(/^\/api\/watchdog\/([^/]+)\/(run|pause|resume)$/);if(wm){if(!await auth())return json(res,401,{error:'authentication required'});const id=wm[1],action=wm[2];if(action==='pause'||action==='resume'){const w=action==='pause'?pauseWatch(id):resumeWatch(id);if(w)await saveWatch(w);return w?json(res,200,w):json(res,404,{error:'watch not found'})}const out=await executeWatch(id,async target=>{const r=await collect(target);return {kind:r.kind,evidence:r.evidence,result:r.result}});return out?json(res,200,out):json(res,404,{error:'watch not found or inactive'})}
if(req.method==='GET'&&u.pathname==='/api/alerts'){if(!await auth())return json(res,401,{error:'authentication required'});return json(res,200,{items:listAlerts()})}
const ar=u.pathname.match(/^\/api\/alerts\/([^/]+)\/read$/);if(req.method==='POST'&&ar){if(!await auth())return json(res,401,{error:'authentication required'});return json(res,200,markRead(ar[1]))}
if(req.method==='POST'&&u.pathname==='/api/investigations'){if(!await auth())return json(res,401,{error:'authentication required'});try{const body=await read(req),target=String(body.target||'').trim();if(!target)return json(res,400,{error:'target is required'});const item=await createCase({target,status:'collecting',evidence:[],findings:[],sources:[]});try{const r=await collect(target);return json(res,202,await updateCase(item.id,{status:'completed',kind:r.kind,result:r.result,evidence:r.evidence,sources:[...new Set(r.evidence.map(e=>e.provider))],message:r.message,completedAt:new Date().toISOString()}))}catch{return json(res,202,await updateCase(item.id,{status:'degraded',error:'Provider collection failed'}))}}catch{return json(res,400,{error:'invalid JSON'})}}
if(req.method==='GET'&&u.pathname.startsWith('/api/investigations/')&&u.pathname.endsWith('/graph')){if(!await auth())return json(res,401,{error:'authentication required'});const id=u.pathname.split('/')[3];const item=await getCase(id);return item?json(res,200,buildGraph(item)):json(res,404,{error:'not found'})}
if(req.method==='GET'&&u.pathname.startsWith('/api/investigations/')){if(!await auth())return json(res,401,{error:'authentication required'});const item=await getCase(u.pathname.split('/').pop());return item?json(res,200,item):json(res,404,{error:'not found'})}
if(req.method==='GET'&&await staticFile(res,u.pathname))return;return json(res,404,{error:'not found'})});
initDb().then(async()=>{await ensureWatchdogSchema();server.listen(port,()=>console.log(`AIO listening on ${port}`))}).catch(e=>{console.error('db init failed',e);server.listen(port,()=>console.log(`AIO listening on ${port} without database`))});
