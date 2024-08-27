import express from 'express';

import * as SplitController from '../controllers/split-controller.js';

// Create an instance of the express Router
const router = express.Router();

// Define routes for handling HTTP GET requests
router.route('/')
    .get(SplitController.get); // Get all groups

export default router;