export type UseCase = "coding" | "writing" | "data" | "research" | "mixed";

export type ToolKey =
  | "cursor"
  | "github-copilot"
  | "claude"
  | "chatgpt"
  | "anthropic-api"
  | "openai-api"
  | "gemini"
  | "windsurf";

export type ToolEntryInput = {
  tool: ToolKey;
  plan: string;
  spend: number;
  seats: number;
};

export type AuditInput = {
  teamSize: number;
  useCase: UseCase;
  tools: ToolEntryInput[];
};

export type ToolRecommendation = {
  tool: ToolKey;
  toolLabel: string;
  currentPlan: string;
  currentSpend: number;
  seats: number;
  recommendedAction: string;
  recommendedPlan: string;
  optimizedSpend: number;
  savings: number;
  reason: string;
};

export type AuditResult = {
  id?: string;
  stackLabel: string;
  teamSize: number;
  useCase: UseCase;
  totalCurrentSpend: number;
  totalOptimizedSpend: number;
  totalSavings: number;
  annualSavings: number;
  headline: string;
  summaryReason: string;
  credexRecommended: boolean;
  tools: ToolRecommendation[];
};

export type PublicAuditPayload = {
  stackLabel: string;
  teamSize: number;
  useCase: UseCase;
  totalCurrentSpend: number;
  totalOptimizedSpend: number;
  totalSavings: number;
  annualSavings: number;
  headline: string;
  summaryReason: string;
  credexRecommended: boolean;
  tools: ToolRecommendation[];
};

export type AuditRecord = {
  id: string;
  tool: string;
  current_spend: number;
  recommended_plan: string;
  savings: number;
  reason: string;
};

export type LeadPayload = {
  email: string;
  company?: string;
  role?: string;
  teamSize?: number;
  honeypot?: string;
};
