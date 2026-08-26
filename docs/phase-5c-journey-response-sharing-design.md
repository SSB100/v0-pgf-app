# Phase 5C Journey response sharing design

Status: product direction approved for implementation design

Branch: `waypoint/phase-5c-journey-response-sharing-design`

Issue: #57

## 1. Decision

Waypoint will support a distinct **Journey responses** professional-sharing permission.

When a client grants this permission to a connected professional, that professional can see the client's current saved response data from completed Journey modules covered by the permission's time boundary.

This is deliberately broader than per-module sharing. The client does not have to approve every module one by one.

The existing `journey_progress` scope remains separate and continues to mean only module completion/progress information. It must never imply access to Journey response content.

The client can revoke Journey-response sharing at any time. Revocation stops professional access immediately but does not delete the client's privately saved Journey responses.

## 2. What is saved

Today Journey check answers and exercise responses live only in client/browser state and are not sent when a module is completed. That must change for historic sharing to be possible.

For Phase 5C, Waypoint should save **one current completed-response record per client per Journey module**.

A completed-response record contains the response information the client entered or selected to complete the module, including:

- the selected educational quick-check answer;
- free-text exercise answers;
- selected exercise options;
- sorting or sequence answers where applicable;
- the module/content identifiers and content version associated with the response;
- the time that the current response was completed.

The response record should not contain unrelated browser state such as the current screen number, unfinished typing, navigation history or local-storage learning position.

### Incomplete modules

Incomplete or abandoned Journey module drafts remain unsaved by the server in this phase and are never professionally shared.

Only completing the module persists the response.

This avoids silently collecting partially written reflections while still supporting the client's requirement to share previously completed work later.

## 3. Private storage and sharing are separate decisions

Completed Journey responses are saved privately to the client's Waypoint account whether professional sharing is on or off.

This separation is required because a client may decide later that they want to share earlier work.

The module UI must explain the state clearly:

- if Journey-response sharing is off, the completed response is saved privately and is not visible to a professional;
- if Journey-response sharing is on, the completed response is saved privately and is also available to each connected professional who currently has the Journey-responses permission and whose permission time boundary includes that response.

Saving a response is therefore not consent to professional sharing.

## 4. Sharing scope

Add a new professional share scope:

`journey_responses`

Suggested label:

**Journey responses**

Suggested plain-language description:

> Your saved answers and reflections from completed Journey modules. This can include free-text reflections and answers you selected in module exercises and quick checks. Journey responses are not clinical assessments or scores.

Sensitivity should be treated as high because this scope can contain personal free text.

The scope is never included in default professional-sharing permissions.

A professional may request it, but only the client can grant it.

The existing `journey_progress` scope remains unchanged.

## 5. Permission is per professional connection

Sharing remains tied to the existing `client_professional_links` relationship and `sharing_grants` model.

This means a client can share Journey responses with one connected professional and not another.

If multiple professionals have an active `journey_responses` grant, all of those professionals can see the response data allowed by their own grant boundary.

No global professional role automatically gains Journey-response access.

Professional verification, current organisation affiliation, active client connection and MFA requirements continue to apply before any response can be read.

## 6. Permission time boundary

When a client enables Journey-response sharing, they choose one of two history modes.

### A. Share previous and future responses

The active professional can see the current saved response for every completed Journey module, including modules completed before the grant was created.

The client must see an explicit warning before confirming:

> This will make your current saved responses from Journey modules you completed before today available to this professional, as well as responses you complete in future. If you repeat a module later, the new response replaces the previous one.

### B. Share new responses only

The active professional can only see a module response when the module was completed or repeated at or after the current grant timestamp.

Older saved module responses remain private.

Suggested warning:

> This professional will only see Journey responses you complete or repeat after you turn sharing on. Your earlier saved responses will stay private.

### Timestamp rule

For `new responses only`, visibility is determined from the **current grant's** `granted_at` timestamp.

If sharing is revoked and later enabled again with `new responses only`, the new grant timestamp becomes the new boundary. Responses completed while sharing was off remain private unless the client later chooses to include previous responses or repeats the module after the new grant.

### Storage representation

The simplest extension to the existing grant model is a history-mode field on the active Journey-response grant, for example:

- `include_pre_grant_data = TRUE` for previous + future;
- `include_pre_grant_data = FALSE` for new only.

`granted_at` remains the effective boundary for the new-only mode.

The exact migration can use an equivalent explicit representation, but it must not rely on ambiguous null semantics.

## 7. Repeating modules

Clients can repeat Journey modules.

Completing a module again replaces the existing saved response for that client/module with the newly completed response.

Waypoint does **not** expose an answer-version history to the client or professional in Phase 5C.

The current response record should therefore use an upsert keyed by:

`(user_id, module_slug)`

A repeat completion updates:

- response payload;
- response content/version metadata;
- `last_completed_at` or equivalent current-response timestamp;
- `updated_at`.

### Growth Credits

Repeating a module must not create unlimited Growth Credits.

The existing one-credit-per-known-module rule remains.

The existing `journey_completions` row can continue to represent the original engagement completion. The current Journey-response record separately represents the latest completed answer set.

This keeps reward/progress semantics independent from editable/replaceable response content.

## 8. Effect of repeats on time-based sharing

Repeating a module creates a new current response timestamp because the previous response is overwritten.

Therefore:

- a module completed before a `new only` grant remains private until it is repeated after the grant;
- once repeated after the grant, its new current response becomes visible;
- if sharing is revoked, all professional access stops immediately;
- if the module is repeated while sharing is revoked, that new private response is not visible after a later `new only` re-grant unless the module is repeated again after that re-grant;
- if the client later chooses `include previous responses`, the current saved response becomes visible regardless of when that current response was completed.

This is intentional and makes the sharing boundary understandable from the permission timestamp.

## 9. What the client sees inside a Journey module

Every Journey module should show a concise privacy/share notice before the client begins entering response content or at the start of the interactive response section.

### No active Journey-response grants

Suggested state:

> Your completed response is saved privately to your Waypoint account. It will not be shared with a professional unless you turn on Journey-response sharing.

Provide a link to manage professional sharing, but do not pressure the client to enable it.

### One or more active grants

Suggested state:

> When you complete this module, your saved Journey response will be available to: [professional name(s)].

The notice should provide **Manage sharing** directly from the module.

The management action must let the client revoke Journey-response sharing for the relevant professional connection(s) before completing the module.

There is no per-module privacy exception in the Phase 5C model. Turning Journey-response sharing off changes the permission for that professional connection, rather than creating hidden module-specific override rules.

If several professionals have the permission, the control must make clear which professionals are currently authorised.

## 10. Enabling sharing after responses already exist

When a client enables `journey_responses` and one or more completed responses already exist, Waypoint must not silently choose whether history is included.

The client must choose explicitly:

1. **Share previous responses too**
2. **Only share responses from now on**

The confirmation screen should state approximately how many currently saved module responses would become visible if previous responses are included.

For example:

> You currently have 7 saved Journey module responses. Choosing "Share previous responses too" will make those current saved responses available to this professional immediately.

The client can cancel without changing the permission.

## 11. Re-enabling after revocation

Re-enabling Journey-response sharing is treated as a new consent event and a new active grant.

The client chooses the history mode again.

Do not reuse the original grant timestamp or silently restore its historic-access setting.

This avoids turning an old consent decision into a permanent future permission.

## 12. Professional view

A professional who has an authorised Journey-response grant can view the current saved response data allowed by the grant.

The professional UI must distinguish these states:

- **Not shared**: the client has not granted Journey-response access;
- **Shared, no eligible responses**: permission exists but there are no completed responses inside the permission boundary;
- **Shared responses available**: eligible current module responses exist.

The professional interface should organise responses by Journey module and show:

- module title;
- latest response completion date;
- content version where useful for governance;
- quick-check response with clear wording that it is an educational check, not a clinical score;
- exercise answers/reflections exactly as saved by the client.

Do not calculate clinical scores, risk scores or inferred diagnoses from Journey responses.

## 13. Professional read boundary

Every professional read of Journey-response content must still pass all existing access checks:

1. authenticated professional account;
2. professional verification valid;
3. current verified organisation affiliation;
4. MFA verified;
5. active client-professional connection;
6. active `journey_responses` grant for that specific link;
7. response falls within the grant's historic/new-only time boundary.

The server, not the client UI, enforces all seven conditions.

## 14. Access auditing

Viewing Journey-response content is a sensitive professional access event and must be audit logged.

Suggested resource scope:

`journey_responses`

Audit metadata should contain identifiers and access context such as:

- connection/link ID;
- module slug(s) accessed;
- professional account ID via the existing audit event fields;
- organisation ID;
- grant/history mode;
- response count;
- MFA state;
- schema/content response version where relevant.

Do not copy the raw Journey free text into the access audit log.

## 15. Consent auditing

Grant, history-mode choice, revocation and re-grant should create append-only consent events.

Suggested consent type:

`professional_journey_response_sharing`

Consent event metadata/scope should record:

- target client-professional link;
- whether prior data is included;
- grant timestamp;
- organisation ID;
- source UI;
- applicable consent/document version.

The raw response content is not stored in the consent event.

## 16. Data model direction

A dedicated current-response table is preferable to adding response JSON to `journey_completions` because completion/reward history and editable response content have different semantics.

Proposed shape:

```sql
CREATE TABLE journey_module_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  module_slug VARCHAR(255) NOT NULL,
  module_name VARCHAR(255) NOT NULL,
  content_id VARCHAR(...),
  content_version VARCHAR(...),
  response_schema_version VARCHAR(...) NOT NULL,
  response_data JSONB NOT NULL,
  last_completed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, module_slug)
);
```

Exact field sizes should align with the existing content registry.

The response payload should have a server-owned schema rather than accepting arbitrary client JSON.

The completion API must validate submitted response keys and selections against the known Journey module/exercise definition before persistence.

Apply an explicit payload size limit.

## 17. Response schema

The saved payload should preserve the client's current completed answer set in a stable, displayable form.

A versioned payload could contain:

```json
{
  "quickCheck": {
    "selectedOptionId": "...",
    "selectedOptionLabel": "..."
  },
  "exercise": {
    "kind": "builder",
    "answers": [
      {
        "fieldId": "...",
        "prompt": "...",
        "value": "..."
      }
    ]
  }
}
```

Choice/multi/sort/sequence exercises should store stable IDs plus the labels required to render the response faithfully for the associated content version.

Do not store `correct=true/false` as a client health outcome. If educational correctness is displayed, it should be clearly labelled as a learning check tied to that module version.

## 18. Completion API behaviour

Module completion becomes responsible for two related but distinct operations:

1. persist/replace the current completed Journey response;
2. record first-time Journey completion and award a Growth Credit only if the known module has not previously earned one.

A repeat completion should succeed even though the module is already present in `journey_completions`.

Suggested response semantics:

- first completion: response saved, completion inserted, one Growth Credit awarded;
- repeat completion: response replaced, existing completion preserved, zero additional Growth Credits;
- invalid or incomplete submitted response: no new response persisted and no completion/reward mutation.

Prefer a database transaction so response persistence and first-completion reward cannot partially diverge.

## 19. Privacy export and deletion

The user's privacy export must include their current saved `journey_module_responses` records.

The export should continue to distinguish user-owned private data from governance/audit data.

Account deletion should remove Journey response rows through the user foreign-key cascade, subject to the broader reviewed retention/deletion process.

Repeating a module is the normal Phase 5C way to correct/replace that module's current response.

Revoking professional sharing does **not** delete the private response.

A privacy deletion request can include Journey-response deletion under the existing privacy process. A separate instant per-module delete UI is not required for the first implementation unless later product review adds it.

## 20. Connection pause/end behaviour

If a client-professional connection is paused, the professional cannot access Journey responses while paused even if a grant row remains active.

If the connection is ended, existing behaviour revokes active sharing grants. Journey-response access therefore ends immediately.

The client's private response rows remain intact.

If a new professional relationship is later established, it requires a new Journey-response permission decision.

## 21. Client-facing terminology

Use **Journey responses**, not "raw clinical notes" or "clinical data".

Important messages:

- these are the client's own saved answers/reflections;
- sharing is optional;
- the client can see who has access;
- the client can turn access off;
- previous responses are included only if the client explicitly chooses that option;
- quick checks are educational, not assessments;
- Waypoint is not continuously monitored and sharing does not mean the professional will see the response immediately.

## 22. No monitoring implication

Every professional response view and relevant client sharing screen must preserve the existing monitoring boundary.

Suggested wording:

> Sharing makes this information available for your professional to review. It does not mean Waypoint or your professional is watching responses in real time. Use your agreed support or emergency options if you need urgent help.

## 23. Policy tests required

Implementation is not complete without tests covering at least:

### Persistence

- completed module response is saved privately when no sharing grant exists;
- abandoned/incomplete responses are not server-persisted;
- repeat completion overwrites the current module response;
- repeat completion does not award another Growth Credit;
- arbitrary response keys or invalid options are rejected/sanitised server-side.

### Sharing

- `journey_progress` alone never exposes Journey response content;
- `journey_responses` grant exposes eligible current responses only;
- new-only grant excludes earlier responses;
- all-history grant includes earlier current responses;
- module repeated after a new-only grant becomes eligible;
- revocation stops access immediately;
- re-grant new-only uses the new grant timestamp;
- re-grant with history includes current previous responses;
- one professional's grant cannot authorise another professional;
- paused/ended connection blocks access;
- unverified professional, invalid affiliation or missing MFA blocks access.

### Governance

- professional reads generate an access audit event without raw response text;
- grant/revoke/history-mode choices generate consent events;
- privacy export contains current Journey responses;
- client UI can identify who currently has Journey-response permission.

## 24. Migration implications

Implementation will require a reviewed migration because the current production schema has no Journey-response storage and the existing `sharing_grants.data_scope` check constraint does not include `journey_responses`.

The migration should:

1. create the current Journey-response table;
2. add `journey_responses` to allowed professional sharing scopes;
3. add an explicit history-mode field/representation for Journey-response grants;
4. add useful user/module indexes;
5. make no attempt to fabricate historic responses for modules completed before this feature exists.

### Existing completions before launch

There is no raw Journey response data to backfill because Waypoint currently does not persist those answers.

Existing `journey_completions` remain valid progress records.

A module response begins to exist only when the client completes or repeats that module after the response-persistence feature is deployed.

Therefore a future "share previous responses" option can include only previously **saved** response records, never invent answers for old completion rows.

## 25. Release sequence

Recommended Phase 5C implementation order:

1. schema/migration + server response validator;
2. private Journey response persistence and repeat-module overwrite semantics;
3. privacy export coverage;
4. new professional scope/history-mode grant handling;
5. module sharing notice and manage-sharing entry point;
6. professional Journey-response endpoint/view;
7. access/consent audit coverage;
8. full policy/authorization tests;
9. hosted client + professional QA;
10. controlled production migration/release.

## 26. Locked non-goals for this phase

Phase 5C does not add:

- per-module sharing grants;
- automatic AI summaries of private Journey responses;
- professional editing of client responses;
- clinical/risk scoring from response text;
- live monitoring or alerts from Journey answers;
- an answer-version history visible to professionals;
- repeat-completion Growth Credit farming;
- automatic backfill/fabrication of responses from historic completion records.

## 27. Acceptance summary

The design is successful when a client can understand the following without ambiguity:

> Waypoint saves the response I submit when I complete a Journey module. I can keep that response private or give a connected professional permission to see my Journey responses. If I turn sharing on later, I choose whether they can see my previous saved responses or only responses I complete from that point forward. I can turn the permission off again. If I repeat a module, my new response replaces the old saved response. Sharing does not mean anyone is monitoring me live.
