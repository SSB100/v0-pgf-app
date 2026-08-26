# Waypoint data location and subprocessor register

## Status

Working supplier/data-flow register for pilot readiness. This register records what is currently known and what still requires contractual or governance verification. It is not a vendor certification, legal opinion, health-sector assurance statement, or external-pilot approval.

## Register rules

1. A provider must not be marked `verified` merely because a dashboard displays a region.
2. Database location, application execution, backups, logs, support access, subprocessors and provider home jurisdiction are separate questions.
3. A new processor handling user information requires privacy, security and Māori data-governance review before pilot use.
4. Production personal information and secrets must not be copied into GitHub issues, pull requests or source files.
5. Where a provider acts only as Waypoint's storage/processing agent, Waypoint remains responsible for the information.
6. Operational testing of a supplier capability is evidence of that tested capability only; it is not contractual supplier assurance.

## Current services

| Service | Purpose | Personal/sensitive data | Confirmed operational facts | Current status |
| --- | --- | --- | --- | --- |
| Neon PostgreSQL | Primary application database | Yes. Identity, wellbeing, consent, professional-sharing, audit and demographic data | AWS `us-east-1`, United States; PostgreSQL 17; current subscription `free_v3`; configured history retention 6 hours; isolated branch reset recovery tested | **Location/recovery facts confirmed; broader supplier and pilot architecture review pending** |
| Vercel | Next.js hosting, server execution, deployment and platform logs | Application requests may contain or generate personal information | Current team plan Hobby; Git-connected isolated rebuild tested successfully; tested preview served HTTP 200; observed server functions in `iad1` | **Application recovery tested; contractual/location/support review pending** |
| GitHub | Source control, pull requests, issues and CI metadata | Production personal information should not be stored here | Public repository; shared review workflow now runs lint, policy tests, typecheck, build and high-severity dependency audit; `main` protection not enabled at Phase 4I review | **Code/release control strengthened; repository-setting gate remains** |
| End-user browser/device | UI execution and temporary client-side state | May temporarily hold data entered by the user; some Journey exercise content is currently browser/session state rather than persisted | User-controlled device/location | **Expected client-side processing** |
| Transactional email | Password recovery / account messaging | Potential email address and account/security metadata | No verified provider currently active for password recovery | **Fail-closed / not active for recovery** |
| External analytics | Product analytics | Could become personal or behavioural data depending on implementation | None identified as a declared application dependency in the reviewed architecture | **Not currently declared** |
| AI/LLM processor | AI analysis or user-data processing | Potentially very high sensitivity if introduced | No production user-data AI processor authorised in this register | **Not authorised** |
| Research export environment | Formal study analysis | Potentially high/very high sensitivity | Not established | **Not established** |

## Confirmed Neon production metadata

Verified through the connected project during Phase 4H/4I:

- Project: `PGFapp`
- Project ID: `wild-wildflower-37967772`
- Production branch: `main`
- Production branch ID: `br-super-wildflower-a4bnoizt`
- Platform: AWS
- Region: `aws-us-east-1`
- PostgreSQL: version 17
- Subscription type: `free_v3`
- Configured history retention: `21600` seconds = **6 hours**
- Production branch protection: not enabled at Phase 4I review

### Recovery evidence

Phase 4I completed an isolated Neon branch-reset rehearsal. A synthetic schema/data change was created only on a child rehearsal branch, the branch was reset from production, baseline counts returned to expected values and final schema comparison against production was empty.

This proves the tested branch-reset path. It does not prove historical PITR, independent backup recovery or supplier-loss recovery.

Neon's current provider documentation supports timestamp/LSN restore within the configured history window and manual snapshots on the Free plan. Waypoint's current six-hour continuous history window is therefore a material recovery limitation for pilot architecture decisions.

See:

- `docs/phase-4i-operational-resilience-and-supplier-assurance.md`
- `docs/phase-4i-neon-point-in-time-recovery-readiness.md`

## Confirmed Vercel operational metadata

Verified during Phase 4I:

- Project: `v0-pgf-app`
- Current team plan: **Hobby**
- Repository integration: GitHub `SSB100/v0-pgf-app`
- A known Phase 4I Git commit rebuilt successfully as an isolated preview
- Tested preview deployment reached `READY`
- Tested homepage returned HTTP `200`
- Observed server-function region for the tested preview: `iad1`

This is evidence of the current Git-to-Vercel application rebuild path, not proof of all Vercel processing/log/support locations or contractual safeguards.

See `docs/phase-4i-application-recovery-rehearsal.md`.

## Data categories requiring the strongest location/governance review

The following categories should be treated as high-priority when evaluating a provider or proposed migration:

- gambling-harm and wellbeing check-ins;
- free-text reflections;
- mental-health or self-harm related information where stored;
- safeguards/support plans;
- community messages;
- professional relationships and sharing grants;
- ethnicity and iwi affiliation;
- Māori cohort or iwi-derived analysis;
- formal research measures and exports;
- incident/security records.

## Māori data boundary

Māori data is not limited to ethnicity/iwi columns. Data created by Māori users or describing Māori participation, experience, outcomes or communities can carry Māori rights and interests.

Provider review must therefore ask whether infrastructure and contractual arrangements support Rangatiratanga and Kaitiakitanga, including control over access, transfer, secondary use, retention, deletion and jurisdiction.

A shorter physical distance or an Australian region must not be described as Māori data sovereignty by itself. The current US database remains accepted for controlled MVP hardening only under the Phase 4H decision, not automatically for an external pilot.

## Supplier due-diligence questions

Before an external pilot, obtain and record answers for each provider handling sensitive data:

- Where are primary data, replicas and backups physically stored?
- In which countries can data be processed or transmitted?
- From which countries can provider staff/support personnel access data?
- Which subprocessors can receive or access the information?
- What contractual restrictions apply to provider use of customer data?
- What happens to data after deletion/account termination?
- What encryption is provided in transit and at rest?
- Who controls encryption keys and access credentials?
- How are security incidents notified to customers?
- What independent security assurance is available?
- What export/migration capabilities exist if Waypoint needs to repatriate data?
- What recovery history, backup and restore capability is included in the approved commercial plan?
- Does the arrangement support Māori governance requirements agreed for the pilot?

## Cross-border privacy boundary

Office of the Privacy Commissioner guidance indicates that an offshore cloud provider acting only as an agent for storage/processing is generally not an IPP 12 disclosure. This does not remove Waypoint's accountability for privacy and security.

If a provider or other overseas party uses or discloses data for its own purposes, assess IPP 12 and comparable safeguards explicitly.

## Current technical supplier-assurance evidence

Phase 4I has established the following without claiming contractual assurance:

- [x] Neon production region recorded from live project metadata.
- [x] Neon current subscription and six-hour history window recorded.
- [x] Neon isolated branch reset recovery rehearsal completed.
- [x] Vercel current plan recorded.
- [x] Vercel clean isolated rebuild from trusted Git source completed.
- [x] GitHub shared review workflow strengthened.
- [x] Current `main` branch-protection state identified.

## Outstanding confirmations before external pilot

### Neon

- [ ] Complete contractual/DPA review for the actual account arrangement.
- [ ] Verify backup/snapshot storage and support-access jurisdictions.
- [ ] Review relevant subprocessors and data-use restrictions.
- [ ] Verify incident-notification/support escalation arrangements.
- [ ] Verify deletion/termination treatment of retained histories, snapshots and backups.
- [ ] Perform historical PITR and/or snapshot restore rehearsal through a Neon interface exposing that capability.
- [ ] Decide whether six-hour continuous history is adequate or approve longer history/scheduled snapshots/independent backup.

### Vercel

- [ ] Approve the production hosting plan for the intended pilot.
- [ ] Verify applicable processor/data-processing terms for that plan.
- [ ] Verify execution, logging, backup and support-access locations relevant to Waypoint.
- [ ] Review relevant subprocessors.
- [ ] Verify incident-notification and deletion obligations.
- [ ] Define production-secret recovery/rotation and any fallback-hosting requirement.

### GitHub and architecture

- [ ] Enable appropriate `main` protection/ruleset and required checks through repository settings.
- [ ] Confirm repository-owner recovery/MFA arrangements.
- [ ] Decide whether independent source-code backup/export is required.
- [ ] Decide whether US database hosting is acceptable for the proposed pilot under Māori governance and procurement/privacy requirements.
- [ ] Record the approved pilot target architecture or migration plan.
- [ ] Confirm no undeclared analytics/monitoring processors have been introduced.
- [ ] Add any future email, AI or research processors before use.

## Change control

Any of the following must update this register in the same release/governance change:

- new database or hosting provider;
- new application/database region;
- new analytics or monitoring service;
- email/SMS provider activation;
- AI/LLM processing of user information;
- research export or data warehouse;
- material supplier-plan change;
- material change to provider subprocessors;
- backup/history-retention changes;
- support-access model changes;
- provider acquisition/contract change that materially affects jurisdiction or use;
- change to the production recovery model.
