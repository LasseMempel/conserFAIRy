from pydantic import BaseModel, HttpUrl
from typing import Literal
from datetime import datetime

class Annotation(BaseModel):
    URI: HttpUrl
    hasTarget: HttpUrl # validation if type of target matches motivation: concept, conceptScheme or annotation
    hasBody: str
    motivatedBy: Literal[
        "http://www.w3.org/ns/oa#commenting",
        "http://www.w3.org/ns/oa#editing",
        "http://www.w3.org/ns/oa#replying"
    ]
    creator: HttpUrl
    creator: HttpUrl
    created: datetime
    status: str # for determining if annotation, for example editing suggestion is accepted or rejected
    inscheme: HttpUrl
    type: HttpUrl = HttpUrl("http://www.w3.org/ns/oa#Annotation")
