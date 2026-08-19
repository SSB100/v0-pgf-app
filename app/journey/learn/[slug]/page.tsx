import { notFound, redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { sql } from "@/lib/db"
import GuidedLearningModule from "@/components/journey/guided-learning-module"
import { JOURNEY_MODULE_BY_SLUG, JOURNEY_MODULES } from "@/lib/journey-curriculum"
import { prepareJourneyModuleForSelfGuidedUse } from "@/lib/journey-self-guided-presentation"
import { prepareRemainingJourneyModuleForSelfGuidedUse } from "@/lib/journey-self-guided-presentation-remaining"

interface GuidedModulePageProps {
  params: Promise<{ slug: string }>
}

export default async function GuidedModulePage({ params }: GuidedModulePageProps) {
  const user = await getSession()
  if (!user) redirect("/auth/signin")

  const { slug } = await params
  const sourceModule = JOURNEY_MODULE_BY_SLUG[slug]
  if (!sourceModule) notFound()
  const module = prepareRemainingJourneyModuleForSelfGuidedUse(
    prepareJourneyModuleForSelfGuidedUse(sourceModule),
  )

  const profileResult = await sql`
    SELECT onboarding_completed
    FROM user_profiles
    WHERE user_id = ${user.id}
  `

  if (!profileResult[0]?.onboarding_completed) redirect("/onboarding")

  let coreValues: string[] = []
  if (slug === "discovering-values" || slug === "values-to-action") {
    const valuesResult = await sql`
      SELECT value_name
      FROM user_values
      WHERE user_id = ${user.id} AND is_core_value = true
      ORDER BY rank
      LIMIT 3
    `
    coreValues = valuesResult.map((row) => row.value_name)
  }

  const moduleIndex = JOURNEY_MODULES.findIndex((item) => item.slug === slug)

  return (
    <GuidedLearningModule
      module={module}
      moduleNumber={moduleIndex + 1}
      totalModules={JOURNEY_MODULES.length}
      coreValues={coreValues}
    />
  )
}
