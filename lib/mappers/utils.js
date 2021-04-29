module.exports = {
    mapInstelling: (institutionURI, input, mappedObject) => {
        mappedObject["MaterieelDing.beheerder"] = institutionURI;
    },

    mapCollectie: async (input, mappedObject, adlib) => {
        if (input["collection"] && input["collection"][0]) {
            mappedObject["MensgemaaktObject.maaktDeelUitVan"] = []
            for (let c in input["collection"]) {
                const collectionURI = await adlib.getURIFromPriref("thesaurus", input["collection.lref"][c], "concept");

                mappedObject["MensgemaaktObject.maaktDeelUitVan"].push({
                    "@type": "Collectie",
                    "Entiteit.beschrijving": input["collection"][c],
                    "Entiteit.type": {
                        "@id": collectionURI,
                        "label": {
                            "@value": input["collection"][c],
                            "@language": "nl"
                        }
                    }
                })
            }
        }
    },

    mapObjectnummer: (input, mappedObject) => {
        if (input["object_number"]) mappedObject["Object.identificator"] = {
            "@type": "Identificator",
            "Identificator.identificator": input["object_number"]
        }
    },

    mapObjectnaam: async (objectURI, input, mappedObject, adlib) => {
        let c = [];
        for(let o in input.Object_name) {
            const objectnaamURI = await adlib.getURIFromPriref("thesaurus",input.Object_name[o]['object_name.lref'][0], "concept");

            c.push({
                "@type": "Classificatie",
                "Classificatie.getypeerdeEntiteit": objectURI,
                "Classificatie.toegekendType": {
                    "@id": objectnaamURI,
                    "skos:prefLabel": {
                        "@value": input.Object_name[o].object_name[0],
                        "@language": "nl"
                    }
                }
            });
        }
        if (mappedObject["Entiteit.classificatie"]) mappedObject["Entiteit.classificatie"] = mappedObject["Entiteit.classificatie"].concat(c);
        else mappedObject["Entiteit.classificatie"] = c;
    },

    mapObjectCategorie: async (objectURI, input, mappedObject, adlib) => {
        // 	"object_category": ["decoratief object"],
        if (input["object_category"] && input["object_category"][0]) {
            let c = [];
            for (let cat in input["object_category"]) {
                let categoryName = input["object_category"][cat];
                const categoryNameURI = await adlib.getURIFromPriref("thesaurus", input["object_category.lref"][cat], "concept");

                c.push({
                    "@type": "Classificatie",
                    "Classificatie.getypeerdeEntiteit": objectURI,
                    "Classificatie.toegekendType": {
                        "@id": categoryNameURI,
                        "skos:prefLabel": {
                            "@value": categoryName,
                            "@language": "nl"
                        }
                    }
                });
            }
            if (mappedObject["Entiteit.classificatie"]) mappedObject["Entiteit.classificatie"] = mappedObject["Entiteit.classificatie"].concat(c);
            else mappedObject["Entiteit.classificatie"] = c;
        }
    },

    mapTitel: (input, mappedObject) => {
        if (input.Title && input.Title[0].title) mappedObject["MensgemaaktObject.titel"] = {
            "@value": input.Title[0].title[0],
            "@language": "nl"
        };
    },

    mapBeschrijving: (input, mappedObject) => {
        if (input.Description && input.Description[0].description) mappedObject["Entiteit.beschrijving"] = {
            "@value": input.Description[0].description[0],
            "@language": "nl"
        };
    },

    mapOplage: (input, mappedObject) => {

    },

    mapConditie: (input, mappedObject) => {
        if(input.Condition && input.Condition[0]) mappedObject["MaterieelDing.conditiebeoordeling"] = processCondition(mappedObject["dcterms:isVersionOf"], input.Condition[0]);
    },

    mapStandplaatsDMG: (input, mappedObject) => {
        if (input.Current_location && input.Current_location[0] && input.Current_location[0]["current_location.context"] && input.Current_location[0]["current_location.context"][0]) {
            const locationContext = input.Current_location[0]["current_location.context"][0];
            if (locationContext.startsWith('DMG_A') || locationContext.startsWith('DMG_B') || locationContext.startsWith('DMG_C')) {
                mappedObject["MensgemaaktObject.locatie"] = {
                    "@id": "https://www.wikidata.org/wiki/Q1809071",
                    "label": "Design Museum Gent"
                }
            } else if (locationContext.startsWith('BELvue')) {
                mappedObject["MensgemaaktObject.locatie"] = {
                    "@id": "https://www.wikidata.org/wiki/Q728437",
                    "opmerking": "bruikleen: BELvue museum"
                }
            } else if (locationContext.startsWith('Hotel')) {
                mappedObject["MensgemaaktObject.locatie"] = {
                    "@id": "https://www.wikidata.org/wiki/Q2120186",
                    "opmerking": "bruikleen: objecten opgesteld in Hotel d'Hane Steenhuysen"
                }
            } else if (locationContext.startsWith('Museum voor Schone Kunsten')) {
                mappedObject["MensgemaaktObject.locatie"] = {
                    "@id": "https://www.wikidata.org/wiki/Q2365880",
                    "opmerking": "bruikleen: Museum voor Schone Kunsten (MSK)"
                }
            } else if (locationContext.startsWith('Sint-Pietersabdij')) {
                mappedObject["MensgemaaktObject.locatie"] = {
                    "@id": "https://www.wikidata.org/wiki/Q1170767",
                    "opmerking": "bruikleen: Sint-Pietersabdij"
                }
            } else if (locationContext.startsWith('Koninklijke Bibliotheek van België')) {
                mappedObject["MensgemaaktObject.locatie"] = {
                    "@id": "https://www.wikidata.org/wiki/Q383931",
                    "opmerking": "bruikleen: KBR"
                }
            } else if (locationContext.startsWith('M-Museum')) {
                mappedObject["MensgemaaktObject.locatie"] = {
                    "@id": "https://www.wikidata.org/wiki/Q2362660",
                    "opmerking": "bruikleen: M-leuven"
                }
            } else if (locationContext.startsWith('MAS')) {
                mappedObject["MensgemaaktObject.locatie"] = {
                    "@id": "https://www.wikidata.org/wiki/Q1646305",
                    "opmerking": "bruikleen: MAS"
                }
            } else if (locationContext.startsWith('STAM')) {
                mappedObject["MensgemaaktObject.locatie"] = {
                    "@id": "https://www.wikidata.org/wiki/Q980285",
                    "opmerking": "bruikleen: STAM"
                }
            } else if (locationContext.startsWith('Industriemuseum')) {
                mappedObject["MensgemaaktObject.locatie"] = {
                    "@id": "https://www.wikidata.org/wiki/Q2245203",
                    "opmerking": "bruikleen: Industriemuseum"
                }
            } else if (locationContext.startsWith('Verbeke')) {
                mappedObject["MensgemaaktObject.locatie"] = {
                    "@id": "https://www.wikidata.org/wiki/Q1888920",
                    "opmerking": "bruikleen: Verbeke Foundation"
                }
            } else if (locationContext.startsWith('Koninklijk Museum voor Schone Kunsten Antwerpen')) {
                mappedObject["MensgemaaktObject.locatie"] = {
                    "@id": "https://www.wikidata.org/wiki/Q1471477",
                    "opmerking": "bruikleen: KMSKA"
                }
            } else if (locationContext.startsWith('Nederlands Zilvermuseum Schoonhoven')) {
                mappedObject["MensgemaaktObject.locatie"] = {
                    "@id": "https://www.wikidata.org/wiki/Q2246858",
                    "opmerking": "bruikleen: Nederlands Zilvermuseum Schoonhoven"
                }
            } else {
                mappedObject["MensgemaaktObject.locatie"] = {
                    "opmerking": "depot"
                }
            }
        }
    },

    mapVervaardiging: async (id, input, mappedObject, adlib) => {
        // Production and Production_date are equal?
        let productions = [];
        if(input.Production && input.Production[0]) {
            if (input["production.date.notes"]) {
                for (let n in input["production.date.notes"]) {
                    let note = input["production.date.notes"][n];
                    const ontwerpRegex = new RegExp('ontwerp.*');
                    if (ontwerpRegex.test(note)) {
                        // Een ontwerp is de creatie van het concept
                        // Entiteit -> wordtNaarVerwezenDoor ConceptueelDing -> Creatie
                        let c = {
                            "@type": "Creatie",
                            "Gebeurtenis.tijd": {}
                        };

                        let ontwerp_date = input.Production_date[n];
                        if (ontwerp_date['production.date.start']) {
                            if (ontwerp_date['production.date.start.prec'] && ontwerp_date['production.date.start.prec'][0] === "circa") {
                                c["Gebeurtenis.tijd"] = {
                                    "@value": ontwerp_date['production.date.start'][0] + "~",
                                    "@type": "http://id.loc.gov/datatypes/edtf/EDTF"
                                };
                            } else {
                                c["Gebeurtenis.tijd"] = {
                                    "@value": ontwerp_date['production.date.start'][0],
                                    "@type": "http://id.loc.gov/datatypes/edtf/EDTF"
                                };
                            }
                        }
                        if (ontwerp_date['production.date.end']) {
                            if (!c["Gebeurtenis.tijd"]) c["Gebeurtenis.tijd"] = {
                                "@value": "",
                                "@type": "http://id.loc.gov/datatypes/edtf/EDTF"
                            }
                            if (ontwerp_date['production.date.end.prec'] && ontwerp_date['production.date.end.prec'][0] === "circa") {
                                c["Gebeurtenis.tijd"]["@value"] = "/" + ontwerp_date['production.date.end'][0] + "~";
                            } else {
                                c["Gebeurtenis.tijd"]["@value"] = "/" + ontwerp_date['production.date.end'][0];
                            }
                        }

                        for (let p in input["Production"]) {
                            let pro = input["Production"][p];
                            if (pro['creator.role'] && pro['creator.role'][0] === "ontwerper") {
                                const creatorURI = await adlib.getURIFromPriref("personen", input["object_category.lref"][c], "entiteit");

                                c["Activiteit.uitgevoerdDoor"] = {
                                    "@id": creatorURI,
                                    "@type": "Agent",
                                    "label": {
                                        "@value": pro["creator"][0],
                                        "@language": "nl"
                                    }
                                }
                                if (pro['production.place']) {
                                    const placeURI = await adlib.getURIFromPriref("thesaurus", pro['production.place.lref'][0], "concept");
                                    c["Gebeurtenis.plaats"] = {
                                        "@id": placeURI,
                                        "skos:prefLabel": {
                                            "@value": pro['production.place'][0],
                                            "@language": "nl"
                                        }
                                    };
                                }
                                const roleLabel = pro['creator.role'][0];
                                const roleURI = await adlib.getURIFromPriref("thesaurus", pro['creator.role.lref'][0], "concept");

                                c["@reverse"] = {
                                    "Rol.activiteit": {
                                        "@type": "Rol",
                                        "Rol.agent": creatorURI,
                                        "Rol.rol": {
                                            "@id": roleURI,
                                            //"@id": "http://vocab.getty.edu/aat/300386174",
                                            "skos:prefLabel": {
                                                "@value": roleLabel,
                                                "@language": "nl"
                                            }
                                        }
                                    }
                                }
                            }
                        }

                        mappedObject["Entiteit.wordtNaarVerwezenDoor"] = {
                            "@type": "ConceptueelDing",
                            "ConceptueelDing.heeftCreatie": c
                        };
                        productions.push(c);
                    }
                }
            }
            for (let n in input["Production"]) {
                let pro = input["Production"][n];

                let p = {
                    "@type": "Productie",
                    "Productie.product": id
                };
                // Datering van tot
                if (input.Production_date && input.Production_date[n]) {
                    p["Gebeurtenis.tijd"] = {
                        "@type": "Periode"
                    };
                    let prod_date = input.Production_date[n];
                    if (prod_date['production.date.start']) {
                        if (prod_date['production.date.start.prec'] && prod_date['production.date.start.prec'][0] === "circa") {
                            p["Gebeurtenis.tijd"] = {
                                "@value": prod_date['production.date.start'][0] + "~",
                                "@type": "http://id.loc.gov/datatypes/edtf/EDTF"
                            };
                        } else {
                            p["Gebeurtenis.tijd"] = {
                                "@value": prod_date['production.date.start'][0],
                                "@type": "http://id.loc.gov/datatypes/edtf/EDTF"
                            };
                        }
                    }
                    if (prod_date['production.date.end']) {
                        if (!p["Gebeurtenis.tijd"]) c["Gebeurtenis.tijd"] = {
                            "@value": "",
                            "@type": "http://id.loc.gov/datatypes/edtf/EDTF"
                        }
                        if (prod_date['production.date.end.prec'] && prod_date['production.date.end.prec'][0] === "circa") {
                            p["Gebeurtenis.tijd"]["@value"] += "/" + prod_date['production.date.end'][0] + "~";
                        } else {
                            p["Gebeurtenis.tijd"]["@value"] += "/" + prod_date['production.date.end'][0];
                        }
                    }
                }

                const creatorURI = await adlib.getURIFromPriref("personen", pro["creator.lref"][0], "entiteit");
                p["Activiteit.uitgevoerdDoor"] = {
                    "@id": creatorURI,
                    "@type": "Agent",
                    "label": {
                        "@value": pro["creator"][0],
                        "@language": "nl"
                    }
                };
                if (pro['production.place'] && pro['production.place'][0] != "") {
                    const placeURI = await adlib.getURIFromPriref("thesaurus", pro['production.place.lref'][0], "concept");
                    p["Gebeurtenis.plaats"] = {
                        "@id": placeURI,
                        "skos:prefLabel": {
                            "@value": pro['production.place'][0],
                            "@language": "nl"
                        }
                    };
                }
                if (pro['creator.role'] && pro['creator.role'][0] != "") {
                    const roleLabel = pro['creator.role'][0];
                    const roleURI = await adlib.getURIFromPriref("thesaurus", pro['creator.role.lref'][0], "concept");

                    p["@reverse"] = {
                        "Rol.activiteit": {
                            "@type": "Rol",
                            "Rol.agent": creatorURI,
                            "Rol.rol": {
                                "@id": roleURI,
                                "skos:prefLabel": {
                                    "@value": roleLabel,
                                    "@language": "nl"
                                }
                            }
                        }
                    }
                }
                productions.push(p);
            }
            if (mappedObject["MaterieelDing.productie"]) mappedObject["MaterieelDing.productie"] = mappedObject["MaterieelDing.productie"].concat(productions);
            else mappedObject["MaterieelDing.productie"] = productions;
        }
    },

    mapFysiekeKenmerken: async (input, mappedObject, adlib) => {
        let components = {};
        // Materialen
        if(input.Material && input.Material[0]) {
            mappedObject["MensgemaaktObject.materiaal"] = [];
            for(let mat in input.Material) {
                for(let part in input.Material[mat]["material.part"]) {
                    const onderdeel = input.Material[mat]["material.part"][part];
                    for (let m in input.Material[mat]["material"]) {
                        const mate = input.Material[mat]["material"][m];
                        const materialURI = await adlib.getURIFromPriref("thesaurus", input.Material[mat]["material.lref"][m], "concept");
                        if (onderdeel != "" && onderdeel != "geheel") {
                            if (!components[onderdeel]) components[onderdeel] = {
                                "@type": "MaterieelDing"
                            };
                            if (!components[onderdeel]["Entiteit.beschrijving"]) components[onderdeel]["Entiteit.beschrijving"] = onderdeel;
                            if (!components[onderdeel]["MensgemaaktObject.materiaal"]) components[onderdeel]["MensgemaaktObject.materiaal"] = [];
                            components[onderdeel]["MensgemaaktObject.materiaal"].push({
                                "@id": materialURI,
                                "skos:prefLabel": {
                                    "@value": mate,
                                    "@language": "nl"
                                }
                            })
                        } else {
                            mappedObject["MensgemaaktObject.materiaal"].push({
                                "@id": materialURI,
                                "skos:prefLabel": {
                                    "@value": mate,
                                    "@language": "nl"
                                }
                            })
                        }
                    }
                }
            }
        }

        // technieken

        // afmetingen
        if(input.Dimension && input.Dimension[0]) {
            mappedObject["MensgemaaktObject.dimensie"] = [];
            for(let d in input.Dimension) {
                let onderdeel = input.Dimension[d]["dimension.part"] ? input.Dimension[d]["dimension.part"][0] : "geheel";
                let afmeting = input.Dimension[d]["dimension.type"] ? input.Dimension[d]["dimension.type"][0] : "";
                let waarde = input.Dimension[d]["dimension.value"] ? input.Dimension[d]["dimension.value"][0] : "unknown";
                let eenheid = input.Dimension[d]["dimension.unit"] ? input.Dimension[d]["dimension.unit"][0] : "cm";

                if (onderdeel != "" && onderdeel != "geheel") {
                    if (!components[onderdeel]) components[onderdeel] = {
                        "@type": "MaterieelDing"
                    };
                    if (!components[onderdeel]["Entiteit.beschrijving"]) components[onderdeel]["Entiteit.beschrijving"] = onderdeel;
                    if (!components[onderdeel]["MensgemaaktObject.dimensie"]) components[onderdeel]["MensgemaaktObject.dimensie"] = [];
                    components[onderdeel]["MensgemaaktObject.dimensie"].push({
                        "@type": "Dimensie",
                        "Dimensie.beschrijving": "Dimensie van " + onderdeel,
                        "Dimensie.type": afmeting,
                        "Dimensie.waarde": waarde,
                        "Dimensie.eenheid": eenheid
                    })
                } else {
                    mappedObject["MensgemaaktObject.dimensie"].push({
                        "@type": "Dimensie",
                        "Dimensie.beschrijving": "Dimensie van geheel",
                        "Dimensie.type": afmeting,
                        "Dimensie.waarde": waarde,
                        "Dimensie.eenheid": eenheid
                    });
                }
            }
        }

        // Attach components to main object
        if (Object.keys(components).length > 0 && !mappedObject['MaterieelDing.bestaatUit']) mappedObject['MaterieelDing.bestaatUit'] = [];
        for (let c in components) {
            mappedObject['MaterieelDing.bestaatUit'].push(components[c]);
        }
    },

    mapVerwerving: async (objectURI, institutionURI, input, mappedObject, adlib) => {
        let v = {
            "@type": "Verwerving"
        }

        if (input["acquisition.date"]) {
            const datum = input["acquisition.date"][0];
            v["Gebeurtenis.tijd"] = {
                "@type": "Periode",
                "Periode.begin": datum,
                "Periode.einde": datum
            }
        }

        if (input["acquisition.method"]) {
            const methode = input["acquisition.method"][0];
            const methodeURI = await adlib.getURIFromPriref("thesaurus", input["acquisition.method.lref"][0], "concept");
            v["Activiteit.gebruikteTechniek"] = {
                "@id": methodeURI,
                "skos:prefLabel": {
                    "@value": methode,
                    "@language": "nl"
                }
            }
        }
        if (input["acquisition.place"]) {
            const plaats = input["acquisition.place"] ? input["acquisition.place"][0] : "";
            const plaatsURI = await adlib.getURIFromPriref("thesaurus", input["acquisition.place.lref"][0], "concept");
            v["Gebeurtenis.plaats"] = {
                "@id": plaatsURI,
                "skos:prefLabel": {
                    "@value": plaats,
                    "@language": "nl"
                }
            }
        }

        v["Verwerving.overdrachtVan"] = objectURI;
        v["Verwerving.overgedragenAan"] = institutionURI;

        mappedObject["MaterieelDing.isOvergedragenBijVerwerving"] = v;
    },

    mapTentoonstelling: async (objectUri, input, mappedObject, adlib) => {
        if (input["Exhibition"]) {
            mappedObject["Entiteit.maaktDeelUitVan"] = [];
            for (let e in input["Exhibition"]) {
                let exh = {
                    "@type": "Activiteit",
                    "Entiteit.type": "http://vocab.getty.edu/aat/300054766" // Tentoonstelling
                }
                const exhibition = input["Exhibition"][e];
                if (exhibition["exhibition"] && exhibition["exhibition"][0]) {
                    const beschrijving = exhibition["exhibition"] && exhibition["exhibition"][0] ? exhibition["exhibition"][0] : "";
                    exh["Entiteit.beschrijving"] = beschrijving;
                }
                exh["Gebeurtenis.tijd"] = {
                    "@value": "",
                    "@type": "http://id.loc.gov/datatypes/edtf/EDTF"
                }
                // unknown period
                if (!exhibition["exhibition.date.start"] && !exhibition["exhibition.date.end"]) exh["Gebeurtenis.tijd"]["@value"] = "/";

                if (exhibition["exhibition.date.start"] && exhibition["exhibition.date.start"][0]) {
                    exh["Gebeurtenis.tijd"]["@value"] = exhibition["exhibition.date.start"][0];
                }
                if (exhibition["exhibition.date.end"] && exhibition["exhibition.date.end"][0]) {
                    exh["Gebeurtenis.tijd"]["@value"] += "/" + exhibition["exhibition.date.end"][0];
                }
                if (exhibition["exhibition.venue.place"] && exhibition["exhibition.venue.place"][0]) {
                    const plaats = exhibition["exhibition.venue.place"][0];
                    const plaatsURI = await adlib.getURIFromPriref("thesaurus", exhibition["exhibition.venue.place.lref"][0], "concept");
                    exh["Gebeurtenis.plaats"] = {
                        "@id": plaatsURI,
                        "skos:prefLabel": {
                            "@value": plaats,
                            "@language": "nl"
                        }
                    }
                }

                const c = {
                    "@type": "Collectie",
                    "gebruiktBijActiviteit": exh
                }
                mappedObject["Entiteit.maaktDeelUitVan"].push(c);
            }
        }
    },

    mapAssociaties: async (objectURI, input, mappedObject, adlib) => {
        let informatieObject = {
            "@type": "InformatieObject",
            "InformatieObject.drager": objectURI,
            "InformatieObject.verwijstNaar": [],
            "InformatieObject.gaatOver": []
        }

        // Geass. Persoon / instelling
        if (input["Associated_person"] && input["Associated_person"][0]) {
            for (let p in input["Associated_person"]) {
                if (input["Associated_person"][p]["association.person"] && input["Associated_person"][p]["association.person"][0]) {
                    let personLabel = input["Associated_person"][p]["association.person"][0];
                    const personURI = await adlib.getURIFromPriref("personen", input["Associated_person"][p]["association.person.lref"][0], "entiteit");

                    informatieObject["InformatieObject.verwijstNaar"].push({
                        "@id": personURI,
                        "label": personLabel
                    });
                }
            }
        }
        // Geass. Onderwerp
        if (input["Associated_subject"] && input["Associated_subject"][0]) {
            for (let p in input["Associated_subject"]) {
                if (input["Associated_subject"][p]["association.subject"] && input["Associated_subject"][p]["association.subject"][0]) {
                    const subjectLabel = input["Associated_subject"][p]["association.subject"][0];
                    const subjectURI = await adlib.getURIFromPriref("thesaurus", input["Associated_subject"][p]["association.subject.lref"][0], "concept");

                    informatieObject["InformatieObject.gaatOver"].push({
                        "@id": subjectURI,
                        "skos:prefLabel": {
                            "@value": subjectLabel,
                            "@language": "nl"
                        }
                    });
                }
            }
        }
        // Geass. Periode
        if (input["Associated_period"] && input["Associated_period"][0]) {
            for (let p in input["Associated_period"]) {
                if (input["Associated_period"][p]["association.period"] && input["Associated_period"][p]["association.period"][0]) {
                    const periodLabel = input["Associated_period"][p]["association.period"][0];
                    const periodURI = await adlib.getURIFromPriref("thesaurus", input["Associated_period"][p]["association.period.lref"][0], "concept");

                    informatieObject["InformatieObject.verwijstNaar"].push({
                        "@id": periodURI,
                        "skos:prefLabel": {
                            "@value": periodLabel,
                            "@language": "nl"
                        }
                    });
                }
            }
        }

        mappedObject["MensgemaaktObject.draagt"] = informatieObject;
    },

    mapIconografie: async (input, mappedObject, adlib) => {
        // Content_person en Content_subject
        if (input["Content_subject"] && input["Content_subject"][0]) {
            if (!mappedObject["Entiteit.beeldtUit"]) mappedObject["Entiteit.beeldtUit"] = [];
            for (let s in input["Content_subject"]) {
                if (input["Content_subject"][s]["content.subject"]) {
                    const subjectLabel = input["Content_subject"][s]["content.subject"][0];
                    const subjectURI = await adlib.getURIFromPriref("thesaurus", input["Content_subject"][s]["content.subject.lref"][0], "concept");

                    mappedObject["Entiteit.beeldtUit"].push({
                        "@id": subjectURI,
                        "skos:prefLabel": {
                            "@value": subjectLabel,
                            "@language": "nl"
                        }
                    });
                }
            }
        }

        if (input["Content_person"] && input["Content_person"][0]) {
            if (!mappedObject["Entiteit.beeldtUit"]) mappedObject["Entiteit.beeldtUit"] = [];
            for (let p in input["Content_person"]) {
                if (input["Content_person"][p]["content.person.name"]) {
                    let personLabel = input["Content_person"][p]["content.person.name"][0];
                    const personURI = await adlib.getURIFromPriref("personen", input["Content_person"][p]["content.person.name.lref"][0], "entiteit");

                    mappedObject["Entiteit.beeldtUit"].push({
                        "@id": personURI,
                        "label": {
                            "@value": personLabel,
                            "@language": "nl"
                        }
                    });
                }
            }
        }
    },
    mapOpschriften: (objectURI, input, mappedObject) => {
        let opschriften = [];

        if (input["Inscription"] && input["Inscription"][0]) {
            for (let i in input["Inscription"]) {
                if (input["Inscription"][i]["inscription.content"] && input["Inscription"][i]["inscription.content"][0]) {
                    let opschriftLabel = input["Inscription"][i]["inscription.content"][0];

                    opschriften.push({
                        "@type": "Taalobject",
                        // "Entiteit.beschrijving": opschriftLabel,
                        "inhoud": opschriftLabel, // wordt toegevoegd in OSLO
                        "Entiteit.classificatie": {
                            "Classificatie.getypeerdeEntiteit": objectURI,
                            "Classificatie.toegekendType": {
                                "@id": "http://vocab.getty.edu/aat/300028702",
                                "label": {
                                    "@value": "opschriften",
                                    "@language": "nl"
                                }
                            }
                        }
                    });
                }
            }

            mappedObject["MensgemaaktObject.draagt"] = opschriften;
        }
    },
    mapMerken: (input, mappedObject) => {
        //console.log(input)
    }
}


// Draft
function processCondition(id, condition) {
    let c = {
        "@type": "Conditiebeoordeling",
        "conditie_van": id
    }
    if (condition["condition"]) {
        c["Conditiebeoordeling.vastgesteldeStaat"] = {
            "@type": "Conditie",
            "Conditie.nota": condition["condition"][0]
        }
    }

    if (condition["condition.date"] && condition["condition.date"][0] != "") {
        c["Conditie.periode"] = {
            "@type": "Periode",
            "Periode.begin": condition["condition.date"][0].begin,
            "Periode.einde": condition["condition.date"][0].end
        }
    }
    return c;
}
