const express = require("express");
let { getEventstream } = require("../controllers/eventstreamController");
let { getDiscoveryMetadata } = require("../controllers/discoveryController");

let Config = require("../config/config.js");
let config = Config.getConfig();
let port = config.eventstream.port != '' ? ':' + config.eventstream.port : '';
let path = config.eventstream.path != '' ? config.eventstream.path + '/' : '';

const baseURI = config.eventstream.protocol + '://' + config.eventstream.hostname + port + '/' + path;

const router = express.Router();

router.get('/favicon.ico', (req, res) => res.status(404).send("Not found"));

router.get('/', getDiscoveryMetadata)
router.get("/:institution/:adlibDatabase", getEventstream);

router.get('/id/datasetcatalogus/:ref', (req, res) => res.redirect(baseURI));
router.get('/:institution/id/dataset/:ref', (req, res) => res.redirect(baseURI))

module.exports = router;
