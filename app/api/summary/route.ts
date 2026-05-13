import { NextResponse } from "next/server";
import { AuditResult } from "@/types/audit";

const SUMMARY_SYSTEM_PROMPT =
  "You write concise B2B finance-friendly audit summaries. Keep the tone honest, specific, and calm. Mention the current spend, the recommended plan, the estimated monthly savings, and whether the user appears well optimized. Keep the output to about 80-120 words. Do not use bullets.";

function buildFallbackSummary(result: AuditResult) {
  const annualSavings = result.annualSavings;
  const topRecommendation = result.tools.find((tool) => tool.savings > 0);

  if (result.totalSavings <= 0 || !topRecommendation) {
    return `Your ${result.stackLabel} appears reasonably well matched to the current level of usage. At ${result.totalCurrentSpend.toFixed(2)} per month, we did not find a defensible downgrade or seat-reduction move that would preserve the same workflow with meaningful savings. The recommendation is to keep the current stack, monitor team growth and usage patterns, and revisit the mix only if collaboration needs or model usage change materially.`;
  }

  return `Your AI stack is currently costing ${result.totalCurrentSpend.toFixed(2)} per month. Based on the audit, the strongest near-term move is ${topRecommendation.recommendedAction.toLowerCase()} on ${topRecommendation.toolLabel}, which contributes to an estimated ${result.totalSavings.toFixed(2)} in monthly savings, or ${annualSavings.toFixed(2)} per year across the stack. The main driver is straightforward: ${topRecommendation.reason} This looks like a practical cost reduction rather than a risky workflow downgrade, so the recommendation is to capture the savings now and review the stack again if usage expands.`;
}

async function getAnthropicSummary(result: AuditResult) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return null;
  }

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL ?? "claude-3-5-sonnet-latest",
      max_tokens: 220,
      system: SUMMARY_SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Audit input:\n${JSON.stringify(result, null, 2)}`,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Anthropic request failed with ${response.status}`);
  }

  const data = (await response.json()) as {
    content?: Array<{ type: string; text?: string }>;
  };

  const text = data.content
    ?.filter((item) => item.type === "text" && item.text)
    .map((item) => item.text)
    .join(" ")
    .trim();

  return text || null;
}

async function getOpenAISummary(result: AuditResult) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return null;
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: process.env.OPENAI_SUMMARY_MODEL ?? "gpt-5.4-mini",
      input: [
        {
          role: "system",
          content: SUMMARY_SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: `Audit input:\n${JSON.stringify(result, null, 2)}`,
        },
      ],
      max_output_tokens: 220,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI request failed with ${response.status}`);
  }

  const data = (await response.json()) as {
    output_text?: string;
  };

  return data.output_text?.trim() || null;
}

export async function POST(req: Request) {
  try {
    const result = (await req.json()) as AuditResult;

    const summary =
      (await getAnthropicSummary(result).catch(() => null)) ||
      (await getOpenAISummary(result).catch(() => null)) ||
      buildFallbackSummary(result);

    return NextResponse.json({ summary });
  } catch {
    return NextResponse.json({
      summary:
        "We identified several opportunities to optimize your AI spend and reduce unnecessary costs.",
    });
  }
}
