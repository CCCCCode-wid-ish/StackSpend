// types/audit.ts

export type AuditInput = {
  tool: string;
  plan: string;
  spend: number;
  seats: number;
  teamSize: number;
  useCase?: string;
};

export type AuditResult = {
  tool: string;
  currentSpend: number;
  recommendedPlan: string;
  savings: number;
  reason: string;
};