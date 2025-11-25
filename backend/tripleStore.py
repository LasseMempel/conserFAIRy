from pyoxigraph import Store

store = Store("pyoxystore")

"""
ex = NamedNode('http://example/')
schema_name = NamedNode('http://schema.org/name')
name = Literal('example')
store.add(Quad(ex, schema_name, name))
"""

def readStore(store):
    print(str(store))

def writeStore(store):
    store.flush()