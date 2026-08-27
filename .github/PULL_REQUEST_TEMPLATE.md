## Scope

- What changed:
- What is intentionally unchanged:
- Desktop impact:
- Mobile impact:

## Database impact

- [ ] No database/schema/data change required
- [ ] Database change required and tested on a temporary Neon branch
- [ ] Production database change explicitly approved and verified

## Required checks before merge

- [ ] GitHub `Waypoint review checks` completed successfully
- [ ] Lint passed
- [ ] Policy and authorization tests passed
- [ ] TypeScript check passed
- [ ] Production build passed
- [ ] High-severity dependency audit passed
- [ ] Vercel preview deployment is `READY`
- [ ] PR diff reviewed for unrelated changes
- [ ] Responsive scope checked where relevant

## Production verification

Complete after merge:

- [ ] Exact merge commit identified
- [ ] Vercel production deployment matches merge commit
- [ ] Production deployment is `READY`
- [ ] Affected production route/asset verified where practical

**Do not merge while any required check is failed, skipped, cancelled, pending or still running. A green Vercel preview does not override a failed GitHub check.**
