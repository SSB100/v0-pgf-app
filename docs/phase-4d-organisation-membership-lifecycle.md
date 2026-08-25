# Phase 4D: Organisation membership and lifecycle controls

## Purpose

Phase 4D separates three trust decisions that must not be treated as interchangeable:

1. the professional account has passed Waypoint's professional verification process
2. the organisation has passed Waypoint's organisation verification process
3. the professional's current affiliation with that organisation has been independently confirmed and remains active

Professional client access also continues to require active MFA and a current MFA-verified session. A verified professional attached to a verified organisation is not enough if the current organisation membership is absent, suspended or ended.

## Organisation membership is a separate lifecycle object

The professional account keeps the professional's current organisation reference for application routing and display, but the authoritative access gate is the current organisation membership record.

Membership records preserve the history of affiliation rather than silently replacing it when a professional changes organisation. A membership can be active, suspended or ended. Material membership changes produce append-only membership events.

This distinction matters because professional identity, organisation status and current workforce affiliation can change independently.

## Existing affiliation migration

When Phase 4D is introduced, existing professional-to-organisation links are converted into membership records. This is a preservation step, not a new verification event.

A professional who was verified, linked to a verified organisation and not offboarded is backfilled with an active membership. Other existing linked states are backfilled as non-active. The membership event explicitly records that no new verification was performed by the migration.

## Professional access gates

Professional access to client information requires all of the following:

- professional verification status is verified
- a current organisation is linked
- organisation verification status is verified
- current organisation membership status is active
- professional MFA factor is active
- the current session has completed MFA
- for a particular client summary, the professional-client relationship is active and the client has an active sharing grant for the relevant scope

Failure of any gate must fail closed.

## Organisation suspension

Organisation suspension is a security action and requires a substantive administrator reason.

Suspending an organisation:

- changes the organisation trust gate to suspended
- suspends its active organisation memberships and records membership events
- revokes active professional invitation links issued by professionals currently linked to that organisation
- pauses active professional-client relationships for those professionals
- invalidates existing professional sessions through the security-version mechanism
- records the organisation action in administrative audit history

Organisation suspension does not delete historical client relationships, sharing decisions or workforce history.

## Organisation reactivation

Reactivating an organisation restores only the organisation trust gate after an administrator has recorded the review supporting that decision.

It deliberately does not:

- reactivate suspended professional memberships
- resume paused professional-client relationships
- recreate revoked invitation links
- restore a professional session

Each suspended professional affiliation must be independently re-verified through the professional verification workflow before its membership can return to active. This prevents organisation reactivation from silently restoring access for people whose current affiliation may no longer be valid.

## Professional suspension and offboarding

Professional suspension also suspends an active organisation membership. Existing invitation and relationship controls continue to apply.

Professional offboarding ends the current organisation membership and preserves its history. Offboarding continues to end professional-client relationships, revoke active sharing grants and invitations, disable professional MFA, and invalidate existing sessions.

## Organisation transfer and re-verification

If professional re-verification confirms a different organisation:

- the previous open membership is ended and retained as history
- the transfer is recorded in membership events
- a new active membership is created only after the current affiliation passes the structured Phase 4C verification process
- the professional account's current organisation reference is updated

If the same organisation is being re-verified, a suspended membership can return to active only through that structured verification process.

## Administrator boundary

The organisation register is available only to Waypoint administrators who satisfy the existing administrator MFA and role-separation controls.

It is an access-control and workforce-governance screen. It does not expose client health, gambling-harm, recovery, check-in, Journey, skills, values, safeguards, reflections, demographic or research information.

Phase 4D does not create organisation-admin accounts and does not give participating organisations direct access to all clients associated with their workforce. Any future organisation administration role would require a separately designed permission model and explicit client-data boundaries.

## Data minimisation and audit

Membership and organisation lifecycle records should contain only information needed to establish and reproduce access decisions. Do not copy unnecessary identity documents, passwords, MFA codes, recovery codes or client information into organisation or membership notes.

Lifecycle events and administrator audit records are accountability records. They are not a second clinical record.

## Operational responsibilities

Waypoint does not continuously monitor professional registers, employment systems or organisation workforce changes. Participating services will need an agreed operational process for notifying Waypoint of departures, suspensions, role changes and affiliation changes before real pilot use.

The appropriate periodic re-verification interval and responsibility split must be agreed with each participating service and relevant governance leads. Phase 4D provides the technical lifecycle controls needed to enforce those decisions once they are made.

## Governance boundary

These controls strengthen access governance but do not make Waypoint clinically validated, research-ready, compliant with a particular health-sector standard, or institutionally endorsed. External security review, incident-response procedures, service-level operating agreements, Māori data-governance decisions and the separate data-residency workstream remain outstanding before broader real-world deployment.
