import express from 'express';

import * as expenseController from '../controllers/expense-controller.js';

// Create an instance of the express Router
const router = express.Router();

// Define routes for handling HTTP GET and POST requests
router.route('/')
      .get(expenseController.find) // Get all expenses
      .post(expenseController.post); // Create a new expense

// router.route('/categories')
//       .get(expenseController.getCategories);


// Define routes for handling HTTP POST requests for adding bulk expenses using CSV file
router.route('/csv/upload')
      .post(expenseController.uploadCsv);

// Define routes for handling HTTP POST for exporting expenses to CSV file
router.route('/csv/export')
      .post(expenseController.exportCsv)


// Define routes for handling HTTP GET, PUT, and DELETE requests by passing ID as a path parameter
router.route('/:id')
      .get(expenseController.get) // Get a expense by expense id
      .put(expenseController.put) // Update expense by expense id
      .delete(expenseController.remove) // Delete a expense by expense id

export default router;