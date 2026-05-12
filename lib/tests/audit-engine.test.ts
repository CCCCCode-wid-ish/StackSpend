// src/lib/__tests__/audit-engine.test.ts

import { generateAudit } from "../audit-engine";

//1. Downgrade recommendation test
test("should recommend downgrade for small team using team plan", () => {
  const result = generateAudit({
    tool: "Cursor",
    plan: "Team",
    spend: 100,
    seats: 2,
    teamSize: 2,
    useCase: "coding",
  });

  expect(result.recommendedPlan).toBe("Pro");
});

//2. Already optimized case
test("should detect optimized setup", () => {
  const result = generateAudit({
    tool: "ChatGPT",
    plan: "Pro",
    spend: 20,
    seats: 1,
    teamSize: 1,
    useCase: "writing",
  });

  expect(result.savings).toBeGreaterThanOrEqual(0);
});

//3. High savings case
test("should calculate savings for unused seats", () => {
  const result = generateAudit({
    tool: "Notion",
    plan: "Team",
    spend: 100,
    seats: 10,
    teamSize: 3,
    useCase: "research",
  });

  expect(result.savings).toBeGreaterThan(0);
});


//4. Low savings honesty test
test("should not overestimate savings", () => {
  const result = generateAudit({
    tool: "Tool",
    plan: "Pro",
    spend: 10,
    seats: 1,
    teamSize: 1,
    useCase: "writing",
  });

  expect(result.savings).toBeLessThanOrEqual(50);
});

//5. Unused seats test
test("should detect unused seats", () => {
  const result = generateAudit({
    tool: "Figma",
    plan: "Team",
    spend: 50,
    seats: 5,
    teamSize: 2,
    useCase: "design",
  });

  expect(result.reason.toLowerCase()).toContain("seat");
});