import mongoose from 'mongoose';

import abstractEntitySchema from './abstract-entity-schema.js';

const userAccessSchema = new mongoose.Schema({
    endpoint: {
        type: String,
        required: true,
    },
    method: {
        type: String,
        required: true,
    },
    body: {
        type: Object,
        required: false,
    },
    accessedAt: {
        type: Date,
        default: Date.now,
    },
});

userAccessSchema.add(abstractEntitySchema);

const UserAccess = mongoose.model('UserAccess', userAccessSchema);

export default UserAccess;
