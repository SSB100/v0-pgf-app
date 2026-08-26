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
