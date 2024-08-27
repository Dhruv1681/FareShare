import { axiosRequest, HttpMethod } from "./axios-request";

import LoginUserOtpRequest from "./schema/request/LoginUserOtpRequest";
import LoginUserOtpResponse from "./schema/response/LoginUserOtpResponse";
import RegisterUserRequest from "./schema/request/RegisterUserRequest";
import RegisterUserResponse from "./schema/response/RegisterUserResponse";
import SendOTPRequest from "./schema/request/SendOTPRequest";
import SendOTPResponse from "./schema/response/SendOTPResponse";
import UserLogoutResponse from "./schema/response/UserLogoutResponse";
import UserGetResponse from "./schema/response/UserGetResponse";

/**
 * Authentication service for handling user authentication.
 *
 * @class
 */
class AuthService {
    /**
     * Base URL for authentication API endpoints.
     * @private
     * @readonly
     */
    private static readonly baseURL = '/auth';

    /**
     * Authentication service to send OTP.
     *
     * @static 
     * @param {string} email - The email address for which OTP needs to be sent.
     * @returns {Promise<string>} A Promise that resolves to the message from the server.
     * @throws {Error} Throws an error if the request encounters an error.
     */
    public static sendOTP = async (email: string): Promise<SendOTPResponse> => {
        try {
            const url = `${this.baseURL}/otp`;

            const requestData: SendOTPRequest = {
                email: email,
            };

            const response = await axiosRequest<SendOTPResponse, SendOTPRequest>(
                HttpMethod.POST,
                url,
                undefined,
                requestData,
                undefined
            );

            return response;
        } catch (error) {
            console.error('AuthService.sendOTP:', error);
            throw error;
        }
    }

    /**
     * Sends a POST request to register a new user.
     * @param {RegisterUserRequest} data - The user registration data.
     * @returns {Promise<RegisterUserResponse>} A promise that resolves to the registration response.
     * @throws {Error} Throws an error if the registration request fails.
     */
    public static post = async (data: RegisterUserRequest): Promise<RegisterUserResponse> => {
        try {
            const response = await axiosRequest<RegisterUserResponse, RegisterUserRequest>(
                HttpMethod.POST,
                this.baseURL,
                undefined,
                data,
                undefined
            );

            return response;
        } catch (error) {
            console.error('AuthService.post:', error);
            throw error;
        }
    }

    /**
     * Sends a PUT request for user login with OTP.
     * @param {LoginUserOtpRequest} data - The login with OTP request data.
     * @returns {Promise<LoginUserOtpResponse>} A promise that resolves to the login with OTP response.
     * @throws {Error} Throws an error if the login with OTP request fails.
     */
    public static put = async (data: LoginUserOtpRequest): Promise<LoginUserOtpResponse> => {
        try {
            const response = await axiosRequest<LoginUserOtpResponse, LoginUserOtpRequest>(
                HttpMethod.PUT,
                this.baseURL,
                undefined,
                data,
                undefined
            );

            return response;
        } catch (error) {
            console.error('AuthService.put:', error);
            throw error;
        }
    }

    /**
     * Represents a method to perform user logout by making a DELETE request.
     *
     * @returns {Promise<UserLogoutResponse>} A Promise that resolves with the response data upon successful logout.
     * @throws {Error} Throws an error if the logout request fails.
     */
    public static remove = async (): Promise<UserLogoutResponse> => {
        try {
            const response = await axiosRequest<UserLogoutResponse>(
                HttpMethod.DELETE,
                this.baseURL,
                undefined,
                undefined,
                undefined
            );

            return response;
        } catch (error) {
            console.error('AuthService.remove:', error);
            throw error;
        }
    }

    public static get = async (): Promise<UserGetResponse> => {
        try {
            const response = await axiosRequest<UserGetResponse>(
                HttpMethod.GET,
                this.baseURL
            );

            return response;
        } catch (error) {
            console.error('AuthService.get:', error);
            throw error;
        }
    }
}

export default AuthService;
