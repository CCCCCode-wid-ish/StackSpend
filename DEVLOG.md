## Day 1 — 2026-05-08

**Hours worked:** 5

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

## Day 2  — 2026-05-09

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
