export type EntityType = 'person' | 'organization' | 'domain' | 'email' | 'phone' | 'username' | 'social_profile' | 'image' | 'url' | 'ip' | 'marketplace_listing' | 'unknown';
export type FindingKind = 'observation' | 'correlation' | 'inference';
export type ConfidenceLevel = 'very_low' | 'low' | 'medium' | 'high' | 'very_high';
export type CaseStatus = 'active' | 'paused' | 'completed' | 'archived';

export interface Entity {
  id: string;
  type: EntityType;
  canonicalValue: string;
  identifiers: Record<string, string>;
  attributes: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface EvidenceSource {
  id: string;
  kind: 'public_web' | 'licensed_provider' | 'user_supplied' | 'derived';
  provider: string;
  url?: string;
  observedAt: string;
  retrievedAt: string;
  freshnessAt?: string;
  attribution: string;
}

export interface Evidence {
  id: string;
  sourceId: string;
  entityIds: string[];
  title: string;
  observation: string;
  rawReference?: string;
  contentHash?: string;
  collectedAt: string;
}

export interface Finding {
  id: string;
  caseId: string;
  kind: FindingKind;
  statement: string;
  evidenceIds: string[];
  confidence: number;
  confidenceLevel: ConfidenceLevel;
  createdAt: string;
}

export interface Relationship {
  id: string;
  fromEntityId: string;
  toEntityId: string;
  type: string;
  confidence: number;
  evidenceIds: string[];
}

export interface InvestigationCase {
  id: string;
  title: string;
  status: CaseStatus;
  entityIds: string[];
  evidenceIds: string[];
  findingIds: string[];
  relationshipIds: string[];
  createdAt: string;
  updatedAt: string;
}
