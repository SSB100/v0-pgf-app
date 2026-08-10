export function getAddictionTerms(journeyTypes: string[]) {
  const hasGambling = journeyTypes.includes("gambling")
  const hasAlcohol = journeyTypes.includes("alcohol")
  const hasSubstances = journeyTypes.includes("substances")
  const hasGaming = journeyTypes.includes("gaming")
  const hasMentalHealth = journeyTypes.includes("mental_health")
  const hasPersonalGrowth = journeyTypes.includes("personal_growth")

  // Determine primary addiction term
  let addictionTerm = "your challenges"
  let verb = "engage in unhealthy behaviors"
  let verbIng = "engaging in unhealthy behaviors"
  let pastVerb = "engaged in unhealthy behaviors"

  if (hasGambling) {
    addictionTerm = "gambling"
    verb = "gamble"
    verbIng = "gambling"
    pastVerb = "gambled"
  } else if (hasAlcohol) {
    addictionTerm = "drinking"
    verb = "drink"
    verbIng = "drinking"
    pastVerb = "drank"
  } else if (hasSubstances) {
    addictionTerm = "using"
    verb = "use"
    verbIng = "using"
    pastVerb = "used"
  } else if (hasGaming) {
    addictionTerm = "gaming"
    verb = "game excessively"
    verbIng = "gaming excessively"
    pastVerb = "gamed excessively"
  }

  return { addictionTerm, verb, verbIng, pastVerb }
}

export function getRelevantExamples(
  journeyTypes: string[],
  exampleType: "triggers" | "urges" | "emotions" | "distress",
) {
  const examples: { [key: string]: string[] } = {
    triggers: [],
    urges: [],
    emotions: [],
    distress: [],
  }

  if (journeyTypes.includes("gambling")) {
    examples.triggers.push("Seeing gambling ads", "Having money available", "Watching sports", "Financial stress")
    examples.urges.push('"I can win it back"', '"Just one more bet"', "Excitement and restlessness")
    examples.emotions.push("Anxiety about bills", "Anger after losing", "Boredom and emptiness")
    examples.distress.push("Lost money and feeling desperate", "Chasing losses", "Lying about finances")
  }

  if (journeyTypes.includes("alcohol")) {
    examples.triggers.push("Social events", "Stress from work", "Seeing others drink", "Certain times of day")
    examples.urges.push('"Just one drink"', '"I deserve this after a hard day"', "Craving the taste and feeling")
    examples.emotions.push("Stress and tension", "Social anxiety", "Loneliness at night")
    examples.distress.push("Waking up with regret", "Missing work or events", "Hiding drinking from others")
  }

  if (journeyTypes.includes("substances")) {
    examples.triggers.push("Certain people or places", "Emotional pain", "Physical discomfort", "Old habits")
    examples.urges.push('"I need to feel better"', '"It will help me relax"', "Physical cravings")
    examples.emotions.push("Overwhelming sadness", "Physical pain", "Feeling disconnected")
    examples.distress.push("Withdrawal symptoms", "Legal or health consequences", "Damaged relationships")
  }

  if (journeyTypes.includes("gaming")) {
    examples.triggers.push(
      "Boredom or free time",
      "Avoiding responsibilities",
      "Online friends playing",
      "New game releases",
    )
    examples.urges.push('"Just one more level"', '"I need to check in"', "FOMO (fear of missing out)")
    examples.emotions.push("Anxiety about real-world tasks", "Depression and isolation", "Frustration when not playing")
    examples.distress.push("Neglecting work or relationships", "Physical health issues", "Sleep deprivation")
  }

  if (journeyTypes.includes("mental_health") || journeyTypes.includes("personal_growth")) {
    examples.triggers.push(
      "Stress and overwhelm",
      "Difficult emotions",
      "Past trauma reminders",
      "Unhealthy thought patterns",
    )
    examples.urges.push("Avoidance and escape", "Negative coping mechanisms", "Isolation and withdrawal")
    examples.emotions.push("Anxiety and worry", "Depression and hopelessness", "Anger and frustration")
    examples.distress.push("Emotional overwhelm", "Difficulty functioning", "Strained relationships")
  }

  return examples
}

export function generatePersonalizedContent(
  journeyTypes: string[],
  contentType: "intro" | "examples" | "encouragement",
) {
  const terms = getAddictionTerms(journeyTypes)
  const examples = getRelevantExamples(journeyTypes, "triggers")

  const content: { [key: string]: string } = {}

  if (contentType === "intro") {
    content.text = `Urges to ${terms.verb} are uncomfortable, but they're not dangerous. They feel intense, but they won't last forever. Most urges peak within 15-20 minutes and then start to fade—if you don't act on them.`
  } else if (contentType === "examples") {
    content.text = `Common triggers for ${terms.addictionTerm}: ${examples.triggers.slice(0, 4).join(", ")}`
  } else if (contentType === "encouragement") {
    content.text = `Every time you ride out an urge to ${terms.verb} without acting on it, you're rewiring your brain and proving to yourself that you're stronger than the urge.`
  }

  return content
}
