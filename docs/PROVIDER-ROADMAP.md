# Provider roadmap

The provider layer is capability-oriented. Live providers are added only after their current documentation, access model, rate limits, attribution requirements and data freshness characteristics are verified.

## Live
- Domain RDAP discovery via IANA bootstrap
- DNS A/AAAA/MX/NS/TXT via Cloudflare DoH

## Next
- IP registration/RDAP
- URL/HTTP metadata
- TLS/certificate inspection
- Public business registries and company sources
- Public social/profile sources where terms permit
- Image/OCR providers
- Security/reputation feeds
- Licensed commercial enrichment

Every provider must expose provenance and must fail closed rather than fabricate a result.
