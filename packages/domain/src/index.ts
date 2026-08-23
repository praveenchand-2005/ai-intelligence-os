export type EntityType = 'person' | 'organization' | 'email' | 'phone' | 'username' | 'domain' | 'url' | 'ip' | 'social_profile' | 'image' | 'marketplace_listing';

export type SourceKind = 'public_web' | 'licensed_provider' | 'user_supplied' | 'derived';

export interface Entity {
  id: string;
  type: EntityType;
  canonicalLabel: string;
  identifiers: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export interface EvidenceSource {
  id: string;
  kind: SourceKind;
  provider: string;
  url?: string;
  observedAt: string;
  retrievedAt: string;
  freshnessAt?: string;
}

export interface EvidenceItem {
  id: string;
  sourceId: string;
  entityIds: string[];
  observation: string;
  rawReference?: string;
  confidence: number;
  isInference: boolean;
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
  status: 'active' | 'paused' | 'completed' | 'archived';
  entityIds: string[];
  evidenceIds: string[];
  relationshipIds: string[];
  createdAt: string;
  updatedAt: string;
}
