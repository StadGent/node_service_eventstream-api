Adlib2Eventstream is een Linked Data Event Stream (LDES) van de collectie objecten van de Gentse musea die beheerd worden in Adlib.

## Features

### Wat kan de service

Een Linked Data Event Stream is een verzameling onveranderlijke objecten. Elk object wordt beschreven in RDF.

Het doel van een Linked Data Event Stream is om consumenten in staat te stellen al zijn items te repliceren en synchroon te blijven wanneer items worden toegevoegd.

Adlib2Eventstream API bevat volgende Linked Data Event Streams:

- [Design Museum Gent](https://apidg.gent.be/opendata/adlib2eventstream/v1/dmg/objecten): objecten van Design Museum Gent
- [Design Museum Gent tentoonstellingen](https://apidg.gent.be/opendata/adlib2eventstream/v1/dmg/tentoonstellingen): tentoonstellingen van Design Museum Gent
- [STAM](https://apidg.gent.be/opendata/adlib2eventstream/v1/stam/objecten): objecten van STAM (Gent)
- [Huis van Alijn](https://apidg.gent.be/opendata/adlib2eventstream/v1/hva/objecten): objecten van Het Huis van Alijn (Gent)
- [Industriemuseum](https://apidg.gent.be/opendata/adlib2eventstream/v1/industriemuseum/objecten): objecten van Industriemuseum
- [Archief Gent](https://apidg.gent.be/opendata/adlib2eventstream/v1/archiefgent/objecten): objecten van Archief Gent
- [Personen](https://apidg.gent.be/opendata/adlib2eventstream/v1/adlib/personen): personen van Archief Gent, Design Museum Gent, Het Huis van Alijn (Gent), Industriemuseum, STAM (Gent)
- [Thesaurus](https://apidg.gent.be/opendata/adlib2eventstream/v1/adlib/thesaurus): thesaurus van Archief Gent, Design Museum Gent, Het Huis van Alijn (Gent), Industriemuseum, STAM (Gent)

### Wat is de service niet?

# Eventstream API

Adlib2Eventstream voorziet geen schrijfoperaties, je kan enkel updates ontvangen van de collectie stukken.

## Restricties

Om misbruik te voorkomen wordt een rate limit voorzien.

## Gebruik

### Wat moet ik doen om de service te kunnen gebruiken?

Adlib2Eventstream is en Open Service en kan gebruikt worden zonder API-key.
Om misbruik te voorkomen wordt wel een rate limit voorzien.

### Voorbeeld

Als je een volledige replicatie van alle exposities in het Design Museum Gent wil hebben en deze gesynchroniseerd wilt houden, kun je nu dit bash-commando uitvoeren:

```
# Install the dependency:
yarn install -g @treecg/actor-init-ldes-client

# Read the eventstream:
actor-init-ldes-client https://apidg.gent.be/opendata/adlib2eventstream/v1/dmg/tentoonstellingen
```

Het zal beginnen met het teruggeven van JSON-objecten die je naar je eigen gegevensopslag kunt pipen en deze synchroon kunt houden met de oorspronkelijke bron.

## Endpoints & Methods

Adlib2Eventstream kan je per omgeving benaderen via onderstaande endpoints. Op dit developer portaal vind je de OpenAPI Specificatie met de methods die je kan oproepen.

- DV: https://apidgdv.gent.be/opendata/adlib2eventstream/v1/
- QA: https://apidgqa.gent.be/opendata/adlib2eventstream/v1/
- PR: https://apidg.gent.be/opendata/adlib2eventstream/v1/

De OpenAPI specificatie (OAS) voor de Adlib2Eventstream API is beschikbaar op https://apidg.gent.be/opendata/adlib2eventstream/v1/api-docs/.
