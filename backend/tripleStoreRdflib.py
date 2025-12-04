import rdflib

graph = rdflib.Graph(store="Oxigraph", identifier="http://example.com") # without identifier, some blank node will be used
graph.open("conserStore")
#graph.parse("thesaurus.ttl", format="ttl")
#print(graph.serialize(format="ttl"))
print(len([(s,p,o) for s,p,o in graph]))
graph-=graph
print(len([(s,p,o) for s,p,o in graph]))
graph.close()

def readGraph(graph):
    store = rdflib.Graph(store="Oxigraph")
    store.open("conserStore")
    store.close()
    return graph

def writeGraph(graph):
    store = rdflib.Graph(store="Oxigraph")
    store.open("conserStore")
    store.parse(data=graph.serialize(format="turtle"), format="turtle")
    graph.close()
