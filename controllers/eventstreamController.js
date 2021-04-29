const Utils = require('../lib/utils.js');
let Config = require("../config/config.js");
let config = Config.getConfig();
let md5 = require('md5');

let port = config.eventstream.port != '' ? ':' + config.eventstream.port : '';
let path = config.eventstream.path != '' ? config.eventstream.path + '/' : '';

let db = null;
const { Op } = require("sequelize");

const numberOfObjectsPerFragment = 5;

module.exports.getEventstream = async function(req, res) {
    try {
        if(!db) db = await Utils.initDb();

        let adlibdatabase = req.params.adlibDatabase;
        let institution = req.params.institution;
        if (!config[institution]) {
            throw "institution not supported";
        }

        const baseURIFragments = config.eventstream.protocol + '://' + config.eventstream.hostname + port + '/' + path + institution + '/' + adlibdatabase;
        const baseURICollection = config.mapping.baseURI.endsWith('/') ? config.mapping.baseURI : config.mapping.baseURI + '/';

        let generatedAtTimeQueryParameter = new Date().toISOString();
        if (req.query.generatedAtTime) generatedAtTimeQueryParameter = req.query.generatedAtTime;
        const generatedAtTime = new Date(decodeURIComponent(generatedAtTimeQueryParameter));

        const distinctFragmentsQuery = `
            (select "generatedAtTime"
            from (select "generatedAtTime", row_number() over () - 1 rownr
                  from "Members"
                  where institution='${institution}'
                  AND database='${adlibdatabase}'
                  group by "generatedAtTime") AS distinctGeneratedAtTimes
            where rownr % ${numberOfObjectsPerFragment} = 0
            )`;

        const fr = await db.models.Member.max('generatedAtTime', {
            where: {
                [Op.and]: [
                    {institution: institution},
                    {database: adlibdatabase},
                    {generatedAtTime: {
                        [Op.and]: [{
                            [Op.lte]: generatedAtTime
                            }, {
                            [Op.in]: db.literal(distinctFragmentsQuery)
                        }]
                    }}
                ]
            }
        });

        if (!fr) {
            throw "Fragment not found";
        }

        if (generatedAtTime.getTime() !== fr.getTime()) {
            // Redirect to correct fragment URL
            res.status = 302;
            res.redirect(baseURIFragments + '?generatedAtTime=' + fr.toISOString());
            return;
        }

        let nextFr = await db.models.Member.min('generatedAtTime', {
            where: {
                [Op.and]: [
                    {institution: institution},
                    {database: adlibdatabase},
                    {generatedAtTime: {
                        [Op.and]: [{
                                [Op.gt]: generatedAtTime
                            }, {
                                [Op.in]: db.literal(distinctFragmentsQuery)
                            }]
                        }
                    }
                ]
            }
        });

        if (nextFr != null) {
            // Cache older fragment that won't change over time
            res.set({ 'Cache-Control': 'public, max-age=31536000, immutable' });
            // res.set({ 'Cache-Control': 'public, max-age=30000' });
        } else {
            // Do not cache current fragment as it will get more data
            res.set({ 'Cache-Control': 'no-cache, no-store, must-revalidate' });
        }

        // add links to previous page
        const prevFr = await db.models.Member.max('generatedAtTime', {
            where: {
                [Op.and]: [
                    {institution: institution},
                    {database: adlibdatabase},
                    {generatedAtTime: {
                        [Op.and]: [{
                            [Op.lt]: generatedAtTime
                            }, {
                            [Op.in]: db.literal(distinctFragmentsQuery)
                        }]
                        }
                    }
                ]
            }
        });

        let relations = [];
        if (prevFr) {
            const prevRemainingItems = await db.models.Member.count({
                where: {
                    [Op.and]: [
                        {institution: institution},
                        {database: adlibdatabase},
                        {generatedAtTime: {
                            [Op.lt]: fr
                        }}
                    ]
                }
            });

            // there is a previous relation
            relations.push({
                "@type": "tree:LessThanRelation",
                "tree:node": baseURIFragments + '?generatedAtTime=' + prevFr.toISOString(),
                "tree:path": "prov:generatedAtTime",
                "tree:value": generatedAtTime,
                "tree:remainingItems": prevRemainingItems,
            })
        };
        if (nextFr) {
            // there is a next relation
            // fetch time of last object in fragment
            const nextRemainingItems = await db.models.Member.count({
                where: {
                    [Op.and]: [
                        {institution: institution},
                        {database: adlibdatabase},
                        {generatedAtTime: {
                                [Op.gte]: nextFr
                            }}
                    ]
                }
            });
            relations.push({
                "@type": "tree:GreaterThanOrEqualRelation",
                "tree:node": baseURIFragments + '?generatedAtTime=' + nextFr.toISOString(),
                "tree:path": "prov:generatedAtTime",
                "tree:value": nextFr,
                "tree:remainingItems": nextRemainingItems
            })
        };

        let collectionURI = baseURICollection + 'dataset/' + institution + '/' + md5(institution + adlibdatabase);
        let fragmentContent = {
            "@context": {
                "prov": "http://www.w3.org/ns/prov#",
                "tree": "https://w3id.org/tree#",
                "sh": "http://www.w3.org/ns/shacl#",
                "dcterms": "http://purl.org/dc/terms/",
                "tree:member": {
                    "@type": "@id"
                },
                "memberOf": {
                    "@reverse": "tree:member",
                    "@type": "@id"
                },
                "tree:node": {
                    "@type": "@id"
                },
                "tree:path": {
                    "@type": "@id"
                },
                "viewOf": {
                    "@reverse": "tree:view",
                    "@type": "@id"
                }
            },
            "@id": baseURIFragments + '?generatedAtTime=' + generatedAtTime.toISOString(),
            "@type": "tree:Node",
            "viewOf": {
                "@id": collectionURI,
                "@type": "tree:Collection"
            },
            "@included": []
        }
        if (relations.length) fragmentContent["tree:relation"] = relations;

        let json;
        if (!nextFr) nextFr = new Date(); // now

        const payloads = await db.models.Member.findAll({
            where: {
                [Op.and]: [
                    {institution: institution},
                    {database: adlibdatabase},
                    {generatedAtTime: {
                        [Op.and]: [{
                                [Op.gte]: fr
                            }, {
                                [Op.lt]: nextFr
                            }
                        ]}
                    }
                ]
            },
            order: ["generatedAtTime"]
        });

        for (let p in payloads) {
            try {
                json = JSON.parse(payloads[p].payload);
                // Add member relation to collection
                json["memberOf"] = collectionURI;
                fragmentContent["@included"].push(json);
            } catch (e) {
                console.log("Something wrong with " + p)
            }
        }
        res.send(JSON.stringify(fragmentContent));
    } catch (e) {
        Utils.sendNotFound(req, res);
    }
}