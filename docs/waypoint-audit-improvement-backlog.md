# Waypoint Audit Improvement Backlog

This document records the current improvement recommendations identified during the August 2026 product, safety, privacy, research-readiness and technical audit of Waypoint.

## Priority definitions

- **P0**: fix before wider external testing or use with vulnerable users.
- **P1**: required for clinical/research readiness and a credible pilot.
- **P2**: engineering, product and governance maturity work.
- **P3**: future opportunities that should not distract from validation of the core intervention.

## P0 — Safety, integrity and access control

1. Remove fabricated onboarding check-in data. Onboarding must not create synthetic mood, urge or wellbeing observations.
2. Treat onboarding information as baseline/profile data and daily check-ins as user-reported observations only.
3. Secure onboarding completion so the server gets the user identity from the authenticated session, never from a browser-supplied user ID.
4. Secure onboarding progress-saving using the same session-owned identity model.
5. Do not delete legitimate daily check-in history when onboarding is completed or repeated.
6. Audit every API route for insecure direct object reference / user-ID trust issues.
7. Redesign the SOS feature so it never claims a person has been notified unless a monitored notification actually occurred.
8. Until monitored escalation exists, route users to an immediate-support page with New Zealand emergency, mental-health, alcohol/drug and gambling-support resources.
9. Clearly state that Waypoint is not a monitored emergency-response service.
10. Replace Australian and US emergency/support information with verified Aotearoa New Zealand information.
11. Remove the fallback JWT secret and require JWT_SECRET to be configured.
12. Replace fast SHA-256 password hashing with a password-specific algorithm such as Argon2id, with a migration plan for existing users.
13. Remove internet-facing database setup and migration endpoints from the deployed application.
14. Re-enable TypeScript build checking and resolve build errors rather than ignoring them.
15. Make the current MVP explicitly adult-only (18+) unless and until a youth safeguarding and consent model is deliberately designed.

## P1 — Clinical and research integrity

16. Keep conversational onboarding for personalisation, but create a separate validated baseline/outcome-measure layer for formal research.
17. Have the research team select validated gambling, wellbeing, distress, quality-of-life, treatment-engagement and comorbidity measures as appropriate.
18. Separate product data, research data and clinician-shared data conceptually and technically.
19. Add defined research measurement schedules (for example baseline and agreed follow-up points) rather than treating product telemetry as the primary outcome measure.
20. Keep daily mood, urge, behaviour, skill and reflection data as useful self-monitoring/product data unless specifically approved for research use.
21. Replace clinical-sounding dashboard interpretations with factual descriptions of self-reported change unless an interpretation has been validated.
22. Create a clinical-content evidence register for every module and major safeguard/resource item: source/framework, adaptation, reviewer, version, review date and next review.
23. Temporarily use evidence-informed / informed-by wording rather than unqualified evidence-based claims until content review is complete.
24. Create a documented self-harm/suicide safety protocol with clinical partners before automated escalation or clinician notification is introduced.
25. Resolve the inconsistency where self-harm is screened during broad addiction onboarding but only monitored during daily check-ins for mental-health journeys.
26. Decide intentionally which module reflections are ephemeral, stored for personalisation, clinician-shareable, or research-eligible.
27. Version the intervention itself so a future study can identify which content/logic version each participant used.

## P1 — Privacy, consent and governance

28. Publish a genuine New Zealand Privacy Policy covering collection, purpose, storage, retention, access, deletion, research use, community data and professional sharing.
29. Version Terms, Privacy Policy, community terms, research consent and professional-sharing consent.
30. Store the exact version and timestamp accepted by each user.
31. Make optional research consent genuinely changeable/withdrawable in Settings, subject to the rules of any formal study protocol.
32. Add a real account/data deletion workflow and document retention/anonymisation exceptions.
33. Add audit logs for consent changes, clinician connections, clinician access, moderation, research exports and administrative actions.
34. Co-design Māori data governance, interpretation, access, secondary use and dissemination with appropriate Māori leadership rather than treating this as a translation task.
35. Add genuine Pacific cultural/research capability where appropriate to the research design and service model.

## P1 — Clinician connection

36. Replace permanent user-derived identifying codes with cryptographically random, expiring invitations.
37. Create verified professional accounts with organisation, role, verification status and appropriate access controls.
38. Require explicit client approval before a clinician connection becomes active.
39. Preserve granular sharing permissions for journey progress, check-ins, skills, values, safeguards and sensitive free-text content.
40. Let clients revoke professional access at any time.
41. Record professional data-access audit events.
42. Design the clinician dashboard around concise weekly summaries and meaningful change, not excessive graphs.
43. Clearly distinguish information available for later clinical review from active/continuous monitoring.
44. Co-design the clinician-facing information set with frontline services before finalising the portal.

## P1 — Community safety

45. Build a moderation console for open reports, context, action, notes, escalation and resolution.
46. Define rules for gambling promotion, financial solicitation, drug sales, harassment, threats, predatory behaviour, self-harm content, personal-contact sharing and attempts to identify anonymous members.
47. Define moderation coverage and response expectations rather than implying continuous monitoring unless it exists.
48. Decide whether communities are peer-led, professionally moderated or a hybrid.
49. Preserve the separation between public community aliases and account identity.
50. Add rate limits and abuse controls for community posting/reporting.

## P2 — Engineering maturity

51. Add automated authentication and authorisation tests.
52. Add automated onboarding and daily-check-in tests.
53. Add consent and clinician-sharing permission tests.
54. Add community membership/moderation permission tests.
55. Add end-to-end tests for core user journeys.
56. Add rate limiting to login, signup, password reset, invitations, posts and other abuse-sensitive endpoints.
57. Complete the password-reset workflow using single-use expiring tokens, secure email delivery and no production logging of reset URLs.
58. Review Content Security Policy, HSTS, frame protection, referrer policy, CSRF and XSS controls.
59. Adopt one controlled database migration framework.
60. Establish tested backups and restore procedures.
61. Separate development, staging, pilot/research and production environments.
62. Add privacy-conscious error monitoring, uptime monitoring and critical workflow observability.
63. Document data flows and data classification for sensitive fields.

## P2 — Product and UX

64. User-test onboarding length, completion, abandonment points, cognitive load and sensitive-question burden.
65. Consider quick-start versus full onboarding if evidence shows the current flow is too demanding.
66. Keep Waypoint modular so a user can engage only with check-ins, learning, community or professional support if desired.
67. Personalise module recommendations transparently rather than using opaque automated clinical decision-making.
68. Add an optional non-judgmental post-setback reflection flow for context, triggers, skills and next steps.
69. Allow correction of mistaken check-ins while preserving revision history where research integrity requires it.
70. Reconsider unbroken streaks as the primary engagement mechanic; test more forgiving measures such as check-ins over a rolling period.
71. Ensure gamification represents engagement, not a claim of recovery severity or clinical improvement.
72. Complete professional brand, tone, imagery and accessibility review.
73. Work toward WCAG-conformant keyboard access, contrast, screen-reader support, scaling, reduced motion, clear forms and cognitive accessibility.

## P2 — Population and cultural design

74. Define the first pilot/research population narrowly enough to evaluate safely and meaningfully.
75. Default the first formal gambling-harm evaluation to adults unless a youth pathway is deliberately designed with safeguarding expertise.
76. Co-design Māori wellbeing concepts, whānau framing, navigation, values, recovery language and data governance from the foundation.
77. Establish Pacific design/research input rather than assuming cultural capability based on names or affiliations.

## P3 — Future opportunities

78. Organisation portal for clinicians, clients, cohorts, invitations and governed aggregate outcomes.
79. Organisation/professional licensing model while keeping individual access free or low-barrier.
80. Researcher portal for approved access to governed de-identified datasets, not direct production database access.
81. Formal research export pipeline with cohort IDs, measure versions, timestamps, missing-data rules, consent status and a data dictionary.
82. Appropriate health-system/CRM integrations only after the core intervention and service workflow are validated.
83. Longitudinal implementation analytics that distinguish engagement from outcome and preserve privacy.

## Suggested implementation sequence

### Batch 1 — Safety & Integrity Pass
- remove fabricated onboarding daily check-in;
- bind onboarding writes to authenticated session;
- stop onboarding from deleting daily-check-in history;
- remove public database setup/migration routes;
- replace misleading SOS behaviour with immediate support resources;
- correct New Zealand emergency/support content;
- remove JWT fallback secret;
- fix Terms version/date wording;
- reduce unsupported evidence/24-7 support claims;
- enforce an initial 18+ MVP boundary.

### Batch 2 — Security & privacy foundation
- password hashing migration;
- API authorisation sweep;
- Privacy Policy and consent versioning;
- research-consent settings and account deletion;
- rate limiting and security headers;
- tests and migration discipline.

### Batch 3 — Partnership-led clinical/research design
- evidence register and content review;
- validated research measures;
- self-harm/suicide safety protocol;
- Māori/Pacific governance and cultural design;
- clinician workflow and sharing model;
- community moderation operating model.

### Batch 4 — Research implementation
- clinician portal;
- research measurement layer;
- audit logging;
- intervention versioning;
- research export/data dictionary;
- pilot/research environment and operational governance.

## Audit principle

Waypoint should be presented as a substantial founder-built functional MVP that is ready for structured co-design and evaluation, not as a finished or clinically validated health platform. The next version should be shaped with the clinicians, researchers, services and communities who would research, deliver and use it.