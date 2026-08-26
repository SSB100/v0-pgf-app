# Phase 4I follow-up: external pilot gates

This file is a stable repository reference for operational/governance work that remains after the Phase 4I technical hardening merge.

These items are **not** silently waived by merging Phase 4I. They must be completed or explicitly accepted by the appropriate governance authority before Waypoint is described as ready for an external health-service or research pilot.

## Database recovery and architecture

- [ ] Execute a historical Neon point-in-time preview/recovery rehearsal within the configured history window.
- [ ] Create and restore a controlled Neon snapshot into an isolated branch and verify integrity.
- [ ] Record observed recovery duration.
- [ ] Decide whether the current 6-hour continuous history window is sufficient for the intended pilot.
- [ ] Decide whether a longer Neon history window, scheduled snapshots and/or independent encrypted backup are required.
- [ ] If an independent backup is adopted, define storage location, encryption, access, retention, deletion and Māori data-governance controls and test restoration into a clean environment.

## Supplier assurance

### Neon

- [ ] Complete contractual/DPA review for the actual account arrangement.
- [ ] Review relevant subprocessors and data-use restrictions.
- [ ] Verify backup/snapshot storage and support-access jurisdictions.
- [ ] Verify incident-notification/support escalation arrangements.
- [ ] Verify deletion/termination treatment of history, snapshots and backups.

### Vercel

- [ ] Approve the production hosting plan for the intended pilot.
- [ ] Verify applicable data-processing terms for the approved plan.
- [ ] Review relevant subprocessors.
- [ ] Verify execution, logging, backup and support-access locations relevant to Waypoint.
- [ ] Verify incident-notification, deletion and support arrangements.
- [ ] Decide whether a fallback hosting runbook/provider is required.

## Repository and secret recovery

- [ ] Enable appropriate GitHub `main` branch protection/ruleset and require the Waypoint review workflow.
- [ ] Confirm repository-owner MFA/account recovery arrangements.
- [ ] Define production-secret recovery/rotation without storing secret values in GitHub.
- [ ] Decide whether independent source-code export/backup is required.

## Operating readiness

- [ ] Run the combined security/privacy/continuity tabletop required by the incident-response procedure.
- [ ] Assign named operational owners for incident command, technical recovery, privacy, communications, supplier escalation and Māori data-governance escalation.
- [ ] Approve recovery point objective (RPO) for the intended pilot.
- [ ] Approve recovery time objective (RTO) for the intended pilot.
- [ ] Decide and complete/schedule independent security assurance appropriate to pilot risk.

## Governance and residency

- [ ] Confirm the Māori data-governance partner/group or agreed equivalent and real decision rights.
- [ ] Decide whether the current US-hosted database is acceptable for the proposed pilot or approve a migration plan.
- [ ] Verify participant/privacy wording accurately reflects material offshore processing.
- [ ] Agree Māori cohort analysis, interpretation, publication and incident-escalation boundaries.
- [ ] Record the approved pilot target architecture and provider plan.

## Release boundary

Phase 4I technical merge demonstrates and records current recovery controls. Completion of this list is a separate **external-pilot approval gate** and should be reviewed alongside the Phase 4H Māori data-governance/residency decision and the data-governance register.
