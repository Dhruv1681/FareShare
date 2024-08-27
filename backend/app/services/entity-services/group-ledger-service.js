import { AbstractEntityService } from './abstract-entity-service.js';

import GroupLedger from '../../models/group-ledger-model.js';

/**
 * Service class for managing group ledgers.
 *
 * @extends AbstractEntityService
 */
export class GroupLedgerService extends AbstractEntityService {
    constructor() {
        super(GroupLedger);
    }

    /**
     * Appends a ledger to a group's existing ledger, combining the values.
     *
     * @param {string} groupId - The unique identifier of the group.
     * @param {Object} ledger - The ledger to append, represented as a key-value pair.
     * @returns {Promise<void>} - A promise that resolves once the ledger is successfully updated.
     *
     * @throws {Error} Throws an error if there is an issue with finding or updating the ledger.
     *
     * @example
     * // Example usage:
     * const groupId = "exampleGroup";
     * const ledgerToUpdate = {
     *    "Dhruv": 10,
     *    "Tanmay": -30
     * };
     * await appendLedger(groupId, ledgerToUpdate);
     */
    async appendLedger(groupId, ledger) {
        let groupLedger = await this.findOneByQueryAndNotDeleted( { groupId: groupId } );
        if (!groupLedger) {
            groupLedger = await this.add({
                groupId: groupId,
                ledger: ledger,
                createdOn: Date.now()
            });
        }  else {
            groupLedger.updatedOn = Date.now();
        }

        const groupLedgerObject = groupLedger.toObject();
        const databaseLedger = groupLedgerObject.ledger;

        const combinedLedger = {};

        for (const key in ledger) {
            combinedLedger[key] = ledger[key];
        }

        for (const key in databaseLedger) {
            if (combinedLedger[key] === undefined) {
                combinedLedger[key] = databaseLedger[key];
            } else {
                combinedLedger[key] += databaseLedger[key];
            }
        }

        const newGroupLedger = {
            _id: groupLedgerObject._id,
            ledger: combinedLedger,
        }
        await this.update(groupLedgerObject._id, newGroupLedger );
    }
    
    async deleteLedger(groupId, ledger) {
        const reversedLedger = Object.fromEntries(
            Object.entries(ledger).map(([key, value]) => [key, -value])
        );

        this.appendLedger(groupId, reversedLedger);
    }
}

const service = new GroupLedgerService();
export default service;
