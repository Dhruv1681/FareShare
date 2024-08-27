import express from 'express';

import * as accountController from '../controllers/account-controller.js';

const router = express.Router();

router.route('/')
    .get(accountController.get)
    .patch(accountController.patch)
    .delete(accountController.remove);

export default router;
