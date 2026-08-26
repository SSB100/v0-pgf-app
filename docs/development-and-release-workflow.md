# Waypoint development and release workflow

Status: active development workflow.

## Purpose

Waypoint uses GitHub Actions as the continuous validation environment and Vercel as the hosted preview and production release environment. The goal is to keep the same technical test coverage while avoiding a Vercel deployment for every intermediate implementation commit.

## Branch roles

### `main`

- Production branch.
- Vercel automatic deployment remains enabled.
- Changes should arrive through reviewed pull requests after the full GitHub review gate passes.

### `waypoint/*`

- Working feature and hardening branches.
- Automatic Vercel deployment is disabled.
- GitHub Actions remains the normal validation path.
- Related file changes should be batched into coherent commits rather than pushed one file at a time.

### `waypoint-preview`

- Deliberate hosted-preview branch.
- Vercel deployment is enabled.
- Move this branch to an already validated feature commit only when hosted or visual verification is useful.
- A preview deployment is optional for documentation-only, backend-only, or otherwise non-visual changes when GitHub validation is sufficient.

## Required GitHub validation

The existing review workflow remains the primary release gate and must continue to run:

1. lint
2. policy and authorization tests
3. TypeScript check
4. production Next.js build
5. dependency security audit

Reducing Vercel deployments does not reduce this test coverage.

The review workflow's existing `cancel-in-progress` concurrency rule remains enabled. This may stop obsolete runs after a newer commit is pushed, but the newest meaningful commit still runs the complete gate above.

## Normal feature workflow

1. Branch from the current production `main`.
2. Audit the relevant code before changing it.
3. Prepare the complete coherent change set before pushing where practical.
4. Commit related files together using a batched Git tree commit.
5. Run the full GitHub review checks.
6. If checks fail, make a focused corrective commit and rerun the full gate.
7. If hosted or visual verification is useful, move `waypoint-preview` to the exact green commit and allow one Vercel preview build.
8. Open the pull request and require the PR-triggered GitHub gate.
9. Merge only from the expected reviewed head SHA.
10. Allow `main` to create the production Vercel deployment.
11. Run post-merge GitHub checks and production/runtime verification when Vercel deployment is available.

## Deployment budget

Typical application feature:

- 1 to 3 GitHub commits
- full GitHub testing for each meaningful pushed commit
- 0 or 1 Vercel preview deployment
- 1 Vercel production deployment

Documentation-only or non-visual change:

- normally 0 preview deployments
- production deployment only if the change is merged to `main`

## When a preview is required

Prefer a deliberate `waypoint-preview` deployment when the change materially affects:

- responsive layout
- navigation
- onboarding or multi-step interaction flows
- forms and client-side state
- browser-specific behaviour
- images or assets
- authenticated page transitions that cannot be adequately validated by source/build tests alone

A preview is usually unnecessary for:

- documentation-only changes
- policy tests
- server-side refactors with unchanged behaviour and strong automated coverage
- governance records
- non-runtime repository housekeeping

## Vercel quota handling

A Vercel quota or deployment-rate-limit failure is not treated as an application build failure when the exact Git commit has independently passed the GitHub production-build gate. It does, however, mean hosted verification and production deployment remain pending until Vercel accepts another deployment.

Do not repeatedly retry deployments while rate limited.

## Commit hygiene

Avoid per-file commits created only because files were written sequentially. Prefer:

- one implementation commit containing the coherent change set
- one corrective commit if CI discovers an issue
- additional commits only where they represent a meaningful review boundary

This keeps Git history readable and prevents deployment systems from interpreting internal editing mechanics as separate releases.

## Safety boundaries

This workflow does not weaken existing requirements around:

- database migrations and production-data changes
- authorization and sharing boundaries
- privacy or research consent
- external-pilot governance gates
- production rollback and incident handling

Those controls remain separate from deployment-frequency optimisation.
