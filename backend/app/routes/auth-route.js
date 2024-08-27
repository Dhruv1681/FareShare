import express from 'express';

import * as authController from '../controllers/auth-controller.js';

const router = express.Router();

router.route('/')
    .get(authController.get)
    .post(authController.post)
    .put(authController.put)
    .delete(authController.remove);

router.route('/otp')
    .post(authController.sendOtp);

export default router;
