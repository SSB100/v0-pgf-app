const MODULE_IMAGES: Record<string, { src: string; alt: string }> = {
  "understanding-the-pattern": {
    src: "/images/journey/understanding-the-pattern.webp",
    alt: "A person reflecting on a repeating cycle of pressure, quick relief and later consequences.",
  },
  "motivation-for-change": {
    src: "/images/journey/motivation-for-change.webp",
    alt: "A person standing between a difficult familiar path and a brighter path forward.",
  },
  "chain-analysis": {
    src: "/images/journey/chain-analysis.webp",
    alt: "A sequence of connected moments showing how thoughts, feelings and actions can lead to different outcomes.",
  },
  "wellbeing-principles": {
    src: "/images/journey/wellbeing-principles.webp",
    alt: "A person moving through reflection, writing and everyday action as part of rebuilding wellbeing.",
  },
  "mindfulness-foundations": {
    src: "/images/journey/mindfulness-foundations.webp",
    alt: "A person sitting quietly and noticing thoughts and breathing without needing to chase the thoughts away.",
  },
  "understanding-your-mind": {
    src: "/images/journey/understanding-your-mind.webp",
    alt: "The same person shown in a storm of thoughts and in a calmer state with more space to think.",
  },
  "grounding-and-urge-surfing": {
    src: "/images/journey/grounding-and-urge-surfing.webp",
    alt: "Grounding, breathing and riding a wave used as visual metaphors for staying steady through an urge.",
  },
  "building-awareness": {
    src: "/images/journey/building-awareness.webp",
    alt: "A person noticing several different emotions and inner experiences while reflecting in a journal.",
  },
  "recognizing-triggers": {
    src: "/images/journey/recognizing-triggers.webp",
    alt: "A person reflecting on possible triggers including conflict, notifications, money pressure, tiredness and isolation.",
  },
  "choice-points": {
    src: "/images/journey/choice-points.webp",
    alt: "A person at a fork between a darker familiar path and a brighter path toward connection and growth.",
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
          width={1200}
          height={675}
          loading="eager"
        />
      </div>
    </figure>
  )
}
