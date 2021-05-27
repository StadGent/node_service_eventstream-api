import express from 'express';
import { getEventstream } from '../controllers/eventstreamController';
import { getDiscoveryMetadata } from '../controllers/discoveryController';
import { statusAmIUp, statusDb } from '../controllers/healthcheckController';
import Config from '../config/config';

const config = Config.getConfig();
const port = config.eventstream.port != '' ? ':' + config.eventstream.port : '';
const path = config.eventstream.path != '' ? config.eventstream.path + '/' : '';
const baseURI = config.eventstream.protocol + '://' + config.eventstream.hostname + port + '/' + path;
const router = express.Router();

router.get('/favicon.ico', (req, res) => res.status(404).send("Not found"));
router.get('/', getDiscoveryMetadata);

router.get("/status/am-i-up", statusAmIUp);
router.get("/status/db", statusDb);

router.get("/:institution/:adlibDatabase", getEventstream);
router.get('/id/datasetcatalogus/:ref', (req, res) => res.redirect(baseURI));
router.get('/:institution/id/dataset/:ref', (req, res) => res.redirect(baseURI));

export default router;
