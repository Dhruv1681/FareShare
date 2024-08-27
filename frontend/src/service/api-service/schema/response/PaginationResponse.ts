/**
 * Generic interface for a paginated response.
 * @template T - The type of data in the paginated response.
 */
export default interface PaginationResponse<T> {
    /**
     * An array of data items.
     */
    data: T[];

    /**
     * Metadata about the pagination.
     */
    meta: {
        /**
         * The current page number.
         */
        page: number;

        /**
         * The number of items per page.
         */
        pageSize: number;

        /**
         * The count of items in the current page.
         */
        count: number;

        /**
         * The total number of pages.
         */
        totalPages: number;
    };
}