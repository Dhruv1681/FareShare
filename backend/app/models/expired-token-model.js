import mongoose from 'mongoose';
import abstractEntitySchema from './abstract-entity-schema.js';

/**
 * @typedef {Object} ExpiredTokenSchema
 * @property {String} field - The field associated with the expired token. Required.
 * @property {Date} loggedOutAt - The date and time when the token was logged out. Required.
 * @property {Date} createdOn - The date when the token entity was created. Defaults to the current date and time.
 * @property {Date | null} updatedOn - The date when the token entity was last updated. Defaults to null.
 * @property {mongoose.Schema.Types.ObjectId | null} createdBy - The user who created the token entity. Defaults to null.
 * @property {mongoose.Schema.Types.ObjectId | null} updatedBy - The user who last updated the token entity. Defaults to null.
 * @property {boolean} deleted - Indicates whether the token entity is deleted. Defaults to false.
 */

/**
 * Schema defining properties for an expired token, including common properties from the abstract entity schema.
 * @type {mongoose.Schema<ExpiredTokenSchema>}
 */
const expiredTokenSchema = new mongoose.Schema({
    field: {
        type: String,
        required: true,
    },
    loggedOutAt: {
        type: Date,
        required: true,
    },
});

expiredTokenSchema.add(abstractEntitySchema);

/**
 * Model for the ExpiredToken schema.
 * @type {mongoose.Model<ExpiredTokenSchema>}
 */
const ExpiredToken = mongoose.model('ExpiredToken', expiredTokenSchema);
export default ExpiredToken;
