import express from 'express';

import * as activityController from '../controllers/activity-controller.js';

const router = express.Router();

router.route('/')
    .get(activityController.get);

router.route('/:id')
    .patch(activityController.patch)

export default router;
