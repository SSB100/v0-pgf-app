# Phase 5D2E-A — Companion preference and progression model

**Status:** Implementation design checkpoint

**Related issues:** #59 — progressive onboarding / first-use; #65 — companion system redesign

## 1. Purpose

Waypoint's Growth Companion began as a required minimum-setup choice. The product direction has now changed: companions should remain a meaningful engagement option, but they must not be mandatory and must not define the underlying progression system.

This checkpoint defines the state and compatibility model before Settings or onboarding are changed again.

The goals are to:

- let a client explicitly choose no companion;
- preserve the same Growth Credits, levels and milestones whether a companion is used or not;
- preserve every existing user's current companion and progression;
- support future companion families/categories without another profile migration for each art expansion;
- keep visual evolution independent from clinical meaning;
- leave room for companions to become active Journey guides later without coupling Journey completion to a specific image set;
- allow focus areas and companion preference to be safely editable after onboarding.

This document does **not** choose the final companion families, Māori/Aotearoa concepts, art direction, animation system or Journey-map interaction. Those remain later design work under #65.

---

## 2. Product principles

1. **Companion use is optional.** Choosing no companion must be a first-class choice, not a hidden skip state.
2. **No-companion mode is not inferior.** A client who does not want a creature/character still receives the same Growth Credits, level progression, milestones and useful feedback.
3. **Engagement is not recovery.** Credits, levels and companion stages represent selected Waypoint engagement only. They do not measure health, recovery, relapse risk, clinical progress or personal worth.
4. **Changing presentation must not rewrite history.** Switching companion, companion family or no-companion mode never deletes or recalculates check-ins, Journey progress, values, strengths, streaks, credits or sharing permissions.
5. **Existing users keep what they chose.** No migration should silently replace an existing companion.
6. **Artwork is presentation, not state.** User progression should survive changes to image files, stage artwork or future animation.
7. **Cultural design requires governance.** Future Māori/Aotearoa-influenced companion families require appropriate cultural review before release; AI-generated imagery alone is not approval.
8. **Future Journey use must remain optional.** If companions later travel through Journey modules, no-companion users must receive an equally usable Journey path experience.

---

## 3. Current state

The current profile model already separates most progression from the visual choice:

- `user_profiles.growth_avatar` stores the selected companion ID.
- `user_profiles.tree_growth_level` stores the current progression level/stage state used by the existing Growth Companion.
- `user_profiles.level_credits` stores Growth Credits.
- `user_profiles.check_in_streak` and related activity state are separate.
- Journey completion is stored separately from companion selection.

The current minimum-onboarding sanitizer accepts one of five companion IDs and rejects all other values:

- `growth_tree`
- `rising_phoenix`
- `dragon_hatchling`
- `crystal_sentinel`
- `spirit_fox`

The current onboarding UI requires a valid companion before completion.

The current generic profile API returns `growth_avatar`, `tree_growth_level` and `level_credits`, which is sufficient to initialise an editable preference UI later.

---

## 4. Core state-model decision

### 4.1 Keep progression independent of companion identity

Do **not** create separate credit balances, levels or Journey progress per companion.

The durable progression model remains one account-level set of engagement data:

- Growth Credits / points
- account engagement level
- milestones/streaks where applicable
- Journey progress

A companion is a visual representation of that progression, not the owner of it.

This means a client can:

1. use a Dragon at 42 credits;
2. switch to no-companion mode;
3. continue earning credits;
4. later select another companion;
5. see that companion rendered at the stage corresponding to the account's current progression.

No reset or transfer operation is required.

### 4.2 Add an explicit no-companion state

The application should support a stable explicit value representing no visual companion.

Preferred initial representation:

`growth_avatar = 'none'`

Reasons:

- current column and APIs already operate on string IDs;
- it avoids ambiguous `NULL` semantics where null could mean legacy/missing/corrupt data;
- it can be validated by the same allow-list mechanism as current companion IDs;
- existing users require no migration;
- it keeps the first implementation small and reversible.

`none` means:

> The client has deliberately chosen progress-only presentation rather than a visual companion.

It must not mean:

- setup incomplete;
- companion failed to load;
- no progression exists;
- user declined engagement;
- lower-priority experience.

### 4.3 Do not add a companion-family field to `user_profiles` yet

For the first implementation, companion family/category should be metadata derived from the companion registry rather than another user-profile column.

Example registry shape:

```ts
{
  id: "dragon_hatchling",
  family: "fantasy",
  name: "Dragon Hatchling",
  movement: "walk",
  stages: [...]
}
```

The user profile needs only the selected companion ID.

Why:

- family follows the selected companion deterministically;
- moving an existing design into a renamed category later should not require rewriting every profile;
- new categories can be added in application metadata;
- cultural review can happen before a future family is enabled without schema work.

If future requirements allow selecting a family independently from a companion, revisit this decision then.

---

## 5. Neutral / progress-only mode

No-companion mode needs a deliberate visual language of its own.

Initial implementation may remain simple, but it should be designed as **Progress only**, not an empty companion card.

Candidate elements:

- current Growth Credits / points;
- current engagement level;
- next milestone;
- progress ring or path;
- recent credit-earning activity where useful;
- Journey-map position later, represented by a neutral marker/path rather than a creature.

The exact UI is not locked in by this checkpoint.

Requirements:

- it uses exactly the same underlying progression thresholds as companion mode;
- it cannot award fewer/more credits solely because no companion is selected;
- it must not repeatedly prompt or shame the client into choosing a companion;
- Settings can move freely between progress-only and a companion.

---

## 6. Companion registry direction

The existing `AVATAR_OPTIONS` array should eventually evolve into a companion registry rather than accumulating unrelated hard-coded UI assumptions.

Suggested conceptual fields:

```ts
type CompanionDefinition = {
  id: string
  family: string
  name: string
  theme?: string
  description: string
  movement: "walk" | "fly" | "float" | "glide" | "other"
  stages: CompanionStage[]
  enabled: boolean
}

type CompanionStage = {
  key: string
  label: string
  image?: string
  animation?: string
}
```

This is a design direction, not a requirement to introduce all fields during 5D2E-B.

Important separation:

- **progression thresholds** should live outside individual image files;
- **stage artwork** maps onto progression;
- changing from five images to ten images later must not change historical Growth Credits;
- companion movement metadata can later support Journey-map presentation.

---

## 7. Existing companion category

The five current choices remain supported and should be treated as the initial **Fantasy Companions** family once category UI is introduced:

- Growth Tree
- Rising Phoenix
- Dragon Hatchling
- Crystal Sentinel
- Spirit Fox

Their IDs must remain stable so existing profiles continue to resolve correctly.

Do not rename stored IDs merely to add a category.

The visual designs/artwork may later be regenerated under #65 while keeping those stable IDs.

---

## 8. Future Journey-guide compatibility

A later product direction may turn Journey into a more game-like path where the selected companion travels with the user between modules.

This checkpoint should not implement that feature, but the preference model must not block it.

Future design assumptions:

- companion definitions should be capable of a movement mode such as walking, flying, floating or gliding;
- stage art should preserve a recognisable silhouette across evolution;
- animation/art assets should not become the source of truth for Journey completion;
- Journey progression stays usable if art is unavailable;
- no-companion mode uses a neutral traveller/marker/path treatment;
- completing Journey content must not imply the companion is measuring recovery;
- motion should respect accessibility/reduced-motion preferences when implemented.

This is exploration under #65, not a release requirement for 5D2E.

---

## 9. Māori / Aotearoa companion families

The data model should permit future culturally reviewed companion families without special-case database columns.

Do not lock names or concepts in this implementation checkpoint.

Before culturally specific designs ship, #65 requires appropriate Māori cultural/design input concerning:

- concepts and symbolism;
- naming and te reo Māori;
- use of native species or environmental motifs;
- whether any motif has cultural restrictions or meanings unsuitable for gamified evolution;
- avoidance of sacred/personhood/status concepts as app-reward stages.

The technical registry should be neutral enough that approved future designs can be added without changing client progression data.

---

## 10. Onboarding compatibility

### 10.1 Existing completed clients

No action required.

Existing valid companion IDs remain valid and continue rendering.

Do not force completed users back through onboarding.

### 10.2 Existing incomplete drafts

Current saved onboarding drafts may contain one of the five existing companion IDs or no saved choice yet.

When optional-companion onboarding is implemented:

- all five existing IDs remain accepted;
- an explicitly selected `none` becomes accepted;
- missing/invalid legacy data remains treated as not-yet-selected during the unfinished draft, not silently converted into `none`;
- completing setup requires an explicit presentation choice: companion or progress-only.

This preserves the distinction between **the user chose no companion** and **we do not know their choice**.

### 10.3 New users

The companion screen should become a choice between:

- one of the available visual companions; or
- **Progress only / No companion**.

The client should not need to justify the decision.

Copy should explain that both choices use the same points/progression system and can be changed later.

The choice remains part of the short setup unless later user testing shows even this presentation preference should be deferred to the dashboard.

---

## 11. Settings compatibility

Phase 5D2E-B should add an editable Waypoint preferences surface for:

1. focus areas;
2. companion / progress-only preference.

Requirements for companion changes:

- load current `growth_avatar`;
- accept all five legacy IDs plus `none`;
- preserve `tree_growth_level` / level state;
- preserve `level_credits`;
- preserve check-in streaks and history;
- preserve Journey progress;
- preserve values/strengths;
- preserve professional-sharing and research settings;
- never call onboarding completion again for an already-completed user.

Requirements for focus-area changes:

- use the existing focus allow-list;
- require at least one valid focus area unless that product decision is separately changed;
- changing focus does not delete old check-ins, problem-area history or Journey completion;
- the UI should explain that focus selection changes what Waypoint prioritises/suggests, not historical records.

---

## 12. API direction for 5D2E-B

Use a narrow authenticated client-only preference update rather than reopening onboarding.

Candidate approach:

`PATCH /api/user/profile` or a dedicated `PATCH /api/user/waypoint-preferences`.

The endpoint should:

- require an authenticated client session;
- be bound to the session user ID;
- accept only `journeyTypes` and `growthAvatar`;
- reuse shared sanitisation/allow-list logic;
- accept `none` as an explicit valid presentation state;
- update only `journey_types`, `growth_avatar` and `updated_at`;
- return no-store responses;
- use a small payload limit;
- reject unknown companion IDs;
- not modify onboarding completion state.

Prefer a dedicated preferences endpoint if adding PATCH semantics to the generic profile route makes its security contract less clear.

---

## 13. Migration decision

**No database migration is proposed for 5D2E-A/B.**

The existing string `growth_avatar` field can represent `none` and all current/future stable companion IDs.

Do not add a migration merely to introduce categories.

A future migration should only be considered if the product later needs durable per-user companion configuration beyond a selected ID, for example multiple owned companions, custom names, independent companion XP, cosmetic inventories or per-companion state. None of those are current requirements.

---

## 14. Regression requirements

Before 5D2E-B merges, tests should prove:

- `none` is an explicit valid preference;
- existing five IDs remain valid;
- invalid IDs are rejected;
- user must still have at least one valid focus area under the current focus model;
- non-client roles cannot mutate client Waypoint preferences;
- writes are bound to the authenticated client;
- preference updates only touch `journey_types`, `growth_avatar`, `updated_at`;
- preference changes cannot reset or award Growth Credits;
- preference changes cannot reset tree/account level;
- preference changes cannot reset streaks or check-ins;
- preference changes cannot alter Journey completion;
- preference changes cannot alter values/strengths;
- preference changes cannot alter professional-sharing, demographics or research state;
- current completed users are not redirected into onboarding;
- old saved drafts with valid legacy companion IDs remain compatible.

---

## 15. Release/QA requirements

5D2E-B will change Settings and onboarding presentation, so it is visual first-use work.

Normal release path:

1. full GitHub branch gate;
2. one deliberate `waypoint-preview` hosted deployment when Vercel capacity is available;
3. mobile and desktop review of onboarding + Settings;
4. PR full gate;
5. merge from exact reviewed SHA;
6. post-merge GitHub gate and one production deployment.

If Vercel remains rate-limited, development and GitHub validation may continue, but do not claim hosted/visual verification until it has actually occurred.

---

## 16. Decisions locked by this checkpoint

For 5D2E-B implementation, treat these as settled unless a later explicit product decision changes them:

- companions are optional;
- `none` is the explicit progress-only preference value;
- no-companion and companion users share the same credits/progression system;
- existing companion IDs remain stable;
- current five companions form the initial Fantasy family when family UI arrives;
- companion family is derived from registry metadata, not stored separately on the user profile;
- changing companion never resets progression/history;
- companion art/stage count is not the source of truth for credits;
- no database migration is required for the first optional-companion implementation;
- future Journey-guide use and future cultural companion families are supported conceptually but are not part of 5D2E-B implementation.
