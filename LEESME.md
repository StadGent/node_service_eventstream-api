Adlib2Eventstream is een Linked Data Event Stream (LDES) van de collectie objecten van de Gentse musea die beheerd worden in Adlib.

## Features

### Wat kan de service

Een Linked Data Event Stream is een verzameling onveranderlijke objecten. Elk object wordt beschreven in RDF.

Het doel van een Linked Data Event Stream is om consumenten in staat te stellen al zijn items te repliceren en synchroon te blijven wanneer items worden toegevoegd.

Adlib2Eventstream bevat objecten uit volgende instellingen:

- Design Museum Gent
- STAM
- Huis van Alijn
- Industriemuseum
- Archief Gent

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
