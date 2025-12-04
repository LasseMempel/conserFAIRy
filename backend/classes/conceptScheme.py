from pydantic import BaseModel, HttpUrl

class ConceptScheme(BaseModel):
    # SKOS Concept Schemes
    URI: HttpUrl # mandatory!
    hasTopConcept: list[HttpUrl] | None = None

    # Dublin Core Terms
    title: dict[str, list[str]] # mandatory!
    rights: str | None = None
    license: str | None = None
    description: dict[str, list[str]] | None = None
    member: list[HttpUrl] | None = None
    maker: list[HttpUrl] | None = None

