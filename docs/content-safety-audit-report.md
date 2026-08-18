# Waypoint Content Safety, Security & Data-Integrity Audit

**Audit date:** 18 August 2026  
**Scope:** User-facing wording, support references, therapeutic framing, behaviour/recovery terminology, onboarding, dashboard, community, safeguards, journey modules, public pages, prototype professional sharing, authentication, sensitive-data handling, API authorization, dependency security, build health and research-readiness foundations.

## Purpose

This pass reviews Waypoint as a recovery and wellbeing product for adults in Aotearoa New Zealand. The aim is not to remove direct language about difficult topics. The aim is to make that language clear, non-judgmental and accurate, while avoiding claims the current MVP cannot support and reducing avoidable technical risk around sensitive information.

The review is still an MVP engineering and content review. It is not a substitute for clinical validation, penetration testing, formal privacy/legal advice, Māori/Pacific governance, ethics review or an approved research protocol.

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
- the current MVP does not have a staffed real-time moderation service;
- reports are recorded for later review during development and do not create a guaranteed response time;
- report forms are not an emergency channel.

A reporting implementation bug identified during the wording review was also corrected: the server now derives the reported user's ID from the selected message rather than trusting a client-provided user identifier.

### Share Journey

Share Journey is now explicitly labelled a **prototype**. Current controls do not:
- create a clinician relationship;
- send an invitation;
- save sharing permissions;
- give a healthcare professional access to user data.

The prototype no longer derives a display code from a user's database identifier. A future implementation should use a random, expiring invitation mechanism with verified professional identity, explicit consent, granular permissions, revocation and access logging.

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

Support details are centralised in `lib/support-resources.ts` and include a provider/source URL and a last-verified date. Provider pages remain the source of truth because numbers and service hours can change.

**Verified 18 August 2026:**

- **Immediate danger:** 111 / nearest hospital emergency department. Source: Health New Zealand urgent-help guidance.
- **1737:** call or text 1737 for free brief emotional support, 24/7. Source: 1737 / Whakarongorau Aotearoa.
- **Gambling Helpline:** 0800 654 655; text 8006; 24/7. Source: Gambling Helpline.
- **PGF Services:** 0800 664 262; text 5819. Duty counsellor/text service hours are represented according to current PGF published information rather than described as 24/7.
- **Alcohol Drug Helpline:** 0800 787 797; text 8681; 24/7. Source: Alcohol Drug Helpline.

Self-exclusion material references current Department of Internal Affairs and Safer Gambling Aotearoa guidance rather than hard-coded assumptions about exclusion duration or process.

## Technical, security and data-integrity findings corrected

### Build and dependency checks

The review branch now has automated read-only checks that run on pushes and pull requests:
- frozen dependency installation;
- `tsc --noEmit`;
- a Next.js production build using CI-only placeholder environment values;
- `pnpm audit --audit-level=high`.

As of the current 18 August review pass, these checks are passing. TypeScript errors are no longer ignored by Next.js configuration.

Dependencies were reviewed after the audit found high/critical advisories in the earlier lockfile. Unused `next-auth`, the unused `crypto` package and global Vercel Analytics were removed; Next.js and vulnerable transitive packages were updated/overridden through the reviewed lockfile. The lockfile is now synchronised with `package.json` and the high-severity audit check passes.

### Authentication and account security

Corrected:
- removed the hard-coded development/test sign-in path and its associated reset behaviour;
- new passwords use bcrypt rather than unsalted SHA-256;
- legacy SHA-256 accounts are supported only for migration and are upgraded after a successful sign-in;
- sign-in uses generic invalid-credential errors;
- signup normalises email, validates age/password/terms server-side and calculates the 18+ threshold using the Aotearoa calendar;
- the unfinished password-reset flow has been disabled rather than generating raw reset tokens without a verified delivery channel;
- future reset-token schema stores a token hash rather than a bearer token;
- the predictable JWT fallback secret was removed;
- protected app routes now validate the signed session and user record;
- invalid session cookies are cleared;
- the public database setup page and public migration endpoint were disabled.

Still required before a public or clinical deployment:
- durable sign-in/account-recovery rate limiting;
- session revocation/versioning so password changes or account security events can invalidate other active sessions;
- a production account-recovery process with verified delivery, single-use expiring tokens and abuse controls;
- operational verification and rotation policy for a high-entropy production `JWT_SECRET`.

### Sensitive API authorization and data minimisation

Corrected:
- daily check-in status and creation are scoped to the authenticated account rather than a client-supplied user ID;
- check-in ratings, booleans, text/list lengths and strongest-emotion consistency are validated server-side;
- onboarding draft save and final completion are scoped to the signed-in user and size-limited;
- the generic profile API no longer returns the entire `user_profiles` record or sensitive onboarding/safety fields;
- dashboard client components no longer receive raw account IDs when they do not need them;
- community APIs no longer return account IDs, Growth Companion levels or peer last-activity timestamps to other members;
- community message length, alias format and report reasons are constrained server-side;
- aliases that could impersonate Waypoint staff or major support services are blocked;
- legacy SOS contact collection and disclosure endpoints are disabled because the MVP is not a monitored alert service;
- sensitive app and API routes are sent with `Cache-Control: private, no-store`;
- baseline response security headers were added;
- global analytics were removed from routes carrying sensitive wellbeing/recovery information pending a proper privacy assessment.

### Gamification integrity

Corrected:
- Growth Credit spending is atomic so concurrent requests cannot spend the same credit twice;
- journey-completion rewards are limited to known modules and only the first completion can award a credit;
- skill rewards are limited to known skills and only the first recorded completion can award a credit;
- Growth Companion UI and peer-community UI explicitly separate app engagement from health/recovery status.

### Aotearoa calendar consistency

The earlier implementation mixed server/database dates with New Zealand user expectations. A central `Pacific/Auckland` calendar helper now drives:
- today's daily check-in key;
- one-check-in-per-day enforcement;
- check-in streak day differences;
- dashboard seven-day windows;
- behaviour-date summaries;
- age eligibility calculations.

This avoids UTC midnight shifting a New Zealand user's check-in into the wrong calendar day.

### Onboarding transaction integrity

Final onboarding completion is now validated and written as a single non-interactive Neon transaction. Onboarding-derived values, awareness records, problem areas and profile state are replaced together rather than through a long sequence of independent writes that could leave a partly completed profile if one query failed.

The final endpoint also constrains journey types, Growth Companion choices, dates, list sizes and free-text lengths, and returns a generic server error instead of exposing database error details.

### Database/schema issues corrected in source

- `skills_completed.user_id` was incorrectly modelled as an integer even though `users.id` is UUID; the migration now uses UUID.
- community schema now includes account-linked aliases, duplicate-report protection and consistent UUID foreign keys/indexes.
- the legacy research-preference column named `data_consent` is explicitly documented as **not** formal study consent. It currently records only interest in future research.

These source migrations do not prove that an already-deployed production database has the same constraints. Live schema verification remains required.

## Privacy and governance position

Waypoint is collecting or capable of collecting highly sensitive personal wellbeing information. The Office of the Privacy Commissioner states that organisations collecting personal information should clearly tell people what is collected, why it is collected, intended recipients, whether provision is optional, the consequences of not providing it, access/correction rights and how to contact the organisation holding the information. Current Waypoint Terms provide some transparency, but a complete public privacy statement and operating privacy policy are **not yet in place**.

The Health Information Privacy Code 2020 was amended in 2026. Whether and how that Code applies to a future Waypoint organisation, research partnership or health-service deployment should be determined with appropriate New Zealand privacy/legal advice rather than assumed in the app.

Before a public pilot or formal study, Waypoint still needs:
- a named legal/operating entity and privacy contact/officer;
- a complete public privacy statement at the relevant collection points;
- documented purposes and data minimisation for every sensitive field;
- access and correction process;
- data export and account/data deletion process where legally appropriate;
- defined retention and secure disposal rules;
- breach/incident response and notification process;
- processor/vendor assessment and data-location review;
- consent and terms versioning;
- a decision on legacy SOS/contact/reset/mock data already stored, if any;
- formal security review/penetration testing before handling real clinical or research data at scale.

## Research-readiness gaps

The current MVP can demonstrate an intervention concept and collect structured self-report data, but it is not yet a research-grade data platform. Remaining foundations include:
- an explicit data dictionary and versioned measurement definitions;
- validated outcome measures selected with the research team rather than invented app scores;
- a participant/study identifier separated from ordinary account identity;
- formal research consent versioning and withdrawal rules;
- auditable research extraction procedures and role-based access;
- retention/deletion rules aligned to the approved protocol and applicable law;
- adverse-event and safety-response procedures;
- pre-specified handling of missing check-ins, duplicated records and timezone/calendar rules;
- Māori data governance and kaupapa Māori input where applicable;
- Pacific capability/governance where applicable;
- clinical and lived-experience review of intervention content;
- a documented analysis/knowledge-translation pathway.

## Community operating-model gaps

The software now limits avoidable privacy leakage and clearly describes the current community as peer discussion. It still lacks the human operating model required for a real public peer-support community, including:
- a staffed moderation workflow;
- defined escalation and response times;
- moderator/admin tooling and access controls;
- community rules/enforcement process;
- message retention/deletion policy;
- abuse/spam rate limiting;
- incident handling and audit logs;
- a decision about whether the community belongs in the first research/pilot scope at all.

## Important design decisions preserved for professional co-design

The review intentionally does **not** decide:
- what response threshold should follow self-harm/suicide answers;
- whether and when a clinician should ever be notified;
- what information a clinician should see;
- what validated research outcome measures should be used;
- the final clinical evidence register and review process;
- Māori clinical/cultural models or tikanga;
- the final community moderation operating model;
- youth safeguarding/consent design.

Those decisions require appropriate clinical, cultural, service and research governance rather than engineering or copywriting alone.

## Remaining work before this PR should be considered deployable beyond an internal/demo MVP

- Verify the live Neon schema against the reviewed migration assumptions and create a controlled migration plan rather than relying on source files alone.
- Add durable authentication/community abuse controls rather than in-memory serverless rate limiting.
- Design session revocation and production account recovery.
- Complete privacy/legal documentation, privacy-contact details, retention/access/correction/deletion processes and vendor/security review.
- Review responsive/mobile layouts where longer safety explanations may increase page height.
- Obtain professional review of therapeutic content before stronger efficacy language is considered.
- Establish the actual community moderation model or remove community from the first public/research deployment.
- Re-check the support-resource registry immediately before any formal pilot or public launch.
- Conduct dedicated application-security review/penetration testing before handling formal clinical/research data.

## Overall position after this pass

Waypoint can now more defensibly be described as a **functional, developing self-guided recovery and wellbeing MVP for adults**, with content informed by recognised therapeutic approaches, verified New Zealand support information, improved authentication/API controls, consistent Aotearoa calendar handling and a substantially stronger technical foundation than the original prototype.

It should **not** yet be described as a clinically validated treatment, a monitored crisis service, a fully anonymous community, a production-ready clinical data-sharing platform, a research-grade data platform or a public health service ready for unsupervised scale.
