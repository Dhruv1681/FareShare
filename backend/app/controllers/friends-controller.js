import * as validator from '../validators/friends-validator.js';
import { friendsAdapter } from '../adapters/friends-adapter.js';

import friendsService from '../services/entity-services/friends-services.js';
import { setResponse, setErrorResponse } from '../controllers/response-handler.js';
import { HTTP_STATUS } from '../constants.js';

export const post = async (request, response) => { // post function
    try { // try
        await validator.validatePost(request); // validate request

        const friend = await friendsAdapter.createPostRequest(request); // save friend
        await friendsService.add(friend); // post friend

        // Create another entry where second user is first user and first user is second user
        const otherFriend = {firstUser: friend.secondUser, secondUser: friend.firstUser};
        await friendsService.add(otherFriend);

        const responseData = await friendsAdapter.createPostResponse();
        setResponse(response, responseData, HTTP_STATUS.CREATED); // set response
    } catch (error) { // catch
        console.error('Error occured', error.message, error, error.payload);
        setErrorResponse(response, error); // set error response
    }
}

export const get = async (request, response) => { // get function
    try { // try
        const search = request.query?.search?.trim();        
        const friends = search 
            ? await friendsService.findAllByFirstUserIdAndSecondUsernameMatchingAndSortedBySecondUserName(
                request.user._id,
                search)
            : await friendsService.findAllByFirstUserId(request.user._id);

        const responseData = await friendsAdapter.createGetResponse(friends);
        setResponse(response, responseData); // set response
    } catch (error) { // catch
        console.error('Error occured', error.message, error, error.payload);
        setErrorResponse(response, error); // set error response
    }
}
