from fastapi import FastAPI
from classes import Concept, ConceptScheme
import json

app = FastAPI()

conceptDict = {}

@app.get("/getconcept/")
def get_concept(conceptURI: str):
    try:
        conceptJSON = conceptDict[conceptURI]
        concept = Concept(**conceptJSON)
        return( {"success": conceptJSON })
    except Exception as e:
        return {"error": str(e)}

@app.get("/postconcept/")
def write_concept(conceptString: str):
    try:
        conceptJSON = json.loads(conceptString)
        concept = Concept(**conceptJSON)
        conceptDict[concept.concept] = conceptJSON
        return( {"success": "concept {concept.prefLabel} added"})
    except Exception as e:
        return {"error": str(e)}
    
# {"concept": "https://www.example.com/U98K34", "inScheme": "U98K34", "prefLabel": "Wiener", "notation": "X1085"}

# http://127.0.0.1:8000/postconcept/?conceptString={%22concept%22:%20%22https://www.example.com/U98K34%22,%20%22inScheme%22:%20%22U98K34%22,%20%22prefLabel%22:%20%22Wiener%22,%20%22notation%22:%20%22X1085%22}

# http://127.0.0.1:8000/getconcept/?conceptURI=https://www.example.com/U98K34