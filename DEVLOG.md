

**Note:** Initial setup and planning phase was done before GitHub tracking started. Regular commits began from Day 3 onwards when active development started.

## Day 1 — 2026-05-06

**Hours worked:** 1

**What I did:**  
Read the assignment requirements carefully and explored examples of SaaS audit dashboards. Researched AI tool pricing pages and started planning the project structure.

**What I learned:**  
The assignment is heavily product-focused and requires balancing engineering with business thinking.

**Blockers / what I'm stuck on:**  
Spent time understanding the project scope and deciding how to structure the MVP without overengineering it. Also faced some initial confusion around organizing the Next.js App Router structure and deciding how to separate UI components from audit logic cleanly.

**Plan for tomorrow:**  
Finalize the tech stack and begin frontend setup.


## Day 2 — 2026-05-07

**Hours worked:** 2

**What I did:**  
Reviewed project requirements again and planned the MVP scope. Created rough ideas for the landing page and audit engine flow.

**What I learned:**  
A clean UX and believable audit reasoning are more important than adding unnecessary features.

**Blockers / what I'm stuck on:**  
Spent additional time understanding how to structure the audit engine logic cleanly and deciding how to separate reusable UI components from business logic. Also faced some confusion around state persistence and organizing the Next.js App Router architecture efficiently.


**Plan for tomorrow:**  
Start the Next.js project setup and begin building the landing page.


## Day 3 — 2026-05-08

**Hours worked:** 4

**What I did:**  
Started the project setup using Next.js with TypeScript, Tailwind CSS, and App Router. Installed the core dependencies required for the project including Framer Motion, React Hook Form, Zod, Recharts, and Lucide icons.



Created the initial scalable folder structure for components, utilities, tests, and audit logic. Built the first version of the landing page with a modern SaaS-inspired dark UI. Implemented the navbar, hero section, features section, workflow explanation section, savings preview cards, CTA section, and footer.

Focused heavily on spacing, gradients, responsiveness, and overall visual polish to make the project feel closer to a real startup product instead of a college project.

Made multiple meaningful git commits throughout the process instead of batching everything into one large commit.

---

**What I learned:**  
I learned that SaaS landing pages rely more on layout consistency, spacing, and visual hierarchy than on complicated UI elements. I also understood the importance of incremental commits and maintaining a clean project structure early in development.

---

**Blockers / what I'm stuck on:**  
Initially got confused because the project was created without a `src` directory, but later realized the structure still works normally with Next.js. Spent additional time organizing components and improving responsive behavior across screen sizes.

---

**Plan for tomorrow:**  
Build the spend input form with tool selection, pricing inputs, team size, and localStorage persistence. Begin implementing the audit engine logic and pricing data structure.

## Day 4  — 2026-05-09

**Hours worked:** 4

**What I did:**  
Started building the core functionality of the AI Spend Audit product. Created the spend input form using React Hook Form and Zod validation. Added fields for tool name, plan, monthly spend, seats, team size, and primary use case. Implemented validation rules to prevent invalid inputs such as negative spend or zero seats.

Added localStorage persistence so form and audit data remain available after page refresh. Built the audit engine inside `src/lib/audit-engine.ts` with modular business logic rules for identifying overspending scenarios such as small teams using Team plans, unused seats, and high spend on coding tools. Connected the audit engine to the form submission flow and displayed audit results dynamically in the UI.

Also improved the overall SaaS-style UI using Tailwind CSS with dark theme styling, gradients, responsive layouts, and result cards.

**What I learned:**  
Learned how to separate business logic from UI components for cleaner architecture. Improved understanding of form validation using Zod with React Hook Form. Also learned how state management and localStorage persistence work together in client-side React applications. Understood the importance of explainable financial reasoning instead of random recommendations when building audit systems.

**Blockers / what I'm stuck on:**  
Initially faced hydration warnings and issues where the form submission appeared static because the audit result state was not being rendered correctly. Also had confusion regarding where to place audit logic versus UI code. Resolved the issue by moving React hooks into the component properly and separating the audit engine into its own file.

**Plan for tomorrow**
Improve the audit result dashboard UI with better visual hierarchy and clearer savings breakdown. Start implementing multiple tool support and prepare the structure for backend lead capture and database integration.



## Day 5 — 2026-05-10

**Hours worked:** 6

**What I did:**  
Continued improving the AI Spend Audit dashboard and began implementing backend-oriented product features to make the application behave more like a real SaaS platform.

Worked on integrating Supabase for audit report storage and started preparing dynamic public report generation using unique report IDs. Structured the project to support shareable audit URLs and database persistence for audit data.

Improved the frontend dashboard experience by refining the savings hero section, recommendation cards, and analytics layout. Enhanced the chart visualization setup using Recharts to compare current spend versus optimized spend more clearly.

Added localStorage persistence improvements so audit data remains available even after refreshing the page. Continued modularizing the application by separating form handling, dashboard rendering, audit logic, and backend integration into reusable components.

Also worked on integrating dynamic report routing structure inside the Next.js App Router architecture and preparing the foundation for lead capture functionality.


**What I learned:**  
Learned how frontend dashboards connect with backend services using Supabase and how SaaS applications structure public report systems using dynamic routes.

Improved understanding of state persistence, reusable component architecture, and database-driven workflows in Next.js applications. Also learned more about managing client-side rendering behavior and structuring scalable React applications.

Understood how analytics dashboards combine visualization, business logic, persistence, and routing to create a more production-like user experience.

**Blockers / what I'm stuck on:**  
Encountered issues with Supabase environment variable configuration and dynamic route setup while integrating backend functionality.

Also spent time debugging hydration warnings, JSX nesting issues, and client/server rendering mismatches in Next.js.

Still need to complete:

AI-generated personalized summaries
Public report page rendering
Lead capture database integration
Open Graph metadata for report previews
Multi-tool audit support
Better dashboard responsiveness and chart polish

Still need to complete:
- AI-generated personalized summary
- Better chart polish
- Multi-tool support
- Shareable public audit URLs

**Plan for tomorrow:**  
Complete Supabase database integration and dynamic public report pages. Implement lead capture forms with email/company persistence and continue improving dashboard polish, AI summaries, and overall SaaS-style user experience.



## Day 6 — 2026-05-11

**Hours worked:** 6

**What I did:**  
Continued improving the AI Spend Audit dashboard and began implementing backend-oriented product features to make the application behave more like a real SaaS platform.

Worked on integrating Supabase for audit report storage and started preparing dynamic public report generation using unique report IDs. Structured the project to support shareable audit URLs and database persistence for audit data.

Improved the frontend dashboard experience by refining the savings hero section, recommendation cards, and analytics layout. Enhanced the chart visualization setup using Recharts to compare current spend versus optimized spend more clearly.

Added localStorage persistence improvements so audit data remains available even after refreshing the page. Continued modularizing the application by separating form handling, dashboard rendering, audit logic, and backend integration into reusable components.

Also implemented lead capture functionality by adding a form to collect user email, company, and role after generating audit results. This prepares the product for future CRM and conversion tracking features.

Additionally, added Open Graph metadata setup for dynamic report pages to improve link previews when sharing audit reports on social platforms.

---


**What I learned:**  

Learned how frontend dashboards connect with backend services using Supabase and how SaaS applications structure public report systems using dynamic routes.

Improved understanding of state persistence, reusable component architecture, and database-driven workflows in Next.js applications. Also learned more about managing client-side rendering behavior and structuring scalable React applications.

Understood how analytics dashboards combine visualization, business logic, persistence, and routing to create a more production-like user experience.

---

**Blockers / what I'm stuck on:**  
Encountered issues with Supabase environment variable configuration and dynamic route setup while integrating backend functionality.

Also spent time debugging hydration warnings, JSX nesting issues, and client/server rendering mismatches in Next.js.

Still need to complete:
- AI-generated personalized summaries
- Public report page rendering
- Lead capture database integration (Supabase leads table)
- Open Graph metadata dynamic testing and optimization
- Multi-tool audit support
- Better dashboard responsiveness and chart polish

---

**Plan for tomorrow:**  
Complete Supabase database integration and dynamic public report pages. Implement lead capture form backend connection to store email, company, and role in the leads table. Continue improving dashboard polish, AI summaries, and overall SaaS-style user experience.

## Day 7 — 2026-05-12

**Hours worked:** 5–6

**What I did:**  
Completed the final phase of the AI Spend Audit project by finishing all entrepreneurial and product documentation files including GTM strategy, pricing assumptions, metrics tracking, landing page copy, user behavior assumptions, and final product reflection.

Refined the project from a technical build into a complete SaaS-style product by focusing on product clarity, positioning, and user-facing value. Ensured the recommendation system outputs are explainable and trustworthy, with structured savings insights and honest recommendations.

Finalized the end-to-end user flow: input form → audit engine → results dashboard → shareable report → lead capture flow. Verified that the application behaves like a production-ready SaaS tool rather than a demo project.

---

**What I learned:**  
Learned how real SaaS products are not just about implementation but also about product storytelling, positioning, and clarity of communication.

Understood how documentation like GTM, pricing logic, and metrics help define product direction and make a project feel complete and industry-level.

Also learned the importance of simplicity in AI-driven systems—especially how honest outputs (including “no improvement needed”) increase trust.

---

**Blockers / what I'm stuck on:**  
No major blockers. Final challenge was ensuring consistency across all documentation files and aligning technical output with product-level thinking.