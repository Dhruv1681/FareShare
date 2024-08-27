import userService from '../services/entity-services/user-service.js';
import { abstractEntityAdapter } from './abstract-entity-adapter.js';
import { jsonMessage, MESSAGE } from '../constants.js';

export const friendsAdapter = {
    createPostRequest: async (request) => {
        const username = request.body.username;
        const user = await userService.findOneByUsernameAndNotDeleted(username);
        const friend = {
            firstUser: {
                userId: request.user._id,
                username: request.user.username,
            },
            secondUser: {
                userId: user._id,
                username: user.username,
            },
            createdBy: request.user
        }

        return friend;
    },

    createPostResponse: async () => {
        return jsonMessage(MESSAGE.FRIEND_ADDED);
    },

    createGetResponse: async (friends) => {
        const responseData = await Promise.all(friends.map(
            async (friend) => {
                const user = await userService.findByIdAndNotDeleted(friend.secondUser.userId);
                return await friendsAdapter.transformUserResponse(user);
            })
        );

        return responseData;
    },

    transformUserResponse: async (user) => {
        const { _id, __v, deleted, createdBy, updatedBy, preferences, ...rest } = user.toObject();

        const userObject = {
            id: _id,
            ...rest,
        };

        return userObject;
    },
}
