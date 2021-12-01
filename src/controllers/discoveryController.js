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
      "@context": ["https://apidg.gent.be/opendata/adlib2eventstream/v1/context/DCAT-AP-VL.jsonld", {
        "dcterms": "http://purl.org/dc/terms/",
        "ldes": "https://w3id.org/ldes#",
        "tree": "https://w3id.org/tree#",
        "tree:view": {
          "@type": "@id"
        }
      }],
      "@id": baseURI + 'dcat/coghent',
      "@type": "Datasetcatalogus",
      "Datasetcatalogus.titel": {
        "@value": "Catalogus CoGhent",
        "@language": "nl"
      },
      "Datasetcatalogus.beschrijving": {
        "@value": "Catalogus van datasets voor de Collectie van de Gentenaar.",
        "@language": "nl"
      },
      "Datasetcatalogus.heeftLicentie": {
        "@id": "https://creativecommons.org/publicdomain/zero/1.0/"
      },
      "Datasetcatalogus.heeftUitgever": {
        "@id": "http://stad.gent/",
        "Agent.naam": {
          "@value": "Stad Gent",
          "@language": "nl"
        }
      },
      "Datasetcatalogus.heeftDataset": []
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
              uitgevers.push({
                "@id": config[institutions[ins].institution].institutionURI,
                "Agent.naam": {
                  "@value": config[institutions[ins].institution].institutionName,
                  "@language": "nl"
                }
              });
            }
          }
        } else {
          institutionName = config[institutions[i].institution].institutionName;
          uitgevers = {
            "@id": config[institutions[i].institution].institutionURI,
            "Agent.naam": {
              "@value": institutionName,
              "@language": "nl"
            }
          };
        }
        const toegangsURL = config.eventstream.protocol + '://' + config.eventstream.hostname + port + '/' + path + institutions[i].institution + '/' + databases[d].adlibDatabase;
        md["Datasetcatalogus.heeftDataset"].push({
          "@id": baseURI + 'dataset/' + institutions[i].institution + '/' +  md5(institutions[i].institution + databases[d].adlibDatabase),
          "@type": ["Dataset", "ldes:EventStream"],
          "tree:view": toegangsURL,
          "Dataset.titel": {
            "@value": databases[d].adlibDatabase + " van " + institutionName,
            "@language": "nl"
          },
          "Dataset.beschrijving": {
            "@value": "Event stream van de Adlib database '" + databases[d].adlibDatabase + "' van de instelling: " + institutionName,
            "@language": "nl"
          },
          "Dataset.contactinfo": {
            "@type": "Contactinfo",
            "Contactinfo.eMail": getEmailFromInstitutionName(institutionName)
          },
          "Dataset.toegankelijkheid": "http://publications.europa.eu/resource/authority/access-right/PUBLIC",
          "Dataset.heeftUitgever": uitgevers,
          "heeftDistributie": {
            "@type": "Distributie",
            "toegangsURL": toegangsURL,
            "dcterms:conformsTo": "https://w3id.org/tree",
            "Distributie.heeftLicentie": {
              "@id": "https://creativecommons.org/publicdomain/zero/1.0/"
            }
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

function getEmailFromInstitutionName(name) {
  if (name === "Design Museum Gent") return 'data@designmuseumgent.be';
  else if (name === "Archief Gent") return 'archief@stad.gent';
  else if (name === "Huis van Alijn (Gent)") return 'info@huisvanalijn.be';
  else if (name === "Industriemuseum") return 'info@industriemuseum.be';
  else if (name === "STAM (Gent)") return 'collectie.stam@stad.gent';
  else return 'collectie@gent.be';
}
