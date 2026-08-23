import { resolve4 } from 'node:dns/promises';

const now=()=>new Date().toISOString();
export async function investigateEmail(value){
  const email=String(value).trim().toLowerCase();
  const domain=email.split('@')[1];
  if(!domain) throw new Error('invalid email');
  let addresses=[]; try{addresses=await resolve4(domain)}catch{}
  return {email,domain,addresses,evidence:[{id:`email-dns-${domain}`,provider:'Node DNS resolver',title:'Email domain DNS resolution',summary:`Resolved ${domain} to ${addresses.length} IPv4 address(es).`,url:`https://${domain}`,retrievedAt:now(),observedAt:now()}]};
}
