import { AbstractEntityService } from './abstract-entity-service.js';

import Group from '../../models/group-model.js';

/**
 * Service class for managing groups, extends AbstractEntityService.
 * @extends AbstractEntityService
 */
export class GroupService extends AbstractEntityService {
    constructor() {
        super(Group);
    }

}

const service = new GroupService();
export default service;
