# Waypoint security assurance preparation

Status: internal readiness register. Not an independent security assessment.

## Purpose

This register makes a clear distinction between controls that exist in the Waypoint codebase and assurance that still needs to be performed by an independent or operationally separate party before a real-world pilot.

## Current internal controls

Waypoint currently has internal implementation and testing for:

- professional and administrator TOTP MFA;
- recovery codes and MFA lockout controls;
- session invalidation through security-version rotation;
- client/professional/admin role separation;
- organisation membership lifecycle and offboarding;
- client-authorised professional sharing scopes;
- cross-user ownership checks across the reviewed API surface;
- durable authentication abuse protection;
- versioned clinical content and evidence provenance;
- an incident/privacy-breach register and serious-harm decision workflow;
- administrator audit events for privileged actions.

These are implementation facts. They do not prove that the system is secure against an adversary.

## Assurance still required before real pilot data

### Independent penetration/security assessment

Commission a qualified independent party to assess the deployed application, authentication/session controls, authorisation boundaries, common web vulnerabilities, API abuse, privilege escalation, professional access, administrative interfaces and relevant cloud configuration.

Record scope, date, tester independence, findings, severity, remediation and retest evidence. Do not mark this item complete based on internal review or automated scanners alone.

### Dependency and vulnerability management

Establish a repeatable process for dependency alerts, critical vulnerability triage, patch windows, emergency changes and evidence that critical findings have been resolved. Automated tooling may support this but does not replace ownership of the process.

### Backup and restore exercise

Document what Neon and other suppliers back up, what Waypoint can restore, recovery dependencies and expected recovery times. Perform a controlled restore exercise using non-production or test data and retain evidence of the result.

### Incident-response tabletop

Run the Phase 4G procedure using a realistic simulated incident. Include sensitive recovery data, a professional-access scenario, Māori data considerations, serious-harm assessment, affected-person communications, Privacy Commissioner decision-making and supplier escalation.

### Supplier and infrastructure review

Review Vercel and Neon security responsibilities, access controls, logging, breach-notification obligations, subprocessors, data location/jurisdiction and contractual terms relevant to Waypoint. This is linked to the separate hosting/residency and Māori data-governance decision.

### Secrets and privileged access review

Create a current inventory of production secrets and privileged accounts. Confirm least privilege, MFA where available, owner, rotation approach, emergency revocation and how access is removed when a contributor or provider relationship ends.

### Logging and monitoring

Define which security-relevant events are monitored, who reviews them, expected response times and what signals require an incident to be opened. Logging must avoid unnecessarily copying sensitive client information.

## Pilot gate

Do not describe Waypoint as penetration-tested, certified, compliant, secure-by-assessment or health-sector approved until the relevant external work has actually been performed and its scope supports that statement.

A reasonable minimum technical gate before real pilot data is:

1. high/critical findings from independent security review remediated and retested;
2. backup/restore exercise passed;
3. incident-response tabletop completed and gaps addressed;
4. named incident/privacy responsibilities assigned;
5. supplier/residency decision documented;
6. Māori data-governance decision rights defined;
7. production privileged-access inventory reviewed;
8. monitoring and vulnerability-management responsibilities operational.
