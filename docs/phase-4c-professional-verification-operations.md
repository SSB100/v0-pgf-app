# Phase 4C: Professional verification operating procedure

## Purpose

Waypoint professional verification is an access-control decision. It confirms that there is enough independently checked evidence to allow a professional account to use Waypoint's professional features. It is not an endorsement of the person's clinical quality, fitness to practise, competence, employment performance, or suitability for a particular client.

A professional account must remain unable to access client information until the professional, organisation and MFA gates are all satisfied.

## Core rule

Do not verify a professional from applicant-supplied information alone.

The administrator must use independent evidence and record what was checked. An applicant-provided screenshot, social-media profile, email signature, CV, or uploaded document can support a review but must not be the sole basis for approval.

## Required checks before approval

The admin portal requires all of the following to be confirmed:

1. **Identity consistency**: the applicant's name and relevant identifying professional details are consistent with the independent sources checked.
2. **Credential or role basis**: registration, professional membership, or the basis for treating the role as non-regulated has been checked as applicable.
3. **Organisation existence**: the claimed organisation has been independently verified as a real organisation or service.
4. **Organisation affiliation**: the applicant's current relationship with that organisation has been independently confirmed.
5. **Sources recorded**: the administrator records the independent sources used and the date of the checks.
6. **MFA active**: Waypoint enforces this technically before verification can be granted.
7. **Verification note**: the administrator records a substantive explanation of what matched, any limitations, and why approval was justified.

The API enforces the structured verification record. The UI checklist is not the only control.

## Credential pathways

### Regulated professional registration

Where the role is subject to a statutory or authoritative professional register, check the current authoritative register. Match the applicant's name and registration details and review the status shown by the register. Do not approve a regulated-registration pathway using employer confirmation alone.

If the register displays conditions, restrictions, suspension, cancellation, expiry, or another status that the administrator cannot confidently interpret, do not approve the account until the issue has been reviewed by an appropriate governance lead.

### Professional body membership

Where the relevant assurance is membership of a recognised professional body rather than statutory registration, use the body's official directory or direct confirmation through an independently sourced contact channel. Record what membership was confirmed and any material status information available.

### Non-regulated role

Some legitimate support roles may not be subject to a mandatory professional register. Do not invent a registration requirement for those roles. Instead, independently confirm the person's role and current affiliation with the organisation using contact details obtained independently of the application. The verification record must explicitly use the `non_regulated_role` basis.

## Organisation verification

Verify the organisation independently. Useful evidence can include official organisation websites, recognised public registers, government or funder directories, or direct contact using independently sourced contact details.

The administrator should not verify an organisation solely because the applicant supplied an organisation name, website, email domain or document.

A previously verified organisation may be reused, but a new professional's affiliation with that organisation must still be independently confirmed.

## Evidence recording and data minimisation

Record enough information to make the verification decision reproducible without unnecessarily copying identity documents or sensitive personal information into Waypoint.

The verification audit metadata records:

- policy version
- credential / role basis
- primary verification method
- completion of the required checks
- independent source descriptions
- administrator verification note
- organisation used for the approval
- administrator and event timestamps through the existing audit tables

Do not paste passwords, MFA codes, recovery codes, full identity documents, unnecessary personal identifiers, or sensitive client information into verification notes.

## When not to approve

Leave the account pending when:

- the person's identity or professional details do not match independent evidence
- a mandatory registration cannot be found or its status is unclear
- the organisation cannot be independently verified
- the person's affiliation cannot be independently confirmed
- the role or credential basis is ambiguous
- evidence is limited to applicant-controlled sources
- MFA is not active
- there is a material concern that requires governance review

A pending account has no client-data access.

## Suspension and offboarding

Suspension and offboarding remain separate security actions and require a recorded reason.

Suspension pauses active professional-client relationships and revokes active invitations. Offboarding ends relationships, revokes active sharing grants and invitations, disables professional MFA, and invalidates existing sessions through the security-version mechanism.

## Re-verification triggers

The current application does not automate a credential-expiry or periodic re-verification schedule. Before real pilot use, Waypoint must adopt a documented review interval appropriate to the participating services.

Regardless of interval, re-verification should be considered when there is a material change such as:

- organisation change
- professional role or credential change
- registration or membership status concern
- return after suspension or offboarding
- credible report affecting the basis on which access was granted
- material change to the organisation's verification status

## Governance boundary

Waypoint verification is not clinical credentialing on behalf of a health regulator and does not transfer responsibility for workforce credentialing from the participating organisation. For pilot use, the verification procedure and allocation of responsibilities should be agreed with each participating service before client access begins.
