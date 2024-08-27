import { jsonMessage, MESSAGE } from '../constants.js';

export const expiredTokenAdapter = {
    createRequest: (request) => {
        return {
            createdOn: Date.now(),
            createdBy: request.user,
            field: request.token,
            loggedOutAt: Date.now(),
        }
    },
    createResponse: () => jsonMessage(MESSAGE.USER_LOGGED_OUT),
};
