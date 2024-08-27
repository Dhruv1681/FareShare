import jwt from 'jsonwebtoken';

import expiredTokenService from '../services/entity-services/expired-token-service.js';
import otpService from '../services/entity-services/otp-service.js';
import userService from '../services/entity-services/user-service.js';

import { expiredTokenAdapter } from '../adapters/expired-token-adapter.js';
import { userAdapter } from '../adapters/user-adapter.js';
import { authAdapter } from '../adapters/auth-adapter.js';
import { otpAdapter } from '../adapters/otp-adapter.js';

import { setResponse, setErrorResponse } from './response-handler.js';

import { throwError } from '../validators/validator.js';
import * as validator from '../validators/auth-validator.js'

import { HTTP_STATUS, MESSAGE } from '../constants.js';

export const post = async (request, response) => {
    try {
        let user = await authAdapter.createPostRequest(request);

        await validator.validatePost(user);

        user = await userService.add(user);
        
        const otp = await otpService.create(user);

        await otpService.sendOtpToUserEmail(user.email, otp.field);

        const responseData = await authAdapter.createPostResponse();
        setResponse(response, responseData, HTTP_STATUS.CREATED);
    } catch (error) {
        console.error('Error occured', error.message, error, error.payload);
        setErrorResponse(response, error);
    }
}

export const put = async (request, response) => {
    try {
        const { email, otp } = request.body;
        await validator.validatePut(request.body);

        const user = await userService.findOneByEmailAndNotDeleted(email);

        const otpDatabase = await otpService.findLastOtpByUser(user);
        if (!otpDatabase) {
            throwError(MESSAGE.ERROR_OTP_NOT_SEND, HTTP_STATUS.NOT_FOUND);
        }

        if (otpDatabase.field !== otp) {
            throwError(MESSAGE.ERROR_INVALID_OTP, HTTP_STATUS.NOT_FOUND);
        }

        if (otpDatabase.accessedAt) {
            throwError(MESSAGE.ERROR_INVALID_OTP, HTTP_STATUS.NOT_FOUND);
        }

        const currentDate = Date.now();

        otpDatabase.accessedAt = currentDate;
        otpDatabase.updatedOn = currentDate;
        otpDatabase.updatedBy = user;
        await otpDatabase.save();

        // Create a JWT token with user information
        const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, {
            algorithm: process.env.JWT_ALGORITHM,
            expiresIn: process.env.JWT_EXPIRATION,
        });

        // Include the JWT token in the response
        setResponse(response, { token });
    } catch (error) {
        console.error('Error occured', error.message, error);
        setErrorResponse(response, error);
    }
}

export const remove = async (request, response) => {
    try {
        const expiredToken = expiredTokenAdapter.createRequest(request);
        await expiredTokenService.add(expiredToken);
        setResponse(response);
    } catch (error) {
        console.error('Error occured', error.message, error);
        setErrorResponse(response, error);
    }
}

export const sendOtp = async (request, response) => {
    try {
        const { email } = request.body;
        await validator.validateSendOtp(email);

        const user = await userService.findOneByEmailAndNotDeleted(email);
        
        const otp = await otpService.findLastOtpByUser(user);
        if (otp) {
            otp.updatedOn = Date.now();
            otp.updatedBy = user;
            console.log('Delete last otp', otp);
            await otpService.softDelete(otp);
        }

        const newOtp = await otpService.create(user);
        console.log('newOtp dipatch', newOtp);

        await otpService.sendOtpToUserEmail(user.email, newOtp.field);

        const responseData = otpAdapter.createResponse();
        setResponse(response, responseData);
    } catch (error) {
        console.error('Error occured', error.message, error);
        setErrorResponse(response, error);
    }
}

export const get = async (request, response) => {
    try {
        const responseData = userAdapter.createUserGetResponse(request.user);
        setResponse(response, responseData);
    } catch (error) {
        console.error('Error occured', error.message, error);
        setErrorResponse(response, error);
    }
}

