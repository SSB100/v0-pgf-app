import type {
  JourneyKnowledgeCheck,
  JourneyModuleDefinition,
  JourneyPracticePrompt,
  JourneySection,
} from "@/lib/journey-curriculum"

interface SectionOverride {
  title?: string
  body?: string
  bullets?: string[]
}

interface PromptOverride {
  label?: string
  placeholder?: string
}

interface ModuleOverride {
  title?: string
  description?: string
  whyItMatters?: string
  sections?: SectionOverride[]
  check?: JourneyKnowledgeCheck
  practiceTitle?: string
  practiceIntro?: string
  practicePrompts?: Record<string, PromptOverride>
  keyLearning?: string
}

/**
 * Peer-support presentation wording for Journey modules 6–27.
 *
 * The underlying curriculum keeps the formal concepts and safety notes. This
 * layer uses plain language, everyday examples and occasional analogies so the
 * ideas feel like someone is walking alongside the user rather than lecturing.
 */
const OVERRIDES: Record<string, ModuleOverride> = {
  "understanding-your-mind": {
    title: "When Your Head and Feelings Pull in Different Directions",
    description: "Notice when emotion is running the show, when logic is taking over, and what it looks like to make room for both.",
    whyItMatters: "Most of us have had a moment where one part says ‘do it now’ and another part says ‘this is probably a bad idea’. This skill gives those different parts a seat at the same table before you choose what happens next.",
    sections: [
      {
        title: "When emotion gets the loudest microphone",
        body: "There are moments when the feeling is so loud that it colours the whole picture. After a rejection, for example, ‘I feel unwanted’ can quickly become ‘nobody wants me’. After a loss, panic can turn into ‘I need to win it back right now’. DBT calls this Emotional Mind. Emotion is not bad or stupid; it can carry important information. The problem is when the strongest feeling becomes the only information you listen to."
      },
      {
        title: "When logic acts like feelings do not matter",
        body: "The other extreme is trying to turn yourself into a spreadsheet. You can list the facts, make a plan and still ignore the part of you that is hurt, scared, lonely or exhausted. DBT calls this Reasonable Mind. Logic is useful, but a decision can look sensible on paper and still be a poor fit if it ignores your needs, values or what you are realistically capable of today."
      },
      {
        title: "Wise Mind is the conversation between the two",
        body: "Think of Wise Mind as letting your head and your feelings both speak before anyone grabs the steering wheel. You might say: ‘I am really angry and want to send that message. The facts are that I am exhausted and I do not have the full story. What matters to me is handling this without making tomorrow harder.’ Wise Mind is not a magical calm state and it does not guarantee the perfect decision. It simply widens the picture."
      },
    ],
    check: {
      prompt: "Which response is closest to Wise Mind?",
      options: [
        {
          label: "Ignore the feeling and make the most logical decision possible.",
          feedback: "That leaves out useful emotional information and is closer to an extreme version of Reasonable Mind."
        },
        {
          label: "Do what feels strongest right now because the feeling must be telling the truth.",
          feedback: "Strong feelings matter, but they do not always contain the whole picture or the best action."
        },
        {
          label: "Notice the feeling, check the facts and ask what response fits what matters to me.",
          correct: true,
          feedback: "This makes room for emotion, facts and values rather than asking one of them to make the whole decision alone."
        }
      ]
    },
    practiceTitle: "Let both sides have a say",
    practiceIntro: "Use something ordinary or hypothetical. This does not need to be your biggest life decision.",
    practicePrompts: {
      emotion: { label: "What is the emotional part of you saying or wanting to do?", placeholder: "I feel... and part of me wants to..." },
      reason: { label: "What facts or practical information also belong in the picture?", placeholder: "What I actually know is..." },
      wise: { label: "If both mattered, what might a balanced next step look like?", placeholder: "I can respect the feeling and still..." }
    },
    keyLearning: "Feelings and logic both carry information. Wise Mind is the practice of hearing both before deciding what you want to do next."
  },

  "grounding-and-urge-surfing": {
    title: "When Your Mind or an Urge Is Taking Over",
    description: "Try a few ways of getting your feet back under you when a thought, feeling or urge starts filling the whole screen.",
    whyItMatters: "You do not need to make an urge vanish to get through it. Sometimes the win is simply staying with the moment long enough that the urge does not make the decision for you.",
    sections: [
      {
        title: "If being inside your head is making things worse, look outward",
        body: "When your thoughts are racing, being told to ‘focus inward’ can be the last thing you want. Grounding gives your attention somewhere concrete to land: the cold floor under your feet, three things you can see, the sound of traffic, the texture of your sleeve. Think of it like grabbing a handrail when the room feels unsteady. You are not pretending the distress is gone; you are reminding your brain that there is more happening than the thought or urge."
      },
      {
        title: "An urge is more like a wave than an order",
        body: "Urges can rise quickly and feel as if they will keep climbing forever. In practice they change: they can rise, dip, return, move around the body or change shape. Urge surfing means noticing that movement without automatically following it. You might notice ‘tight chest, restless hands, thought about opening the app, urge 8/10’ and keep watching. You are learning that an urge can be present without becoming an action."
      },
      {
        title: "RAIN is another way to stay beside the feeling",
        body: "RAIN gives you four simple prompts when a feeling is hard to hold: Recognise what is here; Allow yourself to notice it if that feels safe; Investigate gently rather than interrogating yourself; and remember that this experience is something you are having, not your whole identity. Some versions use the final N as Nurture: respond to yourself the way you might respond to someone you care about who was having a rough moment.",
        bullets: ["Recognise what is here", "Allow it to be noticed if that feels safe", "Investigate gently", "Remember: this feeling or urge is not your whole identity"]
      }
    ],
    check: {
      prompt: "What is urge surfing actually trying to teach you?",
      options: [
        { label: "How to make every urge disappear within a few minutes.", feedback: "Urges often change, but there is no reliable promise that they will disappear on a timer." },
        { label: "How to notice an urge changing without treating it as something you must act on.", correct: true, feedback: "That is the heart of it: the urge can be real and uncomfortable without being in charge of your next move." },
        { label: "How to argue with yourself until you no longer want the behaviour.", feedback: "Urge surfing is more about observing than debating. Arguing can sometimes make the urge take up even more space." }
      ]
    },
    practiceTitle: "Pick one thing to try",
    practiceIntro: "Do not turn this into four exercises. Choose grounding, breath, RAIN or urge surfing and see what you notice.",
    practicePrompts: {
      method: { label: "Which approach did you try?", placeholder: "I tried grounding / breath / RAIN / urge surfing..." },
      notice: { label: "What did you notice while you were doing it?", placeholder: "The urge changed / stayed strong / moved in my body / my attention shifted..." }
    },
    keyLearning: "Grounding and mindfulness skills do not need to erase distress to be useful. Their job is to help you stay present long enough to have a choice about what happens next."
  },

  "building-awareness": {
    title: "A Two-Minute Daily Reflection",
    description: "Take a quick snapshot of where you are today without turning it into a score for how well you are doing.",
    whyItMatters: "When you are struggling, one bad hour can feel like proof that everything is going backwards. A Daily Reflection helps you gather information instead of handing out a verdict.",
    sections: [
      {
        title: "Think weather report, not school report",
        body: "A weather report might say ‘rain, strong wind, low visibility’. It does not say the weather has failed. A Daily Reflection can work the same way: ‘slept badly, stressed about money, strong urge, avoiding messages’. You are describing the conditions you are working with today, not grading your character or your recovery."
      },
      {
        title: "Notice the difference between the camera and the narrator",
        body: "A camera could record ‘I sent a message at 10am and they have not replied’. Your narrator might instantly add ‘they are sick of me’. Both are worth noticing, but they are different kinds of information. Being able to say ‘this happened, and my mind is telling me this about it’ creates a little breathing room between the event and the story."
      },
      {
        title: "Patterns only become visible when you have a few snapshots",
        body: "One difficult Daily Reflection does not tell you very much. Over time you may notice that urges are stronger after poor sleep, that Sundays are lonely, that conflict makes you isolate, or that being around certain people makes healthier choices easier. Those patterns can help with planning. They are clues, not diagnoses."
      }
    ],
    check: {
      prompt: "Which one sounds most like a useful Daily Reflection rather than a judgement?",
      options: [
        { label: "I am messing everything up again.", feedback: "That is a verdict about yourself, but it does not tell you much about what is actually happening today." },
        { label: "My urge is strong, I slept poorly and I have avoided messages since this morning.", correct: true, feedback: "This gives you real information about the current conditions without deciding what they mean about you as a person." },
        { label: "Tomorrow is probably going to be just as bad.", feedback: "That is a prediction. It may be a real fear, but it is not a description of what is happening right now." }
      ]
    },
    practiceTitle: "Give yourself a weather report",
    practiceIntro: "Two minutes. No fixing, no judging, just notice what is here.",
    practicePrompts: {
      internal: { label: "What is most noticeable inside you right now?", placeholder: "A feeling, thought, body sensation or urge..." },
      context: { label: "What is going on around you that might be affecting that?", placeholder: "Sleep, money, people, conflict, access, work, time of day..." }
    },
    keyLearning: "A Daily Reflection is a description of today's conditions, not a score. Repeated snapshots can show patterns that make future choices easier to plan for."
  },

  "recognizing-triggers": {
    title: "Triggers and the Things That Make Them Hit Harder",
    description: "Work out what tends to light the fuse and what makes you more vulnerable before the spark even arrives.",
    whyItMatters: "The same trigger can feel manageable one day and overwhelming the next. Understanding both the spark and the conditions around it gives you more ways to prepare.",
    sections: [
      {
        title: "A trigger is the spark",
        body: "A trigger is something close to the urge or behaviour. It might be a payday notification, seeing an ad, driving past a venue, being alone at night, getting rejected, feeling bored or remembering something painful. Triggers can be outside you or inside you. The useful question is not ‘why am I so weak around this?’ but ‘what tends to happen right before the urge wakes up?’"
      },
      {
        title: "Vulnerabilities are the dry grass around the spark",
        body: "A spark landing on wet ground is different from a spark landing in dry grass. Poor sleep, loneliness, pain, hunger, conflict, stress, alcohol, easy access to money or feeling hopeless can all make a trigger catch faster. Calling these vulnerabilities does not mean you are weak. It means the conditions have changed, so your plan may need more support than usual."
      },
      {
        title: "Some triggers can be removed; others need a plan",
        body: "You may be able to block gambling ads, move money, avoid a venue or delete an app. You cannot remove every difficult emotion, every payday or every disagreement from life. For the triggers that stay, the plan might be ‘I know this hits me hard when I am tired, so I move the money first, do not stay alone and text someone before the usual window.’ A plan is stronger when it matches the real trigger."
      }
    ],
    check: {
      prompt: "Which example is more like a vulnerability than a trigger?",
      options: [
        { label: "A gambling promotion appears on your phone.", feedback: "That is a specific cue close to the urge, so it fits more closely with a trigger." },
        { label: "You have slept badly for three nights and feel completely drained.", correct: true, feedback: "Poor sleep can make many different triggers harder to handle, so it is a good example of a background vulnerability." },
        { label: "You see a bottle sitting on the kitchen bench.", feedback: "That is a specific external cue and could function as a trigger." }
      ]
    },
    practiceTitle: "Map the spark and the conditions",
    practiceIntro: "Choose one pattern you know. You are gathering clues, not building a case against yourself.",
    practicePrompts: {
      cues: { label: "What tends to happen right before the urge or behaviour shows up?", placeholder: "A place, person, payday, ad, thought, feeling, boredom, conflict..." },
      vulnerabilities: { label: "What tends to make that trigger hit harder?", placeholder: "Poor sleep, stress, loneliness, pain, alcohol, easy access, hunger..." }
    },
    keyLearning: "Triggers are the sparks close to an urge. Vulnerabilities are the conditions that can make those sparks catch more easily. Both can be planned for."
  },

  "choice-points": {
    title: "The Fork in the Road",
    description: "Spot the small moment where the usual response and the direction you actually want start pulling apart.",
    whyItMatters: "Big life changes are often made up of very small forks in the road: open the app or put the phone down, hide the problem or tell someone, send the angry message or wait ten minutes.",
    sections: [
      {
        title: "The usual move often makes sense in the short term",
        body: "ACT sometimes calls this an ‘away move’: something that takes you away from the life or behaviour you want, even though it may give quick relief. Avoiding a bill stops the anxiety for tonight. Gambling can create a burst of hope. Shutting everyone out can make you feel safer for an hour. Calling it an away move is about the direction of the action, not calling you a bad person."
      },
      {
        title: "A towards move can be tiny",
        body: "A towards move points a little more toward what matters to you. It does not have to feel good. Telling the truth may be uncomfortable. Moving money somewhere safer may feel frustrating. Going for a walk instead of chasing an urge may feel boring. The move only needs to take you a little closer to the kind of life or person you want to be in that moment."
      },
      {
        title: "You only choose from the roads that actually exist",
        body: "A fork-in-the-road exercise can sound unfair if it pretends everyone has unlimited choices. They do not. Money, illness, coercion, safety, childcare, housing and other realities can narrow the roads available. The question is simply: within the situation you are actually in, is there one next move that gives tomorrow-you a slightly better position?"
      }
    ],
    check: {
      prompt: "What makes something a ‘towards move’?",
      options: [
        { label: "It makes you feel better straight away.", feedback: "A towards move can feel uncomfortable in the short term, especially when it involves honesty, boundaries or doing something unfamiliar." },
        { label: "It fits something that matters to you, even if it is small or uncomfortable.", correct: true, feedback: "The direction matters more than whether the action brings immediate relief." },
        { label: "It is what somebody else thinks you should do.", feedback: "Other people can offer useful advice, but a values-based towards move needs to make sense in your own situation and direction." }
      ]
    },
    practiceTitle: "Find one fork in the road",
    practiceIntro: "Use a real or made-up moment where quick relief and your longer-term direction pull different ways.",
    practicePrompts: {
      away: { label: "What is the usual move that offers quick relief?", placeholder: "The automatic move is usually..." },
      towards: { label: "What is one small move that would leave you closer to what matters?", placeholder: "Instead, one realistic step could be..." }
    },
    keyLearning: "A choice point is a small fork in the road. You may not control the whole landscape, but sometimes one next move can leave you in a better place for what comes after."
  },

  "understanding-emotions": {
    title: "What an Emotion Is Trying to Do",
    description: "Break an emotional moment into its parts so a strong feeling does not have to become the whole story.",
    whyItMatters: "An emotion can hit like one big wave: body, thoughts, urge and meaning all at once. Pulling those pieces apart makes it easier to understand what the feeling may be telling you and whether the urge is worth following.",
    sections: [
      {
        title: "An emotion is a whole-body event",
        body: "Anger is not only the word ‘angry’. It might be heat in your face, tight shoulders, thoughts about unfairness, a louder voice and an urge to attack or send a message. Anxiety might be a racing heart, thoughts about what could go wrong and an urge to escape. Naming the pieces can turn ‘I am losing it’ into something more specific that you can actually respond to."
      },
      {
        title: "Emotions are more like dashboard lights than steering wheels",
        body: "A dashboard light deserves attention, but it does not tell you exactly where to drive. Fear can alert you to danger. Guilt can point to something you want to repair. Anger can flag a boundary or unfairness. Sadness can show you that something mattered and was lost. The signal may fit the current facts closely, partly or not very well, so the next step is listening without handing the emotion full control."
      },
      {
        title: "The urge is part of the emotion, not an instruction",
        body: "Fear may say ‘run’. Anger may say ‘attack’. Shame may say ‘hide’. Sadness may say ‘withdraw’. Sometimes those urges are useful and protective; sometimes they keep a problem going. The useful skill is being able to notice ‘this feeling makes me want to do X’ and then decide whether X actually fits the situation."
      }
    ],
    check: {
      prompt: "Which statement is the most useful way to think about emotions here?",
      options: [
        { label: "If I feel something strongly, my interpretation must be correct.", feedback: "The strength of a feeling tells you the feeling matters; it does not automatically prove every conclusion attached to it." },
        { label: "Emotions can give me information and urges, but I can still check what action fits the situation.", correct: true, feedback: "This respects the emotion without making the action urge automatic." },
        { label: "The goal is to stop having uncomfortable emotions.", feedback: "Uncomfortable emotions are part of being human. The aim is to understand and respond to them more effectively, not erase them." }
      ]
    },
    practiceTitle: "Pull one emotion apart",
    practiceIntro: "Choose something manageable or invent an example. You are practising the map, not trying to relive your hardest moment.",
    practicePrompts: {
      emotion: { label: "What feeling showed up, and where did you notice it in your body?", placeholder: "I felt... and noticed..." },
      urge: { label: "What did the feeling make you want to do?", placeholder: "Leave, argue, hide, withdraw, seek reassurance..." },
      message: { label: "What was your mind saying the situation meant?", placeholder: "My mind was telling me..." }
    },
    keyLearning: "Emotions are signals with thoughts, body changes and action urges attached. You can listen to the signal without automatically letting the urge steer."
  },

  "check-the-facts": {
    title: "What Happened, and What Did Your Mind Add?",
    description: "Separate the part a camera could record from the story, prediction or assumption your mind built around it.",
    whyItMatters: "When emotion is high, an assumption can feel exactly like a fact. Checking the difference does not mean distrusting yourself; it means giving yourself the best information before you respond.",
    sections: [
      {
        title: "Brains hate gaps, so they fill them in",
        body: "Someone leaves you on read and your mind may instantly produce a reason: ‘they are angry’, ‘I said something stupid’, ‘they are talking to someone else’. That story might turn out to be true, partly true or completely wrong. Minds also jump to worst cases, use all-or-nothing rules and treat feelings as proof. These habits are common because uncertainty is uncomfortable."
      },
      {
        title: "Try the camera test",
        body: "Ask: what could a camera or microphone have captured? ‘They did not reply today’ passes the camera test. ‘They do not care about me’ does not, because that is an interpretation. Another example: ‘I lost $300’ is a fact. ‘The only way out is to win it back tonight’ is a conclusion. Separating the two gives you a chance to choose from the real information first."
      },
      {
        title: "Then ask what kind of problem you actually have",
        body: "If the facts show a problem you can change, problem solving may help. If the fact has already happened and cannot be changed right now, acceptance may help you decide what comes next. If the emotion is pushing an action that does not fit the facts, Opposite Action may be useful. Checking facts is not the final answer; it helps you pick the next tool."
      }
    ],
    check: {
      prompt: "Which sentence contains the clearest assumption rather than only an observation?",
      options: [
        { label: "The meeting started at 9:00 and I arrived at 9:12.", feedback: "Those details are mostly observable and could be checked by another person." },
        { label: "My heart is racing and I notice an urge to leave.", feedback: "That describes a body sensation and an urge you can directly notice." },
        { label: "They did not reply today, so they must be angry with me.", correct: true, feedback: "The lack of reply is observable. ‘They must be angry’ is the part your mind has added and may need checking." }
      ]
    },
    practiceTitle: "Use the camera test",
    practiceIntro: "Choose something safe enough to think about. You are not trying to prove yourself wrong, just separate what you know from what you guessed.",
    practicePrompts: {
      story: { label: "What story, prediction or conclusion did your mind add?", placeholder: "They must... / This means... / It is definitely going to..." },
      facts: { label: "What would a camera or microphone actually have captured?", placeholder: "What was said, done, seen or heard..." }
    },
    keyLearning: "Checking the facts is the camera test: separate what you directly know from what your mind added, then decide which skill fits the problem you actually have."
  },

  "opposite-action": {
    title: "When the Urge Is Pointing the Wrong Way",
    description: "Sometimes the feeling makes sense but the action it is pushing you toward keeps the problem alive. Opposite Action is about testing another safe direction.",
    whyItMatters: "Avoiding something can calm anxiety now and make it bigger next time. Hiding can reduce shame now and make you feel more alone later. When that cycle is happening, a small move against the urge can teach your brain something new.",
    sections: [
      {
        title: "Do not automatically fight every emotion",
        body: "Opposite Action does not mean ‘if you are scared, do the scary thing’. First ask whether the emotion and urge fit what is actually happening. Fear when somebody is threatening you is doing an important job. Anger when a boundary is being crossed may be useful information. The skill is for times when the urge is not protecting you or is keeping an old pattern going."
      },
      {
        title: "Choose the smallest safe move in the other direction",
        body: "If anxiety says ‘cancel and hide’ even though the situation is safe, the opposite might be staying for ten minutes rather than forcing yourself through the whole event. If shame says ‘do not tell anyone’, the opposite might be telling one trusted person. If anger says ‘send the message now’, the opposite might be putting the phone down and lowering your voice. Opposite does not have to mean dramatic."
      },
      {
        title: "Safety gets the final say",
        body: "Never use this skill to talk yourself into approaching violence, coercion, abuse, a dangerous medical situation or trauma that overwhelms you. A protective urge is not something to prove you can beat. In those situations, distance, support and safety planning come first."
      }
    ],
    check: {
      prompt: "When does Opposite Action make the most sense?",
      options: [
        { label: "Whenever I feel fear, including when I might actually be unsafe.", feedback: "Fear can be protective. Genuine danger is a reason to prioritise safety, not override the signal." },
        { label: "When the urge is not useful or does not fit the facts, and a different action is safe.", correct: true, feedback: "That is the key condition: check the facts and safety first, then consider a small opposite action." },
        { label: "When I want to prove I have enough willpower to control my emotions.", feedback: "This is not a toughness test. It is about choosing a more useful behaviour when the usual urge is keeping a problem going." }
      ]
    },
    practiceTitle: "Try the smallest safe opposite",
    practiceIntro: "Use a low-risk situation. If you are unsure whether the situation is safe, do not use that example.",
    practicePrompts: {
      urge: { label: "What feeling and urge are showing up?", placeholder: "I feel... and want to avoid / attack / hide / withdraw..." },
      facts: { label: "Does following that urge fit the facts and your safety needs?", placeholder: "What tells you the urge is protective, unhelpful or mixed?" },
      opposite: { label: "If another direction fits, what is the smallest safe version of it?", placeholder: "One gradual action..." }
    },
    keyLearning: "Opposite Action is not about ignoring feelings. It is about checking whether the urge is helping, then trying a small safe move in another direction when the usual action keeps the problem going."
  },

  "abc-please": {
    title: "Lower the Load on Your System",
    description: "Look after the basics that make emotions harder to manage, then add small sources of enjoyment and achievement back into life.",
    whyItMatters: "Trying to regulate emotions when you are exhausted, hungry, unwell, withdrawing or running on stress is like trying to use your phone on 2% battery. Skills still matter, but the system has less capacity to work with.",
    sections: [
      {
        title: "Start with the battery level",
        body: "DBT uses the word PLEASE as a reminder to notice physical health, eating, substances, sleep and movement. You do not need a perfect wellness routine. The question is whether one of those basics is quietly making everything else harder. Maybe three nights of poor sleep are turning minor stress into major stress, or skipping meals is making irritability and urges hit harder. Notice the load before blaming yourself for struggling under it."
      },
      {
        title: "Put some good things back into the week",
        body: "When life becomes about surviving a problem, enjoyable things often disappear first. Positive experiences can be small: coffee with someone safe, music in the car, cooking, the beach, gaming with friends, making something, kicking a ball around with the kids. The point is not to force happiness. It is to stop one behaviour or one problem being your only reliable source of reward, relief or excitement."
      },
      {
        title: "Do something that reminds you you can still build",
        body: "Mastery is the feeling that comes from doing something that takes a bit of effort and leaves evidence behind. Finish a job you have avoided. Learn one part of a skill. Cook dinner. Fix something. Walk a route you said you would. It does not need to be impressive. Think of mastery as putting small deposits back into trust in yourself."
      }
    ],
    check: {
      prompt: "Which approach fits this module best?",
      options: [
        { label: "Build a strict health routine and treat missed items as failure.", feedback: "That can turn basic care into another all-or-nothing test. The prompts are meant to reduce load, not create more of it." },
        { label: "Notice which physical basics are making life harder, take one safe step, and add small positive or mastery activities.", correct: true, feedback: "This keeps the focus on realistic foundations and building other sources of reward and capability." },
        { label: "Change prescribed medication if it seems connected to my mood.", feedback: "Medication changes should be discussed with the clinician who prescribes or manages them, not made from an app lesson." }
      ]
    },
    practiceTitle: "Recharge one thing and build one thing",
    practiceIntro: "You do not need a new lifestyle by Monday. Pick two small moves that fit your current capacity.",
    practicePrompts: {
      please: { label: "Which basic is making life harder right now, and what is one safe next step?", placeholder: "Sleep, eating, health care, substance-use support, movement..." },
      mastery: { label: "What is one small enjoyable or mastery-building thing you could put back into the week?", placeholder: "See someone, create, fix, learn, walk, cook, finish one task..." }
    },
    keyLearning: "Your capacity is affected by the condition of the body and the life around you. Lower one source of strain and add one small source of enjoyment or mastery rather than demanding a perfect routine."
  },

  "coping-ahead": {
    title: "Make the Plan Before the Hard Moment Arrives",
    description: "Choose one situation you know is likely to be difficult and decide what you want to do before your brain is under pressure.",
    whyItMatters: "It is much easier to remember an umbrella before the rain than to invent one once you are soaked. Coping Ahead is the same idea: make a simple plan while you still have some thinking space.",
    sections: [
      {
        title: "Choose one situation you can actually picture",
        body: "‘I need to cope better with weekends’ is too broad. ‘Friday night after I get paid and I am home alone’ is specific enough to plan for. So is ‘seeing my ex at the kids’ handover’ or ‘the hour after a stressful work meeting’. The clearer the scene, the easier it is to spot what usually makes it difficult."
      },
      {
        title: "Decide the first move and the backup move",
        body: "Do not build a twelve-step emergency flowchart you will never remember. Pick the first thing you want to do and one backup if that is not enough. For example: ‘Before payday, money goes into the protected account. If the urge is still strong, I leave the house and call Sam.’ Or: ‘If the conversation gets heated, I pause it. If it keeps escalating, I leave and continue later.’"
      },
      {
        title: "Rehearse it once, then come back to today",
        body: "Mentally run through the scene and picture yourself using the plan. Include one likely wobble, not every disaster your mind can invent. Then stop the rehearsal and return to the present. Coping Ahead is preparation, not an invitation to spend half an hour catastrophising."
      }
    ],
    check: {
      prompt: "What makes Coping Ahead different from worrying?",
      options: [
        { label: "You imagine every bad outcome so nothing can surprise you.", feedback: "That can turn into rumination and make the situation feel larger rather than creating a usable plan." },
        { label: "You choose one likely situation, decide what you will do first and keep a backup step ready.", correct: true, feedback: "That turns anticipation into a short action plan rather than an endless list of possible problems." },
        { label: "You plan carefully enough that the situation is guaranteed to go well.", feedback: "A plan can improve readiness, but it cannot control other people or every outcome." }
      ]
    },
    practiceTitle: "Pack your umbrella before it rains",
    practiceIntro: "Choose one predictable difficult moment. Keep the plan short enough that you could remember it under stress.",
    practicePrompts: {
      situation: { label: "What situation are you preparing for, and what usually makes it difficult?", placeholder: "Friday after payday... after an argument... being alone at night..." },
      plan: { label: "What will you do first, and what is your backup if the first step is not enough?", placeholder: "First I will... / If I still need more support, I will..." }
    },
    keyLearning: "Coping Ahead means deciding your first and backup responses before a predictable difficult moment, when you still have enough space to think clearly."
  },

  "discovering-values": {
    title: "What Do You Want Your Life to Stand For?",
    description: "Use values as a compass for choices, not another list of standards you have to meet perfectly.",
    whyItMatters: "When you are only trying to get away from pain, life can become organised around what you do not want. Values give you something to move toward as well.",
    sections: [
      {
        title: "A value is a direction, not a finish line",
        body: "Think of a value like ‘connection’ as north on a compass. You never finish connection and tick it off forever. You can keep taking actions in that direction. A goal is different: ‘call my brother on Thursday’ can be completed. Goals are steps; values help you decide which way those steps should point."
      },
      {
        title: "The Life Garden was about what becomes hardest to lose",
        body: "When you narrowed down areas in the Life Garden, crossing something out did not mean it was worthless. The exercise forced priorities because real life sometimes does too. The parts you found hardest to let go of can tell you something about what gives your life meaning, but you are allowed to rethink those choices as your life changes."
      },
      {
        title: "Values are a compass, not a weapon",
        body: "If family matters to you and you have been distant, the value is not there to say ‘look how badly you have failed’. It is there to ask ‘what would one move toward family look like today?’ You can care about honesty and still have lied. You can value health and still struggle with your health. Values are most useful when they point to the next action instead of becoming another reason to attack yourself."
      }
    ],
    check: {
      prompt: "Which one is a value rather than a single goal?",
      options: [
        { label: "Go to my appointment on Thursday.", feedback: "That is a clear goal or action that can be completed." },
        { label: "Connection.", correct: true, feedback: "Connection is an ongoing direction that can be expressed through many different actions over time." },
        { label: "Never make another mistake.", feedback: "That is an impossible rule rather than a value you can keep moving toward." }
      ]
    },
    practiceTitle: "Use the compass on one ordinary day",
    practiceIntro: "Choose one value that matters now. It does not need to be your forever top value.",
    practicePrompts: {
      value: { label: "What value matters to you here, and what does it mean in your own words?", placeholder: "For me, connection means..." },
      behaviour: { label: "What could one small step in that direction look like?", placeholder: "Send a message, be honest, keep a boundary, show up, finish something..." }
    },
    keyLearning: "Values are compass directions, not finish lines or perfection rules. Their job is to help you choose the next step you want your life to point toward."
  },

  "recognizing-strengths": {
    title: "Evidence That You Have More to Work With Than It Feels Like",
    description: "Look at things you have already survived, learned or changed and notice what helped you do it.",
    whyItMatters: "When you are low, your brain can become an excellent historian of every failure and strangely forget everything you have ever handled. This module is about putting some of the missing evidence back on the table.",
    sections: [
      {
        title: "Do not ask ‘am I a strong person?’",
        body: "That question is too big and easy to answer harshly. Ask for evidence instead. Have you kept parenting through a terrible period? Learned a job without much confidence? Asked for help when you did not want to? Built something, moved house, left a bad situation, repaired a mistake or kept going through grief? Those actions may contain persistence, humour, creativity, courage, problem solving, honesty or care even if you did not feel strong while doing them."
      },
      {
        title: "Strength often looks ordinary while you are using it",
        body: "People imagine resilience as a heroic speech. In real life it can look like getting out of bed, making the call, showing up for your kid, going back after embarrassment or trying again after a setback. The fact that something felt messy does not erase the skill it took to get through it."
      },
      {
        title: "People and resources are part of your strength too",
        body: "If a friend helped you, a counsellor gave you a tool or a family member kept you accountable, that does not mean the achievement ‘does not count’. Nobody builds a house by refusing to use tools. Knowing who helps, what environment works and when to ask for support is useful knowledge you can use again."
      }
    ],
    check: {
      prompt: "What is the most useful way to identify a strength?",
      options: [
        { label: "Only count qualities I show perfectly all the time.", feedback: "Very few useful qualities show up perfectly in every situation. That standard hides real evidence." },
        { label: "Look at real things I have done and ask what qualities or support helped me do them.", correct: true, feedback: "Concrete actions give you evidence you can believe and potentially use again." },
        { label: "Ignore anything I did with help because it was not completely my own achievement.", feedback: "Using support is part of effective coping and change, not evidence that the effort does not count." }
      ]
    },
    practiceTitle: "Find one piece of evidence",
    practiceIntro: "Do not choose your biggest achievement. Pick anything that reminds you that you have handled something before.",
    practicePrompts: {
      change: { label: "What is one difficult thing or change you have managed in the past?", placeholder: "Work, parenting, grief, health, money, learning, moving, relationships..." },
      strengths: { label: "What did that situation show you could use, and who or what helped?", placeholder: "Persistence, humour, practical thinking, a friend, service, routine, tool..." }
    },
    keyLearning: "Strength is easier to trust when it is tied to evidence. Look at what you have already done and the people or resources that helped you do it."
  },

  "values-to-action": {
    title: "Turn Something That Matters Into Something You Can Do",
    description: "Take one value off the page and turn it into a small action that can actually happen in your real week.",
    whyItMatters: "‘Be a better parent’, ‘get healthy’ or ‘fix my finances’ can all matter deeply and still be too big to start. A value becomes useful when it reaches the ground as one specific behaviour.",
    sections: [
      {
        title: "Pick one lane for now",
        body: "When everything feels behind, the temptation is to make a plan for family, money, health, work, exercise and relationships all at once. That often creates a beautiful plan you are too overwhelmed to start. Pick one area. If connection matters, maybe the step is one message. If stability matters, maybe it is moving one payment or booking one appointment."
      },
      {
        title: "Shrink the action until you can see yourself doing it",
        body: "‘Exercise more’ is hard to picture. ‘Walk around the block after dinner on Tuesday’ is visible. ‘Repair my relationships’ is huge. ‘Tell one person I have been avoiding them because I am struggling’ is a step. Shrinking a goal is not lowering your standards; it is giving the value somewhere to land."
      },
      {
        title: "Expect the barrier before it arrives",
        body: "If you know you will be tired after work, plan for tired-you instead of imagining motivated-you will suddenly appear. Put the shoes by the door. Ask someone to text you. Move the money before the urge. Choose the shorter version. Good planning does not assume you will always feel ready; it makes the next step easier when you do not."
      }
    ],
    check: {
      prompt: "Which option is the clearest first committed action?",
      options: [
        { label: "Improve my whole life this month.", feedback: "The direction may matter, but it is too wide to tell you what to do next." },
        { label: "Because connection matters to me, I will message one trusted friend after work on Wednesday.", correct: true, feedback: "This links a value to an action, time and real-world situation you can actually carry out." },
        { label: "Wait until I feel fully motivated, then decide what to do.", feedback: "Motivation changes. A small action can be planned so it is available even when motivation is low." }
      ]
    },
    practiceTitle: "Put one value on the calendar",
    practiceIntro: "One value. One action. One likely barrier. One support. That is enough.",
    practicePrompts: {
      goal: { label: "What will you actually do, and when?", placeholder: "Because ___ matters, I will ___ on/at ___..." },
      barrier: { label: "What is most likely to get in the way, and how will you make the step easier?", placeholder: "When ___ happens, I can..." },
      support: { label: "Who or what could support this without taking the choice away from you?", placeholder: "Person, reminder, safeguard, environment change..." }
    },
    keyLearning: "A value becomes action when the next step is small, specific and planned for the version of you who may be tired, stressed or unmotivated when the time comes."
  },

  "stop-skill": {
    title: "Put a Gap Between the Urge and the Action",
    description: "STOP is the mental handbrake. TIP and practical safeguards can help you hold the pause long enough to choose what comes next.",
    whyItMatters: "Some moments move frighteningly fast: thought, urge, phone out, app open. You may not be ready to solve the whole problem in that moment. First you just need to interrupt the momentum.",
    sections: [
      {
        title: "STOP: interrupt the automatic sequence",
        body: "STOP is simple on purpose. Stop if you safely can. Take a step back, physically or mentally. Observe what is happening: the facts, feeling, body and urge. Then Proceed mindfully with one deliberate next action. Think of it like taking your foot off the accelerator before deciding which direction to steer.",
        bullets: ["Stop", "Take a step back", "Observe", "Proceed mindfully"]
      },
      {
        title: "TIP can help when your body is running hot",
        body: "Sometimes thinking is difficult because your whole body is activated. DBT groups several body-based options under TIP, including temperature change, brief intense movement, paced breathing and muscle relaxation. These are optional tools, not a challenge to push yourself physically. Use only versions that are safe for your health and situation."
      },
      {
        title: "Make the pause harder to break",
        body: "A mental pause is stronger when the environment backs it up. Put the phone in another room. Move away from the venue. Hand someone the card. Close the betting app. Leave the argument. Call someone. Set a timer. If the risky action is one tap away, adding real-world distance can give the calmer part of you more time to catch up."
      }
    ],
    check: {
      prompt: "What is the first job of STOP?",
      options: [
        { label: "Solve the whole problem before the feeling gets worse.", feedback: "When intensity is high, trying to solve everything immediately can add pressure. The first job is simply to interrupt momentum." },
        { label: "Pause the automatic action long enough to notice what is happening.", correct: true, feedback: "That is the point of STOP: create a gap before choosing the next response." },
        { label: "Convince myself that the emotion is irrational.", feedback: "You do not need to win an argument with the emotion. The skill starts with pausing and observing." }
      ]
    },
    practiceTitle: "Build your personal handbrake",
    practiceIntro: "Think about one situation that tends to move fast. What would a real pause look like there?",
    practicePrompts: {
      stop: { label: "What could you physically do to stop and step back?", placeholder: "Put the phone down, leave the room, move money, wait ten minutes..." },
      proceed: { label: "Once you have created the gap, what is one safer next move?", placeholder: "Ground, call someone, use a safeguard, solve one part..." }
    },
    keyLearning: "STOP is about creating a gap before action. Body-based TIP options and practical safeguards can help hold that gap when the urge is moving faster than your thinking."
  },

  "accepts-improve": {
    title: "Getting Through a Rough Hour Without Making Tomorrow Harder",
    description: "Use temporary coping tools when you cannot solve the actual problem right now but still need to get through the next stretch of time.",
    whyItMatters: "Not every problem can be fixed at 11pm, during an argument or in the middle of an urge. Sometimes the job is to get through the next hour without adding a second problem to the first one.",
    sections: [
      {
        title: "ACCEPTS is a temporary change of channel",
        body: "Imagine your mind is stuck on one channel at full volume. ACCEPTS offers ways to change the channel for a while: do an Activity, Contribute, use Comparisons carefully, create a different Emotion, Push the problem away temporarily, shift Thoughts or use a safe Sensation. This is not pretending the problem does not exist. It is giving yourself a break when staring at it is only making you more likely to act impulsively."
      },
      {
        title: "IMPROVE is about making the moment easier to live through",
        body: "IMPROVE is another menu: Imagery, Meaning, Planning, Relaxing, One thing in the moment, a brief Vacation or time-out, and Encouragement. You might picture somewhere safe, put on a familiar show, plan tomorrow's first step, take a shower, focus only on making dinner or tell yourself ‘I only need to get through the next twenty minutes’. You do not need to use every letter."
      },
      {
        title: "Temporary coping is a shelter, not a permanent address",
        body: "Distraction can help you survive a storm, but eventually some problems need action, support or acceptance. The idea is to use the coping skill until you have enough capacity to return to what matters. And you do not need to punish yourself while you wait. ‘This is rough, I can make it through this hour without making it worse’ is often more useful than shouting at yourself to get over it."
      }
    ],
    check: {
      prompt: "What is the best use of distraction in distress tolerance?",
      options: [
        { label: "Avoid difficult problems for as long as possible.", feedback: "Distraction is usually a temporary shelter. Problems that need action still need to be returned to when you have more capacity." },
        { label: "Create enough breathing room to get through the moment, then come back to action, support or acceptance when you can.", correct: true, feedback: "That is exactly what these tools are for: reduce the chance of making the situation worse while you wait for a better time to respond." },
        { label: "Only use a skill if it makes the feeling disappear completely.", feedback: "The feeling can still be there and the skill can still have done its job if it helped you get through the moment more safely." }
      ]
    },
    practiceTitle: "Build your rough-hour menu",
    practiceIntro: "Pick options you would genuinely use, not the ones that sound most therapeutic on paper.",
    practicePrompts: {
      accepts: { label: "What is one safe way you could change the channel for a short time?", placeholder: "Walk, game, clean, call someone, music, different sensation..." },
      improve: { label: "What is one thing that could make the next 20–30 minutes easier to live through?", placeholder: "Shower, imagery, one task, brief break, encouragement, plan tomorrow..." }
    },
    keyLearning: "ACCEPTS and IMPROVE are temporary shelters for high-distress moments. Their job is to help you get through without adding another problem, then return to what needs attention when you can."
  },

  "reality-acceptance": {
    title: "You Do Not Have to Like Reality to Start From It",
    description: "Acknowledge what is already true, then put your energy into the choices that are still available.",
    whyItMatters: "Some pain comes from what happened. More energy can be burned fighting the fact that it happened at all. Acceptance is not approval; it is getting your feet onto the ground you are actually standing on so you can decide where to step next.",
    sections: [
      {
        title: "Acceptance is not saying ‘this was okay’",
        body: "If someone hurt you, accepting that it happened does not mean forgiving them, blaming yourself or dropping your boundaries. If you lost money, accepting the loss does not mean it was fine or that you should not try to repair the damage. Acceptance simply says: ‘This is part of the situation I have to work from today.’ You can dislike reality and still stop negotiating with the fact that it is already here."
      },
      {
        title: "Willingness is asking ‘what can I do with this?’",
        body: "Willingness can sound grand, but it is often small. ‘I hate that this is where I am, but I am willing to make the phone call.’ ‘I do not feel ready to talk about everything, but I am willing to tell my counsellor I am struggling.’ Reluctance is worth listening to as well; sometimes it comes from fear, exhaustion or a genuine safety concern. This is not obedience. It is choosing what you are prepared to try."
      },
      {
        title: "Turning the mind means coming back when the argument restarts",
        body: "Acceptance is rarely a one-time click. Your mind may return ten minutes later with ‘but it should not have happened’. Turning the mind is simply noticing that you are back in the argument and returning to two questions: what is true now, and what can I still influence? Think of it like gently turning a shopping trolley that keeps pulling to one side; you may need to correct it more than once."
      }
    ],
    check: {
      prompt: "Which statement fits reality acceptance best?",
      options: [
        { label: "If I accept what happened, I have to forgive it and stop doing anything about it.", feedback: "Acceptance does not remove your right to boundaries, justice, repair, leaving or taking action." },
        { label: "I can acknowledge that this happened, hate that it happened, protect myself and decide what I can still do next.", correct: true, feedback: "This separates acknowledging reality from approving of it. Acceptance and action can exist at the same time." },
        { label: "If I am still angry, I have not accepted reality properly.", feedback: "Acceptance does not require a particular feeling to disappear. You can accept a fact and still feel angry, sad or hurt about it." }
      ]
    },
    practiceTitle: "Put one foot on the ground that is already there",
    practiceIntro: "Choose something safe enough to reflect on. Never use acceptance to persuade yourself to stay in danger.",
    practicePrompts: {
      fact: { label: "What is one fact you wish were different but is already true right now?", placeholder: "Describe the fact without saying it was okay or deserved..." },
      control: { label: "Given that fact, what is still yours to choose or influence?", placeholder: "A boundary, call, report, plan, repair step, leaving, support..." }
    },
    keyLearning: "Acceptance is starting from reality, not approving of it. Once your feet are on the ground that actually exists, you can put more energy into the choices that remain."
  },

  "problem-solving": {
    title: "Untangle One Knot at a Time",
    description: "Take one problem that can actually be changed and turn it into options, a first step and something you can review.",
    whyItMatters: "When five problems are tangled together, your brain can label the whole thing ‘my life is a mess’. Problem solving works better when you pull out one knot and ask what can actually be done about that part.",
    sections: [
      {
        title: "Name one problem small enough to hold",
        body: "‘My finances are ruined’ is huge. ‘I am $400 short for rent next week’ is a specific problem. ‘My relationship is broken’ is huge. ‘We cannot talk about money without the conversation escalating’ is more workable. The aim is not to minimise the bigger issue; it is to get one part of it onto the table where choices become visible."
      },
      {
        title: "Give yourself more than one door",
        body: "Under stress, the first idea can feel like the only idea. Deliberately list a few options before choosing: call the landlord, ask for a payment arrangement, sell something, talk to a budgeting service, ask someone safe for help. Some ideas will be poor fits. That is fine. Brainstorming is about seeing doors before deciding which one to open."
      },
      {
        title: "Try the best available option, then learn",
        body: "Choose the option that best fits safety, values, resources and likely consequences, then make the first action obvious. After you try it, look at what happened. A plan not working is data, not a personal verdict. If the door is locked, you go back to the hallway and choose another one."
      }
    ],
    check: {
      prompt: "What usually comes before choosing the solution?",
      options: [
        { label: "Take the first idea that appears so I do not overthink it.", feedback: "In ordinary non-emergency problems, the first idea is not always the best one. A few options give you something to compare." },
        { label: "Make the problem specific and come up with more than one possible response.", correct: true, feedback: "A smaller problem and several options create room for an actual decision rather than an automatic reaction." },
        { label: "Wait until I know with certainty which option will work.", feedback: "Most real problems involve uncertainty. A workable plan can be tried, reviewed and changed." }
      ]
    },
    practiceTitle: "Pull out one knot",
    practiceIntro: "Choose something small enough that a first action is possible. You are not required to solve the whole situation today.",
    practicePrompts: {
      problem: { label: "What is the specific problem you are trying to solve?", placeholder: "One or two concrete sentences..." },
      options: { label: "What are at least two or three doors you could try?", placeholder: "1... 2... 3..." },
      plan: { label: "Which option looks most workable, and what is the first action?", placeholder: "I will try... First I need to..." }
    },
    keyLearning: "Problem solving is easier when you untangle one specific problem, create more than one option, try the best available step and treat the result as information."
  },

  "interpersonal-effectiveness": {
    title: "What Are You Trying to Protect in This Conversation?",
    description: "Before reaching for a communication technique, decide what matters most: the outcome, the relationship or your self-respect.",
    whyItMatters: "A difficult conversation gets confusing when you are trying to win the point, keep the person happy and protect your own boundary all at exactly the same time. Knowing the priority helps you choose how to respond.",
    sections: [
      {
        title: "Sometimes the main thing is the outcome",
        body: "You may need something concrete: ask for money to be repaid, say no to a request, change a roster, set a limit or make your position understood. In DBT this is called objective effectiveness, and DEAR MAN is the main structure used for it. The question is: ‘What am I actually asking for or saying no to?’"
      },
      {
        title: "Sometimes the relationship deserves more attention",
        body: "Maybe the immediate issue matters, but you also care deeply about staying connected. In that case the way you listen, acknowledge the other person's experience and manage your tone can matter a lot. DBT groups those ideas under GIVE. This does not mean agreeing with everything or sacrificing your boundary just to keep the peace."
      },
      {
        title: "Sometimes the biggest goal is respecting how you handled yourself",
        body: "There are conversations where getting your preferred outcome is not fully in your control. You can still choose whether you were fair, truthful and connected to your values, and whether you apologised because it was right rather than because you were scared of disagreement. DBT groups those reminders under FAST."
      },
      {
        title: "None of these skills gives you control over another person",
        body: "You can communicate clearly and the other person can still say no, misunderstand you or become upset. That does not automatically mean you used the skill badly. And if someone becomes threatening, violent or coercive, the goal changes from ‘communicate better’ to ‘protect safety and get support’."
      }
    ],
    check: {
      prompt: "If your biggest priority is keeping your self-respect while saying no, what should guide you most?",
      options: [
        { label: "Making sure the other person agrees with me.", feedback: "Agreement can be useful, but you cannot control it. Self-respect is about how you choose to behave." },
        { label: "Being fair, truthful and connected to my values and boundary.", correct: true, feedback: "That keeps the focus on what is actually yours to control in the conversation." },
        { label: "Making sure the other person never feels upset.", feedback: "You can be kind and respectful without taking responsibility for controlling somebody else's feelings." }
      ]
    },
    practiceTitle: "Know what you are protecting before you speak",
    practiceIntro: "Use a safe conversation or make one up. Pick one priority even if the others still matter.",
    practicePrompts: {
      situation: { label: "What do you need to communicate?", placeholder: "A request, refusal, boundary or disagreement..." },
      priority: { label: "What matters most here: the outcome, the relationship or how you respect yourself afterwards?", placeholder: "My main priority is... because..." }
    },
    keyLearning: "Before choosing a communication skill, know what you most want to protect: the outcome, the relationship or your self-respect. You can influence the conversation without controlling the other person."
  },

  "dear-man": {
    title: "Say What You Need Without Writing a Speech in Your Head",
    description: "DEAR MAN gives you a simple frame for a request, refusal or boundary when emotions make it hard to find the words.",
    whyItMatters: "A lot of difficult conversations go wrong before they begin because we either say nothing, rehearse fifty versions or unload everything at once. A structure can hold the important parts while you still sound like yourself.",
    sections: [
      {
        title: "DEAR is the message",
        body: "Describe the relevant facts, Express how the situation affects you, Assert the request or boundary clearly, then Reinforce the benefit when that makes sense. For example: ‘You have borrowed money three times this month. I feel uncomfortable being asked again. I am not lending any more money. It will be easier for us to spend time together if money is not part of it.’ Short and clear usually beats a ten-minute build-up."
      },
      {
        title: "MAN is how you stay with the message",
        body: "Mindful means come back to the main point when the conversation drifts. Appear confident does not mean pretending to be fearless; it can simply mean speaking steadily and not apologising for the sentence halfway through it. Negotiate means being open to workable alternatives where there is room, without negotiating away a boundary that genuinely needs to stay."
      },
      {
        title: "A communication script is never more important than safety",
        body: "If the other person starts threatening you, blocking your exit, intimidating you or becoming violent, do not keep repeating your point because the acronym says to stay mindful. The effective move may be to end the conversation, leave if you safely can and get support. A skill is meant to help you, not trap you in the interaction."
      }
    ],
    check: {
      prompt: "Which line is the clearest example of the Assert part?",
      options: [
        { label: "You should know why I am upset.", feedback: "That asks the other person to guess what you need rather than stating it clearly." },
        { label: "I am not able to lend you money. Please stop asking me today.", correct: true, feedback: "This says the boundary directly without requiring a long explanation or attack." },
        { label: "Maybe it would be nice if things were somehow different.", feedback: "That hints at a problem but does not clearly say what you are asking for or refusing." }
      ]
    },
    practiceTitle: "Write the short version",
    practiceIntro: "You do not need the perfect wording. Try to make the request or boundary clear enough that somebody would know what you mean.",
    practicePrompts: {
      dear: { label: "What happened, how does it affect you, and what are you asking for or saying no to?", placeholder: "The facts are... I feel/think... I am asking / I am not willing..." },
      man: { label: "What will help you stay on the point without becoming rigid?", placeholder: "Main point, tone, timing, setting, what is negotiable and what is not..." }
    },
    keyLearning: "DEAR MAN is scaffolding for a clear request or boundary. Use the structure to support your own voice, and leave the script behind if safety becomes the real issue."
  },

  "give-skill": {
    title: "Stay Connected Without Disappearing Yourself",
    description: "GIVE is about caring for the relationship while you communicate, without confusing kindness with giving up your own position.",
    whyItMatters: "You can be technically right and still make a conversation impossible to hear. You can also be so focused on keeping the peace that your own needs vanish. GIVE tries to find the space between those two extremes.",
    sections: [
      {
        title: "Gentle does not mean weak",
        body: "You can say ‘no’ gently. You can disagree without contempt. Gentleness means reducing the extra attacks, threats, sarcasm and name-calling that usually make the other person defend themselves before they can hear the point. It does not mean tolerating mistreatment or pretending you are okay with something you are not."
      },
      {
        title: "Interest means listen long enough to learn something",
        body: "It is easy to stop listening while the other person is speaking because you are busy preparing your next defence. Interest means giving enough attention to understand what they are actually saying before deciding how to respond. You can understand someone and still disagree with them."
      },
      {
        title: "Validation is not the same as agreement",
        body: "You might say ‘I can understand why that scared you’ without saying ‘everything you said about me is true’. Validation looks for the part of the other person's experience that makes sense. An Easy manner simply means bringing the temperature down where you can: a calmer tone, some warmth or appropriate humour if the moment allows it."
      },
      {
        title: "Some relationships are not made safer by better communication",
        body: "If someone is abusive, coercive or threatening, you do not owe them perfect validation or a softer tone. GIVE is for relationships where connection can be supported safely. Boundaries and distance are also relationship skills when the situation requires them."
      }
    ],
    check: {
      prompt: "What does validation mean in GIVE?",
      options: [
        { label: "Agree with everything the other person says so they feel heard.", feedback: "Validation can recognise a feeling or a point that makes sense without agreeing with every claim or giving up your own position." },
        { label: "Acknowledge what makes sense in their experience while keeping my own view and boundaries.", correct: true, feedback: "That is the balance: understanding is not surrender." },
        { label: "Take responsibility for making the other person feel better.", feedback: "You can influence the tone, but another person's emotions are not yours to control." }
      ]
    },
    practiceTitle: "Keep the connection without losing your point",
    practiceIntro: "Choose a safe relationship where you want the other person to feel heard and you still want room for your own view.",
    practicePrompts: {
      validate: { label: "What part of their experience could you honestly acknowledge?", placeholder: "I can see why... / It makes sense that..." },
      delivery: { label: "What would a gentler, more interested delivery look like without giving up your boundary?", placeholder: "Tone, timing, listening, warmth, less sarcasm..." }
    },
    keyLearning: "GIVE helps you protect connection through gentleness, interest and validation without asking you to agree with everything, erase your needs or stay in an unsafe interaction."
  },

  "fast-skill": {
    title: "Walk Away Respecting How You Handled Yourself",
    description: "FAST keeps your own values in the conversation when getting the outcome or keeping the peace starts pulling you away from them.",
    whyItMatters: "Sometimes you get what you wanted and still feel awful about how you got it. Other times you keep someone happy by saying yes when everything in you meant no. Self-respect effectiveness asks what you want to be able to live with after the conversation is over.",
    sections: [
      {
        title: "Fair means fair to you as well",
        body: "Being fair is not the same as splitting responsibility 50/50 every time. It means taking the facts, your legitimate needs and the other person's legitimate needs seriously. If someone crossed a boundary, fairness does not require inventing equal blame for yourself just to sound balanced."
      },
      {
        title: "Apologise for what is yours, not for existing",
        body: "A real apology can be powerful when you believe you have done something wrong. Automatic apologies are different: ‘sorry for asking’, ‘sorry for being upset’, ‘sorry for saying no’. FAST asks you to notice whether you are apologising because it is warranted or because disagreement makes you uncomfortable."
      },
      {
        title: "Stick to values and tell the truth without surrendering privacy",
        body: "Try not to exaggerate, pretend you are helpless or promise something you do not mean just to get through the conversation. At the same time, truthfulness does not mean everybody is entitled to every detail of your life. You can be honest and still say ‘I am not discussing that’ when privacy or safety matters."
      }
    ],
    check: {
      prompt: "Which response fits FAST best?",
      options: [
        { label: "Never apologise, because apologising means I lost the argument.", feedback: "A genuine apology can be completely consistent with self-respect. FAST is about avoiding unnecessary apologies, not all apologies." },
        { label: "Apologise when I believe it is warranted, but not simply for having a reasonable need, boundary or opinion.", correct: true, feedback: "That keeps accountability and self-respect together instead of choosing one over the other." },
        { label: "Tell the other person every private detail so I can say I was completely honest.", feedback: "Honesty does not remove your right to privacy or require unsafe disclosure." }
      ]
    },
    practiceTitle: "Think about how you want to feel about your own response afterwards",
    practiceIntro: "Use a safe conversation where your values or boundary could easily get lost in the pressure to keep the peace.",
    practicePrompts: {
      value: { label: "What value or boundary do you want to keep hold of?", placeholder: "Honesty, fairness, family, safety, respect, responsibility..." },
      fast: { label: "Where might you over-apologise, give in, exaggerate or hide your real position? What would a more self-respecting response sound like?", placeholder: "Instead of... I could say/do..." }
    },
    keyLearning: "FAST is about leaving the conversation able to respect your own behaviour: fair where fairness belongs, accountable where apology belongs, and truthful without giving away values, boundaries or privacy."
  },

  "personal-commitment-plan": {
    title: "Build the Plan You Will Actually Use",
    description: "Pull the most useful pieces of the Journey into a short plan for the next difficult day, not a perfect contract for the rest of your life.",
    whyItMatters: "Plans often fail because they were designed for the calm, motivated version of us. A useful plan is built for the day you are tired, embarrassed, broke, angry, lonely or tempted and still need something simple to reach for.",
    sections: [
      {
        title: "If the plan keeps failing in the same place, inspect the plan",
        body: "A good change plan usually needs several things working together: a direction you care about, useful skills, reasons that still matter on a bad day, practical resources or support, and clear actions. Think of a stool with several legs. If one leg is missing, trying harder to balance does not repair the stool. You look for the missing support and strengthen it.",
        bullets: ["Direction", "Skills", "Reasons that matter", "Resources and people", "Specific actions"]
      },
      {
        title: "A return to an old behaviour is information, not a reset button",
        body: "If an old behaviour happens again, the mind may say ‘see, nothing changed’. But you are not literally back at the first day with no knowledge. Ask what the moment taught you: Was there a trigger you underestimated? Easy access? No sleep? A support person you did not contact? A safeguard missing? A consequence that now needs repair? Use the event like a replay that helps you update the next version of the plan."
      },
      {
        title: "Make the environment do some of the work",
        body: "Willpower is much less reliable at 1am than it is while writing a plan. Decide what should be harder to access, what needs a boundary, who should know when you are struggling and which connections you want to repair or strengthen. A useful plan changes the environment around the decision instead of expecting your most stressed self to carry everything alone."
      }
    ],
    check: {
      prompt: "If the same part of your plan keeps breaking because a resource or support is missing, what is the most useful response?",
      options: [
        { label: "Use more willpower next time.", feedback: "Willpower changes with stress, sleep and circumstances. A repeated gap is planning information, not proof that you did not try hard enough." },
        { label: "Strengthen the missing part and test the next version of the plan.", correct: true, feedback: "That treats the plan as something you can learn from and improve instead of a one-shot test of your character." },
        { label: "Give up on the direction because a good plan should work the first time.", feedback: "Real plans usually need adjusting once they meet real life. Revision is part of planning, not evidence that the goal is impossible." }
      ]
    },
    practiceTitle: "Write the version you would want on a bad day",
    practiceIntro: "Keep it short enough that stressed-you could actually read it and know what to do first.",
    practicePrompts: {
      direction: { label: "What direction are you trying to keep moving toward, and why does it matter?", placeholder: "I want more... because..." },
      ingredients: { label: "Which few skills, safeguards, resources or people are most important when things get hard?", placeholder: "The things I am actually likely to use are..." },
      barrier: { label: "What is the pattern most likely to knock the plan off course, and what should happen first when you notice it?", placeholder: "When I notice... my first move is... and I can contact/use..." }
    },
    keyLearning: "A useful plan is built for real life, not your most motivated day. When something breaks down, update the weak part of the plan rather than turning the setback into a judgement about yourself."
  }
}

export function prepareRemainingJourneyModuleForSelfGuidedUse(module: JourneyModuleDefinition): JourneyModuleDefinition {
  const override = OVERRIDES[module.slug]
  if (!override) return module

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
