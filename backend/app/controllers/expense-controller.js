import csv from 'csv-parser';
import path from 'path';
import stream from 'stream';

import transactionService from '../services/entity-services/transaction-service.js';
import debtService from '../services/entity-services/debt-service.js';
import notificationDispatcherService from '../services/notification-dispatcher-service.js';
import groupLedgerService from '../services/entity-services/group-ledger-service.js';
import activityService from '../services/entity-services/activity-service.js';

import { transactionAdapter } from '../adapters/transaction-adapter.js';
import { setResponse, setErrorResponse } from './response-handler.js';
import { MESSAGE, HTTP_STATUS } from '../constants.js';
import * as validator from '../validators/expense-validator.js';
import { throwError } from '../validators/validator.js';

// Controller function to handle HTTP GET requests to retrieve groups
export const find = async (request, response) => {
    // Extract query parameters from the request
    try {
        const { all } = request.query;

        if (all) {
            const sort = { date: -1 };
            const transactions = await transactionService.findAllNotDeletedBySort(sort);
            const data = await transactionAdapter.createResponseList(transactions);        
            setResponse(response, data);
        } else {
            // Can't give all the response, will paginate by default
            const { page = 1, size = 10, groupId, username } = request.query;

            const query = { deleted: false };
            if (groupId) {
                query.groupId = groupId;
            }

            if (username) {
                const usernameArray = Array.isArray(username) ? username : [username];
                const ledgerQuery = usernameArray.map(username => ({ [`ledger.${username}`]: { $exists: true } }));
                query.$and = ledgerQuery;
            }

            const sort = { date: -1 };
            const transactions = await transactionService.paginate(
                page, 
                size,
                query,
                sort);

            const count = await transactionService.count(query);
            const data = await transactionAdapter.createFindResponse(
                transactions, 
                +page, 
                +size, 
                +count,
                request.user);

            setResponse(response, data);
        }
        
    } catch (error) {
        console.error('Error occured', error.message, error, error.payload);
        // Set error response
        setErrorResponse(response, error);
    }
}

// Controller function to handle HTTP POST requests to create a new group
export const post = async (request, response) => {
    try {
        await validator.validatePost(request.body);

        // Extract the new group data from the request body
        const newTransaction = await transactionAdapter.createRequest(request.body);
        newTransaction.createdBy = request.user._id;
        newTransaction.createdOn = Date.now();

        const transaction = await transactionService.save(newTransaction);

        await debtService.resolveTransaction(transaction);

        const groupId = transaction.groupId;
        if (groupId) {
            await groupLedgerService.appendLedger(groupId, transaction.ledger);
        }

        await activityService.handleTransactionAdd(transaction);

        notificationDispatcherService.dispatchExpenseAdd(transaction);

        const data = await transactionAdapter.createResponse(transaction);

        setResponse(response, data, HTTP_STATUS.CREATED);
    } catch (error) {
        console.error('Error occured', error);
        setErrorResponse(response, error);
    }
}

// Controller function to handle HTTP GET requests to retrieve a group by ID
export const get = async (request, response) => {
    try {
        // Extract the group ID from the request parameters
        const id = request.params.id;

        console.log("Id: ", id);

        // Call the findById function from GroupService to retrieve a group by ID
        const transaction = await transactionService.findByIdAndNotDeleted(id);

        const data = await transactionAdapter.createResponse(transaction);

        // Set the response
        setResponse(response, data);
    } catch (error) {
        console.error('Error occured', error.message, error, error.payload);
        // Set error response
        setErrorResponse(response, error);
    }
}

export const put = async (request, response) => {
    // Controller function to handle HTTP PUT requests to update a group by ID
    try {
        const id = request.params.id;

        await validator.validatePut(id, request.body);

        const oldTransaction = await transactionService.findByIdAndNotDeleted(id);
        const oldTransactionObject = oldTransaction.toObject();
        
        // Extract the new group data from the request body
        const newTransaction = await transactionAdapter.createRequest(request.body);
        newTransaction._id = oldTransactionObject._id;
        newTransaction.createdBy = oldTransactionObject.createdBy;
        newTransaction.createdOn = oldTransactionObject.createdOn;
        newTransaction.updatedBy = request.user._id;
        newTransaction.updatedOn = Date.now();

        const transaction = await transactionService.update(oldTransactionObject._id, newTransaction);

        await debtService.resolveUpdatedTransaction(oldTransactionObject, newTransaction);

        const oldLedger = oldTransactionObject.ledger;
        const newLedger = newTransaction.ledger;

        const oldGroupId = oldTransactionObject.groupId;
        const newGroupId = newTransaction.groupId;

        if (oldGroupId) {
            await groupLedgerService.deleteLedger(oldGroupId, oldLedger);
        }

        if (newGroupId) {
            await groupLedgerService.appendLedger(newGroupId, newLedger);
        }

        await activityService.handleTransactionUpdate(oldTransactionObject, newTransaction);

        const data = await transactionAdapter.createResponse(transaction);

        notificationDispatcherService.dispatchExpenseUpdate(transaction);

        setResponse(response, data);
    } catch (error) {
        console.error('Error occured', error.message, error, error.payload);
        setErrorResponse(response, error);
    }
}

// Controller function to handle HTTP DELETE requests to remove a group by ID
export const remove = async (request, response) => {
    try {
        // Extract the group ID from the request parameters
        const id = request.params.id;

        let transaction = await transactionService.findByIdAndNotDeleted(id);
        if (!transaction) {
            throwError(MESSAGE.ERROR_EXPENSE_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
        }

        const transactionObject = transaction.toObject();
        const ledger = transactionObject.ledger;
        await debtService.removeDebts(ledger);

        const groupId = transactionObject.groupId;
        if (groupId) {
            await groupLedgerService.deleteLedger(groupId, ledger);
        }

        // Call the remove function from GroupService to delete a group
        transaction = await transactionService.softDeleteById(id);

        notificationDispatcherService.dispatchExpenseDelete(transaction);

        // Set the response
        setResponse(response, {}, HTTP_STATUS.NO_CONTENT);
    } catch (error) {
        console.error('Error occured in delete', error.message, error, error.payload);
        // Set error response
        setErrorResponse(response, error);
    }
}

// Controller function to handle HTTP POST requests to read a csv file
export const uploadCsv = async (request, response) => {
    try {

        if(!request.files || Object.keys(request.files).length === 0) {
            console.error('Please upload an CSV file.');
            setErrorResponse(response, "Please upload an CSV file.", HTTP_STATUS.BAD_REQUEST);
            return;
        }
        
        const uploadedFile = request.files.file;
        const filetypes = /csv/;
        const extentname = filetypes.test(path.extname(uploadedFile.name).toLowerCase());
        const mimetype = filetypes.test(uploadedFile.mimetype);
        if(!extentname && !mimetype) {
            console.error('Unsupported File format.');
            setErrorResponse(response, "Unsupported File format.", HTTP_STATUS.BAD_REQUEST);
            return;
        } else {
            const data = [];

            const fileBuffer = uploadedFile.data;

            // Parse CSV data from buffer and store in data array
            const parseStream = csv();
            parseStream.on('data', (dataRow) => {
                data.push(dataRow);
            });
            parseStream.on('error', (error) => {
                console.error('Error occured:', error);
                setErrorResponse(response, error, HTTP_STATUS.INTERNAL_SERVER_ERROR);
                return;
            });
            parseStream.on('end', async () => {

                const requestList = await transactionAdapter.createUploadCSVRequest(data, '');

                requestList.forEach(async (request) => {

                    await validator.validatePost(request);

                    // // Extract the new group data from the request body
                    // const newTransaction = await transactionAdapter.createRequest(request);
                    // newTransaction.createdBy = request.user;
                    // newTransaction.createdOn = Date.now();

                    // const transaction = await transactionService.save(newTransaction);

                    // await debtService.resolveTransaction(transaction);

                    // const groupId = transaction.groupId;
                    // if (groupId) {
                    //     await groupLedgerService.appendLedger(groupId, transaction.ledger);
                    // }

                    // const data = await transactionAdapter.createResponse(transaction);
                });
               
                setResponse(response, requestList, HTTP_STATUS.CREATED);
            });

            // Pipe the buffer data to CSV parser
            const bufferStream = new stream.PassThrough();
            bufferStream.end(fileBuffer);
            bufferStream.pipe(parseStream);
            
        }
    } catch (error) {
        console.error('Error occured', error.message, error, error.payload);
        setErrorResponse(response, error);
    }
}

// Controller function to handle HTTP GET requests to fetch expense csv file
export const exportCsv = async (request, response) => {
    try {
        const jsonData = request.body.expenses;
        if (!Array.isArray(jsonData) || jsonData.length === 0) {
            console.error('Invalid JSON data or empty array.');
            setErrorResponse(response, "Invalid JSON data or empty array.", HTTP_STATUS.BAD_REQUEST);
            return;
        }
        
        const headers = [
            "description",
            "amount",
            "paidBy",
            "category",
            "date",
            "splitType",
        ];
    
        // Convert JSON to CSV format
        const csvContent = jsonData.reduce((acc, row) => {
            const rowValues = headers.map(header => {
                if(header == 'splitType'){
                    return row['split']?.type;
                }

                return row[header]
            });
            return `${acc}${rowValues.join(',')}\n`;
        }, `${headers.join(',')}\n`);

        setResponse(response, {data: csvContent}, HTTP_STATUS.CREATED);

    } catch (error) {
        console.error('Error occured', error.message, error, error.payload);
        setErrorResponse(response, error);
    }
}