import { AuditInput, AuditResult } from "@/types/audit";

export function generateAudit(data: AuditInput): AuditResult {
  let recommendedPlan = data.plan;
  let savings = 0;
  let reasons: string[] = [];

  // RULE 1: Small team using expensive plan
  if (data.teamSize <= 2 && data.plan.toLowerCase().includes("team")) {
    recommendedPlan = "Pro";
    savings += 20;
    reasons.push(
      "Small team may not need Team plan collaboration features."
    );
  }

  // RULE 2: Unused seats
  if (data.seats > data.teamSize) {
    const extraSeats = data.seats - data.teamSize;
    savings += extraSeats * 10;
    reasons.push(`You are paying for ${extraSeats} unused seats.`);
  }

  // RULE 3: High spend + coding use case
  if (data.spend > 50 && data.useCase === "coding") {
    savings += 15;
    reasons.push("You may be overpaying for premium coding tools.");
  }

  // Fallback
  if (reasons.length === 0) {
    reasons.push("Your setup looks optimized. No major savings detected.");
    }
    
    

  return {
    tool: data.tool,
    currentSpend: data.spend,
    recommendedPlan,
    savings,
    reason: reasons.join(" "),
  };
}