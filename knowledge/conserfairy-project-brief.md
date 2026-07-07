# ConserFAIRy — Project Brief & Feature Specification

## Purpose
Requirements and architecture decisions for conserFAIRy, tracked here as the
single current reference.

## 1. Mission & users
ConserFAIRy is a digital conservation science webapp for conservation
documentation and SKOS vocabulary management, built at LEIZA
(Leibniz-Zentrum für Archäologie) within NFDI4Objects Task Area 4
("Protecting"). It is a **FAIRification node** for conservation data —
LIDO-XML import and export (§8.4) and persistent identifiers (§10) both
follow from this.

Target users: **conservation scientists** working in GLAM settings.

## 2. Architecture & tech stack
Monorepo: `backend/` + `frontend/`.

**Backend**
- Django + django-ninja (Pydantic-based; §8)
- PostgreSQL/JSONB — system of record
- Django Guardian
- Oxigraph (pyoxigraph) — SPARQL triplestore, a derived/rebuildable RDF
  projection of Postgres via Django signals; not authoritative, treat as
  disposable
- ORCID OAuth2 via django-allauth
- nginx (production)

**Frontend**
- Vite + React + TypeScript, shadcn/ui
- React Flow + dagre for graph/vocabulary visualization (Sigma.js is the
  scale-up path)

**Tooling**
- uv for Python dependency management
- Schema generation: SKOS terminology (version-controlled TTL) → Pydantic
  model classes, built programmatically from the SKOS graph → JSON Schema
  derived from those Pydantic models for the frontend. (§8)

Pydantic is used in two flavours (§8.3): a lenient **storage model** that
gates persistence, and a strict **quality/report model** that never gates
persistence. Keep these as separate classes.

## 3. Top-level navigation / feature areas
- **Records** — documentation (§4)
- **Vocabularies** — SKOS vocabulary management (§5)
- **Graph Query** — querying/visualizing the Oxigraph projection (§6)
- **Help & Guides**

Visibility/publishing (§9) and identifiers/URLs (§10) apply uniformly to
Records and Vocabularies — specified once, centrally.

## 4. Documentation module (Records)

### 4.1 Record types & structured creation
Three record shapes:
- **(a) Full structured metadata report** — a complete instance of the
  metadata scheme.
- **(b) Metadata header** — a partial structured record: identifier/
  inventory number, institutional holder, place, and object type/material —
  2–3 self-sufficient branches of the metadata scheme, without
  conservation-event detail.
- **(c) Attachment** — an unstructured or semi-structured file, optionally
  carrying its own metadata and/or describing specific conservation
  measures in free text (§4.2).

Headers (b) can be linked to attachments (c). Promoting an attachment's
content into a fuller header/report, or supplying a missing header,
happens later via annotation and/or form-filling (§4.4) — not built yet.

Forms are generated from the metadata scheme (§8) and drive create/view/
edit uniformly (§4.3). Metadata scheme content: object features
(production technique, material, type), name, origin, date, current
position, examinations, samples, condition assessment, conservation/
restoration measures, plus administrative metadata (creator, language).

### 4.2 Unstructured upload
Files (txt, md, pdf, odt, doc(x), etc.) are uploadable, connected to at
least a header (4.1b). An attachment's visibility is independent of its
linked metadata's visibility (§9.2).

### 4.3 Viewer + Editor — shared component stack
Create, View, and Edit are one schema-driven form renderer running in
three modes, not three separate UIs. Django and React each consume the
same generated schema artifact (§8) — never the SKOS graph directly. The
renderer surfaces the quality/completeness report (§8.3) and renders each
record against the terminology version it was created/last modified under
(§8.2, §8.3).

### 4.4 Future: Annotation (out of scope for now, §11)
Manual text-annotation UI against normdata vocabularies (GND, the LEIZA
KuR thesaurus, Getty AAT) and ontology classes/properties.

Longer-term direction, not committed: a flagged material/measure/tool in
an attachment's annotation could propose a corresponding section of a
structured record; header-level fields (e.g. an inventory number) could
similarly be derived from annotations. Proposed additions need moderator
approval — annotation interpretations vary — but that variation is itself
valuable as ML training data regardless of whether it gets merged. The
vocabulary commentary/suggestion workflow (§5.1) may extend to Records the
same way (§11).

## 5. Vocabularies module
Web-based SKOS Editor: datatable and tree views. CSV (SKOS-convention
columns) or SKOS RDF (ttl/json-ld) import.

Concepts support custom, non-SKOS/non-DCT RDF properties — useful
generally (institutions may need project-specific properties) and required
for the metadata terminology's own mandatoryness/repeatability properties
(§8.2), so those stay visible, editable, and discussable through the same
commentary workflow (§5.1) as any other vocabulary content.

The metadata terminology itself (§4.1, §8) is managed here as an ordinary
vocabulary: each Concept is a unique field/column-mapping target — e.g.
"material the object consists of" and "material used in the measure" are
distinct Concepts, not one reused.

## 5.1 Commentaries
Users can comment on concepts/schemes they can see: general discussion,
suggested edits/values (admin-mediated accept/reject, with a
modified-accept option), and threaded replies.

Comments get stable identifiers, same pattern as everything else (§10.1).

## 5.2 NFDI Vocabulary import
TS4NFDI and Dante/VZG (possibly via TS4NFDI) as import sources for
institutional customization.

## 5.3 Drag & Drop — "Frankenvoc"
Treeview drag & drop to reorganize hierarchy; cross-scheme drag & drop to
reuse concepts between two loaded trees.

## 5.4 Foreign concept provenance as mappings
Reused concepts get `skos:exactMatch` to their origin automatically (popup
option to change to `closeMatch`/`relatedMatch` on redefinition).

## 6. Graph Query module
Query/visualize the Oxigraph projection. React Flow + dagre now, Sigma.js
at scale.

## 7. RDF / domain conventions
- CIDOC CRM alignment for conservation treatment events (KuR ontology +
  LEIZA thesaurus URIs)
- Oxigraph: derived projection, not source of truth
- Identifiers: CIDOC CRM `E42 Identifier` + `P2 has type` pattern, applied
  uniformly to Records, Concepts/ConceptSchemes, and Comments (§10.1)

## 8. Schema/model definition strategy

### 8.1 Scope
The research-data schema (SKOS concept schemes/concepts §5, Records §4) is
generated from one source. User/account tables (ORCID-managed) stay
hand-written Django models, outside this pipeline.

### 8.2 Generation pipeline
SKOS terminology is the authoritative, hand-edited source — version-
controlled as TTL in the project's Git repository.

Pipeline: a Python module reads the terminology (rdflib/pyoxigraph) and
builds Pydantic model classes programmatically, directly from
the SKOS graph. JSON Schema for the frontend is derived directly from
these Pydantic models (`model_json_schema()`).

**Versioning:** a new terminology version is generated on tagged releases —
not every commit — once the pipeline detects an actual content change. For each version, the
generated Pydantic model classes and JSON Schema are persisted (a versions
table, not regenerated per request/page-load). Every Record stores which
terminology version it was created/last modified against; the Viewer/
Editor (§4.3) loads that stored version's schema to render the record,
independent of what the terminology looks like today. This SKOS-based
pipeline is an interim solution ahead of the LIDO subprofile.

Concepts/classes carry only their canonical SKOS terminology URI — no
`class_uri`/`slot_uri`-style ontology binding yet.

Mandatoryness/repeatability are custom RDF properties on the Concepts
themselves — properties of the field-identifier Concept (§5), encoded into
the generated artifacts as:

| Term (DE) | Term (EN) | Construct |
|---|---|---|
| verpflichtend | required | in the quality-model's JSON Schema `required` array (never the storage model's) |
| empfohlen | recommended | a separate generated severity manifest merged in at evaluation time |
| mandatory if existent | conditionally required | Pydantic validators / JSON Schema `if`/`then`/`else` |
| optional | nice-to-have | default (absence of the above) |

### 8.3 Validation: storage model vs. quality model
Real records routinely violate their own "required" fields. Priority:
**prefer violating data over no data.**

Two generated Pydantic artifacts, not one:
- **Storage model** — what django-ninja validates against and persists to
  JSONB. All fields optional, type-checked only, `extra='allow'`. The only
  validation that gates a save.
- **Quality/report model** — the full four-tier evaluation (§8.2), run
  after storage (server-side on read, mirrored client-side per §8.5),
  never before it. "Required" means "flagged at highest severity in the
  report," never "blocks write."

`extra='allow'` means a typo'd field name silently goes nowhere instead of
erroring — accepted, given the stated priority.

### 8.4 Multi-format import/export — LIDO-XML
LIDO-XML import and export are both in-scope (§1). Architected as a
pluggable `Exporter`/`Importer` registry — one implementation per format;
only the terminology-based format exists today.

- **Import:** via the consortium's LIDO2RDF adapter (LIDO-XML→RDF), mapped
  into the internal schema. Adapter internals not investigated further for
  now (§12).
- **Export:** no candidate tool yet. Direction: a dedicated serializer
  (e.g. lxml-based) walking the quality-model (validated) representation
  and emitting LIDO-XML directly — not via RDF/XML as an intermediate,
  since RDF serialization order is non-deterministic.
- Export supports selecting a target namespace/base-URI to substitute an
  institution's own identifiers into the output — applied at export time
  only, not stored as a mapping (§10.1).

### 8.5 Frontend validation tooling
Use ajv + generated JSON Schema, or Zod — whichever integrates with the
form renderer with the least custom work. No hand-rolled evaluator unless
neither fits cleanly.

## 9. Visibility & publishing

### 9.1 Requirement
Records and Vocabulary objects (Concepts, ConceptSchemes) need visibility:
private (owner/project members only) or published (public).

### 9.2 Granularity
- **ConceptSchemes:** scheme-level only — no per-Concept visibility.
- **Records:** metadata-visibility and attachment-visibility are
  independent flags.
  - Published metadata + unpublished attachment — the preferred baseline:
    useful public information without exposing a possibly sensitive raw
    file.
  - Unpublished metadata + published attachment — also valid: lets
    full-text search over the attachment surface the file even when its
    structured metadata isn't public.
  - No minimum forced disclosure.

### 9.3 Permission mechanism
Hand-rolled project/membership model. Vocabularies and Records belong to a
Project (institution-scoped). Creator = owner/admin. Owners can promote
members to admin. Non-public projects also admit **contributors**: added
members who can view the project and add commentaries/suggestions (§5.1),
without admin rights.

## 10. Identifiers & persistent URLs

### 10.1 Internal identifiers
Opaque, non-sequential, non-guessable identifiers for Records,
ConceptSchemes, Concepts, and Comments (§5.1), e.g.:
- `conserFAIRy/documentation/X364747474`
- `conserFAIRy/conceptSchemes/K94338438436843`
- `conserFAIRy/conceptSchemes/K94338438436843/concepts/L738787438743`

Modeled as CIDOC CRM `E42 Identifier` + `P2 has type`. conserFAIRy's own
identifier is always canonical — used as the DB primary key and as the RDF
subject URI. Institutional namespace identifiers are applied only at
export time (§8.4), not stored as aliases.

### 10.2 URL path shape & w3id
Path shape (`/documentation/{id}`, `/conceptSchemes/{id}/concepts/{id}`,
etc.) is treated as immutable once shared externally. The domain stays
flexible via a w3id redirect for the app's URL space.

### 10.3 Access enforcement
Unpublished/unauthorized content is blocked in **both backend and
frontend**, from the start. Backend (django-ninja) enforces per-request via
the §9.3 project-membership/visibility check on every relevant endpoint.
The frontend route guard defers to the same check — calling the API and
reacting to a 403/"not a member" response — rather than deciding access
independently on the client.

## 11. Out of scope for now
- Automated/semi-automated annotation suggestion pipeline (§4.4) — manual
  annotation UI can be discussed; pipeline/ML integration is future work
- Full LIDO-XML and OWL/RDF import/export implementations (§8.4) —
  architecture is scoped now, full implementation follows the LIDO
  subprofile's and conservation ontology's own timelines
- Extending the commentary/suggestion workflow (§5.1) to Records — a
  considered future direction, not committed

## 12. Open questions
- LIDO2RDF adapter internals (declarative RML/YARRRML-style vs. bespoke
  code) — deprioritized until the LIDO subprofile itself is further along
  (§8.4).
