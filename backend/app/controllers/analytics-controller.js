import * as userAccessService from '../services/entity-services/user-access-service.js';

export const getApiAccess = async (req, res) => {
    try {
        const { pageSize = 10, pageNumber = 1, fromDate, toDate } = req.query;

        const query = {};

        // Add date filtering if fromDate and toDate are provided
        if (fromDate && toDate) {
            query.accessedAt = {
                $gte: new Date(fromDate),
                $lte: new Date(toDate),
            };
        }

        // Pagination
        const skip = (pageNumber - 1) * pageSize;

        const { userAccessList, totalCount } = await userAccessService.getAllUserAccess(
            query,
            pageSize,
            skip
        );

        const totalPages = Math.ceil(totalCount / pageSize);

        const metadata = {
            pageSize: parseInt(pageSize),
            pageNumber: parseInt(pageNumber),
            totalPages,
            totalCount,
        };

        res.status(200).json({ userAccessList, metadata });
    } catch (error) {
        console.error('Error getting all user access:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
