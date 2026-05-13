# Reflection

## 1. The hardest bug I hit this week, and how I debugged it

The hardest bug this week was a frustrating mix of hydration warnings and seemingly "dead" audit results after form submission. The audit engine was returning data, but the UI was acting as if nothing had happened, and on refresh I would sometimes see mismatches between what the server rendered and what the browser expected. My first hypothesis was that the issue came from the charting library or animation components because those often behave differently in server-rendered React apps. I temporarily removed sections of the dashboard and verified that the bug still existed, which ruled that out.

My second hypothesis was that local storage initialization was interfering with the first render. I traced the state flow and found that result state, local storage reads, and conditional rendering were all happening close together, which made the component harder to reason about. I simplified the result flow step by step: first confirm that the submit handler fired, then confirm that `generateAudit` returned the expected object, then confirm that state updated, then confirm that the render branch actually depended on that state. That process made it obvious that the problem was not the audit math itself but where and when client-only state was being read and rendered.

What finally worked was separating concerns more clearly. I kept the rule logic in `lib/audit-engine.ts`, moved the client state handling into the component in a cleaner way, and made the local storage reads defensive. That reduced the mismatch risk and made it much easier to inspect each stage of the flow. The main lesson was that debugging React problems gets much easier once state transitions are small and observable.

## 2. A decision I reversed mid-week, and what made me reverse it

The biggest decision I reversed was treating this like a mostly visual dashboard project first and a credibility project second. Early in the week I spent a lot of energy on gradients, polished cards, and the marketing shell because I wanted the app to feel startup-ready. That work was not wasted, but by Day 3 and Day 4 I realized the assignment would be judged much more harshly on whether the audit felt defensible and whether the written materials made the product believable. A beautiful page with weak logic would not survive scrutiny.

That realization changed how I prioritized the rest of the work. Instead of continuing to add surface-level sections or chase more decorative polish, I shifted attention to the audit flow, Supabase persistence, shareable report URLs, lead capture, and documentation. I also stopped thinking of the markdown files as "extra deliverables" and started treating them as part of the product itself. For this application, the GTM, pricing sources, metrics, and reflection files are not accessories. They are evidence that I can reason about a product beyond the frontend.

I am glad I reversed that instinct mid-week because it made the final project more grounded. The app still needed to look good because screenshots matter, but once I reframed design as support for trust rather than decoration, my choices became more disciplined. The result is still an MVP, but it reads more like a real product and less like a generic dashboard demo.

## 3. What I would build in week 2 if I had it

If I had a full second week, I would focus first on making the audit engine significantly more rigorous and more configurable. Right now the engine is deterministic and explainable, which is good, but it is still a relatively compact ruleset. In week 2 I would introduce a structured pricing registry with versioning, more explicit vendor-by-vendor break-even logic, and separate heuristics for subscription tools versus API-direct tools. I would also support multiple tools in a single audit instead of the current one-tool-at-a-time flow so the product reflects how real teams actually buy AI software.

My second priority would be backend hardening. I would move writes behind server-side endpoints, add rate limiting and a honeypot or captcha, and add transactional email through a provider like Resend. I would also store a redacted public version of each report separately from the private lead record so the privacy model is more explicit and easier to audit.

Third, I would improve the reporting layer. That includes a cleaner share page, stronger Open Graph visuals, a proper "already optimized" state, and a benchmark mode that compares spend per developer against a simple cohort. I would also add PDF export because that would make the product much easier to forward internally between a founder, finance lead, and engineering manager.

Finally, I would spend time on instrumentation and launch readiness. I would define the main event funnel, test the signup and share flows end to end, and write a short launch thread that turns the product into something with a real distribution angle instead of just a finished assignment.

## 4. How I used AI tools, what I did not trust them with, and one time AI was wrong

I used AI tools mostly as accelerators for exploration, writing support, and implementation scaffolding, not as a substitute for judgment. I used ChatGPT and Claude to brainstorm UI copy, compare ways to structure the audit engine, sanity-check phrasing for product documents, and pressure-test explanations that needed to sound credible to a reviewer. I also used AI to help think through component organization and to generate alternative approaches when I got stuck on rendering or architecture decisions.

What I did not trust AI with was the final business logic, the submission requirements, or anything that needed precise traceability. For example, I did not want an LLM inventing pricing numbers, making up legal-sounding claims about vendor plans, or telling me a section was "done" when it did not actually match the brief. I also did not trust AI to decide whether a recommendation was financially defensible without me checking the reasoning. In this assignment, the difference between a plausible sentence and a valid recommendation matters a lot.

One specific time AI was wrong was when it suggested a more generic dashboard structure and implied that a broad "AI savings" message would be enough for the recommendation layer. That was exactly the kind of vague reasoning the prompt warns against. I caught it because the output sounded polished but not defensible. The fix was to use AI for language support and fallback summaries while keeping the audit math rule-based and reviewable by a human. That ended up being a much healthier division of labor.

## 5. Self-rating on discipline, code quality, design sense, problem-solving, and entrepreneurial thinking

**Discipline: 7/10.** I showed up consistently across the week, kept momentum, and pushed the project through multiple layers of work instead of stopping at the landing page. The reason I did not rate this higher is that I could have started the required markdown deliverables earlier and reduced the end-of-week documentation crunch.

**Code quality: 6.5/10.** I made good decisions around separation of concerns, TypeScript usage, and keeping the audit engine isolated from UI components. At the same time, the project is still an MVP and there are places where the code could be made more robust, especially around input modeling, server boundaries, and deeper test coverage.

**Design sense: 7.5/10.** I think the app looks modern, polished, and presentable enough to screenshot, which matters for this project. I paid attention to spacing, hierarchy, and visual rhythm. The reason it is not higher is that there is still room for a more distinctive brand system and stronger result-page storytelling.

**Problem-solving: 8/10.** I ran into real friction around hydration, state flow, backend wiring, and requirement interpretation, and I worked through those issues without getting stuck in one place for too long. I was strongest when I broke a messy problem into smaller observable parts.

**Entrepreneurial thinking: 7/10.** I improved a lot during the project by treating the app as a product rather than just a coding exercise. I still think this is the area with the most upside for me because the best version of this project would push even harder on user insight, distribution, and pricing strategy from the start.
