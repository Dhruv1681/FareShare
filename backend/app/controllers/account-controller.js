import { userAdapter } from '../adapters/user-adapter.js';

import userService from '../services/entity-services/user-service.js';

import { setResponse, setErrorResponse } from './response-handler.js';

export const get = async (request, response) => {
    try {
        const data = userAdapter.createUserAccountGetResponse(request.user);
        setResponse(response, data);
    } catch (error) {
        console.error('Error occured', error.message, error, error.payload);
        setErrorResponse(response, error);
    }
}

export const patch = async (request, response) => {
    try {
        const user = request.user;
        const userObject = user.toObject();

        // Extract updated preferences from the request body
        const updatedPreferences = request.body;

        // Get the existing keys in the preferences object
        const existingKeys = Object.keys(userObject.preferences);

        // Filter out keys that are not present in the existing preferences
        const validUpdatedPreferences = Object
            .keys(updatedPreferences)
            .filter(key => existingKeys.includes(key))
            .reduce((obj, key) => {
                obj[key] = updatedPreferences[key];
                return obj;
            }, {});

        // Update specific keys in the preferences object
        Object.assign(user.preferences, validUpdatedPreferences);

        const updatedUser = await user.save();

        const data = userAdapter.createUserAccountGetResponse(updatedUser);
        setResponse(response, data);
    } catch (error) {
        console.error('Error occured', error.message, error, error.payload);
        setErrorResponse(response, error);
    }
}

export const remove = async (request, response) => {
    try {
        const user = request.user;
        await userService.softDelete(user);

        const data = userAdapter.createUserAccountDeleteResponse();
        setResponse(response, data);
    } catch (error) {
        console.error('Error occured', error.message, error, error.payload);
        setErrorResponse(response, error);
    }
}
