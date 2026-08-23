import { investigateDomain } from './providers/domain.mjs';
import { investigateEmail } from './providers/email.mjs';
import { investigateWebsite } from './providers/website.mjs';
import { investigateUsername } from './providers/username.mjs';
import { investigateIp } from './providers/ip.mjs';
const email=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const domain=/^(?:https?:\/\/)?(?:[a-z0-9-]+\.)+[a-z]{2,}$/i;
const username=/^@?[a-zA-Z0-9._-]{2,64}$/;
const ipv4=/^(?:\d{1,3}\.){3}\d{1,3}$/;
export async function collect(target){
 const value=String(target).trim();
 if(email.test(value)){const result=await investigateEmail(value);return {kind:'email',result,evidence:result.evidence};}
 if(/^https?:\/\//i.test(value)){const result=await investigateWebsite(value);return {kind:'website',result,evidence:result.evidence};}
 if(ipv4.test(value)){const result=await investigateIp(value);return {kind:'ip',result,evidence:result.evidence};}
 if(domain.test(value)){const result=await investigateDomain(value);return {kind:'domain',result,evidence:result.evidence};}
 if(username.test(value)){const result=await investigateUsername(value);return {kind:'username',result,evidence:result.evidence};}
 return {kind:'identifier',result:null,evidence:[],message:'No live provider is enabled for this identifier yet.'};
}
