# Waypoint Data Governance Register

**Status:** working governance artefact for the August 2026 MVP hardening programme. This document records current product boundaries and open governance decisions. It is not a claim of legal, clinical, research, HISO or Māori data-governance compliance.

## Governance principles

1. **Purpose before collection.** Do not collect a field simply because it may be useful later.
2. **Data minimisation.** Collect the least detail required for the defined purpose.
3. **User control.** Private Waypoint data stays private unless the user deliberately shares a defined category with a verified professional or joins a separately governed research activity.
4. **No implied research consent.** The current research-interest preference is not formal study consent.
5. **No implied clinical monitoring.** Professional sharing is for later review unless a future service explicitly establishes monitored care and response responsibilities.
6. **Separation of domains.** Identity, private product data, professional sharing, research and governance/audit data have distinct purposes and access models.
7. **Data whakapapa/provenance.** Derived/shared data should retain source, purpose, version and transformation provenance.
8. **Māori governance is substantive.** Māori data governance applies to collection, access, storage, secondary use, interpretation, dissemination, retention and disposal, not merely translation or privacy wording.
9. **Least privilege.** Staff, professionals and researchers receive only access required for their approved role and purpose.
10. **Versioned decisions.** Terms, notices, sharing consent, research consent and material governance decisions must retain version history.

## Data domains

| Domain | Purpose | Typical access |
| --- | --- | --- |
| Identity | Authentication, account administration, eligibility and direct contact | User and tightly controlled account functions |
| Private Waypoint | Self-monitoring, personalisation, reflection, learning and safeguards | User by default |
| Professional sharing | User-authorised information made available to a verified professional | User and specifically authorised professional |
| Research | Approved study participation, measures, cohorts and analysis | Approved research roles under separate protocol/consent |
| Governance and audit | Consent history, access events, policy acceptance, security incidents and privacy requests | User where appropriate plus tightly controlled governance roles |

## Current data register

| Data category | Examples | Current product purpose | Sensitivity | Default visibility | Professional sharing | Research use | Retention position |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Account identity | Email, full name | Sign-in and account administration | Sensitive | User / account functions | No | Direct identifiers excluded from analysis datasets by default | Schedule still required |
| Age eligibility | 18+ verification, verification timestamp, age band | Adult eligibility and broad demographic context | Sensitive | Account functions | No | Only where protocol justifies it | Exact DOB is not retained for new accounts after verification |
| Demographics | Country, gender, ethnicity, iwi affiliation | Equity/service-improvement context | High | User / account functions | Off by default | Separate approved purpose, consent and governance required | Review with Māori governance before pilot |
| Onboarding draft | Temporary JSON draft | Resume onboarding | High | User | No | No by default | Define expiry/deletion after completion |
| Onboarding profile | Journey type, strengths, values, problem areas and other personalisation inputs | Personalise Waypoint | High | User | Category-specific sharing only | Separate approved research consent required | Define before pilot |
| Daily check-ins | Mood, wellbeing, urges, behaviour occurrence, selected skills | Self-monitoring and progress | High | User | Summary only when explicitly granted | Approved protocol only | Define before pilot |
| Free-text check-in reflections | User-written reflections | Personal reflection | Very high | User only | Never included by summary permission | Off by default | User-control/retention design required |
| Journey progress | Module completion and progress | Learning progress | Sensitive | User | Explicitly shareable | Approved protocol only | Define before pilot |
| Journey exercise responses | User-entered exercise content | Learning/reflection | High to very high | Mostly ephemeral/currently not persisted in governed response store | No current professional answer access | Off by default | Decide persistence before any future implementation |
| Skills practice | Skill name, practice/effectiveness | Skills tracking | Sensitive | User | Explicitly shareable with notes excluded | Approved protocol only | Define before pilot |
| Values | Selected/core values | Personalisation/reflection | Sensitive | User | Explicitly shareable | Approved protocol only | Define before pilot |
| Safeguards/support plan | Support/safeguard information | Self-management/support planning | Very high | User | No current clinician UI exposure unless separately implemented | Approved protocol only | Define before pilot |
| Community identity/messages | Alias, group membership, peer messages | Peer support/community | High | Relevant community participants | Not professional data | Off by default | Moderation/retention rules required |
| Future research interest | Preference plus event history | Record interest in future research contact | Sensitive preference | User / authorised admin | No | Not research consent | Preserve preference history while account exists pending final schedule |
| Professional relationship | Organisation, professional and lifecycle state | Govern professional connection | High | User + involved professional | Required for sharing | Not study data by default | Define accountability schedule |
| Sharing grant | Scope, grant/revoke/expiry history | Enforce user-authorised professional access | High | User + authorisation service | Governs access | Governance metadata only by default | Preserve history for accountability |
| Access/audit events | Who accessed what, when and why | Accountability and security | High | User where appropriate + governance | N/A | Not outcome data | Formal audit schedule required |
| Security incident record | Incident assessment, containment, notification decisions | Security/privacy response | High | Admin/governance only | No | No outcome use | Retain under incident/accountability schedule |
| Privacy request | Access/export/correction/deletion request | Privacy-rights operations | High | User + privacy/governance role | N/A | No | Formal schedule required |
| Formal research data (future) | Study ID, measure versions, outcomes, cohort, intervention version | Approved study only | High | Approved research roles | Separate from professional sharing | Approved protocol/consent only | Study-specific schedule required |

## Professional sharing scope rules

The current professional-sharing model uses explicit categories rather than broad profile access:

- `journey_progress`
- `daily_checkins_summary`
- `skills_practice`
- `core_values`

Private free text is not included merely because a summary permission is enabled. Safeguards and selected-reflection sharing remain outside the current professional UI until a separately explicit mechanism is implemented.

## Demographic and Māori data boundary

Ethnicity and iwi are stored in the dedicated `user_demographics` record and are excluded from current professional summary scopes.

The research-interest preference does not authorise demographic research. Iwi-level research, reporting, aggregation, publication and external secondary use remain disabled until an appropriate Māori data-governance function has genuine decision authority over the proposed use.

Māori data is broader than explicit ethnicity/iwi fields. Data produced by Māori users or describing Māori experience, participation or outcomes may also carry Māori rights and interests and requires context-appropriate governance.

## Phase 4H residency position

The live Neon production database is confirmed in AWS `us-east-1`, United States. Waypoint must not describe current production as New Zealand-resident.

The current offshore database is accepted only for controlled MVP hardening, not as an indefinite architecture approval for an external health-service or research pilot.

A move to an Australian region would change jurisdiction but would not itself establish Māori data sovereignty. New Zealand-hosted infrastructure should be actively assessed at the pilot residency gate alongside security, resilience, backups, support access, provider ownership and subprocessor risks.

See:

- `docs/phase-4h-maori-data-governance-and-residency.md`
- `docs/data-location-and-subprocessor-register.md`
- `docs/demographic-data-boundaries.md`

## Decisions still required before external pilot

- Name the Māori data-governance partner/group or agreed equivalent and define real decision rights.
- Confirm database, application, logs, backups, support access and subprocessors contractually.
- Decide whether US hosting is acceptable for the proposed pilot or approve a migration plan.
- Define retention/disposal schedules for high and very-high sensitivity data.
- Define deletion/anonymisation exceptions and user communication.
- Establish the final privacy contact/process and service-level expectations.
- Establish Pacific data/cultural governance appropriate to the intended population.
- Define formal research identifiers, approved access, export controls and study-specific retention.
- Define community moderation access and retention separately from professional/research access.
- Complete backup/restore testing, supplier review and an incident/tabletop exercise.
- Obtain independent security assurance appropriate to the pilot risk profile.

## Change control

Material changes to collection, infrastructure, processors, sharing or research use must update this register as part of the same governance/release change. Technical availability of a field is never sufficient authority for a new use.