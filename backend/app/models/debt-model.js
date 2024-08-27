import mongoose from 'mongoose';

import abstractEntitySchema from './abstract-entity-schema.js';

const debtSchema = new mongoose.Schema({
    fromUser: {
        type: String,
        required: true,
    },
    toUser: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
        default: 0,
    }
});

debtSchema.add(abstractEntitySchema);

const Debt = mongoose.model('Debt', debtSchema);
export default Debt;
