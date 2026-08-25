# Waypoint Clinical Content & Evidence Register

Status: working governance register for Phase 4A

Registry revision: `2026-08-25.1`

## Purpose

This register makes the provenance of Waypoint's guided Journey and Skills content explicit and versionable. It is intended to support product governance, clinician co-design and organisation due diligence.

It does **not** claim that Waypoint has been clinically validated, that Waypoint delivers a complete psychotherapy model, or that evidence for a source method proves the safety or effectiveness of Waypoint's implementation.

The code-backed source of truth is:

- `lib/content-evidence-registry.mjs` for evidence sources and governed Skills metadata
- `lib/clinical-content-registry.ts` for the combined Journey + Skills registry
- `lib/journey-curriculum.ts` for current Journey content

## What every active content item records

Each active Journey module or Skill has:

- a stable Waypoint content ID
- a semantic content version
- a registry revision
- title and category
- declared source approaches
- evidence/provenance source IDs
- source-code path
- review status
- validation status

The initial current content version is `1.0.0`.

Historical completion/practice records created before this registry are labelled `legacy-unversioned`. They are **not** silently backfilled as version 1.0.0 because that would create a false record of what content the user actually received.

## Review states

Current active content is labelled:

`internal_provenance_mapped_external_review_pending`

This means the content has an internal source-method/provenance mapping, but formal external clinical review/co-design has not yet been completed and recorded.

Current validation status is:

`not_clinically_validated`

That status should remain explicit until a future governed study or other appropriate evaluation justifies a different statement.

## Evidence and provenance source catalogue

### NICE NG248

National Institute for Health and Care Excellence. *Gambling-related harms: identification, assessment and management*. NICE guideline NG248. Published 28 January 2025.

Role in the register: gambling-harm guideline context. NICE NG248 includes identification, assessment, treatment, relapse/ongoing support and service-delivery guidance. Its inclusion does not mean NICE endorses or validates Waypoint.

Source: https://www.nice.org.uk/guidance/ng248

### DBT-informed content

Linehan, M. M. (2025). *DBT Skills Training Manual, Revised Edition*. Guilford Press. ISBN 9781462556359.

Role in the register: method/provenance source for content such as mindfulness skills, distress tolerance, emotion regulation, interpersonal effectiveness, reality acceptance and related DBT-informed skills.

Waypoint uses selected DBT-informed concepts and does not present itself as comprehensive DBT.

Source: https://www.guilford.com/books/DBT-Skills-Training-Manual/Marsha-Linehan/9781462556359

### Motivational interviewing

Miller, W. R., & Rollnick, S. (2023). *Motivational Interviewing, Fourth Edition: Helping People Change and Grow*. Guilford Press. ISBN 9781462552795.

Role in the register: method/provenance source for motivational, ambivalence and change-focused reflection.

Source: https://www.guilford.com/books/Motivational-Interviewing/Miller-Rollnick/9781462552795

### Acceptance and Commitment Therapy

Hayes, S. C., Strosahl, K. D., & Wilson, K. G. (2011). *Acceptance and Commitment Therapy, Second Edition: The Process and Practice of Mindful Change*. Guilford Press. ISBN 9781609189624.

Role in the register: method/provenance source for values, acceptance, psychological flexibility, choice-point and committed-action concepts.

Waypoint uses selected ACT-informed concepts and does not present itself as comprehensive ACT.

Source: https://www.guilford.com/books/Acceptance-and-Commitment-Therapy/Hayes-Strosahl-Wilson/9781462528943

### CBT-informed content

Beck, J. S. (2020). *Cognitive Behavior Therapy, Third Edition: Basics and Beyond*. Guilford Press. ISBN 9781462544196.

Role in the register: method/provenance source for CBT-informed thinking, behavioural and problem-solving concepts.

Waypoint uses selected CBT-informed concepts and does not present itself as comprehensive CBT.

Source: https://www.guilford.com/books/Cognitive-Behavior-Therapy/Judith-Beck/9781462544196

### Relapse prevention and urge surfing

Marlatt, G. A., & Donovan, D. M. (Eds.). (2005). *Relapse Prevention, Second Edition: Maintenance Strategies in the Treatment of Addictive Behaviors*. Guilford Press. ISBN 9781593856410.

Role in the register: method/provenance source for relapse prevention, high-risk situations, coping and urge-surfing concepts. The second edition includes gambling-related relapse-prevention material.

Source: https://www.guilford.com/books/Relapse-Prevention/Marlatt-Donovan/9781593856410

### Stages/processes of change

Prochaska, J. O., DiClemente, C. C., & Norcross, J. C. (1992). *In search of how people change: Applications to addictive behaviors*. American Psychologist, 47(9), 1102-1114. DOI: 10.1037/0003-066X.47.9.1102.

Role in the register: method/provenance source for stages/processes-of-change concepts. Waypoint treats these as flexible descriptive concepts rather than diagnostic categories.

Source: https://pubmed.ncbi.nlm.nih.gov/1329589/

### RAIN technique provenance

Brach, T. *RAIN: A Practice of Radical Compassion*.

Role in the register: technique provenance for the Recognize, Allow, Investigate, Nurture mindfulness mnemonic. This is not treated as evidence that Waypoint's implementation is clinically effective.

Source: https://www.tarabrach.com/rain/

## Content lifecycle and change control

### Current-version changes

Any user-visible change that could materially alter what a module/skill teaches, asks the user to practise, or asks the user to reflect on should trigger a content-version decision.

Use semantic versioning as follows:

- **patch**: wording/clarity/accessibility correction that does not materially change the learning intent
- **minor**: meaningful addition or change to examples, practice, knowledge checks or teaching while retaining the same core intervention intent
- **major**: substantial conceptual redesign or replacement of the intervention/content model

Pure layout or technical fixes that do not change the content do not require a content-version bump, but should still be traceable through Git history.

### Evidence/provenance changes

Updating an evidence citation, review state, or provenance mapping without changing the client-facing content increments the registry revision. It does not retrospectively change the content version a client received.

### Retiring content

Retired content IDs must not be reused for a different intervention. Historical completion records remain linked to the retired stable content ID and the version originally recorded.

### External review

A future clinical reviewer/co-design process should record:

- reviewer identity/role and organisation where appropriate
- scope of review
- date
- content versions reviewed
- comments/recommendations
- resulting changes and version bumps
- any unresolved concerns

External review is a governance milestone, not proof of clinical effectiveness.

## Runtime recording

New Journey completions record:

- stable content ID
- current content version
- current registry revision

New governed Skill-page feedback records the same fields and uses `skills_practice`, the production activity table.

Daily Check-in skill self-reports are mapped to governed Skill content only when the selected name corresponds to a known Waypoint Skill. Free-form/unrecognised skill names remain self-reported and are not falsely assigned a Waypoint content version.

## Historical-data treatment

Existing Journey completions and mappable historical Skill practices are labelled `legacy-unversioned`.

This is intentional. The current repository may contain similar content, but the system did not previously persist enough information to prove which exact content revision each historical user saw.

## Open Phase 4A/4B governance work

- external clinician co-design/review of the current registry
- named content owner and approval authority
- formal review cadence
- documented change-request/approval workflow
- Māori governance review of content framing, interpretation and dissemination where relevant
- future research protocol linkage to exact content versions
