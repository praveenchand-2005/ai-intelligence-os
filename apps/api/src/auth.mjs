import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
const users=new Map(); const sessions=new Map();
const hash=(password,salt)=>scryptSync(password,salt,32).toString('hex');
export function register(email,password){if(!email||!password||password.length<10)throw Error('email and 10+ character password required');const key=email.trim().toLowerCase();if(users.has(key))throw Error('account already exists');const salt=randomBytes(16).toString('hex');users.set(key,{email:key,salt,hash:hash(password,salt),createdAt:new Date().toISOString()});return login(key,password)}
export function login(email,password){const u=users.get(email.trim().toLowerCase());if(!u)throw Error('invalid credentials');const a=Buffer.from(u.hash,'hex'),b=Buffer.from(hash(password,u.salt),'hex');if(a.length!==b.length||!timingSafeEqual(a,b))throw Error('invalid credentials');const token=randomBytes(32).toString('base64url');sessions.set(token,{email:u.email,expiresAt:Date.now()+1000*60*60*24*7});return {token,email:u.email,expiresAt:new Date(Date.now()+1000*60*60*24*7).toISOString()}}
export function session(token){const s=sessions.get(token);if(!s||s.expiresAt<Date.now()){if(s)sessions.delete(token);return null}return s}
export function authHeader(req){const h=req.headers.authorization||'';return h.startsWith('Bearer ')?session(h.slice(7)):null}
