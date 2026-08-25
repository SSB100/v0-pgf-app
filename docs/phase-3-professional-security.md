# Phase 3: Professional security and pilot-readiness controls

## Scope

Phase 3 hardens the professional-access foundation before real client information is made available to verified professionals.

## Strong authentication

Professional and administrator accounts require TOTP authenticator MFA before sensitive professional or administrative functions are available.

- Password sign-in alone does not create a client-data-capable professional session.
- Authenticator secrets are encrypted before database storage.
- A separate `MFA_ENCRYPTION_KEY` server secret is required and must not be committed to GitHub.
- Recovery codes are generated once, shown once and stored only as keyed hashes.
- Repeated failed MFA attempts trigger a temporary lock.
- MFA verification is recorded in the session and is checked again at sensitive API boundaries.

## Session revocation

Users have a security version. Security-sensitive administrative actions increment that version, invalidating previously issued Waypoint sessions even if their JWT expiry time has not yet been reached.

## Administrative verification

There is no public professional-verification endpoint. A Waypoint administrator must:

1. sign in as an account whose `users.role` is `admin`;
2. pass MFA;
3. review professional identity and registration information;
4. review or create the organisation record;
5. record a verification note where appropriate;
6. explicitly verify the professional and organisation.

Every privileged action is recorded in the administrative audit trail and professional verification history.

## Suspension

Suspension immediately:

- prevents professional-data access;
- revokes unused professional invitations;
- pauses active client-professional relationships;
- invalidates the professional's existing sessions.

A paused client relationship does not silently resume if a professional is later re-verified. The relationship remains paused until it is deliberately resumed through the client-controlled workflow.

## Offboarding

Offboarding is stronger than suspension. It:

- revokes active sharing grants;
- revokes unused invitations;
- ends pending, active and paused professional relationships;
- disables the professional's MFA factor;
- invalidates existing sessions;
- records the reason and administrative actor.

## Controlled MFA recovery

If a professional loses both their authenticator and recovery codes, Waypoint does not provide an unauthenticated self-service MFA bypass. An administrator can reset MFA only after an external identity-verification process. The reset is audited, invalidates existing sessions and requires the professional to set up a new authenticator before client access can resume.

## Required production configuration

Before professional MFA is used in a live environment, configure a high-entropy `MFA_ENCRYPTION_KEY` in the hosting environment. Use a unique secret for Waypoint production and separate values for non-production environments.

Environment-variable changes must be followed by a fresh deployment so the new deployment receives the current secret configuration. Professional registration fails safely before creating an account when the MFA encryption secret is unavailable.

## Automated security policy tests

`pnpm test` runs Node's built-in test runner against the pure access-policy module. The initial tests assert that:

- professional access fails if professional verification is missing;
- professional access fails if organisation verification is missing;
- professional access fails without active MFA;
- professional access fails if the current session has not passed MFA;
- client-summary access requires an active relationship and active sharing grant;
- administrative verification requires both the administrator role and MFA.

These policy tests supplement, rather than replace, integration and penetration testing.

## Deliberate remaining boundaries

Phase 3 does not claim the professional portal is ready for a clinical pilot by itself. The following remain required before live pilot use:

- external security review / penetration testing;
- final data-residency and Māori data-governance decision;
- clinician co-design review of summary content;
- tested incident-response and privacy-breach procedures;
- verified organisational operating process for administrator identity and professional credential checking;
- broader API integration tests using isolated test data.
