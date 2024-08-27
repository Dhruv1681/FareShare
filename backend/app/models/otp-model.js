import mongoose from 'mongoose';

import abstractEntitySchema from './abstract-entity-schema.js';

const otpSchema = new mongoose.Schema({
    field: {
        type: String,
        required: true,
    },
    accessedAt: {
        type: Date,
        required: false,
        default: null,
    },
});

otpSchema.add(abstractEntitySchema);

const OTP = mongoose.model('OTP', otpSchema);

export default OTP;
