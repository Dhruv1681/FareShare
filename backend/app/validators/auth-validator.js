import { HTTP_STATUS, MESSAGE, REGEX } from '../constants.js';

import { throwError } from './validator.js';

import userService from '../services/entity-services/user-service.js';
import otpService from '../services/entity-services/otp-service.js';

export const validatePost = async (request) => {
    if (!request.email) {
        throwError(MESSAGE.ERROR_USER_EMAIL_MISSING, HTTP_STATUS.BAD_REQUEST);
    }

    if (!REGEX.EMAIL.test(request.email)) {
        throwError(MESSAGE.ERROR_USER_EMAIL_INVALID, HTTP_STATUS.BAD_REQUEST);
    }

    if (!request.username) {
        throwError(MESSAGE.ERROR_USER_NAME_MISSING, HTTP_STATUS.BAD_REQUEST);
    }

    const existingUserByEmail = await userService.findOneByEmailAndNotDeleted(request.email);
    if (existingUserByEmail) {
        throwError(MESSAGE.ERROR_USER_ALREADY_EXISTS, HTTP_STATUS.CONFLICT);
    }
};

export const validateSendOtp = async (email) => {
    if (!email) {
        throwError(MESSAGE.ERROR_USER_EMAIL_MISSING, HTTP_STATUS.BAD_REQUEST);
    }

    if (!REGEX.EMAIL.test(email)) {
        throwError(MESSAGE.ERROR_USER_EMAIL_INVALID, HTTP_STATUS.BAD_REQUEST);
    }

    const existingUserByEmail = await userService.findOneByEmailAndNotDeleted(email);
    if (!existingUserByEmail) {
        throwError(MESSAGE.ERROR_USER_NOT_EXISTS, HTTP_STATUS.NOT_FOUND);
    }

    const lastOtp = await otpService.findLastOtpByUser(existingUserByEmail);
    if (lastOtp) {
        const currentTime = new Date();
        const timeDifferenceInSeconds = (currentTime - lastOtp.createdOn) / 1000;

        if (timeDifferenceInSeconds < process.env.OTP_TIME_DIFFERENCE_SECONDS) {
            throwError(MESSAGE.ERROR_TOO_FAST_OTP, HTTP_STATUS.TOO_MANY_REQUESTS);
        }
    }
}

export const validatePut = async (request) => {
    if (!request.email) {
        throwError(MESSAGE.ERROR_USER_EMAIL_MISSING, HTTP_STATUS.BAD_REQUEST);
    }

    if (!REGEX.EMAIL.test(request.email)) {
        throwError(MESSAGE.ERROR_USER_EMAIL_INVALID, HTTP_STATUS.BAD_REQUEST);
    }

    const existingUserByEmail = await userService.findOneByEmailAndNotDeleted(request.email);
    if (!existingUserByEmail) {
        throwError(MESSAGE.ERROR_USER_NOT_EXISTS, HTTP_STATUS.NOT_FOUND);
    }

    if (!request.otp) {
        throwError(MESSAGE.ERROR_OTP_MISSING, HTTP_STATUS.BAD_REQUEST);
    }
}