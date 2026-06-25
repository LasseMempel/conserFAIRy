# ConserFAIRy — Project Brief & Feature Specification

## Purpose of this document
This is a consolidated spec meant to be fed to a coding agent (Cline) to generate
its persistent project knowledge — a `memory-bank/` (projectbrief.md, productContext.md,
systemPatterns.md, techContext.md, activeContext.md, progress.md) and scoped
`.clinerules/` files.

## 1. Mission & users
ConserFAIRy is a digital conservation science webapp for conservation
documentation, SKOS vocabulary management, built at LEIZA
(Leibniz-Zentrum für Archäologie) within NFDI4Objects Task Area 4 ("Protecting").
ConserFAIRy is intended as a **FAIRification node** for conservation data —
this framing now matters concretely for §8.4 (LIDO-XML import *and* export
are both real requirements, not just import) and §10 (persistent
identifiers).

Target users are **conservation scientists** working in GLAM settings.

## 2. Architecture & tech stack
Monorepo layout: `backend/` + `frontend/`.

**Backend**
- Django + django-ninja (built on Pydantic — relevant to §8's schema strategy)
- PostgreSQL with JSONB — this is the system of record
- Oxigraph (pyoxigraph) — a SPARQL-compliant triplestore, maintained as a
  **derived, rebuildable projection** of the PostgreSQL data via Django
  signals. It is not authoritative; treat it as disposable/regeneratable.
- ORCID OAuth2 login via django-allauth
- nginx in production
- Per §8.3: Pydantic is used in **two distinct flavours**, not one — a
  lenient storage model that gates persistence, and a strict quality/report
  model that never gates persistence. Don't let these collapse into a single
  class; that collapse is exactly the bug §8.3 exists to prevent.

**Frontend**
- Vite + React + TypeScript
- shadcn/ui
- React Flow + dagre for graph/vocabulary visualization (Sigma.js is the
  identified upgrade path if/when graphs get large enough to need it)

**Tooling**
- uv for Python project/dependency management
- LinkML — candidate for shared schema generation, see §8. **Not yet decided
  whether/when to introduce it** (§12 Q1); if it is introduced, it must be
  built programmatically from the SKOS terminology at generation time, never
  hand-authored as a YAML file (§8.2 — this part is decided regardless of
  the timing question).

## 3. Top-level navigation / feature areas
- **Records** — documentation (core module, see §4 — scope is broader than it
  used to be)
- **Vocabularies** — SKOS vocabulary management
- **Graph Query** — querying/visualizing the Oxigraph projection
- **Help & Guides**

Cutting across Records and Vocabularies: visibility/publishing (§9) and
identifiers/persistent URLs (§10) — both apply to records *and* to
ConceptSchemes/Concepts, so they're specified once, centrally, rather than
duplicated per module.

## 4. Documentation module (Records)
This is the core module. "Documentation" covers three related capabilities:

### 4.1 Structured, schema-compliant creation
Forms generated from conserFAIRy's metadata scheme, producing data that
conforms to it. At the moment its organised as a hierarchical SKOS reference vocabulary, but will be aligned with a LIDO-subprofile and conservation ontology. It captures metadata about the objects features like production technique, material, type as well as name, origin, date, current position, examinations, samples, condition assessment, conservation/restoration measures and administrative metadata about the data itself like creator, language.

How this metadata scheme is actually defined/implemented (LinkML, the
SKOS/LinkML division of labour, multi-format export, and — critically — how
"required" is handled given real records routinely violate it) is specified
in **§8**. Visibility/publishing for records is specified in **§9**;
identifiers and URLs in **§10**.

### 4.2 Unstructured upload 
GLAM institutions overwhelmingly produce unstructured or semi-structured
documentation in practice, so also files in different format should be uploadable (txt, md, pdf, odt, doc(x) etc.) but at least connected to basic metadata..

Per §9.2: an unstructured upload's own visibility may need to be settable
*independently* of the visibility of the structured metadata wrapped around
it — a scanned report can carry sensitive detail even when its metadata is
fine to publish. Not yet decided (§12 Q9).

### 4.3 Viewer + Editor — same logic as Create
Documentation also acts as a **viewer for the metadata scheme itself**:
loading an existing metadata-scheme-compliant data object and rendering it as a form-based view.

Editing a loaded object must reuse **exactly the same component/logic stack**
used to create a new object from scratch. Create, View, and Edit are not
three separate UIs — they are the same schema-driven form renderer running in
three modes (empty/new, populated/read-only, populated/editable).

**Architectural consequence:** the form-rendering layer needs to be driven
generically by the metadata scheme rather than hand-built per object type, so
that "load an external object" and "start a new one" go through the same
code path. The metadata scheme is the single source that both the Django side and the React form renderer consume. (§8 specifies *how*: the SKOS
terminology is the single authored source today; Django and React each
consume a generated artefact derived from it, never the SKOS graph directly,
and the renderer must also surface the non-blocking quality/completeness
report from §8.3/§8.5 — viewing a record is also where its violations get
shown.)

### 4.4 Future (not yet built): Annotation
Allow unstructured documents (per 4.2) to be tagged/annotated against
normdata vocabularies:
- GND (Gemeinsame Normdatei)
- the custom LEIZA conservation thesaurus (Konservierungs- und
  Restaurierungsfachthesaurus / KuR)
- Getty AAT

## 5. Vocabularies module
A simple web based SKOS Editor offering 2 possible views - datatable and tree.
Institutions can upload existing CSVs with columns following SKOS conventions, or actual SKOS RDF in different formats like ttl/json-ld.

The conserFAIRy metadata terminology itself (§4.1, §8) lives in this module
too: it is explicitly designed as a **GLAM table-column-mapping registry** —
each Concept is a unique, precisely-defined mapping target (e.g. "material
the object consists of" vs. "material used in the measure" are two distinct
Concepts, not one Concept reused twice), letting institutions make their
existing, arbitrary table structures explicit and exchangeable as a first
FAIRification step, ahead of full LIDO-subprofile adoption. This is why
mandatoryness/repeatability can legitimately live as RDF properties baked
directly onto these Concepts (§8.2) — see that section for why this would
*not* be sound practice for a conventional reusable controlled-vocabulary
term, and why it is sound here.

## 5.1 Commentaries
Users can comment on concepts and concepts schemes they are allowed to see to
- discuss a concept/concept scheme generally
- suggest specific values for additional properties/edits on existig ones, that can be accepted or rejected by concept scheme admins
- commments can also be replied to

This admin-mediated accept/reject workflow is precisely why the metadata
terminology cannot be mirrored into a separately hand-maintained file
elsewhere (§8.2) — anything edited here and not regenerated would drift
within weeks.

## 5.2. NFDI Vocabulary import
Vocabularies from NFDI sources can be imported as a starting ground to be used in the project and refine for specific institutional needs. Sources are
- TS4NFDI
- Dante from VZG (maybe already fetchable via TS4NFDI)

## 5.3 Drag & Drop - "Frankenvoc"
- The treeview allows drag & drop of concepts, to change their hierarchy
- Frankenvoc also allows to load two concept schemes as trees and drag&drop concepts between them, to reuse different vocabularies

## 5.4 Keep burrowed foreign concepts origin as mappings
- When reusing concepts from other concept schemes they automatically get aligned to the original concept using skos:exactMatch initially
- (possibly popup to change alignment property to skos:closeMatch, relatedMatch, when changing definition)

## 6. Graph Query module
Querying and visualizing the Oxigraph projection. React Flow + dagre
currently; Sigma.js noted as the scale-up path.

## 7. RDF / domain conventions already established
- CIDOC CRM alignment for conservation treatment events (KuR ontology +
  LEIZA thesaurus URIs)
- Oxigraph is a projection, not the source of truth — PostgreSQL/JSONB is
  canonical
- Identifiers follow the CIDOC CRM `E42 Identifier` + `P2 has type` pattern —
  see §10.1 for how this extends naturally to conserFAIRy-internal IDs and
  institutional-namespace aliases

## 8. Schema/model definition strategy (LinkML, validation, multi-format I/O)

### 8.1 Core idea and scope boundary
Backend (Python/Django) and frontend (TypeScript/React) would otherwise imply
two independent model definitions for the same domain objects. To avoid
defining structure twice, the **research-data** schema — SKOS concept
schemes/concepts (§5) and Records in all formats (§4) — is generated from a
single authored source.

This is explicitly scoped to research data only. The **user/account tables
managed via ORCID** (§2) are ordinary relational, low-churn, and not shared
across the Python/TS boundary the way research data is — they stay as
conventional hand-written Django models, not schema-generated. Pulling them
into this pipeline would add ceremony with no payoff.

### 8.2 Source of truth while the SKOS terminology is authoritative
**Decided:** until the LIDO subprofile and conservation ontology are
finished, the expanded SKOS terminology (§5) is the authoritative,
hand-edited source — not a separate schema file. **Not yet decided** (§12
Q1) is whether/how a code-generation step sits on top of it to derive the
Python and TypeScript object models, and if so, which tool.

LinkML is the leading candidate, but only in a specific role: **the LinkML
`SchemaDefinition` must be built programmatically, in memory, from the SKOS
RDF graph at generation time — never hand-authored as a YAML file living
alongside the terminology.** Concretely: a Python module reads the
terminology (via rdflib/pyoxigraph) and constructs `SchemaDefinition`/
`ClassDefinition`/`SlotDefinition` objects directly via the
`linkml_runtime`/`linkml_model` API, mapping the terminology's custom
mandatoryness/repeatability RDF properties onto LinkML's native
`required`/`recommended`/`ClassRule`/`multivalued` constructs as it goes.
LinkML's generators (Pydantic, TypeScript, JSON Schema) accept that in-memory
object directly — no YAML file needs to exist on disk for the proto-format
era. The SKOS terminology stays the only thing anyone edits by hand; the
generated schema has the same disposable/regenerate-on-demand status
Oxigraph already has relative to Postgres (§7).

This is a decided **principle** (if a generator is used at all, it must work
this way), separate from the still-open **choice of generator/timing**
(§12 Q1).

**Why baking mandatoryness/repeatability onto the Concepts themselves is
sound here, specifically:** earlier drafts of this brief flagged this as a
risk on the assumption that Concepts were being reused as generic
controlled *values* across multiple fields with different cardinality each
time (the classic authority-file reuse pattern, where baking cardinality
onto the term breaks the moment it's reused elsewhere). That assumption was
wrong for this project: per §5, each Concept is a unique, purpose-built
field/column-mapping identifier, not a reusable value — "material the
object consists of" and "material used in the measure" are different
Concepts. Given that, cardinality genuinely is a stable property of the
Concept itself, and the original objection doesn't apply. The one thing
still worth confirming rather than assuming (§12 Q4): that field-identifier
Concepts and any future controlled-*value* vocabularies (e.g. an actual
material taxonomy used to fill in the material field) are kept in clearly
distinct schemes/types, so a Concept never ends up playing both roles at
once — that combination would reintroduce the original problem.

**The four-tier severity vocabulary maps onto existing native LinkML
constructs**, without inventing custom extensions, regardless of how/when a
generator gets introduced:

| Term (DE) | Term (EN) | LinkML construct |
|---|---|---|
| verpflichtend | required | `required: true` |
| empfohlen | recommended | `recommended: true` — unpopulated recommended slots are still valid data; applications are explicitly told not to treat this as an error, only to optionally inform |
| mandatory if existent | conditionally required | a `ClassRule` ("if rule": precondition → postcondition, else elsecondition) |
| optional | nice-to-have | absence of the above (default) |

**Alternatives to LinkML considered for the generation step itself** (not
for whether SKOS stays the authoring source — that's settled):
- **Direct JSON Schema** + `datamodel-code-generator` (Pydantic) +
  `json-schema-to-typescript`/`quicktype` (TS). Lighter-weight, fewer moving
  parts. Cost: no native RDF/ontology-URI awareness (`class_uri`/`slot_uri`,
  ontology-bound dynamic enums) — would defer rather than avoid the
  CIDOC-CRM/OWL alignment work §7 already commits to.
- **SHACL directly on the RDF** — conceptually the most "native" choice
  since the data already is RDF, but the SHACL-to-code-generator ecosystem
  is thinner and less actively maintained than LinkML's or JSON Schema's.
  Not recommended as a primary path currently.
- **Complementary, TypeScript-side only:** `openapi-typescript` generating
  frontend types directly from django-ninja's auto-generated OpenAPI schema
  (itself derived from the §8.3 storage model). Ties frontend types to the
  actual API contract rather than the pure domain model, which sometimes
  differ. Could sit alongside, or instead of, a SKOS→LinkML→TS step. Not
  decided.

### 8.3 Validation architecture: the "required fields will be violated" problem
**The problem.** The metadata scheme is explicitly a *recommendation* — it
already expects real-world violations, including of its own "required"
fields, because that's the reality of institutional GLAM data and human
process over years. If "required" in a generated Pydantic model raises a
hard `ValidationError` on save, the practical effect is the opposite of the
goal: an imperfect-but-real record gets rejected outright and **nothing** is
stored, which is strictly worse than storing the imperfect one. Stated
priority: **prefer violating data over no data.**

**Resolution — decided.** Split into two generated artifacts from the same
schema source, not one model doing both jobs:
- **Storage model** — what django-ninja actually validates incoming payloads
  against and persists to JSONB. Every field optional regardless of the
  domain vocabulary's own required/recommended/conditional designation;
  type-checked but not presence-checked; `extra='allow'` (Pydantic v2) so
  unmapped/legacy columns don't cause a hard failure either. Its only job:
  "is this well-typed enough that downstream consumers (exports, the
  Oxigraph projection signals, graph queries) won't choke." This is the
  **only** validation that ever gates a save.
- **Quality/report model** — the full four-tier evaluation from §8.2, run
  *after* storage, never before it: server-side on read/fetch (e.g. via
  LinkML's `RecommendedSlotsPlugin`/`ClassRule`-conditional checking, or a
  custom evaluator against the rule manifest), mirrored client-side per
  §8.5. "Required" in the domain vocabulary now consistently means "renders
  at highest severity in the report," never "blocks write."

**Tradeoffs flagged explicitly, not left implicit:**
- `extra='allow'` protects against rejecting legacy/unmapped columns, but
  also means a typo'd field name silently goes nowhere instead of erroring.
  Accepted, given the stated priority — but stated here so it isn't an
  accidental side effect nobody decided on.
- **Schema/terminology versioning (open, §12 Q8):** because the SKOS
  terminology is itself actively edited via §5.1's workflow, the
  quality-report ruleset derived from it changes over time too — meaning a
  record's "is this required field violated" status could change even
  though the record itself never did. Recommended direction: stamp each
  record with which terminology revision it was evaluated against, so its
  quality report is computed against the *correct historical ruleset*
  rather than silently re-evaluated against today's terminology. Not yet
  decided how revisions are tracked/identified.

### 8.4 Multi-format input/export — LIDO-XML is in scope, asymmetric tooling
**Decided, correcting an earlier draft of this brief:** LIDO-XML
import *and* export are both real, in-scope requirements for conserFAIRy —
not external consortium-only concerns. This follows directly from §1's
FAIRification-node framing. OWL/RDF support, and full LIDO support generally,
will lag the LIDO subprofile's own development timeline (outside
conserFAIRy's control), but the import/export layer should be architected
for it now: a **pluggable interface/registry** (one `Exporter`/`Importer`
implementation per format), even though only the terminology-based format
is implemented today.

**The tooling situation is asymmetric, and currently only half-solved:**
- **Import (LIDO-XML → internal schema):** leans on the consortium's
  dedicated LIDO2RDF adapter (LIDO-XML → RDF); conserFAIRy's remaining job
  is mapping that RDF into the internal SKOS/generated schema. Reasonably
  well-covered architecturally already.
- **Export (internal schema → LIDO-XML):** the LIDO2RDF adapter is
  one-directional and doesn't help here. **No candidate tool identified
  yet.** Recommended direction: a dedicated serializer (e.g. lxml-based)
  walking the *validated* representation (the §8.3 quality-model output,
  not the lenient storage model directly) and emitting LIDO-XML via
  template/serialization logic — rather than routing through RDF/XML as an
  intermediate, since RDF serialization order isn't deterministic and is a
  poor source for reliably hitting a strict target XML schema.
- **Open question (§12 Q5):** what is the LIDO2RDF adapter actually built
  on — declarative RML/YARRRML-style mappings, or bespoke code? If
  declarative, there's a *chance* (not a guarantee) those mapping
  definitions could be partially inverted or reused as a starting point for
  the export serializer instead of writing it fully from scratch. Worth
  checking before committing engineering time to a from-scratch build.
- YARRRML/tarql, raised earlier as general-purpose translation candidates,
  are dropped — the dedicated adapter covers import, and neither tool
  addresses the export direction either.

### 8.5 Frontend non-blocking validation/quality-report tooling — options, undecided
Three candidate approaches for evaluating a record against the §8.3
quality model client-side (color-coding fields, tooltips, a per-record and
collection-wide completeness report — all advisory, never gating save):

1. **ajv + generated JSON Schema.** Collects all violations in one pass
   (`allErrors: true`); supports `if`/`then`/`else` (LinkML's JSON Schema
   generator has been taught to carry `ClassRule` preconditions through this
   way, promising for the "mandatory-if-existent" tier). No native
   "recommended" keyword — needs a small separately-generated side-list
   merged in. Error messages are technical and need a human-readable
   translation layer.
2. **Zod.** TypeScript-native; `.safeParse()` also collects all issues;
   integrates cleanly with react-hook-form. Can infer its own static types
   (`z.infer<>`), potentially replacing a separate `gen-typescript` step.
   No native severity tagging either (same custom-tagging work needed).
   Weaker generator support today — would mean LinkML→JSON Schema→Zod via a
   conversion tool, or hand-maintained Zod schemas with their own sync risk.
3. **Hand-rolled**, against a small generated manifest
   (`{slotName, severity, condition}`). Simplest mental model, zero
   dependencies, naturally expresses the exact four tiers — but reimplements
   nested/array/multivalued traversal that ajv/Zod already solve, and the
   metadata standard's breadth (production technique, samples, condition
   assessment, etc.) makes that traversal non-trivial to redo well.

Current lean, **not a decision**: ajv + JSON Schema, since it reuses the
same generated artifact a LinkML-based pipeline would already produce,
rather than introducing a second generated format — but this should be
prototyped briefly against the actual form renderer before committing
(§12 Q7).

## 9. Visibility & publishing

### 9.1 Requirement
Records (both structured §4.1 and unstructured §4.2) and Vocabularies
objects (Concepts and ConceptSchemes, §5) need a visibility model: visible
only to the admin/owning user by default, or flagged as published and
visible to the public. This is new functionality, not previously specified.

### 9.2 Granularity — open (§12 Q9)
- ConceptSchemes: does "published" apply at the scheme level only, with all
  Concepts in it inheriting visibility — or is it independently settable
  per-Concept too?
- Records: same scheme-vs-item question. Additionally, an unstructured
  upload (§4.2) may need visibility settable *independently* of the
  visibility of the structured metadata wrapped around it — an uploaded
  scan or report can carry sensitive provenance/ownership detail even when
  its surrounding metadata is entirely fine to publish. Not yet decided
  whether visibility is one flag per record, or split between
  metadata-visibility and attachment-visibility.

### 9.3 Permission mechanism — open (§12 Q10), shared with §10.3
Who can set/change the publish flag — the record/concept's owning user, an
institution-level admin, or both? Django has no built-in row-level/
object-level permission system; two realistic implementation paths:
`django-guardian`, or a lighter hand-rolled `owner`/`institution` +
`visibility` field check. This is the same underlying permission question
§10.3's identifier-based URL gating needs — solve it once for both, not
twice.

## 10. Identifiers & persistent URLs (PIDs)

### 10.1 Internal identifiers — fits the existing CIDOC CRM pattern
conserFAIRy needs its own internal, opaque identifiers for Records,
ConceptSchemes, and Concepts — usable both as primary keys and as the basis
for app-internal URLs, e.g.:
- `conserFAIRy/documentation/X364747474`
- `conserFAIRy/conceptSchemes/K94338438436843`
- `conserFAIRy/conceptSchemes/K94338438436843/concepts/L738787438743`

This is not a new modeling concept — it fits §7's existing CIDOC CRM
commitment directly: CRM already models multiple, typed identifiers per
entity via `E42 Identifier` + `P2 has type`. "conserFAIRy-internal
identifier" becomes just another typed identifier in a pattern the project
already uses, which also gives a clean answer for institutional namespaces:
- conserFAIRy's own identifier is canonical, **always** — used in the
  database and as the RDF subject URI.
- An institution's own namespace identifier, if/when wanted, is modeled as
  an *additional*, typed, alias identifier, linked via `owl:sameAs` only for
  aliases deliberately added — not as blanket future-proofing for every
  conceivable future namespace change. See §10.2 (open, longer-term).

Identifiers should be opaque — non-sequential, non-guessable — by design;
this is already implied by the example identifiers above, but worth stating
as an explicit requirement, particularly because of §10.3's frontend-only
gating: sequential/guessable IDs would make enumeration of non-published
content trivial.

### 10.2 URL path shape and w3id
The URL **path shape** (`/documentation/{id}`, `/conceptSchemes/{id}/concepts/{id}`,
etc.) should be decided early and treated as close to immutable once any
URL under it has been shared externally — changing it later means a
sameAs/redirect entry for every previously-issued PID, which is exactly the
bookkeeping burden a PID scheme is supposed to avoid. The **domain**, by
contrast, can stay flexible: registering a w3id redirect for the app's
whole URL space is a sound, standard mechanism for decoupling the long-term
PID from wherever the app happens to be hosted at any given time.

**Open, longer-term, not urgent (§12 Q11):** whether/how to let an
institution use its own namespace at some point. Straightforward via the
sameAs-alias pattern in §10.1 once it's actually needed — no need to design
this further before there's a concrete institution asking for it.

### 10.3 Access enforcement — frontend-only for now, explicitly time-boxed
Per §9, URLs for non-admin/non-published content should be blocked in the
frontend now. **This is a deliberate, time-boxed decision, not a smaller
version of the final solution:** frontend-only gating does not stop direct
API access — django-ninja currently has no enforcement of its own, so
anyone can read non-published content by calling the API directly,
regardless of what the React routes allow. See §11 for the explicit
condition under which this must be closed, and §9.3 for the permission
mechanism API-level enforcement would reuse.

## 11. Explicitly out of scope for now
- Automated/semi-automated annotation suggestion (§4.4) — manual annotation
  UI design can be discussed, but pipeline integration is future work
- Full LIDO-XML and OWL/RDF import/export *implementations* (§8.4) — both
  are confirmed in-scope goals (not external/deferred-to-consortium), but
  full implementation is gated on the LIDO subprofile's and conservation
  ontology's own development timelines. The import/export layer should
  still be *architected* for this now (§8.4), even though export in
  particular has no implementation path identified yet.
- **API-level enforcement of visibility/admin access control (§10.3)** —
  frontend-only gating is acceptable in the interim, but only as a
  deliberate, time-boxed gap. It must be closed **before any institutional
  data with real sensitivity is loaded, or before public launch** —
  whichever comes first — not deferred indefinitely.

## 12. Open questions to resolve before (or while) generating files
These are genuine gaps — don't let an agent silently assume an answer:

1. **What generates the Python/TypeScript models from the SKOS terminology,
   and when?** The SKOS terminology itself is confirmed as the authoritative
   source until the LIDO subprofile lands (§8.2). Not yet decided:
   whether/when to introduce a generator at all, and if so, LinkML
   (built in-memory from the SKOS graph — that part is decided, §8.2) versus
   direct JSON Schema generation versus SHACL versus the
   `openapi-typescript`-from-django-ninja complementary idea for the TS side.
2. **Relationship between 4.2 (unstructured) and 4.1 (structured) records:**
   Unstructured records could be updated to structured later for example by annotation
3. **Scope boundary for "annotation" (4.4) when it is eventually built:** 
  Using text-annotation js to allow humans to annotate manually, but also thinkable to offer machine annotation
4. **Are field-identifier Concepts (§5, §8.2) kept structurally separate
   from any future controlled-*value* vocabularies?** Needs confirming
   that a Concept never plays both the "field/column identifier" role and
   the "reusable controlled value" role at once — if it ever did, the
   cardinality-on-the-concept approach in §8.2 would need revisiting.
5. **What is the LIDO2RDF adapter built on (§8.4)?** Declarative
   (RML/YARRRML-style) vs. bespoke code — affects whether the export
   direction (currently unsolved) can reuse/invert any of its mapping
   definitions, or needs a fully from-scratch serializer.
6. **Should LinkML/schema `class_uri`/`slot_uri` bindings point at
   provisional CIDOC CRM terms now, or stay in a placeholder namespace
   until the conservation ontology is finished?** Either is workable;
   re-binding later is itself a migration with consequences for any
   RDF/JSON-LD already emitted under the old URIs, so this should be a
   deliberate choice, not a default.
7. **Frontend validation/runtime-checking tooling (§8.5):** ajv + generated
   JSON Schema vs. Zod vs. hand-rolled — a lean toward ajv is stated but not
   committed; recommend a short prototype against the actual form renderer
   before deciding.
8. **Schema/terminology versioning (§8.3):** should records be stamped with
   which terminology revision they were evaluated against, so quality
   reports reflect the correct historical ruleset rather than today's
   terminology? Direction recommended, mechanism not yet designed.
9. **Visibility granularity (§9.2):** per-scheme vs. per-concept; and for
   records, one visibility flag vs. separate metadata/attachment visibility.
10. **Publish-flag / object-level permission mechanism (§9.3, §10.3):**
    `django-guardian` vs. a hand-rolled owner/institution + visibility
    check — shared between the publish-flag feature and API-level access
    enforcement, so it should be designed once for both.
11. **Institutional namespace adoption (§10.2):** longer-term, not urgent —
    whether/how an institution can eventually use its own URI namespace via
    the sameAs-alias pattern. No need to design further until a concrete
    institution requests it.

## 13. Suggested mapping to Cline's memory-bank / .clinerules / skills

### 13.1 memory-bank/
- `memory-bank/projectbrief.md` ← §1, §3
- `memory-bank/productContext.md` ← §1, §4 (all subsections), §5, §6, §9,
  §10, §11
- `memory-bank/systemPatterns.md` ← §2, §7, the architectural consequence
  noted in §4.3, the LinkML/SKOS schema strategy in §8 (especially the
  storage-vs-quality-model split in §8.3 — this is a pattern, not a detail,
  and deserves to be findable on its own), and the CIDOC CRM identifier
  pattern in §10.1
- `memory-bank/techContext.md` ← §2 (stack/tooling specifics), §8.4–8.5
  (format-translation and validation tooling decisions once made)
- `memory-bank/activeContext.md` ← whatever subset of §4/§8/§9/§10 is being
  actively worked on at the time
- `memory-bank/progress.md` ← leave for the agent/you to populate as work
  proceeds
- **Additional context files worth adding once this work starts:**
  - `memory-bank/domain-glossary.md` — CIDOC CRM, SKOS, JSKOS, the
    exactMatch/closeMatch/relatedMatch distinction (§5.4), KuR vs. AAT vs.
    GND, LinkML's own terms (slot, class, enum, `ClassRule`), and now also
    the storage-model/quality-model distinction (§8.3) and the four-tier
    severity vocabulary (§8.2) — these last two are easy for an agent to
    quietly collapse back into "required means required" if not made
    explicit.
  - A short **decisions log** (can live as an appendix in
    `systemPatterns.md`): why Oxigraph is a projection and not the source of
    truth; why Postgres/JSONB over a graph-native store; why a schema
    generator (if used) is built from SKOS rather than hand-authored; why
    cardinality lives on the Concept directly here, unlike the general
    SKOS-reuse case (§8.2); why "required" never gates a save (§8.3).

### 13.2 .clinerules/
- `.clinerules/rules/backend.md` ← Django/Oxigraph-signal conventions from
  §2, §7, **plus the storage-model/quality-model split from §8.3 as a hard
  rule, not just documentation** — this is the single constraint most likely
  to quietly erode if an agent "helpfully" adds presence validation to the
  storage model later
- `.clinerules/rules/frontend.md` ← shadcn/Tailwind v4 conventions from §2,
  the "Create/View/Edit share one component stack" rule from §4.3, and the
  TypeScript + shadcn-first rule (already drafted as an actual file —
  `frontend.md` alongside this brief)
- `.clinerules/rules/rdf-skos.md` ← §7, vocabulary conventions from §5, and
  the CIDOC CRM identifier-typing pattern from §10.1
- `.clinerules/rules/schema-strategy.md` *(new, suggested)* ← §8 in full:
  SKOS as the authoritative source, the in-memory-generation principle
  (§8.2), the scope boundary against ORCID/user tables (§8.1), and the
  storage-vs-quality split (§8.3)
- `.clinerules/rules/visibility-and-access.md` *(new, suggested)* ← §9 and
  §10.3: the publish-flag/permission mechanism once decided, and an
  explicit reminder that frontend-only gating is time-boxed, not finished
- A small **universal rule** (no path scoping, always active) operationalizing
  §12's own instruction: open questions are not to be silently resolved —
  surface them in conversation and/or log new ones to `activeContext.md`
  rather than picking an answer and moving on
- A **conditional rule** scoped to both `backend/**/records/**` and
  `frontend/**/records/**` (plus wherever the generated schema artefacts end
  up living) enforcing §4.3's shared-component-stack constraint
  specifically — this is the constraint most likely to silently erode under
  iterative agent edits, so it benefits from firing automatically rather
  than living only as prose in `frontend.md`
- Open questions in §12 should NOT be silently resolved by the agent —
  surface them back to Lasse or capture them as TODOs in `activeContext.md`

### 13.3 .clineignore
Beyond the standard node_modules/build-output exclusions:
- The Oxigraph store's on-disk data directory — binary, regenerable, and per
  §7 explicitly not the source of truth; no reason for Cline to load it
- `.venv/`, `__pycache__/`, `*.pyc` (the generic ignore templates floating
  around are JS-biased and miss these)
- Django `staticfiles/`/`media/` if collected locally
- An explicit `!` exception for the SKOS terminology TTL file(s) — generic
  "exclude large data files" advice could otherwise swallow the one file
  that's structurally load-bearing for §4.3/§8's shared-renderer
  architecture. Migrations can stay accessible by default; only worth
  excluding if/when the history gets long.

### 13.4 Skills
On-demand skills are a better fit than always-on rules for the
occasionally-invoked, deterministic transformation work this project
generates a lot of:
- `skos-rdf-transform` — the rdflib-based blank-node flattening, URI
  migration, encoding fixes, JSKOS conversion logic, and (per §8.2) the
  in-memory SKOS→LinkML schema construction itself; pack the deterministic
  parts as scripts so only their output enters context
- `vocabulary-import` — the TS4NFDI/Dante import and CSV→SKOS mapping
  pipeline from §5.2
- `metadata-scheme-form-codegen` — once §4.3's shared renderer exists,
  "given the generated schema, generate/update the schema-driven form" as an
  invoked-when-needed skill rather than a standing rule
- `lido-export-serializer` *(new, suggested)* — once §8.4's export
  direction has an implementation, the LIDO-XML serialization logic is a
  good candidate for a skill: deterministic, occasionally invoked, and
  benefits from only its output entering context rather than the full
  serializer code
