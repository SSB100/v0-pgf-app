# Phase 4H: Māori data governance and data residency

## Status

This document records Waypoint's interim Māori data-governance and data-residency position for the August 2026 pilot-readiness programme.

It is a governance control and architecture decision record. It is not a claim that Waypoint is Māori-governed, Te Tiriti compliant, health-sector certified, clinically validated or approved for formal research.

## Why this phase exists

Waypoint now collects optional ethnicity and iwi affiliation and holds sensitive wellbeing, gambling-harm and professional-sharing information. The question is therefore broader than where one database happens to be hosted.

For Waypoint, Māori data includes more than the `user_demographics` record. Consistent with Te Mana Raraunga, data produced by Māori or about Māori can carry Māori rights and interests. Depending on context, this can include wellbeing activity, engagement, outcomes, community participation, research data, derived measures and aggregate reporting about Māori users.

Māori data governance must therefore govern purpose, collection, access, interpretation, secondary use, research, disclosure, publication, retention, disposal and infrastructure decisions.

## Sources and benchmark position

This phase is informed by:

- Te Mana Raraunga, *Principles of Māori Data Sovereignty*, including Rangatiratanga, Whakapapa, Whanaungatanga, Kotahitanga, Manaakitanga and Kaitiakitanga.
- Te Mana Raraunga's position that decisions about physical and virtual storage should enhance Māori control and that, wherever possible, Māori data should be stored in Aotearoa New Zealand.
- Te Mana Raraunga's Māori Data Audit Tool and published Māori data-governance resources.
- Office of the Privacy Commissioner guidance on Privacy Act 2020 Information Privacy Principle 12 and overseas cloud processing.
- NZ Digital Government's 2024 Cloud Jurisdictional Risk guidance, including the need to consider te ao Māori perspectives, legal jurisdiction, provider access and data location.
- Health New Zealand HISO 10029.4:2025 HISF supplier guidance as a health-sector security benchmark.

These sources are benchmarks for Waypoint's governance design. Government cloud policy does not automatically bind Waypoint as a private organisation, and this document does not assert formal conformance with HISO or any government assurance framework.

## Confirmed current infrastructure position

### Production database

The live Neon PostgreSQL project is currently hosted in AWS `us-east-1` in the United States.

This means Waypoint must not describe its production database as New Zealand-resident or Aotearoa-hosted.

### Application hosting

Waypoint is deployed on Vercel. Application delivery and processing can involve offshore infrastructure and should be treated as potentially multi-region unless the applicable Vercel product configuration and contractual terms establish a narrower location.

A production request observed during Phase 4G was served through Vercel infrastructure with offshore processing identifiers. That observation is not sufficient to establish the full contractual location of application processing, logs, support access or backups.

### Source code

GitHub holds application source code and development history. Production personal information must not be intentionally stored in the repository, issues or pull requests. Secrets must remain outside source control.

### Analytics and email

No separate third-party analytics SDK is currently declared as an application dependency. Password recovery remains fail-closed because Waypoint does not yet have a verified transactional-email delivery and reset-token lifecycle.

These statements describe the current reviewed architecture only. Any new analytics, monitoring, messaging, AI, research-export or support provider becomes a new data-location and subprocessor decision.

## Privacy Act boundary for offshore cloud

Office of the Privacy Commissioner guidance states that sending information to an offshore cloud provider acting only as an agent for storage or processing is generally not treated as a disclosure under IPP 12. Waypoint nevertheless remains responsible for the information it places with that agent.

If an overseas party uses or discloses personal information for its own purposes, or an arrangement otherwise becomes an overseas disclosure, the IPP 12 safeguards must be assessed.

Therefore:

1. Offshore hosting is not automatically unlawful.
2. Offshore hosting is not automatically low-risk.
3. Privacy Act compliance does not by itself satisfy Māori data-sovereignty expectations.
4. Waypoint remains accountable for provider selection, contractual safeguards, security, access and incident response.

## Māori data-governance principles for Waypoint

### Rangatiratanga | Authority

Māori must have meaningful decision rights over material secondary uses of Māori data, not merely be consulted after a decision is made.

Waypoint must not activate Māori or iwi-specific research, external reporting, algorithmic targeting, commercial secondary use or publication solely on founder or product-team approval.

### Whakapapa | Provenance and context

Where Māori data is derived, aggregated, exported or analysed, Waypoint should retain enough provenance to know:

- the original source and collection purpose;
- the notice or consent version in force;
- transformations and derived variables;
- who accessed or exported it;
- the study, service-improvement or reporting purpose;
- the governance decision that authorised the use.

### Whanaungatanga | Relationships and obligations

An individual's privacy choices remain important, but some uses of Māori data may also create collective risks or obligations. User consent alone must not be treated as sufficient authority for every Māori cohort-level or iwi-level use.

### Kotahitanga | Collective benefit

Proposed use of Māori data should identify the expected benefit to Māori, not merely the benefit to Waypoint, a research partner or a funder.

### Manaakitanga | Respect and harm avoidance

Analysis, language and publication must avoid deficit framing, stigmatisation and interpretations that blame Māori communities for structural or service-level outcomes.

### Kaitiakitanga | Guardianship

Storage, transfer, access, retention and deletion choices should strengthen rather than weaken the ability of Māori governance to exercise oversight over Māori data.

## Interim decision rights

Waypoint does not yet have a constituted Māori Data Governance Group. Until one is confirmed, the following restrictive interim position applies.

### Product team may approve

The Waypoint product team may implement controls that reduce data collection, strengthen privacy, reduce access, improve security, correct errors or give users more control.

### Product team may not unilaterally approve

The product team must not independently authorise:

- iwi-level research or reporting;
- ethnicity/iwi data exports for research;
- publication of Māori-vs-non-Māori outcomes;
- external secondary use of Māori data;
- commercial sale or licensing of Māori data;
- algorithmic personalisation or eligibility decisions based on ethnicity or iwi;
- a material weakening of Māori data-location or access controls;
- a new provider that materially changes Māori data jurisdiction without governance review.

### Governance body to be confirmed

Before those uses can be enabled, Waypoint should establish a Māori data-governance function with appropriate Māori expertise and genuine decision authority. Its final form may be an advisory/governance group, named partner organisation or another structure agreed with Māori partners.

The governing record should identify:

- members and relevant expertise;
- conflicts of interest;
- quorum/decision method;
- matters requiring approval;
- escalation route;
- review cadence;
- how affected Māori communities, iwi or research partners are involved where appropriate.

## Current data-use gates

The following controls are effective immediately as Waypoint's interim policy:

1. Ethnicity and iwi remain outside current professional-sharing scopes.
2. The signup research-interest setting is not research consent.
3. Iwi-level research, reporting, aggregation, publication and external secondary use remain disabled.
4. No ethnicity/iwi-based algorithmic targeting, risk scoring or access decisions are permitted.
5. A research protocol may not treat collection of iwi as automatic permission to analyse or publish iwi-level findings.
6. New external exports containing Māori cohort identifiers, ethnicity or iwi require documented governance review.
7. Material provider or residency changes affecting Māori data require a new governance/risk decision.
8. Security incidents involving Māori data must explicitly record that Māori data is involved and consider Māori governance/communication obligations in addition to Privacy Act obligations.

## Interim residency decision

### Decision

Keep the current US-hosted Neon production database during controlled MVP hardening only. Do not migrate infrastructure solely to create the appearance of Māori data sovereignty before governance and architecture requirements are agreed.

### Rationale

An immediate move from Virginia to Sydney would reduce distance and change jurisdiction, but it would still be offshore and would not itself create Māori governance. A rushed provider migration could also create availability, security or data-integrity risk without resolving the underlying governance question.

A New Zealand-hosted option may better support jurisdictional control and Te Mana Raraunga's preference for storage in Aotearoa where possible, but the final selection must consider security capability, resilience, backups, contractual access, subprocessors, cost, migration risk and partner requirements.

### Risk acceptance boundary

The current US location is accepted only for the limited pre-pilot hardening environment. This is not an indefinite production-risk acceptance and not an approval for a health-service rollout or formal research cohort.

## Mandatory residency review triggers

A formal residency/provider decision must be reopened before any of the following:

- external pilot recruitment beyond controlled internal/test use;
- a health provider or funder requires a residency/security position;
- a formal research protocol begins collecting participant data;
- Māori governance partners require a different location or provider model;
- material volumes of Māori/iwi data are collected;
- a new analytics, AI, email, monitoring or research processor is introduced;
- Neon/Vercel materially change relevant location, access or subprocessor terms;
- a security/privacy incident changes the risk assessment.

## Options to assess at the residency gate

### Option A: retain current US hosting

Possible only with an explicit documented risk decision, verified processor terms, security controls, provider/subprocessor register, clear participant notices where required and Māori governance acceptance for the intended use.

### Option B: Australian-region hosting

May improve latency and reduce some jurisdictional distance, but remains offshore. It must not be presented as satisfying Māori data sovereignty merely because it is geographically closer.

### Option C: New Zealand-hosted infrastructure

Preferred for investigation where a suitable service can meet Waypoint's security, resilience and operational requirements. New Zealand physical location does not remove the need to examine offshore ownership, support access, subprocessors or governance.

## Pilot gates created by Phase 4H

Before Waypoint describes itself as ready for an external pilot involving real participants, the following should be completed or explicitly accepted by the appropriate governance authority:

- [ ] Name the Māori data-governance partner/group or agreed equivalent.
- [ ] Review and approve the scope of Māori decision rights.
- [ ] Confirm database, application, logs, backups and support-access locations contractually.
- [ ] Complete the provider/subprocessor register.
- [ ] Decide whether the current US database is acceptable for the proposed pilot or approve a migration plan.
- [ ] Confirm participant/privacy wording accurately describes offshore processing where material.
- [ ] Agree rules for Māori cohort analysis, aggregation thresholds, interpretation and publication.
- [ ] Agree incident/escalation expectations where Māori data is involved.
- [ ] Define review frequency and change-control triggers.

## What Phase 4H does not do

This phase does not:

- appoint Māori governance members on their behalf;
- claim Māori data sovereignty has been achieved;
- migrate production infrastructure;
- authorise iwi research;
- authorise publication of Māori outcomes;
- create formal research consent;
- replace privacy, security, ethics or legal review.

## References

- Te Mana Raraunga, Principles of Māori Data Sovereignty: https://www.temanararaunga.maori.nz/principles-of-maori-data-sovereignty
- Te Mana Raraunga, Māori Data Sovereignty resources: https://www.temanararaunga.maori.nz/resource-hub-copy
- Office of the Privacy Commissioner, Principle 12: https://www.privacy.org.nz/privacy-principles/12/
- Office of the Privacy Commissioner, Sending information overseas: https://www.privacy.org.nz/responsibilities/disclosing-personal-information-outside-new-zealand/
- NZ Digital Government, Cloud Jurisdictional Risk guidance: https://www.digital.govt.nz/standards-and-guidance/technology-and-architecture/cloud-services/assess-the-risks/cloud-jurisdictional-risk-guidance
- Health New Zealand, HISO 10029.4:2025 HISF Guidance for Suppliers.

## Change control

This decision should be reviewed whenever a residency trigger occurs and at minimum before any external pilot or formal research deployment. Future decisions must preserve the historical record rather than silently overwriting why a previous architecture was accepted.