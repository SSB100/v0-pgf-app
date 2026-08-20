import type { JourneyModuleDefinition, JourneySection } from "@/lib/journey-curriculum"

function keep(module: JourneyModuleDefinition, index: number): JourneySection {
  return module.sections[index]
}

function section(title: string, body: string, bullets?: string[]): JourneySection {
  return { title, body, ...(bullets ? { bullets } : {}) }
}

/**
 * The Journey should not feel like 27 copies of one lesson template.
 *
 * The presentation layer gives every module a peer-support voice. This layer
 * decides how much room a concept actually needs. Straightforward ideas stay
 * short; denser skills get extra teaching steps so important distinctions are
 * not compressed just to keep every module the same length.
 */
export function prepareJourneyModuleForFlexibleDepth(
  module: JourneyModuleDefinition,
): JourneyModuleDefinition {
  switch (module.slug) {
    case "chain-analysis":
      return {
        ...module,
        estimatedMinutes: Math.max(module.estimatedMinutes, 12),
        sections: [
          keep(module, 0),
          keep(module, 1),
          section(
            "Separate what happened straight away from what happened later",
            "A behaviour can look helpful if you only stop the replay at the first few seconds. The deposit can bring relief. Walking out of the conversation can stop the argument. Drinking can quiet the noise for a while. Then the later part arrives: lost money, another argument, shame, a hangover, isolation or a harder problem tomorrow. Put both parts in the chain. Otherwise your brain is comparing the immediate payoff with an invisible future cost.",
            ["Immediate result: what changed in the first few minutes?", "Later result: what showed up afterwards?"],
          ),
          keep(module, 2),
        ],
      }

    case "wellbeing-principles":
      return {
        ...module,
        estimatedMinutes: Math.max(module.estimatedMinutes, 11),
        sections: [
          keep(module, 0),
          section(
            "You do not have to rebuild every part of life at once",
            "A wellbeing list can become another overwhelming checklist if every area looks urgent. Instead, scan for the part that would make the rest of life a little easier if it became more solid. For one person that might be sleep or money stability. For another it could be connection, purpose, movement, creativity or getting some choice back. Think foundation before renovation: strengthen one part that helps the rest carry weight.",
            ["Safety and stability", "Connection and belonging", "Health and energy", "Meaning, learning and contribution", "Choice, identity and creativity"],
          ),
          keep(module, 1),
          keep(module, 2),
        ],
      }

    case "understanding-your-mind":
      return {
        ...module,
        estimatedMinutes: Math.max(module.estimatedMinutes, 10),
        sections: [
          keep(module, 0),
          keep(module, 1),
          keep(module, 2),
          section(
            "‘Wise’ does not mean calm, certain or always right",
            "The name can sound as if there is a superior version of you who always knows the answer. That is not the point. You can still be upset, unsure or angry and make a Wise Mind choice. It simply means more of the information is in the room: what you feel, what you know, what matters to you and what the situation realistically allows. Sometimes the wisest answer is still ‘I do not know yet, so I am going to wait’."
          ),
        ],
      }

    case "grounding-and-urge-surfing":
      return {
        ...module,
        estimatedMinutes: Math.max(module.estimatedMinutes, 14),
        sections: [
          keep(module, 0),
          section(
            "Breath can be an anchor, not a command to calm down",
            "Breathing slowly can give your attention a simple rhythm to return to. You are not trying to force a feeling away. Try making the out-breath a little longer than the in-breath, or simply count a few ordinary breaths. If focusing on breathing makes you more panicky, dizzy or trapped in your body, stop and use external grounding instead. The useful skill is choosing an anchor that helps, not proving you can tolerate one that does not.",
          ),
          keep(module, 1),
          keep(module, 2),
          section(
            "Choose the tool that fits the moment",
            "Grounding, breathing, RAIN and urge surfing are not four boxes you need to complete. If your head feels crowded, look outward. If the body is revved up and breath feels okay, use a few slower breaths. If an emotion needs gentle attention, RAIN may help. If the main problem is an urge, watch it like a wave and add practical distance from the behaviour. If inward attention makes distress worse, go back outside yourself: feet on the floor, name objects, move rooms, contact someone or use a safeguard."
          ),
        ],
      }

    case "understanding-emotions":
      return {
        ...module,
        estimatedMinutes: Math.max(module.estimatedMinutes, 10),
        sections: [
          keep(module, 0),
          section(
            "A more precise name can change what you do next",
            "‘Bad’ can hide very different experiences. Are you disappointed, ashamed, lonely, threatened, jealous, guilty, frustrated or grieving? You do not need a perfect label, but getting closer can help. Shame may need connection and self-compassion. Guilt may point toward repair. Fear may need a safety check. Anger may need a boundary or a pause. Naming the emotion is a bit like finding the right folder instead of throwing every difficult feeling into one drawer marked ‘awful’."
          ),
          keep(module, 1),
          keep(module, 2),
        ],
      }

    case "check-the-facts":
      return {
        ...module,
        estimatedMinutes: Math.max(module.estimatedMinutes, 11),
        sections: [
          keep(module, 0),
          section(
            "Watch for the shortcuts your mind uses under pressure",
            "A stressed brain likes fast conclusions. It may mind-read (‘I know what they think’), forecast (‘this will definitely go badly’), catastrophise (‘this ruins everything’), turn one event into a rule (‘this always happens’) or use the feeling itself as proof (‘I feel rejected, so I must have been rejected’). These shortcuts are not signs that your brain is broken. They are reasons to slow the conclusion down and check what evidence is actually there.",
            ["Mind-reading", "Forecasting", "Catastrophising", "All-or-nothing thinking", "Treating a feeling as proof"],
          ),
          keep(module, 1),
          keep(module, 2),
        ],
      }

    case "abc-please":
      return {
        ...module,
        estimatedMinutes: Math.max(module.estimatedMinutes, 13),
        sections: [
          keep(module, 0),
          section(
            "Body care is not a self-discipline contest",
            "PLEASE is a reminder to notice physical factors, not a demand for perfect sleep, food and exercise. Health conditions, medication, withdrawal, pain and exhaustion can all change what your nervous system has available. Do not change prescribed medication from an app lesson, and do not abruptly stop alcohol or other substances if withdrawal could be medically risky. If one of those areas applies, the useful next step may be professional support rather than trying harder on your own."
          ),
          keep(module, 1),
          keep(module, 2),
          section(
            "Pick the lever with the best chance of helping this week",
            "You may notice five things that could be better. Choose one lever, not five promises. Maybe the highest-value move is eating before the evening urge window, getting to bed half an hour earlier, booking the GP appointment or putting one enjoyable activity back into Saturday. Small changes are easier to repeat, and repeating them gives you better information than attempting a complete lifestyle reset for three days."
          ),
        ],
      }

    case "coping-ahead":
      return {
        ...module,
        estimatedMinutes: Math.max(module.estimatedMinutes, 10),
        sections: [
          keep(module, 0),
          keep(module, 1),
          section(
            "Rehearse the wobble as well as the plan",
            "A perfect mental movie is not very useful if real life never follows the script. Picture the urge arriving, the other person being difficult or your motivation dropping. Then picture yourself noticing that wobble and returning to the first or backup step. The rehearsal is not ‘everything goes well’. It is ‘something gets hard and I still know what I want to try next’."
          ),
          keep(module, 2),
        ],
      }

    case "stop-skill":
      return {
        ...module,
        estimatedMinutes: Math.max(module.estimatedMinutes, 11),
        sections: [
          keep(module, 0),
          section(
            "TIP is a menu of body-based options, not one compulsory technique",
            "Temperature change, brief intense movement, paced breathing and muscle relaxation can each shift body activation for some people. Pick what is appropriate for your body and situation. Cold exposure and intense exercise are not suitable for everyone, and pain or medical symptoms should not be treated as a distress-tolerance exercise. A slow walk, sitting down, paced breathing or simply leaving the triggering environment may be the better option."
          ),
          keep(module, 2),
          section(
            "If the pause is not enough, bring in another layer",
            "STOP is often the first move, not the whole plan. Once you have interrupted momentum, the next layer may be a safeguard, support person, grounding skill, problem-solving step or leaving the situation. Think of STOP as pulling the handbrake. After the car has stopped moving, you still choose where to go from there."
          ),
        ],
      }

    case "accepts-improve":
      return {
        ...module,
        estimatedMinutes: Math.max(module.estimatedMinutes, 13),
        sections: [
          keep(module, 0),
          section(
            "Do not try to memorise every letter in a crisis",
            "The acronyms are menus, not exams. Build a short personal list while things are relatively calm: two activities that absorb you, one person you can help or contact, one safe sensation, one show or playlist, one place you can take a short break. When distress is high, choosing from a list you already made is much easier than remembering a seven-letter skill perfectly."
          ),
          keep(module, 1),
          section(
            "Planning belongs here because it can shrink the next problem",
            "In the version of IMPROVE used in this Journey, P is Planning. That can be as small as writing tomorrow's first phone call, deciding where you will sleep tonight or putting the document you need beside the door. Planning does not solve the whole situation; it reassures your brain that the problem has somewhere to go besides circling in your head all night."
          ),
          keep(module, 2),
        ],
      }

    case "reality-acceptance":
      return {
        ...module,
        estimatedMinutes: Math.max(module.estimatedMinutes, 13),
        sections: [
          keep(module, 0),
          section(
            "Pain and the fight with pain are not always the same thing",
            "You can be hurt by a loss, betrayal, consequence or diagnosis and then spend another layer of energy on ‘this cannot be happening’, ‘it should be different’ or ‘I refuse to accept this’. That second struggle is understandable, especially early on. Reality acceptance asks whether some of that energy could eventually move toward protection, repair, grief, support or the next decision instead. It does not ask you to stop caring about what happened."
          ),
          keep(module, 1),
          keep(module, 2),
          section(
            "Acceptance is allowed to be unfinished",
            "Some realities need to be accepted many times. You may manage it for an hour and then start arguing with it again. That is not proof you failed the skill. Turning the mind is the repetition: notice the argument, name the fact again, and return to what is still in your control. On a very hard day, that may be the only step you take."
          ),
        ],
      }

    case "problem-solving":
      return {
        ...module,
        estimatedMinutes: Math.max(module.estimatedMinutes, 12),
        sections: [
          keep(module, 0),
          section(
            "First check that this is a problem you can act on",
            "Problem solving is for something changeable. If the issue is ‘I wish the past had not happened’, there may be no practical solution to that fact today and an acceptance skill may fit better. If the issue is ‘I need to tell the landlord I cannot make the full payment Friday’, that has actions available. Matching the tool to the problem stops you trying to solve the unsolvable or accept something that actually needs action."
          ),
          keep(module, 1),
          section(
            "Compare options with the life you actually have",
            "The technically best idea is useless if you cannot afford it, access it or safely do it. Compare options using real constraints: safety, time, money, support, likely consequences and your values. You are looking for the best available next move, not the answer a person with unlimited resources would choose."
          ),
          keep(module, 2),
        ],
      }

    case "dear-man":
      return {
        ...module,
        estimatedMinutes: Math.max(module.estimatedMinutes, 12),
        sections: [
          keep(module, 0),
          section(
            "A short example can be clearer than remembering the acronym",
            "Imagine you need your flatmate to stop using your card. Describe: ‘My card was used twice this week without asking.’ Express: ‘That makes me anxious and angry.’ Assert: ‘Do not use my card again.’ Reinforce: ‘It will make it much easier for us to live together without money becoming a fight.’ The exact words are not sacred. The structure helps you remove the guessing."
          ),
          keep(module, 1),
          section(
            "Negotiate the parts that are negotiable, not the boundary itself",
            "If the goal is flexible, you might negotiate timing, method or a middle ground. ‘I cannot lend $300, but I can help you call the budgeting service’ is negotiation. If the boundary is about safety, consent or something you genuinely are not willing to do, you do not owe a compromise just because the N stands for Negotiate."
          ),
          keep(module, 2),
        ],
      }

    case "personal-commitment-plan":
      return {
        ...module,
        estimatedMinutes: Math.max(module.estimatedMinutes, 15),
        sections: [
          keep(module, 0),
          section(
            "Build the plan for the version of you who will actually need it",
            "Plans are often written by calm, motivated-you and then handed to stressed, ashamed or exhausted-you. Make it easier for that person. Use plain language. Put important numbers somewhere obvious. Decide what happens to money before an urge. Name the person you will contact, not ‘reach out’. Choose the first skill, not ‘use coping strategies’. A good plan reduces thinking at the moment when thinking is hardest."
          ),
          keep(module, 1),
          section(
            "Add an early-warning layer before the crisis layer",
            "Notice the signs that usually appear before things are at their worst: sleeping less, hiding transactions, cancelling plans, obsessively checking something, isolating, feeling unusually hopeless or dropping routines. The earlier layer might need a smaller response: tell someone, tighten a safeguard, book an appointment, reduce access or revisit a module. You do not need to wait until the situation is severe before using the plan."
          ),
          keep(module, 2),
        ],
      }

    default:
      return module
  }
}
