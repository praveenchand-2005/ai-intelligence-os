import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
const sessions=new Map();const buckets=new Map();const WINDOW_MS=60_000;const MAX_REQUESTS=60;
export function hashPassword(password){const salt=randomBytes(16).toString('hex');const hash=scryptSync(password,salt,64).toString('hex');return `${salt}:${hash}`}
export function verifyPassword(password,encoded){try{const [salt,hex]=encoded.split(':');const a=Buffer.from(hex,'hex');const b=scryptSync(password,salt,64);return a.length===b.length&&timingSafeEqual(a,b)}catch{return false}}
export function createSession(userId){const token=randomBytes(32).toString('hex');sessions.set(token,{userId,createdAt:Date.now()});return token}
export function getSession(token){return token?sessions.get(token)||null:null}
export function revokeSession(token){if(token)sessions.delete(token)}
export function parseCookies(header=''){return Object.fromEntries(header.split(';').map(x=>x.trim().split('=' )).filter(x=>x.length===2).map(([k,v])=>[k,decodeURIComponent(v)]))}
export function rateLimit(key,limit=MAX_REQUESTS,windowMs=WINDOW_MS){const now=Date.now(),b=buckets.get(key);if(!b||now-b.startedAt>=windowMs){buckets.set(key,{startedAt:now,count:1});return {ok:true,remaining:limit-1,retryAfter:0}}b.count++;return {ok:b.count<=limit,remaining:Math.max(0,limit-b.count),retryAfter:Math.ceil((b.startedAt+windowMs-now)/1000)}}
export function validateTarget(value){const s=String(value??'').trim();if(!s||s.length>512)throw Error('target must be between 1 and 512 characters');if(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(s))throw Error('target contains invalid control characters');return s}
export function securityHeaders(){return {'x-content-type-options':'nosniff','x-frame-options':'DENY','referrer-policy':'no-referrer','content-security-policy':"default-src 'self'; script-src 'self'; script-src-attr 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; object-src 'none'; base-uri 'self'; frame-ancestors 'none'"}}
