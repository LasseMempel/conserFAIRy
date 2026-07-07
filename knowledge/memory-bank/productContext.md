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