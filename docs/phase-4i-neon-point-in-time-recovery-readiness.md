# Phase 4I: Neon point-in-time recovery readiness

## Status

**Capability verified; destructive production restore not performed.**

This record captures the Waypoint-specific Neon recovery configuration verified on 26 August 2026, the provider-supported point-in-time recovery workflow, and the remaining isolated rehearsal needed before Waypoint can claim that point-in-time recovery has been tested.

It supplements `docs/phase-4i-operational-resilience-and-supplier-assurance.md`.

## Waypoint-specific configuration verified

Connected Neon project metadata for `PGFapp` confirms:

- Project ID: `wild-wildflower-37967772`
- Production/root branch: `main`
- Production branch ID: `br-super-wildflower-a4bnoizt`
- PostgreSQL version: 17
- Region: AWS `us-east-1`
- Subscription type: `free_v3`
- Configured history retention: `21600` seconds
- Effective instant-restore history window at review: **6 hours**
- Branch limit reported by the account: 10
- Production branch protection: not enabled at review

The 6-hour recovery window is a project-specific observed configuration, not a generic Neon marketing assumption.

## Provider recovery capability verified

Current Neon documentation states that:

1. Neon continuously retains branch history within the configured history window.
2. A root branch can be restored to a specific timestamp or LSN within that window.
3. The restore workflow can preview historical data before committing a restore.
4. When a root branch is restored to its own history, Neon requires preservation of the current state under a backup branch.
5. Manual snapshots are available on the Free plan, with one manual snapshot permitted at a time under the currently documented Free-plan limit.
6. Automated backup schedules require a paid plan.
7. Snapshot restore can be performed as a multi-step restore into a new branch so restored data can be inspected before any production cutover.

Primary provider reference reviewed:

- Neon Backup & Restore documentation: `https://neon.com/docs/guides/backup-restore`
- Neon recovery workflows: `https://neon.com/branching/recovery-workflows`

## What has already been tested

Recovery rehearsal 01 successfully proved that an isolated child branch could:

- diverge deliberately from production;
- contain a synthetic recovery marker;
- be reset from its production parent;
- return to baseline row counts;
- return to an empty schema diff against production.

That rehearsal did **not** exercise historical point-in-time data.

## Why production PITR was not used for this rehearsal

The connected Neon actions available to this development session expose safe branch reset and inspection operations but do not expose the timestamp/LSN restore or snapshot-create/restore operations required for a genuine PITR rehearsal.

A genuine root-branch PITR operation would alter the production branch, even though Neon preserves the pre-restore state as a backup branch. Production must not be altered merely to demonstrate a control when a safer preview/multi-step method is available through the Neon Console, CLI or API.

Therefore no production restore was attempted from this session.

## Required PITR rehearsal

Before Phase 4I is complete, perform the following using a Neon interface that exposes timestamp restore preview or snapshot restore.

### Preferred rehearsal: historical preview / isolated recovery

1. Confirm the current `PGFapp` history window immediately before testing.
2. Select a timestamp comfortably inside the window, preferably 30-60 minutes before the rehearsal.
3. Use Neon's historical preview capability to inspect that timestamp without changing production.
4. Record representative integrity values from the historical state, including:
   - schema objects present;
   - `users` count;
   - `daily_checkins` count;
   - `journey_completions` count;
   - `client_professional_links` count;
   - `sharing_grants` count;
   - `consent_events` count;
   - security/governance table availability.
5. If the selected timestamp differs meaningfully from current state, verify that the historical view correctly reflects the earlier state.
6. Where available, create a manual snapshot from the known-good state and restore it using a **multi-step restore** into a separate branch.
7. Connect only to the restored branch and repeat the integrity checks.
8. Compare the restored schema with production and explain expected differences caused by the selected historical timestamp.
9. Delete temporary recovery resources after evidence is recorded, unless retained intentionally as a controlled backup.

### Production restore is not required merely to pass the rehearsal

The purpose of the rehearsal is to demonstrate that Waypoint can identify and recover a known-good historical state. A destructive production cutover should only be rehearsed where operational risk is justified and explicitly approved.

If a production restore is ever tested, the current production state must first be preserved using Neon's required backup-branch mechanism and the test must include an explicit rollback plan.

## Recovery-point implication

The current observed 6-hour history window means Waypoint cannot currently rely on Neon instant restore to recover arbitrary states older than six hours.

That is a material pre-pilot limitation.

A future approved RPO must therefore be supported by one or more of:

- a longer Neon history window under an appropriate paid plan;
- scheduled snapshots under an appropriate paid plan;
- controlled manual snapshots before high-risk changes;
- an independently governed off-provider backup/export strategy.

Waypoint must not claim a 24-hour, multi-day or zero-data-loss recovery capability while the only verified continuous history window is six hours.

## Snapshot position

Neon's current documentation states that manual snapshots are available to Free users, with one manual snapshot permitted at a time. This creates a useful pre-change recovery checkpoint for the current MVP, but it is not equivalent to a scheduled backup programme.

For an external pilot, decide whether the production plan should support scheduled backups and a longer recovery history before relying on Neon as the sole recovery layer.

## Phase 4I evidence status after this review

- [x] Neon subscription type recorded: `free_v3`.
- [x] Waypoint-specific history window recorded: 6 hours.
- [x] Provider timestamp/LSN restore capability verified from current documentation.
- [x] Provider manual snapshot capability and Free-plan limit identified.
- [x] Isolated branch-reset recovery rehearsal completed.
- [ ] Historical point-in-time preview executed against a known timestamp.
- [ ] Manual snapshot created for a controlled recovery test.
- [ ] Snapshot restored into a separate branch and integrity verified.
- [ ] Recovery duration recorded.
- [ ] Longer-history/scheduled-backup plan decision made for pilot.
- [ ] Independent provider-loss backup decision made.

## Pilot decision raised

The current Free-plan database recovery configuration should be treated as suitable for MVP hardening, not automatically accepted for an external wellbeing/health-service or research pilot.

Before pilot approval, the governance and technical owners should decide whether six hours of continuous history plus manual snapshot capability provides adequate recovery protection for the intended service, or whether the Neon plan/recovery architecture must be upgraded.
