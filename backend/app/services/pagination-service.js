/**
 * PaginationService class for creating pagination responses.
 */
class PaginationService {
    /**
     * Creates a pagination object containing data and metadata.
     * @param {Array} data - The array of items to be paginated.
     * @param {number} page - The current page number.
     * @param {number} pageSize - The number of items per page.
     * @param {number} count - The total count of items.
     * @returns {Object} A pagination object with 'data' and 'meta'.
     */
    createPagination(data, page, pageSize, count) {
        return {
            data: data,
            meta: {
                page: page,
                pageSize: pageSize,
                count: count,
                totalPages: Math.ceil(count / pageSize)
            }
        };
    }
}

const service = new PaginationService();
export default service;
