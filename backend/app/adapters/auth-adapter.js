
import { jsonMessage, MESSAGE } from '../constants.js';

export const authAdapter = {
    createPostRequest: async (request) => {
        const user = request.body;
        user.createdOn = Date.now();
        return user;
    },

    createPostResponse: async () => {
        return jsonMessage(MESSAGE.USER_REGISTERED_OTP_SENT);
    }
}
