# Live source registry

## Domain intelligence

### IANA RDAP bootstrap
- Bootstrap registry: `https://data.iana.org/rdap/dns.json`
- Purpose: discover authoritative RDAP base URLs for domain TLDs.
- The provider resolves the current bootstrap registry at investigation time rather than shipping a stale TLD map.
- Evidence must retain retrieval time and provider URL.

### Cloudflare DNS-over-HTTPS
- Endpoint: `https://cloudflare-dns.com/dns-query`
- JSON request media type: `application/dns-json`
- Current implementation collects A, AAAA, MX, NS and TXT records.
- DNS answers retain TTL and the complete upstream response as raw evidence.

Provider contracts intentionally isolate these integrations so additional licensed/public providers can be added without changing the investigation model.
