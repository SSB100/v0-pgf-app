# Waypoint Content Safety & Accuracy Audit

**Audit date:** 18 August 2026  
**Scope:** User-facing wording, support references, therapeutic framing, behaviour/recovery terminology, onboarding, dashboard, community, safeguards, journey modules, public pages and prototype professional-sharing copy.

## Purpose

This pass reviews Waypoint as a recovery and wellbeing product for adults in Aotearoa New Zealand. The aim is not to remove direct language about difficult topics. The aim is to make that language clear, non-judgmental and accurate, while avoiding claims the current MVP cannot support.

## Content principles now applied

- Use direct terms such as gambling, suicide, self-harm, alcohol and substance use when they are necessary for clarity.
- Do not define people by a behaviour or diagnosis.
- Do not assume abstinence is every user's goal.
- Do not label a return to a tracked behaviour as automatic failure or moral relapse.
- Do not call days "clean" or users "sober" unless the user has explicitly chosen that language for themselves.
- Do not turn simple app calculations into clinical conclusions.
- Describe check-ins as self-reported information.
- Describe Growth Companion levels, streaks and credits as app engagement rather than recovery or health status.
- Describe therapeutic material as informed by established approaches while formal content review remains incomplete.
- Never imply that a clinician, counsellor, moderator or support worker has been notified unless a monitored service actually exists.
- Use only familiar te reo Māori naturally and sparingly. Current examples include **whānau** and **Aotearoa**. Safety, privacy and consent language remains unambiguous English unless an English explanation is provided.

## Major wording risks corrected

### Public claims

Removed or replaced claims such as:
- "evidence-based tools" as a claim about Waypoint itself;
- "built on evidence-based therapy" without a formal evidence map and review;
- "24/7 Crisis Support" when Waypoint itself is not a crisis service;
- "everything you need" and other absolute completeness claims;
- unsupported partnership/support-service endorsement placeholders;
- language implying Waypoint can diagnose, treat or determine recovery status.

### Recovery and behaviour language

Replaced automatic labels such as:
- "clean days";
- "sober days" as a universal product metric;
- "relapse" as the default name for every reported behaviour;
- "strong positive mindset" inferred from simple check-in data;
- success/failure language around missed check-ins and difficult days.

Current language reports what the user entered, for example:
- "You reported gambling on 1 recorded day";
- "Average self-reported mood 6.2/10";
- "3 recorded days without alcohol use reported";
- "No check-in recorded".

### Safety and crisis wording

Waypoint now states consistently that:
- it is not an emergency-response service;
- safety answers are not monitored in real time;
- opening support resources does not notify a clinician or support worker;
- immediate danger in New Zealand should be directed to 111 / the nearest hospital emergency department;
- external support services are contacted directly by the user.

Safety questions continue to use direct words such as self-harm and suicide rather than euphemisms.

### Community wording

The community now distinguishes a **community alias** from true anonymity. Other members see the alias, but Waypoint retains an internal account-to-alias relationship.

Community copy also states that:
- it is peer discussion, not counselling;
- the current MVP is not guaranteed to be continuously moderated;
- reports are recorded but do not create a guaranteed response time;
- report forms are not an emergency channel.

A reporting implementation bug identified during the wording review was also corrected: the server now derives the reported user's ID from the selected message rather than trusting a client-provided user identifier.

### Share Journey

Share Journey is now explicitly labelled a **prototype**. Current controls do not:
- create a clinician relationship;
- send an invitation;
- save sharing permissions;
- give a healthcare professional access to user data.

The interface records the intended future principles: verified professional identity, explicit consent, granular permissions, revocation and access logging.

### Safeguards

Safeguards were rewritten so they are optional choices rather than instructions that guarantee protection. This includes:
- no claim that blocking software provides complete protection;
- no unsupported efficacy statistics;
- New Zealand self-exclusion information tied to current official/provider guidance;
- no fixed generic self-exclusion minimum period stated by the app;
- alcohol/substance withdrawal caution without app-prescribed detox instructions;
- no medication recommendations from Waypoint;
- consent-based financial safeguards rather than automatically handing control of money to another person;
- safety planning that does not imply someone should remain in danger or abuse.

### Therapeutic content

Journey and skills wording now distinguishes recognised concepts from Waypoint's own validation status. Examples include:
- Emotional / Reasonable / Wise Mind described as a DBT model;
- STOP and DEAR MAN described as DBT-informed skills;
- values and choice-point exercises described as reflection tools;
- Reality Acceptance explicitly separated from approval, forgiveness, giving up or remaining in danger;
- Opposite Action explicitly not used to override genuine safety signals;
- Distress Tolerance no longer makes unsupported fixed claims about how long urges last or "rewiring the brain".

Users may use hypothetical examples in sensitive exercises rather than being forced to revisit a recent personal event.

## Verified New Zealand support registry

Support details are centralised in `lib/support-resources.ts` and include a provider/source URL and a `lastVerified` date. Provider pages remain the source of truth because numbers and service hours can change.

**Verified 18 August 2026:**

- **Immediate danger:** 111 / nearest hospital emergency department. Source: Health New Zealand urgent-help guidance.
- **1737:** call or text 1737 for free brief emotional support, 24/7. Source: 1737 / Whakarongorau Aotearoa.
- **Gambling Helpline:** 0800 654 655; text 8006; 24/7. Source: Gambling Helpline.
- **PGF Services:** 0800 664 262; text 5819. Duty counsellor/text service hours are represented according to current PGF published information rather than described as 24/7.
- **Alcohol Drug Helpline:** 0800 787 797; text 8681; 24/7. Source: Alcohol Drug Helpline.

Self-exclusion material references current Department of Internal Affairs and Safer Gambling Aotearoa guidance rather than hard-coded assumptions about exclusion duration or process.

## Important design decisions preserved for professional co-design

The wording pass intentionally does **not** decide:
- what response threshold should follow self-harm/suicide answers;
- whether and when a clinician should ever be notified;
- what information a clinician should see;
- what validated research outcome measures should be used;
- the final clinical evidence register and review process;
- Māori clinical/cultural models or tikanga;
- the final community moderation operating model;
- youth safeguarding/consent design.

Those decisions require appropriate clinical, cultural, service and research governance rather than copywriting alone.

## Remaining content work before this PR is production-ready

- Run a final component-by-component scan for legacy wording not reachable through the primary current user journey.
- Run TypeScript/build checks and resolve any regressions from the wording refactor.
- Review responsive/mobile layouts where longer safety explanations may increase page height.
- Obtain professional review of therapeutic content before stronger efficacy language is considered.
- Obtain New Zealand privacy/legal review of final Terms and future Privacy Policy.
- Re-check the support-resource registry immediately before any formal pilot or public launch.

## Overall content position after this pass

Waypoint should currently be described as a **functional, developing self-guided recovery and wellbeing MVP for adults**, with content informed by recognised therapeutic approaches and with verified New Zealand support information. It should not yet be described as a clinically validated treatment, a monitored crisis service, a fully anonymous community, or a production-ready clinical data-sharing platform.
