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
 * Presentation-only wording for the early Journey modules.
 *
 * The underlying curriculum remains the fuller source of record. These overrides
 * reduce the amount of information a distressed or low-capacity user has to
 * process on first exposure, while keeping the same concepts, distinctions and
 * exercises available through the guided module flow.
 */
const MODULE_PRESENTATION_OVERRIDES: Record<string, ModulePresentationOverride> = {
  "understanding-the-pattern": {
    description: "Start with one pattern you want to understand, without turning it into a judgement about who you are.",
    whyItMatters: "It is easier to work with one specific pattern than with a harsh judgement about yourself.",
    sections: [
      {
        title: "Focus on the pattern, not on judging yourself",
        body: "Name something specific you do that you want to understand better. It might be gambling when stressed, withdrawing from people, drinking more than intended, reacting impulsively or avoiding something important. A specific pattern gives you something you can observe and work with; it does not define who you are.",
      },
      {
        title: "Notice what the pattern gives you",
        body: "Even an unhelpful pattern is usually doing something for you in the short term. It may bring relief, distraction, excitement, connection, numbness or escape, even when the longer-term cost is unwanted. Understanding that short-term function can help you find a response that meets the same need with fewer costs.",
      },
      {
        title: "You only need enough background to understand today",
        body: "You do not need to explain your whole life to begin. Notice what was happening when the pattern became harder to manage, what it affects now and what you have already tried. The aim is a useful starting picture, not a complete life history.",
      },
    ],
    check: {
      prompt: "Which description gives you the clearest starting point?",
      options: [
        {
          label: "I need to become a completely different person.",
          feedback: "That is a judgement about the whole person rather than a specific pattern you can observe and work with.",
        },
        {
          label: "When I feel overwhelmed, I sometimes use a behaviour for quick relief even though it causes problems later.",
          correct: true,
          feedback: "Yes. It names the context, the short-term function and the longer-term cost without turning the behaviour into an identity.",
        },
        {
          label: "Nothing can change until I fully understand every part of my past.",
          feedback: "Past experiences can matter, but you can begin noticing present patterns without having every part of your history resolved first.",
        },
      ],
    },
    practiceTitle: "Choose one starting point",
    practiceIntro: "Keep this small. One or two sentences is enough.",
    practicePrompts: {
      pattern: {
        label: "What is one pattern you want to understand better?",
        placeholder: "For example: gambling after payday, withdrawing when stressed, avoiding difficult conversations...",
      },
      function: {
        label: "What does it give you in the moment, and what does it cost you later?",
        placeholder: "In the moment... / Later...",
      },
    },
    keyLearning: "A behaviour can be understood without turning it into a judgement about who you are. Look at the situation, what the pattern gives you now and what it costs later.",
  },

  "motivation-for-change": {
    description: "Make room for mixed feelings about change instead of waiting to feel completely certain.",
    whyItMatters: "You do not need perfect motivation to begin. Mixed feelings can show you what change will need to account for.",
    sections: [
      {
        title: "You do not have to feel completely ready",
        body: "Readiness can change from day to day and from one part of life to another. People may be uninterested in change, thinking about it, preparing, actively changing or maintaining a change, but real life rarely follows a neat staircase. Moving back and forth does not mean you have failed.",
      },
      {
        title: "Look honestly at both sides",
        body: "There can be real reasons to change and real reasons part of you wants things to stay the same. The old pattern may still offer relief, familiarity or another short-term benefit, while change may bring uncertainty or effort. Looking at all four sides helps you make a more deliberate choice without pretending change is easy.",
        bullets: [
          "What staying the same gives you",
          "What staying the same costs you",
          "What changing could give you",
          "What feels difficult or risky about changing",
        ],
      },
      {
        title: "Commitment is something you can return to",
        body: "You do not have to feel motivated all day for a change to matter. If an old behaviour happens again, the useful questions are what made it easier to repeat, what you learned and what support or skill may help next time. Commitment can be renewed rather than treated as all-or-nothing.",
      },
    ],
    practiceTitle: "Check both sides",
    practiceIntro: "Write only the strongest point in each direction.",
    practicePrompts: {
      stay: {
        label: "What is one thing staying the same gives you, and one thing it costs you?",
        placeholder: "It gives me... / It costs me...",
      },
      change: {
        label: "What is one benefit of changing, and one thing about change that feels difficult?",
        placeholder: "A benefit... / Something difficult...",
      },
    },
    keyLearning: "Mixed feelings are part of change. Looking at both the benefits and the costs can help you choose a direction without demanding perfect motivation.",
  },

  "chain-analysis": {
    description: "Slow one difficult moment down into smaller steps so you can see where something different might be possible.",
    whyItMatters: "What feels like one sudden action often has smaller steps leading up to it. Those steps give you more than one possible place to interrupt the pattern.",
    sections: [
      {
        title: "Start with what made the moment harder",
        body: "Before a difficult moment, some things may already have made coping harder. In a chain analysis these are often called vulnerabilities: poor sleep, conflict, isolation, hunger, pain, stress, access to money or substances, boredom or loneliness are examples. They do not cause the behaviour by themselves, but they can change how difficult the next moment feels.",
      },
      {
        title: "Follow what happened, one step at a time",
        body: "Start with the event that set things in motion, then notice what followed. This can include thoughts or interpretations, body sensations, emotions, urges, actions and what happened afterwards. Describe the sequence as it happened rather than how you think it should have happened.",
        bullets: [
          "What made the moment harder",
          "What set it off",
          "Thoughts and body sensations",
          "Feelings and urges",
          "What you did",
          "What happened afterwards",
        ],
      },
      {
        title: "Look for one place to interrupt the pattern",
        body: "You are looking for options, not someone to blame. A pause, safeguard, support person, environment change or different action at any point may alter what happens next. You do not need to find a perfect point where everything could have been prevented.",
      },
    ],
    practiceTitle: "Map one short chain",
    practiceIntro: "Use a manageable example. It can be recent, minor or completely hypothetical.",
    practicePrompts: {
      before: {
        label: "Before the behaviour, what made the situation harder and what set it off?",
        placeholder: "For example: tired, payday, argument, alone at home... then a message, thought or event...",
      },
      links: {
        label: "What happened next, step by step?",
        placeholder: "Thought → feeling or body sensation → urge → action → immediate result → later result",
      },
      choice: {
        label: "Where is one realistic place you could interrupt the chain next time?",
        placeholder: "Pause, block access, contact someone, leave the situation, use a skill...",
      },
    },
    keyLearning: "A difficult behaviour often has smaller links leading up to it. Mapping those links can reveal several realistic places where the next chain might change.",
  },

  "wellbeing-principles": {
    title: "Wellbeing: Acceptance, Authenticity & Action",
    description: "Look beyond the problem itself: what needs rebuilding, what is true right now and what small action fits the life you want.",
    whyItMatters: "Stopping one unwanted behaviour can matter a lot, but recovery and growth can also involve rebuilding stability, connection, meaning and direction.",
    sections: [
      {
        title: "Wellbeing is bigger than stopping one behaviour",
        body: "A life can need rebuilding in more than one area. Safety and stability, choice, meaning and purpose, connection, identity, health, learning, autonomy, contribution, activity, creativity and self-control are all possible areas to notice. They are prompts, not a scorecard, and you do not need to work on all of them at once.",
      },
      {
        title: "Acceptance means being clear about what is true now",
        body: "Acceptance is recognising the situation as it currently is, including consequences you wish were different. It does not mean approving of harm, forgiving someone, abandoning boundaries or deciding that nothing can change. It gives you a clearer starting point for deciding what can happen next.",
      },
      {
        title: "Authenticity gives direction; action makes it real",
        body: "Authenticity means bringing your choices a little closer to what actually matters to you. Action is the next observable step: a conversation, safeguard, appointment, routine, boundary or small task. You do not need to become a perfect version of yourself before taking one useful step.",
      },
    ],
    practiceTitle: "Choose one area to strengthen",
    practiceIntro: "Do not try to fix every part of life at once.",
    practicePrompts: {
      area: {
        label: "Which part of life would help most if it felt a little stronger?",
        placeholder: "Safety, stability, connection, health, meaning, activity, contribution...",
      },
      action: {
        label: "What is one small action you could take in that direction over the next few days?",
        placeholder: "Something specific, realistic and observable...",
      },
    },
    keyLearning: "Wellbeing can be rebuilt gradually. Acceptance clarifies where you are, authenticity points toward what matters, and action turns that direction into one practical next step.",
  },

  "mindfulness-foundations": {
    description: "Learn a simple way to notice what is happening before reacting automatically.",
    whyItMatters: "Many later skills start with the same first move: notice what is happening before deciding what to do.",
    sections: [
      {
        title: "Notice, name and take part",
        body: "The first mindfulness skills are to notice what is happening, put simple words to it and stay involved in the present activity. DBT calls these Observe, Describe and Participate. You are not trying to empty your mind; you are practising noticing experience without immediately being pulled by it.",
        bullets: ["Observe: notice", "Describe: name what is present", "Participate: take part in what you are doing"],
      },
      {
        title: "How you pay attention matters too",
        body: "Try to notice with less judgement, return to one thing at a time and focus on what is useful in the situation. DBT calls these Non-judgementally, One-mindfully and Effectively. The goal is not perfect concentration; noticing that your attention wandered and returning is already part of the practice.",
        bullets: ["Less judgement", "One thing at a time", "Focus on what helps"],
      },
      {
        title: "Mindfulness does not mean accepting harm",
        body: "Being present does not mean sitting quietly while something unsafe continues. Mindfulness can help you notice danger, leave, solve a problem, ask for help or set a boundary with more awareness of what is happening.",
      },
    ],
    check: {
      prompt: "Which example is closest to simply describing what is happening?",
      options: [
        {
          label: "Everything is going wrong and I cannot handle any of it.",
          feedback: "That is a broad judgement about the situation rather than a description of what is happening right now.",
        },
        {
          label: "My chest feels tight, I notice the thought ‘I cannot handle this’, and I have an urge to leave.",
          correct: true,
          feedback: "Yes. It names a body sensation, a thought and an urge without treating the thought as a fact or command.",
        },
        {
          label: "I should force myself to stop feeling anxious.",
          feedback: "Mindfulness begins by noticing what is present rather than demanding that a feeling disappear.",
        },
      ],
    },
    practiceTitle: "Notice for 30 seconds",
    practiceIntro: "Look around you, or notice a neutral body sensation. Keep it simple.",
    practicePrompts: {
      observe: {
        label: "What did you notice?",
        placeholder: "A few things you saw, heard, felt or noticed in your body...",
      },
      describe: {
        label: "Can you describe one thought or feeling as something you are noticing, rather than as a fact?",
        placeholder: "I notice the thought... / I notice a feeling of...",
      },
    },
    keyLearning: "Mindfulness begins with noticing and describing what is happening, then choosing how to respond. It is not about having a blank mind or ignoring danger.",
  },
}

export function prepareJourneyModuleForSelfGuidedUse(
  module: JourneyModuleDefinition,
): JourneyModuleDefinition {
  const override = MODULE_PRESENTATION_OVERRIDES[module.slug]
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
