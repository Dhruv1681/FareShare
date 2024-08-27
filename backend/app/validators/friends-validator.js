import { MESSAGE, HTTP_STATUS } from '../constants.js';
import { throwError } from './validator.js';
import friendsService from '../services/entity-services/friends-services.js';

import userService from '../services/entity-services/user-service.js';

export const validatePost = async (request) => {
    await validateUser(request);
    await validateSelfUser(request);
    await validateAlreadyFriend(request);
}

const validateUser = async (request) => {
    const username = request.body.username;
    if (!username || typeof username !== 'string' || username.trim() === '') {
        throwError(MESSAGE.ERROR_USER_NAME_MISSING, HTTP_STATUS.BAD_REQUEST);
    }

    const user = await userService.findOneByUsernameAndNotDeleted(username);
    if (!user) {
        throwError(MESSAGE.ERROR_USERNAME_INVALID, HTTP_STATUS.BAD_REQUEST);
    }
}

const validateSelfUser = async (request) => {
    const currentUserId = request.user.id;

    const username = request.body.username;
    const user = await userService.findOneByUsernameAndNotDeleted(username);
    const secondUserId = user._id.toString();
    
    if (currentUserId === secondUserId) {
        throwError(MESSAGE.ERROR_SELF_FRIEND, HTTP_STATUS.BAD_REQUEST);
    }
}

const validateAlreadyFriend = async (request) => {
    const currentUserId = request.user.id;
    
    const username = request.body.username;
    const user = await userService.findOneByUsernameAndNotDeleted(username);
    const secondUserId = user.id;

    const friend = await friendsService.findByFirstUserAndSecondUser(currentUserId, secondUserId);
    if (friend) {
        throwError(MESSAGE.ERROR_ALREADY_FRIEND, HTTP_STATUS.BAD_REQUEST);
    }
}    
