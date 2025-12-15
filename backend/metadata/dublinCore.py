from pydantic import BaseModel, HttpUrl

class dublinCoreObject(BaseModel):
    # Dublin Core Terms
    creator: list[HttpUrl | str] | None = None
    contributor: list[HttpUrl | str] | None = None
    publisher: HttpUrl | str | None = None
    rights: HttpUrl | str | None = None
    source: list[HttpUrl | str] | None = None
    subject: dict[str, list[str]] | None = None
    created: str | None = None
    license: HttpUrl | str | None = None
    modified: str | None = None
    title: dict[str, list[str]] | None = None
    description: dict[str, list[str]] | None = None
    coverage: str | None = None
    format: str | None = None
    relation: str | None = None
    type: HttpUrl | str | None = None
    language: list[HttpUrl | str] | None = None
    isReplacedBy : HttpUrl | None = None
    replaces: HttpUrl | None = None

