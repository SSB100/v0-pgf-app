const MODULE_IMAGES: Record<string, { src: string; alt: string }> = {
  "understanding-the-pattern": {
    src: "/images/journey/understanding-the-pattern.svg",
    alt: "A person reflecting on a repeating cycle of pressure, quick relief and later consequences.",
  },
  "motivation-for-change": {
    src: "/images/journey/motivation-for-change.svg",
    alt: "A person standing between a difficult familiar path and a brighter path forward.",
  },
  "chain-analysis": {
    src: "/images/journey/chain-analysis.svg",
    alt: "A sequence of connected moments showing how thoughts, feelings and actions can lead to different outcomes.",
  },
  "wellbeing-principles": {
    src: "/images/journey/wellbeing-principles.svg",
    alt: "A person moving through reflection, writing and everyday action as part of rebuilding wellbeing.",
  },
  "mindfulness-foundations": {
    src: "/images/journey/mindfulness-foundations.svg",
    alt: "A person sitting quietly and noticing thoughts and breathing without needing to chase the thoughts away.",
  },
  "understanding-your-mind": {
    src: "/images/journey/understanding-your-mind.svg",
    alt: "The same person shown in a storm of thoughts and in a calmer state with more space to think.",
  },
  "grounding-and-urge-surfing": {
    src: "/images/journey/grounding-and-urge-surfing.svg",
    alt: "Grounding, breathing and riding a wave used as visual metaphors for staying steady through an urge.",
  },
  "building-awareness": {
    src: "/images/journey/building-awareness.svg",
    alt: "A person noticing several different emotions and inner experiences while reflecting in a journal.",
  },
  "recognizing-triggers": {
    src: "/images/journey/recognizing-triggers.svg",
    alt: "A person reflecting on possible triggers including conflict, notifications, money pressure, tiredness and isolation.",
  },
  "choice-points": {
    src: "/images/journey/choice-points.svg",
    alt: "A person at a fork between a darker familiar path and a brighter path toward connection and growth.",
  },
  "understanding-emotions": {
    src: "/images/journey/understanding-emotions.svg",
    alt: "A person calmly noticing several different emotions as signals around them rather than commands they must follow.",
  },
  "check-the-facts": {
    src: "/images/journey/check-the-facts.svg",
    alt: "A camera represents what can be observed while a thought cloud represents the story the mind may add.",
  },
  "opposite-action": {
    src: "/images/journey/opposite-action.svg",
    alt: "A strong pull points one way while a person takes a small deliberate step toward a more helpful direction.",
  },
  "abc-please": {
    src: "/images/journey/abc-please.svg",
    alt: "A rechargeable battery is supported by symbols for sleep, food, movement and connection.",
  },
  "coping-ahead": {
    src: "/images/journey/coping-ahead.svg",
    alt: "A person stands prepared beneath an umbrella before a storm with a practical coping kit nearby.",
  },
  "discovering-values": {
    src: "/images/journey/discovering-values.svg",
    alt: "A compass is surrounded by symbols of connection, growth, self-respect and meaningful direction.",
  },
  "recognizing-strengths": {
    src: "/images/journey/recognizing-strengths.svg",
    alt: "A person looks back over difficult terrain while carrying strengths and tools they have already built.",
  },
  "values-to-action": {
    src: "/images/journey/values-to-action.svg",
    alt: "A compass leads into a path of small stepping stones toward a growing tree.",
  },
  "stop-skill": {
    src: "/images/journey/stop-skill.svg",
    alt: "A person pauses inside a calm space before choosing between two possible next actions.",
  },
  "accepts-improve": {
    src: "/images/journey/accepts-improve.svg",
    alt: "An open coping toolbox contains several different ways to get through a difficult period.",
  },
}

export default function JourneyModuleHeroImage({ moduleSlug }: { moduleSlug: string }) {
  const image = MODULE_IMAGES[moduleSlug]
  if (!image) return null

  return (
    <figure className="overflow-hidden rounded-2xl border border-border/60 bg-secondary/20 shadow-sm">
      <div className="aspect-[16/9] w-full overflow-hidden">
        <img
          src={image.src}
          alt={image.alt}
          className="h-full w-full object-cover"
          width={640}
          height={360}
          loading="eager"
        />
      </div>
    </figure>
  )
}
