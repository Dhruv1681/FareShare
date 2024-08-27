/**
 * Mongoose module for interacting with the 'Friends' collection in the database.
 * @module FriendsModel
 * @typedef {import('mongoose').Model<FriendsSchema>} FriendsModel
 */

import mongoose from "mongoose";

import abstractEntitySchema from './abstract-entity-schema.js';

const Schema = mongoose.Schema;

const FriendsSchema = new Schema({
    /**
     * The details of the first user.
     * @type {Object}
     * @required
     */
    firstUser: {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        username: {
            type: String,
            required: true,
        },
    },
    /**
     * The details of the second user.
     * @type {Object}
     * @required
     */
    secondUser: {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        username: {
            type: String,
            required: true,
        },
    }
},
);


FriendsSchema.add(abstractEntitySchema);

/**
 * Mongoose model for the 'Friends' collection.
 * @type {FriendsModel}
 */
const FriendsModel = mongoose.model("Friends", FriendsSchema);

export default FriendsModel;
