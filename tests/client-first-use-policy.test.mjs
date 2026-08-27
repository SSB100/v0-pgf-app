import test from "node:test"
import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"

const readSource = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8")

test("daily check-in availability uses the Aotearoa calendar boundary", async () => {
  const source = await readSource("app/check-in/page.tsx")

  assert.match(source, /getAotearoaDateKey/)
  assert.match(source, /date = \$\{today\}::date/)
  assert.doesNotMatch(source, /date\s*=\s*CURRENT_DATE/)
})

test("daily check-in remains behind completed client onboarding", async () => {
  const source = await readSource("app/check-in/page.tsx")

  assert.match(source, /onboarding_completed/)
  assert.match(source, /redirect\("\/onboarding"\)/)
})

test("save and finish later ends the current session after saving progress", async () => {
  const source = await readSource("app/api/onboarding/save-progress/route.ts")
  const updateIndex = source.indexOf("UPDATE user_profiles")
  const signOutIndex = source.indexOf("await deleteSession()")

  assert.ok(updateIndex >= 0, "expected onboarding progress update")
  assert.ok(signOutIndex > updateIndex, "session should end only after progress is saved")
})

test("dashboard sharing shortcut opens the real privacy and sharing centre", async () => {
  const source = await readSource("components/dashboard/quick-actions-bar.tsx")

  assert.match(source, /\/privacy#professional-sharing/)
  assert.match(source, /Privacy & sharing/)
  assert.doesNotMatch(source, /Sharing preview/)
})

test("minimal dashboard check-in state is truthful and does not link to a missing progress route", async () => {
  const source = await readSource("app/dashboard/page.tsx")

  assert.match(source, /has_check_in_history/)
  assert.match(source, /Your first Daily Reflection, when you're ready/)
  assert.match(source, /href="#weekly-overview"/)
  assert.match(source, /id="weekly-overview"/)
  assert.doesNotMatch(source, /href="\/progress"/)
})

test("desktop dashboard does not assume every client uses a Growth Companion", async () => {
  const source = await readSource("app/dashboard/page.tsx")

  assert.match(source, /See your growth progress first/)
  assert.doesNotMatch(source, /See your Growth Companion first/)
})

test("weekly overview does not assume an empty seven-day window means a first-ever check-in", async () => {
  const source = await readSource("components/dashboard/weekly-overview-card.tsx")

  assert.match(source, /No Daily Reflections in this 7-day view yet/)
  assert.doesNotMatch(source, /Complete your first Daily Reflection to get started/)
})

test("minimal dashboard values and skill suggestions remain optional and truthful", async () => {
  const values = await readSource("components/dashboard/core-values-card.tsx")
  const skills = await readSource("components/dashboard/suggested-skills-card.tsx")

  assert.match(values, /Waypoint works without them/)
  assert.match(values, /Explore the values module/)
  assert.doesNotMatch(values, /narrowed down in Life Garden/)
  assert.doesNotMatch(values, /\/onboarding/)

  assert.match(skills, /hasPersonalisedSuggestions/)
  assert.match(skills, /general starting points rather than personalised suggestions/)
  assert.match(skills, /suggestions are shaped by information you recorded/)
  assert.doesNotMatch(skills, /Three Waypoint suggestions based on information you recorded/)
})

test("public getting-started copy describes the comprehensive baseline onboarding", async () => {
  const home = await readSource("app/page.tsx")
  const faq = await readSource("app/faq/page.tsx")
  const footer = await readSource("components/layout/public-footer.tsx")

  assert.match(home, /Establish your Waypoint baseline/)
  assert.match(home, /relevant history and patterns/)
  assert.match(home, /your values and strengths/)
  assert.match(home, /your first Daily Reflection/)
  assert.doesNotMatch(home, /personalise the experience further later/)

  assert.match(faq, /complete guided onboarding to establish your starting self-reported baseline/)
  assert.match(faq, /relevant history and patterns/)
  assert.match(faq, /your values and strengths/)
  assert.match(faq, /first Daily Reflection/)
  assert.doesNotMatch(faq, /brief setup gets you to your dashboard/)
  assert.doesNotMatch(faq, /Daily Reflections, values work and other personalisation can be used later/)

  assert.match(footer, /© 2026 Waypoint/)
})
