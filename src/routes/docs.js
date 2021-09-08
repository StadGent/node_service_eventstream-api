import * as swaggerDocument from '../swagger.json';
import express from 'express';
import swaggerUi from 'swagger-ui-express';

const router = express.Router();

router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(swaggerDocument));

export default router;
