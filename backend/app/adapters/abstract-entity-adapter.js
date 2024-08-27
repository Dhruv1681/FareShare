export const abstractEntityAdapter = {
    createGenericListResponse: (entities) => {
        const responseData = entities.map((entity) => abstractEntityAdapter.createGenericResponse(entity));
        return responseData;
    },

    createGenericResponse: (entity) => {
        const { _id, __v, deleted, ...rest } = entity;

        return {
            id: _id,
            ...rest,
        };
    },

    createGenericRequest: (data) => ({ ...data }),
};
