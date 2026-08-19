# Journey Modules 1–5: Cognitive Walkthrough

## Review lens

This review treats the first five Journey modules as if they are being opened by a person who may be exhausted, ashamed, anxious, low in hope, distracted, or unsure whether they have the energy to engage.

The test is not whether the curriculum is accurate when read carefully. The test is whether the **next screen is easy enough to enter** that the person is likely to keep going.

The supplied workbook remains the source context for the concepts and exercise intent. Handwritten answers are not product content. The goal of this pass is to reduce first-exposure reading load while preserving the original teaching underneath it.

The same review has now been completed across all 27 modules. The full-programme findings are recorded in `docs/journey-cognitive-load-review.md`.

## Cross-module findings

### What was already working

- The step-by-step module renderer is a major improvement over a long scrolling lesson.
- Only one learning idea is shown at a time.
- Supporting explanation can sit behind `More context`.
- The knowledge check is framed as learning rather than a pass/fail test.
- Practice prompts appear one at a time.
- Users can reflect privately rather than type sensitive details.
- Module endings explicitly permit stopping rather than pushing into the next module.

### Remaining friction found in modules 1–5

1. **Some first sentences were still written like workbook or clinician-facing text.** Because the renderer uses the first sentence as the visible summary, a complex first sentence becomes the entire first impression of that screen.
2. **Several headings introduced jargon before the user had a reason to care about it.** Examples included `Decisional balance`, `vulnerabilities`, and the full What/How mindfulness terminology.
3. **Some practice questions were technically clear but sounded like forms.** They were shortened into conversational prompts that still elicit the same reflection.
4. **A few knowledge-check distractors used unnecessarily harsh self-judgement language.** The distinction can be taught without placing direct self-insults in front of a distressed user.
5. **The first five modules need to build hope through manageability, not through motivational claims.** The revised wording repeatedly makes the task smaller: one pattern, one example, one area, one action, one short chain.

The underlying curriculum remains intact. `lib/journey-self-guided-presentation.ts` applies a presentation layer to these first five modules so the visible teaching is shorter and more conversational without deleting the fuller curriculum source.

## Module 1 — Understanding the Pattern

**Start screen:** Lead with the simpler idea that it is easier to work with one specific pattern than with a harsh judgement about yourself.

**Learning:** Focus on the pattern, notice what it gives you in the short term, and use only enough background to understand the present pattern.

**Check:** Removes direct `I am a failure` language while preserving the identity-versus-behaviour distinction.

**Practice:** One pattern and its short-term benefit/longer-term cost.

**Verdict:** Keep as one module.

## Module 2 — Motivation for Change

**Start screen:** Lead with `You do not need perfect motivation to begin.`

**Learning:** Readiness is allowed to move; both sides of change are considered; commitment is something the user can return to.

**Practice:** The strongest benefit/cost on each side rather than an exhaustive matrix.

**Verdict:** Keep as one module.

## Module 3 — Chain Analysis

**Start screen:** Lead with `Slow one difficult moment down into smaller steps so you can see where something different might be possible.`

**Learning:** Translate `vulnerability` into what made the moment harder, follow the sequence one step at a time, and look for options rather than blame.

**Practice:** What made it harder/set it off, what happened next, and one realistic interruption point.

**Verdict:** Keep as one module, but watch closely in user testing.

## Module 4 — Wellbeing: Acceptance, Authenticity & Action

**Start screen:** Frame the module around three practical questions: what needs rebuilding, what is true right now, and what small action fits the life the user wants.

**Learning:** The wellbeing domains are prompts rather than a scorecard; acceptance is not approval; authenticity gives direction and action makes it observable.

**Practice:** One area and one small action.

**Verdict:** Keep combined for now, but mark for testing.

## Module 5 — Mindfulness Foundations

**Start screen:** Lead with a simple reason to care: notice what is happening before reacting automatically.

**Learning:** Teach `notice, name and take part` before formal Observe/Describe/Participate language, then explain how attention can be less judgemental, one thing at a time and focused on what helps.

**Check:** Removes harsh identity-based distractor wording.

**Practice:** A 30-second observation and one thought/feeling described as something being noticed rather than as a fact.

**Verdict:** Keep as one module.

## Overall decision after Modules 1–5

Do not split these lessons into additional top-level modules yet. Presentation density was the main issue. Chain Analysis and the combined wellbeing lesson are the first candidates for separation only if real user testing shows poor retention or repeated drop-off.

The same principle was then applied to Modules 6–27: simplify first exposure, keep the fuller teaching available, and only split a combined lesson when user evidence shows that progressive disclosure is not enough.
