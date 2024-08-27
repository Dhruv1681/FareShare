export class AbstractEntityService {
    constructor(Model) {
        this.Model = Model;
    }

    async add(newEntity) {
        const entity = new this.Model(newEntity);
        return await entity.save();
    }

    async addList(newEntities) {
        return await this.Model.create(newEntities);
    }

    async findById(id) {
        const entity = await this.Model.findById(id).exec();
        return entity;
    }

    async findByIdAndNotDeleted(id) {
        const entity = await this.Model.findOne({ _id: id, deleted: false }).exec();
        return entity;
    }

    async findOneByQuery(query) {
        const entities = await this.Model.findOne(query).exec();
        return entities;
    }

    async findOneByQueryAndNotDeleted(query) {
        return await this.findOneByQuery({ ...query, deleted: false });
    }

    async findByQuery(query) {
        const entities = await this.Model.find(query).exec();
        return entities;
    }

    async findByQueryAndNotDeleted(query) {
        return await this.findByQuery({ ...query, deleted: false });
    }

    async findByQueryAndNotDeletedAndSort(query, sortOptions) {
        return await this.Model
            .find({ ...query, deleted: false })
            .sort(sortOptions);
    }

    async findAllNotDeletedSortedByCreatedOnDescending() {
        const entities = await this.Model.find({ deleted: false }).sort({ createdOn: -1 }).exec();
        return entities;
    }

    async findAllNotDeletedBySort(sort) {
        const entities = await this.Model.find({ deleted: false }).sort(sort).exec();
        return entities;
    }

    async findAllNotDeleted() {
        const entities = await this.Model.find({ deleted: false }).exec();
        return entities;
    }

    async update(id, updatedEntity) {
        const entity = await this.Model.findByIdAndUpdate(id, updatedEntity, { new: true }).exec();
        return entity;
    }

    async softDeleteById(id) {
        const entity = await this.findByIdAndNotDeleted(id);
        await this.softDelete(entity);
    }

    async softDelete(entity) {
        entity.deleted = true;
        await entity.save(entity);
    }

    async paginate(page, size, query, sort) {
        const skip = (page - 1) * size;
        return await this.Model
            .find(query)
            .sort(sort)
            .skip(skip)
            .limit(size)
            .exec();
    }

    async count(query) {
        const totalCount = await this.Model.countDocuments(query);
        return totalCount;
    }

}
