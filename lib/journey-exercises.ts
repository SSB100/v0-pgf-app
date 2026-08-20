export interface JourneyExerciseField {
  id: string
  label: string
  placeholder?: string
  hint?: string
}

export interface JourneyExerciseOption {
  id: string
  label: string
  help?: string
  recommended?: boolean
}

interface ExerciseBase {
  title: string
  intro: string
}

export interface BuilderExercise extends ExerciseBase {
  kind: "builder"
  fields: JourneyExerciseField[]
  note?: string
}

export interface BalanceExercise extends ExerciseBase {
  kind: "balance"
  boxes: Array<JourneyExerciseField & { tone: "stay-good" | "stay-hard" | "change-good" | "change-hard" }>
}

export interface ChoiceExercise extends ExerciseBase {
  kind: "choice"
  prompt: string
  options: JourneyExerciseOption[]
  useCoreValues?: boolean
  followUp?: JourneyExerciseField
}

export interface MultiExercise extends ExerciseBase {
  kind: "multi"
  prompt: string
  options: JourneyExerciseOption[]
  minSelections: number
  maxSelections?: number
  useCoreValues?: boolean
  followUp?: JourneyExerciseField
}

export interface SortExercise extends ExerciseBase {
  kind: "sort"
  groups: Array<{ id: string; label: string; help?: string }>
  items: Array<{ id: string; label: string; bestGroup: string }>
}

export interface ScenarioExercise extends ExerciseBase {
  kind: "scenario"
  scenario: string
  prompt: string
  options: JourneyExerciseOption[]
  followUp?: JourneyExerciseField
}

export interface SequenceExercise extends ExerciseBase {
  kind: "sequence"
  prompt: string
  items: JourneyExerciseOption[]
  correctOrder: string[]
  followUp?: JourneyExerciseField
}

export type JourneyExerciseDefinition =
  | BuilderExercise
  | BalanceExercise
  | ChoiceExercise
  | MultiExercise
  | SortExercise
  | ScenarioExercise
  | SequenceExercise

export const JOURNEY_EXERCISES: Record<string, JourneyExerciseDefinition> = {
  "understanding-the-pattern": {
    kind: "builder",
    title: "Draw the loop",
    intro: "Use one real pattern or make one up. Keep each box short. The point is to see the loop, not write a life story.",
    fields: [
      { id: "trigger", label: "1. What usually happens first?", placeholder: "Payday, an argument, boredom, feeling rejected..." },
      { id: "move", label: "2. What do you usually do next?", placeholder: "Open an app, shut down, drink, spend, avoid..." },
      { id: "now", label: "3. What does that give you right away?", placeholder: "Relief, excitement, numbness, escape..." },
      { id: "later", label: "4. What tends to show up later?", placeholder: "Stress, money problems, distance, regret..." },
    ],
    note: "A pattern is easier to change when you can see what keeps it going.",
  },

  "motivation-for-change": {
    kind: "balance",
    title: "Put both sides on the table",
    intro: "Mixed feelings make more sense when you can see what each option gives you and what it costs.",
    boxes: [
      { id: "stay-good", tone: "stay-good", label: "What staying the same gives me", placeholder: "Relief, fun, escape, familiarity..." },
      { id: "stay-hard", tone: "stay-hard", label: "What staying the same costs me", placeholder: "Money, trust, sleep, confidence..." },
      { id: "change-good", tone: "change-good", label: "What changing could give me", placeholder: "More control, trust, stability..." },
      { id: "change-hard", tone: "change-hard", label: "What feels hard about changing", placeholder: "Boredom, cravings, missing the rush..." },
    ],
  },

  "chain-analysis": {
    kind: "builder",
    title: "Replay one moment in slow motion",
    intro: "Build the chain in order. Short notes are enough.",
    fields: [
      { id: "before", label: "Before it happened", placeholder: "Tired, lonely, stressed, money available..." },
      { id: "spark", label: "The thing that set it off", placeholder: "A message, payday, an argument, a thought..." },
      { id: "inside", label: "What happened inside you", placeholder: "Thoughts, feelings, body changes, urges..." },
      { id: "action", label: "What you did", placeholder: "The action you took..." },
      { id: "after", label: "What happened after", placeholder: "Right away, then later..." },
      { id: "break", label: "One link you could change next time", placeholder: "Pause, move money, leave the room, call someone..." },
    ],
  },

  "wellbeing-principles": {
    kind: "multi",
    title: "Pick the parts of life that need some rebuilding",
    intro: "Choose one or two areas that would make the rest of life feel a little steadier if they improved.",
    prompt: "Which areas matter most right now?",
    minSelections: 1,
    maxSelections: 2,
    options: [
      { id: "stability", label: "Safety and stability" },
      { id: "connection", label: "Connection and belonging" },
      { id: "health", label: "Health and energy" },
      { id: "meaning", label: "Meaning and purpose" },
      { id: "choice", label: "Choice and independence" },
      { id: "activity", label: "Activity, learning or creativity" },
    ],
    followUp: { id: "small-step", label: "What is one small thing that could strengthen the area you picked?", placeholder: "One action you could actually do this week..." },
  },

  "mindfulness-foundations": {
    kind: "sort",
    title: "Notice or judge?",
    intro: "Mindfulness starts by telling the difference between what you notice and the extra judgement your mind adds.",
    groups: [
      { id: "notice", label: "What I can notice", help: "A sensation, thought, feeling or fact." },
      { id: "judge", label: "Judgement or story", help: "A label, rule or big conclusion." },
    ],
    items: [
      { id: "tight", label: "My shoulders feel tight.", bestGroup: "notice" },
      { id: "useless", label: "I am useless at this.", bestGroup: "judge" },
      { id: "thought", label: "I notice the thought: ‘I need to leave.’", bestGroup: "notice" },
      { id: "always", label: "I always ruin everything.", bestGroup: "judge" },
      { id: "heart", label: "My heart is beating fast.", bestGroup: "notice" },
    ],
  },

  "understanding-your-mind": {
    kind: "builder",
    title: "Give both sides a voice",
    intro: "Pick one small decision. Let the feeling side speak, then the facts side, then bring them together.",
    fields: [
      { id: "emotion", label: "What are my feelings saying?", placeholder: "I feel... and part of me wants to..." },
      { id: "facts", label: "What facts or practical things do I know?", placeholder: "What I actually know is..." },
      { id: "matters", label: "What matters to me here?", placeholder: "I want to be the kind of person who..." },
      { id: "wise", label: "What is one next step that makes room for all three?", placeholder: "A balanced next move could be..." },
    ],
  },

  "grounding-and-urge-surfing": {
    kind: "choice",
    title: "Choose the tool that fits the moment",
    intro: "These tools do different jobs. Pick the one that sounds most useful for the example below, then try it for a short moment.",
    prompt: "Your thoughts are racing and you feel pulled toward an urge. What would you like to try first?",
    options: [
      { id: "ground", label: "Grounding", help: "Put attention on things you can see, hear or feel around you." },
      { id: "breath", label: "Breathing", help: "Give your attention a simple rhythm to follow." },
      { id: "wave", label: "Urge surfing", help: "Watch the urge rise, change and move without following it." },
      { id: "rain", label: "RAIN", help: "Notice a feeling with curiosity instead of fighting it." },
    ],
    followUp: { id: "noticed", label: "After trying it briefly, what did you notice?", placeholder: "My attention shifted... the urge changed... I noticed..." },
  },

  "building-awareness": {
    kind: "builder",
    title: "Make a two-minute weather report",
    intro: "Do not score the day. Just describe the conditions you are working with.",
    fields: [
      { id: "inside", label: "Inside me", placeholder: "Feeling, thought, body feeling or urge..." },
      { id: "around", label: "Around me", placeholder: "Sleep, people, money, work, time of day..." },
      { id: "headline", label: "Today's short weather headline", placeholder: "For example: low sleep, high stress, still showing up." },
    ],
  },

  "recognizing-triggers": {
    kind: "sort",
    title: "Spark or dry grass?",
    intro: "A trigger is close to the urge. A background pressure makes many triggers hit harder.",
    groups: [
      { id: "trigger", label: "Trigger / spark" },
      { id: "pressure", label: "Background pressure / dry grass" },
    ],
    items: [
      { id: "ad", label: "A gambling ad appears on your phone.", bestGroup: "trigger" },
      { id: "sleep", label: "You have slept badly for three nights.", bestGroup: "pressure" },
      { id: "payday", label: "Your pay lands in your account.", bestGroup: "trigger" },
      { id: "lonely", label: "You have felt lonely all week.", bestGroup: "pressure" },
      { id: "argument", label: "An argument ends and you are alone.", bestGroup: "trigger" },
      { id: "hungry", label: "You have barely eaten today.", bestGroup: "pressure" },
    ],
  },

  "choice-points": {
    kind: "scenario",
    title: "Spot the fork in the road",
    intro: "A choice point is usually small. The useful question is which move points toward what matters to you.",
    scenario: "You get paid, feel stressed about money and notice the thought: ‘Maybe one win could fix this.’",
    prompt: "Which move points more toward stability?",
    options: [
      { id: "deposit", label: "Open the gambling app for a quick look.", help: "This may give quick hope, but it points back toward the old loop." },
      { id: "move", label: "Move the money where you planned and wait ten minutes.", help: "This may feel less exciting, but it points toward stability.", recommended: true },
      { id: "ignore", label: "Tell yourself you should not feel tempted.", help: "Arguing with the feeling does not choose a direction by itself." },
    ],
    followUp: { id: "mine", label: "What is one small fork in the road you recognise in your own life?", placeholder: "The usual move is... A move toward what matters could be..." },
  },

  "understanding-emotions": {
    kind: "builder",
    title: "Map one emotion",
    intro: "An emotion is more than a word. Pull it apart so you can see the message, body clues and urge inside it.",
    fields: [
      { id: "name", label: "Name the feeling as closely as you can", placeholder: "Angry, hurt, lonely, ashamed, worried, disappointed..." },
      { id: "body", label: "What does your body do?", placeholder: "Tight jaw, heavy chest, shaky hands..." },
      { id: "urge", label: "What does the feeling make you want to do?", placeholder: "Leave, argue, hide, chase, call someone..." },
      { id: "question", label: "What should you check before following that urge?", placeholder: "Does it fit the facts? What matters to me?" },
    ],
  },

  "check-the-facts": {
    kind: "sort",
    title: "Camera or narrator?",
    intro: "Put each statement where it belongs. A camera records what happened. The narrator adds meaning, guesses or predictions.",
    groups: [
      { id: "camera", label: "Camera", help: "Something that could be seen, heard or checked." },
      { id: "story", label: "Narrator", help: "A guess, meaning or prediction." },
    ],
    items: [
      { id: "reply", label: "They have not replied today.", bestGroup: "camera" },
      { id: "angry", label: "They must be angry with me.", bestGroup: "story" },
      { id: "lost", label: "I lost $300.", bestGroup: "camera" },
      { id: "win", label: "The only way out is to win it back tonight.", bestGroup: "story" },
      { id: "late", label: "I arrived 12 minutes late.", bestGroup: "camera" },
      { id: "hates", label: "Everyone there thinks I am hopeless.", bestGroup: "story" },
    ],
  },

  "opposite-action": {
    kind: "scenario",
    title: "Test a small opposite move",
    intro: "Opposite Action is for times when the urge is keeping a problem going. It is not about fighting every feeling.",
    scenario: "You are anxious about a normal appointment. Nothing suggests you are in danger, but the urge says: cancel and hide at home.",
    prompt: "Which is the clearest small opposite move?",
    options: [
      { id: "cancel", label: "Cancel straight away.", help: "That follows the urge and may make avoiding easier next time." },
      { id: "ten", label: "Go, and give yourself permission to start with the first ten minutes.", help: "This moves against the avoidance urge in a small, realistic way.", recommended: true },
      { id: "force", label: "Force yourself to stay no matter what happens.", help: "Opposite Action does not need to be extreme to work." },
    ],
    followUp: { id: "own", label: "What is one small urge you could test instead of automatically following?", placeholder: "The urge says... A small different move could be..." },
  },

  "abc-please": {
    kind: "multi",
    title: "Check your battery",
    intro: "Pick the one or two areas that are taking the most energy from you right now. This is not a perfect-health checklist.",
    prompt: "Where could a small change give you more capacity?",
    minSelections: 1,
    maxSelections: 2,
    options: [
      { id: "sleep", label: "Sleep" },
      { id: "food", label: "Eating regularly" },
      { id: "health", label: "Physical health care" },
      { id: "substances", label: "Alcohol or other substance use" },
      { id: "movement", label: "Movement" },
      { id: "good", label: "Something enjoyable" },
      { id: "mastery", label: "Something that gives a sense of achievement" },
    ],
    followUp: { id: "lever", label: "What is one small move that could help this week?", placeholder: "Earlier bedtime, eat before the evening, book an appointment, take a short walk..." },
  },

  "coping-ahead": {
    kind: "builder",
    title: "Pack the umbrella before it rains",
    intro: "Choose one situation you can see coming. Make the plan short enough to remember when your brain is busy.",
    fields: [
      { id: "situation", label: "The situation", placeholder: "Friday after payday, handover with my ex, after a hard shift..." },
      { id: "hard", label: "What usually makes it hard?", placeholder: "Urge, anger, loneliness, easy access, tiredness..." },
      { id: "first", label: "My first move", placeholder: "Before it starts, I will..." },
      { id: "backup", label: "My backup move", placeholder: "If that is not enough, I will..." },
    ],
  },

  "discovering-values": {
    kind: "choice",
    title: "Use the compass",
    intro: "A value is a direction you can keep moving toward. Pick one that matters and turn it into something you can see in real life.",
    prompt: "Which value feels worth using as a compass for this exercise?",
    useCoreValues: true,
    options: [
      { id: "connection", label: "Connection" },
      { id: "honesty", label: "Honesty" },
      { id: "family", label: "Family" },
      { id: "growth", label: "Growth" },
      { id: "stability", label: "Stability" },
      { id: "kindness", label: "Kindness" },
    ],
    followUp: { id: "meaning", label: "What would moving toward that value look like on an ordinary day?", placeholder: "If connection matters, I might..." },
  },

  "recognizing-strengths": {
    kind: "multi",
    title: "Build an evidence file",
    intro: "Choose strengths that you have actually used before. Then tie them to something real you did.",
    prompt: "Which strengths have shown up in your life, even if they did not feel impressive at the time?",
    minSelections: 1,
    maxSelections: 3,
    options: [
      { id: "persistence", label: "Persistence" },
      { id: "care", label: "Caring for others" },
      { id: "humour", label: "Humour" },
      { id: "problem", label: "Problem solving" },
      { id: "courage", label: "Courage" },
      { id: "creativity", label: "Creativity" },
      { id: "honesty", label: "Honesty" },
      { id: "asking", label: "Asking for help" },
    ],
    followUp: { id: "evidence", label: "What is one real thing you did that shows one of those strengths?", placeholder: "I kept showing up... I made the call... I helped... I tried again..." },
  },

  "values-to-action": {
    kind: "builder",
    title: "Turn a value into a real-world step",
    intro: "Make the action so clear that you would know whether it happened.",
    fields: [
      { id: "value", label: "The value I want to move toward", placeholder: "Connection, honesty, stability, health..." },
      { id: "action", label: "The action I will take", placeholder: "Message one friend, move money, cook dinner..." },
      { id: "when", label: "When or where will I do it?", placeholder: "Wednesday after work..." },
      { id: "barrier", label: "What might get in the way, and how can I make it easier?", placeholder: "If I am tired, I will make the step smaller by..." },
    ],
  },

  "stop-skill": {
    kind: "sequence",
    title: "Build the handbrake",
    intro: "STOP works because the steps are simple enough to use when things are moving fast.",
    prompt: "Tap the STOP steps in the order you would use them.",
    items: [
      { id: "observe", label: "Observe" },
      { id: "proceed", label: "Proceed mindfully" },
      { id: "stop", label: "Stop" },
      { id: "back", label: "Take a step back" },
    ],
    correctOrder: ["stop", "back", "observe", "proceed"],
    followUp: { id: "real", label: "What could ‘take a step back’ look like in a fast-moving moment for you?", placeholder: "Put the phone down, leave the room, wait ten minutes..." },
  },

  "accepts-improve": {
    kind: "multi",
    title: "Build a rough-hour toolkit",
    intro: "Do not memorise every letter. Pick a few tools you would genuinely use when you need to get through the next stretch of time.",
    prompt: "Choose three tools for your own short list.",
    minSelections: 3,
    maxSelections: 3,
    options: [
      { id: "activity", label: "Do an absorbing activity" },
      { id: "contribute", label: "Help or connect with someone" },
      { id: "emotion", label: "Create a different emotion with music, comedy or a show" },
      { id: "thought", label: "Give your mind another task" },
      { id: "sensation", label: "Use a strong but ordinary sensation, like a shower or cold drink" },
      { id: "imagery", label: "Picture a place or memory that settles you" },
      { id: "planning", label: "Write tomorrow's first step" },
      { id: "one", label: "Focus on one small thing in front of you" },
      { id: "encourage", label: "Use a steady sentence that helps you keep going" },
    ],
    followUp: { id: "first", label: "Which one would you try first, and what would it look like?", placeholder: "I would start with..." },
  },

  "reality-acceptance": {
    kind: "builder",
    title: "Put your feet on the ground that is already there",
    intro: "Separate the fact you cannot change right now from the choices that are still yours.",
    fields: [
      { id: "fact", label: "What is true right now?", placeholder: "A plain fact, without saying it was good, fair or deserved..." },
      { id: "feeling", label: "How do I feel about that fact?", placeholder: "Angry, sad, disappointed, relieved, mixed..." },
      { id: "choice", label: "What can I still choose or influence?", placeholder: "A call, boundary, repair step, plan, support..." },
    ],
  },

  "problem-solving": {
    kind: "builder",
    title: "Untangle one knot",
    intro: "Choose one problem that has actions available. Then make more than one door before choosing which to try.",
    fields: [
      { id: "problem", label: "The specific problem", placeholder: "I am $400 short for rent next week..." },
      { id: "option1", label: "Door 1", placeholder: "One possible response..." },
      { id: "option2", label: "Door 2", placeholder: "Another possible response..." },
      { id: "option3", label: "Door 3", placeholder: "A third idea, even if it is not perfect..." },
      { id: "pick", label: "The best available first step", placeholder: "I will start by..." },
    ],
  },

  "interpersonal-effectiveness": {
    kind: "choice",
    title: "Choose the main goal of the conversation",
    intro: "All three goals can matter, but picking the main one makes the next communication skill easier to choose.",
    prompt: "For a conversation you have in mind, what matters most this time?",
    options: [
      { id: "outcome", label: "The outcome", help: "I need to ask, say no, set a limit or get something clear." },
      { id: "relationship", label: "The relationship", help: "How we speak and stay connected matters most." },
      { id: "respect", label: "My self-respect", help: "I want to handle myself in a way I can stand by afterwards." },
    ],
    followUp: { id: "success", label: "What would a good-enough result look like?", placeholder: "I would know the conversation went okay if..." },
  },

  "dear-man": {
    kind: "builder",
    title: "Build the short version of the message",
    intro: "Write the four parts of DEAR in plain language. The goal is clarity, not sounding scripted.",
    fields: [
      { id: "describe", label: "Describe: what happened?", placeholder: "The facts are..." },
      { id: "express", label: "Express: how does it affect you?", placeholder: "I feel / I am concerned because..." },
      { id: "assert", label: "Assert: what are you asking for or saying no to?", placeholder: "I need... / I am not willing to..." },
      { id: "reinforce", label: "Reinforce: why could that help?", placeholder: "That would make it easier to..." },
      { id: "main", label: "The one sentence I want to come back to", placeholder: "My main point is..." },
    ],
  },

  "give-skill": {
    kind: "scenario",
    title: "Keep the relationship in the room",
    intro: "GIVE is about how you speak when staying connected matters. It does not mean giving up your own point.",
    scenario: "A friend says, ‘You have barely replied to me all week. It feels like you do not care.’ You have been overwhelmed and still want the friendship.",
    prompt: "Which reply uses the spirit of GIVE best?",
    options: [
      { id: "defend", label: "‘That is not fair. I have been busy, so stop making it about you.’", help: "This protects you from blame, but it is likely to raise the temperature." },
      { id: "givein", label: "‘You are right. I am a terrible friend and I will reply straight away every time.’", help: "This gives away your own reality just to end the discomfort." },
      { id: "validate", label: "‘I get why it felt that way. I have been overwhelmed, not ignoring you on purpose. I do want us to stay connected.’", help: "This notices their experience and shares yours without attacking or collapsing.", recommended: true },
    ],
    followUp: { id: "line", label: "What is one sentence that could lower the temperature in a real conversation?", placeholder: "I can see why... / I hear that... / What I mean is..." },
  },

  "fast-skill": {
    kind: "sort",
    title: "Protect self-respect without turning it into a fight",
    intro: "FAST is about being fair, apologising only when it fits, staying with your values and being truthful.",
    groups: [
      { id: "helps", label: "Supports self-respect" },
      { id: "hurts", label: "Pulls me away from self-respect" },
    ],
    items: [
      { id: "fair", label: "Be fair to yourself and the other person.", bestGroup: "helps" },
      { id: "sorry", label: "Say sorry for having any need at all.", bestGroup: "hurts" },
      { id: "values", label: "Stay close to what matters to you.", bestGroup: "helps" },
      { id: "lie", label: "Make up a reason because the truth feels awkward.", bestGroup: "hurts" },
      { id: "real", label: "Be truthful without adding an attack.", bestGroup: "helps" },
    ],
  },

  "personal-commitment-plan": {
    kind: "builder",
    title: "Build the plan for tired-you",
    intro: "Make the plan simple enough to use when you are stressed, tempted or not thinking clearly.",
    fields: [
      { id: "early", label: "My early warning sign", placeholder: "Hiding things, sleeping less, isolating, checking constantly..." },
      { id: "first", label: "My first move", placeholder: "The first thing I will do when I notice it..." },
      { id: "person", label: "The person I will contact", placeholder: "Name the person, not just ‘reach out’..." },
      { id: "environment", label: "One change I can make around me", placeholder: "Move money, block access, leave the room, put the phone away..." },
      { id: "backup", label: "If the first plan is not enough", placeholder: "My backup step is..." },
    ],
  },
}

export function getJourneyExercise(slug: string): JourneyExerciseDefinition {
  const exercise = JOURNEY_EXERCISES[slug]
  if (!exercise) throw new Error(`Missing Journey exercise for ${slug}`)
  return exercise
}
