# Journey module depth and visual review

## Why this pass exists

The previous cognitive-load pass solved a real problem: the modules stopped reading like long digital workbook pages. It also created a new sameness problem. Most modules landed on roughly three teaching screens followed by a knowledge check and reflection, even when the concept itself needed more or less room.

This pass uses a different rule: **the module should be as long as the teaching requires, not as long as the template prefers.**

The peer-support wording remains. We are not returning to dense clinical copy. Instead, denser concepts get more small teaching steps, while straightforward concepts stay short.

The uploaded workbook material also uses diagrams, worksheets and illustrations to make abstract ideas easier to grasp. Waypoint now follows that teaching principle with its own original visual aids. The app does **not** reproduce Capri/Praxis workbook illustrations, page layouts or copyrighted artwork.

## Knowledge-check fix

The old renderer initialised the selected answer as an empty string, then converted it with `Number("")`. JavaScript turns that into `0`, which caused option zero's feedback to appear before the user had selected anything.

The renderer now treats the empty value as genuinely unselected. No right/wrong explanation or ideal answer is shown until the user chooses an answer.

If the chosen answer is not the best fit, Waypoint still shows both:

1. why that choice is not the best fit; and
2. the ideal answer and its explanation.

## Depth decision across all 27 modules

| # | Module | Teaching sections | Decision |
|---|---|---:|---|
| 1 | Understanding the Pattern | 3 | Keep concise; the pattern/function/cost distinction is already clear. |
| 2 | Motivation for Change | 3 | Keep concise; ambivalence and decisional balance do not need more screens. |
| 3 | Chain Analysis | 4 | Expand; immediate versus later consequences deserves its own step. |
| 4 | Wellbeing, Acceptance, Authenticity & Action | 4 | Expand; wellbeing domains need space before acceptance/action. |
| 5 | Mindfulness Foundations | 3 | Keep concise; What/How/safety works as a clean foundation. |
| 6 | Understanding Your Mind | 4 | Expand; add an explicit correction that Wise Mind is not a superior, calm or always-correct state. |
| 7 | Grounding, Breath, RAIN & Urge Surfing | 5 | Expand substantially; four distinct tools were being compressed into three screens. |
| 8 | Building Daily Awareness | 3 | Keep concise; weather-report/camera/pattern structure is strong. |
| 9 | Recognising Triggers & Vulnerabilities | 3 | Keep concise; spark/dry-grass/plan structure is memorable. |
| 10 | Choice Points | 3 | Keep concise; away/towards/real-world constraints is enough. |
| 11 | Understanding Emotions | 4 | Expand; precise emotion naming gets its own step. |
| 12 | Thinking Patterns & Check the Facts | 4 | Expand; common thinking shortcuts deserve a separate explanation before the camera test. |
| 13 | Opposite Action | 3 | Keep concise; safety distinction is more important than extra volume. |
| 14 | ABC PLEASE | 5 | Expand; body basics, health/withdrawal safety, positive experiences and mastery should not be collapsed together. |
| 15 | Coping Ahead | 4 | Expand; rehearsing the likely wobble is distinct from planning and from rumination. |
| 16 | Discovering Your Values | 3 | Keep concise; compass/goal/non-judgement structure is clear. |
| 17 | Recognising Strengths & Resources | 3 | Keep concise; evidence/ordinary strength/support resources works well. |
| 18 | From Values to Committed Action | 3 | Keep concise; one lane/small action/barrier is deliberately practical. |
| 19 | Creating Space: STOP & TIP | 4 | Expand; TIP safety and the post-STOP next layer need their own teaching space. |
| 20 | ACCEPTS & IMPROVE | 5 | Expand; two acronyms plus temporary-coping limits were too dense in three screens. |
| 21 | Reality Acceptance, Willingness & Turning the Mind | 5 | Expand; acceptance, secondary struggle, willingness, turning and repetition are separate ideas. |
| 22 | Six-Step Problem Solving | 5 | Expand; first decide whether the problem is changeable, then generate and compare realistic options. |
| 23 | Interpersonal Effectiveness | 4 | Keep current four; outcome/relationship/self-respect/safety already need separate screens. |
| 24 | DEAR MAN | 5 | Expand; add a plain-language worked example and a specific explanation of what negotiation does and does not mean. |
| 25 | GIVE | 3 | Keep concise; the relationship-focused skill is easier to retain when short. |
| 26 | FAST | 3 | Keep concise; fairness/apology/values/truth should stay memorable rather than sprawling. |
| 27 | Personal Commitment Plan | 5 | Expand; a usable plan needs realistic-user design and early-warning signs, not only a final summary. |

## Visual teaching aids

Visuals are deliberately conceptual rather than decorative. They are inserted only where a picture can reduce explanation time or make an analogy stick.

Current visual set includes:

- short-term pattern loop
- chain-analysis sequence
- wellbeing rebuilding blocks
- emotion/reason/balanced-information view
- urge wave
- trigger spark and background conditions
- choice-point fork
- emotion signal versus chosen response
- camera versus narrator
- battery/capacity analogy
- Coping Ahead umbrella
- STOP handbrake sequence
- distress-tolerance toolbox
- acceptance map pin
- one-knot-at-a-time problem solving
- interpersonal priorities
- values/commitment compass and pathway

These are responsive React/CSS illustrations using Waypoint's existing UI language. They carry no clinical score or implied recovery measurement.

## UX rule going forward

Do not add or remove screens merely to hit a target number.

A future module review should ask:

- Is an important distinction being squeezed into another slide because the module is trying to stay short?
- Is a screen repeating the previous screen without adding understanding?
- Would an example, analogy or visual explain this faster than another paragraph?
- Does the practice actually match what was just taught?
- Is the safety distinction visible before a user could misapply the skill?

The right module length is the shortest version that still teaches the idea properly.
