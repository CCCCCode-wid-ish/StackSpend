# Tests

Automated tests currently focus on the audit engine, which is the highest-risk business logic in the MVP.

## How to run

```bash
npm run test
```

## Test inventory

- `lib/tests/audit-engine.test.ts` - recommends a downgrade when a very small team is on a team-tier plan.
- `lib/tests/audit-engine.test.ts` - checks the "already optimized" path so the engine can return a low- or no-savings result honestly.
- `lib/tests/audit-engine.test.ts` - verifies savings are produced when the input indicates unused seats.
- `lib/tests/audit-engine.test.ts` - guards against exaggerated savings in a low-spend case.
- `lib/tests/audit-engine.test.ts` - confirms the recommendation reason mentions seat waste when extra seats exist.

## CI

GitHub Actions runs:

```bash
npm run lint
npm run test
```
