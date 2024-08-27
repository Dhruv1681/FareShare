import splitService from '../services/split-service.js';
import { SPLIT_TYPES, MESSAGE, HTTP_STATUS } from '../constants.js';

import { setResponse, setErrorResponse } from './response-handler.js';
import { throwError } from '../validators/validator.js';

export const get = async (request, response) => {
    try {
        const amount = request.body.amount;
        
        const split = request.body.split;

        const type = split.type;
        if (type !== SPLIT_TYPES.EQUAL 
            && type !== SPLIT_TYPES.REIMBURSE
            && type !== SPLIT_TYPES.PERCENTAGE
            && type !== SPLIT_TYPES.SHARES) {
            throwError(MESSAGE.ERROR_OPERATION_NOT_SUPPORTED, HTTP_STATUS.BAD_REQUEST);
        }

        const data = await splitService.split(amount, split);
        setResponse(response, data);
    } catch (err) {
        console.error('Error in split-controller: ', err);
        setErrorResponse(response, err);
    }
}
