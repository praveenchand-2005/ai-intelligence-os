import { randomBytes, createHash } from 'node:crypto';
const sessions=new Map();
export function createSession(userId){const token=randomBytes(32).toString('hex');sessions.set(hash(token),{userId,createdAt:Date.now()});return token;}
export function getSession(token){if(!token)return null;return sessions.get(hash(token))||null;}
export function revokeSession(token){if(token)sessions.delete(hash(token));}
function hash(v){return createHash('sha256').update(v).digest('hex')}
