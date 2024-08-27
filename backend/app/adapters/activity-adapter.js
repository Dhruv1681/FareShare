import { MESSAGE, jsonMessage } from '../constants.js';
import { abstractEntityAdapter } from './abstract-entity-adapter.js';

import transactionService from '../services/entity-services/transaction-service.js';
import groupService from '../services/entity-services/group-service.js';
import paginationService from '../services/pagination-service.js';

export const activityAdapter = {
    createGetResponse: async (activities, page, pageSize, count) => {
        const dataList = await Promise.all(
            activities.map(async (activity) => {
                const activityObject = activity.toObject();
                const data = abstractEntityAdapter.createGenericResponse(activityObject);
                const entity = data.entity;
                const entityId = data.entityId;
                let entityData = null;
                if (entity === 'transaction') {
                    entityData = await transactionService.findById(entityId);
                } else if (entity === 'group') {
                    entityData = await groupService.findById(entityId);
                }

                const deleted = entityData.deleted;

                return {...data, deleted};
            })
        );        

        return paginationService.createPagination(dataList, page, pageSize, count);
    },

    createPatchResponse: async () => {
        return jsonMessage(MESSAGE.ACTIVITY_MARKED_AS_READ);
    }
}
