export interface ToolInput {
  tool: string;
  plan: string;
  spend: number;
  seats: number;
}

export interface AuditResult {
  tool: string;
  currentSpend: number;
  recommendedPlan: string;
  savings: number;
  reason: string;
}

//This makes code clean and professional.