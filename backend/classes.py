from pydantic import BaseModel, HttpUrl

class Concept(BaseModel):

    # URI
    concept: HttpUrl

    # SKOS Concept Schemes
    inScheme: HttpUrl  # necessary!
    topConceptOf: HttpUrl | None = None

    # SKOS Mapping Properties
    broadMatch: list[HttpUrl] | None = None
    narrowMatch: list[HttpUrl] | None = None
    relatedMatch: list[HttpUrl] | None = None
    closeMatch: list[HttpUrl] | None = None
    exactMatch: list[HttpUrl] | None = None

    # SKOS Semantic Relations
    broader: HttpUrl | None = None
    narrower: list[HttpUrl] | None = None
    related: list[HttpUrl] | None = None

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
    conceptScheme: HttpUrl # necessary!
    hasTopConcept: list[HttpUrl] | None = None