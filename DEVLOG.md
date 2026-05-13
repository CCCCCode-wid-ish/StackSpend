## Day 1 - 2026-05-06
**Hours worked:** 1
**What I did:** Read the assignment closely, reviewed examples of SaaS-style audit tools, and started sketching the MVP scope. I also began collecting official pricing pages for the AI products mentioned in the brief.
**What I learned:** This project is not just a coding assignment. The audit logic, documentation quality, and business thinking matter as much as the frontend.
**Blockers / what I'm stuck on:** I was still narrowing the first version of the product and deciding what needed to be in the MVP versus what could wait until after the main flow worked.
**Plan for tomorrow:** Finalize the stack and outline the landing page, form flow, and audit engine responsibilities.

## Day 2 - 2026-05-07
**Hours worked:** 2
**What I did:** Re-read the requirements, tightened the MVP scope, and mapped the user journey from landing page to audit results. I also started thinking about how to keep the audit logic separate from presentation code.
**What I learned:** A believable, honest recommendation engine is more important here than adding flashy but shallow features.
**Blockers / what I'm stuck on:** I spent time deciding how to structure the app so it could support both a polished UI and traceable business logic without becoming messy too early.
**Plan for tomorrow:** Start the Next.js setup and build the first version of the landing page.

## Day 3 - 2026-05-08
**Hours worked:** 4
**What I did:** Set up the project with Next.js, TypeScript, Tailwind, and App Router. Installed core dependencies, created the initial folder structure, and built the first version of the landing page with the hero, features, workflow, preview, CTA, and footer sections.
**What I learned:** Good SaaS UI depends heavily on spacing, hierarchy, and consistency. The product started feeling more credible once the overall page rhythm was in place.
**Blockers / what I'm stuck on:** I lost some time adjusting to the project structure and making the responsive layout feel intentional rather than template-like.
**Plan for tomorrow:** Build the spend form, validation, and local persistence, then begin the audit logic.

## Day 4 - 2026-05-09
**Hours worked:** 4
**What I did:** Built the spend input form using React Hook Form and Zod. Added fields for tool, plan, spend, seats, team size, and use case. Implemented the first version of the audit engine and connected the result back into the UI. Added local storage so the form result survives page reloads.
**What I learned:** Keeping the recommendation logic outside the component tree made the project easier to reason about immediately. I also got more comfortable pairing Zod with React Hook Form.
**Blockers / what I'm stuck on:** I hit hydration warnings and a rendering issue where the audit looked static even though the logic was running. I had to reorganize state and hook usage before the result flow behaved reliably.
**Plan for tomorrow:** Improve the results dashboard and start wiring persistence and shareable reports.

## Day 5 - 2026-05-10
**Hours worked:** 6
**What I did:** Integrated Supabase for audit storage, started building the public report flow with dynamic IDs, and improved the dashboard layout. I also added charting so the current-versus-optimized spend comparison was more visual.
**What I learned:** The moment a result gets a persistent ID and public route, the project starts acting more like a real product than a classroom demo.
**Blockers / what I'm stuck on:** Supabase environment setup and dynamic route handling took longer than I expected. I also still needed to finish lead capture, personalized summaries, and public-share polish.
**Plan for tomorrow:** Complete the lead capture flow and improve the public report and metadata setup.

## Day 6 - 2026-05-11
**Hours worked:** 6
**What I did:** Continued the backend integration work, added lead capture fields, and improved the public report structure. I also added Open Graph metadata support so shared report links would have better previews on social platforms.
**What I learned:** Product credibility in this kind of app comes from the connective tissue between features: persistence, reporting, copy, and routing all matter, not just the form and chart.
**Blockers / what I'm stuck on:** I was still juggling client/server rendering details in Next.js and needed to finish the personalized summary path in a way that degraded gracefully if the model request failed.
**Plan for tomorrow:** Finish the remaining documentation, tighten the summary flow, and make sure the project reads like a coherent product from end to end.

## Day 7 - 2026-05-12


**Hours worked:** 5.5

**What I did:**  
Finalized the product documentation, reviewed the end-to-end user flow, and focused on making the AI Spend Audit project coherent from both an engineering and product perspective. Completed the final phase of the project by integrating screenshots into the README, improving documentation structure, and deploying the application.

Deployed the application and verified the full user flow: input form → audit generation → results dashboard → shareable report → lead capture flow. Ensured all features are stable and working correctly in the production environment.

Also revisited the recommendation logic and output framing to ensure the system remains honest and consistent across both high-savings and low-savings scenarios, improving trustworthiness of the product.

Organized project assets and documentation to ensure the repository is clean, structured, and easy to evaluate.

---

**What I learned:**  
Shipping a stronger project often comes from improving clarity and consistency rather than adding new features. The combination of product framing, documentation, and implementation quality significantly improves how the project is perceived.

Learned the importance of deployment as part of the software development lifecycle and how it completes the product experience.

Understood how documentation, screenshots, and UI clarity directly impact the perception of a SaaS product.

Also learned the importance of validating the full user flow after deployment to ensure consistency between development and production environments.

---

**Blockers / what I'm stuck on:**  
The main challenge was maintaining consistency across code, documentation, and product positioning so that all parts of the project communicate the same story. No technical blockers were encountered.