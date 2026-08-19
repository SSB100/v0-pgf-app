# Waypoint Journey cognitive-load review

## Review question

The 27-module curriculum has good coverage, but a self-guided user may be distressed, exhausted, ashamed, anxious, distracted or low in hope. The design therefore assumes limited attention and working memory.

The goal is: **one clear thing to do next, with the full context still available when wanted.**

## What was creating unnecessary load

The first 27-module implementation had several problems:

- the Journey landing page exposed the full list of modules too prominently
- modules presented introductions, teaching, checks and reflection as one long experience
- framework language sometimes appeared before the practical reason to care
- knowledge checks could feel like tests
- several practice prompts could appear like a workbook page
- the dashboard emphasised work remaining rather than the next useful step

None of these elements was individually unreasonable, but together they could make the Journey feel like a course to complete rather than support to use gradually.

## Design decision: do not add more top-level modules yet

Some lessons combine closely related concepts, including grounding/breath/RAIN/urge surfing, body care/positive experiences/mastery, STOP/TIP, ACCEPTS/IMPROVE and reality acceptance/willingness/turning the mind.

The review considered splitting them into more top-level modules. That was rejected for now because the Journey already contains 27 modules. A larger visible programme could become more intimidating even if each lesson became shorter.

Instead, each module is broken into small internal steps. The user sees one concept at a time, while the fuller teaching remains available inside the module.

## Guided module experience

Each module now works as a short sequence:

1. **Start** — one brief reason the idea may matter.
2. **Learn** — one teaching idea per screen.
3. **More context** — the first sentence carries the core message; supporting explanation is optional.
4. **Check the idea** — one educational question with feedback, explicitly not a pass/fail test.
5. **Practise** — one reflection prompt per screen.
6. **Finish** — one takeaway and explicit permission to stop for the day.

The user does not have to choose the officially correct answer before continuing. Selecting an answer and reading the feedback is enough.

Free-text practice remains optional through private reflection and is not sent to the Journey completion API.

## Pacing

Waypoint should not encourage completion speed.

The Journey recommends roughly **one module on a harder day, or up to two when the person has more capacity**. That naturally makes the programme a multi-week process rather than something to race through.

The landing page prioritises one next suggested module and keeps other learning stages folded. The dashboard also points to the next step rather than emphasising how many modules remain.

## Modules 1–5 review

The first five modules were rewritten through `lib/journey-self-guided-presentation.ts` so their first exposure is simpler while the fuller curriculum remains intact.

Key changes include:

- one specific behaviour instead of identity-level judgement in **Understanding the Pattern**
- `you do not need perfect motivation to begin` as the entry point for **Motivation for Change**
- `slow one difficult moment down into smaller steps` for **Chain Analysis**
- one area and one small action in **Wellbeing: Acceptance, Authenticity & Action**
- `notice, name and take part` before formal DBT terminology in **Mindfulness Foundations**

A more detailed walkthrough is in `docs/journey-modules-1-5-cognitive-walkthrough.md`.

## Modules 6–27 review

The remaining modules were reviewed with the same low-capacity lens and now use `lib/journey-self-guided-presentation-remaining.ts`.

### Mindfulness & awareness

- **Emotion, Reason & Wise Mind** starts with the ordinary question of what is shaping the decision rather than asking the user to learn three labels first.
- **Grounding & Riding Out Urges** asks the user to choose one method rather than master grounding, breath, RAIN and urge surfing at once.
- **A Two-Minute Awareness Check** is framed as a snapshot, not a score.
- **Triggers & What Makes Them Harder** separates a cue from the background conditions that make it harder and avoids treating vulnerability as a personal weakness.
- **Choice Points** focuses on one next move and keeps the limits of personal control explicit.

### Emotions & responses

- **Understanding Emotions** is reduced to three ideas: emotions have several parts, they can carry information, and urges are not instructions.
- **Check the Facts** leads with the distinction between what happened and what the mind added; the long list of thinking patterns is supporting context rather than the first task.
- **Opposite Action** begins with checking usefulness and safety before asking for any opposite behaviour.
- **Body Care, Positive Experiences & Mastery** removes acronym-heavy framing from the title and treats PLEASE as flexible prompts rather than a health checklist.
- **Coping Ahead** asks for one likely situation, one first response and one backup, with only brief rehearsal.

### Values & direction

- **What Matters to You** frames values as directions and goals as steps, while clarifying that the Life Garden did not make crossed-out areas unimportant.
- **Strengths & Support You Already Have** looks for evidence in past action instead of asking a low-hope user to simply declare positive traits.
- **Turn a Value into One Action** asks for one action, one likely barrier and one support rather than a broad life plan.

### Distress & problem solving

- **Pause Before You Act: STOP & TIP** makes STOP the main action and TIP an optional body-based addition.
- **Get Through the Moment: ACCEPTS & IMPROVE** treats both acronyms as menus and asks for only one option from each.
- **Reality Acceptance: What Is True, What Is Next** keeps acceptance separate from approval, willingness separate from obedience, and safety/boundaries intact.
- **Problem Solving: One Step at a Time** compresses the six-step logic into three visible screens: name/list, compare/choose, try/review.

### Relationships & connection

- **Interpersonal Effectiveness** starts with outcome, relationship and self-respect priorities before introducing DEAR MAN, GIVE and FAST.
- **DEAR MAN** is framed as building a clear message and staying on point rather than memorising eight letters.
- **GIVE** makes clear that gentle is not passive, listening is not agreement and validation does not require giving up a boundary.
- **FAST** makes clear that fairness is not equal blame, apologies are not automatic and truthfulness does not remove privacy.

### Putting it together

- **Your Next-Step Plan** is framed as the next version of a living plan rather than a final exam or permanent promise. If a plan repeatedly breaks down, the first question is what ingredient is missing rather than whether the person lacks commitment.

## Modules to watch in user testing

The highest cognitive-load candidates are still:

- Grounding & Riding Out Urges
- Body Care, Positive Experiences & Mastery
- ACCEPTS & IMPROVE
- Reality Acceptance: What Is True, What Is Next
- Your Next-Step Plan

They remain combined because one-idea-per-screen presentation currently solves most of the load problem. If real users repeatedly abandon them or cannot explain the main idea afterwards, these should be the first candidates for splitting.

## Resume behaviour and privacy

The guided module remembers only the user's position through the learning section in browser local storage. It does not persist knowledge-check choices or free-text reflection responses.

If the user leaves during the check or practice part, they return to the check rather than having sensitive reflection text silently stored.

## What not to drift back toward

The Journey should avoid:

- textbook-sized paragraphs on one screen
- presenting all 27 modules as a large uninterrupted checklist
- requiring long written reflections
- treating knowledge checks as tests to pass
- implying that faster completion means better recovery
- making framework names more prominent than the practical idea
- requiring disclosure of distressing personal material to continue

## Next validation step

The next evidence should come from observing a small number of people using the Journey on a phone, particularly the early modules and the combined high-load modules listed above.

Useful questions include:

- Can the person tell what the one next action is without reading everything?
- Does any screen still feel like too much text?
- Can they explain the main idea without opening `More context`?
- When they do open it, does the extra detail help rather than repeat?
- Do the acronym-heavy lessons feel like practical tools rather than memorisation?
- Does one reflection prompt at a time feel manageable?
- After one module, do they feel permitted to stop rather than pushed to continue?

The goal is not fewer words for their own sake. It is **less cognitive demand at any one moment without losing the teaching underneath it**.
