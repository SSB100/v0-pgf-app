import { CheckCircle2 } from "lucide-react"

function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+(?=[A-Z‘“])/)
    .map((part) => part.trim())
    .filter(Boolean)
}

function readableParagraphs(content: string): string[] {
  const explicit = content
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean)

  return explicit.flatMap((paragraph) => {
    if (paragraph.length < 360) return [paragraph]

    const sentences = splitSentences(paragraph)
    if (sentences.length < 3) return [paragraph]

    const chunks: string[] = []
    let current = ""

    for (const sentence of sentences) {
      const next = current ? `${current} ${sentence}` : sentence
      if (current && next.length > 300) {
        chunks.push(current)
        current = sentence
      } else {
        current = next
      }
    }

    if (current) chunks.push(current)
    return chunks
  })
}

export default function JourneyFormattedContent({
  content,
  bullets = [],
}: {
  content: string
  bullets?: string[]
}) {
  const paragraphs = readableParagraphs(content)

  return (
    <div className="space-y-5">
      <div className="space-y-4">
        {paragraphs.map((paragraph, index) => (
          <p
            key={`${index}-${paragraph.slice(0, 24)}`}
            className="text-[15px] sm:text-base leading-7 text-foreground/88 text-pretty"
          >
            {paragraph}
          </p>
        ))}
      </div>

      {bullets.length > 0 && (
        <ul className="space-y-2.5 rounded-xl border border-border/60 bg-secondary/25 p-4 text-sm sm:text-[15px] text-foreground/82">
          {bullets.map((bullet) => (
            <li key={bullet} className="flex items-start gap-2.5 leading-6">
              <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
