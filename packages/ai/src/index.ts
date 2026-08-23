import type { Evidence, InvestigationCase, Relationship, Finding } from '../../domain/src';

export type AgentRole = 'orchestrator' | 'identity' | 'business' | 'social' | 'image' | 'security' | 'evidence' | 'contradiction' | 'report';

export interface InvestigationTask {
  id: string;
  caseId: string;
  role: AgentRole;
  objective: string;
  entityIds: string[];
  evidenceIds: string[];
}

export interface AgentContext {
  caseData: InvestigationCase;
  evidence: Evidence[];
  relationships: Relationship[];
}

export interface AgentResult {
  findings: Finding[];
  proposedTasks: InvestigationTask[];
  citations: string[];
}

export interface InvestigationAgent {
  role: AgentRole;
  run(task: InvestigationTask, context: AgentContext): Promise<AgentResult>;
}

export function assertGroundedFinding(finding: Finding): void {
  if (finding.evidenceIds.length === 0) throw new Error(`Finding ${finding.id} is not grounded in evidence`);
  if (finding.confidence < 0 || finding.confidence > 1) throw new Error(`Finding ${finding.id} has invalid confidence`);
}
