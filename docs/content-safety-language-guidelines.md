# Waypoint Content Safety & Language Guidelines

Last updated: 18 August 2026

These guidelines are used when writing or reviewing user-facing Waypoint content. They are intended to reduce stigma, avoid unsupported clinical claims, keep safety information clear, and make the product feel appropriate for Aotearoa New Zealand.

## Core principles

1. **Clear, direct and non-judgmental.** Do not soften important safety words such as suicide, self-harm, gambling or substance use when direct language is needed for understanding.
2. **Describe; do not diagnose.** Waypoint can report what a person entered or how a value changed. It should not turn simple self-report data into clinical conclusions.
3. **Do not define the person by a behaviour or diagnosis.** Prefer “person affected by gambling” or “person experiencing gambling harm” over “problem gambler”, and “person using substances” over “addict”.
4. **Do not assume abstinence is every user’s goal.** Where possible, use language that supports the goal the user has chosen. Safety information can still clearly explain when professional advice is appropriate.
5. **A difficult day does not erase progress.** Avoid language that frames missed check-ins, resumed behaviour or lower ratings as failure.
6. **Engagement is not recovery.** Credits, streaks, levels and Growth Companion progress describe Waypoint activity, not clinical improvement.
7. **Be precise about evidence.** Until the Waypoint intervention and its content have completed formal review, say that content is “informed by” established therapeutic approaches rather than describing Waypoint itself as proven, clinically validated or evidence-based.
8. **Be precise about monitoring.** Never imply that a clinician, counsellor, moderator or support worker has been notified or is monitoring information unless a verified operating process actually does that.
9. **Avoid absolute promises.** Phrases such as “everything you need”, “complete protection”, “guaranteed”, “secure”, “anonymous”, “confidential” or “always available” must only be used where the implementation or source supports them.
10. **Use New Zealand English.** Use terms and services appropriate to Aotearoa New Zealand.

## Te reo Māori

Use only very commonly understood words naturally and sparingly, for example **whānau** and **Aotearoa**. Do not use unfamiliar te reo in emergency instructions, consent, privacy or clinical/safety copy unless an English explanation is provided. Cultural models, tikanga and Māori health framing should be co-designed with appropriate Māori leadership rather than invented through copywriting.

## Preferred terminology

Prefer:
- gambling harm / gambling affecting you
- return to a behaviour you are trying to change
- days without [behaviour] reported
- self-reported rating
- support resources
- mental wellbeing
- alcohol or other drug use
- people / users / participants
- missed check-in / no check-in recorded

Avoid or use only when clinically/research justified:
- problem gambler
- addict / alcoholic / drug abuser
- clean / dirty
- relapse as an automatic label for every reported behaviour
- failed / failure
- strong positive mindset based on simple app data
- recovered score / recovery level
- crisis support when Waypoint only links to external services

## Support-resource verification

All phone numbers, text numbers, published operating hours and provider descriptions should come from the central `lib/support-resources.ts` registry rather than being copied into multiple files.

Each entry must include:
- service name;
- phone/text details;
- published availability;
- plain-language description;
- provider/source URL;
- date the registry was last verified.

Provider pages remain the source of truth because service details can change.

## Current verified sources — 18 August 2026

- Health New Zealand urgent-help guidance: https://www.wellbeingsupport.health.nz/need-urgent-help
- 1737 / Whakarongorau Aotearoa: https://www.1737.org.nz/how-1737-works
- Gambling Helpline: https://gamblinghelpline.co.nz/about
- PGF Services: https://www.pgf.nz/getting-started
- Alcohol Drug Helpline: https://alcoholdrughelp.org.nz/directory
- Department of Internal Affairs exclusion-order guidance: https://www.dia.govt.nz/diawebsite.nsf/wpg_URL/Services-Casino-and-Non-Casino-Gaming-Exclusion-Order-%28Problem-Gamblers%29-Guidelines
- Safer Gambling Aotearoa support/self-exclusion guidance: https://www.safergambling.org.nz/taking-action/what-to-expect

## Therapeutic and research wording

Until formal content mapping and review are complete:

Preferred:
> “Waypoint’s learning content is informed by established concepts used in approaches such as CBT, DBT, ACT and mindfulness.”

Avoid:
> “Waypoint is clinically proven.”
> “Waypoint provides evidence-based treatment.”
> “This tool will prevent relapse.”

Where a module uses a recognised concept, its source/framework should eventually be recorded in the clinical-content evidence register with reviewer and version information.

## Safety wording

Safety questions should be direct and allow “Prefer not to say” where clinically appropriate. Asking a safety question creates an expectation that the product explains what happens to the answer. Current Waypoint wording must state that answers are not monitored in real time and that Waypoint is not an emergency-response service.

For immediate danger in New Zealand, direct users to 111 / the nearest hospital emergency department. For external support options, use the central verified support registry.
