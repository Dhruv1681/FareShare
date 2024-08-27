import { AbstractEntityService } from './abstract-entity-service.js';
import emailService from '../email-service.js';

import { OTP_LENGTH } from '../../constants.js';
import OTP from '../../models/otp-model.js';

export class OTPService extends AbstractEntityService {
    constructor() {
        super(OTP);
    }

    async findLastOtpByUser(user) {
        return await this.Model
            .findOne({ createdBy: user, deleted: false })
            .sort({ createdOn: -1 }) // Sort in descending order to get the latest OTP first
            .exec();
    }

    async create(user) {
        const otp = new OTP();
        otp.createdBy = user;
        otp.user = user;
        otp.field = generateOTP(OTP_LENGTH);

        return await this.add(otp);
    }

    async sendOtpToUserEmail(userEmail, otp) {
        const subject = 'OTP Verification';
        const body = `Your OTP is: ${otp}`;
        await emailService.sendEmail(userEmail, subject, body);
    }
}

const generateOTP = (otpLength) => {
    const min = Math.pow(10, otpLength - 1);
    const max = Math.pow(10, otpLength) - 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const service = new OTPService();
export default service;
