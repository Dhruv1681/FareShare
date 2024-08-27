import mongoose from 'mongoose';

import abstractEntitySchema from './abstract-entity-schema.js';

/**
 * Mongoose schema for the Activity model.
 * @typedef {Object} Activity
 * @property {string} id - Identifier for the activity.
 * @property {string} entity - Type of the entity associated with the activity.
 * @property {string} entityId - Identifier of the associated entity.
 * @property {Array} textData - An array of objects containing text and bold properties for formatting.
 * @property {string} text - A message indicating text information
 * @property {string} textColor - A message indicating  text color
 */

/**
 * Mongoose schema definition for the TextData subdocument.
 * @type {mongoose.Schema}
 */
const textDataSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
    bold: {
        type: Boolean,
        required: true,
    },
}, { _id: false });

/**
 * Mongoose schema definition for the Activity model.
 * @type {mongoose.Schema}
 */
const activitySchema = new mongoose.Schema({
    entity: {
        type: String,
        required: true,
    },
    entityId: {
        type: String,
        required: true,
    },
    textData: [textDataSchema],
    text: {
        type: String,
    },
    textColor: {
        type: String,
    },
    username: {
        type: String,
        required: true,
    },
    read: {
        type: Boolean,
        deault: false,
    }
});

activitySchema.add(abstractEntitySchema);

/**
 * Mongoose model for the Activity.
 * @type {mongoose.Model<Activity>}
 */
const Activity = mongoose.model('Activity', activitySchema);
export default Activity;
