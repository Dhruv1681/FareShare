import express from 'express';

import * as filesController from '../controllers/files-controller.js';

const router = express.Router();

router.route('/:filePath')
    .get(filesController.get);

export default router;
