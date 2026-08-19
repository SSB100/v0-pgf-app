# Waypoint Journey cognitive-load review

## Review status

The full 27-module Journey has completed a self-guided cognitive-load review using the assumption that the user may be distressed, exhausted, ashamed, anxious, distracted or low in hope.

The design target is **one clear thing to do next, with the full context still available when wanted**.

## Core decisions

- one teaching idea per screen
- the first sentence carries the core message
- supporting explanation sits behind `More context`
- knowledge checks teach rather than gate progress
- one reflection prompt appears at a time
- users may reflect privately instead of typing personal details
- module endings explicitly permit stopping for the day
- the Journey suggests roughly one module on a harder day and up to two when capacity is better
- the landing page prioritises one next module rather than the size of the remaining programme

## Modules 1–5

`lib/journey-self-guided-presentation.ts` simplifies the first five modules without deleting the fuller curriculum source. The detailed walkthrough is in `docs/journey-modules-1-5-cognitive-walkthrough.md`.

The main changes were:

- one specific behaviour instead of identity-level judgement in Understanding the Pattern
- `you do not need perfect motivation to begin` as the entry point for Motivation for Change
- smaller-step language for Chain Analysis
- one area and one small action in the wellbeing module
- `notice, name and take part` before formal mindfulness terminology

## Modules 6–27

`lib/journey-self-guided-presentation-remaining.ts` applies the same low-capacity approach to the rest of the Journey.

### Mindfulness and awareness

- Emotion, Reason & Wise Mind starts with what is shaping the decision rather than theory labels.
- Grounding & Riding Out Urges asks the user to choose one method rather than master grounding, breath, RAIN and urge surfing together.
- A Two-Minute Awareness Check is framed as a snapshot, not a score.
- Triggers & What Makes Them Harder separates cues from background vulnerability without treating vulnerability as weakness.
- Choice Points focuses on one next move and keeps the limits of personal control explicit.

### Emotions and responses

- Understanding Emotions is reduced to three ideas: emotions have several parts, they can carry information, and urges are not instructions.
- Check the Facts leads with what happened versus what the mind added; thinking-pattern terminology becomes supporting context.
- Opposite Action begins with usefulness and safety before any opposite behaviour is considered.
- Body Care, Positive Experiences & Mastery removes acronym-heavy framing from the title and keeps PLEASE as flexible prompts rather than a health checklist.
- Coping Ahead asks for one likely situation, one first response and one backup, with brief rehearsal only.

### Values and direction

- What Matters to You frames values as directions and goals as steps, and clarifies that Life Garden choices do not make other life areas unimportant.
- Strengths & Support You Already Have asks for evidence in past action instead of asking a low-hope user to simply declare positive traits.
- Turn a Value into One Action asks for one action, one likely barrier and one support.

### Distress and problem solving

- Pause Before You Act: STOP & TIP makes STOP the main action and TIP an optional body-based addition.
- Get Through the Moment: ACCEPTS & IMPROVE treats both acronyms as menus and asks for only one option from each.
- Reality Acceptance: What Is True, What Is Next keeps acceptance separate from approval, willingness separate from obedience, and safety/boundaries intact.
- Problem Solving: One Step at a Time compresses the six-step logic into three visible screens: name/list, compare/choose, try/review.

### Relationships and connection

- Interpersonal Effectiveness starts with outcome, relationship and self-respect priorities before introducing DEAR MAN, GIVE and FAST.
- DEAR MAN is framed as building a clear message and staying on point rather than memorising eight letters.
- GIVE makes clear that gentle is not passive, listening is not agreement and validation does not require giving up a boundary.
- FAST makes clear that fairness is not equal blame, apologies are not automatic and truthfulness does not remove privacy.

### Putting it together

- Your Next-Step Plan is framed as the next version of a living plan rather than a final exam or permanent promise.
- If a plan repeatedly breaks down, the first question is what ingredient is missing rather than whether the person lacks commitment.

## Modules to watch in user testing

The highest cognitive-load candidates remain:

- Grounding & Riding Out Urges
- Body Care, Positive Experiences & Mastery
- ACCEPTS & IMPROVE
- Reality Acceptance: What Is True, What Is Next
- Your Next-Step Plan

They remain combined because the current one-idea-per-screen presentation solves most of the load problem without increasing the visible programme beyond 27 modules. They should only be split if real users repeatedly abandon them or cannot explain the main idea afterwards.

## Privacy and resume behaviour

The guided module remembers only the user's position through the learning section in browser local storage. It does not persist knowledge-check choices or free-text reflection responses.

## Next validation step

The next evidence should come from watching a small number of people use the Journey on a phone, especially the early modules and the combined high-load modules above.

The key questions are whether each screen feels small enough to enter, whether the user can explain the main idea afterwards, whether `More context` adds value rather than repetition, and whether the user feels permitted to stop after one module.

The goal is not fewer words for their own sake. It is **less cognitive demand at any one moment without losing the teaching underneath it**.
