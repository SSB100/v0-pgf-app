import {
  ArrowRight,
  BatteryCharging,
  Camera,
  Compass,
  Flame,
  GitFork,
  MapPin,
  MessageCircle,
  Route,
  Scale,
  Shield,
  Sparkles,
  Umbrella,
  Waves,
  Wind,
  Wrench,
} from "lucide-react"

type VisualKind =
  | "pattern-cycle"
  | "chain"
  | "rebuild"
  | "three-minds"
  | "wave"
  | "spark"
  | "fork"
  | "emotion-signal"
  | "camera"
  | "battery"
  | "umbrella"
  | "handbrake"
  | "toolbox"
  | "map"
  | "knot"
  | "conversation"
  | "path"

const VISUALS: Record<string, Record<number, VisualKind>> = {
  "understanding-the-pattern": { 1: "pattern-cycle" },
  "chain-analysis": { 1: "chain", 3: "chain" },
  "wellbeing-principles": { 0: "rebuild", 2: "map" },
  "understanding-your-mind": { 2: "three-minds" },
  "grounding-and-urge-surfing": { 0: "wave", 2: "wave" },
  "recognizing-triggers": { 0: "spark", 1: "spark" },
  "choice-points": { 1: "fork" },
  "understanding-emotions": { 2: "emotion-signal" },
  "check-the-facts": { 2: "camera" },
  "abc-please": { 0: "battery" },
  "coping-ahead": { 0: "umbrella" },
  "discovering-values": { 0: "path" },
  "stop-skill": { 0: "handbrake" },
  "accepts-improve": { 0: "toolbox", 2: "toolbox" },
  "reality-acceptance": { 0: "map" },
  "problem-solving": { 0: "knot" },
  "interpersonal-effectiveness": { 0: "conversation" },
  "dear-man": { 1: "conversation" },
  "personal-commitment-plan": { 1: "path" },
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border/70 bg-background/85 px-3 py-2 text-center text-xs font-semibold text-foreground shadow-sm">
      {children}
    </div>
  )
}

function Arrow() {
  return <ArrowRight className="size-4 shrink-0 text-primary" aria-hidden="true" />
}

function Frame({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <figure className="overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/8 via-background to-secondary/25 p-4 sm:p-5">
      <div className="mb-3 flex items-center gap-2">
        <Sparkles className="size-4 text-primary" aria-hidden="true" />
        <figcaption className="text-xs font-bold uppercase tracking-[0.14em] text-primary">{label}</figcaption>
      </div>
      {children}
    </figure>
  )
}

function Visual({ kind }: { kind: VisualKind }) {
  if (kind === "pattern-cycle") {
    return (
      <Frame label="The short-term loop">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Pill>Pressure or trigger</Pill><Arrow /><Pill>Quick relief</Pill><Arrow /><Pill>Later cost</Pill><Arrow /><Pill>More pressure</Pill>
        </div>
      </Frame>
    )
  }

  if (kind === "chain") {
    return (
      <Frame label="Slow the chain down">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {["What made it harder", "What set it off", "Thought + feeling", "Urge + action"].map((item, index) => (
            <div key={item} className="relative rounded-xl border border-border/70 bg-background/85 p-3 text-center text-xs font-semibold">
              <span className="mb-1 block text-[10px] font-bold text-primary">{index + 1}</span>{item}
            </div>
          ))}
        </div>
        <div className="mt-3 rounded-xl border border-primary/20 bg-primary/5 p-3 text-center text-xs text-muted-foreground">
          Every link is another place where support, a safeguard or a different action could enter.
        </div>
      </Frame>
    )
  }

  if (kind === "rebuild") {
    return (
      <Frame label="Rebuilding around the problem">
        <div className="grid grid-cols-3 gap-2">
          {["Stability", "Connection", "Meaning", "Health", "Choice", "Activity"].map((item) => (
            <div key={item} className="rounded-xl border border-border/70 bg-background/85 px-2 py-3 text-center text-[11px] font-semibold">{item}</div>
          ))}
        </div>
        <p className="mt-3 text-center text-xs text-muted-foreground">You do not need to strengthen every block at once.</p>
      </Frame>
    )
  }

  if (kind === "three-minds") {
    return (
      <Frame label="More information in the room">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-xl border border-border/70 bg-background/85 p-3"><Flame className="mx-auto size-5 text-primary" /><p className="mt-2 text-xs font-semibold">Feeling</p></div>
          <div className="rounded-xl border border-primary/30 bg-primary/8 p-3"><Scale className="mx-auto size-5 text-primary" /><p className="mt-2 text-xs font-semibold">Both together</p></div>
          <div className="rounded-xl border border-border/70 bg-background/85 p-3"><Route className="mx-auto size-5 text-primary" /><p className="mt-2 text-xs font-semibold">Facts + practical info</p></div>
        </div>
      </Frame>
    )
  }

  if (kind === "wave") {
    return (
      <Frame label="An urge can move without becoming an action">
        <div className="relative h-28 overflow-hidden rounded-xl border border-border/70 bg-background/80">
          <div className="absolute inset-x-0 bottom-2 flex items-end justify-around gap-1 px-4">
            {[2, 4, 7, 10, 7, 5, 3].map((height, index) => (
              <div key={index} className="w-6 rounded-t-full bg-primary/25" style={{ height: `${height * 7}px` }} />
            ))}
          </div>
          <Waves className="absolute right-3 top-3 size-6 text-primary" />
          <p className="absolute left-3 top-3 text-xs font-semibold text-foreground">Notice the rise, peak and change</p>
        </div>
      </Frame>
    )
  }

  if (kind === "spark") {
    return (
      <Frame label="Spark and conditions">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <div className="rounded-xl border border-border/70 bg-background/85 p-3 text-center"><Flame className="mx-auto size-6 text-primary" /><p className="mt-2 text-xs font-semibold">Trigger</p><p className="mt-1 text-[11px] text-muted-foreground">The spark</p></div>
          <Arrow />
          <div className="rounded-xl border border-border/70 bg-background/85 p-3 text-center"><Wind className="mx-auto size-6 text-primary" /><p className="mt-2 text-xs font-semibold">Sleep, stress, loneliness, access</p><p className="mt-1 text-[11px] text-muted-foreground">What helps it catch</p></div>
        </div>
      </Frame>
    )
  }

  if (kind === "fork") {
    return (
      <Frame label="A small fork in the road">
        <div className="flex items-center justify-center gap-4">
          <GitFork className="size-12 text-primary" />
          <div className="space-y-2">
            <Pill>Quick relief / usual move</Pill>
            <Pill>Small move toward what matters</Pill>
          </div>
        </div>
      </Frame>
    )
  }

  if (kind === "emotion-signal") {
    return (
      <Frame label="Signal, not steering wheel">
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-xl border border-border/70 bg-background/85 p-3 text-center"><Flame className="mx-auto size-5 text-primary" /><p className="mt-2 text-xs font-semibold">Emotion</p></div>
          <div className="rounded-xl border border-border/70 bg-background/85 p-3 text-center"><MessageCircle className="mx-auto size-5 text-primary" /><p className="mt-2 text-xs font-semibold">Message + urge</p></div>
          <div className="rounded-xl border border-primary/30 bg-primary/8 p-3 text-center"><Route className="mx-auto size-5 text-primary" /><p className="mt-2 text-xs font-semibold">Chosen response</p></div>
        </div>
      </Frame>
    )
  }

  if (kind === "camera") {
    return (
      <Frame label="Camera vs narrator">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-border/70 bg-background/85 p-4"><Camera className="size-5 text-primary" /><p className="mt-2 text-xs font-bold">Camera</p><p className="mt-1 text-xs text-muted-foreground">“They have not replied today.”</p></div>
          <div className="rounded-xl border border-border/70 bg-background/85 p-4"><MessageCircle className="size-5 text-primary" /><p className="mt-2 text-xs font-bold">Narrator</p><p className="mt-1 text-xs text-muted-foreground">“They must be angry with me.”</p></div>
        </div>
      </Frame>
    )
  }

  if (kind === "battery") {
    return (
      <Frame label="Capacity changes with the basics">
        <div className="flex items-center gap-4 rounded-xl border border-border/70 bg-background/85 p-4">
          <BatteryCharging className="size-10 shrink-0 text-primary" />
          <div><p className="text-sm font-bold">Low battery does not mean bad character</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">Sleep, food, health, substances, pain and movement can all change how much capacity you have to work with.</p></div>
        </div>
      </Frame>
    )
  }

  if (kind === "umbrella") {
    return (
      <Frame label="Prepare before the weather changes">
        <div className="flex items-center justify-center gap-4"><Umbrella className="size-12 text-primary" /><div><p className="text-sm font-bold">Likely hard moment</p><p className="text-xs text-muted-foreground">First move → backup move</p></div></div>
      </Frame>
    )
  }

  if (kind === "handbrake") {
    return (
      <Frame label="Interrupt momentum first">
        <div className="flex flex-wrap items-center justify-center gap-2"><Pill>Stop</Pill><Arrow /><Pill>Step back</Pill><Arrow /><Pill>Observe</Pill><Arrow /><Pill>Choose next move</Pill></div>
      </Frame>
    )
  }

  if (kind === "toolbox") {
    return (
      <Frame label="A menu, not an exam">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">{["Change channel", "Soothe body", "One thing", "Plan next step"].map((item) => <div key={item} className="rounded-xl border border-border/70 bg-background/85 p-3 text-center"><Wrench className="mx-auto size-4 text-primary" /><p className="mt-2 text-[11px] font-semibold">{item}</p></div>)}</div>
      </Frame>
    )
  }

  if (kind === "map") {
    return (
      <Frame label="Start from the real location">
        <div className="flex items-center justify-center gap-4"><MapPin className="size-10 text-primary" /><div><p className="text-sm font-bold">This is where things are today</p><p className="mt-1 text-xs text-muted-foreground">Acceptance puts the pin on the map. It does not say you have to like the location.</p></div></div>
      </Frame>
    )
  }

  if (kind === "knot") {
    return (
      <Frame label="Untangle one part">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3"><div className="rounded-xl border border-border/70 bg-background/85 p-3 text-center text-xs font-semibold">“Everything is a mess”</div><Arrow /><div className="rounded-xl border border-primary/30 bg-primary/8 p-3 text-center text-xs font-semibold">One specific problem with an available action</div></div>
      </Frame>
    )
  }

  if (kind === "conversation") {
    return (
      <Frame label="Know what you are trying to protect">
        <div className="grid grid-cols-3 gap-2"><Pill>Outcome</Pill><Pill>Relationship</Pill><Pill>Self-respect</Pill></div>
      </Frame>
    )
  }

  return (
    <Frame label="Direction over perfection">
      <div className="flex items-center justify-center gap-4"><Compass className="size-11 text-primary" /><div><p className="text-sm font-bold">What matters → one workable step</p><p className="mt-1 text-xs text-muted-foreground">The compass gives direction. It does not require a perfect route.</p></div></div>
    </Frame>
  )
}

export default function JourneyConceptVisual({ moduleSlug, sectionIndex }: { moduleSlug: string; sectionIndex: number }) {
  const kind = VISUALS[moduleSlug]?.[sectionIndex]
  if (!kind) return null
  return <Visual kind={kind} />
}
