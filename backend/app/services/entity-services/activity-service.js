import { AbstractEntityService } from './abstract-entity-service.js';
import groupService from './group-service.js';
import userService from './user-service.js';

import Activity from '../../models/activity-model.js';

import { COLORS } from '../../constants.js';

/**
 * Service class for managing activities, extends AbstractEntityService.
 * @extends AbstractEntityService
 */
export class ActivityService extends AbstractEntityService {
    constructor() {
        super(Activity);
    }

    /**
     * Marks an activity as read by updating the 'read' property to true.
     * @async
     * @param {string} activityId - The identifier of the activity to mark as read.
     * @returns {Promise<void>} A promise representing the asynchronous operation.
     * @throws {Error} If an error occurs during the update process.
     * 
     */
    async markAsRead(activityId) {
        await this.update(activityId, { read: true });
    }

    async handleTransactionAdd(transaction) {
        const ledger = transaction.ledger;

        const users = Object.keys(ledger);
        const description = transaction.description;
        const createdById = transaction.createdBy._id;
        const createdByUser = await userService.findById(createdById);
        const createdByUserFullname = await userService.getFullName(createdByUser);

        let groupName = 'Personal';
        const groupId = transaction.groupId;
        if (groupId) {
            const group = await groupService.findById(groupId);
            groupName = group.name;
        }
        
        const activities = await Promise.all(
            users.map(async (username) => {
                const currentUser = await userService.findOneByUsernameAndNotDeleted(username);
                const currentUserFullname = await userService.getFullName(currentUser);
                const name = currentUserFullname === createdByUserFullname ? 'You' : createdByUserFullname;                

                const textData = [
                    { text: name, bold: true },
                    { text: 'added', bold: false },
                    { text: description, bold: true },
                    { text: 'in', bold: false },
                    { text: groupName, bold: true }
                ];

                const amount = ledger[username];
                
                let text, textColor;
                if (amount < 0) {
                    text = `You owe $${Math.abs(amount)}`;
                    textColor = COLORS.RED;
                } else if (amount > 0) {
                    text = `You get back $${Math.abs(amount)}`;
                    textColor = COLORS.GREEN;
                } else {
                    text = 'You donot owe anything';
                    textColor = COLORS.GREY;
                }

                const activity = {
                    entity: 'transaction',
                    entityId: transaction._id,
                    textData,
                    username,
                    text,
                    textColor,
                    read: false,
                    createdOn: transaction.createdOn,
                };
                
                return activity;
            })
        )

        await this.addList(activities);
    }

    async handleTransactionUpdate(oldTransaction, newTransaction) {
        const oldUsers = Object.keys(oldTransaction.ledger);
        const users = Object.keys(newTransaction.ledger);

        const removedUsers = oldUsers.filter((username) => !users.includes(username));
        const combinedUsers = [...users, ...removedUsers];

        const description = newTransaction.description;
        const updatedById = newTransaction.updatedBy._id;
        const updatedByUser = await userService.findById(updatedById);
        const updatedByUsername = updatedByUser.username;
        
        let groupName = 'Personal';
        const groupId = newTransaction.groupId;
        if (groupId) {
            const group = await groupService.findById(groupId);
            groupName = group.name;
        }

        const ledger = newTransaction.ledger;
        const textData = [
            { text: updatedByUsername, bold: true },
            { text: 'updated', bold: false },
            { text: description, bold: true },
            { text: 'in', bold: false },
            { text: groupName, bold: true }
        ];

        const activities = await Promise.all(
            combinedUsers.map(async (username) => {
                const amount = ledger[username];
                
                let text, textColor;
                if (amount < 0) {
                    text = `You owe $${Math.abs(amount)}`;
                    textColor = COLORS.RED;
                } else if (amount > 0) {
                    text = `You get back $${Math.abs(amount)}`;
                    textColor = COLORS.GREEN;
                } else {
                    text = 'You donot owe anything';
                    textColor = COLORS.GREY;
                }

                const activity = {
                    entity: 'transaction',
                    entityId: newTransaction._id,
                    textData,
                    username,
                    text,
                    textColor,
                    read: false,
                    createdOn: newTransaction.updatedOn,
                };
                
                return activity;
            })
        )

        await this.addList(activities);
    }

    async handleGroupMemberAdd() {

    }

    async handleGroupUpdate() {
        
    }

    async handleGroupDelete() {
        
    }

    

    

    async handleTransactionDelete() {

    }

}

const service = new ActivityService();
export default service;
