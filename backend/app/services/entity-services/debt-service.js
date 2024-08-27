import { AbstractEntityService } from './abstract-entity-service.js';

import Debt from '../../models/debt-model.js';

/**
 * Service class for managing Debt entities.
 *
 * @class DebtService
 * @extends {AbstractEntityService}
 */
export class DebtService extends AbstractEntityService {
    constructor() {
        super(Debt);
    }

    /**
     * Resolve debt based on a transaction ledger.
     *
     * @param {Object} transaction - The transaction object containing a ledger.
     * @param {Object.<string, number>} transaction.ledger - The ledger representing the transaction details.
     * @returns {Promise<void>} - A Promise that resolves when the debt resolution process is completed.
     *
     * @async
     * @function resolveDebt
     * @memberof YourClassOrModule
     * @throws {Error} If any error occurs during the debt resolution process.
     * @description
     * This function takes a transaction object containing a ledger and resolves debt between a lender and borrowers.
     * The lender is determined based on the positive value in the ledger. For each borrower, it checks and updates the debt
     * records. If a debt record doesn't exist, a new one is created. The debt resolution process involves updating the
     * debt amounts and saving the records. The function returns a Promise that resolves when the debt resolution is completed.
     * Any errors that occur during the process will be thrown as an Error object.
     */
    async resolveTransaction(transaction) {
        const ledger = transaction.ledger;
        await this.appendDebts(ledger);
    }

    async resolveUpdatedTransaction(oldTransaction, newTransaction) {
        const oldLedger = oldTransaction.ledger;
        const newLedger = newTransaction.ledger;

        await this.removeDebts(oldLedger);
        await this.appendDebts(newLedger);
    }

    async removeDebts(ledger) {
        const reversedLedger = Object.fromEntries(
            Object.entries(ledger).map(([key, value]) => [key, -value])
        );

        await this.appendDebts(reversedLedger);
    }

    async appendDebts(ledger) {
        const positiveEntriesCount = Object.values(ledger).filter(value => value > 0).length;

        if (positiveEntriesCount == 1) {
            await this.resolveNormalDebts(ledger);
        } else {
            await this.resolveReimbursementDebts(ledger);
        }
    }

    async resolveNormalDebts(ledger) {
        const lender = Object.keys(ledger).find(user => ledger[user] > 0);
        for (const borrower in ledger) {
            if (borrower === lender) {
                continue;
            }

            let debtFromLender = await this.findOneByQueryAndNotDeleted({ fromUser: lender, toUser: borrower });
            if (!debtFromLender) {
                debtFromLender = await this.add({
                    fromUser: lender,
                    toUser: borrower,
                    createdOn: Date.now(),
                });
            } else {
                debtFromLender.updatedOn = Date.now();
            }

            let debtFromBorrower = await this.findOneByQueryAndNotDeleted({ fromUser: borrower, toUser: lender });
            if (!debtFromBorrower) {
                debtFromBorrower = await this.add({
                    fromUser: borrower,
                    toUser: lender,
                    createdOn: Date.now(),
                });
            } else {
                debtFromBorrower.updatedOn = Date.now();
            }

            debtFromLender.amount += ledger[borrower];
            debtFromBorrower.amount -= ledger[borrower];

            await debtFromLender.save();
            await debtFromBorrower.save();
        }
    }

    async resolveReimbursementDebts(ledger) {
        const borrower = Object.keys(ledger).find(user => ledger[user] < 0);
        for (const lender in ledger) {
            if (lender === borrower) {
                continue;
            }

            let debtFromLender = await this.findOneByQueryAndNotDeleted({ fromUser: lender, toUser: borrower });
            if (!debtFromLender) {
                debtFromLender = await this.add({
                    fromUser: lender,
                    toUser: borrower,
                    createdOn: Date.now(),
                });
            } else {
                debtFromLender.updatedOn = Date.now();
            }

            let debtFromBorrower = await this.findOneByQueryAndNotDeleted({ fromUser: borrower, toUser: lender });
            if (!debtFromBorrower) {
                debtFromBorrower = await this.add({
                    fromUser: borrower,
                    toUser: lender,
                    createdOn: Date.now(),
                });
            } else {
                debtFromBorrower.updatedOn = Date.now();
            }

            debtFromLender.amount -= ledger[lender];
            debtFromBorrower.amount += ledger[lender];

            await debtFromLender.save();
            await debtFromBorrower.save();
        }
    }

}

const service = new DebtService();
export default service;
