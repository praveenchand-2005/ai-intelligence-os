import { investigateDomain } from './providers/domain.mjs';
import { investigateEmail } from './providers/email.mjs';
const email=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const domain=/^(?:https?:\/\/)?(?:[a-z0-9-]+\.)+[a-z]{2,}$/i;
export async function collect(target){
 const value=String(target).trim();
 if(email.test(value)){const result=await investigateEmail(value);return {kind:'email',result,evidence:result.evidence};}
 if(domain.test(value)){const result=await investigateDomain(value);return {kind:'domain',result,evidence:result.evidence};}
 return {kind:'identifier',result:null,evidence:[],message:'No live provider is enabled for this identifier yet.'};
}
