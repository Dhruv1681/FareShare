import { throwError } from "../validators/validator.js";
import { SPLIT_TYPES, MESSAGE, HTTP_STATUS } from '../constants.js';

/**
 * Service class for splitting amounts among users.
 *
 * @class SplitService
 */
class SplitService {

    /**
     * Splits an amount among users based on the specified split type and payload.
     *
     * @param {number} amount - The total amount to be split.
     * @param {Object} split - An object containing the split type and payload.
     * @param {string} split.type - The type of split (e.g., 'equal', 'percentage', 'shares').
     * @param {Object} split.payload - The payload containing information necessary for the split.
     * @returns {Object} - An object where each user is a key with their corresponding split amount (rounded to 2 decimal places).
     */
    async split(amount, split) {
        const type = split.type;
        const payload = split.payload;
        
        let data = null;
        switch (type) {
            case SPLIT_TYPES.EQUAL:
            case SPLIT_TYPES.REIMBURSE:
                data = await this.splitEqually(amount, payload);
                break;

            case SPLIT_TYPES.SETTLEMENT:
                // Will not be a share against anyone
                break;

            case SPLIT_TYPES.UNEQUAL:
                data = await this.splitUnequally(amount, payload);
                break;

            case SPLIT_TYPES.PERCENTAGE:
                data = await this.splitByPercentage(amount, payload);
                break;

            case SPLIT_TYPES.SHARES:
                data = await this.splitByShares(amount, payload);
                break;
        }

        return data;
    }

    /**
     * Splits an amount equally among a list of users.
     *
     * @param {number} amount - The total amount to be split.
     * @param {string[]} users - An array of user names to split the amount among.
     * @returns {Object} - An object where each user is a key with their corresponding split amount (rounded to 2 decimal places).
     */
    async splitEqually(amount, users) {
        const split = {};
        const amountPerUser = parseFloat((amount / users.length).toFixed(2));
        const remainder = parseFloat((amount - amountPerUser * users.length).toFixed(2));

        users.forEach((user, index) => {
            split[user] = parseFloat(amountPerUser);
            if (index === 0) {
                split[user] = split[user] + remainder;
            }
        });

        return split;
    }

    /**
     * Split an amount unequally among a group of users based on the provided payload.
     *
     * Since the payload already contains accurate information on how much each split should be, 
     * no additional processing is required within this function.
     */
    async splitUnequally(amount, users) {
        return users;
    }

    /**
     * Splits an amount among users based on specified shares.
     *
     * @param {number} amount - The total amount to be split.
     * @param {Object} shares - An object where each user is a key with their specified share.
     * @returns {Object} - An object where each user is a key with their corresponding split amount (rounded to 2 decimal places).
     */
    async splitByShares(amount, shares) {
        const split = {};
        const totalShares = Object.values(shares).reduce((total, share) => total + share, 0);

        if (totalShares === 0) {
            throwError(MESSAGE.ERROR_TOTAL_SHARES_ZERO_NOT_ALLOWED, HTTP_STATUS.BAD_REQUEST);
        }

        let remainingAmount = amount;
        Object.keys(shares).forEach(user => {
            const userShare = parseFloat(((shares[user] / totalShares) * amount).toFixed(2));
            split[user] = userShare;
            remainingAmount -= userShare;
        });

        const firstUserKey = Object.keys(shares)[0];
        if (remainingAmount !== 0) {
            split[firstUserKey] = split[firstUserKey] + remainingAmount;
        }

        return split;
    }

    /**
     * Splits an amount among users based on specified percentages.
     *
     * @param {number} amount - The total amount to be split.
     * @param {Object} percentages - An object where each user is a key with their specified percentage share.
     * @returns {Object} - An object where each user is a key with their corresponding split amount (rounded to 2 decimal places).
     * @throws {Error} - Throws an error if the total percentages do not sum up to 100.
     */
    async splitByPercentage(amount, percentages) {
        const split = {};

        let remainingAmount = amount;
        Object.keys(percentages).forEach(user => {
            const userShare = parseFloat(((percentages[user] / 100) * amount).toFixed(2));
            split[user] = userShare;
            remainingAmount -= userShare;
        });

        const firstUserKey = Object.keys(percentages)[0];
        if (remainingAmount !== 0) {
            split[firstUserKey] = split[firstUserKey] + remainingAmount;
        }

        return split;
    }

}

const service = new SplitService();
export default service;
