import type { EntityType, EvidenceItem, EvidenceSource } from '../../domain/src';

export interface ProviderHealth {
  provider: string;
  available: boolean;
  checkedAt: string;
  latencyMs?: number;
  rateLimited?: boolean;
  message?: string;
}

export interface ProviderContext {
  caseId: string;
  signal: AbortSignal;
}

export interface InvestigationProvider {
  id: string;
  name: string;
  supportedEntityTypes: readonly EntityType[];
  health(): Promise<ProviderHealth>;
  investigate(entity: { type: EntityType; value: string }, context: ProviderContext): Promise<{
    sources: EvidenceSource[];
    evidence: EvidenceItem[];
  }>;
}
