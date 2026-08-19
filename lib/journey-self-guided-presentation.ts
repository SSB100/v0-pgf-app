import type {
  JourneyKnowledgeCheck,
  JourneyModuleDefinition,
  JourneyPracticePrompt,
  JourneySection,
} from "@/lib/journey-curriculum"
import { prepareRemainingJourneyModuleForSelfGuidedUse } from "@/lib/journey-self-guided-presentation-remaining"

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
 * Presentation wording for the opening Journey modules.
 *
 * The fuller curriculum remains the source of record. These overrides keep the
 * teaching accurate while using a warmer peer-support tone, everyday examples
 * and analogies that are easier to relate to when concentration is low.
 */
const MODULE_PRESENTATION_OVERRIDES: Record<string, ModulePresentationOverride> = {
  "understanding-the-pattern": {
    title: "Understanding the Pattern",
    description: "Start with one thing that keeps happening and get curious about it, without turning it into a judgement about who you are.",
    whyItMatters: "When life feels messy, it is easy to collapse everything into ‘I am the problem’. That usually leaves you with shame and nowhere useful to start. A specific pattern gives you something real to understand and change.",
    sections: [
      {
        title: "Start with what keeps happening",
        body: "Think of a pattern you know too well. Maybe payday arrives and gambling suddenly feels like the fastest way out of money stress. Maybe an argument ends and you disappear into your room, drink, scroll, spend or shut everyone out. The point is not to label yourself. It is simply to say: ‘When this happens, I tend to do this.’ That is a much more workable starting point than ‘there is something wrong with me’."
      },
      {
        title: "Ask what it does for you in the moment",
        body: "Most behaviours that become a problem started because they did something useful in the short term. They might numb things, give a rush, create hope, help you avoid a conversation or make an awful hour easier to get through. Think of it like taking out a very expensive short-term loan: you get something immediately, but the cost turns up later. Understanding the short-term payoff is not making excuses for the behaviour. It helps you work out what need the behaviour has been trying to meet."
      },
      {
        title: "You do not need your whole life story today",
        body: "You only need enough context to understand the pattern you are looking at now. What was happening around the time it became harder to manage? What tends to set it off these days? What has it been costing you, and what have you already tried? Your past can matter without needing to solve every part of it before you are allowed to make a change in the present."
      },
    ],
    check: {
      prompt: "Which statement gives you the most useful place to start?",
      options: [
        {
          label: "I need to become a completely different person.",
          feedback: "That makes the whole person the problem, which is much harder to work with than one specific pattern."
        },
        {
          label: "When I feel overwhelmed, I sometimes reach for quick relief even though it creates problems for me later.",
          correct: true,
          feedback: "This names the situation, the short-term payoff and the later cost. That gives you something concrete to understand without turning the behaviour into your identity."
        },
        {
          label: "Nothing can change until I understand every part of my past.",
          feedback: "Your history can be important, but you can begin noticing and changing present-day patterns while some parts of the past are still unresolved."
        },
      ],
    },
    practiceTitle: "Pick one pattern to look at",
    practiceIntro: "Do not write your autobiography here. One honest example is enough.",
    practicePrompts: {
      pattern: {
        label: "What is one pattern you keep finding yourself in?",
        placeholder: "For example: gambling after payday, shutting people out after conflict, spending when stressed..."
      },
      function: {
        label: "What does it give you in the moment, and what tends to turn up later?",
        placeholder: "In the moment it gives me... / Later it usually costs me..."
      },
    },
    keyLearning: "A pattern is something you do, not who you are. Understanding what sets it off, what it gives you and what it costs you creates a real place to begin."
  },

  "motivation-for-change": {
    title: "When Part of You Wants Change and Part of You Does Not",
    description: "Make room for mixed feelings instead of waiting for a day when you suddenly feel 100% ready.",
    whyItMatters: "Wanting life to be different does not automatically mean wanting to give up everything the old behaviour gave you. Both can be true at once. That is not hypocrisy; it is usually what change actually feels like.",
    sections: [
      {
        title: "You do not have to feel completely ready",
        body: "You might wake up determined to change and feel completely different by 8pm. That does not mean the morning version of you was fake. Motivation moves around, especially when stress, loneliness, money, conflict or cravings show up. Change is less like climbing a perfect staircase and more like walking a track with a few loops and backtracks. The important part is learning what helps you keep heading in the direction you care about."
      },
      {
        title: "Be fair about what both options give you",
        body: "If the old pattern had no benefit at all, you probably would not keep going back to it. Gambling might offer hope or excitement. Drinking might quiet your head for a while. Avoiding a conversation might give immediate relief. At the same time, those same choices can bring money problems, regret, distance or stress later. Change has benefits too, but it can also feel uncomfortable, boring, uncertain or exposing at first. Seeing both sides clearly is more useful than pretending one side does not exist.",
        bullets: [
          "What staying the same gives you now",
          "What staying the same costs you later",
          "What changing could give you",
          "What feels difficult about changing"
        ]
      },
      {
        title: "Commitment is something you can come back to",
        body: "A difficult day, slip or return to an old behaviour does not cancel every choice you made before it. Think of commitment more like returning to a direction than signing a perfect-behaviour contract. If something happens again, the useful question is not ‘why am I hopeless?’ but ‘what was happening, what was missing, and what would give me a better chance next time?’"
      },
    ],
    practiceTitle: "Look at both sides without arguing with yourself",
    practiceIntro: "Pick the strongest point on each side. You are trying to understand yourself, not win a debate.",
    practicePrompts: {
      stay: {
        label: "What does staying the same give you, and what does it cost you?",
        placeholder: "It gives me... / It costs me..."
      },
      change: {
        label: "What could change give you, and what about it feels hard?",
        placeholder: "A benefit could be... / The hard part might be..."
      },
    },
    keyLearning: "Mixed feelings do not mean you are incapable of change. They show you what the old pattern still provides and what your change plan will need to replace, support or prepare for."
  },

  "chain-analysis": {
    title: "Replay the Moment in Slow Motion",
    description: "Take one difficult moment that felt automatic and slow it down enough to see the smaller steps inside it.",
    whyItMatters: "A behaviour can feel like it came out of nowhere. Usually there were smaller moments before it. Finding those moments gives you more than one place where next time could go differently.",
    sections: [
      {
        title: "Look at what was already making the day harder",
        body: "Picture two versions of the same trigger. In one, you are rested, connected and have no easy access to the behaviour. In the other, you slept four hours, had an argument, feel lonely and have money sitting in your account. The trigger may be the same, but the second version is carrying much more weight. In behaviour analysis these background conditions are often called vulnerabilities. They are not weaknesses; they are the things that can make the next moment harder to handle."
      },
      {
        title: "Run the scene back slowly",
        body: "Imagine pressing slow-motion on a video. What happened first? Then what did your mind say? What did you feel in your body? What emotion showed up? What did you want to do? What did you actually do, and what happened straight afterwards? A chain might look like: payday → ‘I can fix everything tonight’ → excitement and tension → open the app → deposit → brief relief → chase losses → panic. Seeing the links is often much more useful than only looking at the final behaviour.",
        bullets: [
          "What made the moment harder",
          "What set it off",
          "What your mind said and your body felt",
          "The emotion and urge",
          "What you did",
          "What happened straight after and later"
        ]
      },
      {
        title: "Find one link you could change",
        body: "You do not need to discover one magical point where everything could have been prevented. Maybe the best link is moving money before payday, leaving the room after an argument, texting someone when the thought first appears or putting the phone down for ten minutes. Think of a chain like a row of dominoes: you do not have to stop the first one if you can remove one further along the line."
      },
    ],
    practiceTitle: "Slow down one short chain",
    practiceIntro: "Choose something manageable. A recent small example or a made-up one is completely fine.",
    practicePrompts: {
      before: {
        label: "What was already making the moment harder, and what kicked things off?",
        placeholder: "Tired, lonely, payday, conflict... then a message, thought, event or feeling..."
      },
      links: {
        label: "What happened next, step by step?",
        placeholder: "Thought → body/feeling → urge → action → immediate result → later result"
      },
      choice: {
        label: "Where is one realistic place you could change the chain next time?",
        placeholder: "Move money, pause, leave, call someone, block access, use a skill..."
      },
    },
    keyLearning: "What feels automatic often has a chain leading into it. You do not have to change every link; finding one realistic interruption can change what happens next."
  },

  "wellbeing-principles": {
    title: "Building a Life That Has More in It",
    description: "Look beyond simply stopping a behaviour and notice what you want to rebuild around it.",
    whyItMatters: "Removing something harmful can leave a huge empty space. If that space stays empty, the old behaviour can keep looking like the only thing that offers relief, excitement or escape. Wellbeing is also about building things worth moving toward.",
    sections: [
      {
        title: "Stopping the problem is only part of the job",
        body: "Imagine a room after a fire. Putting the fire out matters, but afterwards there is still rebuilding to do. Recovery can be similar. You may need more stability, connection, purpose, health, activity, creativity, confidence or a sense that your choices belong to you again. You do not need to rebuild every area at once. The point is to notice which parts of life have become thin or neglected while the problem took up more space."
      },
      {
        title: "Acceptance means starting from where you actually are",
        body: "Acceptance is not saying ‘this is fine’. It is more like looking at the map and putting your finger on your real location before choosing a route. If money has been lost, a relationship is strained or something painful has happened, wishing it were different makes sense, but planning becomes easier when you can also say ‘this is where things are today’. Acceptance never requires forgiving harm, dropping boundaries or staying unsafe."
      },
      {
        title: "Let what matters guide one real action",
        body: "It is easy to make a huge promise such as ‘I am going to fix my whole life’. That usually gives you nowhere to put your feet. A more useful step could be booking the appointment, moving money somewhere safer, taking your child to the park, replying to one friend or cleaning one corner of the room. The action does not have to look impressive. It just needs to point in the direction you want your life to move."
      },
    ],
    practiceTitle: "Pick one area to give some attention",
    practiceIntro: "Choose the area that would make life feel a little more solid, not the area you think you ‘should’ pick.",
    practicePrompts: {
      area: {
        label: "Which part of life would you most like to feel a little stronger?",
        placeholder: "Stability, connection, health, purpose, activity, family, contribution..."
      },
      action: {
        label: "What is one small thing you could actually do in that direction?",
        placeholder: "Something specific enough that you would know whether you did it..."
      },
    },
    keyLearning: "Change is not only about removing an unwanted behaviour. It is also about rebuilding enough stability, connection and meaning that life contains more reasons to keep moving forward."
  },

  "mindfulness-foundations": {
    title: "Mindfulness: Notice Before You React",
    description: "Learn how to catch more of what is happening in the moment instead of only realising afterwards that you were running on autopilot.",
    whyItMatters: "Mindfulness is not about becoming calm all the time or emptying your head. It is about noticing sooner. Even a few extra seconds of awareness can create another option before an urge, thought or emotion takes over the steering wheel.",
    sections: [
      {
        title: "Notice it, name it, stay with what you are doing",
        body: "You might know the feeling of driving somewhere and barely remembering the last few streets because your mind was somewhere else. A lot of life can happen like that too. Mindfulness starts by noticing what is here, putting simple words to it and taking part in the present moment. DBT calls these Observe, Describe and Participate. You are not trying to have no thoughts; you are practising seeing them before they automatically decide what happens next.",
        bullets: ["Observe: notice what is here", "Describe: put simple words to it", "Participate: come back into what you are doing"]
      },
      {
        title: "The way you pay attention matters",
        body: "If you notice ‘I feel anxious’ and immediately add ‘this is pathetic, I should not feel like this’, you now have the anxiety plus a fight with yourself about the anxiety. Mindfulness asks you to try a different stance: less judgement, one thing at a time and attention on what is useful right now. DBT calls these Non-judgementally, One-mindfully and Effectively. Wandering off is normal; noticing you wandered and coming back is the practice.",
        bullets: ["Use less judgement", "Come back to one thing", "Ask what is useful right now"]
      },
      {
        title: "Being mindful does not mean sitting quietly with harm",
        body: "Mindfulness is awareness, not passivity. If you notice someone is threatening you, the mindful response may be to leave. If you notice your hand opening a gambling app automatically, it may be to close it and move your money. If you notice you are too overwhelmed to keep talking, it may be to pause the conversation. Being present should help you respond to reality, not talk you into tolerating danger."
      },
    ],
    check: {
      prompt: "Which example is closest to simply noticing and describing what is happening?",
      options: [
        {
          label: "Everything is going wrong and I cannot handle any of it.",
          feedback: "That is a big conclusion about the whole situation. It may feel true, but it does not yet separate out what you are actually noticing."
        },
        {
          label: "My chest feels tight, I notice the thought ‘I cannot handle this’, and I have an urge to leave.",
          correct: true,
          feedback: "This names a body sensation, a thought and an urge without treating the thought as a fact or the urge as an instruction."
        },
        {
          label: "I should force myself to stop feeling anxious.",
          feedback: "That turns the moment into a fight with the feeling. Mindfulness begins by noticing what is present before deciding what to do with it."
        },
      ],
    },
    practiceTitle: "Try 30 seconds of noticing",
    practiceIntro: "No special pose, empty mind or perfect calm required. Just notice what is already here.",
    practicePrompts: {
      observe: {
        label: "What did you notice?",
        placeholder: "Something you saw, heard, felt or noticed in your body..."
      },
      describe: {
        label: "Can you name one thought or feeling as something you are having, rather than something that must be true?",
        placeholder: "I notice the thought... / I notice a feeling of..."
      },
    },
    keyLearning: "Mindfulness is noticing what is happening early enough to have a choice about your next response. It is awareness, not blankness, perfection or passive acceptance of harm."
  }
}

export function prepareJourneyModuleForSelfGuidedUse(
  module: JourneyModuleDefinition,
): JourneyModuleDefinition {
  const override = MODULE_PRESENTATION_OVERRIDES[module.slug]
  if (!override) return prepareRemainingJourneyModuleForSelfGuidedUse(module)

  const sections: JourneySection[] = module.sections.map((section, index) => ({
    ...section,
    ...(override.sections?.[index] || {})
  }))

  const practicePrompts: JourneyPracticePrompt[] = module.practicePrompts.map((prompt) => ({
    ...prompt,
    ...(override.practicePrompts?.[prompt.id] || {})
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
    ...(override.keyLearning ? { keyLearning: override.keyLearning } : {})
  }
}
