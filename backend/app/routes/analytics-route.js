import express from 'express';

import * as analyticsController from '../controllers/analytics-controller.js';

const router = express.Router();

router.route('/api-access').get(analyticsController.getApiAccess);

export default router;
