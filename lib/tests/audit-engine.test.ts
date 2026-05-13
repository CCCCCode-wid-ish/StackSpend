import { generateAudit } from "../audit-engine";

test("recommends same-vendor downgrade for a tiny team on a team-tier plan", () => {
  const result = generateAudit({
    teamSize: 2,
    useCase: "coding",
    tools: [
      {
        tool: "cursor",
        plan: "Business",
        spend: 80,
        seats: 2,
      },
    ],
  });

  expect(result.tools[0].recommendedPlan).toBe("Pro");
  expect(result.totalSavings).toBeGreaterThan(0);
});

test("detects an already optimized low-spend setup honestly", () => {
  const result = generateAudit({
    teamSize: 1,
    useCase: "writing",
    tools: [
      {
        tool: "chatgpt",
        plan: "Plus",
        spend: 20,
        seats: 1,
      },
    ],
  });

  expect(result.totalSavings).toBe(0);
  expect(result.headline.toLowerCase()).toContain("optimized");
});

test("calculates savings for unused seats", () => {
  const result = generateAudit({
    teamSize: 3,
    useCase: "coding",
    tools: [
      {
        tool: "github-copilot",
        plan: "Business",
        spend: 95,
        seats: 5,
      },
    ],
  });

  expect(result.tools[0].recommendedAction).toBe("Remove unused seats");
  expect(result.totalSavings).toBeGreaterThan(0);
});

test("recommends credits for high API spend", () => {
  const result = generateAudit({
    teamSize: 6,
    useCase: "research",
    tools: [
      {
        tool: "openai-api",
        plan: "API direct",
        spend: 5000,
        seats: 1,
      },
    ],
  });

  expect(result.tools[0].recommendedAction).toContain("credits");
  expect(result.credexRecommended).toBe(true);
});

test("aggregates multi-tool stack savings", () => {
  const result = generateAudit({
    teamSize: 2,
    useCase: "mixed",
    tools: [
      {
        tool: "chatgpt",
        plan: "Team",
        spend: 50,
        seats: 2,
      },
      {
        tool: "cursor",
        plan: "Business",
        spend: 80,
        seats: 2,
      },
    ],
  });

  expect(result.tools).toHaveLength(2);
  expect(result.totalCurrentSpend).toBe(130);
  expect(result.totalSavings).toBeGreaterThan(0);
});
