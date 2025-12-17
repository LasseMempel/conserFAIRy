import pyoxigraph

def readGraph():
    store = pyoxigraph.Store.read_only("conserStore")
    print(len(str(store)))
    

def writeGraph(graph):
    store = pyoxigraph.Store("conserStore")

file = "data/thesaurus.ttl"
g = pyoxigraph.parse(path=file)
print(pyoxigraph.serialize(g, format="RdfFormat.TURTLE"))



#writeGraph(file)
#readGraph()


