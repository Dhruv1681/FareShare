import { axiosRequest, HttpMethod } from "./axios-request";
import GetGroupResponse from './schema/response/GroupGetResponse';
import GroupSaveRequest from './schema/request/GroupSaveRequest';

 class GroupService {
    private static readonly baseURL = '/groups';

    public static find = async (): Promise<GetGroupResponse[]> => {
        try {
            const url = `${this.baseURL}`;

            const response = await axiosRequest<GetGroupResponse[], undefined>(
                HttpMethod.GET,
                url,
                undefined,
                undefined,
                undefined
            );

            return response;
        } catch (error) {
            console.error('GroupService.find:', error);
            throw error;
        }
    }

    public static save = async (data:GroupSaveRequest): Promise<GetGroupResponse> => {
        try {
            const url = `${this.baseURL}`;

            const response = await axiosRequest<GetGroupResponse, GroupSaveRequest>(
                HttpMethod.POST,
                url,
                undefined,
                data,
                undefined
            );

            return response;
        } catch (error) {
            console.error('GroupService.save:', error);
            throw error;
        }
    }

    public static findById = async (id: string): Promise<GetGroupResponse> => {
        try {
            const url = `${this.baseURL}/${id}`;
            console.log("URL: ", url);
            const response = await axiosRequest<GetGroupResponse, undefined>(
                HttpMethod.GET,
                url,
                undefined,
                undefined,
                undefined
            );

            return response;
        } catch (error) {
            console.error('GroupService.findById:', error);
            throw error;
        }
    }

 }

export default GroupService;
