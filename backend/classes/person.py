from pydantic import BaseModel, HttpUrl

class Person(BaseModel):
    URI: HttpUrl

    email: str
    affiliation: str | None = None
    name: str
    owns: list[HttpUrl] | None = None
    memberOf: list[HttpUrl] | None = None
    type: HttpUrl = HttpUrl("https://schema.org/Person")