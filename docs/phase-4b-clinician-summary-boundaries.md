# Phase 4B: clinician-facing summaries and data boundaries

## Purpose

Phase 4B defines the professional summary as a narrow, user-authorised window into selected Waypoint activity. It is not a second patient record, a live monitoring service, a diagnostic tool, or a substitute for a clinician's normal assessment and organisational documentation.

## Summary contract

The professional summary uses a versioned response contract (`professional-summary-v1`). Every section is built from an explicit allow-list before it is returned to the professional portal.

The current requestable categories are:

- Journey progress
- Daily check-in summaries
- Skills practice
- Core values

Each category remains separately consented through the existing sharing-grant model.

## Explicit exclusions

The clinician summary must not expose the following through the current scopes:

- private reflections or notes
- Journey exercise responses or quick-check answers
- trigger descriptions or narrative onboarding responses
- self-harm or suicide profile fields
- mental-health profile fields
- community messages
- research data
- client email addresses

Free text is off by design for the professional summary.

## Time-basis labelling

The professional UI must not imply that all sections use the selected check-in window.

- Daily check-ins: rolling 7, 14 or 30 day window selected by the professional
- Journey progress: all recorded completion activity
- Skills practice: all recorded practice activity, with recent items shown
- Core values: current shared selection

Missing check-in days are absence of data and must not be interpreted as symptom-free or gambling-free days.

## Journey response content

The current guided Journey implementation does not persist exercise answers or quick-check responses. Those responses remain in the browser session and are not submitted when module completion is recorded.

Therefore Journey response content is not available to professionals and is not part of the `journey_progress` permission.

If Waypoint later introduces clinician access to Journey responses, it requires a separate workstream with:

1. a distinct consent category, not an expansion of `journey_progress`
2. a user preview showing exactly what response content will be shared
3. a governed persistence model with content/version provenance
4. revocation behaviour
5. professional access auditing at response/module level
6. free-text sensitivity review and data-minimisation rules
7. clinician and lived-experience co-design before real-world use

## Clinical interpretation boundary

The portal presents structured self-reported information. Waypoint does not generate a clinical risk score and must not infer risk, diagnosis, treatment response or clinical significance from missing data or user activity.

Professionals remain responsible for clinical interpretation, direct assessment, escalation and recordkeeping within their own service processes.

## Access controls

Professional summary access continues to require:

- a verified professional account
- a verified linked organisation
- active MFA
- an active professional-client relationship
- an active sharing grant for each returned category

Every client-summary view is recorded in the access audit history.

## UI structure

The professional portal is reorganised into four workspace views:

- Overview
- Connected clients
- Invitations
- Account & security

Only one workflow is foregrounded at a time. This removes the previous single-page information dump while keeping the professional experience usable on desktop and mobile.

## Remaining Phase 4B boundaries

Before pilot use, the summary still needs clinician co-design and review of whether the selected metrics are understandable and useful in practice. This implementation establishes the technical and privacy boundary; it does not claim that the summary is clinically validated or optimised for a specific service model.
