import { notFound } from "next/navigation"

export default function SetupPage() {
  // Database setup must be performed through controlled deployment tooling, not
  // from a public application page.
  notFound()
}
