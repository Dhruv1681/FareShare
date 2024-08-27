import userService from './entity-services/user-service.js';
import emailService from './email-service.js';

class NotificationDispatcherService {

    async dispatchExpenseAdd(transaction) {
        const createdBy = transaction.createdBy;
        const createdByEntity = await userService.findOneByUsernameAndNotDeleted(createdBy);
        const createdByUserFullname = await userService.getFullName(createdByEntity);

        const shares = transaction.shares;
        const ledger = transaction.ledger;
        const users = Object.keys(ledger);
        for (user of users) {
            if (user === createdBy) {
                continue;
            }

            const userEntity = await userService.findOneByUsernameAndNotDeleted(user);
            const userPreference = userEntity.preferences;
            if (userPreference.receiveExpenseAddedNotification) {
                const share = shares[user];
                const emailBody = 
                    `${createdByUserFullname} has added a new expense "${transaction.name}" for ${transaction.amount}, your share is $${share}`;
                const emailSubject = 'New expense added';
                const email = userEntity.email;

                emailService.sendEmail(email, emailSubject, emailBody);
            }
        }
    }

    async dispatchExpenseUpdate(transaction) {
        const updatedBy = transaction.updatedBy;
        const updatedByEntity = await userService.findOneByUsernameAndNotDeleted(updatedBy);
        const updatedByUserFullname = await userService.getFullName(updatedByEntity);

        const shares = transaction.shares;
        const ledger = transaction.ledger;
        const users = Object.keys(ledger);
        for (user of users) {
            if (user === updatedBy) {
                continue;
            }

            const userEntity = await userService.findOneByUsernameAndNotDeleted(user);
            const userPreference = userEntity.preferences;
            if (userPreference.receiveExpenseEditedDeletedNotification) {
                const share = shares[user];
                const emailBody = 
                    `${createdByUserFullname} has updated the expense "${transaction.name}", your share is $${share}`;
                const emailSubject = 'New expense added';
                const email = userEntity.email;

                emailService.sendEmail(email, emailSubject, emailBody);
            }
        }        
    }

    async dispatchExpenseDelete(transaction) {
        const updatedBy = transaction.updatedBy;
        const updatedByEntity = await userService.findOneByUsernameAndNotDeleted(updatedBy);
        const updatedByUserFullname = await userService.getFullName(updatedByEntity);

        const shares = transaction.shares;
        const ledger = transaction.ledger;
        const users = Object.keys(ledger);
        for (user of users) {
            if (user === updatedBy) {
                continue;
            }

            const userEntity = await userService.findOneByUsernameAndNotDeleted(user);
            const userPreference = userEntity.preferences;
            if (userPreference.receiveExpenseEditedDeletedNotification) {
                const share = shares[user];
                const emailBody = 
                    `${createdByUserFullname} has deleted the expense "${transaction.name}"`;
                const emailSubject = 'New expense added';
                const email = userEntity.email;

                emailService.sendEmail(email, emailSubject, emailBody);
            }
        }        
    }

}

const service = new NotificationDispatcherService();
export default service;