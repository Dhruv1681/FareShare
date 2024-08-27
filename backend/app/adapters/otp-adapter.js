import { jsonMessage, MESSAGE } from '../constants.js';

export const otpAdapter = {
    createResponse: () => jsonMessage(MESSAGE.USER_OTP_SENT),
};
