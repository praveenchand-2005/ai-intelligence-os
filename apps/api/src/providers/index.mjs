export { investigateDomain } from './domain.mjs';

export const providerRegistry = Object.freeze([
  { id: 'iana-rdap', capability: 'domain-registration', status: 'live' },
  { id: 'cloudflare-doh', capability: 'dns', status: 'live' },
]);
