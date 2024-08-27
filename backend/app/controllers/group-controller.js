import groupService from '../services/entity-services/group-service.js';

import { groupAdapter } from '../adapters/group-adapter.js';
import { HTTP_STATUS, MESSAGE } from '../constants.js';
import { setErrorResponse, setResponse } from './response-handler.js';
import { throwError } from '../validators/validator.js';

/**
 * Handles the request to find all groups that are not deleted.
 * @param {import('express').Request} request - The Express request object.
 * @param {import('express').Response} response - The Express response object.
 * @returns {Promise<void>} A promise representing the asynchronous operation.
 */
export const find = async (request, response) => {
    try {
        const groups = await groupService.findAllNotDeleted();
        const data = groupAdapter.createFindResponse(groups);
        setResponse(response, data);
    } catch (error) {
        console.error('Error occured', error.message, error, error.payload);
        setErrorResponse(response, error);
    }
}

/**
 * Handles the request to find a group by ID.
 * @param {import('express').Request} request - The Express request object.
 * @param {import('express').Response} response - The Express response object.
 * @returns {Promise<void>} A promise representing the asynchronous operation.
 */
export const findById = async (request, response) => {
    try {
        const id = request.params.id;
        const group = await groupService.findById(id);
        if (!group) {
            throwError(MESSAGE.ERROR_GROUP_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
        }

        const data = groupAdapter.createFindByIdResponse(group);
        setResponse(response, data);
    } catch (error) {
        console.error('Error occured', error.message, error, error.payload);
        setErrorResponse(response, error);
    }
}

/**
 * Handles the request to add a new group.
 * @param {import('express').Request} request - The Express request object.
 * @param {import('express').Response} response - The Express response object.
 * @returns {Promise<void>} A promise representing the asynchronous operation.
 */ 
export const post = async (request, response) => {
    try {
        // TODO Validator for validation POST request especially for categories, users
        const group = groupAdapter.createPostRequest(request);
        await groupService.add(group);
        const data = groupAdapter.createPostResponse();
        setResponse(response, data, HTTP_STATUS.CREATED);
    } catch (error) {
        console.error('Error occured', error.message, error, error.payload);
        setErrorResponse(response, error);
    }
}

/**
 * Handles the request to update a group by ID.
 * @param {import('express').Request} request - The Express request object.
 * @param {import('express').Response} response - The Express response object.
 * @returns {Promise<void>} A promise representing the asynchronous operation.
 */
export const put = async (request, response) => {
    try {
        // TODO Validator for validation PUT request especially for categories, users
        const id = request.params.id;
        const existingGroup = await groupService.findById(id);
        if (!existingGroup) {
            throwError(MESSAGE.ERROR_GROUP_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
        }

        const group = groupAdapter.createPutRequest(request);
        await groupService.update(id, group);
        const data = groupAdapter.createPutResponse();
        setResponse(response, data);
    } catch (error) {
        console.error('Error occured', error.message, error, error.payload);
        setErrorResponse(response, error);
    }
}

