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

**Frontend**
- Vite + React + TypeScript
- shadcn/ui
- React Flow + dagre for graph/vocabulary visualization (Sigma.js is the
  identified upgrade path if/when graphs get large enough to need it)

**Tooling**
- uv for Python project/dependency management
- LinkML for shared YAML-based schema definitions (see §8) — generates the
  Python and TypeScript model representations consumed by backend and
  frontend respectively, for the **research-data** schema only (records,
  SKOS concept schemes/concepts). User/auth tables managed via ORCID stay as
  ordinary hand-written Django models — see §8.1 for that scope boundary.

## 3. Top-level navigation / feature areas
- **Records** — documentation (core module, see §4 — scope is broader than it
  used to be)
- **Vocabularies** — SKOS vocabulary management
- **Graph Query** — querying/visualizing the Oxigraph projection
- **Help & Guides**

## 4. Documentation module (Records)
This is the core module. "Documentation" covers three related capabilities:

### 4.1 Structured, schema-compliant creation
Forms generated from conserFAIRy's metadata scheme, producing data that
conforms to it. At the moment its organised as a hierarchical SKOS reference vocabulary, but will be aligned with a LIDO-subprofile and conservation ontology. It captures metadata about the objects features like production technique, material, type as well as name, origin, date, current position, examinations, samples, condition assessment, conservation/restoration measures and administrative metadata about the data itself like creator, language.

How this metadata scheme is actually defined/implemented (LinkML, the
SKOS/LinkML division of labour, multi-format export) is now specified in
**§8** — read together with this subsection and with §9's open question #1.

### 4.2 Unstructured upload 
GLAM institutions overwhelmingly produce unstructured or semi-structured
documentation in practice, so also files in different format should be uploadable (txt, md, pdf, odt, doc(x) etc.) but at least connected to basic metadata..

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
code path. The metadata scheme is the single source that both the Django side and the React form renderer consume. (§8 specifies *how*: LinkML is the
single authored source; Django and React each consume a generated artefact
derived from it, not the YAML directly.)

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

## 5.1 Commentaries
Users can comment on concepts and concepts schemes they are allowed to see to
- discuss a concept/concept scheme generally
- suggest specific values for additional properties/edits on existig ones, that can be accepted or rejected by concept scheme admins
- commments can also be replied to

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

## 8. Schema/model definition strategy (LinkML, multi-format I/O)

### 8.1 Core idea and scope boundary
Backend (Python/Django) and frontend (TypeScript/React) would otherwise imply
two independent model definitions for the same domain objects. To avoid
defining structure twice, the **research-data** schema — SKOS concept
schemes/concepts (§5) and Records in all formats (§4) — will be authored
once as YAML using **LinkML**, then generated into the Python and TypeScript
representations each side needs.

This is explicitly scoped to research data only. The **user/account tables
managed via ORCID** (§2) are ordinary relational, low-churn, and not shared
across the Python/TS boundary the way research data is — they stay as
conventional hand-written Django models, not LinkML-managed. Pulling them
into LinkML would add ceremony with no payoff.

### 8.2 SKOS-derived structural properties — recommended placement
The metadata standard carries properties beyond plain SKOS that determine
form generation — *mandatoryness*, *repeatability*, etc.

**Recommendation (needs Lasse's sign-off, see §9 Q5):** these map directly
onto LinkML's *native* slot-level attributes (`required`, `multivalued`,
etc.) — there is no need to invent custom extension properties on
`skos:Concept` to carry them. A LinkML **slot** represents "this field, in
this position, in this schema" and is the right place for cardinality rules;
a `skos:Concept` represents "this term, as a vocabulary entry" and is reused
across contexts. The slot's *range* is then bound to a SKOS concept scheme as
a (dynamically-sourced) controlled vocabulary, rather than encoding
mandatoryness etc. directly onto the concept. See §8.5 problem 2 for why the
alternative (annotating concepts themselves) breaks down.

### 8.3 Multi-format input/export — phased, but architected now
Target formats:
- **Now:** the SKOS/terminology-based metadata scheme (§4.1's current TTL
  thesaurus / its LinkML successor).
- **Later:** LIDO-XML and OWL/RDF, once the LIDO sub-profile and the
  CIDOC-CRM-aligned conservation ontology are finished. Until then, only the
  terminology-based scheme is implemented — LIDO/OWL support is explicitly
  deferred (see §9, out of scope), not abandoned.

To avoid a costly rewrite later, architect for the later formats now:
- Build the import/export layer as a **pluggable interface/registry**
  (e.g. one `Exporter`/`Importer` per format) even though only the
  terminology format has an implementation today. Adding LIDO-XML and
  OWL/RDF later should mean *adding* a new implementation, not restructuring
  the existing one.
- Decide early whether LinkML `class_uri`/`slot_uri` bindings point at real,
  stable ontology terms now (provisional CIDOC CRM upper terms where they
  already exist) or stay in a project-internal placeholder namespace pending
  the finished ontology. Either is workable, but pick deliberately — see §9
  Q6 — because re-binding URIs later is itself a migration with consequences
  for any RDF/JSON-LD already emitted under the old URIs.
- Keep Postgres/JSONB instance data keyed by stable LinkML **slot names**,
  independent of which ontology terms those slots are currently bound to.

### 8.4 Candidate format-translation tooling: YARRRML / RML / tarql
Raised as candidates for translating between formats; both are real, current
tools, but neither is a drop-in answer to the full requirement — see
§8.5 problem 3 for the gaps before committing to them in `techContext.md`.

### 8.5 Problems & open risks with this approach
1. **LinkML's Python and TypeScript generators are not at parity.** The
   Python side (Pydantic/dataclasses) is first-class and mature, and
   composes naturally with django-ninja, which is itself Pydantic-based —
   a genuine synergy. The TypeScript generator (`gen-typescript`) is
   officially supported but produces structural types/interfaces, not a
   runtime validator equivalent to Pydantic. If the frontend needs to
   validate user input against the schema (not just type-check it at
   compile time), that's an additional, separately-maintained layer (e.g.
   Zod) rather than something LinkML hands you symmetrically on both sides.
   This needs a decision, not an assumption (§9 Q7). There is also, as of
   this writing, an open community feature request for a LinkML→Prisma
   generator specifically because the Node/TypeScript ecosystem's
   database-tooling story lags the Python side — a useful signal that the
   TS-side generator ecosystem is the less-traveled path here.
2. **Conflating vocabulary semantics with form semantics.** Mandatoryness
   and repeatability are properties of *how a concept is used as a field in
   a given schema position*, not properties of the concept itself. The same
   `skos:Concept` (e.g. a material term) can legitimately be reused as the
   controlled value for multiple different fields, with different
   cardinality in each. Encoding "required"/"repeatable" directly onto the
   SKOS concept breaks the moment that concept is reused in a second context
   with different requirements. §8.2's recommendation (cardinality on the
   LinkML slot, vocabulary binding on the slot's range) avoids this, but it
   does mean the metadata scheme is no longer "just a SKOS TTL file" the way
   §9's existing open question #1 currently describes it — that question
   needs revisiting, not silently superseded.
3. **YARRRML/RML/tarql solve import, not export, and need scoping.**
   - YARRRML and RML are fundamentally *generative-into-RDF* tools: they
     take heterogeneous source data (CSV, JSON, XML, relational) and produce
     RDF. They are a reasonable fit for *ingesting* a LIDO-XML record or a
     legacy CSV into the RDF/ontology side later. They are not naturally
     suited to the reverse direction — emitting LIDO-XML or another non-RDF
     export format *from* RDF/LinkML instance data. That export direction
     is a separate, currently unaddressed tooling problem (§9 Q6).
   - YARRRML itself isn't directly executable: it has to be converted to
     RML first (via a parser), then run through a separate RML processor
     (the reference implementation, RMLMapper, is JVM-based) to actually
     produce RDF. That's an operational dependency on Java/JVM tooling
     inside an otherwise Python/Node stack, and the reference mapper loads
     all data into memory, which is a scalability ceiling worth knowing
     about up front even if current data volumes are nowhere near it.
   - tarql is narrower than it might look next to YARRRML/RML: it only
     converts **CSV** to RDF via hand-written SPARQL CONSTRUCT queries, with
     no native XML support. If LIDO-XML ingestion is the actual long-term
     target, tarql doesn't cover it — YARRRML/RML or a dedicated
     XML-to-RDF approach would be the relevant candidate, not tarql.
4. **Two-sources-of-truth risk re-introduced if scope drifts.** The whole
   point of LinkML here is "don't define the research-data model twice."
   If the LinkML schema, the SKOS TTL, and (eventually) a LIDO profile and
   an OWL ontology all separately claim to define overlapping structure,
   the project is back to multiple sources of truth, just one layer removed
   from where it started. §8.1–8.3 are written to keep LinkML as the single
   authored structural source, with SKOS/LIDO/OWL as *bound vocabularies or
   generated/derived artefacts* of it — but that division needs to be kept
   deliberately, not allowed to blur as the ontology and LIDO profile
   mature.

## 9. Explicitly out of scope for now
- Automated/semi-automated annotation suggestion (§4.4) — manual annotation
  UI design can be discussed, but pipeline integration is future work
- Full LIDO-XML and OWL/RDF import/export implementations (§8.3) — deferred
  until the LIDO sub-profile and the CIDOC-CRM-aligned conservation ontology
  are finished. The schema/tooling layer should still be *architected* for
  this now (§8.3), even though it isn't built yet.

## 10. Open questions to resolve before (or while) generating files
These are genuine gaps — don't let an agent silently assume an answer:

1. **What is "the metadata scheme" implemented in?**
   The current format of the metadata scheme is a hierarchical SKOS thesaurus in TTL RDF, which can be used to generate hierachical forms and be exported to proto exchange formats in JSON/CSV. **Under revision per §8** — the direction under discussion is LinkML-as-structural-source with SKOS-as-bound-vocabulary, not SKOS-TTL-as-everything. Not yet finalized; don't assume either answer.
3. **Relationship between 4.2 (unstructured) and 4.1 (structured) records:**
   Unstructured records could be updated to structured later for example by annotation
4. **Scope boundary for "annotation" (4.4) when it is eventually built:** 
  Using text-annotation js to allow humans to annotate manually, but also thinkable to offer machine annotation
5. **Where should mandatoryness/repeatability live?** As LinkML slot
   attributes with the slot's range bound to a SKOS-sourced dynamic
   vocabulary (recommended, §8.2), or as custom extension properties on
   `skos:Concept` itself? Affects how the LinkML schema is drafted, so
   needs deciding before that work starts, not after.
6. **What is the export-direction tooling for LIDO-XML / OWL-RDF?**
   YARRRML/RML/tarql (§8.4) address ingestion (X → RDF) but not the reverse.
   No candidate has been identified yet for RDF/LinkML-instance → LIDO-XML
   or → OWL/RDF serialization. Also unresolved: whether LinkML
   `class_uri`/`slot_uri` bindings should point at provisional CIDOC CRM
   terms now or stay in a placeholder namespace until the ontology is
   finished (§8.3).
7. **Does the frontend need runtime schema validation, not just types?**
   LinkML's TypeScript generator produces structural types, not a Pydantic
   equivalent (§8.5 problem 1). Decide whether validation stays
   server-side-only, or whether the frontend needs its own
   generated/maintained runtime validator (e.g. Zod) alongside the
   LinkML-generated types.

## 11. Suggested mapping to Cline's memory-bank / .clinerules / skills

### 11.1 memory-bank/
- `memory-bank/projectbrief.md` ← §1, §3
- `memory-bank/productContext.md` ← §1, §4 (all subsections), §5, §6, §9
- `memory-bank/systemPatterns.md` ← §2, §7, the architectural consequence
  noted in §4.3, and the LinkML schema strategy in §8
- `memory-bank/techContext.md` ← §2 (stack/tooling specifics), §8.3–8.4
  (format-translation tooling decisions once made)
- `memory-bank/activeContext.md` ← whatever subset of §4/§8 is being
  actively worked on at the time
- `memory-bank/progress.md` ← leave for the agent/you to populate as work
  proceeds
- **Additional context files worth adding once the LinkML/SKOS work starts:**
  - `memory-bank/domain-glossary.md` — short definitions of CIDOC CRM, SKOS,
    JSKOS, the exactMatch/closeMatch/relatedMatch distinction (relevant to
    §5.4), KuR vs. AAT vs. GND, and now LinkML's own terms (slot, class,
    enum, permissible value, dynamic enum). Worth doing given the
    GWDG-hosted open-weight models in the Cline workflow are more likely
    than a frontier model to fumble these distinctions.
  - A short **decisions log** (can live as an appendix in
    `systemPatterns.md`) capturing *why*, not just what: why Oxigraph is a
    projection and not the source of truth, why Postgres/JSONB over a
    graph-native store, why LinkML over hand-syncing Python/TS models, why
    cardinality lives on LinkML slots rather than on SKOS concepts (§8.2).

### 11.2 .clinerules/
- `.clinerules/rules/backend.md` ← Django/Oxigraph-signal conventions from §2, §7
- `.clinerules/rules/frontend.md` ← shadcn/Tailwind v4 conventions from §2,
  the "Create/View/Edit share one component stack" rule from §4.3, and the
  TypeScript + shadcn-first rule (drafted as an actual file — see
  `frontend.md` alongside this brief; not just a placeholder anymore)
- `.clinerules/rules/rdf-skos.md` ← §7, vocabulary conventions from §5
- `.clinerules/rules/schema-strategy.md` *(new, suggested)* ← §8 in full:
  LinkML as the single authored research-data schema source, the
  scope boundary against ORCID/user tables (§8.1), and the slot-vs-concept
  placement rule for mandatoryness/repeatability (§8.2)
- A small **universal rule** (no path scoping, always active) operationalizing
  §10's own instruction: open questions are not to be silently resolved —
  surface them in conversation and/or log new ones to `activeContext.md`
  rather than picking an answer and moving on
- A **conditional rule** scoped to both `backend/**/records/**` and
  `frontend/**/records/**` (plus wherever the LinkML schema file(s) end up
  living) enforcing §4.3's shared-component-stack constraint specifically —
  this is the single constraint most likely to silently erode under
  iterative agent edits, so it benefits from firing automatically rather
  than living only as prose in `frontend.md`
- Open questions in §10 should NOT be silently resolved by the agent —
  surface them back to Lasse or capture them as TODOs in `activeContext.md`

### 11.3 .clineignore
Beyond the standard node_modules/build-output exclusions:
- The Oxigraph store's on-disk data directory — binary, regenerable, and per
  §7 explicitly not the source of truth; no reason for Cline to load it
- `.venv/`, `__pycache__/`, `*.pyc` (the generic ignore templates floating
  around are JS-biased and miss these)
- Django `staticfiles/`/`media/` if collected locally
- An explicit `!` exception for the LinkML schema YAML file(s) (and, while it
  still exists, the metadata-scheme TTL) — generic "exclude large data
  files" advice could otherwise swallow the one file that's structurally
  load-bearing for §4.3/§8's shared-renderer architecture. Migrations can
  stay accessible by default; only worth excluding if/when the history gets
  long.

### 11.4 Skills
On-demand skills are a better fit than always-on rules for the
occasionally-invoked, deterministic transformation work this project
generates a lot of:
- `skos-rdf-transform` — the rdflib-based blank-node flattening, URI
  migration, encoding fixes, and JSKOS conversion logic already used
  manually on the LEIZA conservation thesaurus; pack the deterministic parts
  as scripts so only their output enters context
- `vocabulary-import` — the TS4NFDI/Dante import and CSV→SKOS mapping
  pipeline from §5.2
- `metadata-scheme-form-codegen` — once §4.3's shared renderer exists,
  "given the LinkML schema, generate/update the schema-driven form" as an
  invoked-when-needed skill rather than a standing rule