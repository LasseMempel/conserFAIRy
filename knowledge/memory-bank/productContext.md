# Product Context

## Records Documentation

The metadata scheme is a **hierarchy of fields** for describing conservation records, with some fields mandatory, some repeatable, and different data types (strings, URIs, dates, etc.).

### Metadata Scheme Hierarchy

#### Object Description & Administration Branches:
- **DA2D73 Objektbeschreibung** (https://www.w3id.org/conservation/terms/metadata/DA2D73)
  - Container for information describing the object's composition, features, and significance

- **B51DAF Objektkennzeichnung** (https://www.w3id.org/conservation/terms/metadata/B51DAF)
  - Container for unique identification of the object and capturing identifying features that ensure unambiguous assignment during the entire treatment process

- **AC16G1 Administrative Metadaten** (https://www.w3id.org/conservation/terms/metadata/AC16G1)
  - Container for administrative information about the report and its contents

#### Object Biography Event Branches:
- **B3FCA1 Untersuchung** (https://www.w3id.org/conservation/terms/metadata/B3FCA1)
  - Container for information related to systematic examination and analysis of objects to determine material composition, object structure, manufacturing techniques, conservation states, and/or other questions

- **F52262 Zustandserfassung** (https://www.w3id.org/conservation/terms/metadata/F52262)
  - Container for information documenting the systematic assessment of an object's condition at a defined point in time

- **B7B8B6 Gefährdungspotential** (https://www.w3id.org/conservation/terms/metadata/B7B8B6)
  - Container for structuring all information about potential hazards emanating from an individual (treated) object and measures for protecting health when handling these objects. Does NOT include general occupational safety measures mandated by law for conservators.

- **CD5C3F Probenahme** (https://www.w3id.org/conservation/terms/metadata/CD5C3F)
  - Container for information documenting the systematic removal of material samples from an object for analysis and examination purposes

#### Conservation Concept Branch:
- **BAA258 Erhaltungskonzept** (https://www.w3id.org/conservation/terms/metadata/BAA258)
  - Container for all information captured during the planning, preparation, and execution of a conservation measure

#### Additional Branches:
- **C93638 Präventive Konservierung** (https://www.w3id.org/conservation/terms/metadata/C93638)
  - Container for all information regarding preventive measures that aim to reduce damage to objects without direct intervention on the object itself

- **F2AG55 Verwendete Literatur** (https://www.w3id.org/conservation/terms/metadata/F2AG55)
  - Information about literature used for creating the report

### Key Design Decisions

- **Full Report Generation:** The app supports creating complete reports using the entire metadata scheme tree as a form constructor
- **Free Text Integration:** Historical conservation event information hidden in free text documents and database entries should be stored as files and connected to a report that might only have spare information in the administrative object description branches of the metadata scheme . This allows future migration where information can be structured and integrated into event branches for complete reports
- **Export Formats:** Currently custom CSV/JSON/XML formats, migrating towards a **LIDO standard XML subprofile** mapped with a conservation ontology to enable RDF conversion

---

## Vocabularies

### Core Functionality

1. **Term Import:** Import term lists from CSV/Excel files
2. **Data Table View:** Users can manipulate, extend, and export terms in a datatable
3. **Tree View:** Visualize term hierarchies when rows contain hierarchical information via skos:broader, skos:narrower relationships
4. **Internal Vocabularies:** The app manages **internal** vocabularies created from scratch or imported - not external ones
5. **Custom Properties:** Extended SKOS terminology allows custom properties (even the metadata scheme for records is SKOS-based and can be processed the same way)

### Frankenvoc (Separate Feature)

- Fetches **external** vocabularies and displays them side-by-side
- Treeview drag & drop to reorganize hierarchy and reuse concepts across schemes
- Documents "loaning" of concepts via **skos:match** properties
- Allows dragging branches/concepts from external vocabularies into internal ones

---

## Commentaries (Core Feature)

- **URI-based Access:** Concept schemes, concepts, and commentaries are accessible by calling their URI and getting redirected to the app (using w3id for app routes)
- **Internal Users:** Can comment on terminology and suggest changes in comments:
  - Changing position in hierarchy
  - Modifying label text
  - Editing definition text
- **External Users:** Can contribute if the terminology is set to public, enabling the scientific community to share and develop common terminology for their domain
- **Web Annotation Ontology:** Used for commentaries
- **Motivation Tracking:** The full graph of terminology and comments can be exported or queried to determine, for example, by what motivation a certain change was requested or who requested it