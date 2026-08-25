# Phase 4F: Authentication abuse protection and recovery boundary

## Purpose

Phase 4F adds shared abuse controls to Waypoint's public authentication surfaces without introducing a new external security service. The controls are stored in Neon so they remain effective across Vercel function instances and cold starts.

## Covered surfaces

- Client sign-in
- Client account creation
- Professional account registration
- Professional/admin MFA challenge verification

## Rate-limit design

Rate-limit subjects are transformed with a keyed HMAC before storage. The database does not store raw email addresses or raw IP addresses in the rate-limit table.

The limiter uses one current counter per action and pseudonymous subject rather than storing every attempt. Stale counters older than seven days are removed opportunistically by the runtime.

Correct credentials are not blocked by identity-level failed-attempt counters. Failed identity counters are cleared after a successful password verification. This reduces the risk that an attacker can deliberately lock another person's account simply by submitting bad passwords for that email address.

A broader network request limit still applies to sign-in to protect the password-hashing and database path from high-volume abuse.

## MFA

Professional/admin MFA retains its existing account-factor lockout of five unsuccessful attempts followed by a 15-minute temporary lock. Phase 4F adds a separate network-level limiter around the MFA endpoint. The account-factor lock remains the stronger account-specific control.

## Password recovery

Password recovery remains disabled in the MVP.

Waypoint does not currently have a verified transactional-email delivery channel in the application stack. The forgot-password and reset-password endpoints therefore continue to fail closed and do not create, log or accept reset tokens.

Password recovery must not be enabled until the complete recovery pathway includes:

1. verified control of the destination email address;
2. cryptographically random, single-use reset tokens;
3. hashed token storage with a short expiry;
4. token rotation/invalidation after use;
5. security-version rotation after a successful reset so existing sessions are revoked;
6. rate limiting on both reset requests and token submissions;
7. account-security audit events; and
8. an operational process for professional/admin recovery that does not bypass MFA identity verification.

## Data and privacy boundary

Authentication rate-limit data is operational security metadata. It is not clinical data, is not exposed to professionals or organisations, and must not be used for research, behavioural profiling or client risk scoring.

The rate-limit secret may use `AUTH_RATE_LIMIT_SECRET` when configured. If that variable is absent, the runtime derives the keyed hashes using Waypoint's existing `JWT_SECRET`. The secret itself is never written to the database.

## Limits of this phase

These controls reduce routine brute-force, credential-stuffing and automated account-creation abuse. They are not a substitute for external penetration testing, WAF/bot controls, incident response procedures or independent security assurance before a real clinical pilot.
