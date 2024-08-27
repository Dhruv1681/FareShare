import axios, { AxiosResponse, AxiosRequestConfig, AxiosInstance } from "axios";

import ErrorResponse from "./schema/response/ErrorResponse";
import { EnhancedStore } from "@reduxjs/toolkit";
import { hideLoading, showLoading } from "../../state/slice/api-slice";
import { resetToken } from "../../state/slice/auth-slice";

let store: EnhancedStore;
export const injectStore = (_store: EnhancedStore) => {
	console.log('injectStore called with store', _store);
	store = _store;
}

/**
 * Enum for HTTP methods.
 * @enum {string}
 */
export const HttpMethod = {
	GET: 'GET',
	POST: 'POST',
	PUT: 'PUT',
	DELETE: 'DELETE',
	PATCH: 'PATCH',
};

/**
 * Axios instance with a base URL.
 * @type {AxiosInstance}
 * @see {@link https://axios-http.com/docs/instance}
 */
const api: AxiosInstance = axios.create({
	baseURL: process.env.REACT_APP_BASE_URL,
});

/**
 * Asynchronous function to make Axios requests.
 *
 * @template T - The type of the expected response data.
 * @template U - The type of the request payload data.
 *
 * @param {Method} method - The HTTP method for the request.
 * @param {string} url - The URL for the request.
 * @param {Record<string, string | number>} [queryParams] - Query parameters for the request.
 * @param {U} [data] - The request payload data.
 * @param {Record<string, string>} [headers] - Custom headers for the request.
 *
 * @returns {Promise<T>} A Promise that resolves to the response data.
 *
 * @throws {Error} - Throws an error if the request encounters an error.
 */
export const axiosRequest = async <T = any, U  = any>(
	method: string,
	url: string,
	queryParams?: Record<string, string | number>,
	data?: U,
	headers?: Record<string, string | number>, 
	loading: boolean = false): Promise<T> => {
	try {
		const token = store.getState().authReducer.token;
		
		if (token) {
			headers = {
				...headers,
				Authorization: `Bearer ${token}`,
			};
		}

		const config: AxiosRequestConfig = {
			method,
			url: url,
			params: queryParams,
			data,
			headers,
			withCredentials: false,
		};

		loading && store.dispatch(showLoading());

		const response: AxiosResponse<T> = await api(config);
		loading && store.dispatch(hideLoading());
		return response.data;
	} catch (error: any) {
		loading && store.dispatch(hideLoading());
		console.error('error', error);
		if (error.response.status === 401) store.dispatch(resetToken());
		throw new ErrorResponse(error.response.data.message);
	}
}
