# Phase 5D2E-C — First-use regression and progressive-personalisation QA

**Status:** Source-level QA checkpoint. Hosted mobile/desktop verification still required before Phase 5D2 closes.

**Related issue:** #59

## 1. Purpose

Review the shortened first-use flow after 5D2A–B and the optional-companion work in 5D2E, then record what remains before the progressive-onboarding issue can close.

This checkpoint focuses on:

- first-use interaction burden before vs after the redesign;
- whether the dashboard is useful without values, strengths or check-in history;
- whether deeper personalisation remains discoverable after it was removed from blocking onboarding;
- whether companion and progress-only language is consistent;
- whether there are source-visible dead ends or hidden assumptions that a user chose a character;
- what still requires hosted mobile/desktop QA.

---

## 2. Interaction burden

### Previous first-use structure

Before progressive onboarding, a new client could encounter roughly a dozen or more post-account interaction clusters before reaching the dashboard, depending on selected focus areas. The old path included combinations of:

1. focus-area selection;
2. focus-specific detail screens;
3. Life Garden introduction;
4. broad values selection;
5. repeated values-narrowing steps;
6. values summary;
7. strengths introduction;
8. strengths-as-others-may-see-them selection;
9. strengths self-selection;
10. a full Daily Check-in saved as a real record;
11. Growth Companion selection;
12. completion/transition into the product.

Some focus areas introduced additional detail screens, so the old flow did not have one fixed universal screen count.

### Current first-use structure

Account creation is now limited to account essentials and policy acknowledgement. After account creation, the minimum setup is exactly **three screens**:

1. choose one or more focus areas;
2. choose how progress is represented: Progress only or a Growth Companion;
3. review the short start/safety explanation and enter Waypoint.

At the minimum, those three screens require approximately **five primary decision/navigation actions** after account creation:

1. select a focus area;
2. Continue;
3. select a progress presentation;
4. Continue;
5. Start using Waypoint.

Selecting multiple focus areas adds taps but does not add screens.

### Assessment

The redesign reduces the mandatory post-account experience from a variable 12+ interaction clusters to three setup screens without creating fake baseline data.

The most important qualitative reduction is that these are no longer mandatory before product entry:

- a real Daily Check-in;
- values selection/refinement;
- strengths exercises;
- detailed focus history/triggers/impact questions;
- demographics;
- research-interest preference.

This comparison is intentionally recorded as **structural burden**, not a timed usability metric. A later study may measure completion time, abandonment and perceived effort with participants.

---

## 3. First-dashboard safety with minimal data

Source review confirms the dashboard remains usable when a newly onboarded client has supplied only focus areas and progress presentation:

- Growth & Progress supports level 0 and zero credits;
- Progress only renders without silently substituting the Growth Tree;
- first-ever check-in copy is distinct from a returning user who merely has no recent entries;
- Weekly Overview has a truthful empty seven-day state;
- Core Values explicitly says Waypoint works without saved values;
- Suggested Skills distinguishes general starting points from genuinely personalised suggestions;
- Journey next-step logic works from zero completed modules;
- Daily Check-in remains optional and creates a real self-report only when the client chooses to complete it.

No baseline mood, wellbeing, risk, values, strengths or activity history is fabricated to make the dashboard look populated.

---

## 4. Progressive personalisation discoverability

### Focus areas

5D2E-B makes focus areas directly editable in Settings using the same allow-list as minimum setup.

Decision: **no separate legacy focus-onboarding flow is required** merely to let clients revise what Waypoint prioritises.

Detailed behavioural history/triggers remain separate from the high-level focus preference and should only be collected where a specific exercise or feature has a clear reason to ask for them.

### Values

Values are already available progressively through the Journey curriculum and are surfaced from the dashboard Core Values card when not yet recorded.

The Journey curriculum includes values-oriented learning and practice under the `Values & Direction` category, including converting values into observable behaviour and committed action.

Decision: **do not restore the old Life Garden values sequence as blocking onboarding.** Use the Journey/value experience as the progressive route unless later user testing shows a simpler standalone values entry point is needed.

### Strengths

The Journey curriculum already contains the module:

**Recognising Your Strengths & Resources**

It asks clients to identify strengths evidenced by previous actions and external resources that supported them.

Decision: **do not resurrect the old multi-screen strengths onboarding exercise solely for discoverability.** Strengths belong in progressive Journey work. A future dashboard shortcut may be added if testing shows users cannot find it, but that is a navigation decision rather than a reason to block first use.

### Demographics and research interest

These remain optional and must not appear as incomplete-profile tasks. Their existing Settings/privacy locations remain appropriate.

---

## 5. Companion / Progress only consistency review

5D2E-B introduces `growth_avatar = 'none'` as an explicit user choice.

Source audit identified prior assumptions that unknown/non-character presentation should fall back to the Growth Tree on desktop and mobile. Explicit `none` handling now prevents that.

The following language must remain neutral across public pages, onboarding, dashboard and Settings:

- a visual companion is optional;
- Progress only is an equally supported presentation;
- both use the same Growth Credits and engagement levels;
- switching presentation does not reset history or progression;
- engagement levels are not clinical recovery, health or personal-worth scores.

Public and dashboard wording that still says every user “picks” or “sees” a Growth Companion should be corrected before this PR is released.

---

## 6. Data and privacy boundaries rechecked

The new Waypoint-preferences update must remain narrow:

Allowed writes:

- `journey_types`
- `growth_avatar`
- `updated_at`

It must not modify:

- onboarding completion;
- Daily Check-ins;
- problem-area history;
- values or strengths;
- Journey completions or responses;
- level credits or account engagement level;
- streaks;
- demographics;
- research interest/consent;
- professional connections or sharing permissions.

Journey-response sharing remains a separate workstream under #57 and must not be coupled to ordinary Waypoint preferences.

---

## 7. Source-level dead-end review

No reason was found to send completed clients back into onboarding to change focus or companion preference.

The correct post-onboarding routes are:

- Settings for high-level focus and progress presentation;
- Journey for deeper values, strengths and skills work;
- Daily Check-in for voluntary self-reporting;
- Privacy & Sharing for professional/research permissions.

This separation keeps onboarding short and avoids overloading one `onboarding_completed` flag with unrelated optional personalisation.

---

## 8. Hosted QA still required

Source/build review is not equivalent to visual browser verification.

Before #59 closes and PR #67 merges, complete one deliberate hosted preview on the exact green head and check at minimum:

### Mobile

- signup → three-step onboarding at representative narrow widths;
- Progress only selection and summary;
- one Fantasy Companion selection and summary;
- dashboard Growth & Progress card for both modes;
- `/dashboard/growth` for both modes;
- Settings focus selection and companion/progress-only switching;
- scrolling/touch targets and no clipped text;
- Save & finish later behaviour on setup steps 1–2.

### Desktop

- signup → onboarding spacing and scroll behaviour;
- dashboard first viewport with Progress only and with companion;
- Settings preference grid at normal laptop/desktop widths;
- dashboard remains vertically scrollable and does not regress the restored desktop layout;
- public homepage/FAQ wording matches the actual optional-companion flow.

### Runtime behaviour

With an authenticated test client where safe:

- update focus areas and confirm historical records remain;
- switch companion → Progress only → companion and confirm credits/level are unchanged;
- confirm a completed client is not redirected to onboarding;
- confirm invalid/unauthorised preference updates are rejected.

Do not claim these checks are complete until the hosted preview has actually been exercised.

---

## 9. Closure criteria for #59

Issue #59 can close when:

- 5D2E optional presentation/preferences implementation is merged;
- public/dashboard wording is consistent with optional companions;
- branch + PR + post-merge GitHub gates are green;
- one hosted mobile/desktop preview pass is recorded;
- production is verified on the exact merged SHA;
- no unresolved first-use dead end is found.

Future companion-family brainstorming, art generation, Journey-map gamification and culturally reviewed companion concepts continue under #65 and do **not** block closure of the progressive-onboarding issue.
