# Demographic data boundaries

## Status

This document defines Waypoint's current collection and use boundary for ethnicity and iwi affiliation. It is a product-governance control, not a claim that Waypoint has completed Māori data governance, research governance or health-sector assurance requirements.

Phase 4H adds an interim Māori data-governance and residency position. It deliberately keeps material secondary use of iwi data disabled until appropriate Māori decision rights are established.

## Purpose of collection

Waypoint may collect optional ethnicity and iwi affiliation information to support:

- equity monitoring and service-improvement review;
- understanding whether the product is reaching and serving different communities equitably;
- future research only where a separate approved study, consent process and data-governance framework authorise that use.

Providing or declining these questions must not change access to Waypoint.

## Collection design

### Ethnicity

- Self-identified and multiple-response.
- Uses the standard Stats NZ census question categories as visible starting options.
- Supports additional self-described ethnicities.
- Supports `Prefer not to say`.
- Does not infer ethnicity from name, location, iwi, whānau or any other data.

### Iwi affiliation

- Stored separately from ethnicity because iwi affiliation and ethnicity are distinct concepts.
- Multiple-response.
- Uses the Stats NZ 2023 Census guide list as a searchable starting list.
- The guide list is treated as non-exhaustive, so a person can provide an affiliation that is not listed.
- Supports `I don't know / I'm not sure`, `I don't affiliate with an iwi`, and `Prefer not to say`.
- Waypoint does not infer iwi from ethnicity, whakapapa, surname or location.

## Storage boundary

Ethnicity and iwi are stored in the dedicated `user_demographics` record rather than the account identity table or the main behavioural/wellbeing profile table.

The record stores:

- the user's self-identified response values;
- whether a question was provided, not stated or explicitly declined;
- the collection-notice version;
- the classification/question version used at collection time;
- created/updated timestamps.

The values themselves must not be copied into general audit metadata. Audit/policy history may record that the collection notice was acknowledged and the response status, but not the ethnicity or iwi values.

## Professional sharing boundary

Ethnicity and iwi are not part of any current professional sharing scope and must not be added implicitly to:

- `journey_progress`;
- `daily_checkins_summary`;
- `skills_practice`;
- `core_values`.

A connected professional does not receive ethnicity or iwi merely because the client has enabled one or more current scopes. Any future professional use requires a defined service purpose, explicit sharing rule, updated client-facing wording and governance review.

## Research and secondary-use boundary

The signup research-interest setting does not authorise research use of demographic data.

The following remain disabled until an appropriate Māori data-governance function has genuine decision authority over the proposed use:

- iwi-level research or analysis;
- external ethnicity/iwi research exports;
- iwi-level service-performance reporting;
- publication or dissemination of iwi-level findings;
- Māori-vs-non-Māori outcome publication without governance review;
- algorithmic targeting, risk scoring or eligibility decisions based on ethnicity or iwi;
- commercial secondary use of Māori or iwi data.

A future approved use should define aggregation thresholds, re-identification controls, access roles, retention, data location, provenance, interpretation and dissemination review.

## Māori data is broader than demographic fields

The `user_demographics` table is not the boundary of Māori data.

Consistent with Te Mana Raraunga, data produced by Māori or about Māori may carry Māori rights and interests. Depending on context this may include wellbeing/check-in data, engagement, outcomes, community participation, professional-support data and derived or aggregate statistics about Māori users.

Accordingly, removing ethnicity/iwi columns from a dataset does not automatically remove all Māori data-governance obligations.

## Residency boundary

The current live Neon production database is hosted in AWS `us-east-1` in the United States. Waypoint must not describe this as Aotearoa-only or New Zealand-resident storage.

Phase 4H accepts the current location only for controlled MVP hardening while provider/residency requirements are formally assessed. A residency/provider decision must be reopened before an external pilot or formal research deployment.

See `docs/phase-4h-maori-data-governance-and-residency.md` and `docs/data-location-and-subprocessor-register.md`.

## User rights

Demographic information is user-owned personal information. It is included in the user's Waypoint data export and is covered by correction/deletion/privacy-request processes.

A later product pass should provide a direct self-service edit interface for ethnicity and iwi after signup. Until that exists, correction can be handled through the existing privacy-request pathway.

## Current limitation

Collection does not make the dataset research-ready, clinically validated, health-sector compliant or Māori-governed. Those are separate readiness decisions and must not be inferred from the presence of demographic fields.
