/**
 * Service for handling ledger operations.
 */
class LedgerService {

    /**
     * Creates a ledger based on the provided amount, paidBy user, and split details.
     *
     * @param {number} amount - The total amount for the transaction.
     * @param {string} paidBy - The username of the user who paid the amount.
     * @param {Object} split - An object representing how the amount should be split among users.
     * @returns {Object} - The ledger object with negative values for users based on the split, and the updated value for the paidBy user.
     */
    async create(amount, paidBy, split) {
        const ledger = Object.fromEntries(
            Object.entries(split).map(([user, value]) => [user, -value])
        );

        ledger[paidBy] = (ledger[paidBy] || 0) + amount;
        return ledger;
    }

}

const service = new LedgerService();
export default service;
