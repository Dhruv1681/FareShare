import express from 'express';

import * as GroupController from '../controllers/group-controller.js';

const router = express.Router();

router.route('/')
    .get(GroupController.find)
    .post(GroupController.post);

router.route('/:id')
    .get(GroupController.findById)
    .put(GroupController.put)

export default router;
