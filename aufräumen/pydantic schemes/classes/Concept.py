from pydantic import HttpUrl
import sys
sys.path.append("..metadata")
from metadata.dublinCore import dublinCoreObject

class Concept(dublinCoreObject):
    # SKOS Concept Schemes
    URI: HttpUrl  # mandatory!
    inScheme: HttpUrl  # mandatory! #check in triple store that this scheme exists einfügen!
    topConceptOf: HttpUrl | None = None #check in triple store that this scheme exists einfügen!

    # SKOS Mapping Properties
    broadMatch: list[HttpUrl] | None = None
    narrowMatch: list[HttpUrl] | None = None
    relatedMatch: list[HttpUrl] | None = None
    closeMatch: list[HttpUrl] | None = None
    exactMatch: list[HttpUrl] | None = None

    # SKOS Semantic Relations
    broader: HttpUrl | None = None # check in triple store that this concept exists einfügen!
    narrower: list[HttpUrl] | None = None # check in triple store that this concept exists einfügen!
    related: list[HttpUrl] | None = None # check in triple store that this concept exists einfügen!

    # SKOS Lexical Labels
    prefLabel: dict[str, str] # mandatory!
    altLabel: dict[str, list[str]] | None = None
    hiddenLabel: dict[str, list[str]] | None = None

    """
    # Skos XL Labels
    xlPrefLabel: list[HttpUrl] # mandatory!
    xlAltLabel: list[HttpUrl] | None = None
    """

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
    
    # Other Properties
    seeAlso: list[HttpUrl] | None = None
    comment: dict[str, list[str]] | None = None
    deprecated: bool | None = None
    type: HttpUrl = HttpUrl("http://www.w3.org/2004/02/skos/core#Concept")
