# ConserFAIRy — Cline Memory & Rules Architecture

## How to use this document
- Each `memory-bank/` file below lists its source brief sections and a
  short "must include" list 
- Each `.clinerules/` file lists its source sections plus explicit
  **hard rules** — constraints that are easy for an agent to "helpfully"
  erode over time (adding validation the storage model shouldn't have,
  quietly reintroducing LinkML, treating the frontend guard as if it were
  real security). These are flagged so they get enforced verbatim, not
  paraphrased into something weaker.
- A traceability table at the end maps every brief section to the file(s)
  that should reflect it, for fast lookup in either direction.

---

## 1. memory-bank/

### `memory-bank/projectbrief.md` ← §1, §3
Must include:
- Mission/users one-liner (§1)
- Top-level nav/feature areas (§3), plus the cross-cutting note that
  visibility (§9) and identifiers (§10) apply uniformly across Records and
  Vocabularies rather than being duplicated per module

### `memory-bank/productContext.md` ← §1, §4 (all), §5, §6, §9, §10, §11
Must include:
- The three-in-one nature of Documentation (§4.1–4.3): create/view/edit are
  one component stack, not three, and now must also be schema-version-aware
- Vocabularies module's dual role: SKOS vocab management AND the home of
  the metadata terminology itself (§5), now explicitly including
  custom-property support and shared commentary workflow (resolved v2)
- Visibility model (§9.2): scheme-level-only for ConceptSchemes, split
  metadata/attachment for Records, plus the always-discoverable metadata
  shell (contents TBD, §12.B.6)
- Project/membership permission model (§9.3, resolved v2) — owner/admin
  roles, institution-scoped projects
- PID scheme (§10) and the export-time-only namespace substitution (§10.2,
  resolved v2)
- The §11 out-of-scope boundary, especially the *time-boxed, not deferred
  indefinitely* framing of API-level access enforcement

### `memory-bank/systemPatterns.md` ← §2, §7, §4.3's architectural consequence, §8 (esp. §8.3), §10.1
Must include:
- Oxigraph-as-projection / Postgres-as-source-of-truth (§7)
- The **Pydantic-in-memory-generation pattern** (§8.2, revised v2 —
  supersedes any earlier LinkML-based description; this is the pattern
  most likely to get rewritten inconsistently if old context lingers
  anywhere)
- Storage-model vs. quality-model split (§8.3) — call out as its own
  subsection, not buried in prose
- CIDOC CRM `E42`+`P2` identifier pattern (§10.1), now extended to comments
- Schema-version-awareness requirement for the Viewer/Editor (§8.3,
  resolved this round as a *requirement*, mechanism still open per §12.B.5)
  — flag as a pattern, since it constrains storage/rendering even before
  the versioning mechanism itself is designed

### `memory-bank/techContext.md` ← §2, §8.4–8.5
Must include:
- Stack/tooling list (§2)
- The decided generation pipeline: SKOS → in-memory Pydantic models → JSON
  Schema (§8.2). **LinkML is explicitly dropped** — this is a decision on
  record, not an oversight (see decisions log below)
- LIDO import/export tooling situation (§8.4) — import reasonably solved,
  export unsolved, adapter's underlying tech still an open question
- Frontend validation tooling status (§8.5) — ajv+JSON Schema is the
  current lean (marginally strengthened by the simpler pipeline) but still
  formally open

### `memory-bank/activeContext.md` ← whatever subset of §4/§8/§9/§10 is live
No fixed "must include" — populate with whatever's actually being worked
on. Worth seeding right now with the four things newly decided but not yet
built against: the Pydantic/JSON Schema pipeline (§8.2), the project/
membership model (§9.3), split visibility (§9.2), and export-time
namespace substitution (§10.2).

### `memory-bank/progress.md`
Leave for the agent/Lasse to populate as work proceeds.

### `memory-bank/domain-glossary.md` (additional file, worth adding)
CIDOC CRM, SKOS, JSKOS, the `exactMatch`/`closeMatch`/`relatedMatch`
distinction (§5.4), KuR vs. AAT vs. GND, the storage-model/quality-model
distinction (§8.3), and the four-tier severity vocabulary (§8.2). Flag the
last two explicitly — they're the ones most likely to get quietly
flattened back into "required means required" by an agent that hasn't
internalized the distinction.

### Decisions log (appendix in `systemPatterns.md`)
- Why Oxigraph is a projection, not the source of truth
- Why Postgres/JSONB over a graph-native store
- **Why Pydantic-in-memory generation was chosen over LinkML** — worth
  recording as an explicit reversal, not a silent absence, so a future
  agent doesn't "rediscover" LinkML as a clean-up suggestion without it
  being raised as a new decision first
- Why cardinality lives on the Concept directly (§8.2), unlike the general
  SKOS-reuse case
- Why "required" never gates a save (§8.3)
- **Why `django-guardian` was passed over for a hand-rolled project/
  membership model** (§9.3, new this round)
- Why institutional namespaces are export-time-only for now rather than a
  persisted alias mechanism (§10.2, new this round)

---

## 2. .clinerules/

### `.clinerules/rules/backend.md` ← §2, §7, §8.3
**Hard rule:** storage-model fields are always Optional/lenient regardless
of the domain vocabulary's own tier; "required" never gates a save. This is
the single constraint most likely to erode if an agent "helpfully" adds
presence validation later.

### `.clinerules/rules/frontend.md` ← §2, §4.3 (file already exists per Lasse — update in place rather than restate)
Update this round: fold in the schema-version-awareness requirement (§8.3)
alongside the existing Create/View/Edit shared-component-stack rule (§4.3)
— the renderer must be able to render a record against the schema version
it was created under, not only the current one.

### `.clinerules/rules/rdf-skos.md` ← §7, §5, §10.1
Update this round:
- §5 now requires **custom (non-SKOS/DCT) property support** in the SKOS
  editor — call this out explicitly, it's new and easy to miss if an agent
  only skims the vocab-module description
- §10.1 now extends stable identifiers to comments, not just
  Concepts/Records

### `.clinerules/rules/schema-strategy.md` *(new, suggested)* ← §8 in full
**Hard rule, rewritten this round: no LinkML.** The pipeline is SKOS →
in-memory Pydantic model construction → JSON Schema for the frontend. This
is a decision, not an oversight — an agent should not reintroduce LinkML,
SHACL, or any other schema-generation layer as a "cleaner" alternative
without raising it as a new open question first (see the universal rule
below). Also encode: no `class_uri`/`slot_uri`-style ontology binding yet —
canonical SKOS URIs only (§8.2).

### `.clinerules/rules/visibility-and-access.md` *(new, suggested)* ← §9, §10.3
Rewritten this round now that §9.3 is decided:
- **Hard rule:** the permission mechanism is a hand-rolled project/
  membership model (owner/admin roles, institution-scoped projects) — not
  `django-guardian`.
- **Hard rule:** frontend-only route gating is a *known, time-boxed* gap,
  not a security boundary. An agent must not describe, comment on, or
  reason about the frontend guard as if it protects the API — it doesn't,
  until §10.3's backend enforcement is actually built.
- **Implementation note:** build the frontend guard now so it defers to a
  single membership-check call/hook. When backend enforcement lands, that
  hook's stub gets replaced with a real API call, and the guard's job
  becomes "react to a 403/'not a member' response," not "independently
  decide access."

### Universal rule (no path scoping, always active)
Open questions (§12.B of the brief) are not to be silently resolved by an
agent. Surface them in conversation and/or log new ones to
`activeContext.md`. This includes any that this document has just
resolved — if an agent's own reasoning implies re-opening one of them
(e.g. "actually LinkML would handle this better," or "let's just use
django-guardian, it's more standard"), that's a signal to ask, not to act.

### Conditional rule ← `backend/**/records/**`, `frontend/**/records/**` (+ wherever generated schema artefacts live)
Enforces §4.3's shared-component-stack constraint specifically, now
inclusive of schema-version-awareness (§8.3) — this is the constraint most
likely to silently erode under iterative agent edits, so it benefits from
firing automatically rather than living only as prose in `frontend.md`.

---

## 3. .clineignore
Beyond the standard node_modules/build-output exclusions:
- The Oxigraph store's on-disk data directory — binary, regenerable, and
  per §7 explicitly not the source of truth
- `.venv/`, `__pycache__/`, `*.pyc`
- Django `staticfiles/`/`media/` if collected locally
- An explicit `!` exception for the SKOS terminology TTL file(s) — it's the
  one file structurally load-bearing for §4.3/§8's shared-renderer
  architecture

**New candidate to watch, not yet decided:** if §12.B.5's versioning
mechanism ends up storing derived Pydantic/JSON-Schema classes on disk per
version, decide then whether those artefacts are regenerable-and-ignorable
or load-bearing-and-tracked. Don't pre-decide this before that design
lands.

---

## 4. Skills
On-demand skills remain the better fit than always-on rules for the
occasionally-invoked, deterministic transformation work this project
generates a lot of:
- `skos-rdf-transform` — updated scope this round: the rdflib-based
  blank-node flattening, URI migration, encoding fixes, JSKOS conversion
  logic, and **the in-memory SKOS→Pydantic model construction** (was
  SKOS→LinkML); pack the deterministic parts as scripts so only their
  output enters context
- `vocabulary-import` — the TS4NFDI/Dante import and CSV→SKOS mapping
  pipeline from §5.2
- `metadata-scheme-form-codegen` — once §4.3's shared renderer exists,
  "given the generated schema, generate/update the schema-driven form" as
  an invoked-when-needed skill rather than a standing rule
- `lido-export-serializer` *(new, suggested)* — once §8.4's export
  direction has an implementation, the LIDO-XML serialization logic is a
  good candidate: deterministic, occasionally invoked, benefits from only
  its output entering context

---

## 5. Traceability table

| Brief section | memory-bank file(s) | .clinerules file(s) | Skill(s) |
|---|---|---|---|
| §1 Mission & users | projectbrief.md, productContext.md | — | — |
| §2 Stack & tooling | techContext.md | schema-strategy.md | — |
| §3 Nav/feature areas | projectbrief.md | — | — |
| §4 Documentation module | productContext.md | frontend.md (conditional rule) | metadata-scheme-form-codegen |
| §5 Vocabularies module | productContext.md, systemPatterns.md | rdf-skos.md | vocabulary-import, skos-rdf-transform |
| §6 Graph Query | productContext.md | — | — |
| §7 RDF conventions | systemPatterns.md | rdf-skos.md, backend.md | skos-rdf-transform |
| §8 Schema strategy | systemPatterns.md, techContext.md | schema-strategy.md, backend.md | skos-rdf-transform, metadata-scheme-form-codegen, lido-export-serializer |
| §9 Visibility & publishing | productContext.md | visibility-and-access.md | — |
| §10 Identifiers & PIDs | systemPatterns.md, productContext.md | visibility-and-access.md, rdf-skos.md | lido-export-serializer |
| §11 Out of scope | productContext.md | universal rule | — |
| §12 Open questions | activeContext.md | universal rule | — |
