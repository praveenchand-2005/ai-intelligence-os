# Provider adapters

Adapters are isolated from the investigation API and UI. They normalize current upstream responses into evidence records with:

- provider identity
- source URL
- observed/retrieved timestamps
- freshness information when supplied by the source
- normalized summary
- raw upstream payload where permitted
- explicit error/degraded state

The registry is capability-based so the orchestrator can select providers without hard-coding vendor logic into cases or UI. Provider errors are missing evidence, never positive findings.
