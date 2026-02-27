import rdflib
import oxrdflib
import pyoxigraph

def readGraph():
    """
    store = rdflib.Graph(store="Oxigraph", identifier="https://www.w3id.org/archlink/conserFAIRy/graph")
    store.open("conserStore")
    print(len([(s,p,o) for s,p,o in store]))
    store.close()
    """
    store = pyoxigraph.Store.read_only("conserStore")
    print(len(str(store)))
    
def writeGraph(file):
    store = rdflib.Graph(store="Oxigraph", identifier="https://www.w3id.org/archlink/conserFAIRy/graph")
    store.open("conserStore")
    store.parse(file)
    print(len([(s,p,o) for s,p,o in store]))
    store.close()

g = rdflib.Graph()

file = "data/thesaurus.ttl"

writeGraph(file)
readGraph()


