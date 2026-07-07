# ConserFAIRy Agent Memory Bank - Master Setup File

**INSTRUCTIONS FOR AGENT:**
This document contains the complete Cline memory architecture for the ConserFAIRy project. 
Your task is to create the necessary files and directories in the workspace (`/home/mempellaenger/repos/conserFAIRy`) based on the contents below.

1. Create a file named `.clinerules` in the workspace root. Copy the exact contents from "## FILE: .clinerules" into it.
2. Create a directory named `knowledge/memory-bank/` in the workspace root.
3. For each section starting with "## FILE: memory-bank/", create the corresponding `.md` file inside the `knowledge/memory-bank/` directory and copy the exact contents into it.

---

## FILE: .clinerules
# ConserFAIRy Agent Rules

## 1. Core Architecture & Monorepo
- Workspace root: `/home/mempellaenger/repos/conserFAIRy`
- `backend/`: Django + django-ninja + PostgreSQL/JSONB.
- `frontend/`: Vite + React + TypeScript + shadcn/ui.
- `schemas/`: Generated Pydantic models and JSON Schema artifacts.
- `knowledge/`: SKOS TTL files, domain docs, and memory-bank.
- **Data Flow:** Relational database (Postgres) is the absolute source of truth. Oxigraph (SPARQL) is a disposable, derived projection rebuilt via Django signals. Never write to Oxigraph directly.

## 2. Schema Pipeline & Forms
- **Pipeline:** SKOS TTL (in `knowledge/`) -> Pydantic Models (in `schemas/`) -> JSON Schema (in `schemas/`).
- **Frontend Forms:** MUST be generated using `@rjsf/core` (React JSON Schema Form) consuming the JSON Schema. Use the `shadcn` theme.
- **Frontend Validation:** Uses `ajv`.
- Never hardcode form fields in the frontend.

## 3. Validation Strategy (Storage vs. Quality)
- **Storage Model:** Lenient (`extra='allow'`, all fields Optional). NEVER blocks a save.
- **Quality Model:** Strict. Enforces "required" fields for reporting. Runs AFTER save.
- Always generate two distinct Pydantic classes per concept: `<Concept>Storage` and `<Concept>Quality`.

## 4. Permissions & Visibility
- **Project Membership:** Hand-rolled Django models for institution-level access.
- **Object-Level Visibility:** Use `django-guardian` for split visibility on Records (independent flags for metadata vs. attachments).

## 5. Testing Standards
- Backend: `pytest` + `pytest-django`.
- Frontend: `vitest` + React Testing Library.

---

## FILE: memory-bank/agent-manual.md
# Agent Manual: Memory Bank Usage

## When to Read
- Read `activeContext.md` and `gotchas.md` at the start of EVERY session.
- Read `systemPatterns.md` or `productContext.md` when starting a new feature or if you lack domain context.
- If the user says "load context" or "check memory", read `activeContext.md`, `progress.md`, and `gotchas.md`.

## When to Write / Update
- **`activeContext.md`**: Update at the END of every session or when switching major tasks. Document what was done, what is currently being worked on, and the immediate next steps.
- **`progress.md`**: Update when a significant milestone or feature is completed.
- **`gotchas.md`**: If you encounter a weird bug, a framework quirk, or a pattern that breaks, document it here immediately so future sessions don't repeat the mistake.

---

## FILE: memory-bank/gotchas.md
# Gotchas & Known Pitfalls

## Django / Backend
- **JSONB Extra Fields:** When saving to the Storage Model, `extra='allow'` means typos in field names are silently ignored and not saved. Do not add strict validation to the storage model to "catch" these; the spec explicitly prefers losing typo'd data over blocking the save.
- **Oxigraph Sync:** Oxigraph is rebuilt via Django signals. If a test fails due to missing SPARQL data, ensure the signal handlers are mocked or triggered correctly in the test setup.
- **Split Visibility:** Remember that metadata visibility and attachment visibility are independent. Use `django-guardian` to assign these specific object-level permissions.

## React / Frontend
- **@rjsf/core Styling:** `@rjsf/core` default widgets don't match `shadcn/ui`. You MUST use the `@rjsf/shadcn` theme (or write custom widgets that wrap shadcn components). Do not mix raw HTML inputs with shadcn components in the form renderer.
- **Schema Versioning:** The form renderer must accept the specific JSON Schema version the record was created with, not just the "latest" schema from the `schemas/` folder.

---

## FILE: memory-bank/projectbrief.md
# Project Brief

## Mission
ConserFAIRy is a digital conservation science webapp for conservation documentation and SKOS vocabulary management. It acts as a FAIRification node for GLAM conservation scientists.

## Top-Level Navigation
1. **Records:** Documentation (structured metadata, headers, unstructured attachments).
2. **Vocabularies:** SKOS vocabulary management (including the metadata terminology itself).
3. **Graph Query:** Querying/visualizing the Oxigraph projection.

---

## FILE: memory-bank/productContext.md
# Product Context

## Documentation (Records)
- **Three Record Shapes:** Full structured report, Metadata header (partial), Attachment (unstructured file).
- **Shared Renderer:** Create, View, and Edit are ONE schema-driven form renderer (`@rjsf/core`) running in three modes.
- **Split Visibility:** Metadata and attachments have independent visibility flags.

## Vocabularies
- **Dual Role:** Manages external SKOS vocabularies AND the internal metadata terminology.
- **Frankenvoc:** Treeview drag & drop to reorganize hierarchy and reuse concepts across schemes.
- **Commentaries:** Users can comment on concepts/schemes they can see.

## Identifiers
- Opaque, non-sequential internal IDs.
- Modeled as CIDOC CRM `E42 Identifier` + `P2 has type`.

---

## FILE: memory-bank/systemPatterns.md
# System Patterns

## Data Architecture
- **Source of Truth:** Relational database (PostgreSQL with JSONB).
- **Graph Projection:** Oxigraph (SPARQL) is a disposable, derived projection. It is rebuilt from Postgres via Django signals. Never write directly to the graph store.

## Schema Pipeline
- **Flow:** SKOS TTL (in `knowledge/`) -> Pydantic Models (in `schemas/`) -> JSON Schema (in `schemas/`).
- **Dual Models:** Every concept generates two Pydantic classes:
  1. `<Concept>Storage`: Lenient (`extra='allow'`, all fields Optional). Gates persistence.
  2. `<Concept>Quality`: Strict. Enforces required fields for reporting. Runs after save.

## Permissions
- **Project Level:** Hand-rolled Django models for institution/project membership.
- **Object Level:** `django-guardian` for split visibility (independent flags for metadata vs. attachments).

---

## FILE: memory-bank/techContext.md
# Tech Context

## Backend
- Django + django-ninja
- PostgreSQL (JSONB)
- pyoxigraph
- django-guardian (object permissions)
- django-allauth (ORCID OAuth2)
- pytest + pytest-django

## Frontend
- Vite + React + TypeScript
- shadcn/ui
- @rjsf/core + @rjsf/shadcn (Forms)
- ajv (Validation)
- React Flow + dagre (Graph visualization)
- vitest + React Testing Library

## Tooling
- uv (Python dependencies)

---

## FILE: memory-bank/activeContext.md
# Active Context

## Current Focus
- [ ] Initialize project structure and memory bank.
- [ ] Set up the SKOS TTL -> Pydantic -> JSON Schema generation pipeline in `backend/scripts/`.

## Next Steps
- Implement the `<Concept>Storage` and `<Concept>Quality` dual-model generation logic.
- Set up the basic Django-ninja API structure.

---

## FILE: memory-bank/progress.md
# Progress

## Milestones
- [ ] Project architecture and Cline memory bank established.