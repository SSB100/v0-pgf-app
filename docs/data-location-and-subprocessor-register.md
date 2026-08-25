# Waypoint data location and subprocessor register

## Status

Working supplier/data-flow register for pilot readiness. This register records what is currently known and what still requires contractual verification. It is not a vendor certification or legal opinion.

## Register rules

1. A provider must not be marked `verified` merely because a dashboard displays a region.
2. Database location, backups, logs, support access, subprocessors and provider home jurisdiction are separate questions.
3. A new processor handling user information requires privacy, security and Māori data-governance review before pilot use.
4. Production personal information and secrets must not be copied into GitHub issues, pull requests or source files.
5. Where a provider acts only as Waypoint's storage/processing agent, Waypoint remains responsible for the information.

## Current services

| Service | Purpose | Personal/sensitive data | Confirmed location | Other jurisdiction considerations | Current status |
| --- | --- | --- | --- | --- | --- |
| Neon PostgreSQL | Primary application database | Yes. Identity, wellbeing, consent, professional-sharing, audit and demographic data | AWS `us-east-1`, United States, confirmed from live Neon project metadata | Neon/provider corporate jurisdiction, support access, backups and subprocessors require contractual review | **Location confirmed; broader supplier review pending** |
| Vercel | Next.js hosting, server execution, deployment and platform logs | Application requests may contain or generate personal information | Not fully contractually verified. Delivery/processing should be treated as potentially multi-region/offshore | Provider home jurisdiction, execution regions, logs, support access and subprocessors need review | **Pending supplier/location review** |
| GitHub | Source control, pull requests, issues and CI metadata | Production personal information should not be stored here | Offshore SaaS; exact storage location not relied on for user-data architecture | Repository access and secret hygiene remain security controls | **Code only; no intentional production user data** |
| End-user browser/device | UI execution and temporary client-side state | May temporarily hold data entered by the user; some Journey exercise content is currently browser/session state rather than persisted | User-controlled device/location | Device security is outside direct Waypoint infrastructure control | **Expected client-side processing** |
| Transactional email | Password recovery / account messaging | Potential email address and account/security metadata | No verified provider currently active for password recovery | Must be reviewed before enabling recovery | **Fail-closed / not active for recovery** |
| External analytics | Product analytics | Could become personal or behavioural data depending on implementation | None identified as a declared application dependency in Phase 4H review | Any future analytics provider requires prior governance review | **Not currently declared** |
| AI/LLM processor | AI analysis or user-data processing | Potentially very high sensitivity if introduced | No production user-data AI processor authorised in this register | Māori data, health information, secondary use and offshore processing risks are material | **Not authorised** |
| Research export environment | Formal study analysis | Potentially high/very high sensitivity | Not established | Must be separate from ordinary product/professional access and governed by protocol/consent | **Not established** |

## Confirmed Neon production metadata

At the Phase 4H review point:

- Project: `PGFapp`
- Project ID: `wild-wildflower-37967772`
- Production branch: `main`
- Production branch ID: `br-super-wildflower-a4bnoizt`
- Platform: AWS
- Region: `aws-us-east-1`
- PostgreSQL: version 17

These identifiers are operational metadata, not secrets.

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

Māori data is not limited to the ethnicity/iwi columns. Data created by Māori users or describing Māori participation, experience, outcomes or communities can carry Māori rights and interests.

Provider review must therefore ask whether infrastructure and contractual arrangements support Rangatiratanga and Kaitiakitanga, including control over access, transfer, secondary use, retention, deletion and jurisdiction.

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
- Does the arrangement support any Māori governance requirements agreed for the pilot?

## Cross-border privacy boundary

Office of the Privacy Commissioner guidance indicates that an offshore cloud provider acting only as an agent for storage/processing is generally not an IPP 12 disclosure. This does not remove Waypoint's accountability for privacy and security.

If a provider or other overseas party uses or discloses the data for its own purposes, assess IPP 12 and comparable safeguards explicitly.

## Change control

Any of the following must update this register in the same release/governance change:

- new database or hosting provider;
- new application region;
- new analytics or monitoring service;
- email/SMS provider activation;
- AI/LLM processing of user information;
- research export or data warehouse;
- material change to provider subprocessors;
- backup location changes;
- support-access model changes;
- provider acquisition/contract change that materially affects jurisdiction or use.

## Outstanding confirmations before external pilot

- [ ] Verify Neon backup and support-access jurisdiction contractually.
- [ ] Verify Neon subprocessor list and relevant contractual data-use restrictions.
- [ ] Verify Vercel execution, logging, backup and support-access locations for the selected plan/configuration.
- [ ] Verify Vercel subprocessors relevant to Waypoint.
- [ ] Decide whether US database hosting is acceptable for the proposed pilot under Māori governance and procurement/privacy requirements.
- [ ] Record the approved target architecture or migration plan.
- [ ] Confirm no undeclared analytics/monitoring processors have been introduced.
- [ ] Add any future email, AI or research processors before use.
