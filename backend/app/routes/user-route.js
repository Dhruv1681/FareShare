import express from 'express';

import * as UserController from '../controllers/user-controller.js';

// Create an instance of the express Router
const router = express.Router();

// Define routes for handling HTTP GET and POST requests
router.route('/')
.get(UserController.find) // Get all users
.post(UserController.post); // Create a new User

router.route('/settings')
.get(UserController.findById) // Get user settings
.put(UserController.update); // Update user settings

router.route('/:id')
.get(UserController.findById) // Get a user by user id
.delete(UserController.remove); //Delete a user by user id

export default router;