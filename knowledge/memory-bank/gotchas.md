# Gotchas & Known Pitfalls

## Django / Backend
- **JSONB Extra Fields:** When saving to the Storage Model, `extra='allow'` means typos in field names are silently ignored and not saved. Do not add strict validation to the storage model to "catch" these; the spec explicitly prefers losing typo'd data over blocking the save.
- **Oxigraph Sync:** Oxigraph is rebuilt via Django signals. If a test fails due to missing SPARQL data, ensure the signal handlers are mocked or triggered correctly in the test setup.
- **Split Visibility:** Remember that metadata visibility and attachment visibility are independent. Use `django-guardian` to assign these specific object-level permissions.

## React / Frontend
- **@rjsf/core Styling:** `@rjsf/core` default widgets don't match `shadcn/ui`. You MUST use the `@rjsf/shadcn` theme (or write custom widgets that wrap shadcn components). Do not mix raw HTML inputs with shadcn components in the form renderer.
- **Schema Versioning:** The form renderer must accept the specific JSON Schema version the record was created with, not just the "latest" schema from the `schemas/` folder.