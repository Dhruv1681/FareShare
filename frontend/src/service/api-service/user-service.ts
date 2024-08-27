import { axiosRequest, HttpMethod } from "./axios-request";
import UserGetResponse from "./schema/response/UserGetResponse";
import UserSettingsRequest from "./schema/request/UserSettingsRequest";

 class UserService {
    private static readonly baseURL = '/users';

    public static search = async (): Promise<UserGetResponse[]> => {
        try {
            const url = `${this.baseURL}`;

            const response = await axiosRequest<UserGetResponse[], undefined>(
                HttpMethod.GET,
                url,
                undefined,
                undefined,
                undefined
            );

            return response;
        } catch (error) {
            console.error('GroupService.search:', error);
            throw error;
        }
    }

    public static findById = async (id: string): Promise<UserGetResponse> => {
        try {
            const url = `${this.baseURL}/${id}`;
            console.log("URL: ", url);
            const response = await axiosRequest<UserGetResponse, undefined>(
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

    public static save = async (data:UserGetResponse): Promise<UserGetResponse> => {
        try {
            const url = `${this.baseURL}`;

            const response = await axiosRequest<UserGetResponse, UserGetResponse>(
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

    public static update = async (data:UserSettingsRequest): Promise<UserGetResponse> => {
        try {
            const url = `${this.baseURL}/settings`;

            const response = await axiosRequest<UserGetResponse, UserSettingsRequest>(
                HttpMethod.PUT,
                url,
                undefined,
                data,
                undefined
            );

            return response;
        } catch (error) {
            console.error('GroupService.update:', error);
            throw error;
        }
    }
 }

export default UserService;
