import { MESSAGE, HTTP_STATUS, ADMIN_ACTION, ADMIN_MESSAGE, jsonMessage } from '../constants.js';
import { throwError } from '../validators/validator.js';

import transactionService from '../services/entity-services/transaction-service.js';
import debtService from '../services/entity-services/debt-service.js';
import groupLedgerService from '../services/entity-services/group-ledger-service.js';
import emailService from '../services/email-service.js';

import GroupLedger from '../models/group-ledger-model.js';
import Debt from '../models/debt-model.js';
import Transaction from '../models/transaction-model.js';
import Activity from '../models/activity-model.js';

import { setResponse, setErrorResponse } from './response-handler.js';

/**
 * Handles the POST request for administrative actions.
 *
 * @param {object} request - The Express request object.
 * @param {object} response - The Express response object.
 * @returns {Promise<void>} - A Promise that resolves after processing the request.
 */
export const post = async (request, response) => {
    try {
        const { secretKey, action } = request.body;
        const { API_ADMIN_SECRET: secretKeyFromEnv } = process.env;
        if (secretKey !== secretKeyFromEnv) {
            throwError(MESSAGE.ERROR_UNAUTHORIZED_ACCESS, HTTP_STATUS.UNAUTHORIZED)
        }

        switch (action) {
            case ADMIN_ACTION.RECALCULATE_LEDGERS:
                await handleRecalculateLedgers(request, response);
                break;
            case ADMIN_ACTION.SEND_TEST_MAIL:
                await handleSendTestMail(request, response);
            case ADMIN_ACTION.DELETE_ENTITIES:
                await deleteAllEntities(request, response);
                break;
            default:
                throwError(MESSAGE.ERROR_INVALID_ACTION, HTTP_STATUS.BAD_REQUEST);
                break;
        }
    } catch (error) {
        console.error('Error occured', error.message, error, error.payload);
        setErrorResponse(response, error);
    }
}

/**
 * Handles the recalculation of ledgers.
 *
 * @param {object} request - The Express request object.
 * @param {object} response - The Express response object.
 * @returns {Promise<void>} - A Promise that resolves after recalculating ledgers.
 */
const handleRecalculateLedgers = async (request, response) => {
    await GroupLedger.deleteMany({});
    await Debt.deleteMany({});

    const transactions = await transactionService.findAllNotDeleted();
    for (const transaction of transactions) {
        const transactionObject = transaction.toObject();
        const { _id: id, ledger, groupId } = transactionObject;
        console.log('id', id, 'ledger', ledger, 'ledger', 'groupId', groupId);

        await debtService.appendDebts(ledger);
        if (groupId) {
            await groupLedgerService.appendLedger(groupId, ledger);
        }
    }
        
    setResponse(response, jsonMessage(ADMIN_MESSAGE.SUCCESS_RECALCULATE_LEDGERS));
}

/**
 * Handles sending a test mail.
 *
 * @param {object} request - The Express request object.
 * @param {object} response - The Express response object.
 * @returns {Promise<void>} - A Promise that resolves after sending a test mail.
 */
const handleSendTestMail = async (request, response) => {
    const { payload } = request.body;
    const { emailId, subject, emailBody } = payload;
    await emailService.sendEmail(emailId, subject, emailBody);
    setResponse(response, jsonMessage(ADMIN_MESSAGE.SUCCESS_MAIL_SENT));
}

/**
 * Handles deleting all entities.
 * @param {object} request - The Express request object.
 * @param {object} response - The Express response object.
 * @returns {Promise<void>} - A Promise that resolves after deleting all entities.
 */
const deleteAllEntities = async (request, response) => {
    const { payload } = request.body;
    const { entity } = payload;
    switch (entity) {
        case 'transactions':
            await Transaction.deleteMany({});
            break;
        case 'activities':
            await Activity.deleteMany({});
            break;
        default:
            throwError(MESSAGE.ERROR_INVALID_ACTION, HTTP_STATUS.BAD_REQUEST);
    }

    setResponse(response, jsonMessage(ADMIN_MESSAGE.SUCCESS_DELETE_ENTITIES));
}