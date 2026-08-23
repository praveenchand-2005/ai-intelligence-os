import http from 'node:http';
import { randomUUID } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { investigateDomain } from './providers/domain.mjs';

const port = Number(process.env.PORT || 8787);
const webRoot = join(fileURLToPath(new URL('../../web/', import.meta.url)));
const cases = new Map();
const contentTypes = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8'};
const json = (res,status,body) => { res.writeHead(status,{'content-type':'application/json; charset=utf-8','cache-control':'no-store'}); res.end(JSON.stringify(body)); };
const read = req => new Promise((resolve,reject)=>{let b='';req.on('data',c=>b+=c);req.on('end',()=>{try{resolve(b?JSON.parse(b):{})}catch(e){reject(e)}});req.on('error',reject)});
const staticFile = async (res, pathname) => { try { const safe=normalize(pathname).replace(/^([.][.][/\\])+/, ''); const file=join(webRoot, safe==='/'? 'index.html':safe.replace(/^[/\\]/,'')); const body=await readFile(file); res.writeHead(200,{'content-type':contentTypes[extname(file)]||'application/octet-stream'}); res.end(body); return true; } catch { return false; } };
const looksLikeDomain = value => /^(?:https?:\/\/)?(?:[a-z0-9-]+\.)+[a-z]{2,}$/i.test(String(value).trim());

const server = http.createServer(async (req,res)=>{
  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  if (req.method === 'GET' && url.pathname === '/api/health') return json(res,200,{ok:true,service:'aio-api',time:new Date().toISOString(),dataMode:'live-provider'});
  if (req.method === 'GET' && url.pathname === '/api/providers') return json(res,200,{items:[{id:'iana-rdap',name:'IANA RDAP bootstrap',status:'operational',capabilities:['domain-registration']},{id:'cloudflare-doh',name:'Cloudflare DNS-over-HTTPS',status:'operational',capabilities:['A','AAAA','MX','NS','TXT']} ]});
  if (req.method === 'GET' && url.pathname === '/api/cases') return json(res,200,{items:[...cases.values()]});
  if (req.method === 'POST' && url.pathname === '/api/investigations') {
    try {
      const body=await read(req); const target=String(body.target||'').trim();
      if(!target)return json(res,400,{error:'target is required'});
      const item={id:randomUUID(),target,status:'queued',createdAt:new Date().toISOString(),evidence:[],findings:[],sources:[]};
      cases.set(item.id,item);
      if (looksLikeDomain(target)) {
        try {
          item.status='collecting';
          const result=await investigateDomain(target);
          item.status='completed'; item.completedAt=new Date().toISOString(); item.evidence=result.evidence;
          item.sources=[...new Set(result.evidence.map(e=>e.provider))];
          item.result={domain:result.domain,rdapAvailable:result.sources.rdap,dns:result.dns};
        } catch (error) { item.status='degraded'; item.error='Provider collection failed'; item.providerError=error instanceof Error ? error.message : String(error); }
      }
      return json(res,202,item);
    } catch { return json(res,400,{error:'invalid JSON'}); }
  }
  if (req.method === 'GET' && url.pathname.startsWith('/api/investigations/')) { const item=cases.get(url.pathname.split('/').pop()); if(!item)return json(res,404,{error:'not found'}); return json(res,200,item); }
  if (req.method === 'GET' && await staticFile(res,url.pathname)) return;
  json(res,404,{error:'not found'});
});
server.listen(port,()=>console.log(`AIO listening on ${port}`));
