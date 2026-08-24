import { investigateDomain } from './providers/domain.mjs';
import { investigateEmail } from './providers/email.mjs';
import { investigateWebsite } from './providers/website.mjs';
import { investigateUsername } from './providers/username.mjs';
import { investigateIp } from './providers/ip.mjs';
import { investigatePhone } from './providers/phone.mjs';
import { investigatePerson } from './providers/person.mjs';
const email=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;const domain=/^(?:https?:\/\/)?(?:[a-z0-9-]+\.)+[a-z]{2,}$/i;const username=/^@?[a-zA-Z0-9._-]{2,64}$/;const ipv4=/^(?:\d{1,3}\.){3}\d{1,3}$/;const phone=/^\+[1-9]\d{7,14}$/;
export async function collect(target){const value=String(target).trim();if(email.test(value))return wrap('email',await investigateEmail(value));if(/^https?:\/\//i.test(value))return wrap('website',await investigateWebsite(value));if(ipv4.test(value))return wrap('ip',await investigateIp(value));if(phone.test(value))return wrap('phone',await investigatePhone(value));if(domain.test(value))return wrap('domain',await investigateDomain(value));if(username.test(value))return wrap('username',await investigateUsername(value));return wrap('person',await investigatePerson(value));}function wrap(kind,result){return {kind,result,evidence:result.evidence||[]};}
