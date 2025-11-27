from pyoxigraph import Store, NamedNode, Literal, Quad

store = Store("pyoxystore")

ex = NamedNode('http://example/')
schema_name = NamedNode('http://schema.org/name')
name = Literal('example')
store.add(Quad(ex, schema_name, name))

store.flush()
print(str(store))