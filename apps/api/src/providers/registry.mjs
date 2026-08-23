import { investigateDomain } from './domain.mjs';
import { investigateEmail } from './email.mjs';
export const providers=[{id:'domain-live',name:'IANA RDAP + Cloudflare DNS',capabilities:['domain'],run:investigateDomain},{id:'email-domain-live',name:'DNS email-domain intelligence',capabilities:['email'],run:investigateEmail}];
export const providerFor=target=>{const v=String(target||'').trim();if(/^[^\s@]+@[^\s@]+$/.test(v))return providers.find(p=>p.capabilities.includes('email'));return providers.find(p=>p.capabilities.includes('domain'));};
