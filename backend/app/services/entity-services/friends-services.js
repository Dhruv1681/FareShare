import { AbstractEntityService } from "./abstract-entity-service.js";

import Friends from "../../models/friends-model.js";

export class FriendsService extends AbstractEntityService {
    constructor() {
        super(Friends);
    }

    async findByFirstUserAndSecondUser(firstUserId, secondUserId) {
        const query = {
            $and: [
                { 'firstUser.userId': firstUserId },
                { 'secondUser.userId': secondUserId },
            ],
        };

        return await this.findOneByQueryAndNotDeleted(query);
    }

    async findAllByFirstUserId(firstUserId) {
        const query = {
            'firstUser.userId': firstUserId,
        };

        return await this.findByQueryAndNotDeleted(query);
    }

    async findAllByFirstUserIdAndSecondUsernameMatchingAndSortedBySecondUserName(
        firstUserId, 
        secondUsernameSearchString) {
        const query = {
            'firstUser.userId': firstUserId,
            'secondUser.username': { $regex: new RegExp(secondUsernameSearchString, 'i') },
        };

        const sortOptions = { 'secondUser.username': 1 };

        return await this.findByQueryAndNotDeletedAndSort(query, sortOptions);
    }
}

const service = new FriendsService();
export default service;
