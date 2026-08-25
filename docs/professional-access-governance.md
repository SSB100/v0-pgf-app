# Waypoint Professional Access Governance

## Purpose

Professional access is designed to support a user's existing clinical or recovery relationship by making selected Waypoint information easier to review between appointments. It is not a replacement for clinical records, clinical judgement, emergency response or an organisation's own safeguarding processes.

## Access model

Professional access follows this sequence:

1. A professional creates a Waypoint professional account and submits their role and claimed organisation.
2. The account remains pending and cannot create invitations or view clients.
3. Waypoint verifies the professional and separately links them to a verified organisation through a controlled administrative process.
4. A verified professional creates a cryptographically random, short-lived invitation.
5. Only the invitation hash is stored by Waypoint. The clear invitation URL is shown once.
6. The user signs in, sees the professional name, role and verified organisation, and chooses which requested categories to share.
7. Acceptance creates an active professional relationship and explicit sharing grants.
8. A professional can view only the granted categories for an active relationship.
9. Each client-summary view is written to the user's access history.
10. The user can change category permissions, pause the whole connection, resume it while verification remains current, or end it permanently.

## Verification

Self-registration never creates verified professional status.

The current product supports pending, verified and suspended professional states, and separate organisation verification. Before a professional is marked verified, Waypoint should confirm as appropriate:

- identity;
- current role;
- organisation affiliation;
- professional registration where the role is regulated;
- organisational contact details independently of information supplied by the applicant;
- that the organisation understands Waypoint is not live monitoring;
- the professional-use notice and privacy expectations.

A future administrative workflow should record who completed verification, the evidence checked, the date, and any expiry/review date.

## MFA boundary

The Phase 2 portal is suitable for product demonstration and controlled co-design. A real professional must not be enabled for live client-data access in a pilot until stronger professional authentication, preferably MFA or passkey-based step-up authentication, is implemented and tested.

Until that work is complete, production professional verification should remain disabled for real clinical use. Demonstrations should use non-sensitive test data or a dedicated staging environment.

## Data shown to professionals

The first professional summary intentionally supports only:

- Journey completion/progress;
- aggregate and trend information from daily check-ins;
- skills completed and whether the user found them helpful;
- core values explicitly shared by the user.

It does not expose daily-check-in notes, emotional context, awareness-check-in free text, onboarding narratives, self-harm fields, community content, research data, email address or raw private reflections.

Safeguard-plan sharing and selected-reflection sharing remain unavailable until the product has an explicit user-selection and storage model for those categories.

## No automated risk classification

The professional portal does not create labels such as high-risk, relapse-risk or deteriorating. It shows factual, user-reported information and simple descriptive summaries. Clinical interpretation remains with the professional and user.

## No live monitoring

Neither the user nor professional should be told that Waypoint is being watched continuously. A professional viewing a summary later does not create a duty or expectation that they receive real-time alerts from Waypoint.

## Access logging

Opening an authorised client summary creates an application-level access event including the user, professional account, organisation, data scopes, purpose and time. These events are visible through the user's privacy/access history.

Infrastructure logs and security monitoring remain separate from this user-facing accountability log.

## Future work before pilot

- professional MFA or passkey support;
- administrative verification interface and verification audit trail;
- account recovery appropriate to professional accounts;
- role-based organisation administration and staff offboarding;
- explicit review of whether exports should be permitted and, if so, how exports are watermarked/logged;
- penetration testing and professional-access authorisation tests;
- incident and privacy-breach operating procedures;
- data-residency decision and Māori data-governance review;
- clinician co-design of the final summary fields and session workflow.
