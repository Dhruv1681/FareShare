import { jsonMessage } from '../constants.js';

export const throwError = (message, statusCode, payload) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    error.payload = payload || jsonMessage(message);
    throw error;
}
