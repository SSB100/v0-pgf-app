# Full baseline onboarding restoration

## Product decision

Waypoint's initial onboarding is intended to establish a meaningful baseline, not only get a new client to the dashboard as quickly as possible.

The three-step minimum onboarding introduced during Phase 5D2 is therefore no longer the active onboarding experience. New and incomplete client accounts should use the existing comprehensive onboarding flow that was active before Phase 5D2A/5D2B.

## Restoration source

The reference point is main commit `be657473a8424f4af838e1d330ee2c4e356a44b7`, the last main commit before progressive/minimum onboarding work began.

The original `components/onboarding/onboarding-flow.tsx` and its step components were never deleted and remain compatible with the current validated `/api/onboarding/complete` endpoint.

## Baseline areas restored

The active flow again collects, where relevant:

- Waypoint focus / journey areas
- topic-specific history, patterns, triggers and impacts
- safety-related self-report questions already present in the original flow
- Life Garden / values selection and ranking
- strengths
- a first real Daily Check-in
- Growth Companion selection

Onboarding completion persists the person's actual submitted baseline data. It must not fabricate or infer answers.

## Compatibility boundaries

This restoration is a forward change on current main. It must not revert:

- Phase 5C Journey-response persistence and professional sharing controls
- current authentication and client-role protections
- current dashboard improvements
- current Settings preference editing
- optional demographics/research settings outside onboarding

Existing accounts that have already completed onboarding are not automatically reset or forced through onboarding again.

## Draft saving

The comprehensive flow can contain substantially more data and more than three pages. Draft saving therefore supports steps 1 through 50 and up to 100 KiB, while retaining current client-only and completed-onboarding protections.
