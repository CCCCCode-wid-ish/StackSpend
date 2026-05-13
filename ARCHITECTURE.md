# Architecture

## System Diagram

```mermaid
flowchart TD
    A[User on landing page] --> B[Spend form in Next.js client]
    B --> C[React Hook Form + Zod validation]
    C --> D[Rule-based audit engine]
    D --> E[Results dashboard]
    E --> F[/api/summary route]
    F --> G[Anthropic API if configured]
    F --> H[OpenAI API fallback if configured]
    F --> I[Templated summary fallback]
    D --> J[Supabase audits table]
    E --> K[Lead capture form]
    K --> L[Supabase leads table]
    J --> M[/report/[id] public page]
    M --> N[Open Graph image route]
```

## Data Flow

1. A user enters tool details in the spend form: tool, plan, monthly spend, seats, team size, and use case.
2. React Hook Form and Zod validate the data on the client before submission.
3. The validated payload is passed to the audit engine in `lib/audit-engine.ts`, which returns a deterministic recommendation, savings estimate, and explanation string.
4. The result is shown immediately in the dashboard and saved to local storage so it survives refreshes.
5. The app attempts to persist the audit in Supabase. If the insert succeeds, the result is associated with a public report ID and a shareable URL is shown.
6. The dashboard calls `/api/summary`, which tries Anthropic first, OpenAI second, and a local templated fallback third. This keeps the AI-generated narrative optional while preserving the end-to-end experience during outages or missing keys.
7. When the user submits the lead form, the lead record is written to the `leads` table and linked to the saved audit when an audit ID exists.
8. Shared report pages read sanitized audit data from Supabase and render public pages without exposing the lead's email, company, or role.

## Why This Stack

I chose Next.js because the project needs a landing page, a client-side form, API routes, and dynamic shareable report URLs in one framework. App Router keeps the public report pages and Open Graph image routes in the same project as the marketing UI, which reduces deployment complexity.

TypeScript was the right fit because the app passes audit-shaped objects between UI components, persistence, and the summary API route. Even in a small codebase, the extra type safety reduces the chance of mismatching field names like `currentSpend` and `current_spend`.

Supabase is a pragmatic backend for this kind of MVP because it provides hosted Postgres, a JavaScript client, and row-level security without requiring separate backend infrastructure. That let the project ship persisted audits and lead capture faster than building a custom server.

The audit engine is intentionally rule-based. For this product, explainability is more important than novelty. A finance reviewer should be able to read the rule, understand the savings math, and challenge or update it without reverse-engineering an LLM output.

## Scaling To 10k Audits Per Day

If this had to handle 10,000 audits per day, I would make four structural changes.

First, I would move audit creation and lead capture behind dedicated server-side routes instead of using the browser directly against Supabase. That would make rate limiting, abuse protection, input normalization, and event logging much easier to control.

Second, I would separate public report reads from write traffic. A cached report-read layer or edge rendering strategy would reduce repeated database queries for viral report pages, especially if a report link gets shared widely on X or LinkedIn.

Third, I would add structured pricing tables and versioning for the audit engine. Each audit should record which pricing snapshot and ruleset version produced the recommendation so historical reports remain reproducible after pricing changes.

Fourth, I would add background jobs for transactional email, CRM sync, and AI summary generation. Right now the summary request is synchronous from the dashboard. At higher volume, summary generation should be queued and retried independently so the UI remains fast even if the model provider is slow.
