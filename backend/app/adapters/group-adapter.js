import { jsonMessage, MESSAGE } from '../constants.js';
import { abstractEntityAdapter } from './abstract-entity-adapter.js';

/**
 * Adapter functions for handling group-related requests and responses.
 * @namespace
 */
export const groupAdapter = {

    /**
     * Creates a post request body for adding a group.
     * @memberof groupAdapter
     * @function
     * @name createPostRequest
     * 
     * @param {import('express').Request} request - The Express request object.
     * @returns {Object} The group data extracted from the request body.
     */
    createPostRequest: (request) => {
        const group = request.body;
        return group;
    },

    /**
     * Creates a put request body for updating a group.
     * @memberof groupAdapter
     * @function
     * @name createPutRequest
     * 
     * @param {import('express').Request} request - The Express request object.
     * @returns {Object} The group data extracted from the request body.
     */
    createPutRequest: (request) => {
        const group = request.body;
        return group;
    },

    /**
     * Creates a response for finding groups.
     * @memberof groupAdapter
     * @function
     * @name createFindResponse
     * 
     * @param {Object[]} groups - An array of group objects.
     * @returns {Object} The response data for the list of groups.
     */
    createFindResponse: (groups) => {
        const data = groups.map((group) => group.toObject());
        return abstractEntityAdapter.createGenericListResponse(data);
    },

    /**
     * Creates a response for finding a group by ID.
     * @memberof groupAdapter
     * @function
     * @name createFindByIdResponse
     * 
     * @param {Object} group - The group object.
     * @returns {Object} The response data for the found group.
     */
    createFindByIdResponse: (group) => {
        const data = group.toObject();
        return abstractEntityAdapter.createGenericResponse(data);
    },

    /**
     * Creates a response for a successful group addition.
     * @memberof groupAdapter
     * @function
     * @name createPostResponse
     * 
     * @returns {Object} The response data for a successful group addition.
     */
    createPostResponse: () => {
        return jsonMessage(MESSAGE.GROUP_ADDED);
    },

    /**
     * Creates a response for a successful group update.
     * @memberof groupAdapter
     * @function
     * @name createPutResponse
     * 
     * @returns {Object} The response data for a successful group update.
     */
    createPutResponse: () => {
        return jsonMessage(MESSAGE.GROUP_UPDATED);
    },

}
