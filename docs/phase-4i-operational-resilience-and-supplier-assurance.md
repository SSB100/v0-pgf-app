# Phase 4I: Operational resilience and supplier assurance

## Status

**Technical close-out ready for merge. External pilot gates remain open.**

Phase 4I has established and tested the recovery controls that can be safely exercised in the current MVP environment, strengthened the release checks that support recovery from trusted source, and recorded the supplier/recovery facts that must drive the next infrastructure decisions.

This status does **not** mean Waypoint is approved for an external health-service or research pilot. Contractual supplier assurance, a genuine historical point-in-time recovery rehearsal, production-secret recovery, formal RPO/RTO approval, independent assurance, Māori data-governance approval, and the incident/continuity tabletop remain explicit pilot gates.

## Phase purpose

Waypoint depends on external infrastructure for application hosting and sensitive-data storage. Security controls alone are not sufficient if the product cannot recover from accidental data loss, deployment failure, supplier outage, credential loss, or a material provider incident.

Phase 4I therefore tests and records four questions:

1. Can Waypoint recover database state after an operator or application error?
2. Can the application be rebuilt from a trusted source without relying on one developer workstation?
3. Are critical supplier limitations visible and governed rather than assumed away?
4. Are recovery controls demonstrated with evidence rather than described only on paper?

## Current critical services

| Service | Current role | Verified Phase 4I state | Remaining pilot decision |
| --- | --- | --- | --- |
| Neon PostgreSQL | Primary application database | Production in AWS `us-east-1`; `free_v3`; 6-hour history window; isolated branch reset rehearsal passed | Historical PITR/snapshot rehearsal, longer-history/backup decision, contractual/subprocessor/support review, residency approval |
| Vercel | Next.js hosting and server execution | Hobby plan; trusted Git commit rebuilt successfully as isolated `READY` preview; homepage returned HTTP 200; observed functions in `iad1` | Approved production plan, supplier/DPA/location/support review, secret recovery and fallback decision |
| GitHub | Source control and deployment source | Source recovery path demonstrated through Vercel; review workflow strengthened for Waypoint branches and PRs | `main` branch protection/ruleset must be enabled through repository settings and owner recovery/MFA arrangements confirmed |

## Recovery objectives

Waypoint must approve formal Recovery Point Objective (RPO) and Recovery Time Objective (RTO) values for the intended pilot before making service-level recovery claims.

Until then:

- do not advertise zero data loss;
- do not advertise a guaranteed recovery time;
- do not treat supplier marketing claims as Waypoint SLAs;
- prioritise recovery of authentication, consent, sharing, safety and wellbeing data over presentation state;
- verify restored state using both schema and representative data checks;
- treat the current six-hour continuous Neon history window as a real limitation, not a target RPO.

---

# Recovery rehearsal 01 - Neon isolated branch reset

## Environment

- Project: `PGFapp`
- Project ID: `wild-wildflower-37967772`
- Production branch: `main`
- Production branch ID: `br-super-wildflower-a4bnoizt`
- Rehearsal branch: `phase-4i-recovery-rehearsal-2026-08-26`
- Rehearsal branch ID: `br-withered-dew-a4c46fnm`
- Database: `neondb`

Production was not intentionally modified during the rehearsal.

## Baseline

| Object | Baseline rows |
| --- | ---: |
| users | 3 |
| daily_checkins | 1 |
| journey_completions | 1 |
| client_professional_links | 1 |
| sharing_grants | 4 |
| consent_events | 2 |
| skills_practice | 0 |
| user_demographics | 0 |
| security_incidents | 0 |

## Fault and recovery

A synthetic table named `phase4i_recovery_rehearsal_marker` containing one test-only record was created only on the isolated branch. Neon schema comparison confirmed this deliberate divergence from production.

The rehearsal branch was then reset from its production parent. Neon reported success and recorded `last_reset_at` as `2026-08-26T00:10:07Z`.

After reset:

- the synthetic table no longer existed;
- every baseline count matched its original value;
- the schema diff against production was empty;
- the rehearsal branch returned to `ready` state.

## Result

**PASS - isolated branch reset/recovery.**

This proves branch isolation, deliberate divergence, successful reset to the parent state, schema parity restoration and selected data-count restoration. It does **not** prove historical PITR, complete row-by-row restoration, off-provider recovery, or a guaranteed RPO/RTO.

Detailed historical-recovery readiness is recorded in `docs/phase-4i-neon-point-in-time-recovery-readiness.md`.

---

# Waypoint-specific Neon recovery position

Connected Neon metadata verified during Phase 4I:

- subscription: `free_v3`;
- PostgreSQL: version 17;
- region: AWS `us-east-1`;
- configured history retention: `21600` seconds = **6 hours**;
- production branch protection: not enabled at review;
- manual snapshots are documented as available on Free, with one manual snapshot limit;
- scheduled backup snapshots require an appropriate paid plan.

Current Neon documentation confirms timestamp/LSN recovery within the configured history window and multi-step snapshot restoration into an isolated branch.

A genuine historical PITR/snapshot rehearsal was **not** executed because the connected Neon actions available in this development session do not expose timestamp restore or snapshot create/restore. Production was not altered merely to simulate evidence.

Therefore:

- [x] current Neon plan recorded;
- [x] current history window recorded;
- [x] provider PITR/snapshot capability reviewed;
- [x] isolated branch reset rehearsal completed;
- [ ] historical point-in-time preview/recovery rehearsal completed;
- [ ] manual snapshot restored into an isolated branch and verified;
- [ ] longer-history/scheduled-backup position approved for pilot;
- [ ] independent provider-loss backup position approved.

---

# Recovery rehearsal 02 - application rebuild from trusted Git source

A fresh Vercel preview deployment was produced from the Phase 4I branch without changing production traffic.

Verified evidence:

- source commit: `4a2c2f164a130e4cf7cd63d8da76a5c7bfea5c8a`;
- Vercel deployment: `dpl_HJJ82oVByNTDumDm9a5fi3ou6txn`;
- environment: preview;
- deployment state: `READY`;
- observed server-function region: `iad1`;
- homepage fetch returned HTTP `200` and rendered Waypoint successfully.

## Result

**PASS - clean non-production application rebuild from trusted Git source.**

This demonstrates that Waypoint can be reconstructed from repository history through the connected Vercel project without requiring a single developer workstation. It does not prove recovery if both GitHub and Vercel are unavailable or recovery of lost production secret values.

Detailed evidence is recorded in `docs/phase-4i-application-recovery-rehearsal.md`.

---

# Release and source-recovery controls

The GitHub review workflow was strengthened during Phase 4I.

For Waypoint branches and pull requests to `main`, the workflow now runs:

- lockfile-based dependency installation;
- linting;
- policy and authorisation tests;
- TypeScript type checking;
- production build verification using CI-only placeholder configuration;
- high-severity dependency audit.

This makes Git history a stronger recovery source because recovered code is subjected to repeatable checks before merge.

`main` branch protection is still not enabled and the available connected GitHub actions in this development session do not expose a branch-protection write operation. This is therefore an explicit repository-setting gate, not falsely marked complete.

---

# Supplier assurance position

## Neon

### Verified operational facts

- Holds the primary sensitive-data database.
- Production region is AWS `us-east-1`, United States.
- Current subscription is `free_v3`.
- Current continuous history retention is six hours.
- Isolated branch reset recovery has been tested successfully.
- Provider documentation supports PITR and snapshots, subject to plan/configuration.

### Still required before external pilot

- contractual/DPA review for the actual account arrangement;
- relevant subprocessor review;
- backup/snapshot storage and support-access jurisdiction verification;
- incident-notification/support escalation verification;
- deletion/termination behaviour verification;
- pilot decision on US hosting and Māori data-governance requirements;
- recovery architecture decision covering longer history, scheduled snapshots and/or independent backup.

## Vercel

### Verified operational facts

- Hosts the Next.js application/server execution.
- Current team plan is Hobby.
- Git-connected preview rebuild from a trusted commit has passed.
- The tested preview ran server functions in `iad1`.

### Still required before external pilot

- approve the hosting plan appropriate to processor terms, support and rollback requirements;
- verify applicable data-processing terms for the approved plan;
- verify execution/log/support-access locations and relevant subprocessors;
- verify incident-notification and deletion obligations;
- define authorised recovery/rotation of production secret values;
- decide whether a fallback hosting runbook/provider is required.

## GitHub

GitHub remains a source-code and development-history service, not an authorised store for production personal information.

Before external pilot:

- enable appropriate `main` branch protection/ruleset through repository settings;
- require the review workflow as an appropriate merge check;
- maintain MFA/repository-owner recovery arrangements;
- preserve secret hygiene and prohibit production user data in issues/PRs/source files;
- decide whether an independent source export/backup is required.

---

# Incident and continuity exercise

Phase 4G already requires a security/privacy tabletop. Phase 4I should use one combined exercise rather than duplicate governance work.

The exercise should include:

1. suspected compromise or destructive data change;
2. containment/session/access revocation;
3. recovery-source decision: current state, historical state or backup;
4. consent/sharing/audit integrity checks after recovery;
5. supplier escalation;
6. Privacy Act serious-harm assessment;
7. Māori data-governance escalation where Māori data is affected;
8. user/professional communication decision;
9. post-incident review and remediation ownership.

This remains a pre-pilot operating exercise rather than a code-release blocker.

---

# Phase 4I technical close-out

Completed in this release:

- [x] Isolated Neon branch recovery/reset rehearsal completed and verified.
- [x] Actual Neon plan and six-hour history window recorded.
- [x] Current provider PITR/snapshot capabilities and plan limitations recorded.
- [x] Clean application rebuild from trusted Git source completed in an isolated Vercel preview.
- [x] Rebuilt homepage served successfully.
- [x] Shared CI/review workflow expanded to lint, tests, typecheck, build and high-severity dependency audit.
- [x] Operational recovery limitations are documented without overclaiming supplier or pilot readiness.

Remaining **external/manual pilot gates**, to be tracked after this technical merge:

- [ ] Historical PITR and/or snapshot restore rehearsal through a Neon interface that exposes the capability.
- [ ] Longer-history/scheduled-backup and independent-backup decision.
- [ ] Production-secret recovery/rotation procedure.
- [ ] Neon contractual/subprocessor/support-access review.
- [ ] Vercel plan/contract/subprocessor/location review.
- [ ] GitHub `main` protection/ruleset enabled and required checks configured.
- [ ] Combined incident/continuity tabletop exercise.
- [ ] Named operational owners assigned for recovery and supplier escalation.
- [ ] Formal RPO/RTO approved for the intended pilot.
- [ ] Independent security assurance scope completed or explicitly accepted/scheduled by the appropriate pilot governance authority.
- [ ] Māori data-governance and residency decision approved for the intended pilot.

## Release decision

Phase 4I is suitable to merge as an **MVP hardening / technical resilience release** because the controls implemented in source and the recovery rehearsals performed are evidenced and non-production-safe.

The unchecked items above are not silently waived. They remain gates to an external pilot and must not be interpreted as completed by merging this branch.

## Change control

Update this record whenever there is a material change to the database provider, hosting provider, production region, recovery configuration, approved hosting plan, supplier terms, subprocessor set, deployment recovery model, secret-recovery process, or intended pilot operating model.
