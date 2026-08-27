export type JourneyModuleKind = "foundation" | "learning" | "skill" | "integration"

export type JourneyCategory =
  | "Getting Started"
  | "Mindfulness & Awareness"
  | "Emotions & Responses"
  | "Values & Direction"
  | "Distress & Problem Solving"
  | "Relationships & Connection"
  | "Putting It Together"

export interface JourneySection {
  title: string
  body: string
  bullets?: string[]
}

export interface JourneyKnowledgeCheck {
  prompt: string
  options: Array<{
    label: string
    correct?: boolean
    feedback: string
  }>
}

export interface JourneyPracticePrompt {
  id: string
  label: string
  placeholder?: string
}

export interface JourneyModuleDefinition {
  slug: string
  title: string
  description: string
  category: JourneyCategory
  kind: JourneyModuleKind
  approaches: string[]
  estimatedMinutes: number
  whyItMatters: string
  sections: JourneySection[]
  check: JourneyKnowledgeCheck
  practiceTitle: string
  practiceIntro: string
  practicePrompts: JourneyPracticePrompt[]
  keyLearning: string
  safetyNote?: string
}

export const JOURNEY_CATEGORY_ORDER: JourneyCategory[] = [
  "Getting Started",
  "Mindfulness & Awareness",
  "Emotions & Responses",
  "Values & Direction",
  "Distress & Problem Solving",
  "Relationships & Connection",
  "Putting It Together",
]

export const JOURNEY_MODULES: JourneyModuleDefinition[] = [
  {
    slug: "understanding-the-pattern",
    title: "Understanding the Pattern",
    description: "Start with what is happening, what keeps it going and what you want to change.",
    category: "Getting Started",
    kind: "foundation",
    approaches: ["Behaviour-change reflection", "CBT-informed"],
    estimatedMinutes: 8,
    whyItMatters: "Change is easier to plan when the problem is described in specific, observable terms rather than as a judgement about who you are.",
    sections: [
      {
        title: "Name the behaviour, not your identity",
        body: "A useful starting point is to describe the behaviour or pattern you want to understand. This might be gambling when stressed, withdrawing from people, drinking more than intended, reacting impulsively, avoiding tasks or another pattern that matters to you. A behaviour can be examined and changed; a label such as ‘I am hopeless’ gives you much less to work with.",
      },
      {
        title: "Look at function as well as cost",
        body: "Patterns usually continue for a reason. They may bring short-term relief, distraction, excitement, connection, numbness or escape even when the longer-term consequences are unwanted. Understanding the short-term function does not mean approving of the behaviour. It gives you more information about what a replacement response may need to provide.",
      },
      {
        title: "Build an accurate starting picture",
        body: "Consider what was happening before the pattern became difficult to manage, what changed around that time, what the pattern now affects and what you have already tried. You do not need to explain your entire life. The aim is to notice enough context to identify useful next steps.",
      },
    ],
    check: {
      prompt: "Which description gives you the most useful starting point for change?",
      options: [
        { label: "I am a failure and need to become a different person.", feedback: "That is a judgement about identity rather than a specific pattern you can examine." },
        { label: "When I feel overwhelmed, I sometimes use a behaviour for quick relief even though it creates problems later.", correct: true, feedback: "Yes. It describes a context, a behaviour and its short- and longer-term effects without turning the behaviour into an identity." },
        { label: "Nothing can change until every past event is fully resolved.", feedback: "Past experiences can matter, but you can still begin understanding present patterns and choices now." },
      ],
    },
    practiceTitle: "Define your starting point",
    practiceIntro: "Use a current pattern or a hypothetical example. Keep it specific and behavioural.",
    practicePrompts: [
      { id: "pattern", label: "What behaviour or pattern would you like to understand or change?", placeholder: "For example: withdrawing when stressed, gambling after payday, avoiding difficult conversations..." },
      { id: "function", label: "What does this pattern seem to do for you in the short term, and what does it cost over time?", placeholder: "Short-term relief, distraction or excitement... longer-term effects on money, relationships, sleep, confidence..." },
    ],
    keyLearning: "A specific behaviour pattern can be understood by looking at context, short-term function and longer-term consequences without defining yourself by the behaviour.",
    safetyNote: "You do not need to revisit traumatic experiences to complete this exercise. Use a hypothetical example or stop if reflection becomes overwhelming.",
  },
  {
    slug: "motivation-for-change",
    title: "Motivation for Change",
    description: "Explore readiness, ambivalence and the real advantages and disadvantages of changing.",
    category: "Getting Started",
    kind: "foundation",
    approaches: ["Motivational reflection", "Transtheoretical model"],
    estimatedMinutes: 8,
    whyItMatters: "Motivation naturally moves up and down. Treating ambivalence as information can be more useful than waiting to feel completely certain.",
    sections: [
      {
        title: "Readiness is not a moral test",
        body: "People can be uninterested in change, thinking about it, preparing, actively changing or maintaining a change. These labels can be useful shorthand, but real change is rarely a neat staircase. You may feel ready in one area and unsure in another, or move back and forth over time.",
      },
      {
        title: "Decisional balance",
        body: "A behaviour can have genuine advantages and genuine costs. Change can also have benefits and costs. Listing all four sides helps expose the trade-offs instead of pretending the old pattern had no function or that change will be easy.",
        bullets: [
          "Advantages of staying the same",
          "Disadvantages of staying the same",
          "Advantages of changing",
          "Disadvantages or fears about changing",
        ],
      },
      {
        title: "Commitment can be renewed",
        body: "A decision to change does not remove urges, uncertainty or setbacks. Commitment can be treated as a direction you return to. If an old behaviour happens again, the useful questions are what contributed, what can be learned and what support or skill may be needed next.",
      },
    ],
    check: {
      prompt: "What is the most useful way to think about mixed feelings about change?",
      options: [
        { label: "Mixed feelings prove I do not really want to change.", feedback: "Ambivalence is common and can be explored rather than treated as proof of failure." },
        { label: "I should ignore every benefit the old behaviour ever gave me.", feedback: "Understanding the old behaviour’s function can help you plan alternatives." },
        { label: "I can examine both sides honestly and decide what direction matters to me.", correct: true, feedback: "Exactly. A balanced view can support a more deliberate decision." },
      ],
    },
    practiceTitle: "A four-part decision check",
    practiceIntro: "You can keep this brief. Name the strongest point in each direction rather than trying to write an essay.",
    practicePrompts: [
      { id: "stay", label: "What is one advantage and one disadvantage of staying the same?", placeholder: "Advantage... / Disadvantage..." },
      { id: "change", label: "What is one advantage and one fear or disadvantage of changing?", placeholder: "Advantage... / Fear or disadvantage..." },
    ],
    keyLearning: "Motivation can fluctuate. Looking honestly at the benefits and costs of both staying the same and changing can support a deliberate choice.",
  },
  {
    slug: "chain-analysis",
    title: "Chain Analysis",
    description: "Map the links between vulnerabilities, events, thoughts, feelings, urges, actions and consequences.",
    category: "Getting Started",
    kind: "foundation",
    approaches: ["DBT-informed", "Behaviour analysis"],
    estimatedMinutes: 10,
    whyItMatters: "A behaviour that feels sudden often has a chain of smaller links before it. Finding those links creates more places where a different response may be possible.",
    sections: [
      {
        title: "Start with vulnerabilities",
        body: "Before a difficult moment, you may already be more vulnerable because of poor sleep, conflict, isolation, hunger, pain, stress, access to money or substances, boredom, loneliness or another factor. Vulnerabilities do not cause the behaviour by themselves, but they can change how hard a situation feels.",
      },
      {
        title: "Follow the chain",
        body: "Then notice the prompting event and the links that followed: interpretations, body sensations, emotions, urges, actions and immediate consequences. Try to describe what happened rather than what ‘should’ have happened.",
        bullets: ["Vulnerability", "Prompting event", "Thoughts and interpretations", "Emotions and body sensations", "Urges", "Behaviour", "Short- and longer-term consequences"],
      },
      {
        title: "Look for choice points",
        body: "The goal is not to find one moment to blame. It is to identify several places where a safeguard, pause, skill, support person, environment change or different action could alter the chain next time.",
      },
    ],
    check: {
      prompt: "What is the main purpose of a chain analysis?",
      options: [
        { label: "To prove which person caused the problem.", feedback: "The focus is on understanding links and possible intervention points, not assigning blame." },
        { label: "To identify the sequence of factors around a behaviour and find places where the chain could change.", correct: true, feedback: "Yes. The value of the chain is that it turns one overwhelming event into smaller observable links." },
        { label: "To show that every difficult behaviour can be traced to one trigger.", feedback: "Chains are often influenced by several vulnerabilities and links, not one universal trigger." },
      ],
    },
    practiceTitle: "Map one short chain",
    practiceIntro: "Use a recent low-to-moderate example or invent a hypothetical one. You do not need to use your most distressing experience.",
    practicePrompts: [
      { id: "before", label: "What vulnerabilities and prompting event were present?", placeholder: "Tired, payday, argument, alone at home... then a message, thought or event..." },
      { id: "links", label: "What happened next: thoughts, feelings, urges, action and consequence?", placeholder: "Thought → feeling/body sensation → urge → action → immediate result → later result" },
      { id: "choice", label: "Where is one realistic place the chain could be interrupted next time?", placeholder: "A pause, blocking access, contacting someone, leaving the situation, using a skill..." },
    ],
    keyLearning: "Chain analysis breaks a behaviour into smaller links and helps identify several possible points for support or a different response.",
    safetyNote: "If mapping a real event brings up trauma, severe distress or immediate risk, stop and use a safer example or seek support rather than pushing through the exercise.",
  },
  {
    slug: "wellbeing-principles",
    title: "Wellbeing, Acceptance, Authenticity & Action",
    description: "Build a wider picture of wellbeing and connect insight with a direction for action.",
    category: "Getting Started",
    kind: "foundation",
    approaches: ["Values-based reflection", "Acceptance-based approaches"],
    estimatedMinutes: 9,
    whyItMatters: "Reducing one unwanted behaviour can matter a lot, but lasting change often also involves rebuilding parts of life that give stability, connection, meaning and direction.",
    sections: [
      {
        title: "Wellbeing is broader than symptom reduction",
        body: "Useful areas to consider include safety and stability, choice, meaning and purpose, connection, identity, whole-person health, learning, autonomy, contribution, activity, creativity and self-control. These are not a scorecard. They are prompts for noticing what may need attention.",
      },
      {
        title: "Acceptance",
        body: "Acceptance starts with accurately recognising what is happening now, including consequences you may wish were different. It does not mean approving of harm, forgiving someone, abandoning boundaries or deciding that nothing can change.",
      },
      {
        title: "Authenticity and action",
        body: "Authenticity can be thought of as bringing your actions closer to what matters to you rather than performing a perfect version of yourself. Action turns that direction into something observable: a conversation, safeguard, appointment, routine, boundary or small task.",
      },
    ],
    check: {
      prompt: "Which statement best fits the way Waypoint uses acceptance?",
      options: [
        { label: "Acceptance means approving of everything that has happened.", feedback: "Acceptance is about recognising reality, not approving of it." },
        { label: "Acceptance means giving up on change.", feedback: "Accurate acceptance can help identify what can and cannot be changed." },
        { label: "Acceptance means noticing the facts of the current situation while still choosing boundaries, support or change where possible.", correct: true, feedback: "Yes. Acceptance and action can sit together." },
      ],
    },
    practiceTitle: "A wider wellbeing snapshot",
    practiceIntro: "Choose one area that feels worth strengthening now. You do not need to work on everything at once.",
    practicePrompts: [
      { id: "area", label: "Which area of wellbeing would make the biggest practical difference if it became a little stronger?", placeholder: "Safety, stability, connection, health, meaning, activity, contribution..." },
      { id: "action", label: "What is one small action that would fit that direction?", placeholder: "Something observable and realistic within the next few days..." },
    ],
    keyLearning: "Wellbeing can be viewed as a set of life areas that can be rebuilt gradually. Acceptance clarifies the starting point; authenticity gives direction; action makes the direction practical.",
  },
  {
    slug: "mindfulness-foundations",
    title: "Mindfulness Foundations",
    description: "Learn the DBT ‘What’ and ‘How’ skills for noticing and participating in the present moment.",
    category: "Mindfulness & Awareness",
    kind: "learning",
    approaches: ["DBT-informed", "Mindfulness"],
    estimatedMinutes: 9,
    whyItMatters: "Many later skills begin with the same first move: noticing what is happening before automatically reacting to it.",
    sections: [
      {
        title: "The ‘What’ skills",
        body: "Observe means noticing internal or external experience. Describe means putting simple words to what you notice. Participate means bringing your attention into what you are doing rather than watching yourself from a distance the whole time.",
        bullets: ["Observe: notice", "Describe: name what is present", "Participate: engage in the current activity"],
      },
      {
        title: "The ‘How’ skills",
        body: "Non-judgementally means separating descriptions from global labels where possible. One-mindfully means returning attention to one thing at a time. Effectively means considering what works in the situation and what fits your goals, rather than acting only to prove a point or obey an urge.",
        bullets: ["Non-judgementally", "One-mindfully", "Effectively"],
      },
      {
        title: "Mindfulness is not passivity",
        body: "Noticing the present does not mean letting harmful situations continue. Mindfulness can help you recognise danger, solve a problem, leave a situation, ask for help or set a boundary with more awareness of what is happening.",
      },
    ],
    check: {
      prompt: "Which example is closest to ‘Describe’ in this model?",
      options: [
        { label: "I am useless and everything is terrible.", feedback: "That contains broad judgements rather than a description of the present experience." },
        { label: "My chest feels tight, I am noticing the thought ‘I cannot handle this’, and I have an urge to leave.", correct: true, feedback: "Yes. It names sensations, a thought and an urge without treating them as facts or commands." },
        { label: "I should force myself to stop feeling anxious.", feedback: "Mindfulness begins by noticing what is present rather than demanding a particular feeling." },
      ],
    },
    practiceTitle: "Observe and describe for 30 seconds",
    practiceIntro: "Look around you or notice a neutral body sensation. Keep the exercise simple.",
    practicePrompts: [
      { id: "observe", label: "What did you notice through sight, sound, touch or body sensation?", placeholder: "Three factual observations..." },
      { id: "describe", label: "Can you describe one thought or feeling as an experience rather than a fact?", placeholder: "I am noticing the thought... / I am noticing a feeling of..." },
    ],
    keyLearning: "Mindfulness practice in DBT uses Observe, Describe and Participate, carried out non-judgementally, one-mindfully and effectively.",
  },
  {
    slug: "understanding-your-mind",
    title: "Understanding Your Mind",
    description: "Use the DBT model of Emotional Mind, Reasonable Mind and Wise Mind as a reflection tool.",
    category: "Mindfulness & Awareness",
    kind: "learning",
    approaches: ["DBT-informed"],
    estimatedMinutes: 7,
    whyItMatters: "The three-minds model gives simple language for noticing whether emotion, logic or a combination of both is especially prominent in a decision.",
    sections: [
      {
        title: "Emotional Mind",
        body: "This describes moments when feelings, urges and the immediate emotional meaning of a situation are especially prominent. Emotion is not the enemy; it carries information and can motivate action. Problems can arise when an urge is treated as a command without checking context or consequences.",
      },
      {
        title: "Reasonable Mind",
        body: "This describes moments when facts, logic, planning and analysis are especially prominent. Reason can help solve problems, but relying on logic while dismissing important emotions, needs or values can also leave part of the picture out.",
      },
      {
        title: "Wise Mind",
        body: "Wise Mind is the DBT idea of bringing reason and emotion together. It is not a permanent state, a personality type or proof that a decision is correct. It is a prompt to ask what you feel, what the facts suggest and what response fits your values and situation.",
      },
    ],
    check: {
      prompt: "Which statement best describes Wise Mind?",
      options: [
        { label: "Ignoring emotion and making the most logical decision possible.", feedback: "That is closer to an extreme version of Reasonable Mind." },
        { label: "Doing whatever feels strongest in the moment.", feedback: "That is closer to an emotion-led response." },
        { label: "Considering emotion, facts and what matters before choosing a response.", correct: true, feedback: "Yes. Wise Mind is a way of integrating different parts of the experience." },
      ],
    },
    practiceTitle: "Three-minds reflection",
    practiceIntro: "Use a recent low-stakes decision or a hypothetical one.",
    practicePrompts: [
      { id: "emotion", label: "What did the emotional part of the situation seem to be saying?", placeholder: "What did you feel or want to do immediately?" },
      { id: "reason", label: "What facts or practical considerations were relevant?", placeholder: "What information, consequences or options were present?" },
      { id: "wise", label: "What response might take both into account?", placeholder: "A response that acknowledges the feeling and the facts..." },
    ],
    keyLearning: "Emotional Mind, Reasonable Mind and Wise Mind are reflection concepts for noticing what is influencing a response, not labels for good and bad thinking.",
  },
  {
    slug: "grounding-and-urge-surfing",
    title: "Grounding, Breath, RAIN & Urge Surfing",
    description: "Practise several ways to stay present when thoughts, emotions or urges become intense.",
    category: "Mindfulness & Awareness",
    kind: "skill",
    approaches: ["Mindfulness", "DBT-informed", "Relapse-prevention informed"],
    estimatedMinutes: 10,
    whyItMatters: "When attention becomes captured by an urge or distressing thought, shifting how you attend to the experience can create time before action.",
    sections: [
      {
        title: "External grounding",
        body: "If focusing inward feels overwhelming, orient to the environment. Notice several things you can see, then several sounds, textures or points of contact. The goal is not to force distress away; it is to reconnect attention with the present surroundings.",
      },
      {
        title: "Breath and urge surfing",
        body: "Breath can be used as a neutral point of attention. With urge surfing, you notice where an urge is felt, describe the sensations and observe how they change over time. The aim is to experience the urge without immediately acting on it, not to guarantee that it disappears.",
      },
      {
        title: "RAIN",
        body: "RAIN offers another sequence: Recognise what is present, Allow it to be noticed if that feels safe, Investigate with curiosity rather than interrogation, and use Non-identification or Nurturing to remember that an emotion or urge is an experience you are having rather than your whole identity.",
      },
    ],
    check: {
      prompt: "What is the purpose of urge surfing?",
      options: [
        { label: "To guarantee that every urge disappears within a few minutes.", feedback: "Urges often change, but the exercise should not promise a fixed duration or disappearance." },
        { label: "To notice an urge as a changing experience and practise not automatically acting on it.", correct: true, feedback: "Exactly. The practice changes your relationship to the urge rather than demanding a particular result." },
        { label: "To argue with yourself until you no longer want the behaviour.", feedback: "Urge surfing is based on observation rather than debate." },
      ],
    },
    practiceTitle: "Choose a present-moment practice",
    practiceIntro: "Use a mild sensation, thought or urge. If inward attention is uncomfortable, choose external grounding.",
    practicePrompts: [
      { id: "method", label: "Which method did you try: external grounding, breath, RAIN or urge surfing?", placeholder: "Name the method..." },
      { id: "notice", label: "What did you notice before, during or after the practice?", placeholder: "Changes in attention, body sensations, thoughts or urge intensity... no particular result is required." },
    ],
    keyLearning: "Grounding, breath, RAIN and urge surfing are different ways to observe experience and create space before action; none requires distress to disappear.",
    safetyNote: "Stop inward-focused mindfulness if it increases panic, dissociation or overwhelm. Use external grounding, contact support or choose another skill instead.",
  },
  {
    slug: "building-awareness",
    title: "Building Daily Awareness",
    description: "Notice thoughts, emotions, body sensations, urges and actions without turning the Daily Reflection into a judgement.",
    category: "Mindfulness & Awareness",
    kind: "learning",
    approaches: ["DBT-informed", "Mindfulness"],
    estimatedMinutes: 7,
    whyItMatters: "Repeated short observations can make patterns easier to spot before they feel automatic.",
    sections: [
      {
        title: "Awareness is information",
        body: "A Daily Reflection can capture what is happening right now: mood, urge strength, sleep, stress, behaviour and the situations around them. The point is not to produce a perfect score or prove progress every day.",
      },
      {
        title: "Separate observation from interpretation",
        body: "‘I slept four hours and feel tense’ is an observation. ‘I have ruined the whole week’ is an interpretation. Interpretations matter too, but naming the difference can help you decide what information you are responding to.",
      },
      {
        title: "Notice change over time",
        body: "One Daily Reflection is a snapshot. Several Daily Reflections can show recurring situations, protective routines or times when extra support tends to be useful. Patterns are descriptive, not diagnoses.",
      },
    ],
    check: {
      prompt: "Which statement is the best example of a descriptive Daily Reflection?",
      options: [
        { label: "I am doing recovery badly today.", feedback: "That is an evaluation rather than a description." },
        { label: "My urge is strong, I slept poorly and I have been avoiding messages since this morning.", correct: true, feedback: "Yes. It records several observable parts of the current situation." },
        { label: "Because I feel bad today, tomorrow will be bad too.", feedback: "That turns a current feeling into a prediction." },
      ],
    },
    practiceTitle: "A two-minute awareness check",
    practiceIntro: "Describe the present moment without trying to solve it yet.",
    practicePrompts: [
      { id: "internal", label: "What emotion, body sensation, thought or urge is most noticeable right now?", placeholder: "I notice..." },
      { id: "context", label: "What is happening around you that may be relevant?", placeholder: "Sleep, stress, people, access, environment, time of day..." },
    ],
    keyLearning: "Daily awareness creates descriptive information about what is happening and can reveal patterns without turning each Daily Reflection into a judgement about progress.",
  },
  {
    slug: "recognizing-triggers",
    title: "Recognising Triggers & Vulnerabilities",
    description: "Identify situations and conditions that tend to increase urges or make automatic responses more likely.",
    category: "Mindfulness & Awareness",
    kind: "learning",
    approaches: ["CBT-informed", "Behaviour analysis"],
    estimatedMinutes: 7,
    whyItMatters: "Triggers are easier to plan for when they are described specifically and separated from broader vulnerabilities.",
    sections: [
      {
        title: "Trigger versus vulnerability",
        body: "A trigger is a situation, cue, thought, feeling or event that is closely linked to an urge or response. A vulnerability is a background condition such as fatigue, loneliness, conflict, stress or easy access that can make the trigger harder to manage.",
      },
      {
        title: "Internal and external cues",
        body: "External cues can include places, people, money, devices, times of day, advertising or routines. Internal cues can include thoughts, memories, emotions, physical sensations, boredom or excitement.",
      },
      {
        title: "Planning beats avoidance of all triggers",
        body: "Some high-risk cues can reasonably be reduced or blocked. Others are part of ordinary life. The useful question is whether the best response is to change the environment, prepare a coping plan, seek support, use a skill or combine several approaches.",
      },
    ],
    check: {
      prompt: "Which is the clearest example of a vulnerability rather than a specific trigger?",
      options: [
        { label: "Receiving a gambling promotion on your phone.", feedback: "That is a specific external cue and could function as a trigger." },
        { label: "Being exhausted after several nights of poor sleep.", correct: true, feedback: "Yes. Fatigue can increase vulnerability across many situations." },
        { label: "Seeing a bottle on the kitchen bench.", feedback: "That is a specific external cue." },
      ],
    },
    practiceTitle: "Build a trigger map",
    practiceIntro: "Choose one pattern and list the context without blaming yourself for having triggers.",
    practicePrompts: [
      { id: "cues", label: "What internal or external cues tend to show up before the urge or behaviour?", placeholder: "Places, people, money, emotions, thoughts, boredom, conflict..." },
      { id: "vulnerabilities", label: "What background vulnerabilities tend to make those cues harder to handle?", placeholder: "Sleep, stress, isolation, pain, access, hunger..." },
    ],
    keyLearning: "Triggers are specific cues; vulnerabilities are background conditions that can make a response more likely. Both can inform practical planning.",
  },
  {
    slug: "choice-points",
    title: "Choice Points: Towards & Away Moves",
    description: "Notice moments where an automatic response can be compared with an action that fits your values and goals.",
    category: "Mindfulness & Awareness",
    kind: "learning",
    approaches: ["ACT-informed", "Values-based action"],
    estimatedMinutes: 7,
    whyItMatters: "A choice point turns a broad goal such as ‘do better’ into a moment where two or more concrete actions can be compared.",
    sections: [
      {
        title: "Away moves",
        body: "An away move is an action that takes you further from how you want to respond in that situation. It may still make sense as an attempt to escape pain, fear, boredom or pressure. The label describes direction, not whether you are a good or bad person.",
      },
      {
        title: "Towards moves",
        body: "A towards move is a practical action that fits a value or goal in the current context. It can be very small: delaying access, sending one message, leaving a risky environment, completing one task, being honest or asking for help.",
      },
      {
        title: "Choice is constrained by context",
        body: "Choice does not mean people control every circumstance, emotion or outcome. Safety, poverty, coercion, illness and other realities can constrain options. The exercise is about identifying what is available within the situation, not blaming someone for what they cannot control.",
      },
    ],
    check: {
      prompt: "What makes an action a ‘towards move’ in this exercise?",
      options: [
        { label: "It always feels good immediately.", feedback: "A values-consistent action may still feel uncomfortable." },
        { label: "It fits a value or goal in that situation, even if it is small or difficult.", correct: true, feedback: "Yes. The direction of the action matters more than whether the emotion disappears." },
        { label: "It is what another person thinks you should do.", feedback: "The exercise is meant to connect action with the person’s own values and circumstances." },
      ],
    },
    practiceTitle: "Find one choice point",
    practiceIntro: "Use a current or hypothetical situation where an urge and a longer-term direction pull differently.",
    practicePrompts: [
      { id: "away", label: "What is the automatic or ‘away’ move that might show up?", placeholder: "The action that offers quick relief or follows the usual pattern..." },
      { id: "towards", label: "What is one realistic ‘towards’ move available in the same moment?", placeholder: "A small action that better fits what matters..." },
    ],
    keyLearning: "Choice points help compare an automatic away move with a realistic action that moves toward a value or goal, without pretending every circumstance is controllable.",
  },
  {
    slug: "understanding-emotions",
    title: "Understanding Emotions",
    description: "Learn how emotions involve experience, body responses, expression and action urges.",
    category: "Emotions & Responses",
    kind: "learning",
    approaches: ["DBT-informed", "Emotion regulation"],
    estimatedMinutes: 9,
    whyItMatters: "Emotions can feel like one overwhelming event, but separating their components can make them easier to understand and respond to.",
    sections: [
      {
        title: "Emotions have several parts",
        body: "An emotional episode can include the feeling itself, body sensations, thoughts or interpretations, facial expression and posture, and an action urge. These parts influence one another rather than occurring in a perfectly fixed order.",
      },
      {
        title: "Emotions can carry information",
        body: "Fear may draw attention to threat, guilt may draw attention to behaviour that conflicts with values, sadness may accompany loss and anger may highlight perceived obstruction or unfairness. The message may fit the current facts closely, partly, or not very well. That is why later skills include checking the facts before deciding what to do.",
      },
      {
        title: "Action urges are not commands",
        body: "Fear can urge avoidance, anger can urge attack, sadness can urge withdrawal and shame can urge hiding. Naming the urge creates an opportunity to ask whether following it is effective and safe in this particular situation.",
      },
    ],
    check: {
      prompt: "Which statement about emotions is most accurate for this module?",
      options: [
        { label: "If an emotion is strong, its interpretation must be factually correct.", feedback: "Strength of feeling does not automatically establish the facts." },
        { label: "Emotions can provide useful information and action urges, but the urge can still be checked against context and goals.", correct: true, feedback: "Yes. The emotion matters without automatically deciding the action." },
        { label: "The goal of emotion regulation is to stop having uncomfortable emotions.", feedback: "The goal is not to eliminate normal emotional experience." },
      ],
    },
    practiceTitle: "Map one emotional experience",
    practiceIntro: "Choose a recent low-to-moderate emotion or a hypothetical example.",
    practicePrompts: [
      { id: "emotion", label: "Name the emotion and any body sensations you noticed.", placeholder: "Emotion... body sensations..." },
      { id: "urge", label: "What action urge came with it?", placeholder: "Avoid, approach, argue, hide, seek reassurance, withdraw..." },
      { id: "message", label: "What did the emotion seem to be telling you about the situation?", placeholder: "The meaning your mind gave the event..." },
    ],
    keyLearning: "Emotions include subjective feelings, body responses, interpretations, expression and action urges. An urge can be noticed without automatically being followed.",
  },
  {
    slug: "check-the-facts",
    title: "Thinking Patterns & Check the Facts",
    description: "Separate observations from interpretations and test whether an emotional story fits the available evidence.",
    category: "Emotions & Responses",
    kind: "skill",
    approaches: ["DBT-informed", "CBT-informed"],
    estimatedMinutes: 10,
    whyItMatters: "When emotion is intense, predictions and interpretations can feel as concrete as observable facts. Checking them can widen the range of possible responses.",
    sections: [
      {
        title: "Common thinking patterns",
        body: "People commonly filter for the negative, jump to conclusions, mind-read, predict the future, personalise events, think in all-or-nothing terms, catastrophise, overgeneralise, label, use rigid ‘should’ rules, treat feelings as facts, or magnify one detail while minimising another. These are habits of interpretation, not evidence of something being wrong with you.",
      },
      {
        title: "Describe the facts first",
        body: "Ask what an independent observer could see or hear. Then name the interpretation you added. For example, ‘They did not reply today’ is different from ‘They are deliberately ignoring me because they do not care.’ The second statement may or may not be true, but it contains assumptions that can be checked.",
      },
      {
        title: "Then choose the next skill",
        body: "If the emotion and urge fit the facts and the problem can be changed, problem solving may fit. If the problem cannot be changed right now, acceptance may be more useful. If the emotion or action urge does not fit the facts or is not effective, Opposite Action may be worth considering.",
      },
    ],
    check: {
      prompt: "Which sentence contains the clearest interpretation rather than a direct observation?",
      options: [
        { label: "The meeting started at 9:00 and I arrived at 9:12.", feedback: "That is mostly observable information." },
        { label: "My heart is racing and I notice an urge to leave.", feedback: "That describes a body sensation and urge." },
        { label: "Everyone thinks I am incompetent because I was late.", correct: true, feedback: "Yes. It assumes knowledge of what everyone thinks and adds a broad conclusion." },
      ],
    },
    practiceTitle: "Facts versus story",
    practiceIntro: "Use a situation that is safe to reflect on. You can use a fictional example.",
    practicePrompts: [
      { id: "story", label: "What was the first story or interpretation your mind produced?", placeholder: "They think... / This means... / It will definitely..." },
      { id: "facts", label: "How would you describe only the observable facts and what you directly know?", placeholder: "What happened, what was said, what you observed..." },
    ],
    keyLearning: "Checking the facts means distinguishing what was observed from the interpretations, predictions and judgements added to it before deciding how to respond.",
  },
  {
    slug: "opposite-action",
    title: "Opposite Action",
    description: "Explore when acting differently from an emotional urge may change what happens next.",
    category: "Emotions & Responses",
    kind: "skill",
    approaches: ["DBT-informed"],
    estimatedMinutes: 8,
    whyItMatters: "Some action urges are useful and protective. Others persist after they stop fitting the facts or keep a problem going. Opposite Action is for the second situation.",
    sections: [
      {
        title: "Start by checking the facts",
        body: "Opposite Action is not a rule to do the opposite of every feeling. First ask whether the emotion and urge fit the current facts, whether acting on the urge is effective and whether there is genuine danger or another reason to follow the emotion.",
      },
      {
        title: "Choose the opposite behaviour",
        body: "When the urge does not fit or is not effective, identify the behavioural opposite. Fear may urge avoidance, so a safe opposite can be gradual approach. Unjustified shame may urge hiding, so an opposite can be staying visible or speaking honestly. Anger may urge attack, so an opposite can be stepping back, softening posture or trying to understand another perspective when safe.",
      },
      {
        title: "Go at a safe pace",
        body: "Approach does not mean forcing exposure to danger, abuse, coercion or overwhelming trauma. If fear is protecting you from a genuine threat, use safety planning rather than Opposite Action.",
      },
    ],
    check: {
      prompt: "When is Opposite Action most appropriate?",
      options: [
        { label: "Whenever you feel fear, including when there is real danger.", feedback: "Fear can be protective. Genuine danger calls for safety, not overriding the signal." },
        { label: "When an emotion-driven urge does not fit the facts or is keeping an unhelpful pattern going, and the opposite action is safe.", correct: true, feedback: "Yes. Checking facts and safety comes first." },
        { label: "Whenever you want to prove you have self-control.", feedback: "The aim is effective responding, not proving toughness or control." },
      ],
    },
    practiceTitle: "Plan one opposite action",
    practiceIntro: "Use a low-risk example. Do not use this exercise to approach a situation that may be unsafe.",
    practicePrompts: [
      { id: "urge", label: "What emotion and action urge are you considering?", placeholder: "Emotion... urge to avoid/attack/hide/withdraw..." },
      { id: "facts", label: "Does the urge fit the facts and your safety needs? What evidence matters?", placeholder: "What makes the urge useful, not useful, or mixed?" },
      { id: "opposite", label: "If Opposite Action fits, what small safe opposite behaviour could you try?", placeholder: "A gradual, concrete action..." },
    ],
    keyLearning: "Opposite Action is used after checking facts and safety, when following an emotional urge is not effective or does not fit the situation.",
    safetyNote: "Do not use Opposite Action to override genuine danger, coercion, violence, medical warning signs or other situations where avoidance or leaving is protective.",
  },
  {
    slug: "abc-please",
    title: "ABC PLEASE: Reducing Vulnerability & Building a Life",
    description: "Connect body care, positive experiences and mastery with emotional vulnerability.",
    category: "Emotions & Responses",
    kind: "skill",
    approaches: ["DBT-informed"],
    estimatedMinutes: 10,
    whyItMatters: "Emotional regulation is harder when the body is exhausted, unwell or under strain, and easier to practise when life also contains meaningful and rewarding activities.",
    sections: [
      {
        title: "PLEASE: look after the physical foundations",
        body: "DBT uses PLEASE as a reminder to attend to physical illness, eating, substances, sleep and movement. Waypoint treats these as flexible prompts rather than rigid targets. Follow medical advice from your own clinicians and do not change prescribed medication based on an app.",
      },
      {
        title: "Accumulate positive experiences",
        body: "Positive experiences do not have to be dramatic. Connection, creativity, nature, play, rest, contribution, hobbies and other values-consistent activities can give life more than one source of reward or relief.",
      },
      {
        title: "Build mastery",
        body: "Mastery comes from doing tasks that are achievable but require some effort: learning a skill, completing a practical job, returning to a hobby, organising something or following through on a small commitment. The aim is not perfection. It is repeated evidence that you can act and learn.",
      },
    ],
    check: {
      prompt: "Which use of PLEASE is most consistent with Waypoint?",
      options: [
        { label: "Use it as a strict daily health checklist and treat missed items as failure.", feedback: "The prompts are meant to reduce vulnerability, not become another perfection test." },
        { label: "Use it as a flexible reminder that health, eating, substances, sleep and movement can affect emotional vulnerability.", correct: true, feedback: "Yes. It is a reminder to notice body-related factors and seek appropriate care when needed." },
        { label: "Stop prescribed medication if you think it affects your mood.", feedback: "Medication changes should be discussed with the prescribing clinician." },
      ],
    },
    practiceTitle: "Choose one vulnerability and one life-building action",
    practiceIntro: "Keep both actions realistic for your current capacity.",
    practicePrompts: [
      { id: "please", label: "Which physical foundation would benefit from attention: health care, eating, substance use support, sleep or movement?", placeholder: "What is one safe next step?" },
      { id: "mastery", label: "What is one small pleasurable or mastery-building activity you could schedule?", placeholder: "Connection, creativity, task completion, hobby, nature, learning..." },
    ],
    keyLearning: "ABC PLEASE combines attention to physical vulnerability with positive experiences and achievable mastery-building activities.",
    safetyNote: "Regular alcohol or other drug use can involve withdrawal risk when reduced or stopped suddenly. If dependence may be present, seek medical or addiction advice before making an abrupt change. Follow medication advice from your prescriber.",
  },
  {
    slug: "coping-ahead",
    title: "Coping Ahead",
    description: "Prepare for a difficult but predictable situation by planning and mentally rehearsing effective responses.",
    category: "Emotions & Responses",
    kind: "skill",
    approaches: ["DBT-informed", "Mental rehearsal"],
    estimatedMinutes: 8,
    whyItMatters: "It is often easier to remember a skill when you have decided in advance what you want to do, what could get in the way and how you will respond.",
    sections: [
      {
        title: "Describe the situation specifically",
        body: "Choose a situation that is reasonably likely to occur. Identify the cues, emotions, urges and practical problems that could interfere with the response you want.",
      },
      {
        title: "Choose your skills before you need them",
        body: "Decide what you will do: a safeguard, breathing or grounding, contacting support, leaving the environment, using DEAR MAN, delaying access, problem solving or another response that fits the situation.",
      },
      {
        title: "Rehearse and recover",
        body: "Mentally walk through using the plan, including one likely complication. Then return attention to the present and use a relaxing or grounding activity. The aim is preparation, not repeatedly exposing yourself to distressing material.",
      },
    ],
    check: {
      prompt: "What makes Coping Ahead different from worrying?",
      options: [
        { label: "It imagines every bad outcome until you feel prepared for all of them.", feedback: "That can become rumination rather than a focused plan." },
        { label: "It identifies a likely situation, chooses specific responses and briefly rehearses using them.", correct: true, feedback: "Yes. It is structured preparation tied to action." },
        { label: "It guarantees the situation will go according to plan.", feedback: "Planning can help readiness but cannot control every outcome." },
      ],
    },
    practiceTitle: "Build a short coping-ahead plan",
    practiceIntro: "Choose a predictable situation that is challenging but safe enough to rehearse on your own.",
    practicePrompts: [
      { id: "situation", label: "What situation are you preparing for, and what usually makes it difficult?", placeholder: "Where, when, who, what cues or urges might appear..." },
      { id: "plan", label: "What will you do first, and what backup response will you use if the first step is not enough?", placeholder: "First step... backup step... support person or safeguard..." },
    ],
    keyLearning: "Coping Ahead turns a predictable difficult situation into a specific plan and brief rehearsal of the responses you want to remember.",
    safetyNote: "If rehearsal is likely to bring up trauma memories, severe panic or significant distress, do not force the exercise. Use a less activating example or practise with an appropriate clinician or support person.",
  },
  {
    slug: "discovering-values",
    title: "Discovering Your Values",
    description: "Revisit the values identified during onboarding and distinguish values from goals, rules and outcomes.",
    category: "Values & Direction",
    kind: "learning",
    approaches: ["ACT-informed", "Values clarification"],
    estimatedMinutes: 8,
    whyItMatters: "Values can provide direction when emotions, urges or outside expectations are pulling in several directions at once.",
    sections: [
      {
        title: "Values are directions",
        body: "A value is a quality or direction you want to bring to your behaviour, such as connection, honesty, creativity, learning, responsibility or freedom. A goal is something you can complete. ‘Call my sister tonight’ is a goal; ‘connection’ may be the value it serves.",
      },
      {
        title: "The Life Garden idea",
        body: "During onboarding, you narrowed many meaningful areas and values down by making repeated choices. That exercise is not saying the crossed-out areas do not matter. It is designed to reveal what becomes hardest to let go of when priorities compete.",
      },
      {
        title: "Values are not rules for perfection",
        body: "You can care deeply about a value and still act against it sometimes. Values are most useful as a compass for the next choice rather than a test of whether you are a good person.",
      },
    ],
    check: {
      prompt: "Which option is a value rather than a completed goal?",
      options: [
        { label: "Attend my appointment on Thursday.", feedback: "That is a concrete goal or action." },
        { label: "Connection.", correct: true, feedback: "Yes. Connection can guide many different actions over time." },
        { label: "Never make another mistake.", feedback: "That is an unrealistic rule, not a values direction." },
      ],
    },
    practiceTitle: "Bring one value into the present",
    practiceIntro: "If you remember your onboarding values, use one of them. Otherwise choose any value that matters today.",
    practicePrompts: [
      { id: "value", label: "Which value feels especially relevant right now, and what does it mean to you?", placeholder: "Use your own definition rather than a dictionary definition..." },
      { id: "behaviour", label: "What would this value look like as behaviour in one ordinary situation?", placeholder: "A conversation, boundary, routine, task or choice..." },
    ],
    keyLearning: "Values are ongoing directions that can guide behaviour. Goals are concrete actions or outcomes that can express those values.",
  },
  {
    slug: "recognizing-strengths",
    title: "Recognising Your Strengths & Resources",
    description: "Identify strengths shown through past actions and the people or resources that helped you use them.",
    category: "Values & Direction",
    kind: "learning",
    approaches: ["Strengths-based reflection"],
    estimatedMinutes: 8,
    whyItMatters: "When people are struggling, their attention can narrow around failures and deficits. Looking at previous change can reveal abilities and external resources that still exist.",
    sections: [
      {
        title: "Strengths are shown in action",
        body: "A strength can be something like persistence, creativity, humour, honesty, problem solving, empathy, courage, practicality, leadership, patience or curiosity. The useful question is not whether you possess a trait perfectly, but where your behaviour has shown some evidence of it.",
      },
      {
        title: "Look at previous change",
        body: "Think of changes you have already made in life: learning work skills, parenting, moving house, leaving or repairing a relationship, getting through illness, changing a habit, asking for help or rebuilding after a setback. What did those situations require from you?",
      },
      {
        title: "External resources count",
        body: "Support from whānau, friends, clinicians, mentors, groups, employers, community organisations or practical tools is not evidence that the change ‘does not count’. Knowing how to use support is itself a resource.",
      },
    ],
    check: {
      prompt: "Which is the most useful way to identify a strength?",
      options: [
        { label: "Only count strengths that you show perfectly all the time.", feedback: "Strengths can be situational and still be useful." },
        { label: "Look for qualities demonstrated in real actions you have already taken, including times you used support.", correct: true, feedback: "Yes. Behaviour gives concrete evidence of strengths and resources." },
        { label: "Ignore external help so you know the change was completely your own.", feedback: "External resources are an important part of effective change." },
      ],
    },
    practiceTitle: "Find evidence of your strengths",
    practiceIntro: "Use a past change of any size. It does not need to be related to your current problem area.",
    practicePrompts: [
      { id: "change", label: "What is one change or difficult situation you have managed before?", placeholder: "A work, family, health, learning, financial or personal example..." },
      { id: "strengths", label: "What strengths or external resources helped you through it?", placeholder: "Persistence, humour, practical thinking, a friend, a service, routine..." },
    ],
    keyLearning: "Strengths can be identified through previous actions, and external support is a legitimate resource rather than a weakness.",
  },
  {
    slug: "values-to-action",
    title: "From Values to Committed Action",
    description: "Turn values into small goals, identify barriers and deliberately build connection and support.",
    category: "Values & Direction",
    kind: "integration",
    approaches: ["ACT-informed", "Goal planning"],
    estimatedMinutes: 10,
    whyItMatters: "Values become more useful when they are translated into behaviour that can actually happen in a real week with real barriers.",
    sections: [
      {
        title: "Choose one values-based activity",
        body: "Start with one area rather than redesigning your whole life. A values-based activity might be reconnecting with family, returning to exercise, creating something, volunteering, learning, attending treatment, improving financial safeguards or building a healthier routine.",
      },
      {
        title: "Make the first goal small enough to start",
        body: "Define what you will do, when and where. A goal should be challenging enough to matter but achievable enough that you can learn from trying it. If it is too large, break it into the first observable step.",
      },
      {
        title: "Plan for barriers and connection",
        body: "Identify what may get in the way and what support would make the action more likely. Connection can include whānau, friends, mentors, groups, community, clinicians or practical accountability. Healthy support should increase your options and safety, not take control away from you.",
      },
    ],
    check: {
      prompt: "Which is the strongest first committed action?",
      options: [
        { label: "Become a completely different person this month.", feedback: "That is too broad to act on or evaluate." },
        { label: "Because connection matters to me, I will message one trusted friend after work on Wednesday.", correct: true, feedback: "Yes. It links a value to a specific, realistic action." },
        { label: "Wait until I feel fully motivated before deciding what to do.", feedback: "Motivation can fluctuate; a small action can be planned even when motivation is mixed." },
      ],
    },
    practiceTitle: "Create one values-based action plan",
    practiceIntro: "Use one value and one realistic action for the next few days.",
    practicePrompts: [
      { id: "goal", label: "What specific action will express the value, and when will you do it?", placeholder: "Value → action → day/time/place..." },
      { id: "barrier", label: "What barrier is most likely, and how could you respond to it?", placeholder: "Barrier... coping or problem-solving response..." },
      { id: "support", label: "Who or what could support the action without taking over your choice?", placeholder: "Person, group, safeguard, reminder, environment change..." },
    ],
    keyLearning: "Committed action links a value with a specific behaviour, a plan for barriers and appropriate support or connection.",
  },
  {
    slug: "stop-skill",
    title: "Creating Space: STOP & TIP",
    description: "Use STOP to pause a fast-moving situation and explore body-based TIP options when intensity is high.",
    category: "Distress & Problem Solving",
    kind: "skill",
    approaches: ["DBT-informed"],
    estimatedMinutes: 9,
    whyItMatters: "When an urge is moving faster than deliberate thinking, the first task may simply be to create enough space to decide what to do next.",
    sections: [
      {
        title: "STOP",
        body: "Stop: pause the action if you safely can. Take a step back: create physical or mental distance. Observe: notice the facts, emotions, body sensations and urges. Proceed mindfully: choose the next action deliberately rather than automatically.",
      },
      {
        title: "TIP options",
        body: "DBT also uses body-based strategies commonly grouped as TIP, including temperature change, brief intense movement and paced breathing or muscle relaxation. They are options, not requirements. Gentler versions are appropriate when cold exposure or exercise is not medically suitable.",
      },
      {
        title: "Create environmental space too",
        body: "A pause can be strengthened by practical action: move away from access, hand over a card, close an app, leave a venue, call someone, delay a purchase or put physical distance between you and the behaviour.",
      },
    ],
    check: {
      prompt: "What comes first in STOP?",
      options: [
        { label: "Solve the entire problem immediately.", feedback: "STOP is meant to create enough space before deciding on the next response." },
        { label: "Pause the automatic action if it is safe to do so.", correct: true, feedback: "Yes. The first move is to interrupt momentum." },
        { label: "Convince yourself that the emotion is irrational.", feedback: "The skill begins with pausing and observing, not arguing with the emotion." },
      ],
    },
    practiceTitle: "Write a personal pause sequence",
    practiceIntro: "Think about a situation where an urge tends to move quickly. You can use a hypothetical example.",
    practicePrompts: [
      { id: "stop", label: "What would ‘Stop’ and ‘Take a step back’ look like in that situation?", placeholder: "Put phone down, leave room, wait ten minutes, move away from access..." },
      { id: "proceed", label: "After observing, what is one safe next action you could choose?", placeholder: "Grounding, contact someone, safeguard, problem-solving step..." },
    ],
    keyLearning: "STOP creates a pause before action. TIP offers optional body-based methods that may reduce intensity for some people while practical safeguards create additional space.",
    safetyNote: "Cold exposure and intense exercise affect the body and are not suitable for everyone, including some people with heart or other medical conditions. Use gentler options or check with a clinician if unsure. Waypoint is not an emergency response service.",
  },
  {
    slug: "accepts-improve",
    title: "Distress Tolerance Toolkit: ACCEPTS & IMPROVE",
    description: "Build a menu of short-term strategies for getting through a difficult period without making the situation worse.",
    category: "Distress & Problem Solving",
    kind: "skill",
    approaches: ["DBT-informed"],
    estimatedMinutes: 10,
    whyItMatters: "When a problem cannot be solved immediately, a short-term coping strategy can buy time until you are able to use problem solving, support or acceptance.",
    sections: [
      {
        title: "ACCEPTS: shift attention temporarily",
        body: "ACCEPTS is a memory aid for several distraction options: Activities, Contributing, Comparisons used carefully, creating different Emotions, Pushing away for a limited period, changing Thoughts and using Sensations. Distraction is temporary; it is not a requirement to avoid the problem forever.",
      },
      {
        title: "IMPROVE: make the moment more workable",
        body: "The workbook you provided adapts IMPROVE as Imagery, Meaning, Planning, Relaxing, One thing in the moment, Vacation or brief time-out, and Encouragement. These are different routes to making a difficult period more manageable without claiming the distress must disappear.",
      },
      {
        title: "Compassion matters",
        body: "Distress tolerance works better when the skill is not used as punishment. A compassionate stance can sound like: ‘This is difficult, I do not have to solve everything this minute, and I can choose one response that does less harm.’ Self-compassion does not remove accountability for behaviour; it can make learning from it easier.",
      },
    ],
    check: {
      prompt: "What is the best use of distraction in distress tolerance?",
      options: [
        { label: "Avoid every difficult problem indefinitely.", feedback: "Distraction is generally a short-term tool, not a replacement for problems that need action." },
        { label: "Create temporary space when intensity is too high, then return to problem solving, support or acceptance when able.", correct: true, feedback: "Yes. The goal is to get through the moment without making things worse." },
        { label: "Use it only if it makes the emotion disappear completely.", feedback: "A skill can still be useful even if the emotion remains." },
      ],
    },
    practiceTitle: "Build your short-term coping menu",
    practiceIntro: "Choose options that are realistic, accessible and safe for you.",
    practicePrompts: [
      { id: "accepts", label: "Name two ACCEPTS-style options you could realistically use for 10–30 minutes.", placeholder: "Activity, contribution, sensory shift, different thought focus..." },
      { id: "improve", label: "Name two IMPROVE-style options that could make a difficult moment more workable.", placeholder: "Imagery, meaning, planning, relaxing, one thing, short break, encouragement..." },
    ],
    keyLearning: "ACCEPTS and IMPROVE provide temporary coping options for difficult moments so that the next response can be more deliberate.",
  },
  {
    slug: "reality-acceptance",
    title: "Reality Acceptance, Willingness & Turning the Mind",
    description: "Practise recognising facts that cannot be changed right now while continuing to protect safety, values and available choices.",
    category: "Distress & Problem Solving",
    kind: "skill",
    approaches: ["DBT-informed", "Acceptance-based"],
    estimatedMinutes: 10,
    whyItMatters: "Energy can become consumed by arguing with a fact that has already happened or cannot be changed in this moment. Acceptance aims to free some of that energy for the choices that remain.",
    sections: [
      {
        title: "Acceptance is not approval",
        body: "Accepting that something is real does not mean you approve of it, forgive it, caused it, deserve it, agree with another person, abandon legal rights or remain in danger. You can accept the fact that something happened and still seek justice, leave, set boundaries or work to change what comes next.",
      },
      {
        title: "Willingness",
        body: "Willingness means being open to the response that is effective and values-consistent in the current situation. Reluctance can carry information too: fear, exhaustion, uncertainty or a genuine safety concern. The aim is not obedience; it is noticing what is getting in the way and choosing deliberately.",
      },
      {
        title: "Turning the mind",
        body: "Acceptance often has to be chosen repeatedly. When you notice your mind returning to ‘this must not be true’ or replaying an unchangeable fact, you can turn attention back to: what is true now, what is still within my control, and what next action fits the situation?",
      },
    ],
    check: {
      prompt: "Which statement is consistent with reality acceptance?",
      options: [
        { label: "If I accept what happened, I must forgive the person and stop taking action.", feedback: "Acceptance does not require forgiveness, approval or giving up action." },
        { label: "I can acknowledge that this happened, dislike it, protect myself and decide what action is still available.", correct: true, feedback: "Yes. Acceptance and protective action can coexist." },
        { label: "If I am still angry, I have failed to accept reality.", feedback: "Acceptance does not require a specific emotion or the disappearance of anger." },
      ],
    },
    practiceTitle: "Facts, resistance and available action",
    practiceIntro: "Choose a situation that is safe enough to reflect on. Do not use this exercise to talk yourself into staying in danger.",
    practicePrompts: [
      { id: "fact", label: "What is one fact of the situation that is already true or cannot be changed right now?", placeholder: "Describe it without approval or self-blame..." },
      { id: "control", label: "What is still within your control or influence?", placeholder: "Boundary, support, report, plan, next conversation, self-care, leaving..." },
    ],
    keyLearning: "Reality acceptance acknowledges what is already true while preserving boundaries, safety and action. Turning the mind is the repeated return to facts and available choices.",
    safetyNote: "Acceptance is not a reason to remain in an abusive, coercive, violent or otherwise unsafe situation. Prioritise safety and appropriate support.",
  },
  {
    slug: "problem-solving",
    title: "Six-Step Problem Solving",
    description: "Define a solvable problem, generate options, choose a plan, act and review the result.",
    category: "Distress & Problem Solving",
    kind: "skill",
    approaches: ["CBT-informed", "DBT-informed"],
    estimatedMinutes: 10,
    whyItMatters: "Distress tolerance is useful when a problem cannot be solved immediately. When a problem can be changed, structured problem solving helps convert worry into an action plan.",
    sections: [
      {
        title: "1–2: Define and brainstorm",
        body: "Define the problem specifically and separate it into smaller problems if needed. Then brainstorm several possible responses before evaluating them. The first idea does not have to be the best one.",
      },
      {
        title: "3–4: Compare and plan",
        body: "Consider advantages, disadvantages, safety, values, resources and likely consequences. Choose the option that appears most workable and specify who, what, when, where and how.",
      },
      {
        title: "5–6: Act and evaluate",
        body: "Try the plan, then review what happened. A plan that did not work is information, not proof that problem solving failed. Return to the options, change the plan or seek more support or information.",
      },
    ],
    check: {
      prompt: "What should happen before choosing the solution?",
      options: [
        { label: "Act on the first option that comes to mind so you do not overthink it.", feedback: "Urgent safety situations can require quick action, but ordinary problem solving benefits from generating and comparing options." },
        { label: "Define the problem and generate more than one possible response.", correct: true, feedback: "Yes. A specific problem and multiple options make comparison possible." },
        { label: "Wait until you know with certainty which option will work.", feedback: "Problem solving usually works with uncertainty; plans can be reviewed and adjusted." },
      ],
    },
    practiceTitle: "Solve one manageable problem",
    practiceIntro: "Choose a practical problem that is small enough to work through now.",
    practicePrompts: [
      { id: "problem", label: "Define the problem in one or two specific sentences.", placeholder: "What is happening, without global labels..." },
      { id: "options", label: "List at least three possible responses, including one you might not normally consider.", placeholder: "1... 2... 3..." },
      { id: "plan", label: "Which option will you try first, and what are the first two action steps?", placeholder: "Chosen option... Step 1... Step 2..." },
    ],
    keyLearning: "Structured problem solving moves from a specific problem to options, comparison, a concrete action plan and review.",
  },
  {
    slug: "interpersonal-effectiveness",
    title: "Interpersonal Effectiveness",
    description: "Balance three goals in difficult conversations: the objective, the relationship and your self-respect.",
    category: "Relationships & Connection",
    kind: "learning",
    approaches: ["DBT-informed"],
    estimatedMinutes: 9,
    whyItMatters: "Communication can become clearer when you know which goal matters most in a situation instead of trying to maximise every outcome at once.",
    sections: [
      {
        title: "Objective effectiveness",
        body: "This is about the concrete outcome: making a request, saying no, setting a boundary, resolving a practical conflict or making your position understood. DEAR MAN is the DBT skill usually linked to this goal.",
      },
      {
        title: "Relationship effectiveness",
        body: "This is about how you want to treat the relationship while communicating. Listening, showing interest, validating what is valid and using an appropriate tone can matter when preserving or strengthening the relationship is important. GIVE is linked to this goal.",
      },
      {
        title: "Self-respect effectiveness",
        body: "This is about behaving in a way you can respect afterwards: being fair, not apologising simply for existing or having a reasonable need, staying connected to values and being truthful. FAST is linked to this goal.",
      },
      {
        title: "No skill controls the other person",
        body: "Effective communication can improve clarity; it cannot guarantee agreement, compliance or safety. If someone becomes threatening, violent or coercive, prioritise distance and support rather than trying to communicate more perfectly.",
      },
    ],
    check: {
      prompt: "If your main concern is keeping self-respect while saying no, which DBT skill is most directly associated with that goal?",
      options: [
        { label: "DEAR MAN", feedback: "DEAR MAN is primarily linked with objective effectiveness." },
        { label: "GIVE", feedback: "GIVE is primarily linked with relationship effectiveness." },
        { label: "FAST", correct: true, feedback: "Yes. FAST is the self-respect effectiveness reminder." },
      ],
    },
    practiceTitle: "Choose the goal before the skill",
    practiceIntro: "Think of a safe conversation or a hypothetical one.",
    practicePrompts: [
      { id: "situation", label: "What is the situation, and what do you want to communicate?", placeholder: "Request, refusal, boundary, disagreement..." },
      { id: "priority", label: "Which goal matters most here: objective, relationship or self-respect? Why?", placeholder: "It can be more than one, but choose a priority..." },
    ],
    keyLearning: "Interpersonal effectiveness balances objective, relationship and self-respect goals. Communication skills improve clarity but do not control another person’s response.",
    safetyNote: "Do not use communication skills as a reason to remain in a threatening, violent or coercive interaction. Safety comes first.",
  },
  {
    slug: "dear-man",
    title: "DEAR MAN",
    description: "Practise a structured request, refusal or boundary while keeping safety and context in view.",
    category: "Relationships & Connection",
    kind: "skill",
    approaches: ["DBT-informed"],
    estimatedMinutes: 10,
    whyItMatters: "A structure can reduce the pressure to invent the perfect words during an emotional conversation.",
    sections: [
      {
        title: "DEAR: build the message",
        body: "Describe the relevant facts. Express your feelings or perspective briefly. Assert the request, refusal or boundary clearly. Reinforce by explaining a realistic benefit or acknowledging cooperation when appropriate.",
      },
      {
        title: "MAN: deliver it effectively",
        body: "Mindful means return to the main point without being pulled into every side issue. Appear confident means use a steady, respectful delivery that fits you; it does not require eye contact or pretending to feel confident. Negotiate means consider workable alternatives without giving up a boundary that needs to remain firm.",
      },
      {
        title: "Know when to leave the script",
        body: "If another person threatens, intimidates, becomes violent or uses coercion, continuing a ‘broken record’ is not the goal. End or leave the interaction if you safely can and seek appropriate support.",
      },
    ],
    check: {
      prompt: "Which is the clearest Assert step?",
      options: [
        { label: "You should know why I am upset.", feedback: "That expects the other person to infer the request." },
        { label: "I am not able to lend you money. Please stop asking me today.", correct: true, feedback: "Yes. It states the boundary directly." },
        { label: "Maybe it would be nice if things were different somehow.", feedback: "That does not clearly state the request or boundary." },
      ],
    },
    practiceTitle: "Draft a short DEAR MAN",
    practiceIntro: "Use a safe, ordinary scenario. You do not need to practise on a person who may retaliate or become dangerous.",
    practicePrompts: [
      { id: "dear", label: "Write the Describe, Express and Assert parts in a few sentences.", placeholder: "Facts... I feel/think... I am asking / I am not willing..." },
      { id: "man", label: "What will help you stay mindful, steady and flexible during the conversation?", placeholder: "Main point, tone, time, setting, alternative solution..." },
    ],
    keyLearning: "DEAR MAN structures the content and delivery of a request, refusal or boundary while recognising that you cannot control the other person’s reaction.",
    safetyNote: "If the other person is threatening, violent or coercive, prioritise safety, distance and support rather than continuing the script.",
  },
  {
    slug: "give-skill",
    title: "GIVE",
    description: "Practise relationship effectiveness through gentleness, interest, validation and an easy manner.",
    category: "Relationships & Connection",
    kind: "skill",
    approaches: ["DBT-informed"],
    estimatedMinutes: 8,
    whyItMatters: "When preserving a relationship matters, how a message is delivered can be as important as the request itself.",
    sections: [
      {
        title: "G — Gentle",
        body: "Avoid unnecessary attacks, threats, name-calling and contempt. Gentleness does not mean being passive or accepting mistreatment; it means reducing aggression in your own delivery where that is safe and useful.",
      },
      {
        title: "I — Interested",
        body: "Listen to the other person’s response and give them enough room to speak. Interest is not agreement. It is an attempt to understand what they are actually saying before you decide how to respond.",
      },
      {
        title: "V — Validate, E — Easy manner",
        body: "Validation means acknowledging what makes sense in the other person’s perspective or emotion without pretending everything they say is correct. An easy manner can mean a calm tone, warmth or appropriate humour when it fits the relationship and the moment.",
      },
      {
        title: "GIVE has limits",
        body: "Relationship skills are not a duty to keep validating someone who is abusive or coercive. A healthy relationship requires room for your boundaries and self-respect too.",
      },
    ],
    check: {
      prompt: "What does validation mean in GIVE?",
      options: [
        { label: "Agree with everything the other person says.", feedback: "Validation can acknowledge emotion or a valid point without full agreement." },
        { label: "Acknowledge what makes sense in their experience while keeping your own view and boundaries.", correct: true, feedback: "Yes. Validation and disagreement can coexist." },
        { label: "Take responsibility for making the other person feel better.", feedback: "You are not responsible for controlling another person’s emotional response." },
      ],
    },
    practiceTitle: "Add GIVE to one conversation",
    practiceIntro: "Choose a safe conversation where the relationship matters.",
    practicePrompts: [
      { id: "validate", label: "What could you genuinely validate without giving up your own position?", placeholder: "I can see why... / It makes sense that..." },
      { id: "delivery", label: "What would a gentle, interested and appropriately easy manner look like for you?", placeholder: "Tone, timing, listening, humour or warmth if appropriate..." },
    ],
    keyLearning: "GIVE supports relationship effectiveness by reducing unnecessary aggression, listening, validating what is valid and using an appropriate manner without requiring agreement or self-sacrifice.",
    safetyNote: "GIVE is not a requirement to stay engaged with abuse, threats or coercion. Protect safety and boundaries first.",
  },
  {
    slug: "fast-skill",
    title: "FAST",
    description: "Keep fairness, appropriate apologies, values and truthfulness in view when self-respect is the priority.",
    category: "Relationships & Connection",
    kind: "skill",
    approaches: ["DBT-informed"],
    estimatedMinutes: 8,
    whyItMatters: "Sometimes getting the outcome or keeping the peace can come at the cost of acting against your own values. FAST is a reminder to include self-respect in the decision.",
    sections: [
      {
        title: "F — Fair",
        body: "Try to be fair to yourself and the other person. Fairness does not require equal blame or compromise in every situation; it means taking both sets of legitimate needs and facts seriously.",
      },
      {
        title: "A — Apologies, when appropriate",
        body: "Apologise when you believe an apology is warranted. Avoid automatic apologies simply for having a need, a boundary, a different opinion or for taking up space.",
      },
      {
        title: "S — Stick to values, T — Truthful",
        body: "Keep important values in view and be as truthful as the situation safely allows. Avoid exaggerating, inventing helplessness or making promises you do not intend to keep. Truthfulness does not require disclosing private information to someone who is unsafe or not entitled to it.",
      },
    ],
    check: {
      prompt: "Which statement best reflects FAST?",
      options: [
        { label: "Never apologise, because apologies reduce self-respect.", feedback: "Appropriate apologies can support both self-respect and relationships." },
        { label: "Apologise when it fits, but not automatically for having a reasonable need, boundary or opinion.", correct: true, feedback: "Yes. The skill aims for appropriate rather than excessive apology." },
        { label: "Tell everyone everything so you can say you were completely truthful.", feedback: "Truthfulness does not remove your right to privacy or safety." },
      ],
    },
    practiceTitle: "Plan for self-respect",
    practiceIntro: "Choose a safe interaction where you want to leave the conversation feeling aligned with your values.",
    practicePrompts: [
      { id: "value", label: "What value or boundary do you want to keep in view?", placeholder: "Honesty, fairness, family, safety, respect, responsibility..." },
      { id: "fast", label: "Where might you over-apologise, exaggerate, give in or hide your position? What would a FAST response look like instead?", placeholder: "A more balanced response..." },
    ],
    keyLearning: "FAST supports self-respect by balancing fairness, appropriate apologies, values and truthfulness while preserving privacy and safety.",
  },
  {
    slug: "personal-commitment-plan",
    title: "Your Personal Commitment Plan",
    description: "Pull the Journey together into a practical plan for direction, skills, resources, barriers and support.",
    category: "Putting It Together",
    kind: "integration",
    approaches: ["Relapse-prevention informed", "Values-based planning"],
    estimatedMinutes: 12,
    whyItMatters: "Complex change is easier to maintain when it is supported by a clear direction, relevant skills, reasons to keep going, practical resources and a plan for setbacks.",
    sections: [
      {
        title: "Five ingredients to review",
        body: "Ask whether your current plan has: a direction or vision; the skills you need; incentives or reasons that matter to you; resources and support; and a concrete action plan. If one area is missing, the answer is not necessarily ‘try harder’. It may be to strengthen that ingredient.",
      },
      {
        title: "Plan for recurrence without defining yourself by it",
        body: "An old behaviour can recur during change. Treat the event as information: what vulnerabilities and cues were present, which safeguard or skill was missing, what consequence needs attention, and what is the next useful action? Recurrence does not erase earlier learning.",
      },
      {
        title: "Protect and repair your environment",
        body: "Some changes involve reducing access to high-risk environments or relationships; others involve repairing connections that support wellbeing. Think carefully about what needs distance, what needs a boundary, what can be rebuilt and which professionals or trusted people should be part of the plan.",
      },
    ],
    check: {
      prompt: "If a change plan keeps failing because the needed resources or support are missing, what is the most useful conclusion?",
      options: [
        { label: "You are not committed enough.", feedback: "A missing resource is a planning problem, not proof of weak character." },
        { label: "Strengthen the missing part of the plan rather than relying only on more willpower.", correct: true, feedback: "Yes. Complex change often needs several supports working together." },
        { label: "Abandon the goal because a complete plan should work the first time.", feedback: "Plans can be revised as new information appears." },
      ],
    },
    practiceTitle: "Build your next version of the plan",
    practiceIntro: "This is a living plan. Keep it short enough that you could actually revisit it.",
    practicePrompts: [
      { id: "direction", label: "What direction are you working toward, and why does it matter to you?", placeholder: "A values-based direction rather than a promise of perfection..." },
      { id: "ingredients", label: "Which skills, safeguards, resources and people are most important to your plan?", placeholder: "Skills... safeguards... professional or personal support..." },
      { id: "barrier", label: "What is the most likely barrier or recurrence pattern, and what will you do when it appears?", placeholder: "Early warning signs... first response... who to contact..." },
    ],
    keyLearning: "A sustainable change plan combines direction, skills, motivation, resources, support and specific actions, and it is revised when new information appears.",
    safetyNote: "If your plan includes immediate safety concerns, withdrawal risk, violence, self-harm risk or other urgent clinical needs, involve appropriate professional or emergency support rather than relying on a self-guided plan alone.",
  },
]

export const JOURNEY_MODULE_BY_SLUG = Object.fromEntries(
  JOURNEY_MODULES.map((module) => [module.slug, module]),
) as Record<string, JourneyModuleDefinition>

export const JOURNEY_MODULE_TITLE_BY_SLUG = Object.fromEntries(
  JOURNEY_MODULES.map((module) => [module.slug, module.title]),
) as Record<string, string>
