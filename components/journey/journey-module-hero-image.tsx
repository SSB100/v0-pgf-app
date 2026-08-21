"use client"

import { useEffect, useState } from "react"

type StaticModuleImage = {
  src: string
  alt: string
}

type GeneratedModuleImage = {
  alt: string
  x: string
  y: string
}

const STATIC_MODULE_IMAGES: Record<string, StaticModuleImage> = {
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
}

const GENERATED_MODULE_IMAGES: Record<string, GeneratedModuleImage> = {
  "understanding-emotions": {
    x: "0%",
    y: "0%",
    alt: "A person noticing several different emotions with curiosity while reflecting in a journal.",
  },
  "check-the-facts": {
    x: "25%",
    y: "0%",
    alt: "A person looking closely at what happened while separating confusing thoughts from clearer observations.",
  },
  "opposite-action": {
    x: "50%",
    y: "0%",
    alt: "A person choosing a brighter path instead of following a familiar difficult pull.",
  },
  "abc-please": {
    x: "75%",
    y: "0%",
    alt: "A battery surrounded by sleep, food, movement, rest and health supports that can help restore capacity.",
  },
  "coping-ahead": {
    x: "100%",
    y: "0%",
    alt: "A person carrying an umbrella and practical supplies while preparing to move from stormy weather toward clearer skies.",
  },
  "discovering-values": {
    x: "0%",
    y: "33.333333%",
    alt: "A person holding a compass while considering meaningful parts of life such as connection, growth and creativity.",
  },
  "recognizing-strengths": {
    x: "25%",
    y: "33.333333%",
    alt: "A person noticing past experiences and abilities that have helped them move forward.",
  },
  "values-to-action": {
    x: "50%",
    y: "33.333333%",
    alt: "A person following small stepping stones from a compass toward a meaningful destination.",
  },
  "stop-skill": {
    x: "75%",
    y: "33.333333%",
    alt: "A person pausing calmly before moving from a stressful moment toward a clearer next step.",
  },
  "accepts-improve": {
    x: "100%",
    y: "33.333333%",
    alt: "A practical comfort toolkit sits between a difficult moment and a calmer one, showing different ways to get through a rough period.",
  },
  "reality-acceptance": {
    x: "0%",
    y: "66.666667%",
    alt: "A person stands with the rain that is already falling while a brighter path remains visible ahead.",
  },
  "problem-solving": {
    x: "25%",
    y: "66.666667%",
    alt: "A person untangles one strand from a confusing knot while a clearer path appears ahead.",
  },
  "interpersonal-effectiveness": {
    x: "50%",
    y: "66.666667%",
    alt: "A person considers relationship, self-respect and what they want from a conversation before deciding how to respond.",
  },
  "dear-man": {
    x: "75%",
    y: "66.666667%",
    alt: "Two people have a clear, structured conversation while simple visual cues show listening, meaning and agreement.",
  },
  "give-skill": {
    x: "100%",
    y: "66.666667%",
    alt: "Two people stay warmly connected during a thoughtful conversation.",
  },
  "fast-skill": {
    x: "0%",
    y: "100%",
    alt: "A person stands protected by their values and self-respect while leaving an unhelpful argument behind.",
  },
  "personal-commitment-plan": {
    x: "25%",
    y: "100%",
    alt: "A person follows a planned path of practical steps, support and meaningful actions toward a steadier future.",
  },
}

const GENERATED_SPRITE_PARTS = [
  "/images/journey/generated-11-27-part-1.b64",
  "/images/journey/generated-11-27-part-2.b64",
  "/images/journey/generated-11-27-part-3.b64",
]

let generatedSpritePromise: Promise<string> | null = null

function loadGeneratedSprite() {
  if (!generatedSpritePromise) {
    generatedSpritePromise = Promise.all(
      GENERATED_SPRITE_PARTS.map(async (src) => {
        const response = await fetch(src, { cache: "force-cache" })
        if (!response.ok) {
          throw new Error(`Could not load Journey artwork: ${src}`)
        }
        return (await response.text()).trim()
      }),
    ).then((parts) => `data:image/webp;base64,${parts.join("")}`)
  }

  return generatedSpritePromise
}

export default function JourneyModuleHeroImage({ moduleSlug }: { moduleSlug: string }) {
  const staticImage = STATIC_MODULE_IMAGES[moduleSlug]
  const generatedImage = GENERATED_MODULE_IMAGES[moduleSlug]
  const [spriteUrl, setSpriteUrl] = useState<string | null>(null)
  const [spriteFailed, setSpriteFailed] = useState(false)

  useEffect(() => {
    if (!generatedImage) return

    let cancelled = false
    setSpriteUrl(null)
    setSpriteFailed(false)

    loadGeneratedSprite()
      .then((url) => {
        if (!cancelled) setSpriteUrl(url)
      })
      .catch(() => {
        if (!cancelled) setSpriteFailed(true)
      })

    return () => {
      cancelled = true
    }
  }, [generatedImage, moduleSlug])

  if (!staticImage && !generatedImage) return null

  return (
    <figure className="overflow-hidden rounded-2xl border border-border/60 bg-secondary/20 shadow-sm">
      <div className="aspect-[16/9] w-full overflow-hidden">
        {staticImage ? (
          <img
            src={staticImage.src}
            alt={staticImage.alt}
            className="h-full w-full object-cover"
            width={640}
            height={360}
            loading="eager"
          />
        ) : spriteUrl && generatedImage ? (
          <div
            role="img"
            aria-label={generatedImage.alt}
            className="h-full w-full bg-no-repeat"
            style={{
              backgroundImage: `url(${spriteUrl})`,
              backgroundPosition: `${generatedImage.x} ${generatedImage.y}`,
              backgroundSize: "500% 400%",
            }}
          />
        ) : spriteFailed ? (
          <img
            src={`/images/journey/${moduleSlug}.svg`}
            alt={generatedImage?.alt ?? "Journey module illustration"}
            className="h-full w-full object-cover"
            width={640}
            height={360}
            loading="eager"
          />
        ) : (
          <div className="h-full w-full animate-pulse bg-secondary/40" aria-hidden="true" />
        )}
      </div>
    </figure>
  )
}
