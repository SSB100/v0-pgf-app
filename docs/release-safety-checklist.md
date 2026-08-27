# Waypoint release safety checklist

Every production change must pass this checklist before merge.

## 1. Scope and impact review

- Confirm the requested product scope before changing code.
- Review the affected desktop and mobile surfaces separately.
- Identify whether the change touches authentication, privacy, consent, professional access, growth/engagement logic, user history, or database schema/data.
- Do not broaden the change beyond the requested scope without an explicit reason.

## 2. Database safety

For code-only changes, confirm that no database migration is required.

For any schema or data change:

- Inspect the live Neon schema read-only first.
- Test the migration on a temporary Neon branch before production.
- Verify forward migration, data preservation/backfill, constraints, and application compatibility.
- Do not modify the production database until the migration has been explicitly approved.
- After an approved production migration, verify the resulting schema and relevant row/data counts before merging dependent application code.

## 3. Pull request validation

Use a feature branch and pull request. Before merge, confirm all of the following are complete and green:

- GitHub `Waypoint review checks`
  - frozen dependency install
  - lint
  - policy and authorization tests
  - TypeScript check
  - production build
  - high-severity dependency audit
- Vercel preview deployment is `READY`.
- Review the PR diff for unrelated or accidental changes.
- For responsive UI changes, explicitly verify that requested desktop/mobile scope has been preserved.
- For user-facing flows, verify affected routes and important empty/existing-data states where practical.

A green Vercel build does not override a failed GitHub check. A failed, cancelled, skipped, or still-running required check blocks merge.

## 4. Merge and production verification

- Merge only after the PR checks above are green.
- Confirm the exact merge commit SHA.
- Confirm Vercel creates a production deployment for that merge commit.
- Do not describe the change as live while the production deployment is queued or building.
- Confirm the production deployment reaches `READY` and the production aliases are attached.
- If production deployment fails or is rate-limited, report that the code is merged but not live and do not trigger unnecessary deployments while investigating.

## 5. Post-deploy check

- Verify the affected production route or asset where possible.
- Check for obvious runtime/deployment errors related to the release.
- Record any known limitation or follow-up instead of treating a partial deployment as complete.

## Release rule

**No Waypoint PR is merged when the GitHub review workflow is red or incomplete, even when the Vercel preview succeeds.**
