import mongoose from 'mongoose';

import abstractEntitySchema from './abstract-entity-schema.js';

const Schema = mongoose.Schema;

/**
 * @typedef {Object} Group
 * @property {string} name - The name of the group.
 * @property {string} [category] - The category of the group (optional).
 * @property {string} [image] - The URL of the group's image (optional).
 * @property {string[]} [members] - An array of member usernames (optional).
 * @property {boolean} [simplifiedDebt] - A flag indicating whether the group uses simplified debt calculations (optional).
 */

/**
 * Mongoose schema for the Group model.
 * @type {import('mongoose').Schema<Group>}
 */

const GroupSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
    },
    image: {
        type: String,
    },
    members: [{
        type: String,
    }],
    simplifiedDebt: {
        type: Boolean
    }
});

GroupSchema.add(abstractEntitySchema);

/**
 * Mongoose model for the Group.
 * @type {import('mongoose').Model<Group>}
 */
const GroupModel = mongoose.model("group", GroupSchema);
export default GroupModel;
