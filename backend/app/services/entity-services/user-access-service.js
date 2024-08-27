import { AbstractEntityService } from './abstract-entity-service.js';
import UserAccess from '../../models/user-access-model.js';

class UserAccessService extends AbstractEntityService {
    constructor() {
        super(UserAccess);
    }

    async getAllUserAccess(query, pageSize, skip) {
        try {
            const [userAccessList, totalCount] = await Promise.all([
                UserAccess.find(query)
                    .sort({ accessedAt: -1 })
                    .limit(parseInt(pageSize))
                    .skip(parseInt(skip)),
                UserAccess.countDocuments(query), // Count total documents for pagination metadata
            ]);
    
            return { userAccessList, totalCount };
        } catch (error) {
            console.error('Error getting all user access:', error);
            throw error;
        }
    }

    async addUserAccess(userId, endpoint, method, body) {
        try {
            const currentDate = Date.now();
            const userAccess = new UserAccess({
                endpoint,
                method,
                accessedAt : currentDate,
                body: body,
            });

            userAccess.createdBy = userId;
            userAccess.craetedOn = currentDate;

            await userAccess.save();
            return userAccess;
        } catch (error) {
            console.error('Error adding user access:', error);
            throw error;
        }
    }
}

const service = new UserAccessService();
export default service;
