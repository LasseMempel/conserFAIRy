# System Patterns

## Data Architecture
- **Source of Truth:** Relational database (PostgreSQL with JSONB).
- **Graph Projection:** Oxigraph (SPARQL) is a disposable, derived projection. It is rebuilt from Postgres via Django signals. Never write directly to the graph store.

## Schema Pipeline for metadata reports
- **Flow:** SKOS TTL (in `knowledge/`) → Pydantic Models (in `schemas/`) → JSON Schema (in `schemas/`).
- **Dual Models:** Every concept generates two Pydantic classes:
  1. `<Concept>Storage`: Lenient (`extra='allow'`, all fields Optional). Gates persistence.
  2. `<Concept>Quality`: Strict. Enforces required fields for reporting. Runs after save.
- **Frontend Forms:** MUST be generated using `@rjsf/core` (React JSON Schema Form) consuming the JSON Schema. Use the `shadcn` theme (`@rjsf/shadcn`).
- **Frontend Validation:** Uses `ajv`.
- **Never hardcode form fields** in the frontend for the Conservation report metadata feature.

## Validation Strategy (Storage vs. Quality)
- **Storage Model:** Lenient (`extra='allow'`, all fields Optional). NEVER blocks a save.
- **Quality Model:** Strict. Enforces "required" fields for reporting. Runs AFTER save.
- Always generate two distinct Pydantic classes per concept: `<Concept>Storage` and `<Concept>Quality`.

## Permissions & Visibility
- **Project Level:** Hand-rolled Django models for institution/project membership.
- **Object Level:** `django-guardian` for split visibility (independent flags for metadata vs. attachments).