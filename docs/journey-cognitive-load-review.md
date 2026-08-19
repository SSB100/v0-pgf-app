# Waypoint Journey cognitive-load review

## Review question

The 27-module curriculum has good coverage, but the first implementation still asked too much of a person who may be distressed, exhausted, ashamed, anxious, overwhelmed or simply unable to concentrate for long. The problem was not mainly the curriculum itself. It was how much of it was visible at once.

This review therefore treats the user experience as if the person has very limited attention available. The design goal is: **one clear thing to do next, with the full context still available when wanted.**

## What was creating unnecessary load

The first 27-module implementation had several problems:

- the Journey landing page exposed the full list of 27 modules at once
- the hero emphasised total progress and remaining modules, which can make the Journey look like a large task to finish
- a module displayed its introduction, why-it-matters card, every teaching section, safety note, knowledge check and all reflection fields in one long scroll
- therapeutic approach labels such as DBT/ACT/CBT were repeatedly visible even when they did not help the user complete the activity
- the understanding check effectively required a correct answer before a module could be recorded, which made a reflective wellbeing tool feel more like a test
- practice exercises could present several writing prompts at once
- the dashboard told the user how many modules remained rather than simply showing the next useful step

None of those elements was individually unreasonable, but together they created the impression of a workbook or course rather than a supportive guided experience.

## Design decision: do not create more top-level modules

Several modules contain multiple connected ideas, for example Grounding/Breath/RAIN/Urge Surfing, ABC PLEASE, ACCEPTS/IMPROVE and Reality Acceptance/Willingness/Turning the Mind.

The review considered splitting these into additional top-level modules. That was rejected for now because the Journey already contains 27 modules. Increasing the visible module count would solve paragraph length by creating a different problem: a more intimidating overall programme.

Instead, each module is now broken into **small internal steps**. The user sees one concept at a time while the complete teaching remains available inside the module.

## New module experience

Each guided module now works as a short sequence rather than a long page:

1. **Start** — one short explanation of why the idea matters and what the user will do.
2. **Learn** — one teaching idea per screen.
3. **Optional context** — the first sentence carries the core message; additional explanation is hidden behind `More context` so detail is available without being forced on the user.
4. **Check the idea** — one question with explanatory feedback. It is explicitly described as not being a test.
5. **Practise** — one reflection prompt per screen rather than several text areas at once.
6. **Finish** — one main takeaway and explicit permission to stop for the day.

A user no longer has to choose the officially correct knowledge-check answer to record engagement. Selecting an answer and reading the feedback is enough. This keeps the check educational rather than pass/fail.

The existing private-reflection option remains. Practice writing is not sent to the Journey completion API.

## Progressive disclosure

The curriculum text has not been stripped of its important qualifications and safety context. Instead, the interface uses progressive disclosure:

- the core sentence is visible first
- supporting explanation is available with `More context`
- short bullet lists remain visible when they are the actual structure being taught, such as STOP or a chain-analysis sequence
- safety notes appear before the module and again before reflection where relevant

This approach compresses what the person has to absorb **right now** without removing the context they may need.

## Pacing model

Waypoint should not encourage completion speed.

The Journey landing page now recommends **one module on a harder day, or up to two when the person has more capacity**. With 27 modules, following a maximum of two per day naturally spreads the Journey across at least 14 days, and a one-to-two-module rhythm can extend it across roughly two to four weeks.

This is guidance rather than a lock. A person can still revisit or move around the Journey, but the product no longer presents rapid completion as the obvious goal.

The end of every module now tells the user that they do not need to begin another module and that taking time to notice or use the idea in ordinary life is part of the Journey.

## Landing-page changes

The Journey landing page now prioritises:

- **one next suggested module**
- a short suggested pace
- the current learning stage
- folded stage sections so the full curriculum is available without being visually imposed

Only the current stage is open by default. Other stages can be expanded deliberately.

The old large `remaining modules` emphasis has been removed. The dashboard also now shows the next suggested Journey module instead of announcing the total number still to complete.

## Resume behaviour and privacy

The guided module remembers the user's position through the teaching section using browser local storage. It stores only the module step number.

It deliberately does **not** store:

- knowledge-check choices
- free-text reflection responses
- private personal details

If the user leaves after reaching the check or practice part, they return to the check rather than having sensitive reflection text persisted automatically.

## Module-level review conclusions

### Good candidates to remain compact top-level modules

Understanding the Pattern, Motivation for Change, Chain Analysis, Mindfulness Foundations, Understanding Your Mind, Building Daily Awareness, Triggers & Vulnerabilities, Choice Points, Understanding Emotions, Check the Facts, Opposite Action, Coping Ahead, Values, Strengths, Committed Action, Problem Solving, DEAR MAN, GIVE and FAST all have a clear single teaching purpose. They benefit from internal step-by-step presentation but do not need further top-level splitting.

### Denser modules that need progressive disclosure

The following contain several closely connected concepts and are the highest cognitive-load risk:

- Wellbeing, Acceptance, Authenticity & Action
- Grounding, Breath, RAIN & Urge Surfing
- ABC PLEASE
- STOP & TIP
- ACCEPTS & IMPROVE
- Reality Acceptance, Willingness & Turning the Mind
- Interpersonal Effectiveness
- Personal Commitment Plan

For these, one-concept-per-screen is preferable to creating more modules. If future user testing shows that people still struggle to retain them, they are the first candidates for further separation.

## What not to do

The Journey should avoid drifting back toward:

- textbook-sized paragraphs on one screen
- showing all 27 modules as one uninterrupted checklist
- requiring perfect or lengthy written reflections
- treating knowledge checks as tests to pass
- implying that faster completion means better recovery
- making framework names more prominent than the practical idea being taught
- requiring a user to disclose distressing personal material to continue

## Next validation step

The strongest next test is not another content expansion. It is to observe a small number of people using the first three to five modules on a phone.

Questions to test include:

- Can the person tell what the one next action is without reading everything?
- Does any screen still feel like too much text?
- Do they understand the core idea without opening `More context`?
- When they do open `More context`, is the extra detail useful rather than repetitive?
- Does the knowledge check feel supportive rather than school-like?
- Is one reflection prompt at a time enough to encourage useful thought without demanding an essay?
- After one module, do they feel permitted to stop rather than pushed to continue?

The curriculum should only be shortened further where testing shows that comprehension is preserved or improved. The goal is not fewer words for its own sake; it is **less cognitive demand at any one moment without losing the teaching underneath it**.
