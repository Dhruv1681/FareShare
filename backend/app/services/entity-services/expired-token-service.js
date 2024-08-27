import { AbstractEntityService } from './abstract-entity-service.js';

import ExpiredToken from '../../models/expired-token-model.js';

export class ExpiredTokenService extends AbstractEntityService {
    constructor() {
        super(ExpiredToken);
    }

    async isExpired(token) {
        const entry = await this.Model.findOne({ field: token }).exec();
        return entry; // Returns true if entry exists, false otherwise
    }
}

const service = new ExpiredTokenService();
export default service;
