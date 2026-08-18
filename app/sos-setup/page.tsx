import { redirect } from "next/navigation"

export default function SOSSetupPage() {
  // The previous SOS alert workflow is not part of the current Waypoint MVP.
  // Do not collect emergency-contact details or imply that a support team is
  // monitoring alerts. Send users to the verified support information instead.
  redirect("/support")
}
