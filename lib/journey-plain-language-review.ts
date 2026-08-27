import type { JourneyModuleDefinition, JourneySection } from "@/lib/journey-curriculum"

interface ModulePolish {
  description: string
  whyItMatters: string
  keyLearning: string
  removeSectionTitles?: string[]
  sectionRewrites?: Array<{
    matchTitle: string
    title?: string
    body: string
    bullets?: string[]
  }>
}

const POLISH: Record<string, ModulePolish> = {
  "understanding-the-pattern": {
    description: "Learn how one repeated behaviour can become a loop, and why the loop keeps pulling you back in.",
    whyItMatters: "It is easier to change a pattern when you can see what starts it, what it gives you now and what it costs later.",
    keyLearning: "A pattern is something you do, not who you are. Find the loop and you find places where the loop can change.",
  },
  "motivation-for-change": {
    description: "Understand why one part of you can want change while another part still misses what the old behaviour gave you.",
    whyItMatters: "Mixed feelings are normal. Looking at both sides helps you make a choice with your eyes open instead of waiting to feel perfectly ready.",
    keyLearning: "You can want change and still miss parts of the old pattern. Knowing both sides helps you plan for the hard parts.",
  },
  "chain-analysis": {
    description: "Slow one difficult moment down and find the small steps that happened before, during and after it.",
    whyItMatters: "What feels sudden often has a chain. Each link gives you another place where next time could go differently.",
    keyLearning: "A chain turns one big event into smaller links. You do not have to change every link to change what happens next.",
  },
  "wellbeing-principles": {
    description: "Look at the parts of life you want to rebuild, not only the behaviour you want to stop.",
    whyItMatters: "Life feels stronger when it has more than one source of relief, meaning, connection and enjoyment.",
    keyLearning: "Wellbeing is bigger than stopping one problem. Strengthen one useful part of life at a time.",
    sectionRewrites: [
      {
        matchTitle: "Acceptance means starting from where you actually are",
        title: "Start from where things are today",
        body: "You can wish something was different and still make a plan from where things are now. Think of a map: you need your real starting point before you choose a direction. This module only needs that simple idea. A later Journey module explores acceptance in more detail.",
      },
    ],
  },
  "mindfulness-foundations": {
    description: "Practise noticing what is happening before your thoughts, feelings or urges choose the next move for you.",
    whyItMatters: "A few seconds of noticing can be enough to create another option.",
    keyLearning: "Mindfulness means notice, name and return to what you are doing. It gives you a little more choice before you react.",
    sectionRewrites: [
      {
        matchTitle: "Being mindful does not mean sitting quietly with harm",
        title: "Noticing helps you choose what to do next",
        body: "Mindfulness is not about sitting still and doing nothing. You might notice your hand opening an app and close it. You might notice an argument getting hotter and pause. The point is to see what is happening early enough to choose your next move on purpose.",
      },
    ],
  },
  "understanding-your-mind": {
    description: "Learn what happens when feelings get very loud, when logic takes over, and how to make room for both.",
    whyItMatters: "Good choices usually use more than one kind of information. Feelings matter, facts matter and what matters to you matters too.",
    keyLearning: "Wise Mind means letting feelings, facts and what matters to you all have a say before you choose.",
  },
  "grounding-and-urge-surfing": {
    description: "Learn four different ways to steady your attention when your mind, feelings or an urge start taking over.",
    whyItMatters: "You do not have to make an urge disappear. You only need enough space to choose what you do next.",
    keyLearning: "Grounding, breathing, RAIN and urge surfing do different jobs. Pick the tool that fits the moment instead of trying to use them all.",
    sectionRewrites: [
      {
        matchTitle: "Breath can be an anchor, not a command to calm down",
        title: "Breathing can give your attention a simple anchor",
        body: "Try following a few slow, ordinary breaths. You are not trying to force yourself to feel calm. You are just giving your attention one simple thing to follow. If breathing is not helping, switch to grounding and notice things around you instead.",
      },
    ],
  },
  "building-awareness": {
    description: "Take a quick snapshot of how things are today without turning the snapshot into a score.",
    whyItMatters: "One rough hour can feel like the whole story. A simple Daily Reflection gives you information instead of a verdict.",
    keyLearning: "A Daily Reflection is a weather report, not a school grade. A few snapshots over time can show useful patterns.",
    removeSectionTitles: ["Notice the difference between the camera and the narrator"],
  },
  "recognizing-triggers": {
    description: "Learn the difference between a trigger that starts an urge and the background pressures that make the trigger hit harder.",
    whyItMatters: "When you know both the spark and the dry grass, you have more ways to plan ahead.",
    keyLearning: "Triggers are the sparks close to an urge. Background pressures are the conditions that make those sparks catch more easily.",
  },
  "choice-points": {
    description: "Spot the small fork where quick relief and the direction you care about start pulling apart.",
    whyItMatters: "Big changes are often made from small choices that happen again and again.",
    keyLearning: "A choice point is a small fork in the road. Look for the next move that points toward what matters.",
  },
  "understanding-emotions": {
    description: "Break an emotion into its parts: the feeling, body clues, thoughts, urges and message.",
    whyItMatters: "A feeling is easier to understand when it is not one giant blur.",
    keyLearning: "Emotions give you information and action urges. You can listen to the signal without automatically following the urge.",
  },
  "check-the-facts": {
    description: "Learn to separate what actually happened from the story, guess or prediction your mind added.",
    whyItMatters: "A guess can feel exactly like a fact when emotions are strong. Slowing it down helps you respond to the real problem.",
    keyLearning: "Use the camera test: separate what you know from what your mind added, then choose what to do with the clearer picture.",
    sectionRewrites: [
      {
        matchTitle: "Watch for the shortcuts your mind uses under pressure",
        title: "Watch for fast thinking",
        body: "When you are stressed, your brain may fill gaps quickly. It can guess what someone thinks, predict the worst, turn one event into an ‘always’ rule or treat a feeling as proof. These are common thinking shortcuts. Slow the conclusion down and ask what evidence you actually have.",
        bullets: ["Guessing what someone thinks", "Predicting the future", "Jumping to the worst case", "Turning one event into ‘always’ or ‘never’", "Treating a feeling as proof"],
      },
    ],
  },
  "opposite-action": {
    description: "Learn when an emotion is pushing you toward an action that keeps the problem going, and test a small move in another direction.",
    whyItMatters: "Avoiding, hiding or attacking can feel useful now and make the same feeling stronger next time.",
    keyLearning: "First check whether the urge fits the facts. If it does not, try one small action in a more useful direction.",
    removeSectionTitles: ["Safety gets the final say"],
  },
  "abc-please": {
    description: "Notice the everyday things that change how much energy your body and mind have, then add small sources of enjoyment and achievement.",
    whyItMatters: "Everything is harder when your battery is low. A small change to the basics can give other skills more room to work.",
    keyLearning: "Check your battery, choose one useful lever and add small things that bring enjoyment or a sense of progress.",
    sectionRewrites: [
      {
        matchTitle: "Body care is not a self-discipline contest",
        title: "The basics are clues, not a scorecard",
        body: "Sleep, food, health, substances and movement can all change how much energy you have. The point is not to be perfect. Notice which basic is making the week harder and choose one realistic thing that could help.",
      },
    ],
  },
  "coping-ahead": {
    description: "Make a short plan for one difficult situation you can see coming before you are in the middle of it.",
    whyItMatters: "It is easier to remember an umbrella before the rain than invent one once you are soaked.",
    keyLearning: "Pick one likely situation, decide your first move and keep one backup move ready.",
  },
  "discovering-values": {
    description: "Work out what you want your life and choices to stand for, then use that as a compass.",
    whyItMatters: "Values give you something to move toward, not only something to get away from.",
    keyLearning: "A value is a direction, not a finish line. It helps you decide which way your next action should point.",
  },
  "recognizing-strengths": {
    description: "Find real evidence of strengths you have already used, even when the moment did not feel strong or impressive.",
    whyItMatters: "Your brain may remember failures faster than it remembers what you have handled, learned and survived.",
    keyLearning: "Do not ask whether you are a ‘strong person’. Look for real things you did and the strengths that helped you do them.",
  },
  "values-to-action": {
    description: "Turn one value into a small action that can actually happen in your real week.",
    whyItMatters: "A value becomes useful when it reaches the ground as something you can do.",
    keyLearning: "Choose one value, make the action small and specific, and plan for what might get in the way.",
  },
  "stop-skill": {
    description: "Learn a simple four-step pause for moments when an urge or emotion is moving faster than your thinking.",
    whyItMatters: "You do not have to solve the whole problem in a fast moment. First create a gap between the urge and the action.",
    keyLearning: "STOP is a handbrake: Stop, Take a step back, Observe, then Proceed on purpose.",
    sectionRewrites: [
      {
        matchTitle: "TIP is a menu of body-based options, not one compulsory technique",
        title: "TIP is another way to help the body slow down",
        body: "TIP is a DBT name for a few body-based tools, such as changing temperature, moving your body, slowing your breathing or relaxing your muscles. You do not need to use every tool. The aim is simply to help your body come down enough for you to think again.",
      },
      {
        matchTitle: "TIP can help when your body is running hot",
        title: "TIP is another way to help the body slow down",
        body: "TIP is a DBT name for a few body-based tools, such as changing temperature, moving your body, slowing your breathing or relaxing your muscles. You do not need to use every tool. The aim is simply to help your body come down enough for you to think again.",
      },
    ],
  },
  "accepts-improve": {
    description: "Build a short menu of things that can help you get through a rough stretch without adding another problem.",
    whyItMatters: "Some problems cannot be fixed right now. Sometimes the useful job is getting through the next hour and coming back to the problem later.",
    keyLearning: "ACCEPTS and IMPROVE are menus for getting through a rough moment. Pick a few tools you will actually remember and use.",
  },
  "reality-acceptance": {
    description: "Learn how to start from what is already true, even when you wish it were different, and focus on the choices that remain.",
    whyItMatters: "Fighting a fact that has already happened can use up energy you may need for the next step.",
    keyLearning: "Acceptance means starting from reality, not liking it. Name what is true, then look at what you can still choose.",
    sectionRewrites: [
      {
        matchTitle: "Willingness is asking ‘what can I do with this?’",
        title: "Willingness means asking ‘what can I do from here?’",
        body: "Willingness is often small. You might hate where things are and still make one phone call. You might not feel ready for a big conversation and still say one honest sentence. It means choosing the next thing you are willing to try from the situation you are already in.",
      },
    ],
  },
  "problem-solving": {
    description: "Take one problem you can act on, make a few possible answers and choose the best available first step.",
    whyItMatters: "A huge problem becomes easier to work with when you pull out one knot at a time.",
    keyLearning: "Make the problem specific, create more than one option, choose a first step and learn from what happens.",
  },
  "interpersonal-effectiveness": {
    description: "Before a hard conversation, decide what matters most this time: the outcome, the relationship or your self-respect.",
    whyItMatters: "It is hard to choose how to speak when you are trying to protect everything at once.",
    keyLearning: "Know your main goal before you speak. You can guide your side of the conversation, but you cannot control the other person's reaction.",
    sectionRewrites: [
      {
        matchTitle: "Sometimes the main thing is the outcome",
        body: "Sometimes you need something clear: ask for money back, say no, change a plan or set a limit. DBT calls this getting the outcome you need. DEAR MAN is the main skill Waypoint teaches for this kind of conversation. Ask yourself: ‘What am I actually asking for or saying no to?’",
      },
      {
        matchTitle: "None of these skills gives you control over another person",
        title: "You control your side, not their reaction",
        body: "You can speak clearly and the other person can still say no, misunderstand you or feel upset. That does not automatically mean you communicated badly. These skills help you choose your words and actions; they do not give you control over somebody else.",
      },
    ],
  },
  "dear-man": {
    description: "Use a simple structure to make a clear request, say no or set a boundary without writing a speech in your head.",
    whyItMatters: "A short structure can stop a hard conversation turning into hints, guessing or a ten-minute build-up.",
    keyLearning: "DEAR MAN is a frame, not a script. Say what happened, how it affects you, what you need and what main point you want to stay with.",
    removeSectionTitles: ["A communication script is never more important than safety"],
  },
  "give-skill": {
    description: "Learn how to help another person feel heard while keeping your own view and needs in the conversation.",
    whyItMatters: "Kindness works better when it does not require you to disappear, and being right works better when the other person can still hear you.",
    keyLearning: "GIVE means be gentle, show interest, validate what makes sense and keep the tone easier where you can. Understanding is not the same as agreeing.",
    removeSectionTitles: ["Some relationships are not made safer by better communication"],
  },
  "fast-skill": {
    description: "Learn how to protect your self-respect in a hard conversation by being fair, using apologies carefully, staying with your values and being truthful.",
    whyItMatters: "Getting your way is not much of a win if you dislike how you behaved afterwards.",
    keyLearning: "FAST helps you leave a conversation able to respect your own behaviour: fair, honest and close to your values.",
    sectionRewrites: [
      {
        matchTitle: "Stick to values and tell the truth without surrendering privacy",
        title: "Stay with your values and tell the truth",
        body: "Try not to exaggerate, make up a reason or promise something you do not mean just to escape the conversation. You can be truthful and still keep private things private. Honesty means saying what is true, not telling everyone everything.",
      },
    ],
  },
  "personal-commitment-plan": {
    description: "Pull the most useful parts of the Journey into one short plan for the days when thinking clearly is harder.",
    whyItMatters: "A good plan is written for tired, stressed or tempted-you, not only calm and motivated-you.",
    keyLearning: "Make the plan simple, spot early warning signs and decide the first action, person and backup you want ready before a hard day arrives.",
  },
}

const SIMPLE_REPLACEMENTS: Array<[RegExp, string]> = [
  [/\bvulnerabilities\b/gi, "background pressures"],
  [/\bvulnerability\b/gi, "background pressure"],
  [/\bcatastrophising\b/gi, "jumping to the worst case"],
  [/\bcatastrophise\b/gi, "jump to the worst case"],
  [/\bobjective effectiveness\b/gi, "getting the outcome you need"],
  [/\bself-respect effectiveness\b/gi, "protecting your self-respect"],
  [/\bcoercive\b/gi, "controlling"],
  [/\bcoercion\b/gi, "pressure or control"],
  [/\bactivation\b/gi, "how wound up your body feels"],
  [/\bambivalence\b/gi, "mixed feelings"],
  [/\bautonomy\b/gi, "choice"],
  [/\bobservable\b/gi, "specific"],
  [/\bwarranted\b/gi, "needed"],
  [/\blegitimate\b/gi, "real"],
]

function simplify(text: string): string {
  return SIMPLE_REPLACEMENTS.reduce((current, [pattern, replacement]) => current.replace(pattern, replacement), text)
}

function polishSection(slug: string, section: JourneySection, polish: ModulePolish): JourneySection | null {
  if (polish.removeSectionTitles?.some((title) => section.title === title)) return null

  const rewrite = polish.sectionRewrites?.find((candidate) => section.title === candidate.matchTitle)
  if (rewrite) {
    return {
      title: rewrite.title || section.title,
      body: rewrite.body,
      ...(rewrite.bullets ? { bullets: rewrite.bullets } : section.bullets ? { bullets: section.bullets.map(simplify) } : {}),
    }
  }

  return {
    ...section,
    title: simplify(section.title),
    body: simplify(section.body),
    ...(section.bullets ? { bullets: section.bullets.map(simplify) } : {}),
  }
}

/**
 * Final reading-level and repetition pass.
 *
 * Every module gets its own purpose statement and takeaway. The existing
 * peer-support teaching and flexible-depth layers still supply the lesson
 * detail, while this pass removes repeated warning-style sections, trims
 * overlap between neighbouring modules and swaps avoidable jargon for plainer
 * words. Safety-note banners are intentionally removed from the rendered
 * module; essential conditions that define a skill remain in the teaching.
 */
export function prepareJourneyModuleForPlainLanguage(module: JourneyModuleDefinition): JourneyModuleDefinition {
  const polish = POLISH[module.slug]
  if (!polish) return { ...module, safetyNote: undefined }

  const sections = module.sections
    .map((section) => polishSection(module.slug, section, polish))
    .filter((section): section is JourneySection => Boolean(section))

  return {
    ...module,
    description: polish.description,
    whyItMatters: polish.whyItMatters,
    keyLearning: polish.keyLearning,
    sections,
    safetyNote: undefined,
    check: {
      ...module.check,
      prompt: simplify(module.check.prompt),
      options: module.check.options.map((option) => ({
        ...option,
        label: simplify(option.label),
        feedback: simplify(option.feedback),
      })),
    },
  }
}
