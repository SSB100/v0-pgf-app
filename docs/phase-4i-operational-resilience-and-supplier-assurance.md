# Phase 4I: Operational resilience and supplier assurance

## Status

**In progress.** This document records Waypoint's operational-resilience position, the first completed recovery rehearsal, supplier-assurance findings, and the remaining gates before Phase 4I can be considered complete.

It is not a claim that Waypoint has completed disaster-recovery certification, independent security assurance, legal review, health-sector certification, or external pilot approval.

## Why this phase exists

Waypoint now depends on external infrastructure for application hosting and sensitive-data storage. A secure application is not pilot-ready if it cannot recover from accidental data loss, deployment failure, supplier outage, credential loss, or a material provider incident.

Phase 4I therefore separates four questions:

1. Can Waypoint recover data after an operator or application error?
2. Can the application be restored or redeployed after a failed release or hosting incident?
3. Are critical suppliers contractually and operationally suitable for the sensitivity of Waypoint data?
4. Are recovery procedures tested rather than merely described?

## Current critical services

| Service | Current role | Current reviewed state | Phase 4I position |
| --- | --- | --- | --- |
| Neon PostgreSQL | Primary database | Production project `PGFapp`, AWS `us-east-1`, United States | Branch recovery tested; broader backup/PITR and supplier assurance still incomplete |
| Vercel | Next.js application hosting and deployment | `v0-pgf-app`, Hobby plan, current production deployment healthy at review | Redeploy path exists through GitHub; contractual/location and rollback controls require further review |
| GitHub | Source control and deployment source | Public repository; production user data must not be stored here | Source is recoverable from Git history, but `main` protection/ruleset decision remains open |

## Recovery objectives

Waypoint must formally approve Recovery Point Objective (RPO) and Recovery Time Objective (RTO) values before an external pilot.

Until those values are approved:

- do not advertise a guaranteed recovery time;
- do not advertise zero data loss;
- do not treat provider marketing claims as Waypoint service-level commitments;
- prioritise recovery of authentication, consent, sharing, safety and user wellbeing data over non-essential presentation state;
- retain enough independent evidence to determine whether restored data is complete and internally consistent.

The final RPO/RTO decision should consider the proposed pilot population, clinical/support operating model, incident response responsibilities, provider plan limitations, cost and Māori data-governance requirements.

---

# Recovery rehearsal 01 - Neon branch reset

## Rehearsal date

26 August 2026 NZST / 25-26 August 2026 UTC platform timestamps.

## Environment

- Neon project: `PGFapp`
- Project ID: `wild-wildflower-37967772`
- Production branch: `main`
- Production branch ID: `br-super-wildflower-a4bnoizt`
- Isolated rehearsal branch: `phase-4i-recovery-rehearsal-2026-08-26`
- Rehearsal branch ID: `br-withered-dew-a4c46fnm`
- Database: `neondb`

The production branch was not intentionally modified during this rehearsal.

## Baseline

Before introducing the rehearsal change, the isolated branch contained the following key record counts:

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

## Fault introduced

A clearly synthetic table named `phase4i_recovery_rehearsal_marker` was created only on the isolated rehearsal branch and populated with one test-only marker record.

No production personal information was created, edited or deleted for the purpose of the rehearsal.

## Pre-recovery verification

The rehearsal branch was verified to have genuinely diverged from its parent:

- the synthetic marker record existed;
- Neon schema comparison reported the synthetic table and its primary-key constraint as the only schema difference from production.

## Recovery action

The rehearsal branch was reset from its production parent using Neon's branch reset capability.

Neon reported the reset as successful. Platform metadata records `last_reset_at` as `2026-08-26T00:10:07Z`.

## Post-recovery verification

After reset:

- the synthetic marker table no longer existed;
- every key baseline record count matched its original value;
- Neon schema comparison between the rehearsal branch and its production parent returned an empty diff;
- the rehearsal branch returned to `ready` state.

## Result

**PASS - isolated branch reset/recovery rehearsal.**

This provides evidence that an isolated child branch can be deliberately changed and then returned to its production-parent state while preserving the expected baseline database structure and selected data counts.

## What this rehearsal proves

It provides evidence for:

- operational ability to create/use an isolated recovery environment;
- verification that a branch can diverge without changing its parent;
- successful branch reset from the production parent;
- restoration of schema parity;
- restoration of selected baseline data counts;
- a repeatable verification pattern for future recovery exercises.

## What this rehearsal does not prove

It does **not** establish:

- point-in-time recovery of production after destructive production writes;
- the configured history-retention window for the current Neon plan/project;
- recovery from a complete Neon service or account loss;
- existence of an independent off-provider backup;
- restoration of all rows solely because selected row counts match;
- recovery of application environment variables or secrets;
- Vercel application disaster recovery;
- recovery if both GitHub and Vercel are unavailable;
- supplier contractual compliance or Māori data-sovereignty acceptance;
- a guaranteed RPO or RTO.

---

# Database recovery strategy

## Layer 1 - branch isolation and reset

**Status: tested.**

Use isolated branches for rehearsals, destructive test scenarios and investigation without intentionally modifying production.

## Layer 2 - point-in-time restore

**Status: provider capability identified; Waypoint-specific rehearsal pending.**

Neon documents branch restore / point-in-time recovery within the project's configured history-retention window. Neon has also introduced snapshot and scheduled-snapshot capabilities, with availability and retention depending on plan/configuration.

Before external pilot:

- [ ] record Waypoint's actual configured instant-restore/history window;
- [ ] confirm the capability available under Waypoint's actual Neon plan;
- [ ] perform an isolated point-in-time recovery rehearsal using a known timestamp;
- [ ] verify schema and representative data integrity after restore;
- [ ] record observed recovery duration without presenting one rehearsal as a guaranteed RTO.

## Layer 3 - independent logical export / provider-loss recovery

**Status: not established.**

A provider-native restore feature does not cover every provider-loss or account-loss scenario. Before pilot, decide whether Waypoint requires encrypted logical exports or another independent recovery copy outside the primary Neon failure domain.

- [ ] determine whether an independent backup is required by governance/procurement partners;
- [ ] define encryption, storage location, access and retention for that backup;
- [ ] ensure backup copies do not create an uncontrolled secondary store of health, wellbeing, ethnicity or iwi data;
- [ ] test restoration into a clean environment if this layer is adopted.

---

# Application recovery strategy

## Git source recovery

The production application is deployed from GitHub. A clean deployment from an approved `main` commit is the primary application rebuild path.

Outstanding controls:

- [ ] decide and implement appropriate protection/rules for `main` before external pilot;
- [ ] document who may approve production code changes;
- [ ] verify repository/account recovery and MFA arrangements for operational owners;
- [ ] ensure no single developer workstation is required to rebuild production.

## Vercel deployment recovery

At the Phase 4I review point:

- project: `v0-pgf-app`;
- current account/team plan: **Hobby**;
- latest reviewed production deployment is `READY`;
- no grouped runtime errors were returned in the reviewed seven-day window;
- the deployment is linked to the GitHub repository.

The safe recovery assumption for the current configuration is **redeployment from trusted Git source**, not reliance on a contractual rollback SLA.

Vercel documentation describes rollback-to-a-specific-older-deployment functionality for Pro/Enterprise plans. The current Hobby plan therefore requires an explicit decision before Waypoint treats platform rollback as a formal recovery control.

Before external pilot:

- [ ] rehearse a clean non-production deployment from a known trusted commit;
- [ ] document production promotion/redeployment steps;
- [ ] document required environment-variable names without storing secret values in GitHub;
- [ ] define how encrypted secret values are recovered if the Vercel account/configuration is lost;
- [ ] decide whether the hosting plan must be upgraded for contractual, security, recovery or support requirements;
- [ ] define a fallback if Vercel is materially unavailable.

---

# Supplier assurance register

## Neon PostgreSQL

### Confirmed from Waypoint environment

- Primary database contains sensitive identity, wellbeing, consent, sharing, audit and demographic information.
- Current production location is AWS `us-east-1`, United States.
- Production is not New Zealand-resident.
- Isolated branch reset has been successfully rehearsed.

### Provider capabilities identified from current Neon materials

Neon documents point-in-time restore using retained database history and current Backup & Restore / snapshot capabilities. The available restore window and automated snapshot options depend on current project settings and plan.

Provider references reviewed:

- https://neon.com/docs/changelog/2024-02-23
- https://neon.com/docs/changelog/2025-10-17
- https://neon.com/docs/changelog/2025-10-31
- https://neon.com/msa
- https://neon.com/subprocessors

### Outstanding assurance

- [ ] identify the exact current Neon commercial plan and applicable contract/DPA;
- [ ] record actual instant-restore/history retention configured for `PGFapp`;
- [ ] verify backup/snapshot storage locations and applicable jurisdictions;
- [ ] verify provider staff/support-access jurisdictions and controls;
- [ ] review the current Neon subprocessor list for Waypoint-relevant services;
- [ ] record incident-notification obligations and support escalation route;
- [ ] confirm deletion/termination behaviour for retained histories, snapshots and backups;
- [ ] determine whether current US hosting is acceptable for the proposed pilot;
- [ ] determine whether an independent off-provider recovery copy is required.

## Vercel

### Confirmed from Waypoint environment

- Vercel hosts the Next.js application and server execution.
- Current project is on the **Hobby** plan.
- Current production deployment is healthy at review and linked to GitHub.
- Application processing/logging must continue to be treated as potentially offshore/multi-region until the applicable configuration and contract establish otherwise.

### Provider contractual finding

Vercel's current published Data Processing Addendum states that it applies to customers on **Pro and Enterprise** plans. Waypoint's current Hobby-plan environment therefore must not be described as having completed that DPA-based supplier assurance.

Provider references reviewed:

- https://vercel.com/legal/dpa
- https://vercel.com/security
- https://vercel.com/docs/deployments/rollback-production-deployment

### Outstanding assurance

- [ ] determine whether Waypoint must upgrade to Pro/Enterprise or obtain equivalent processor terms before pilot;
- [ ] identify the execution regions applicable to Waypoint server functions;
- [ ] verify logging, support-access and backup locations relevant to the selected plan/configuration;
- [ ] review Vercel subprocessors relevant to Waypoint processing;
- [ ] verify incident-notification and deletion obligations under the actual plan/contract;
- [ ] define deployment rollback/redeployment capability under the approved production plan;
- [ ] confirm whether provider support and audit evidence are adequate for the proposed health/research context.

## GitHub

GitHub is treated primarily as a source-code and development-history supplier, not an authorised store for production user data.

- [ ] maintain secret hygiene and repository scanning;
- [ ] prohibit production user information in issues, PRs and source files;
- [ ] decide branch/ruleset protection for `main`;
- [ ] confirm repository-owner recovery/MFA arrangements;
- [ ] define a source-code backup/export approach if governance requires independence from GitHub.

---

# Incident and continuity exercise

Phase 4G already requires a tabletop security/privacy incident exercise. Phase 4I should combine operational continuity with that exercise rather than run an unrelated paper exercise.

The scenario should include at least:

1. a suspected compromise or destructive data change;
2. containment and session/access revocation;
3. decision whether to recover from current state, point-in-time state or backup;
4. verification of consent/sharing/audit integrity after recovery;
5. supplier escalation to Neon and/or Vercel;
6. Privacy Act serious-harm assessment;
7. Māori data-governance escalation if Māori data is affected;
8. user/professional communications decision;
9. recovery completion and post-incident review.

- [ ] complete tabletop exercise before external pilot.

---

# Phase 4I completion gates

Phase 4I should not be marked complete until the following are either completed or explicitly accepted as residual risk by the appropriate governance authority:

- [x] Isolated Neon branch recovery/reset rehearsal completed and verified.
- [ ] Waypoint's actual Neon restore/history settings recorded.
- [ ] Point-in-time recovery rehearsal completed in an isolated environment.
- [ ] Independent-backup/provider-loss strategy decided and, if required, tested.
- [ ] Application clean redeployment rehearsal completed.
- [ ] Environment/secrets recovery procedure documented.
- [ ] Neon supplier/DPA/subprocessor/support-access review completed.
- [ ] Vercel supplier/DPA/subprocessor/location review completed.
- [ ] Hosting-plan decision made for external pilot.
- [ ] GitHub `main` protection/change-control decision implemented.
- [ ] Combined incident and continuity tabletop exercise completed.
- [ ] Named operational owners assigned for recovery and supplier escalation.
- [ ] RPO and RTO formally approved for the intended pilot.
- [ ] Independent security assurance scope decided and scheduled/completed as appropriate to pilot risk.

## Recommended next sequence

1. Verify current Neon plan and actual history/restore settings.
2. Run an isolated point-in-time recovery rehearsal.
3. Rehearse a clean application deployment from a trusted Git commit.
4. Decide Vercel plan/contract position and complete Neon/Vercel supplier review.
5. Define environment-secret recovery and any independent database backup layer.
6. Implement GitHub production-branch protection/change control.
7. Run the combined incident/continuity tabletop.
8. Record residual risks, RPO/RTO and Phase 4I approval decision.

## Change control

This document must be updated when there is a material change to the database provider, hosting provider, production region, backup/restore configuration, supplier terms, subprocessor set, deployment recovery model, or approved pilot operating model.
