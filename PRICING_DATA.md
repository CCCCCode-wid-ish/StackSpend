# Pricing Data

All numbers below were checked against official vendor pricing pages on 2026-05-13. Enterprise plans that do not publish self-serve pricing are marked as custom or contact sales. For API-direct tools, I list the model rates used as reference bands for audit comparisons.

## Cursor

- Hobby: $0/month - https://cursor.com/pricing - verified 2026-05-13
- Pro: $20/month - https://cursor.com/pricing - verified 2026-05-13
- Teams / Business: $40/user/month - https://cursor.com/pricing - verified 2026-05-13
- Enterprise: custom pricing - https://cursor.com/pricing - verified 2026-05-13

## GitHub Copilot

- Individual / Pro: $10/user/month - https://github.com/features/copilot/plans - verified 2026-05-13
- Business: $19/user/month - https://docs.github.com/copilot/concepts/billing/billing-for-enterprises - verified 2026-05-13
- Enterprise: $39/user/month - https://docs.github.com/copilot/concepts/billing/billing-for-enterprises - verified 2026-05-13

## Claude

- Free: $0/month - https://claude.com/pricing - verified 2026-05-13
- Pro: $20/month - https://support.claude.com/en/articles/8325606-what-is-claude-pro - verified 2026-05-13
- Max: from $100/month - https://www.claude.com/pricing/max - verified 2026-05-13
- Team standard seat: $20/user/month billed annually, $25/user/month billed monthly - https://claude.com/pricing - verified 2026-05-13
- Team premium seat: $100/user/month billed annually, $125/user/month billed monthly - https://claude.com/pricing - verified 2026-05-13
- Enterprise: seat price plus usage at API rates / contact sales - https://claude.com/pricing - verified 2026-05-13

## Anthropic API direct

- Claude Sonnet 4.6: $3 input / 1M tokens, $15 output / 1M tokens - https://platform.claude.com/docs/en/about-claude/pricing - verified 2026-05-13
- Claude Haiku 4.5: $1 input / 1M tokens, $5 output / 1M tokens - https://platform.claude.com/docs/en/about-claude/pricing - verified 2026-05-13
- Claude Opus 4.7: $5 input / 1M tokens, $25 output / 1M tokens - https://platform.claude.com/docs/en/about-claude/pricing - verified 2026-05-13
- Web search tool: $10 / 1K searches - https://claude.com/pricing - verified 2026-05-13

## ChatGPT

- Plus: $20/month - https://chatgpt.com/pricing/ - verified 2026-05-13
- Business ChatGPT and Codex: $20/user/month billed annually - https://openai.com/business/chatgpt-pricing/ - verified 2026-05-13
- Business ChatGPT and Codex: current self-serve business plan that replaces legacy Team naming in OpenAI's public pricing - https://chatgpt.com/pricing/ - verified 2026-05-13
- Enterprise: custom pricing - https://chatgpt.com/pricing/ - verified 2026-05-13

## OpenAI API direct

- GPT-5.5: $5 input / 1M tokens, $30 output / 1M tokens - https://openai.com/api/pricing/ - verified 2026-05-13
- GPT-5.4: $2.50 input / 1M tokens, $15 output / 1M tokens - https://openai.com/api/pricing/ - verified 2026-05-13
- GPT-5.4 mini: $0.75 input / 1M tokens, $4.50 output / 1M tokens - https://openai.com/api/pricing/ - verified 2026-05-13
- Web search tool: $10 / 1K calls - https://openai.com/api/pricing/ - verified 2026-05-13

## Gemini

- Google AI Pro: $19.99/month - https://one.google.com/about/plans?hl=en_in - verified 2026-05-13
- Google AI Ultra: $249.99/month - https://blog.google/products-and-platforms/products/google-one/google-ai-ultra/ - verified 2026-05-13
- Gemini API direct, Gemini 2.5 Pro: $1.25 input / 1M tokens and $10 output / 1M tokens for prompts up to 200k tokens - https://ai.google.dev/gemini-api/docs/pricing - verified 2026-05-13
- Gemini API direct, Gemini 2.5 Pro long prompts: $2.50 input / 1M tokens and $15 output / 1M tokens for prompts above 200k tokens - https://ai.google.dev/gemini-api/docs/pricing - verified 2026-05-13

## Windsurf

- Free: $0/month - https://windsurf.com/pricing - verified 2026-05-13
- Pro: $20/month - https://windsurf.com/pricing - verified 2026-05-13
- Max: $200/month - https://windsurf.com/pricing - verified 2026-05-13
- Teams: $40/user/month - https://windsurf.com/pricing - verified 2026-05-13
- Enterprise: custom pricing - https://windsurf.com/pricing - verified 2026-05-13

## Notes For The Audit Engine

- OpenAI and Anthropic do not bundle API usage into ChatGPT Plus or Claude Pro. API direct spend should be treated as a separate line item from chat subscriptions.
- OpenAI's public naming now emphasizes Business rather than Team. In the audit UX and docs, I treat this as the current equivalent of the older Team category from the prompt so the recommendation logic stays understandable to reviewers.
- Claude Team pricing has changed over time, including separate standard and premium seat options. If the product later supports Claude Team explicitly in the form, it should ask which seat type the customer is on.
