import { HTTP_STATUS, MESSAGE, REGEX, TRANSACTION_CATEGORIES, SPLIT_TYPES, MESSAGE_CREATORS } from '../constants.js';

import { throwError } from './validator.js';

import userService from '../services/entity-services/user-service.js';
import groupService from '../services/entity-services/group-service.js';
import transactionService from '../services/entity-services/transaction-service.js';

export const validatePut = async (id, request) => {
    await validateId(id);
    await validateRequestBody(request);
}

export const validatePost = async (request) => {
    await validateRequestBody(request);
}

const validateId = async (id) => {
    if (!id || typeof id !== 'string' || id.trim() === '') {
        throwError(MESSAGE.ERROR_EXPENSE_ID_REQUIRED, HTTP_STATUS.BAD_REQUEST);
    }

    const transaction = await transactionService.findByIdAndNotDeleted(id);
    if (!transaction) {
        throwError(MESSAGE.ERROR_EXPENSE_NOT_FOUND, HTTP_STATUS.BAD_REQUEST);
    }
}

const validateRequestBody = async (request) => {
    await validateDescription(request);
    await validateAmount(request);
    await validateDate(request);
    await validateGroupIfExists(request);
    await validateCategory(request);
    await validatePaidBy(request);
    await validateSplitBy(request);
    await validateSplitPayload(request);
}

const validateDescription = (request) => {
    if (!request.description || typeof request.description !== 'string' || request.description.trim() === '') {
        throwError(MESSAGE.ERROR_DESCRIPTION_MISSING, HTTP_STATUS.BAD_REQUEST);
    }
}

const validateAmount = (request) => {
    if (!request.amount || typeof request.amount !== 'number' || request.amount <= 0) {
        throwError(MESSAGE.ERROR_AMOUNT_MISSING, HTTP_STATUS.BAD_REQUEST);
    }
}

const validateDate = (request) => {
    const dateRegex = REGEX.DATE;
    if (!request.date || !dateRegex.test(request.date)) {
        throwError(MESSAGE.ERROR_DATE_MISSING, HTTP_STATUS.BAD_REQUEST);
    }
}

const validateGroupIfExists = async (request) => {
    const groupId = request.groupId;
    if (!groupId) {
        return;
    }

    if (typeof groupId !== 'string') {
        throwError(MESSAGE.ERROR_INVALID_GROUP, HTTP_STATUS.BAD_REQUEST);
    }

    const group = await groupService.findByIdAndNotDeleted(groupId);
    if (!group) {
        throwError(MESSAGE.ERROR_INVALID_GROUP, HTTP_STATUS.BAD_REQUEST);
    }
}

const validateCategory = (request) => {
    if (!request.category || typeof request.category !== 'string' || request.category.trim() === '') {
        throwError(MESSAGE.ERROR_CATEGORY_MISSING, HTTP_STATUS.BAD_REQUEST);
    }

    const validCategories = Object.values(TRANSACTION_CATEGORIES).flatMap(subcategories => Object.values(subcategories));
    if (!validCategories.includes(request.category)) {
        throwError(MESSAGE.ERROR_INVALID_CATEGORY, HTTP_STATUS.BAD_REQUEST);
    }
}

const validatePaidBy = async (request) => {
    const paidBy = request.paidBy;
    if (!paidBy || typeof paidBy !== 'string' || paidBy.trim() === '') {
        throwError(MESSAGE.ERROR_PAID_BY_MISSING, HTTP_STATUS.BAD_REQUEST);
    }

    const user = await userService.findOneByUsernameAndNotDeleted(paidBy);
    if (!user) {
        const message = MESSAGE_CREATORS.paidByUsernameInvalid(paidBy);
        throwError(message, HTTP_STATUS.BAD_REQUEST);
    }
}

const validateSplitBy = async (request) => {
    const split = request.split;
    if (!split || typeof split !== 'object' || split.length === 0) {
        throwError(MESSAGE.ERROR_SPLIT_BY_MISSING, HTTP_STATUS.BAD_REQUEST);
    }

    const type = split.type;
    if (!type || typeof type !== 'string' || type.trim() === '') {
        throwError(MESSAGE.ERROR_SPLIT_BY_TYPE_MISSING, HTTP_STATUS.BAD_REQUEST);
    }

    if (!Object.values(SPLIT_TYPES).includes(type)) {
        throwError(MESSAGE.ERROR_INVALID_SPLIT_TYPE, HTTP_STATUS.BAD_REQUEST);
    }    

}

const validateSplitPayload = async (request) => {
    const split = request.split;
    const type = split.type;
    const payload = split.payload;
    if (!payload || (Array.isArray(payload) && payload.length === 0) || (typeof payload === 'object' && Object.keys(payload).length === 0)) {
        throwError(MESSAGE.ERROR_PAYLOAD_MISSING, HTTP_STATUS.BAD_REQUEST);
    }

    switch (type) {
        case SPLIT_TYPES.EQUAL:
            await validateSplitEqualPayload(request);
            break;
        case SPLIT_TYPES.UNEQUAL:
            await validateSplitUnequalPayload(request);
            break;
        case SPLIT_TYPES.PERCENTAGE:
            await validateSplitPercentagePayload(request);
            break;
        case SPLIT_TYPES.SHARES:
            await validateSplitSharesPayload(request);
            break;
        case SPLIT_TYPES.SETTLEMENT:
            await validateSplitSettlementPayload(request);
            break;
        case SPLIT_TYPES.ITEMIZED:
            await validateSplitItemizedPayload(request);
            break;
        case SPLIT_TYPES.REIMBURSE:
            await validateSplitReimbursePayload(request);
            break;
        
    }
}

const validateSplitEqualPayload = async (request) => {
    const payload = request.split.payload;
    checkForDuplicates(payload);
    await checkInvalidUsers(payload);
}

const validateSplitUnequalPayload = async (request) => {
    const amount = request.amount;
    const payload = request.split.payload;
    const users = Object.keys(payload);
    checkForDuplicates(users);

    const values =  Object.values(payload);
    checkNegativeValues(values);

    checkMatchingSum(values, amount);

    await checkInvalidUsers(users);
}

const validateSplitPercentagePayload = async (request) => {
    const payload = request.split.payload;
    const users = Object.keys(payload);
    checkForDuplicates(users);

    const values =  Object.values(payload);
    checkNegativeValues(values);

    checkPercentageMatchingSum(values);

    await checkInvalidUsers(users);
}

const validateSplitSharesPayload = async (request) => {
    const payload = request.split.payload;
    const users = Object.keys(payload);
    checkForDuplicates(users);

    const values =  Object.values(payload);
    checkNegativeValues(values);

    checkNonDecimalValues(values);

    await checkInvalidUsers(users);
}

const validateSplitSettlementPayload = async (request) => {
    const payload = request.split.payload;
    await checkInvalidUsername(payload);
    checkSameUser(request);
}

const validateSplitReimbursePayload = async (request) => {
    const payload = request.split.payload;
    checkForDuplicates(payload);
    await checkInvalidUsers(payload);
}


const validateSplitItemizedPayload = async (request) => {
    const items = request.split.payload.items;
    for (const item of items) {
        const description = item.description;
        if (!description || typeof description !== 'string' || description.trim() === '') {
            throwError(MESSAGE.ERROR_DESCRIPTION_MISSING, HTTP_STATUS.BAD_REQUEST);
        }

        const amount = item.amount;
        if (!amount || typeof amount !== 'number' || amount <= 0) {
            throwError(MESSAGE.ERROR_AMOUNT_MISSING, HTTP_STATUS.BAD_REQUEST);
        }

        const usersPayload = item.users;
        const users = Object.keys(usersPayload);
        await checkInvalidUsers(users);

        const values = Object.values(usersPayload);
        checkNegativeValues(values);

        checkMatchingSum(values, amount);
    }

    const tax = request.split.payload.tax;
    if (tax) {
        const taxAmount = tax.amount;
        if (!taxAmount || typeof taxAmount !== 'number' || taxAmount <= 0) {
            throwError(MESSAGE.ERROR_AMOUNT_MISSING, HTTP_STATUS.BAD_REQUEST);
        }
    
        const taxUsersPayload = tax.users;
        const taxUsers = Object.keys(taxUsersPayload);
        await checkInvalidUsers(taxUsers);
    
        const taxValues = Object.values(taxUsersPayload);
        checkNegativeValues(taxValues);
    
        checkMatchingSum(taxValues, taxAmount);
    }

    const tip = request.split.payload.tip;
    if (tip) {
        const tipAmount = tip.amount;
        if (!tipAmount || typeof tipAmount !== 'number' || tipAmount <= 0) {
            throwError(MESSAGE.ERROR_AMOUNT_MISSING, HTTP_STATUS.BAD_REQUEST);
        }
    
        const tipUsersPayload = tip.users;
        const tipUsers = Object.keys(tipUsersPayload);
        await checkInvalidUsers(tipUsers);
    
        const tipValues = Object.values(tipUsersPayload);
        checkNegativeValues(tipValues);
    
        checkMatchingSum(tipValues, tipAmount);
    }    
}

const checkForDuplicates = async (keys) => {
    const duplicateCheckSet = new Set();
    const hasDuplicates = keys.some((key) => {
        if (duplicateCheckSet.has(key)) {
            return true;
        }
        duplicateCheckSet.add(key);
        return false;
    });

    if (hasDuplicates) {
        throwError("Duplicate keys found in the payload.", HTTP_STATUS.BAD_REQUEST);
    }
}

const checkInvalidUsers = async (users) => {
    await Promise.all(
        users.map(async (username) => {
            const user = await userService.findOneByUsernameAndNotDeleted(username);
            if (!user) {
                const message = MESSAGE_CREATORS.usernameInvalid(username);
                throwError(message, HTTP_STATUS.BAD_REQUEST);
            }
        })
    );
}

const checkInvalidUsername = async (username) => {
    const user = await userService.findOneByUsernameAndNotDeleted(username);
    if (!user) {
        const message = MESSAGE_CREATORS.usernameInvalid(username);
        throwError(message, HTTP_STATUS.BAD_REQUEST);
    }
}

const checkSameUser = (request) => {
    const paidUser = request.paidBy;
    const username = request.split.payload;
    if (paidUser === username) {
        throwError(MESSAGE.ERROR_SAME_USER_SETTLEMENT_NOT_ALLOWED, HTTP_STATUS.BAD_REQUEST);
    }
}

const checkNegativeValues = (values) => {
    const hasNegativeValue = values.some((value) => value < 0);
    if  (hasNegativeValue) {
        throwError(MESSAGE.ERROR_NEGATIVE_VALUES, HTTP_STATUS.BAD_REQUEST);
    }
}

const checkMatchingSum = (values, sum) => {
    const total = values.reduce((a, b) => a + b, 0);
    const totalNotMatch = total !== sum;
    if (totalNotMatch) {
        throwError(MESSAGE.ERROR_SUM_NOT_MATCH, HTTP_STATUS.BAD_REQUEST);
    }
}

const checkPercentageMatchingSum = (values) => {
    const total = values.reduce((a, b) => a + b, 0);
    const totalNotMatch = total !== 100;
    if (totalNotMatch) {
        throwError(MESSAGE.ERROR_PERCENTAGE_SUM_NOT_100, HTTP_STATUS.BAD_REQUEST);
    }
}

const checkNonDecimalValues = (values) => {
    const hasNonDecimalValue = values.some((value) => !Number.isInteger(value));
    if  (hasNonDecimalValue) {
        throwError(MESSAGE.ERROR_NON_DECIMAL_VALUES, HTTP_STATUS.BAD_REQUEST);
    }
}