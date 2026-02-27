from pydantic import HttpUrl, Field
import sys
sys.path.append("..metadata")
from metadata.dublinCore import dublinCoreObject

class ConceptScheme(dublinCoreObject):
    # SKOS Concept Schemes
    URI: HttpUrl # mandatory!
    hasTopConcept: list[HttpUrl] | None = None

    # Dublin Core Terms
    title: dict[str, list[str]] = ... # type: ignore # mandatory!

    # Other Properties
    seeAlso: list[HttpUrl] | None = None
    comment: dict[str, list[str]] | None = None
    preferredNamespaceUri: HttpUrl | None = None
    type: HttpUrl = HttpUrl("http://www.w3.org/2004/02/skos/core#ConceptScheme")

