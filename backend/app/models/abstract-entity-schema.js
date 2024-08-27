import mongoose from 'mongoose';

/**
 * @typedef {Object} AbstractEntitySchema
 * @property {Date} createdOn - The date when the entity was created. Defaults to the current date and time.
 * @property {Date | null} updatedOn - The date when the entity was last updated. Defaults to null.
 * @property {mongoose.Schema.Types.ObjectId | null} createdBy - The user who created the entity. Defaults to null.
 * @property {mongoose.Schema.Types.ObjectId | null} updatedBy - The user who last updated the entity. Defaults to null.
 * @property {boolean} deleted - Indicates whether the entity is deleted. Defaults to false.
 */

/**
 * Schema defining common properties for all entities.
 * @type {mongoose.Schema<AbstractEntitySchema>}
 */
const abstractEntitySchema = new mongoose.Schema({
    createdOn: {
        type: Date,
        default: Date.now,
    },
    updatedOn: {
        type: Date,
        default: null,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
    deleted: {
        type: Boolean,
        default: false,
    },
});

export default abstractEntitySchema;
