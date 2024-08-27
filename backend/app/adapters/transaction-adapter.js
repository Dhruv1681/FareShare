import { jsonMessage, MESSAGE, SPLIT_TYPES } from '../constants.js';

import { abstractEntityAdapter } from './abstract-entity-adapter.js';

import splitService from '../services/split-service.js';
import ledgerService from '../services/ledger-service.js';
import userService from '../services/entity-services/user-service.js';
import dateService from '../services/date-service.js';
import paginationService from '../services/pagination-service.js';

export const transactionAdapter = {

    async createFindResponse(transactions, page, size, count, currentUser) {
        const list = await transactionAdapter.createResponseList(transactions);
        const extraData = await transactionAdapter.addExtraListData(list, currentUser);
        const paginationData = paginationService.createPagination(extraData, page, size, count);
        return paginationData;
    },

    async addExtraListData(transactions, currentUser) {

        const data = await Promise.all(transactions.map(
            async (transaction) => {
                return await transactionAdapter.addExtraData(transaction, currentUser);
            })
        );

        return data;
    },

    async addExtraData(transaction, currentUser) {
        const date = transaction.date;
        const monthText = await dateService.getMonthText(date);
        const dateText = await dateService.getDateText(date);

        const paidBy = transaction.paidBy;
        const currentUsername = currentUser.username;

        let userText;
        if (paidBy === currentUsername) {
            userText = 'You';
        } else {
            const user = await userService.findOneByUsernameAndNotDeleted(paidBy);
            const userObject = user.toObject();
            userText = await userService.getFullName(userObject);
        }

        const ledger = transaction.ledger;
        const amount = ledger[currentUsername];

        let shareText;
        let fontColor;
        let amountText;
        if (!amount || amount == 0) {
            shareText = 'Not Involved';
            fontColor = '#000';
            amountText = `$ 0`;;
        } else {
            shareText = amount < 0 ? `You borrowed` : `You lent`;
            fontColor = amount < 0 ? 'red' : '#32C29F';  // red for borrowed, green for lent
            amountText = `$ ${Math.abs(amount)}`;
        }

        
        const paidByText = `${userText} paid US$${transaction.amount}`;

        const extraData = {
            monthText,
            dateText,
            paidByText,
            shareText,
            fontColor,
            amountText
        }

        transaction.extraData = extraData;
        return transaction;
    },

    createRequest: async (request) => {
        const {
            description,
            amount,
            category,
            groupId,
            paidBy,
            split,
        } = request;

        let shares;
        let ledger;

        const splitType = split.type;
        if (splitType === SPLIT_TYPES.REIMBURSE) {
            shares = await splitService.split(amount, split);
            ledger = await ledgerService.create(amount, paidBy, shares);

            shares = { [paidBy] : amount};
            ledger = Object.fromEntries(
                Object.entries(ledger).map(([user, value]) => [user, -value])
            );
        } else if (splitType === SPLIT_TYPES.SETTLEMENT) {
            ledger = {
                [paidBy]: amount,
                [split.payload]: -amount
            }
        } else {
            shares = await splitService.split(amount, split);
            ledger = await ledgerService.create(amount, paidBy, shares);
        }

        const transactionObject = {
            description,
            amount,
            category,
            groupId,
            paidBy,
            split,
            shares,
            ledger,

        };

        transactionObject.date = await dateService.parseDateString(request.date);

        return transactionObject;
    },

    createResponseList: async (transactions) => {
        return await Promise.all(transactions.map(
            async (transaction) => {
                return await transactionAdapter.createResponse(transaction);
            })
        );
    },

    createResponse: async (transaction) => {

        let responseData = transaction.toObject();

        const createdBy = responseData.createdBy;
        const createdByEntity = await userService.findById(createdBy);
        const createdByUsername = createdByEntity.username;
        responseData.createdBy = createdByUsername;

        const updatedBy = responseData.updatedBy;
        if (updatedBy) {
            const updatedByEntity = await userService.findById(updatedBy);
            const updatedByUsername = updatedByEntity.username;
            responseData.updatedBy = updatedByUsername;
        }

        responseData = await abstractEntityAdapter.createGenericResponse(responseData);
        return responseData;
    },

    transformUserResponse: async (user) => {
        const { _id, __v, deleted, createdBy, updatedBy, preferences, ...rest } = user.toObject();

        const userObject = {
            id: _id,
            ...rest,
        };

        return userObject;
    },

    createTransactionDeleteResponse: () => jsonMessage(MESSAGE.USER_TRANSACTION_DELETED),

    createUploadCSVRequest: async (request, groupId) => {

        const transactionObjectsArray = request.map((obj) => {
            const {
                Date,
                Description,
                Category,
                Cost,
                PaidBy,
                ...unequalPayload
            } = obj;

            const splitPayload = {};

            for (const key in unequalPayload) {
                splitPayload[key] = Number(unequalPayload[key]);
            }

            return {
                date: Date,
                description: Description,
                amount: Number(Cost),
                category: Category,
                split: {
                    type: SPLIT_TYPES.UNEQUAL,
                    payload: splitPayload
                },
                groupId,
                paidBy: PaidBy
            }
        });

        return transactionObjectsArray;
    },

    createUploadCSVResponse: ()  => jsonMessage(MESSAGE.USER_EXPENSE_ADDED)

};
