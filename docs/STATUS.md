# Engineering status

The production foundation is merged to `main`. The live Render service currently tracks `feat/foundation` for the deployment target.

The current implementation includes a live domain investigation path using IANA RDAP bootstrap discovery and Cloudflare DNS-over-HTTPS. Provider responses are preserved as evidence with retrieval timestamps and source attribution.

The next provider families remain modular: identity/email/phone, business, social, image, security/reputation, and licensed commercial datasets.
