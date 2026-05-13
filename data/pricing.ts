import { ToolKey, UseCase } from "@/types/audit";

export type PlanConfig = {
  label: string;
  monthlyPrice: number | null;
  billing: "per-user" | "flat" | "custom";
  capabilities: UseCase[];
  notes?: string;
};

export type ToolConfig = {
  key: ToolKey;
  label: string;
  category: "subscription" | "api";
  defaultUseCases: UseCase[];
  plans: PlanConfig[];
  cheaperAlternatives: Partial<Record<UseCase, { tool: ToolKey; plan: string }>>;
};

export const TOOL_CONFIG: Record<ToolKey, ToolConfig> = {
  cursor: {
    key: "cursor",
    label: "Cursor",
    category: "subscription",
    defaultUseCases: ["coding", "mixed"],
    plans: [
      { label: "Hobby", monthlyPrice: 0, billing: "flat", capabilities: ["coding"] },
      { label: "Pro", monthlyPrice: 20, billing: "per-user", capabilities: ["coding", "mixed"] },
      { label: "Business", monthlyPrice: 40, billing: "per-user", capabilities: ["coding", "mixed"] },
      { label: "Enterprise", monthlyPrice: null, billing: "custom", capabilities: ["coding", "mixed"] },
    ],
    cheaperAlternatives: {
      coding: { tool: "github-copilot", plan: "Individual" },
      mixed: { tool: "chatgpt", plan: "Plus" },
    },
  },
  "github-copilot": {
    key: "github-copilot",
    label: "GitHub Copilot",
    category: "subscription",
    defaultUseCases: ["coding"],
    plans: [
      { label: "Individual", monthlyPrice: 10, billing: "per-user", capabilities: ["coding"] },
      { label: "Business", monthlyPrice: 19, billing: "per-user", capabilities: ["coding", "mixed"] },
      { label: "Enterprise", monthlyPrice: 39, billing: "per-user", capabilities: ["coding", "mixed"] },
    ],
    cheaperAlternatives: {
      coding: { tool: "cursor", plan: "Pro" },
    },
  },
  claude: {
    key: "claude",
    label: "Claude",
    category: "subscription",
    defaultUseCases: ["writing", "research", "mixed"],
    plans: [
      { label: "Free", monthlyPrice: 0, billing: "flat", capabilities: ["writing", "research"] },
      { label: "Pro", monthlyPrice: 20, billing: "per-user", capabilities: ["writing", "research", "mixed"] },
      { label: "Max", monthlyPrice: 100, billing: "per-user", capabilities: ["writing", "research", "mixed"] },
      { label: "Team", monthlyPrice: 25, billing: "per-user", capabilities: ["writing", "research", "mixed"] },
      { label: "Enterprise", monthlyPrice: null, billing: "custom", capabilities: ["writing", "research", "mixed"] },
      { label: "API direct", monthlyPrice: null, billing: "custom", capabilities: ["writing", "research", "mixed"] },
    ],
    cheaperAlternatives: {
      writing: { tool: "chatgpt", plan: "Plus" },
      research: { tool: "gemini", plan: "Pro" },
      mixed: { tool: "chatgpt", plan: "Plus" },
    },
  },
  chatgpt: {
    key: "chatgpt",
    label: "ChatGPT",
    category: "subscription",
    defaultUseCases: ["writing", "data", "research", "mixed"],
    plans: [
      { label: "Plus", monthlyPrice: 20, billing: "per-user", capabilities: ["writing", "data", "research", "mixed"] },
      { label: "Team", monthlyPrice: 25, billing: "per-user", capabilities: ["writing", "data", "research", "mixed"] },
      { label: "Enterprise", monthlyPrice: null, billing: "custom", capabilities: ["writing", "data", "research", "mixed"] },
      { label: "API direct", monthlyPrice: null, billing: "custom", capabilities: ["writing", "data", "research", "mixed"] },
    ],
    cheaperAlternatives: {
      writing: { tool: "claude", plan: "Pro" },
      research: { tool: "gemini", plan: "Pro" },
      mixed: { tool: "gemini", plan: "Pro" },
    },
  },
  "anthropic-api": {
    key: "anthropic-api",
    label: "Anthropic API Direct",
    category: "api",
    defaultUseCases: ["writing", "research", "mixed"],
    plans: [
      { label: "API direct", monthlyPrice: null, billing: "custom", capabilities: ["writing", "research", "mixed"], notes: "Usage-based token billing" },
    ],
    cheaperAlternatives: {
      writing: { tool: "chatgpt", plan: "Plus" },
      research: { tool: "gemini", plan: "Pro" },
    },
  },
  "openai-api": {
    key: "openai-api",
    label: "OpenAI API Direct",
    category: "api",
    defaultUseCases: ["coding", "writing", "data", "research", "mixed"],
    plans: [
      { label: "API direct", monthlyPrice: null, billing: "custom", capabilities: ["coding", "writing", "data", "research", "mixed"], notes: "Usage-based token billing" },
    ],
    cheaperAlternatives: {
      coding: { tool: "github-copilot", plan: "Individual" },
      writing: { tool: "chatgpt", plan: "Plus" },
      data: { tool: "gemini", plan: "Pro" },
    },
  },
  gemini: {
    key: "gemini",
    label: "Gemini",
    category: "subscription",
    defaultUseCases: ["writing", "data", "research", "mixed"],
    plans: [
      { label: "Pro", monthlyPrice: 20, billing: "per-user", capabilities: ["writing", "data", "research", "mixed"] },
      { label: "Ultra", monthlyPrice: 250, billing: "per-user", capabilities: ["writing", "data", "research", "mixed"] },
      { label: "API direct", monthlyPrice: null, billing: "custom", capabilities: ["writing", "data", "research", "mixed"] },
    ],
    cheaperAlternatives: {
      research: { tool: "chatgpt", plan: "Plus" },
      mixed: { tool: "claude", plan: "Pro" },
    },
  },
  windsurf: {
    key: "windsurf",
    label: "Windsurf",
    category: "subscription",
    defaultUseCases: ["coding", "mixed"],
    plans: [
      { label: "Free", monthlyPrice: 0, billing: "flat", capabilities: ["coding"] },
      { label: "Pro", monthlyPrice: 20, billing: "per-user", capabilities: ["coding", "mixed"] },
      { label: "Teams", monthlyPrice: 40, billing: "per-user", capabilities: ["coding", "mixed"] },
      { label: "Enterprise", monthlyPrice: null, billing: "custom", capabilities: ["coding", "mixed"] },
    ],
    cheaperAlternatives: {
      coding: { tool: "github-copilot", plan: "Individual" },
      mixed: { tool: "chatgpt", plan: "Plus" },
    },
  },
};

export const SUPPORTED_TOOLS = Object.values(TOOL_CONFIG);

export function getPlanConfig(tool: ToolKey, plan: string) {
  return TOOL_CONFIG[tool].plans.find((candidate) => candidate.label === plan);
}

export function getCheaperAlternative(tool: ToolKey, useCase: UseCase) {
  const mapped = TOOL_CONFIG[tool].cheaperAlternatives[useCase];

  if (!mapped) {
    return null;
  }

  const plan = getPlanConfig(mapped.tool, mapped.plan);

  if (!plan || plan.monthlyPrice === null) {
    return null;
  }

  return {
    tool: mapped.tool,
    toolLabel: TOOL_CONFIG[mapped.tool].label,
    plan: plan.label,
    monthlyPrice: plan.monthlyPrice,
    billing: plan.billing,
  };
}
