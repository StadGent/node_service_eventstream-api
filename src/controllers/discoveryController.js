import Utils from '../lib/utils';
import Config from '../config/config';
import md5 from 'md5';

const config = Config.getConfig();
const port = (config.eventstream.port != '' && config.eventstream.port != '80') ? ':' + config.eventstream.port : '';
const path = config.eventstream.path != '' ? config.eventstream.path + '/' : '';
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
      "@context": ["https://apidg.gent.be/opendata/adlib2eventstream/v1/context/DCAT-AP-VL-20.jsonld", {
        "dcterms": "http://purl.org/dc/terms/",
        "ldes": "https://w3id.org/ldes#",
        "tree": "https://w3id.org/tree#",
        "tree:view": {
          "@type": "@id"
        }
      }],
      "@id": baseURI + 'dcat/coghent',
      "@type": "Catalogus",
      "Catalogus.titel": {
        "@value": "Catalogus CoGhent",
        "@language": "nl"
      },
      "Catalogus.beschrijving": {
        "@value": "Catalogus van datasets voor de Collectie van de Gentenaar.",
        "@language": "nl"
      },
      "Catalogus.licentie": {
        "@id": "https://data.vlaanderen.be/id/licentie/creative-commons-zero-verklaring/v1.0"
      },
      "Catalogus.uitgever": {
        "@id": "http://stad.gent/",
        "@type": "dcterms:Agent",
        "Agent.naam": {
          "@value": "Stad Gent",
          "@language": "nl"
        }
      },
      "Catalogus.contactinformatie": {
        "@type": "Contactinfo",
        "Contactinfo.eMail": "mailto:collectie@gent.be"
      },
      "Catalogus.identificator": baseURI + 'dcat/coghent',
      "Catalogus.heeftDataset": []
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
        md["Catalogus.heeftDataset"].push({
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
          "Dataset.contactinformatie": {
            "@type": "Contactinfo",
            "Contactinfo.eMail": getEmailFromInstitutionName(institutionName)
          },
          "Dataset.statuut": "https://metadata.vlaanderen.be/id/GDI-Vlaanderen-Trefwoorden/VLOPENDATASERVICE",
          "Dataset.identificator": baseURI + 'dataset/' + institutions[i].institution + '/' +  md5(institutions[i].institution + databases[d].adlibDatabase),
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
  if (name === "Design Museum Gent") return 'mailto:data@designmuseumgent.be';
  else if (name === "Archief Gent") return 'mailto:archief@stad.gent';
  else if (name === "Huis van Alijn (Gent)") return 'mailto:info@huisvanalijn.be';
  else if (name === "Industriemuseum") return 'mailto:bibliotheek@industriemuseum.be';
  else if (name === "STAM (Gent)") return 'mailto:collectie.stam@stad.gent';
  else return 'mailto:collectie@gent.be';
}
