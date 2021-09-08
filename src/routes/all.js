import express from 'express';
import Config from '../config/config';
import { getDiscoveryMetadata } from '../controllers/discoveryController';
import { getEventstream } from '../controllers/eventstreamController';
import { statusAmIUp, statusDb } from '../controllers/healthcheckController';

const config = Config.getConfig();
const port = (config.eventstream.port != '' && config.eventstream.port != '80') ? ':' + config.eventstream.port : '';
const path = config.eventstream.path != '' ? config.eventstream.path + '/' : '';
const baseURI = config.eventstream.protocol + '://' + config.eventstream.hostname + port + '/' + path;
const router = express.Router();


let setHeaders = function (_req, res, next) {
  res.set({
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/ld+json',
    'Allow': 'GET',
    'Content-Language': 'nl'
  });
  next();
};

router.use(setHeaders);


router.get('/favicon.ico', (_req, res) => res.status(404).send("Not found"));
router.get('/', getDiscoveryMetadata);

router.get("/status/am-i-up", statusAmIUp);
router.get("/status/db", statusDb);

router.get("/:institution/:adlibDatabase", getEventstream);
router.get('/id/datasetcatalogus/:ref', (_req, res) => res.redirect(baseURI));
router.get('/:institution/id/dataset/:ref', (_req, res) => res.redirect(baseURI));

export default router;
