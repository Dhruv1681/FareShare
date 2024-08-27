import abstractEntitySchema from './abstract-entity-schema.js';

import mongoose from "mongoose";

const Schema = mongoose.Schema;

const splitSchema = new Schema({
    // Define the properties of the split object without an ID
    type: {
        type: String,
        required: true,
    },
    payload: {
        type: Object,
        required: true,
    }
}, { _id: false });

// Define the schema for the Group model
const transactionSchema = new Schema({
    description: {
        type: String,
        require: true
    },
    amount: {
        type: Number,
        required: true
    },
    paidBy: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    groupId: {
        type: String,
        required: false,
    },
    split: {
        type: splitSchema,
        required: true,
    },
    shares: {
        type: Object,
        required: false,
    },
    ledger: {
        type: Object,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
});

// Extend abstractEntitySchema
transactionSchema.add(abstractEntitySchema);

// Create the model
const TransactionModel = mongoose.model('Transaction', transactionSchema);
export default TransactionModel;