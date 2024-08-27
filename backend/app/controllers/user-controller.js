import userService from '../services/entity-services/user-service.js';

import { setResponse, setErrorResponse } from './response-handler.js';
import { userAdapter } from '../adapters/user-adapter.js';

// Controller function to handle HTTP GET requests to retrieve users
export const find = async (request, response) => {
    try {
        // Extract query parameters from the request
        // const params = { ...request.query };
        
        const query = { _id: { $ne: request.user._id } };
        const sort = { firstname: 1 };

        const users = await userService.findByQueryAndNotDeletedAndSort(query, sort);
        const data = userAdapter.createFindResponse(users);
        // Set the response
        setResponse(response, data);
    } catch (err) {
        console.error('User Controller Error occured in find', err.message, err, err.payload);
        setErrorResponse(response, err);
    }
}

// Controller function to handle HTTP POST requests to create a new user
export const post = async (request, response) => {
    try {
        // Extract the new user data from the request body
        const newUser = { ...request.body };
        
        // Call the save function from UserService to create a new user
        const user = await userService.save(newUser);
        
        // Set the response
        setResponse(user, response);
    } catch (err) {
        console.error('User Controller Error occured in post', err.message, err, err.payload);
        setErrorResponse(err, response);
    }
}

// Controller function to handle HTTP DELETE requests to remove a user by ID
export const remove = async (request, response) => {
    try {
        // Extract the user ID from the request parameters
        const id = request.params.id;
        console.log("Id: ", id);

        // Call the remove function from UserService to delete a user
        const user = await userService.remove(id);
        
        // Set the response
        setResponse(user, response);
    } catch (err) {
        console.error('User Controller Error occured in remove', err.message, err, err.payload);
        setErrorResponse(err, response);
    }
}

export const findById = async (request, response) => {
    try {
        const id = request.params.id;
        const user = await userService.findById(id);
        const data = userAdapter.createFindByIdResponse(user);

        setResponse(response, data);
    } catch (error) {
        console.error('Error occured', error.message, error, error.payload);
        setErrorResponse(response, error);
    }
}

export const update = async (request, response) => {
    try {
        const id = request.user.id;
        const user = await userService.update(id, request.body);
        //const data = userAdapter.createUpdateResponse(user);

        setResponse(response, user);
    } catch (error) {
        console.error('Error occured', error.message, error, error.payload);
        setErrorResponse(response, error);
    }
}
