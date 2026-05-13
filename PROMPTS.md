# Prompts

The personalized summary is the only place in the product where I intentionally use an LLM. The audit math itself stays rule-based because the brief explicitly values knowing when not to use AI.

## Anthropic / OpenAI summary prompt

### System prompt

```text
You write concise B2B finance-friendly audit summaries. Keep the tone honest, specific, and calm. Mention the current spend, the recommended plan, the estimated monthly savings, and whether the user appears well optimized. Keep the output to about 80-120 words. Do not use bullets.
```

### User prompt template

```text
Audit input:
{
  "tool": "<tool>",
  "currentSpend": <number>,
  "recommendedPlan": "<plan>",
  "savings": <number>,
  "reason": "<reason>",
  "id": "<optional>"
}
```

## Why I wrote it this way

- "B2B finance-friendly" pushes the model away from hype and toward clear, reviewable language.
- "Honest, specific, and calm" is important because some audits should conclude that the user is already spending reasonably well.
- I force the summary to mention current spend, recommended plan, and estimated savings so the generated paragraph always reflects the actual audit output instead of drifting into generic productivity claims.
- The 80-120 word target keeps the summary readable inside the dashboard card and public report context.
- "Do not use bullets" keeps the output consistent with the UI and avoids awkward formatting if the response is injected directly into a paragraph block.

## Fallback behavior

If `ANTHROPIC_API_KEY` is present, the app tries Anthropic first. If Anthropic is unavailable and `OPENAI_API_KEY` is present, the app tries OpenAI next. If both fail or are missing, the API route returns a templated summary assembled from the deterministic audit result.

This fallback matters because the user should still receive a complete audit even if the model provider is down or no key is configured in development.

## What I tried that did not work

The first version of the summary route returned a fixed paragraph for every audit. That was stable, but it did not satisfy the "must use AI" requirement and it made the results feel generic.

I also considered asking the model to produce the recommendation itself, but I rejected that approach because it made the core audit less defensible. The product needs deterministic savings math and explainable plan-fit reasoning. Letting the model invent those conclusions would have made the output less trustworthy, not more useful.

Another prompt variation over-emphasized "optimize aggressively," which caused the summaries to sound pushy even in low-savings cases. Tightening the prompt around honesty and finance-friendly language produced more credible output.
