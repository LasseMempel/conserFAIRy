from pydantic import BaseModel, HttpUrl

class Concept(BaseModel):
    # SKOS Concept Schemes
    URI: HttpUrl  # mandatory!
    inScheme: HttpUrl  # mandatory!
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
    prefLabel: dict[str, str] # mandatory!
    altLabel: dict[str, list[str]] | None = None
    hiddenLabel: dict[str, list[str]] | None = None

    # SKOS Notations
    notation: str # mandatory!

    # SKOS Documentation Properties (Note Properties)
    note: dict[str, list[str]] | None = None
    changeNote: dict[str, list[str]] | None = None
    definition: dict[str, str] | None = None
    editorialNote: dict[str, list[str]] | None = None
    example: dict[str, list[str]] | None = None
    historyNote: dict[str, list[str]] | None = None
    scopeNote: dict[str, list[str]] | None = None

    # Dublin Core Terms
    rights: str | None = None
    source: list[str] | None = None
    license: str | None = None
