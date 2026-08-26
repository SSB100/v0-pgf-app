# Phase 5D2A — Progressive onboarding design

**Status:** Proposed implementation design for review

**Issue:** #59 — Phase 5D2: shorten first-use setup with progressive onboarding

## 1. Why this change is needed

The Phase 5D end-to-end audit found that Waypoint's current onboarding content is generally useful, but too much of it is required before a new person can experience the product.

Today, account creation can include personal details, gender, ethnicity, iwi, a future-research preference, password setup and policy acknowledgement. After account creation, even the simplest onboarding path can require roughly a dozen distinct interactions once the Life Garden narrowing rounds and the three-screen strengths exercise are counted. More complex focus areas add further behavioural setup questions.

The current completion endpoint then treats all of those activities as one indivisible setup transaction. It requires three core values and a real Daily Check-in before `onboarding_completed` can become true. The same transaction can write values, problem-area detail, strengths, a real check-in, engagement credits and several profile fields.

This design separates **minimum setup required to use Waypoint** from **optional personalisation that can make Waypoint more useful over time**.

The goal is not to collect less information merely for the sake of a shorter form. The goal is to ask for information when its purpose is clear and when the user has already had a chance to understand the product.

---

## 2. Design principles

1. **Show value before asking for depth.** A new user should reach the dashboard quickly enough to understand what Waypoint actually offers.
2. **No fabricated baseline data.** Skipping a Daily Check-in, Life Garden, strengths or focus-history task must leave that data absent rather than create defaults that look like self-report.
3. **Optional means optional.** Demographics and research interest must not become hidden completion requirements or dashboard nagging tasks.
4. **The Growth Companion appears early.** Choosing a companion remains part of minimum setup so Waypoint feels personal before the dashboard appears.
5. **Engagement is not recovery.** Minimum setup does not award a Growth Credit merely for creating an account or selecting an avatar.
6. **Progressive personalisation is not a score.** Do not show a profile-completeness percentage, recovery score or red warning for unfinished optional setup.
7. **Sensitive data keeps its current boundaries.** Nothing in this redesign expands professional sharing, research use, clinical claims or monitoring.
8. **Reuse current state where possible.** Avoid a database migration unless implementation proves that the existing state cannot safely express the new flow.

---

## 3. State model decision

### 3.1 No new onboarding-status column is proposed

The current schema already gives Waypoint enough state to implement progressive onboarding safely:

- `users` exists as soon as the account is created.
- `user_profiles` is created with the account.
- `user_profiles.onboarding_completed` defaults to false.
- `user_profiles.journey_types` defaults to an empty array.
- `user_profiles.growth_avatar` has a safe default.
- values, strengths, problem-area detail and Daily Check-ins already have their own durable state.

For Phase 5D2, reinterpret `onboarding_completed` as:

> **Minimum Waypoint setup is complete and the client may use the signed-in app.**

It must no longer mean:

> Every possible personalisation exercise has been completed.

This is a semantic change in application behaviour, not a schema change.

### 3.2 Progressive state is derived from real data

Do not add a single `personalisation_completed` flag in the first implementation. Derive optional task state from the actual source of truth.

| Personalisation area | Proposed source of truth | Meaning |
| --- | --- | --- |
| Minimum app setup | `user_profiles.onboarding_completed` | Focus + companion + start acknowledgement completed |
| Focus selection | `user_profiles.journey_types` | One or more valid focus areas selected |
| Growth Companion | `user_profiles.growth_avatar` | Selected companion |
| First Daily Check-in | existence of `daily_checkins` row | Person has actually submitted a check-in |
| Life Garden / core values | current core `user_values` rows | Person has explicitly saved values |
| Strengths | `user_profiles.strengths_completed` and stored strengths | Person has explicitly saved strengths |
| Focus detail | relevant profile/problem-area data | Person has chosen to provide deeper context |
| Demographics | `user_demographics` response state | Optional identity data, never a completion requirement |
| Future research interest | `users.data_consent_date` plus current value | Preference has been explicitly changed; null date means no preference recorded |

A missing row or null value must mean **not recorded**, not “no”, “healthy”, “low risk” or “completed”.

---

## 4. Proposed first-use flow

### 4.1 Account creation

Target account-creation form:

1. Name used in Waypoint
2. Email
3. Date of birth for 18+ verification, with the exact date discarded after verification where the current minimisation path is available
4. Password
5. Confirm password
6. Terms acceptance and Privacy Policy acknowledgement

The page should continue to state clearly that the current MVP is intended for adults in Aotearoa New Zealand.

### Move out of account creation

The following should not block account creation in the proposed flow:

- gender
- ethnicity
- iwi
- future research interest

Country is not currently used to enforce product eligibility and should be reviewed during 5D2B. If it is needed for the MVP, use a clear Aotearoa eligibility/locale question rather than retaining a free-text field solely because it already exists.

### 4.2 Minimum setup after account creation

Target: **three short screens after account creation**.

#### Screen 1 — What would you like Waypoint to help with?

- Keep the current multi-select focus model.
- Require at least one valid focus area.
- Do not ask detailed history, triggers, frequency, impacts or treatment questions on this screen.
- Include concise wording that the choice personalises what Waypoint surfaces and is not a diagnosis.

#### Screen 2 — Choose your Growth Companion

- Reuse the existing companion options.
- Explain that stages reflect engagement with Waypoint, not recovery, health or personal worth.
- Do not award a Growth Credit for choosing a companion.

#### Screen 3 — Start using Waypoint

- Briefly explain that Waypoint is self-guided support and not emergency monitoring or a replacement for professional care.
- Tell the user they can add more personalisation later.
- Completing this screen sets `onboarding_completed = true`, persists focus + companion, clears obsolete onboarding draft state and enters the dashboard.

No Daily Check-in, value, strength or behavioural-history record should be generated by minimum setup.

---

## 5. Signup privacy/governance changes required by the redesign

### 5.1 Demographics

Current signup both presents demographics and creates/updates `user_demographics`, including a collection-notice history entry.

If demographics move out of signup:

- account creation must no longer fail solely because the demographics table is unavailable;
- signup should not create a demographics record merely to represent that a person was never asked;
- signup must not record acknowledgement of a demographics collection notice the user did not see;
- the existing demographics GET already safely maps a missing row to an empty form state;
- the first explicit demographics save should create the row and record the applicable collection-notice/governance history;
- ethnicity and iwi remain optional and editable;
- iwi remains separately governed and excluded from professional summaries by default.

Demographics should live in Settings / an optional `About you` area. Do not present missing demographics as an incomplete profile warning.

### 5.2 Future research interest

Current signup records either `granted` or `declined` future-research interest and writes a preference date.

If research interest moves out of signup:

- do not write `data_consent_date` during signup when the question was not asked;
- do not create a `declined` consent event from silence;
- the existing default `data_consent = false` may remain, but a null `data_consent_date` must be interpreted as **no preference recorded**, not an explicit decline;
- the Privacy & Sharing Centre should make the null-date state clear;
- future research interest remains separate from formal research consent.

No schema migration is required for this distinction because the existing date field already distinguishes “never changed” from an explicit preference change.

### 5.3 Gender and country

Gender is not required by the account-creation API and is not necessary to authenticate or enter the app. It should move to optional profile details if Waypoint retains a defined service-improvement/research purpose for collecting it.

Country should be reviewed against the actual MVP eligibility requirement. The current free-text field should not remain mandatory without a defined use.

---

## 6. Progressive personalisation after the dashboard

Progressive tasks should be offered as **ways to make Waypoint more useful**, not as overdue requirements.

### Candidate tasks

#### First Daily Check-in

Use the normal Daily Check-in flow.

- It remains a genuine self-report.
- It receives the normal Growth Credit when actually completed.
- It starts the recorded check-in run using the normal Aotearoa date rules.
- No onboarding endpoint should manufacture the entry.

#### Life Garden / core values

Reuse the useful existing Life Garden interaction, but move it out of the access-blocking setup path.

Important: generic Journey exercise answers are intentionally not persisted. Therefore core values must continue to be saved only through an explicit values-save action. Do not begin persisting all Journey free text merely to support Life Garden.

When no values exist, dashboard copy must say **Explore / choose your values**, not “revisit” or imply that three values were previously saved.

#### Strengths

Reuse the current strengths interaction in a dedicated optional personalisation route or section.

Saving strengths should update the existing strengths fields and `strengths_completed`. The user may skip or return later.

#### Focus details

Detailed focus questions can be offered when they become relevant, for example from a `Your focus` personalisation task or contextual prompt.

Do not assume absence means the problem does not exist. Do not create empty `problem_areas` records just to mark a task complete.

---

## 7. First-dashboard behaviour with minimum data

The current dashboard is already mostly tolerant of a minimally configured account:

- Growth Companion works at level 0 with zero credits.
- Today's Daily Check-in card can offer the first real check-in.
- Weekly Overview already has a no-history state.
- Suggested Skills already falls back to general modules when no personal signals exist.
- Core Values safely renders an empty state.
- Journey can offer a next module without requiring behavioural history.

### Copy changes required in the dashboard-personalisation phase

Some existing language assumes full legacy onboarding and must become state-aware:

- `Your Core Values` should not say “the three values you narrowed down” when there are no saved values.
- The values action should say `Explore Life Garden` or equivalent for a new user, not `Revisit`.
- Suggested Skills should not say suggestions are “based on information you recorded” when it is showing general fallback modules.
- Optional personalisation prompts should not compete above the Growth Companion and today's primary actions.

### Proposed optional setup surface

Add a calm `Make Waypoint more useful` card lower on the dashboard, or a dedicated personalisation page linked from it.

Candidate items:

- Explore your values
- Add your strengths
- Add more detail about your chosen focus areas

Do **not** include ethnicity, iwi or research interest as dashboard completion tasks. Those should stay in Settings / Privacy so sensitive optional disclosure is not gamified or pressured.

Do not show a percentage complete.

---

## 8. Compatibility and cutover

### Completed users

No change. A profile with `onboarding_completed = true` remains complete and stays in the app.

Do not send existing users back through minimum setup.

### Existing untouched/incomplete users

Profiles with `onboarding_completed = false` enter the new minimum setup flow.

If an incomplete profile already has a valid focus/companion value, prefill it rather than asking the user to re-enter it.

### Legacy saved onboarding drafts

At the time of this design review, the production database has:

- 1 completed profile;
- 2 incomplete profiles at step 1;
- 0 profiles with a non-empty saved onboarding draft.

This means there is currently no live partial draft that needs conversion.

**Release gate:** re-run this aggregate check immediately before the first 5D2 flow deployment. If any non-empty legacy draft exists at that time, pause rollout and define a specific mapping so existing unsaved answers are not silently discarded.

Do not copy legacy draft answers into durable clinical/wellbeing tables without the user completing the relevant explicit save action.

---

## 9. Endpoint design

### Minimum setup completion

Do not keep using the current monolithic `/api/onboarding/complete` contract unchanged.

Preferred implementation:

- introduce a narrow minimum-setup completion contract or refactor the existing route so the minimum path accepts only validated focus areas + Growth Companion + explicit completion action;
- set `onboarding_completed = true`;
- persist `journey_types` and `growth_avatar`;
- clear onboarding draft fields;
- do not delete/replace values, awareness, problem areas or check-ins;
- do not award points or credits;
- make the operation idempotent for an already completed user where practical.

The current legacy full-completion behaviour may be retained temporarily only if needed for a controlled transition, but it must not remain the only path to app access.

### Personalisation writes

Use narrow endpoints aligned to each source of truth rather than recreating another giant payload:

- normal `/api/check-in/create` for Daily Check-ins;
- dedicated values save/update contract for Life Garden core values;
- dedicated strengths save/update contract;
- focused profile/problem-area update contract for deeper focus detail;
- existing `/api/user/demographics` for demographics;
- existing `/api/privacy/research-interest` for research interest.

This makes consent, audit, validation and future editing clearer than one all-purpose onboarding transaction.

---

## 10. Implementation sequence

### 5D2A — State model and design

This document only. No client-flow or schema change.

### 5D2B — Minimum account + setup path

- simplify signup fields;
- remove demographics/research-interest decisions from account creation;
- implement focus → companion → start minimum setup;
- set `onboarding_completed` from the minimum path;
- no generated values, strengths, problem areas, check-in or Growth Credit;
- preserve age/policy/auth controls;
- add regression tests for minimum access state.

### 5D2C — State-aware first dashboard

- add optional `Make Waypoint more useful` surface;
- correct empty-state copy for values and general skill suggestions;
- ensure first check-in is a normal check-in;
- keep Growth Companion and today's actions above optional setup prompts;
- mobile and desktop review.

### 5D2D — Move deeper personalisation

- Life Garden explicit values-save flow;
- strengths flow;
- deeper focus detail;
- optional profile details such as gender if collection remains justified;
- ensure edits remain possible after initial completion.

### 5D2E — First-use QA

Test as:

1. brand-new client;
2. existing fully completed client;
3. incomplete step-1 client;
4. simulated legacy saved draft;
5. user who skips every optional personalisation task;
6. user who completes those tasks later;
7. mobile narrow viewport;
8. desktop wide viewport.

---

## 11. Acceptance criteria for the overall Phase 5D2 redesign

- A new user can create an adult client account without being required to provide ethnicity, iwi, gender or a research preference.
- Minimum post-account setup is no more than three short screens.
- At least one focus area is explicitly selected.
- A Growth Companion is explicitly selected or consciously accepted from a clearly presented default.
- The dashboard can be entered without core values, strengths, problem-area detail or a Daily Check-in.
- No fake Daily Check-in, baseline, behaviour state, values or strengths are written.
- No Growth Credit is awarded merely for minimum setup.
- Missing optional information is displayed as not recorded / available to add, not as negative data.
- Demographics remain optional, editable and excluded from professional summaries by default.
- Silence on future research interest is not recorded as a decline.
- Existing completed users are not sent back to setup.
- A release-time legacy-draft check prevents silent loss of any newly created old-format draft.
- Professional sharing scopes and raw Journey-response boundaries remain unchanged.
- No clinical recovery score, profile-completeness score or inferred risk is introduced.
- Mobile and desktop first-use flows both pass release QA.

---

## 12. Decision summary

**Recommended architecture:** progressive onboarding using the existing schema.

**Minimum access state:** `onboarding_completed = true` after focus + Growth Companion + start acknowledgement.

**No new database migration is currently justified.** Optional personalisation can be inferred from real existing data sources.

**Most important product change:** stop requiring users to finish Life Garden, strengths, detailed focus history and a real Daily Check-in before they are allowed to see and use Waypoint.

This design should be reviewed before any 5D2B implementation commit changes the live first-use flow.