import { jsonMessage, MESSAGE } from '../constants.js';

export const userAdapter = {
    createFindResponse: (users) => {
        const usersResponse = users.map(user => userAdapter.createUserGetResponse(user));
        return usersResponse;
    },
    
    createOtpResponse: () => jsonMessage(MESSAGE.USER_REGISTERED_OTP_SENT),

    createUserAccountGetResponse: (user) => {
        const { _id, __v, deleted, createdBy, preferences, updatedBy, ...rest } = user.toObject();

        const userObject = {
            id: _id,
            ...rest,
        };

        return userObject;
    },

    createUserAccountDeleteResponse: () => jsonMessage(MESSAGE.USER_ACCOUNT_DELETED),

    createUserAccountDeleteResponse: () => jsonMessage(MESSAGE.USER_ACCOUNT_DELETED),

    createUserGetResponse: (user) => {
        const { _id, __v, deleted, createdBy, updatedBy, preferences, ...rest } = user.toObject();

        const userObject = {
            id: _id,
            ...rest,
            fullname: `${user.firstname} ${user.lastname}`,
        };

        return userObject;
    },

    createFindByIdResponse: (user) => {
        const { _id, __v, deleted, ...rest } = user.toObject();

        const userObject = {
            id: _id,
            ...rest,
        };

        return userObject;
    }
	
};
