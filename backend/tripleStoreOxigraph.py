from pyoxigraph import Store, parse, RdfFormat

store = Store("pyoxystore")

"""
ex = NamedNode('http://example/')
schema_name = NamedNode('http://schema.org/name')
name = Literal('example')
store.add(Quad(ex, schema_name, name))
"""

graph = parse(path="thesaurus.ttl", format=RdfFormat.TURTLE)

print(graph)
#store.add_graph(graph)

print(store)

def readStore(store):
    print(str(store))

def writeStore(store):
    store.flush()