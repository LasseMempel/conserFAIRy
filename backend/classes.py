from pydantic import BaseModel

class Concept(BaseModel):

    # URI
    concept: str

    # SKOS Concept Schemes
    inScheme: str # necessary!
    topConceptOf: str | None = None

    # SKOS Mapping Properties
    broadMatch: list[str] | None = None
    narrowMatch: list[str] | None = None
    relatedMatch: list[str] | None = None
    closeMatch: list[str] | None = None
    exactMatch: list[str] | None = None

    # SKOS Semantic Relations
    broader: str | None = None
    narrower: list[str] | None = None
    related: list[str] | None = None

    # SKOS Lexical Labels
    prefLabel: str # necessary!
    altLabel: list[str] | None = None

    # SKOS Notations
    notation: str # necessary!

    # SKOS Documentation Properties (Note Properties)
    note: str | None = None
    changeNote: str | None = None
    definition: str | None = None
    editorialNote: str | None = None
    example: str | None = None
    historyNote: str | None = None
    scopeNote: str | None = None

class ConceptScheme(BaseModel):
    # SKOS Concept Schemes
    conceptScheme: str # necessary!
    hasTopConcept: list[str] | None = None