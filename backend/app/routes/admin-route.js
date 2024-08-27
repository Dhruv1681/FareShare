import express from 'express';

import * as adminController from '../controllers/admin-controller.js';

const router = express.Router();

router.route('/')
    .post(adminController.post);

export default router;
