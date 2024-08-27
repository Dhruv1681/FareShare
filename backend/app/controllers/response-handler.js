import { HTTP_STATUS, MESSAGE, jsonMessage } from '../constants.js';

export const setErrorResponse = (
    response,
    error) => {
    setResponse(response, error.payload || jsonMessage(MESSAGE.ERROR_SOMETHING_WENT_WRONG), error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR);
}

export const setResponse = (response, data = {}, code = HTTP_STATUS.OK) => {
    response
        .status(code)
        .json(data);
}
