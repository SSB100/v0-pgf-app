export const PRIVACY_DELETION_CONFIRMATION = "DELETE ACCOUNT DATA"

const ACTIVE_STATUSES = new Set(["requested", "in_review"])
const ACTIONS = new Set(["start_review", "complete_correction", "decline", "complete_deletion"])

function substantiveResolutionNote(note) {
  return typeof note === "string" && note.trim().length >= 20
}

export function validatePrivacyRequestAction({
  action,
  requestType,
  status,
  subjectRole,
  resolutionNote,
  confirmation,
}) {
  const errors = []

  if (!ACTIONS.has(action)) errors.push("Unsupported privacy-request action")
  if (!ACTIVE_STATUSES.has(status)) errors.push("This privacy request is no longer open")

  if (action === "start_review" && status !== "requested") {
    errors.push("Only a newly requested privacy request can be moved into review")
  }

  if (action === "complete_correction" && requestType !== "correction") {
    errors.push("Only correction requests can be completed as corrections")
  }

  if (action === "complete_deletion") {
    if (requestType !== "deletion") errors.push("Only deletion requests can trigger account deletion")
    if (subjectRole !== "client") errors.push("This workflow only deletes client accounts")
    if (confirmation !== PRIVACY_DELETION_CONFIRMATION) {
      errors.push(`Type ${PRIVACY_DELETION_CONFIRMATION} to confirm permanent deletion`)
    }
  }

  if (["complete_correction", "decline", "complete_deletion"].includes(action) && !substantiveResolutionNote(resolutionNote)) {
    errors.push("A substantive resolution note of at least 20 characters is required")
  }

  if (errors.length > 0) return { ok: false, errors }

  return {
    ok: true,
    value: {
      action,
      resolutionNote: typeof resolutionNote === "string" ? resolutionNote.trim() : "",
    },
  }
}
