import { AbstractEntityService } from './abstract-entity-service.js';

import Transaction from '../../models/transaction-model.js';

export class TransactionService extends AbstractEntityService {
    constructor() {
        super(Transaction);
    }

    // Service function to search for transactions based on provided parameters
    async search(params = {}) {
        const transaction = await this.Model.find(params).exec();
        return transaction;
    }

    // Service function to save a new transaction
    async save(newTransaction) {
        const transaction = new this.Model(newTransaction);
        return await transaction.save();
    }

    // Service function to find a transaction by ID
    async findById(id) {
        const transaction = this.Model.findById(id).exec();
        return transaction;
    }

    // Service function to remove a transaction by ID
    async remove(id) {
        const transaction = await this.findByIdAndNotDeleted(id);
        await this.softDelete(transaction);
    }
}

const service = new TransactionService();
export default service;
