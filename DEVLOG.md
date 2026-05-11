
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
Built the audit results dashboard for the AI Spend Audit tool. Added a savings hero section displaying monthly and yearly savings in a visually prominent format. Created a recommendation breakdown card showing the current spend, recommended plan, estimated savings, and reasoning behind the optimization suggestions.

Integrated Recharts to start building data visualizations comparing current AI spend vs optimized spend. Improved the overall dashboard UI with a modern SaaS-style dark theme using gradients, spacing, and card-based layouts.

Connected the audit engine output with the frontend results dashboard so audit results now render dynamically after form submission. Also worked on improving state persistence using localStorage.

**What I learned:**  
Learned how to structure a reusable dashboard component in React and how to pass audit result data cleanly between components. Understood how chart libraries like Recharts simplify data visualization for SaaS dashboards.

Also learned more about JSX structure and debugging component nesting issues in Next.js.

**Blockers / what I'm stuck on:**  
Faced hydration warnings and JSX structure issues due to incorrect component nesting and browser-injected attributes. Spent time debugging render issues and fixing component hierarchy.

Still need to complete:
- AI-generated personalized summary
- Better chart polish
- Multi-tool support
- Shareable public audit URLs

**Plan for tomorrow:**  
Integrate AI-generated summaries using an LLM API with fallback handling. Improve dashboard polish further and begin backend setup for lead capture and database storage.



