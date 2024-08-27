import { axiosRequest, HttpMethod } from "./axios-request";
import ActivityResponse from "./schema/response/ActivityResponse";
import PaginationResponse from "./schema/response/PaginationResponse";

class ActivityService {
    private static readonly baseURL = '/activity';

    public static get = async (queryParams: Record<string, string | number>): Promise<PaginationResponse<ActivityResponse>> => {
        try {
            const url = `${this.baseURL}`;

            const response = await axiosRequest<PaginationResponse<ActivityResponse>, undefined>(
                HttpMethod.GET,
                url,
                queryParams,
                undefined,
                undefined
            );

            return response;
        } catch (error) {
            console.error('ActivityService.getAllActivities:', error);
            throw error;
        }
    }

}

export default ActivityService;
