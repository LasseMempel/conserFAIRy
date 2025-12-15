from pydantic import BaseModel

class Label(BaseModel):
    URI: HttpUrl  # mandatory!


    
    type: HttpUrl = HttpUrl("http://www.w3.org/2004/02/skos/core#Concept")
