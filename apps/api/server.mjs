import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root=join(fileURLToPath(new URL('.',import.meta.url)),'../web');
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8'};
const json=(res,status,data)=>{res.writeHead(status,{'content-type':'application/json'});res.end(JSON.stringify(data));};
const server=createServer(async(req,res)=>{
  if(req.url==='/api/health') return json(res,200,{ok:true,service:'intelligence-api',timestamp:new Date().toISOString()});
  if(req.url==='/api/investigations') return json(res,200,{items:[],status:'ready',message:'Provider-backed investigation endpoint initialized'});
  const raw=(req.url||'/').split('?')[0]; const safe=normalize(raw==='/'?'/index.html':raw).replace(/^\.\.(\/|\\)/,''); const path=join(root,safe);
  try{const body=await readFile(path);res.writeHead(200,{'content-type':mime[extname(path)]||'text/plain; charset=utf-8'});res.end(body);}catch{res.writeHead(404);res.end('Not found');}
});
server.listen(process.env.PORT||8787,()=>console.log('AI Intelligence OS API listening'));
