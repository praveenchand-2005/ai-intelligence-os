import type { EvidenceItem, InvestigationCase, Relationship } from '../../domain/src';

export interface InvestigationTask {
  id: string;
  caseId: string;
  objective: string;
  entityIds: string[];
}

export interface GroundedFinding {
  statement: string;
  evidenceIds: string[];
  confidence: number;
  classification: 'observation' | 'correlation' | 'inference';
}

export interface AgentContext {
  caseData: InvestigationCase;
  evidence: EvidenceItem[];
  relationships: Relationship[];
}

export interface InvestigationAgent {
  id: string;
  role: string;
  plan(context: AgentContext): Promise<InvestigationTask[]>;
  analyze(context: AgentContext, task: InvestigationTask): Promise<GroundedFinding[]>;
}
