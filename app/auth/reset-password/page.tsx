import { redirect } from "next/navigation"

export default function ResetPasswordPage() {
  // Password reset is intentionally disabled in the current MVP until a
  // production-grade recovery flow with verified delivery, hashed single-use
  // tokens, expiry and abuse controls is implemented end to end.
  redirect("/auth/forgot-password")
}
