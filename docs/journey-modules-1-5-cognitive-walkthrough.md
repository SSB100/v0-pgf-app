# Journey Modules 1–5: Cognitive Walkthrough

## Review lens

This review treats the first five Journey modules as if they are being opened by a person who may be exhausted, ashamed, anxious, low in hope, distracted, or unsure whether they have the energy to engage.

The test is not whether the curriculum is accurate when read carefully. The test is whether the **next screen is easy enough to enter** that the person is likely to keep going.

The supplied workbook remains the source context for the concepts and exercise intent. Handwritten answers are not product content. The goal of this pass is to reduce first-exposure reading load while preserving the original teaching underneath it.

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
4. **A few knowledge-check distractors used unnecessarily harsh self-judgement language.** The distinction can be taught without placing statements such as `I am a failure` or `I am useless` directly in front of a distressed user.
5. **The first five modules need to build hope through manageability, not through motivational claims.** The revised wording repeatedly makes the task smaller: one pattern, one example, one area, one action, one short chain.

The underlying curriculum remains intact. `lib/journey-self-guided-presentation.ts` applies a presentation layer to these first five modules so the visible teaching is shorter and more conversational without deleting the fuller curriculum source.

---

## Module 1 — Understanding the Pattern

### Start screen

**Risk:** The original wording was safe but still slightly abstract: `specific, observable terms rather than a judgement about who you are`.

**Change:** Lead with the much simpler idea that it is easier to work with **one specific pattern** than with a harsh judgement about yourself.

This is important for a person in a hopeless state because the first module should not feel like an invitation to explain or repair their whole identity.

### Learn 1 — Naming the problem

**Risk:** The original first sentence used `behaviour or pattern you want to understand`, then quickly moved into multiple examples and an identity distinction.

**Change:** First visible idea: **Focus on the pattern, not on judging yourself.**

The fuller context still gives examples and explains why a specific behaviour is more workable than an identity label.

### Learn 2 — Function and cost

**Risk:** The concept is important, but `function` is clinical language if introduced too early.

**Change:** First visible idea: **Notice what the pattern gives you.**

The expanded context then explains short-term relief, distraction, excitement, connection, numbness or escape, and links this to longer-term cost.

### Learn 3 — Context

**Risk:** The old prompt could invite a person to scan their whole history just as they begin the Journey.

**Change:** First visible idea: **You only need enough background to understand today.**

The screen explicitly says a complete life history is not required.

### Check

**Risk:** `I am a failure and need to become a different person` teaches the intended distinction, but it is unnecessarily shaming language to place in front of a vulnerable person.

**Change:** Replace it with `I need to become a completely different person.` The identity-versus-behaviour distinction remains without the direct self-insult.

### Practice

**Change:** The two questions are now:

- What is one pattern you want to understand better?
- What does it give you in the moment, and what does it cost you later?

This preserves the workbook's intended pattern/function/consequence reflection while reducing form-like wording.

### Verdict

**Keep as one module.** It is foundational and now small enough for first contact.

---

## Module 2 — Motivation for Change

### Start screen

**Risk:** Words such as `readiness` and `ambivalence` are accurate but can make the lesson sound theoretical.

**Change:** Lead with: **You do not need perfect motivation to begin.**

That is the message a low-hope user most needs before learning the model.

### Learn 1 — Readiness

**Risk:** The original first sentence listed several stages of change. This asks the user to absorb a model before understanding why it matters.

**Change:** First visible idea: **You do not have to feel completely ready.**

The expanded explanation retains the stages as useful shorthand and keeps the important warning that real change is not a neat staircase.

### Learn 2 — Decisional balance

**Risk:** `Decisional balance` is therapy language, not an inviting screen title.

**Change:** Title becomes **Look honestly at both sides.**

The four-part structure remains, but the bullets are written as ordinary questions:

- what staying the same gives you
- what staying the same costs you
- what changing could give you
- what feels difficult or risky about changing

### Learn 3 — Commitment

**Risk:** A person with fluctuating motivation can interpret commitment language as another standard they are failing to maintain.

**Change:** First visible idea: **Commitment is something you can return to.**

A recurrence is treated as information rather than proof that commitment was fake.

### Practice

The original four-sided exercise remains, but each prompt asks only for the **strongest point**, not an exhaustive list.

### Verdict

**Keep as one module.** The theory is useful, but it should sit behind a much simpler first message: uncertainty does not disqualify you from starting.

---

## Module 3 — Chain Analysis

### Start screen

**Risk:** The original description immediately listed `vulnerabilities, events, thoughts, feelings, urges, actions and consequences`. That is accurate but visually and cognitively heavy.

**Change:** Lead with: **Slow one difficult moment down into smaller steps so you can see where something different might be possible.**

### Learn 1 — Vulnerabilities

**Risk:** `Vulnerability` can sound like a judgement about the person.

**Change:** Screen title becomes **Start with what made the moment harder.**

Only in the fuller explanation do we introduce `vulnerabilities` as the behavioural-analysis term for factors such as poor sleep, conflict, isolation, stress, pain or access.

### Learn 2 — Follow the chain

**Risk:** Seven technical links shown at once can feel like a worksheet.

**Change:** First visible idea: **Follow what happened, one step at a time.**

The expanded bullet list uses plainer labels before the formal concepts.

### Learn 3 — Choice points

**Risk:** A chain analysis can accidentally feel like an exercise in finding the exact moment where the person `should have known better`.

**Change:** First visible idea: **You are looking for options, not someone to blame.**

The screen explicitly says there does not have to be one perfect point where everything could have been prevented.

### Practice

Three prompts remain because removing one would weaken the teaching, but they are delivered one at a time:

1. What made the situation harder and what set it off?
2. What happened next, step by step?
3. Where is one realistic place the chain could be interrupted next time?

The user is encouraged to use a minor or hypothetical example.

### Verdict

**Keep as one module.** This is one of the denser early lessons, but the step-by-step presentation is sufficient for now. It should be one of the first modules watched closely in user testing.

---

## Module 4 — Wellbeing: Acceptance, Authenticity & Action

### Start screen

**Risk:** This lesson contains a broad wellbeing model plus three principles. It is the highest cognitive-load module in the first five.

**Change:** The description now frames the whole lesson as three simple questions:

- what needs rebuilding?
- what is true right now?
- what small action fits the life you want?

### Learn 1 — Wellbeing

**Risk:** The source contains a long list of wellbeing domains. Showing the list as the main message can make a distressed person feel that every area of life is another problem to fix.

**Change:** First visible idea: **Wellbeing is bigger than stopping one behaviour.**

The full list remains in the expanded context, immediately followed by: these are prompts, not a scorecard, and they do not all need to be worked on at once.

### Learn 2 — Acceptance

**Risk:** Acceptance can be misunderstood as approval, surrender, forgiveness or giving up.

**Change:** First visible idea: **Acceptance means being clear about what is true now.**

The fuller explanation preserves the existing safety distinctions around harm and boundaries.

### Learn 3 — Authenticity and action

**Risk:** `Authenticity` can become vague or idealised.

**Change:** First visible idea: **Authenticity gives direction; action makes it real.**

The screen converts the concept into ordinary behaviour: a conversation, safeguard, appointment, routine, boundary or small task.

### Practice

The exercise is deliberately limited to **one life area** and **one small action**.

### Verdict

**Keep combined for now, but mark for testing.** If any early module later needs splitting, this is a strong candidate because it carries the widest conceptual range.

---

## Module 5 — Mindfulness Foundations

### Start screen

**Risk:** `DBT What and How skills` is meaningful to a clinician or someone already learning DBT, but it is not the easiest reason for a distressed person to enter the lesson.

**Change:** Lead with: **Learn a simple way to notice what is happening before reacting automatically.**

### Learn 1 — What skills

**Risk:** Three named skills can feel like vocabulary memorisation.

**Change:** First visible idea: **Notice, name and take part.**

The expanded explanation then introduces the formal DBT terms Observe, Describe and Participate.

### Learn 2 — How skills

**Risk:** `Non-judgementally`, `One-mindfully` and `Effectively` are useful terms but awkward first-exposure language.

**Change:** First visible idea: **How you pay attention matters too.**

The bullets become:

- less judgement
- one thing at a time
- focus on what helps

The formal DBT terms remain in the expanded explanation.

### Learn 3 — Safety and passivity

**Change:** The screen now says plainly: **Mindfulness does not mean accepting harm.**

It keeps the distinction that being present can support leaving, asking for help, solving a problem or setting a boundary.

### Check

**Risk:** `I am useless and everything is terrible` was an unnecessarily harsh distractor.

**Change:** It now uses a broad judgement without the identity insult: `Everything is going wrong and I cannot handle any of it.`

### Practice

The first prompt is now simply **What did you notice?** The second keeps the important teaching distinction between noticing a thought/feeling and treating it as fact.

### Verdict

**Keep as one module.** The simplified first layer makes the formal DBT language much easier to absorb.

---

## Overall decision after the walkthrough

The first five modules **do not need to be split into additional top-level modules yet**. Their main problem was presentation density rather than missing structure.

The best current pattern is:

**plain-language first idea → optional fuller context → one non-punitive understanding check → one short reflection at a time → stop**

The first five modules now use that model more deliberately.

## What to observe in real user testing

- Do users open `More context`, and if so, on which modules?
- Where do users leave a module before completion?
- Does `Chain Analysis` still feel like too much despite the step-by-step flow?
- Does the combined wellbeing/Acceptance/Authenticity/Action lesson retain meaning, or does it blur together?
- Do users understand the mindfulness terms after seeing the plain-language explanation first?
- Does the within-module progress indicator feel reassuring or performance-oriented?
- Can users explain the module's main idea later in ordinary language?

A decision to split a module should be based on these retention and drop-off signals rather than on word count alone.
