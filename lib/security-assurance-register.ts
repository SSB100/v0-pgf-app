export type SecurityAssuranceRecord = {
  id: string
  control: string
  status: "implemented_internal" | "partially_implemented" | "pending_external" | "pending"
  evidence: string
  boundary: string
}

export const SECURITY_ASSURANCE_REGISTER: SecurityAssuranceRecord[] = [
  {
    id: "strong-auth",
    control: "Strong authentication for professional and administrator access",
    status: "implemented_internal",
    evidence: "TOTP MFA, recovery codes, security-version session invalidation and administrator MFA gates are implemented.",
    boundary: "Internally implemented and tested. This is not independent assurance.",
  },
  {
    id: "role-consent",
    control: "Role, organisation-membership and client-consent boundaries",
    status: "implemented_internal",
    evidence: "Professional/client role separation, scoped sharing, organisation membership lifecycle and cross-user authorisation review are implemented.",
    boundary: "Internal policy and application testing only.",
  },
  {
    id: "auth-abuse",
    control: "Authentication abuse protection",
    status: "implemented_internal",
    evidence: "Durable rate limiting protects sign-in, signup, professional registration and MFA challenge traffic.",
    boundary: "Needs adversarial review and tuning under realistic traffic before pilot use.",
  },
  {
    id: "incident-response",
    control: "Incident and privacy-breach response process",
    status: "partially_implemented",
    evidence: "Phase 4G provides an incident register, serious-harm decision record, containment notes and notification tracking.",
    boundary: "Requires a tabletop exercise and named operational contacts before a real pilot.",
  },
  {
    id: "penetration-test",
    control: "Independent penetration/security assessment",
    status: "pending_external",
    evidence: "No independent penetration test has been completed.",
    boundary: "Must remain represented as pending until performed by an independent qualified party.",
  },
  {
    id: "backup-restore",
    control: "Backup and restoration exercise",
    status: "pending",
    evidence: "Platform backup capabilities have not yet been converted into a documented Waypoint restore exercise.",
    boundary: "A successful restore test should be evidenced before handling real pilot data.",
  },
  {
    id: "supplier-security",
    control: "Cloud supplier security and data-jurisdiction review",
    status: "pending",
    evidence: "Vercel and Neon are known infrastructure dependencies; formal supplier/security and residency decisions remain incomplete.",
    boundary: "Must be resolved alongside Māori data governance and hosting/residency decisions.",
  },
  {
    id: "tabletop",
    control: "Incident response tabletop exercise",
    status: "pending",
    evidence: "No documented incident simulation has yet been completed.",
    boundary: "Exercise should test security containment, privacy assessment, communications and decision authority.",
  },
]
