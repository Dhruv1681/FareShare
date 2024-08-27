import mongoose from 'mongoose';

import abstractEntitySchema from './abstract-entity-schema.js';

/**
 * Mongoose schema for representing group ledgers.
 *
 * @typedef {Object} GroupLedger
 * @property {string} groupId - The unique identifier for the group.
 * @property {Object} ledger - The ledger object representing the financial transactions within the group.
 */

/**
 * Mongoose schema definition for the group ledger.
 *
 * @type {mongoose.Schema}
 * @constant
 * @name groupLedgerSchema
 * @memberof YourModuleOrClass
 */
const groupLedgerSchema = new mongoose.Schema({
    groupId: {
        type: String,
        required: true,
    },
    ledger: {
        type: Object,
        required: true,
    },
});

groupLedgerSchema.add(abstractEntitySchema);

const GroupLedger = mongoose.model('GroupLedger', groupLedgerSchema);
export default GroupLedger;

