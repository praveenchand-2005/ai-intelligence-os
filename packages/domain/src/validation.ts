import type { EvidenceItem, FindingKind } from './index';

export function validateGroundedFinding(input: { kind: FindingKind; evidenceIds: string[] }, evidence: EvidenceItem[]): void {
  const known = new Set(evidence.map(e => e.id));
  if (input.evidenceIds.length === 0) throw new Error('Every finding must reference evidence');
  if (input.evidenceIds.some(id => !known.has(id))) throw new Error('Finding references unknown evidence');
  if (input.kind === 'inference' && input.evidenceIds.length < 1) throw new Error('Inference requires evidence');
}
