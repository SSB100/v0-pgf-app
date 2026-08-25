# Waypoint Data Governance Register

**Status:** working governance artefact for the August 2026 MVP hardening programme. This document is not a claim of legal, clinical or research compliance. It records the intended purpose and boundaries of Waypoint data so they can be reviewed with privacy, clinical, Māori data-governance and research partners before formal deployment.

## Governance principles

1. **Purpose before collection.** Waypoint should not collect a field simply because it may be useful later.
2. **Data minimisation.** Collect the least detailed information that meets the defined purpose.
3. **User control.** Private Waypoint data stays private unless the user deliberately shares a defined category with a verified professional or joins a separately governed research activity.
4. **No implied research consent.** The current `data_consent` field records interest in future research only. It does not authorise formal research use.
5. **No implied clinical monitoring.** Professional sharing is for later review unless a future service explicitly establishes a monitored workflow with agreed response responsibilities.
6. **Separation of domains.** Identity, private product data, professional-sharing data, research data and governance/audit data should be separated in purpose and access.
7. **Data whakapapa/provenance.** Important derived or shared information should retain enough provenance to identify its source, purpose, version and transformations.
8. **Māori governance is substantive.** Māori data sovereignty cannot be satisfied by translation or a privacy notice alone. Collection, access, secondary use, interpretation, dissemination and residency decisions involving Māori data require appropriate Māori governance and co-design.
9. **Least privilege.** Staff, professionals and researchers receive only the access required for their role and purpose.
10. **Versioned decisions.** Terms, privacy notices, professional-sharing consent and research consent must be versioned so Waypoint can establish what a person agreed to at a particular time.

## Data domains

| Domain | Purpose | Typical access |
| --- | --- | --- |
| Identity | Authentication, account administration, eligibility and direct contact | User and tightly controlled Waypoint account functions |
| Private Waypoint | Self-monitoring, personalisation, reflection, learning and safeguards | User by default |
| Professional sharing | User-authorised information made available to a verified professional | User and specifically authorised professional |
| Research | Approved study participation, measures, cohorts and analysis | Approved research roles under a separate protocol and consent process |
| Governance and audit | Consent history, access events, exports, policy acceptance and privacy requests | User where appropriate plus tightly controlled governance roles |

## Current and planned data register

| Data category | Examples | Current product purpose | Sensitivity | Default visibility | Professional sharing | Research use | Retention position |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Account identity | Email, full name | Sign-in, account administration | Sensitive | User / account functions | No | No direct identifier in analysis datasets | Retention schedule to be defined before pilot |
| Age eligibility | Exact date of birth currently stored | Confirm current 18+ boundary | Sensitive | Account functions | No | Prefer derived age/age band when justified | Exact DOB minimisation review required |
| Demographics | Country, gender | Current signup/profile context | Sensitive | User / account functions | Off by default | Only under approved study purpose/consent | Review necessity before pilot |
| Onboarding draft | Temporary JSON draft | Resume onboarding | High | User | No | No by default | Treat as temporary; define expiry and deletion after completion |
| Onboarding profile | Journey type, strengths, values, problem areas and other saved personalisation inputs | Personalise Waypoint | High | User | Category-specific explicit sharing only | Separate approved research consent required | Define per-category schedule before pilot |
| Daily check-ins | Mood, wellbeing, urges, behaviour occurrence, selected skills | Self-monitoring and progress display | High | User | Summary only when explicitly granted | Product data by default; research only under approved protocol | Define before pilot |
| Free-text check-in reflections | User-written reflections | Personal reflection | Very high | User only | Never included in summary sharing; selected reflection sharing must be a separate explicit action | Off by default | User-control and retention design required |
| Journey progress | Module completion, current progress | Learning progress | Sensitive | User | Explicitly shareable | Could be implementation/engagement data under approved protocol | Define before pilot |
| Journey exercise responses | User-entered exercise content | Learning and personal reflection | High to very high | User | Off by default; selected reflection flow only | Off by default | Decide which exercises are ephemeral vs stored |
| Skills practice | Skill name, completion, effectiveness rating, notes where applicable | Skills tracking | Sensitive | User | Explicitly shareable; notes excluded unless separately selected | Separate approved research consent required | Define before pilot |
| Values | Selected/core values | Personalisation and reflection | Sensitive | User | Explicitly shareable | Separate approved research consent required | Define before pilot |
| Safeguards/support plan | User-selected support and safeguard information | Self-management and support planning | Very high | User | Explicit high-sensitivity grant only | Separate approved research consent required | Define before pilot |
| Community identity | Alias/profile fields linked internally to account | Peer community participation | Sensitive | Community alias may be visible to members | Not part of clinician sharing by default | Off by default | Separate moderation/retention rules required |
| Community messages | Peer messages | Community discussion | High | Relevant community members/moderation under defined rules | No | Off by default | Separate moderation/retention rules required |
| Future research interest | Boolean preference plus event history | Record whether user wants to hear about future research | Sensitive preference | User / authorised admin | No | Not research consent | Retain preference history while account exists; formal rule to be reviewed |
| Professional relationship | Organisation, professional, relationship status | Govern professional connection | High | User + involved professional | Required for sharing | Not study data by default | Define relationship/audit retention before pilot |
| Sharing grant | Data scope, consent version, grant/revoke/expiry timestamps | Enforce user-authorised professional access | High | User + authorisation service | Governs access | Governance metadata, not outcome data by default | Preserve sufficient history for accountability |
| Access audit event | Who accessed what category, when and for what purpose | Accountability and user transparency | High | User where appropriate + governance | N/A | Not outcome data by default | Define legal/governance retention period before pilot |
| Policy acceptance | Policy type, version, timestamp | Establish which notice/terms applied | Governance | User + governance | N/A | Not outcome data | Preserve version history for accountability |
| Privacy request | Access/export/correction/deletion request and status | Fulfil privacy rights/processes | High | User + privacy/governance role | N/A | No | Define legal/governance retention period |
| Formal research data (future) | Study ID, measure version, outcome responses, cohort, intervention version | Approved study only | High | Approved research roles | Separate from professional sharing | Only under approved protocol/consent | Study-specific retention/disposal schedule |

## Professional sharing scope rules

The first professional-sharing model uses explicit categories rather than broad profile access:

- `journey_progress`
- `daily_checkins_summary`
- `skills_practice`
- `core_values`
- `safeguards`
- `selected_reflections`

Private free text is never included merely because `daily_checkins_summary` is enabled. `selected_reflections` means the user has deliberately selected specific content for sharing; it must not become a blanket journal permission.

## Data residency and Māori data sovereignty

Waypoint currently uses third-party cloud infrastructure and should not claim Aotearoa-only data residency without verifying the deployed database, application, backup, logging and analytics locations. Before a formal health-service or research deployment, Waypoint should document:

- the physical/contractual location of production databases, replicas and backups;
- whether support, logging or analytics providers process sensitive data offshore;
- access by overseas subprocessors;
- encryption/key-management responsibilities;
- cross-border disclosure safeguards;
- Māori governance input into residency, access, secondary use and dissemination decisions involving Māori data;
- how data provenance/whakapapa is preserved when data is derived, exported or analysed.

A Māori Data Governance Framework should be co-designed with appropriate Māori leadership before Waypoint describes itself as satisfying Māori data-sovereignty expectations.

## Decisions still required before pilot

- Replace exact DOB with the minimum age/age-band information that the final product and study genuinely require, or document why exact DOB is necessary.
- Define retention and disposal schedules for every high/very-high sensitivity category.
- Define deletion/anonymisation exceptions and how they are communicated to users.
- Establish a named privacy contact and operational privacy-request process.
- Confirm production/staging/research data residency and subprocessors.
- Establish Māori data-governance decision rights and review process.
- Establish Pacific data/cultural governance appropriate to any study/service population.
- Define professional verification standards and staff offboarding.
- Define formal research data separation, identifiers, approved access and export controls.
- Define community moderation access and retention separately from professional/research access.

## Change control

Material changes to data collection or use should update this register as part of the same pull request. A field should not move from private product use to professional sharing or research use merely because the database technically makes it available.
