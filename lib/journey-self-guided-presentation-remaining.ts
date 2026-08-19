import type {
  JourneyKnowledgeCheck,
  JourneyModuleDefinition,
  JourneyPracticePrompt,
  JourneySection,
} from "@/lib/journey-curriculum"

interface SectionPresentationOverride {
  title?: string
  body?: string
  bullets?: string[]
}

interface PracticePromptPresentationOverride {
  label?: string
  placeholder?: string
}

interface ModulePresentationOverride {
  title?: string
  description?: string
  whyItMatters?: string
  sections?: SectionPresentationOverride[]
  check?: JourneyKnowledgeCheck
  practiceTitle?: string
  practiceIntro?: string
  practicePrompts?: Record<string, PracticePromptPresentationOverride>
  keyLearning?: string
}

/**
 * Presentation-only wording for Journey modules 6–27.
 *
 * The curriculum remains the fuller source of record. These overrides make the
 * first exposure easier for someone with low attention, low hope, anxiety or
 * high distress by leading with plain language, one manageable idea and short
 * reflection prompts. Safety notes from the source curriculum are preserved.
 */
const REMAINING_MODULE_PRESENTATION_OVERRIDES: Record<string, ModulePresentationOverride> = {
  "understanding-your-mind": {
    title: "Emotion, Reason & Wise Mind",
    description: "Notice whether emotion, logic or a mix of both is shaping a decision.",
    whyItMatters: "No state of mind is bad. The useful question is what is loudest right now, and whether another part of the picture needs attention too.",
    sections: [
      {
        title: "When emotion is loud",
        body: "Strong feelings can make one part of a situation feel like the whole situation. Emotional Mind is the DBT name for moments when feelings, urges and immediate emotional meaning are especially prominent. Emotion can carry useful information, but an urge does not have to become an instruction.",
      },
      {
        title: "When logic takes over",
        body: "Facts and planning help, but logic can miss needs, feelings and values if it is used alone. Reasonable Mind is the DBT name for moments when analysis and practical information are especially prominent. It is useful without needing to dismiss emotion.",
      },
      {
        title: "Bring both into the decision",
        body: "Wise Mind means checking feelings, facts and what matters before choosing a response. It is not a perfect state or a guarantee that the decision will be right. It is simply a prompt to widen the picture before acting.",
      },
    ],
    check: {
      prompt: "Which response best brings emotion and reason together?",
      options: [
        {
          label: "Ignore the feeling and only use logic.",
          feedback: "Logic can help, but ignoring emotion can leave out information about needs, values or the meaning of the situation.",
        },
        {
          label: "Do whatever the strongest feeling is urging me to do.",
          feedback: "A strong urge can matter without automatically deciding the action.",
        },
        {
          label: "Notice the feeling, check the facts and consider what response fits what matters to me.",
          correct: true,
          feedback: "Yes. That is the basic idea behind Wise Mind.",
        },
      ],
    },
    practiceTitle: "Look at one decision from three angles",
    practiceIntro: "Use something low-stakes or hypothetical. A sentence for each part is enough.",
    practicePrompts: {
      emotion: {
        label: "What did the emotional part of the situation want to do?",
        placeholder: "I felt... and wanted to...",
      },
      reason: {
        label: "What facts or practical information also mattered?",
        placeholder: "The facts I knew were...",
      },
      wise: {
        label: "What response could make room for both?",
        placeholder: "A response that notices the feeling and the facts...",
      },
    },
    keyLearning: "Emotion and reason both carry information. Wise Mind is a way of making room for both before choosing what to do.",
  },

  "grounding-and-urge-surfing": {
    title: "Grounding & Riding Out Urges",
    description: "Choose one way to stay with the present when distress, thoughts or an urge start taking over.",
    whyItMatters: "You do not have to make an urge or feeling disappear. Creating a little space before acting can be enough to change what happens next.",
    sections: [
      {
        title: "If going inward is too much, look outward",
        body: "External grounding brings attention back to what is around you. Notice a few things you can see, hear or physically feel, such as the chair under you or your feet on the floor. The goal is not to force distress away; it is to reconnect with the present surroundings.",
      },
      {
        title: "Use the breath, or ride the urge",
        body: "You can use the breath as a steady point of attention, or notice an urge as something that changes over time. With urge surfing, notice where the urge shows up in the body and how the sensations shift without requiring yourself to act on it. No particular result or time limit is required.",
      },
      {
        title: "RAIN: notice without becoming the feeling",
        body: "RAIN is another way to slow the moment down: Recognise what is here, Allow yourself to notice it if that feels safe, Investigate gently, and remember that the experience is not your whole identity. Some versions use the final N for Nurture, adding a compassionate response to what you noticed.",
        bullets: [
          "Recognise what is here",
          "Allow it to be noticed if that feels safe",
          "Investigate gently, not as an interrogation",
          "Remember the experience is not your whole identity; respond with care if useful",
        ],
      },
    ],
    check: {
      prompt: "What is the main aim of urge surfing?",
      options: [
        {
          label: "Make the urge disappear as quickly as possible.",
          feedback: "The urge may change, but the skill does not require it to disappear.",
        },
        {
          label: "Notice the urge as a changing experience and practise not acting automatically.",
          correct: true,
          feedback: "Yes. The focus is on creating space between the urge and the action.",
        },
        {
          label: "Argue with the urge until I prove it is irrational.",
          feedback: "This practice uses observation rather than debate.",
        },
      ],
    },
    practiceTitle: "Try one present-moment skill",
    practiceIntro: "Choose only one method. Use a mild experience, and switch to external grounding if inward focus feels worse.",
    practicePrompts: {
      method: {
        label: "Which one did you try: grounding, breath, RAIN or urge surfing?",
        placeholder: "I tried...",
      },
      notice: {
        label: "What did you notice while you tried it?",
        placeholder: "Attention, body sensations, thoughts or urge intensity... no particular result is required.",
      },
    },
    keyLearning: "Grounding, breath, RAIN and urge surfing are different ways to stay with the present and create space before action. The feeling does not have to disappear for the practice to be useful.",
  },

  "building-awareness": {
    title: "A Two-Minute Awareness Check",
    description: "Take a short snapshot of what is happening without grading yourself or trying to solve everything yet.",
    whyItMatters: "Small check-ins can reveal patterns over time without turning every difficult day into a judgement about your progress.",
    sections: [
      {
        title: "Notice, do not score yourself",
        body: "A check-in is a snapshot, not a mark for how well you are doing. You might notice mood, urge strength, sleep, stress, behaviour and what is happening around you. The aim is useful information, not a perfect score.",
      },
      {
        title: "Separate what happened from the story about it",
        body: "There is a difference between an observation and the meaning your mind adds to it. ‘I slept four hours and feel tense’ is an observation; ‘I have ruined the whole week’ is an interpretation. Both can be noticed, but they are different kinds of information.",
      },
      {
        title: "Look for patterns, not diagnoses",
        body: "Several check-ins can show recurring situations, routines or times when extra support tends to help. One check-in is only one moment, and a pattern in Waypoint is descriptive rather than a diagnosis.",
      },
    ],
    check: {
      prompt: "Which option is the clearest descriptive check-in?",
      options: [
        {
          label: "Everything is getting worse again.",
          feedback: "That is a broad conclusion rather than a description of what is happening right now.",
        },
        {
          label: "My urge is strong, I slept poorly and I have been avoiding messages since this morning.",
          correct: true,
          feedback: "Yes. It records several parts of the current situation without grading them.",
        },
        {
          label: "Tomorrow will probably be just as bad as today.",
          feedback: "That is a prediction about the future.",
        },
      ],
    },
    practiceTitle: "Take one short snapshot",
    practiceIntro: "Do not fix anything yet. Just describe what is most noticeable.",
    practicePrompts: {
      internal: {
        label: "What is most noticeable inside you right now?",
        placeholder: "A feeling, body sensation, thought or urge...",
      },
      context: {
        label: "What around you might be relevant?",
        placeholder: "Sleep, stress, people, access, environment, time of day...",
      },
    },
    keyLearning: "A short check-in is information, not a score. Repeated observations can make patterns easier to notice without turning them into a judgement or diagnosis.",
  },

  "recognizing-triggers": {
    title: "Triggers & What Makes Them Harder",
    description: "Notice the specific cues and background conditions that tend to make a pattern more likely.",
    whyItMatters: "A cue is easier to plan for when you can name what sets the pattern off and what makes you more vulnerable around it.",
    sections: [
      {
        title: "Triggers are the cues close to the urge",
        body: "A trigger is something that shows up close to an urge or response. It can be external, such as a place, person, device, money or advertising, or internal, such as a thought, memory, feeling, sensation, boredom or excitement.",
      },
      {
        title: "Vulnerabilities are what make the moment harder",
        body: "A vulnerability is a background condition that can make a trigger more difficult to handle. Poor sleep, loneliness, conflict, stress, pain, hunger or easy access are examples. A vulnerability is not a personal weakness; it is useful context for planning.",
      },
      {
        title: "You do not have to eliminate every trigger",
        body: "Some high-risk cues can reasonably be blocked or reduced, while others are part of ordinary life. Depending on the situation, the best response may be an environment change, safeguard, coping plan, support person, skill or a combination of these.",
      },
    ],
    practiceTitle: "Map one trigger pattern",
    practiceIntro: "Choose one pattern. You are gathering information, not blaming yourself for having triggers.",
    practicePrompts: {
      cues: {
        label: "What usually shows up close to the urge or behaviour?",
        placeholder: "Place, person, money, device, thought, feeling, boredom, conflict...",
      },
      vulnerabilities: {
        label: "What tends to make those moments harder?",
        placeholder: "Sleep, stress, isolation, pain, access, hunger...",
      },
    },
    keyLearning: "Triggers are cues close to the urge; vulnerabilities are background conditions that can make the cue harder to manage. Both can guide practical planning.",
  },

  "choice-points": {
    title: "Choice Points: The Next Small Move",
    description: "Pause where the usual response and the direction you want start pulling apart.",
    whyItMatters: "You may not control the whole situation, but there are moments when one small next action can move you closer to what matters.",
    sections: [
      {
        title: "Notice the usual move",
        body: "An ‘away move’ is an action that takes you further from how you want to respond in that moment. It can still make sense as an attempt to get relief from pain, fear, boredom or pressure. The label is about direction, not whether you are a good or bad person.",
      },
      {
        title: "Find one move toward what matters",
        body: "A ‘towards move’ is a practical action that fits a value or goal in the situation. It can be very small: delay access, send one message, leave a risky environment, complete one task, tell the truth or ask for help.",
      },
      {
        title: "Choice has limits",
        body: "Choice does not mean you control every circumstance, feeling or outcome. Safety, coercion, poverty, illness and other realities can narrow the options available. The exercise is only asking what is possible within the situation you are actually in.",
      },
    ],
    practiceTitle: "Find one choice point",
    practiceIntro: "Use one ordinary or hypothetical moment where the usual response and a longer-term direction pull differently.",
    practicePrompts: {
      away: {
        label: "What is the usual move that offers quick relief or follows the old pattern?",
        placeholder: "The automatic action might be...",
      },
      towards: {
        label: "What is one small move toward what matters instead?",
        placeholder: "A realistic action available in the same moment...",
      },
    },
    keyLearning: "A choice point compares the usual move with one realistic move toward a value or goal, without pretending every part of the situation is under your control.",
  },

  "understanding-emotions": {
    description: "Break an emotional moment into smaller parts so it is easier to understand what is happening.",
    whyItMatters: "An emotion can feel like one overwhelming event. Naming the feeling, body response, meaning and urge can make the next choice clearer.",
    sections: [
      {
        title: "An emotion is more than a feeling",
        body: "An emotional moment can include a feeling, body sensations, thoughts or interpretations, facial expression, posture and an urge to act. These parts affect one another and do not always happen in a neat order.",
      },
      {
        title: "Emotions can point to something",
        body: "Emotions can carry useful information without always telling the whole story. Fear may point to threat, guilt to a values conflict, sadness to loss and anger to obstruction or unfairness. The message can fit the facts closely, partly or not very well.",
      },
      {
        title: "An urge is not an instruction",
        body: "Emotions often come with an action urge, such as avoiding, attacking, withdrawing or hiding. Naming the urge gives you a moment to ask whether following it is useful and safe in this situation.",
      },
    ],
    practiceTitle: "Map one emotional moment",
    practiceIntro: "Choose something low-to-moderate, or use an invented example.",
    practicePrompts: {
      emotion: {
        label: "What feeling and body sensation were there?",
        placeholder: "Feeling... body sensation...",
      },
      urge: {
        label: "What did the emotion make you want to do?",
        placeholder: "Avoid, approach, argue, hide, seek reassurance, withdraw...",
      },
      message: {
        label: "What did the emotion seem to mean about the situation?",
        placeholder: "My mind was telling me...",
      },
    },
    keyLearning: "Emotions have several parts, including body responses and action urges. The emotion matters, but the urge can still be checked before you act on it.",
  },

  "check-the-facts": {
    title: "Check the Facts",
    description: "Separate what happened from the story your mind added before deciding what to do next.",
    whyItMatters: "When emotion is high, guesses, predictions and interpretations can feel as certain as facts. Separating them can open up more than one response.",
    sections: [
      {
        title: "Your mind fills in gaps",
        body: "Everyone's mind makes interpretations, predictions and quick conclusions. Common patterns include focusing only on negatives, mind-reading, predicting the future, personalising, all-or-nothing thinking, catastrophising, overgeneralising, labelling, rigid ‘should’ rules, treating feelings as facts, and magnifying one detail while minimising another. These are thinking habits, not proof that something is wrong with you.",
      },
      {
        title: "Start with what you directly know",
        body: "Ask what an independent observer could see or hear, then name what your mind added. ‘They did not reply today’ is an observation; ‘They are deliberately ignoring me because they do not care’ is an interpretation. The interpretation may or may not be true, but it can be checked.",
      },
      {
        title: "Then choose the next response",
        body: "Once you have checked the facts, ask what kind of response fits. A changeable problem may call for problem solving; an unchangeable fact may call for acceptance; and an urge that does not fit or is not effective may be a place to consider Opposite Action.",
      },
    ],
    check: {
      prompt: "Which sentence contains the clearest assumption rather than a direct observation?",
      options: [
        {
          label: "The meeting started at 9:00 and I arrived at 9:12.",
          feedback: "That is mostly observable information.",
        },
        {
          label: "My heart is racing and I notice an urge to leave.",
          feedback: "That describes a body sensation and an urge.",
        },
        {
          label: "They did not reply today, so they must be angry with me.",
          correct: true,
          feedback: "Yes. The lack of reply is observable; the reason for it is an assumption that may need checking.",
        },
      ],
    },
    practiceTitle: "Separate the facts from the story",
    practiceIntro: "Use a safe situation or make one up. Two short descriptions are enough.",
    practicePrompts: {
      story: {
        label: "What story or conclusion did your mind add?",
        placeholder: "They think... / This means... / It will definitely...",
      },
      facts: {
        label: "What do you directly know happened?",
        placeholder: "What was said, done, seen or heard...",
      },
    },
    keyLearning: "Checking the facts means separating what you directly know from the assumptions, predictions and judgements added to it before choosing how to respond.",
  },

  "opposite-action": {
    description: "When an emotional urge does not fit the facts or help the situation, consider a small safe action in the other direction.",
    whyItMatters: "Emotions matter, but following every action urge can sometimes keep an unhelpful pattern going. Opposite Action is one option when the urge is not useful or safe to follow.",
    sections: [
      {
        title: "First ask: is this urge useful here?",
        body: "Opposite Action is not a rule to do the opposite of every feeling. Check whether the emotion and urge fit the current facts, whether following the urge is useful, and whether the feeling is warning you about genuine danger or another important need.",
      },
      {
        title: "If not, try a small safe opposite",
        body: "When the urge does not fit or is keeping the pattern going, choose a behaviour in the other direction. Fear may call for gradual approach when the situation is actually safe; unjustified shame may call for staying visible; anger may call for stepping back or softening your delivery. Start small rather than forcing yourself.",
      },
      {
        title: "Never use this against a safety signal",
        body: "Opposite Action is not exposure to danger. If fear is protecting you from abuse, coercion, violence, overwhelming trauma or another genuine threat, use safety planning, distance or support instead.",
      },
    ],
    practiceTitle: "Consider one safe opposite action",
    practiceIntro: "Use a low-risk example. If safety is uncertain, choose another example rather than pushing through.",
    practicePrompts: {
      urge: {
        label: "What feeling and action urge are you looking at?",
        placeholder: "Feeling... urge to avoid, attack, hide, withdraw...",
      },
      facts: {
        label: "Does the urge fit the facts and your safety needs?",
        placeholder: "What evidence says follow it, do something different, or take a mixed approach?",
      },
      opposite: {
        label: "If a safe opposite fits, what is the smallest version you could try?",
        placeholder: "One gradual, concrete action...",
      },
    },
    keyLearning: "Opposite Action comes after checking the facts and safety. It is for urges that are not useful or do not fit the situation, not for overriding genuine danger.",
  },

  "abc-please": {
    title: "Body Care, Positive Experiences & Mastery",
    description: "Choose one physical need and one life-building activity instead of trying to fix every vulnerability at once.",
    whyItMatters: "Sleep, health, eating, substance use and movement can affect how hard a day feels. Positive experiences and achievable tasks can also give life more than one source of reward or relief.",
    sections: [
      {
        title: "PLEASE: notice what your body needs",
        body: "PLEASE is a DBT reminder to notice physical illness, eating, substance use, sleep and movement. Treat these as flexible prompts rather than a strict checklist. Follow medical advice from your own clinicians, and do not change prescribed medication based on an app.",
      },
      {
        title: "Add something positive",
        body: "A positive experience can be small and ordinary. Connection, creativity, nature, play, rest, contribution and hobbies can add another source of reward or relief without needing to produce a dramatic mood change.",
      },
      {
        title: "Build a little mastery",
        body: "Mastery means doing something achievable that takes some effort and gives you a chance to learn or follow through. It could be a practical task, skill, hobby or small commitment. The point is not perfection; it is practising action and learning.",
      },
    ],
    check: {
      prompt: "How should you use the PLEASE reminders?",
      options: [
        {
          label: "As a strict daily checklist I have to complete perfectly.",
          feedback: "The prompts are meant to help you notice physical vulnerabilities, not create another perfection test.",
        },
        {
          label: "As flexible reminders that health, eating, substances, sleep and movement may need attention.",
          correct: true,
          feedback: "Yes. Choose what is relevant and get appropriate health or addiction support when needed.",
        },
        {
          label: "As a reason to change medication on my own if I think it affects my mood.",
          feedback: "Medication changes should be discussed with the prescribing clinician.",
        },
      ],
    },
    practiceTitle: "Pick two small foundations",
    practiceIntro: "Choose only what feels realistic for your current capacity.",
    practicePrompts: {
      please: {
        label: "Which physical area could use one safe next step?",
        placeholder: "Health care, eating, substance-use support, sleep or movement...",
      },
      mastery: {
        label: "What is one small positive or mastery-building activity you could plan?",
        placeholder: "Connection, creativity, task completion, hobby, nature, learning...",
      },
    },
    keyLearning: "Emotional vulnerability can be affected by physical wellbeing and by whether life contains positive, meaningful or mastery-building activity. Choose small, safe steps rather than a perfect routine.",
  },

  "coping-ahead": {
    description: "Make a simple plan for a difficult situation you can reasonably predict before you are in the middle of it.",
    whyItMatters: "A plan is easier to remember when you decide in advance what you will do first and what your backup step will be.",
    sections: [
      {
        title: "Pick one likely situation",
        body: "Choose a situation that is reasonably likely to happen and specific enough to picture. Notice the cues, feelings, urges or practical problems that usually make it difficult. You do not need to imagine every possible bad outcome.",
      },
      {
        title: "Decide what you will do first",
        body: "Choose one first response and one backup. This could include a safeguard, grounding, contacting support, leaving the environment, delaying access, using a communication skill or taking a problem-solving step.",
      },
      {
        title: "Briefly rehearse, then stop",
        body: "Mentally walk through using the plan, including one likely complication, then bring your attention back to the present. Rehearsal is preparation, not a reason to repeatedly expose yourself to distressing memories or keep running the scenario in your head.",
      },
    ],
    practiceTitle: "Make one short coping-ahead plan",
    practiceIntro: "Choose something challenging but safe enough to think about on your own.",
    practicePrompts: {
      situation: {
        label: "What situation are you preparing for, and what usually makes it hard?",
        placeholder: "Where, when, who, cue or urge...",
      },
      plan: {
        label: "What will you do first, and what is your backup step?",
        placeholder: "First step... backup step... support person or safeguard...",
      },
    },
    keyLearning: "Coping Ahead is a short plan for a likely situation: identify what may make it difficult, choose a first response and a backup, then briefly rehearse using them.",
  },

  "discovering-values": {
    title: "What Matters to You",
    description: "Use values as directions for your next choices, not another standard you have to live up to perfectly.",
    whyItMatters: "When urges, emotions and other people's expectations pull in different directions, values can help you decide what kind of action you want to take.",
    sections: [
      {
        title: "Values point; goals are steps",
        body: "A value is a direction or quality you want to bring to your behaviour, while a goal is something concrete you can do. ‘Connection’ can be a value; ‘message my sister tonight’ can be a goal that expresses it.",
      },
      {
        title: "The Life Garden was about priorities, not deleting parts of life",
        body: "During onboarding you narrowed many meaningful areas by making repeated choices. Crossing an area out did not mean it was unimportant or should be removed from your life. The exercise was designed to show what becomes hardest to let go of when priorities compete.",
      },
      {
        title: "Values are not perfection rules",
        body: "You can care deeply about a value and still act against it sometimes. A value is most useful as a compass for the next choice, not as a test of whether you are a good person.",
      },
    ],
    practiceTitle: "Bring one value into today",
    practiceIntro: "Use one onboarding value if it still fits, or choose another value that matters now.",
    practicePrompts: {
      value: {
        label: "What value matters most for this moment, in your own words?",
        placeholder: "For me, connection means...",
      },
      behaviour: {
        label: "What would that value look like as one ordinary action?",
        placeholder: "A message, boundary, routine, task or choice...",
      },
    },
    keyLearning: "Values are ongoing directions; goals are the concrete steps that can express them. A value guides the next choice without demanding perfection.",
  },

  "recognizing-strengths": {
    title: "Strengths & Support You Already Have",
    description: "Look for evidence of what you have handled before and the people or resources that helped.",
    whyItMatters: "When you are struggling, attention can narrow around what has gone wrong. Past actions can also show abilities and support you can use again.",
    sections: [
      {
        title: "Look for evidence, not perfect traits",
        body: "A strength is easier to believe when you can point to something you actually did. Persistence, creativity, humour, honesty, problem solving, empathy, courage, practicality, leadership, patience and curiosity are examples. You do not have to show a strength all the time for it to be real or useful.",
      },
      {
        title: "Think of one thing you have managed before",
        body: "Choose any past change or difficult situation, not necessarily the problem you are working on now. Learning a work skill, parenting, moving, repairing or leaving a relationship, getting through illness, changing a habit, asking for help or rebuilding after a setback can all show useful capacities.",
      },
      {
        title: "Support counts too",
        body: "Help from whānau, friends, clinicians, mentors, groups, employers, community organisations or practical tools is part of how change happens. Using support does not make the change less yours; knowing when and how to use resources is itself useful information.",
      },
    ],
    practiceTitle: "Find one piece of evidence",
    practiceIntro: "Use any example where you got through, adapted or changed something.",
    practicePrompts: {
      change: {
        label: "What is one change or difficult situation you have managed before?",
        placeholder: "Work, family, health, learning, money or a personal example...",
      },
      strengths: {
        label: "What did you use to get through it?",
        placeholder: "A strength, person, service, routine, practical tool or combination...",
      },
    },
    keyLearning: "Past actions can provide evidence of strengths, and external support is a legitimate resource you can deliberately use again.",
  },

  "values-to-action": {
    title: "Turn a Value into One Action",
    description: "Take one thing that matters and turn it into a small action you could actually do this week.",
    whyItMatters: "Values become more useful when they show up in something specific and real rather than staying as an idea about the future.",
    sections: [
      {
        title: "Pick one area",
        body: "Choose one part of life rather than trying to redesign everything at once. A values-based action could involve connection, health, creativity, learning, treatment, money safeguards, contribution or a healthier routine.",
      },
      {
        title: "Make the first step small enough to start",
        body: "Decide what you will do, when and where. The action should matter enough to be worth trying but be small enough that you can actually start and learn from it. If the goal is too large, shrink it to the first observable step.",
      },
      {
        title: "Plan for one barrier and one support",
        body: "Think about what is most likely to get in the way and what would make the action easier to follow through. Support can come from whānau, friends, clinicians, groups, safeguards, reminders or changes to the environment, as long as it increases your options and safety rather than taking control away from you.",
      },
    ],
    check: {
      prompt: "Which option is the clearest first committed action?",
      options: [
        {
          label: "Improve my whole life this month.",
          feedback: "That direction may matter, but it is too broad to act on as one first step.",
        },
        {
          label: "Because connection matters to me, I will message one trusted friend after work on Wednesday.",
          correct: true,
          feedback: "Yes. It links a value to a specific action, time and context.",
        },
        {
          label: "Wait until I feel fully motivated, then decide what to do.",
          feedback: "Motivation can fluctuate; a small action can still be planned while motivation is mixed.",
        },
      ],
    },
    practiceTitle: "Plan one values-based action",
    practiceIntro: "One value, one action, one likely barrier and one support is enough.",
    practicePrompts: {
      goal: {
        label: "What will you do, and when?",
        placeholder: "Value → action → day or time...",
      },
      barrier: {
        label: "What is most likely to get in the way, and what could you do then?",
        placeholder: "Barrier... response...",
      },
      support: {
        label: "Who or what could make this step easier without taking over your choice?",
        placeholder: "Person, group, safeguard, reminder, environment change...",
      },
    },
    keyLearning: "Committed action turns one value into a specific step, with a realistic plan for the barrier most likely to appear and the support that could help.",
  },

  "stop-skill": {
    title: "Pause Before You Act: STOP & TIP",
    description: "Use STOP to interrupt momentum, then add a safe body-based option or practical safeguard if that would help.",
    whyItMatters: "When an urge is moving fast, you may not need to solve the whole problem first. A brief pause can create enough space to choose the next step.",
    sections: [
      {
        title: "STOP: make a pause",
        body: "STOP is a short sequence for interrupting automatic action. Stop if you safely can, Take a step back, Observe what is happening, then Proceed mindfully with one deliberate next action.",
        bullets: [
          "Stop",
          "Take a step back",
          "Observe",
          "Proceed mindfully",
        ],
      },
      {
        title: "TIP: use a body-based option only if it fits",
        body: "TIP includes options such as temperature change, brief intense movement and paced breathing or muscle relaxation. These can affect the body and may help some people make a high-intensity moment more workable, but they are not requirements. Use gentler options when cold exposure or exercise is not medically suitable.",
      },
      {
        title: "Add practical distance",
        body: "A pause can become stronger when you also change the environment. Put down the phone, move away from access, hand over a card, close an app, leave a venue, call someone or delay a purchase if one of those actions fits the situation.",
      },
    ],
    practiceTitle: "Write your personal pause",
    practiceIntro: "Use a situation where an urge tends to move quickly, or make one up.",
    practicePrompts: {
      stop: {
        label: "What would stopping and stepping back look like for you?",
        placeholder: "Put phone down, leave the room, wait, move away from access...",
      },
      proceed: {
        label: "Once you have paused, what is one safe next action?",
        placeholder: "Grounding, contact someone, safeguard, problem-solving step...",
      },
    },
    keyLearning: "STOP is a way to interrupt momentum. TIP and practical safeguards are optional ways to make enough space for a more deliberate next action.",
  },

  "accepts-improve": {
    title: "Get Through the Moment: ACCEPTS & IMPROVE",
    description: "Build a small menu of temporary coping options for moments when the problem cannot be solved straight away.",
    whyItMatters: "Sometimes the immediate goal is simply to avoid making the situation worse until you have enough capacity for problem solving, support or acceptance.",
    sections: [
      {
        title: "ACCEPTS: shift attention for a while",
        body: "ACCEPTS is a memory aid for temporary distraction options. It stands for Activities, Contributing, Comparisons used carefully, creating different Emotions, Pushing away for a limited time, changing Thoughts and using Sensations. The point is a temporary shift, not avoiding the problem forever.",
      },
      {
        title: "IMPROVE: make the moment a little more workable",
        body: "The workbook version of IMPROVE uses Imagery, Meaning, Planning, Relaxing, One thing in the moment, Vacation or a brief time-out, and Encouragement. You only need the options that fit you; the aim is to make the next stretch of time more manageable, not to force distress to disappear.",
      },
      {
        title: "Do not use the skill as punishment",
        body: "A coping skill can be firm without being harsh. A useful stance is: ‘This is difficult, I do not have to solve everything this minute, and I can choose one response that does less harm.’ Compassion does not remove accountability; it can make it easier to learn from what happened.",
      },
    ],
    practiceTitle: "Choose two short-term options",
    practiceIntro: "One ACCEPTS option and one IMPROVE option is enough. Pick things you could actually access.",
    practicePrompts: {
      accepts: {
        label: "What is one ACCEPTS-style option you could use for a short time?",
        placeholder: "Activity, contribution, sensory shift, different thought focus...",
      },
      improve: {
        label: "What is one IMPROVE-style option that could make the moment more workable?",
        placeholder: "Imagery, meaning, planning, relaxing, one thing, short break, encouragement...",
      },
    },
    keyLearning: "ACCEPTS and IMPROVE are short-term coping menus. Use one option to create time, then return to the problem, support or acceptance when you are able.",
  },

  "reality-acceptance": {
    title: "Reality Acceptance: What Is True, What Is Next",
    description: "Acknowledge what cannot be changed right now without giving up your safety, boundaries or the choices that remain.",
    whyItMatters: "Fighting an already-true fact can consume a lot of energy. Acceptance can redirect some of that energy toward the next choice that is still available.",
    sections: [
      {
        title: "Acceptance is not approval",
        body: "Accepting that something is real does not mean approving of it, forgiving it, causing it, deserving it, agreeing with someone else, giving up your rights or staying in danger. You can acknowledge what happened and still leave, seek justice, set a boundary or work to change what comes next.",
      },
      {
        title: "Willingness means trying the workable next step",
        body: "Willingness is being open to a response that fits the situation and your values. Reluctance can carry useful information too, such as fear, exhaustion, uncertainty or a genuine safety concern. This is not about obedience; it is about deciding deliberately what you are willing to try.",
      },
      {
        title: "Turn back to what is true and what you can do",
        body: "Acceptance often needs to be chosen more than once. When your mind returns to ‘this must not be true’ or keeps replaying an unchangeable fact, turn back to two questions: what is true now, and what is still within my control or influence?
",
      },
    ],
    practiceTitle: "Separate the fact from the next choice",
    practiceIntro: "Choose something safe enough to reflect on. Do not use this exercise to persuade yourself to remain in danger.",
    practicePrompts: {
      fact: {
        label: "What is one fact that is already true or cannot be changed right now?",
        placeholder: "Describe it without approval or self-blame...",
      },
      control: {
        label: "What is one thing you can still do or influence?",
        placeholder: "Boundary, support, report, plan, conversation, leaving, care...",
      },
    },
    keyLearning: "Reality acceptance means naming what is already true while protecting safety, boundaries and the choices that remain. Turning the mind is the repeated return to those facts and options.",
  },

  "problem-solving": {
    title: "Problem Solving: One Step at a Time",
    description: "Turn one manageable problem into options, a plan and a review instead of trying to solve everything at once.",
    whyItMatters: "When a problem can actually be changed, a simple structure can turn repeated worry into one concrete next step.",
    sections: [
      {
        title: "1. Name the problem and list options",
        body: "Start by defining one specific problem, then generate more than one possible response before judging the ideas. If the problem is too large, break it into a smaller part. The first idea does not have to be the best one.",
      },
      {
        title: "2. Compare and choose",
        body: "Compare the options using what matters in the real situation: safety, likely consequences, values, resources, effort and possible benefits or costs. Then choose one option and decide who will do what, when, where and how.",
      },
      {
        title: "3. Try it and learn from the result",
        body: "Put the plan into action, then review what happened. If it did not work, that is new information rather than proof that problem solving failed. You can change the plan, try another option or bring in more support or information.",
      },
    ],
    practiceTitle: "Work one manageable problem",
    practiceIntro: "Choose something practical and small enough to think about now.",
    practicePrompts: {
      problem: {
        label: "What is the problem, in one or two specific sentences?",
        placeholder: "What is happening, without global labels...",
      },
      options: {
        label: "What are two or three possible responses?",
        placeholder: "1... 2... 3...",
      },
      plan: {
        label: "Which one will you try first, and what is the first action?",
        placeholder: "Chosen option... first step...",
      },
    },
    keyLearning: "Problem solving means naming one specific problem, generating options, choosing a workable plan, trying it and learning from the result.",
  },

  "interpersonal-effectiveness": {
    title: "Interpersonal Effectiveness: Pick Your Priority",
    description: "Before choosing a communication skill, decide what matters most here: the outcome, the relationship or your self-respect.",
    whyItMatters: "A difficult conversation becomes clearer when you know what you are trying to protect instead of trying to get every possible outcome at once.",
    sections: [
      {
        title: "What do you want to happen?",
        body: "Sometimes the main goal is a concrete outcome: make a request, say no, set a boundary, solve a practical conflict or make your position clear. DBT links DEAR MAN most closely with this objective goal.",
      },
      {
        title: "How much does the relationship matter here?",
        body: "Sometimes the way you handle the relationship matters as much as the immediate outcome. Listening, showing interest, validating what is valid and using an appropriate tone can help when preserving connection is important. DBT groups these reminders under GIVE.",
      },
      {
        title: "What do you want to respect about your own behaviour?",
        body: "Self-respect means acting in a way that still fits your values and boundaries afterwards. Fairness, appropriate apologies, values and truthfulness are grouped under FAST. The aim is not to win; it is to avoid abandoning yourself just to get the outcome or keep the peace.",
      },
      {
        title: "Communication cannot control the other person",
        body: "A skill can improve clarity, but it cannot guarantee agreement, compliance or safety. If someone becomes threatening, violent or coercive, prioritise distance and support rather than trying to communicate more perfectly.",
      },
    ],
    check: {
      prompt: "If your main goal is to keep self-respect while saying no, what should guide your response?",
      options: [
        {
          label: "Getting the other person to agree with me.",
          feedback: "Agreement may be useful, but it is not fully under your control.",
        },
        {
          label: "Staying fair, truthful and connected to my values and boundary.",
          correct: true,
          feedback: "Yes. That keeps the focus on the part of the interaction you can control.",
        },
        {
          label: "Making sure the other person is never upset.",
          feedback: "You can communicate respectfully without being responsible for controlling the other person's emotion.",
        },
      ],
    },
    practiceTitle: "Choose the priority first",
    practiceIntro: "Use a safe or hypothetical conversation. You can care about all three goals while still choosing which one leads.",
    practicePrompts: {
      situation: {
        label: "What do you need to communicate?",
        placeholder: "Request, refusal, boundary, disagreement...",
      },
      priority: {
        label: "What matters most here: the outcome, the relationship or your self-respect?",
        placeholder: "My main priority is... because...",
      },
    },
    keyLearning: "Before choosing a communication skill, decide whether the outcome, the relationship or self-respect needs the most attention. No skill can control the other person's response.",
  },

  "dear-man": {
    title: "Make a Clear Request or Boundary: DEAR MAN",
    description: "Use a simple structure when you need to ask, refuse or set a boundary without inventing the perfect words on the spot.",
    whyItMatters: "A structure can reduce mental load during an emotional conversation while still leaving room for context, safety and your own voice.",
    sections: [
      {
        title: "DEAR: build the message",
        body: "Start with the facts, briefly say how the situation affects you, state the request or boundary clearly, then explain a realistic benefit or acknowledge cooperation when that fits. DBT remembers these as Describe, Express, Assert and Reinforce.",
      },
      {
        title: "MAN: stay on point without becoming rigid",
        body: "Mindful means return to the main point instead of chasing every side issue. Appear confident means use a steady delivery that fits you; it does not require eye contact or pretending to feel confident. Negotiate means consider workable alternatives without giving away a boundary that needs to stay firm.",
      },
      {
        title: "Safety beats the script",
        body: "If the other person threatens, intimidates, becomes violent or uses coercion, continuing the script is not the goal. End or leave the interaction if you safely can and use appropriate support.",
      },
    ],
    practiceTitle: "Draft only the key parts",
    practiceIntro: "Use a safe, ordinary example. A few sentences are enough.",
    practicePrompts: {
      dear: {
        label: "What are the facts, your perspective and the clear request or boundary?",
        placeholder: "The facts are... I feel/think... I am asking / I am not willing...",
      },
      man: {
        label: "What will help you stay on your main point and remain flexible where appropriate?",
        placeholder: "Main point, tone, timing, setting, alternative solution...",
      },
    },
    keyLearning: "DEAR MAN gives structure to a request, refusal or boundary. It can improve clarity, but safety matters more than continuing a script and you cannot control the other person's reaction.",
  },

  "give-skill": {
    title: "Protect the Relationship: GIVE",
    description: "When a relationship matters, listen and communicate with less aggression without giving up your own boundaries.",
    whyItMatters: "How you deliver a message can affect connection, but relationship care should not require self-sacrifice or staying in an unsafe interaction.",
    sections: [
      {
        title: "Be gentle, not passive",
        body: "Gentle means reducing unnecessary attacks, threats, name-calling and contempt in your own delivery. It does not mean accepting mistreatment, hiding your position or giving up a boundary.",
      },
      {
        title: "Listen before responding",
        body: "Interested means giving enough attention to understand what the other person is actually saying before deciding how to respond. Listening is not the same as agreement.",
      },
      {
        title: "Validate what is valid; keep your own view",
        body: "Validation means acknowledging what makes sense in the other person's experience or emotion without pretending every claim is correct. An easy manner can mean warmth, a calm tone or appropriate humour when it genuinely fits the relationship and moment.",
      },
      {
        title: "Relationship skills have limits",
        body: "GIVE is not a duty to keep validating someone who is abusive, threatening or coercive. Healthy relationship effectiveness still leaves room for your safety, boundaries and self-respect.",
      },
    ],
    practiceTitle: "Use GIVE in one safe conversation",
    practiceIntro: "Choose a relationship where connection matters and the interaction is safe enough to practise.",
    practicePrompts: {
      validate: {
        label: "What could you genuinely acknowledge without giving up your own position?",
        placeholder: "I can see why... / It makes sense that...",
      },
      delivery: {
        label: "What would listening and a gentler delivery look like for you?",
        placeholder: "Tone, timing, listening, warmth or humour if appropriate...",
      },
    },
    keyLearning: "GIVE helps protect a relationship through gentleness, interest, validation and an appropriate manner, while still preserving your own view, boundaries and safety.",
  },

  "fast-skill": {
    title: "Keep Your Self-Respect: FAST",
    description: "Use fairness, appropriate apologies, values and truthfulness when you want to leave a conversation respecting how you handled yourself.",
    whyItMatters: "Getting the outcome or keeping the peace can sometimes pull you away from your own values or boundaries. FAST keeps self-respect in the picture.",
    sections: [
      {
        title: "Be fair to both sides",
        body: "Fair means taking your own legitimate needs and the other person's legitimate needs and facts seriously. It does not require equal blame, equal responsibility or compromise in every situation.",
      },
      {
        title: "Apologise when it fits, not automatically",
        body: "An apology can be appropriate when you believe you did something that warrants one. You do not need to apologise simply for having a reasonable need, boundary or different opinion.",
      },
      {
        title: "Stick to values and be truthful without giving up privacy",
        body: "Keep important values in view and be as truthful as the situation safely allows. Avoid exaggerating or making promises you do not intend to keep, while remembering that truthfulness does not require disclosing private information to someone who is unsafe or not entitled to it.",
      },
    ],
    practiceTitle: "Plan for self-respect",
    practiceIntro: "Use one safe interaction where you want your response to fit your values afterwards.",
    practicePrompts: {
      value: {
        label: "What value or boundary do you want to keep in view?",
        placeholder: "Honesty, fairness, family, safety, respect, responsibility...",
      },
      fast: {
        label: "What would a fair, appropriately apologetic and truthful response look like?",
        placeholder: "A balanced response that keeps your privacy and boundary...",
      },
    },
    keyLearning: "FAST keeps self-respect in the conversation by balancing fairness, appropriate apologies, values and truthfulness without giving up privacy or safety.",
  },

  "personal-commitment-plan": {
    title: "Your Next-Step Plan",
    description: "Pull together only what you need for the next version of your plan: direction, skills, support and what to do when things get hard.",
    whyItMatters: "A plan is stronger when it does not rely on willpower alone and can be adjusted when real life shows you what is missing.",
    sections: [
      {
        title: "If the plan keeps breaking down, look for what is missing",
        body: "Review five ingredients: direction, useful skills, reasons that matter to you, resources or support, and a concrete action plan. If one part is weak or missing, the answer is not automatically to try harder. Strengthening that part may be the more useful response.",
        bullets: [
          "Direction: what you are moving toward",
          "Skills: what helps you respond differently",
          "Reasons: why the change matters",
          "Resources: people, safeguards and practical support",
          "Action: what you will actually do next",
        ],
      },
      {
        title: "A recurrence does not put you back at the beginning",
        body: "An old behaviour can show up again while change is still happening. Treat it as information: what made the situation harder, what cue appeared, which safeguard or skill was missing, what consequence needs attention, and what useful action comes next. Earlier learning still counts.",
      },
      {
        title: "Choose what to protect, reduce or repair",
        body: "Some parts of your environment may need more distance or stronger safeguards; other connections may be worth repairing or strengthening. Decide what needs a boundary, what should be less accessible, what can be rebuilt, and which trusted people or professionals belong in the plan.",
      },
    ],
    check: {
      prompt: "If your plan keeps failing because an important resource or support is missing, what is the most useful response?",
      options: [
        {
          label: "Rely on more willpower next time.",
          feedback: "Willpower can fluctuate. A repeated missing resource is useful planning information.",
        },
        {
          label: "Strengthen the missing part of the plan and try the next version.",
          correct: true,
          feedback: "Yes. Complex change often needs several parts working together, and plans can be revised.",
        },
        {
          label: "Abandon the direction because a good plan should work the first time.",
          feedback: "Plans can be adjusted as you learn what real situations require.",
        },
      ],
    },
    practiceTitle: "Build the next version, not the perfect version",
    practiceIntro: "Keep this short enough that you would actually look at it again.",
    practicePrompts: {
      direction: {
        label: "What direction are you working toward, and why does it matter?",
        placeholder: "A direction you care about, not a promise of perfection...",
      },
      ingredients: {
        label: "Which skills, safeguards, resources and people matter most?",
        placeholder: "Only the few you are most likely to use...",
      },
      barrier: {
        label: "What is the most likely difficult pattern, and what will you do first when it appears?",
        placeholder: "Early sign... first response... who or what can help...",
      },
    },
    keyLearning: "A workable plan combines direction, skills, reasons, resources and specific actions. When the plan meets a real-world problem, revise the plan instead of turning the problem into a judgement about yourself.",
  },
}

export function prepareRemainingJourneyModuleForSelfGuidedUse(
  module: JourneyModuleDefinition,
): JourneyModuleDefinition {
  const override = REMAINING_MODULE_PRESENTATION_OVERRIDES[module.slug]
  if (!override) return module

  const sections: JourneySection[] = module.sections.map((section, index) => ({
    ...section,
    ...(override.sections?.[index] || {}),
  }))

  const practicePrompts: JourneyPracticePrompt[] = module.practicePrompts.map((prompt) => ({
    ...prompt,
    ...(override.practicePrompts?.[prompt.id] || {}),
  }))

  return {
    ...module,
    ...(override.title ? { title: override.title } : {}),
    ...(override.description ? { description: override.description } : {}),
    ...(override.whyItMatters ? { whyItMatters: override.whyItMatters } : {}),
    sections,
    ...(override.check ? { check: override.check } : {}),
    ...(override.practiceTitle ? { practiceTitle: override.practiceTitle } : {}),
    ...(override.practiceIntro ? { practiceIntro: override.practiceIntro } : {}),
    practicePrompts,
    ...(override.keyLearning ? { keyLearning: override.keyLearning } : {}),
  }
}
