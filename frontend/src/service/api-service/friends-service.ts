import { axiosRequest, HttpMethod } from "./axios-request";
import UserGetResponse from "./schema/response/UserGetResponse";

class FriendsService {
    private static readonly baseURL = '/friends';

    public static get = async (): Promise<UserGetResponse[]> => {
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
            console.error('FriendsService.getAllFriends:', error);
            throw error;
        }
    }

    public static deleteFriend = async (friendId: string): Promise<void> => {
        try {
            const url = `${this.baseURL}/${friendId}`;

            await axiosRequest<void, undefined>(
                HttpMethod.DELETE,
                url,
                undefined,
                undefined,
                undefined
            );
        } catch (error) {
            console.error('FriendsService.deleteFriend:', error);
            throw error;
        }
    }
}

export default FriendsService;