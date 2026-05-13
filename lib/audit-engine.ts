import { getCheaperAlternative, getPlanConfig, TOOL_CONFIG } from "@/data/pricing";
import { AuditInput, AuditResult, ToolEntryInput, ToolRecommendation } from "@/types/audit";

type Candidate = {
  priority: number;
  action: string;
  plan: string;
  optimizedSpend: number;
  reason: string;
};

function roundMoney(value: number) {
  return Math.max(0, Math.round(value * 100) / 100);
}

function getCurrentRetailSpend(toolInput: ToolEntryInput, activeSeats: number) {
  const planConfig = getPlanConfig(toolInput.tool, toolInput.plan);

  if (!planConfig || planConfig.monthlyPrice === null) {
    return null;
  }

  if (planConfig.billing === "flat") {
    return planConfig.monthlyPrice;
  }

  return planConfig.monthlyPrice * Math.max(1, activeSeats);
}

function chooseBestCandidate(
  toolInput: ToolEntryInput,
  teamSize: number,
  useCase: AuditInput["useCase"]
): ToolRecommendation {
  const toolConfig = TOOL_CONFIG[toolInput.tool];
  const planConfig = getPlanConfig(toolInput.tool, toolInput.plan);
  const activeSeats = Math.max(1, Math.min(toolInput.seats, teamSize));
  const extraSeats = Math.max(0, toolInput.seats - teamSize);
  const candidates: Candidate[] = [];
  const currentSpend = roundMoney(toolInput.spend);

  if (planConfig?.monthlyPrice !== null && planConfig?.billing === "per-user" && extraSeats > 0) {
    const optimizedSpend = roundMoney(currentSpend - extraSeats * planConfig.monthlyPrice);

    candidates.push({
      priority: 1,
      action: "Remove unused seats",
      plan: toolInput.plan,
      optimizedSpend,
      reason: `${toolConfig.label} is billed per seat on this plan, and ${extraSeats} of ${toolInput.seats} seats appear unused relative to the ${teamSize}-person team size.`,
    });
  }

  const cheaperSameVendorPlans = toolConfig.plans.filter((candidatePlan) => {
    if (candidatePlan.label === toolInput.plan || candidatePlan.monthlyPrice === null) {
      return false;
    }

    if (!candidatePlan.capabilities.includes(useCase) && !candidatePlan.capabilities.includes("mixed")) {
      return false;
    }

    const currentRetail = getCurrentRetailSpend(toolInput, toolInput.seats);
    const candidateRetail =
      candidatePlan.billing === "flat"
        ? candidatePlan.monthlyPrice
        : candidatePlan.monthlyPrice * activeSeats;

    return currentRetail === null || candidateRetail < currentRetail;
  });

  const currentPlanLabel = toolInput.plan.toLowerCase();
  const isOverProvisionedPlan =
    teamSize <= 2 &&
    (currentPlanLabel.includes("team") ||
      currentPlanLabel.includes("business") ||
      currentPlanLabel.includes("enterprise") ||
      currentPlanLabel.includes("max") ||
      currentPlanLabel.includes("ultra"));

  if (cheaperSameVendorPlans.length > 0 && isOverProvisionedPlan) {
    const sameVendorPaidPlans = cheaperSameVendorPlans.filter(
      (candidatePlan) => (candidatePlan.monthlyPrice ?? 0) > 0
    );
    const cheapestPlan = (sameVendorPaidPlans.length > 0
      ? sameVendorPaidPlans
      : cheaperSameVendorPlans
    ).sort((a, b) => {
      const aPrice = a.monthlyPrice ?? Number.MAX_SAFE_INTEGER;
      const bPrice = b.monthlyPrice ?? Number.MAX_SAFE_INTEGER;
      return aPrice - bPrice;
    })[0];

    const optimizedSpend =
      cheapestPlan.billing === "flat"
        ? cheapestPlan.monthlyPrice ?? currentSpend
        : (cheapestPlan.monthlyPrice ?? 0) * activeSeats;

    candidates.push({
      priority: 2,
      action: `Downgrade within ${toolConfig.label}`,
      plan: cheapestPlan.label,
      optimizedSpend: roundMoney(optimizedSpend),
      reason: `${toolConfig.label} ${toolInput.plan} looks oversized for a ${teamSize}-person team. ${cheapestPlan.label} preserves the same primary use case with a lower monthly cost.`,
    });
  }

  const alternative = getCheaperAlternative(toolInput.tool, useCase);

  if (alternative) {
    const alternativeSpend =
      alternative.billing === "flat"
        ? alternative.monthlyPrice
        : alternative.monthlyPrice * activeSeats;
    const savings = currentSpend - alternativeSpend;

    if (savings >= 15 && savings / Math.max(currentSpend, 1) >= 0.2) {
      candidates.push({
        priority: 4,
        action: `Switch to ${alternative.toolLabel}`,
        plan: alternative.plan,
        optimizedSpend: roundMoney(alternativeSpend),
        reason: `${alternative.toolLabel} ${alternative.plan} covers a similar ${useCase} workflow at materially lower monthly cost than the current ${toolConfig.label} setup.`,
      });
    }
  }

  if (toolConfig.category === "api" && currentSpend >= 500) {
    candidates.push({
      priority: 3,
      action: "Move API spend through credits",
      plan: toolInput.plan,
      optimizedSpend: roundMoney(currentSpend * 0.88),
      reason: `At ${currentSpend.toFixed(2)} per month of API usage, this spend is large enough to justify committed credits or negotiated pricing instead of pure on-demand retail rates.`,
    });
  }

  const bestCandidate = candidates
    .filter((candidate) => candidate.optimizedSpend < currentSpend)
    .sort((a, b) => {
      if (a.priority !== b.priority) {
        return a.priority - b.priority;
      }

      return a.optimizedSpend - b.optimizedSpend;
    })[0];

  if (!bestCandidate) {
    return {
      tool: toolInput.tool,
      toolLabel: toolConfig.label,
      currentPlan: toolInput.plan,
      currentSpend,
      seats: toolInput.seats,
      recommendedAction: "Keep current setup",
      recommendedPlan: toolInput.plan,
      optimizedSpend: currentSpend,
      savings: 0,
      reason: `This ${toolConfig.label} setup does not show a clear, defensible savings move based on the provided spend, seats, and ${useCase} use case.`,
    };
  }

  return {
    tool: toolInput.tool,
    toolLabel: toolConfig.label,
    currentPlan: toolInput.plan,
    currentSpend,
    seats: toolInput.seats,
    recommendedAction: bestCandidate.action,
    recommendedPlan: bestCandidate.plan,
    optimizedSpend: roundMoney(bestCandidate.optimizedSpend),
    savings: roundMoney(currentSpend - bestCandidate.optimizedSpend),
    reason: bestCandidate.reason,
  };
}

export function generateAudit(input: AuditInput): AuditResult {
  const recommendations = input.tools.map((toolInput) =>
    chooseBestCandidate(toolInput, input.teamSize, input.useCase)
  );

  const totalCurrentSpend = roundMoney(
    recommendations.reduce((sum, recommendation) => sum + recommendation.currentSpend, 0)
  );
  const totalOptimizedSpend = roundMoney(
    recommendations.reduce((sum, recommendation) => sum + recommendation.optimizedSpend, 0)
  );
  const totalSavings = roundMoney(totalCurrentSpend - totalOptimizedSpend);
  const annualSavings = roundMoney(totalSavings * 12);
  const stackLabel = `${recommendations.length}-tool stack`;
  const credexRecommended = totalSavings > 500;

  const headline =
    totalSavings > 500
      ? `You have a meaningful ${totalSavings.toFixed(2)}/month AI savings opportunity.`
      : totalSavings < 100
        ? "Your AI spend is already reasonably well optimized."
        : `You can likely reduce AI spend by ${totalSavings.toFixed(2)}/month.`;

  const summaryReason =
    totalSavings < 100
      ? "Most tools in the stack already look proportionate to the reported team size and primary workflow, so this audit does not manufacture savings."
      : recommendations
          .filter((recommendation) => recommendation.savings > 0)
          .slice(0, 2)
          .map((recommendation) => `${recommendation.toolLabel}: ${recommendation.reason}`)
          .join(" ");

  return {
    stackLabel,
    teamSize: input.teamSize,
    useCase: input.useCase,
    totalCurrentSpend,
    totalOptimizedSpend,
    totalSavings,
    annualSavings,
    headline,
    summaryReason,
    credexRecommended,
    tools: recommendations,
  };
}
