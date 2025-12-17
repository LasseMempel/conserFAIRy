from pydantic import BaseModel, HttpUrl
from typing import Literal

class Label(BaseModel):
    URI: HttpUrl  # mandatory!
    xlLiteralForm: tuple[str, str] # mandatory!
    type: Literal["http://www.w3.org/2008/05/skos-xl#prefLabel",
                            "http://www.w3.org/2008/05/skos-xl#altLabel",
                            "http://www.w3.org/2008/05/skos-xl#hiddenLabel"
    ]