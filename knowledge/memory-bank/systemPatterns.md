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