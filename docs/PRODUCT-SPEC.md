# AI Intelligence OS — Product Specification

## Reference target

The platform targets the breadth of a modern investigation/intelligence workspace, using WebVetted only as a capability reference. Product identity, branding, source code, copy, and visual implementation are original.

## Core modules

### Universal Investigation
- Person/name
- Email
- Phone
- Username
- Domain/URL
- IP/network identifiers
- Social profile
- Image
- Company/business

### People Intelligence
- Identity resolution
- Alias and username correlation
- Email/phone pivots
- Public profile discovery
- Social profile analysis
- Public-web footprint
- Breach exposure where legally available
- Timeline and confidence scoring

### Business & Domain Intelligence
- Domain/RDAP/WHOIS
- DNS and infrastructure
- TLS/certificate history
- Hosting/CDN/ASN
- Technology stack
- Traffic and market signals
- Reputation/reviews
- Security signals
- Public corporate information
- News/legal/trademark signals where available

### Image & Digital Intelligence
- Reverse-image provider adapters
- Image metadata/EXIF
- OCR
- QR extraction and destination analysis
- Image authenticity/manipulation signals

### Investigation Workbench
- Cases
- Entity graph
- Relationships
- Evidence explorer
- Timeline
- Source comparison
- Contradictions
- Confidence and risk

### AI Investigation
- Orchestrator
- Identity agent
- Business agent
- Social agent
- Image agent
- Security/reputation agent
- Evidence analyst
- Contradiction analyst
- Report agent
- Grounded case Q&A

### WatchDog
- Target monitoring
- Change detection
- New evidence detection
- AI change summaries
- Alerts

### Reports
- Investigation dossier
- Executive summary
- Technical report
- Evidence pack
- JSON/CSV export
- PDF export

## Non-negotiable data principles

- Source-backed findings only.
- Every material finding stores provenance and observation time.
- AI conclusions must distinguish observation from inference.
- Confidence must be evidence-derived and explainable.
- Conflicting evidence is retained and surfaced.
- Provider integrations are adapters, not hard-coded application logic.
- Provider health, freshness, rate limits, and failure states are observable.
- Current provider documentation and current live data must be verified during implementation.

## Safety and legal boundaries

The system is designed for lawful, authorized, public or properly licensed data investigation. It must not expose private credentials, bypass access controls, facilitate stalking, harassment, doxxing, or unauthorized account access.
