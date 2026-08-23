import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
const sessions=new Map();
export function hashPassword(password){const salt=randomBytes(16).toString('hex');const hash=scryptSync(password,salt,64).toString('hex');return `${salt}:${hash}`}
export function verifyPassword(password,encoded){try{const [salt,hex]=encoded.split(':');const a=Buffer.from(hex,'hex');const b=scryptSync(password,salt,64);return a.length===b.length&&timingSafeEqual(a,b)}catch{return false}}
export function createSession(userId){const token=randomBytes(32).toString('hex');sessions.set(token,{userId,createdAt:Date.now()});return token}
export function getSession(token){return token?sessions.get(token)||null:null}
export function revokeSession(token){if(token)sessions.delete(token)}
export function parseCookies(header=''){return Object.fromEntries(header.split(';').map(x=>x.trim().split('=' )).filter(x=>x.length===2).map(([k,v])=>[k,decodeURIComponent(v)]))}
