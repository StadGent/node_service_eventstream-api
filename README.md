# Eventstream API

## Linked Data Event Stream (LDES)

A Linked Data Event Stream is a collection of immutable objects (such as version objects, sensor observations or archived representation). Each object is described in RDF. The objective of a Linked Data Event Stream is to allow consumers to replicate all of its items and to stay in sync when items are added.

## Example usage

If you want to have a full-history replication of all expositions in the Design Museum Ghent, and keep it in sync, you can now run this bash command:
```
# Install the dependency
yarn install -g @treecg/actor-init-ldes-client
actor-init-ldes-client https://apidg.gent.be/opendata/adlib2eventstream/v1/dmg/tentoonstellingen
```

It will start spitting out JSON objects you can pipe to your own data store and keep it in sync with the original source.


## Documentation

### OpenAPI specification (OAS)

The OpenAPI specification for this API is available on https://apidg.gent.be/opendata/adlib2eventstream/v1/api-docs/.

### @treecg/actor-init-ldes-client

The [documentation of the ldes client (@treecg/actor-init-ldes-client)](https://github.com/TREEcg/event-stream-client/tree/main/packages/actor-init-ldes-client#treecgactor-init-ldes-client) is available on GitHub.
