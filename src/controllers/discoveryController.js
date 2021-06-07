import Utils from '../lib/utils';
import Config from '../config/config';
import md5 from 'md5';

const config = Config.getConfig();
const port = (config.eventstream.port != '' && config.eventstream.port != '80') ? ':' + config.eventstream.port : '';
const path = config.eventstream.path != '' ? config.eventstream.path + '/' : '';
const numberOfObjectsPerFragment = 5;
let db = null;

export async function getDiscoveryMetadata(req, res) {
  try {
    if(!db) db = await Utils.initDb();

    Utils.log(`GET ${req.url}`, "controllers/discoveryController:getDiscoveryMetadata", "INFO", req.correlationId());

    let baseURI = config.mapping.baseURI.endsWith('/') ? config.mapping.baseURI : config.mapping.baseURI + '/';

    res.set({
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/ld+json'
    });

    let md = {
      "@context": ["https://data.vlaanderen.be/doc/applicatieprofiel/DCAT-AP-VL/standaard/2019-06-13/context/DCAT-AP-VL.jsonld", {
        "dcterms": "http://purl.org/dc/terms/"
      }],
      "@id": baseURI + 'dcat/coghent',
      "@type": "DatasetCatalogus",
      "DatasetCatalogus.titel": "Catalogus CoGhent",
      "DatasetCatalogus.beschrijving": "Catalogus van datasets voor de Collectie van de Gentenaar.",
      "heeftDataset": []
    };
    const institutions = await db.models.Member.findAll(  {
      attributes: ['institution'],
      group: "institution"
    });
    for (let i in institutions) {
      const databases = await db.models.Member.findAll({
        attributes: ['adlibDatabase'],
        where: {
          "institution": institutions[i].institution
        },
        group: "adlibDatabase"
      });
      for (let d in databases) {
        let institutionName = "";
        let uitgevers = [];
        if (institutions[i].institution === "adlib") {
          for (let ins in institutions) {
            if (institutions[ins].institution != "adlib") {
              institutionName += config[institutions[ins].institution].institutionName;
              if (ins < (institutions.length-1)) institutionName += ", ";
              uitgevers.push(config[institutions[ins].institution].institutionURI);
            }
          }
        } else {
          institutionName = config[institutions[i].institution].institutionName;
          uitgevers = config[institutions[i].institution].institutionURI;
        }
        md["heeftDataset"].push({
          "@id": baseURI + 'dataset/' + institutions[i].institution + '/' +  md5(institutions[i].institution + databases[d].adlibDatabase),
          "@type": "Dataset",
          "Dataset.titel": databases[d].adlibDatabase + " van " + institutionName,
          "Dataset.beschrijving": "Event stream van de Adlib database '" + databases[d].adlibDatabase + "' van de instelling: " + institutionName,
          "Dataset.heeftUitgever": uitgevers,
          "heeftDistributie": {
            "@type": "Distributie",
            "toegangsURL": config.eventstream.protocol + '://' + config.eventstream.hostname + port + '/' + path + institutions[i].institution + '/' + databases[d].adlibDatabase,
            "dcterms:conformsTo": "https://w3id.org/tree"
          }
        });
      }
    }
    res.send(JSON.stringify(md));
  } catch (e) {
    Utils.log("Send not found", "controllers/discoveryController:getDiscoveryMetadata", "WARN", req.correlationId());
    Utils.sendNotFound(req, res);
  }
}
