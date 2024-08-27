
import { MESSAGE } from '../constants.js';

import { setResponse, setErrorResponse } from './response-handler.js';
import { throwError } from '../validators/validator.js';
import { activityAdapter } from '../adapters/activity-adapter.js';

import activityService from '../services/entity-services/activity-service.js';

export const get = async (request, response) => {
    try {
        // Can't give all the response, will paginate by default
        const { page = 1, size = 10 } = request.query;
        const username = request.user.username;

        const query = { username};
        const sort = { createdOn: -1 };
        const activities = await activityService.paginate(
            page, 
            size,
            query,
            sort);

        const count = await activityService.count(query);
        const data = await activityAdapter.createGetResponse(activities, +page, +size, +count);
        setResponse(response, data);
    } catch (error) {
        console.error('Error occured', error.message, error);
        setErrorResponse(response, error);
    }
}

export const patch = async (request, response) => {
    try {
        const id = request.params.id;
        const username = request.user.username;
        const query = { id, username,};

        const activity = await activityService.findOneByQueryAndNotDeleted(query);
        if (!activity) {
            throwError(MESSAGE.ERROR_ACTIVITY_NOT_FOUND);
        }

        await activityService.markAsRead(id);

        const data = await activityAdapter.createPatchResponse();
        setResponse(response, data);
    } catch (error) {
        console.error('Error occured', error.message, error);
        setErrorResponse(response, error);
    }
}