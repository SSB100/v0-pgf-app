# Waypoint incident response and privacy-breach procedure

Status: pilot-readiness operating procedure. This document does not claim external security certification or legal review.

## Purpose

Waypoint handles information that may include recovery, wellbeing, gambling-harm, demographic and professional-access data. This procedure defines how a suspected security incident or privacy breach is contained, assessed, recorded, escalated, communicated and reviewed.

The incident register must not become a second copy of breached material. Do not paste client narratives, health records, passwords, tokens, screenshots containing personal information, raw logs with secrets, or lists of affected people into the register. Store only the operational facts needed to manage the incident and reference separately controlled evidence where required.

## Immediate response

1. Protect people first. If there is an immediate threat to life or physical safety, contact emergency services before administrative reporting.
2. Contain the incident without destroying evidence. Examples include revoking sessions or credentials, disabling an affected integration, restricting a compromised account, isolating a vulnerable endpoint, or pausing a data flow.
3. Preserve evidence needed to understand what happened. Record times, systems involved, actions taken and who made each decision. Do not unnecessarily duplicate personal information.
4. Open an incident in the Waypoint admin security register as soon as an incident is credible enough to require investigation.
5. Identify whether the incident affects confidentiality, integrity, availability, privacy, a supplier, or more than one category.

## Privacy-breach assessment

Under the New Zealand Privacy Act 2020, a notifiable privacy breach is an unauthorised access, disclosure, alteration, loss or destruction of personal information where it is reasonable to believe an affected person has suffered serious harm or is likely to suffer serious harm.

Waypoint uses four assessment states:

- `not_assessed`: assessment has not yet been completed.
- `unlikely`: serious harm is assessed as unlikely. The reason for the decision must still be recorded before the incident is closed.
- `possible`: the evidence is unresolved or serious harm cannot yet be ruled out. The incident remains escalated and cannot be closed.
- `likely`: the serious-harm threshold is assessed as met. Privacy Commissioner notification must be recorded before closure, together with affected-person notification or a documented lawful exception.

Relevant harm can include physical, financial, identity, psychological, emotional, employment or safety harm. Health information is inherently sensitive and should increase the care used in assessment. Cultural perspectives of harm must also be considered.

If Māori data is involved or potentially involved, the incident record must flag that fact. Before real pilot use, the response process must define who holds Māori governance decision rights for interpretation, secondary use, communications and post-incident review. The flag is not a substitute for that governance.

## Notification

The Office of the Privacy Commissioner states that organisations must notify a breach that has caused or is likely to cause serious harm as soon as practicable after becoming aware that it is notifiable. OPC states that, ideally, notification should occur within 72 hours even if investigation is continuing.

Waypoint therefore uses 72 hours as an internal escalation target, not as a statutory grace period. If the serious-harm threshold is met earlier, notification should not be deliberately delayed to wait for 72 hours.

Affected people must also be notified as soon as practicable when the breach is likely to cause serious harm unless an exception in the Privacy Act applies. Any reliance on an exception or delay must be recorded with the decision rationale and revisited if circumstances change.

For a cyber-security incident, contact the appropriate New Zealand cyber-security reporting channel when external support or reporting is required. If imminent harm to a person is suspected, contact Police first.

## Operational severity

- Low: limited operational effect, no indication of sensitive-data compromise, readily contained.
- Moderate: meaningful control failure or privacy concern requiring investigation and documented remediation.
- High: substantial exposure, sensitive information, significant service compromise, unresolved serious-harm concern, or material supplier compromise.
- Critical: active major compromise, widespread sensitive-data exposure, serious safety implications, destructive attack or inability to protect affected systems.

Severity supports operational prioritisation. It does not replace the Privacy Act serious-harm assessment.

## Evidence and communications

Use the minimum information necessary in incident records. Evidence containing personal information must be separately access-controlled. Public or user communications should state known facts, practical protective actions and what Waypoint is doing next. Do not speculate, minimise uncertainty, or claim the incident is resolved while material questions remain open.

Where professional organisations are affected, communication does not give organisation administrators access to client health data. Any client-specific communication must follow the existing Waypoint sharing and privacy boundaries.

## Closure requirements

An incident cannot be closed while serious harm is `not_assessed` or `possible`.

For an assessment of `likely`, closure requires:

- Privacy Commissioner notification recorded as completed; and
- affected-person notification recorded as completed, or a lawful exception documented.

For `unlikely`, closure requires an explicit recorded decision on whether OPC and affected-person notification were required.

Closure also requires containment/remediation notes sufficient to explain what changed and what follow-up remains.

## Post-incident review

For high, critical, notifiable, repeated, or culturally significant incidents, complete a post-incident review covering root cause, control failures, detection gaps, affected data, response timing, communication effectiveness, supplier involvement, Māori data-governance implications, remediation owners and deadlines.

The review must distinguish a process improvement from evidence that Waypoint is secure or clinically safe. Internal review does not replace independent security testing.

## Before a real pilot

Complete at least one tabletop incident exercise using this procedure. The exercise should include a simulated sensitive-data breach, serious-harm assessment, a notification decision, communications, evidence preservation, session/access revocation and supplier escalation. Record gaps and update this procedure.

Assign named operational responsibility for privacy, incident command, technical containment, communications and Māori data-governance escalation before handling real pilot data.

## Primary external references

- Office of the Privacy Commissioner, NotifyUs: https://www.privacy.org.nz/responsibilities/privacy-breaches/notify-us/
- Office of the Privacy Commissioner, What is a notifiable privacy breach?: https://www.privacy.org.nz/resources-and-learning/knowledge-base/view/536/
- Office of the Privacy Commissioner, Breach Management: https://www.privacy.org.nz/responsibilities/poupou-matatapu-doing-privacy-well/breach-management/
