from pydantic import BaseModel, HttpUrl

class Person(BaseModel):
    URI: HttpUrl
    first_name: str
    last_name: str
    mbox: str
    made: list[HttpUrl] | None = None
    worksFor: HttpUrl | None = None