# Phase 4I: Application recovery rehearsal

## Status

**PASS - clean non-production application rebuild from trusted Git source.**

This record captures the Waypoint application recovery rehearsal completed during Phase 4I. It demonstrates the current GitHub-to-Vercel rebuild path without changing production traffic.

It does not claim a Vercel contractual SLA, cross-provider disaster recovery, recovery of lost secret values, or external-pilot approval.

## Rehearsal scope

The recovery question tested was:

> If Waypoint needs to rebuild the application from an approved source commit, can the connected deployment platform produce a fresh isolated deployment that starts successfully and serves the application?

The test deliberately used a preview deployment rather than changing production.

## Source state

- Repository: `SSB100/v0-pgf-app`
- Branch: `waypoint/phase-4i-operational-resilience-supplier-assurance`
- Trusted source commit tested: `4a2c2f164a130e4cf7cd63d8da76a5c7bfea5c8a`
- Deployment provider: Vercel
- Vercel project: `v0-pgf-app`
- Deployment type: preview

The tested commit contained Phase 4I documentation only and was descended directly from the current Phase 4H production `main` state at the time of the rehearsal.

## Recovery action

The Git-connected Vercel project automatically built a fresh preview deployment from the Phase 4I source commit.

Observed deployment evidence:

- Deployment ID: `dpl_HJJ82oVByNTDumDm9a5fi3ou6txn`
- Git commit: `4a2c2f164a130e4cf7cd63d8da76a5c7bfea5c8a`
- Deployment state: `READY`
- Environment: preview
- Observed server-function region: `iad1`
- Waypoint homepage fetch: HTTP `200`
- Homepage rendered successfully through the connected Vercel fetch path
- No build failure was reported for the deployment

This provides concrete evidence that the application can be reconstructed by Vercel from trusted Git history without depending on a developer workstation.

## Result

**PASS.**

The current GitHub-to-Vercel rebuild path successfully produced a fresh isolated Waypoint deployment from a known source commit and served the application.

## What this rehearsal proves

It provides evidence for:

- recoverability of the application source from Git history;
- automatic creation of a fresh Vercel build from a trusted commit;
- successful Next.js build/start under the connected Vercel project;
- successful serving of the Waypoint homepage from the rebuilt deployment;
- ability to test deployment recovery without changing production traffic;
- independence from a single local developer machine for routine application reconstruction.

## What this rehearsal does not prove

It does **not** establish:

- recovery if both GitHub and Vercel are unavailable;
- recovery of secret values if the Vercel account/configuration is lost;
- rollback-to-older-production-deployment entitlements under the current plan;
- a guaranteed deployment recovery time;
- availability of all user flows merely because the homepage returned HTTP 200;
- contractual data-processing, support, residency or incident-response assurances;
- recovery from loss of the Neon database;
- an approved fallback hosting provider.

## Current application recovery strategy

For the current MVP hardening environment, the primary application recovery path is:

1. identify an approved known-good Git commit;
2. confirm the commit and dependency lockfile are intact;
3. produce an isolated deployment from that source;
4. run automated review checks and basic application verification;
5. validate required environment-variable names/configuration are present without exposing secret values;
6. only then promote/redeploy approved code to production;
7. verify production health after the release.

This is safer than assuming an older platform deployment can always be rolled back under every Vercel plan.

## Environment and secret recovery boundary

Source code is recoverable from Git, but secret **values** are intentionally not stored in the repository.

Before an external pilot, Waypoint must define how authorised operational owners recover or rotate production secrets if the hosting account or configuration is lost. The procedure should cover at least database credentials, signing/session secrets, and any future email or integration credentials.

The recovery document must describe names, owners, rotation/recovery steps and access controls without copying live secret values into GitHub.

## CI/change-control improvement made during Phase 4I

The shared GitHub review workflow was strengthened so that Waypoint branches and pull requests to `main` run:

- dependency installation from the lockfile;
- linting;
- policy/authorization tests;
- TypeScript type checking;
- a production build check using CI-only placeholder configuration;
- a high-severity dependency audit.

This improves the reliability of the Git-based recovery path because a recovered source commit is checked before merge rather than relying solely on a successful platform build.

## Remaining application recovery gates before external pilot

- [x] Clean isolated deployment from trusted Git source completed.
- [x] Rebuilt homepage served successfully.
- [x] Shared CI workflow expanded to lint, tests, typecheck, build and high-severity dependency audit.
- [ ] Define controlled recovery/rotation of production secret values.
- [ ] Decide whether the approved Vercel plan provides adequate contractual and rollback controls.
- [ ] Decide whether a fallback hosting provider/runbook is required.
- [ ] Approve a production application RTO appropriate to the intended pilot.

## Conclusion

Waypoint's current application rebuild path is operationally demonstrated for the MVP: trusted Git source can produce a fresh working Vercel deployment in isolation. Remaining items are primarily account/secret recovery, supplier-plan assurance, fallback architecture and formal service objectives rather than a missing application rebuild mechanism.
