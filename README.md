# StackSpend

StackSpend is an AI spend audit app for founders, engineering leads, and finance operators who want a fast read on whether their AI tooling mix is over-provisioned. The app captures current tool spend, runs a rule-based audit, generates a personalized summary, stores leads in Supabase, and creates shareable public result pages with Open Graph previews.

The current build is a Next.js + TypeScript MVP focused on a clear end-to-end flow: input spend, generate an audit, save the result, capture a lead, and share the report. The codebase is structured to keep the audit logic explainable and separate from the UI so pricing heuristics can be expanded without rewriting the product shell.

## Repo

GitHub: https://github.com/CCCCCode-wid-ish/StackSpend

## Live Demo


Replace this with your real deployed URL before submission:
`TODO: add deployed URL`

## Screenshots 


# Screenshots

## Dashboard Overview

![Dashboard](assets/image%201%20of%20stackspend.png)

---

## AI Spend Analytics

![Analytics](assets/image%202%20stackspend.png)

---

## Recommendations Panel

![Recommendations](assets/image%203%20stackspend.png)

---

## Report View

![Report](assets/image%204%20stackspend.png)



1. `TODO: add landing page screenshot`
2. `TODO: add audit form + results screenshot`
3. `TODO: add shareable report screenshot`
4. Optional Loom or YouTube recording: `TODO: add 30-second walkthrough link`

## What It Does

- Collects AI tool inputs including tool, plan, monthly spend, seat count, team size, and primary use case.
- Persists the generated audit in local storage so the result survives reloads.
- Runs a rule-based audit engine to recommend a lower-cost plan when the current setup looks mismatched.
- Generates a personalized summary with Anthropic when configured, OpenAI as fallback, and a deterministic template when no model key is available.
- Stores audits and leads in Supabase and creates shareable `/report/[id]` pages.
- Generates Open Graph and Twitter preview images for shared reports.

## Quick Start

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables

Create a local `.env.local` with the variables below:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
ANTHROPIC_API_KEY=optional_for_ai_summary
ANTHROPIC_MODEL=optional_defaults_to_claude-3-5-sonnet-latest
OPENAI_API_KEY=optional_fallback_for_ai_summary
OPENAI_SUMMARY_MODEL=optional_defaults_to_gpt-5.4-mini
```


## Decisions

1. I used Next.js App Router with TypeScript because the project needs a mix of marketing pages, form handling, API routes, and dynamic public report URLs in one codebase.
2. I kept the audit engine rule-based instead of AI-generated because pricing recommendations need to be explainable to a finance-oriented reviewer.
3. I used Supabase instead of a custom backend to move faster on persistence, row-level policies, and public report retrieval.
4. I made the personalized summary the only AI-powered part because the brief explicitly rewards using AI only where it improves communication rather than math.
5. I stored the latest audit in local storage so the UX survives refreshes without forcing users to create an account first.


