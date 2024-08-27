import { query } from "express";
import { axiosRequest, HttpMethod } from "./axios-request";
import ExpenseRequest from "./schema/request/ExpenseSaveRequest";
import ExpenseResponse from "./schema/response/ExpenseResponse";
import PaginationResponse from "./schema/response/PaginationResponse";
import ExpenseExportRequest from "./schema/request/ExpenseExportRequest";
import ExpenseExportResponse from "./schema/response/ExpenseExportResponse";

class ExpenseService {
    private static readonly baseURL = '/expenses';

    public static find = async (queryParams?: Record<string, string | number>): Promise<PaginationResponse<ExpenseResponse>> => {
        try {
            const url = `${this.baseURL}`;

            const response = await axiosRequest<PaginationResponse<ExpenseResponse>, undefined>(
                HttpMethod.GET,
                url,
                queryParams,
                undefined,
                undefined
            );

            return response;
        } catch (error) {
            console.error('GroupService.find:', error);
            throw error;
        }
    }

    public static remove = async (id: string): Promise<void> => {
        try {
            const url = `${this.baseURL}/${id}`;

            await axiosRequest<void, void>(
                HttpMethod.DELETE,
                url,
                undefined,
                undefined,
                undefined
            );
        } catch (error) {
            console.error('GroupService.remove:', error);
            throw error;
        }
    }

    public static put = async (id: string, expense: ExpenseRequest): Promise<ExpenseResponse> => {
        try {
            const url = `${this.baseURL}/${id}`;

            const response = await axiosRequest<ExpenseResponse, ExpenseRequest>(
                HttpMethod.PUT,
                url,
                undefined,
                expense,
                undefined
            );

            return response;
        } catch (error) {
            console.error('Expense.update: error', error);
            throw error;
        }
    }

    public static post = async (expense: ExpenseRequest): Promise<ExpenseResponse> => {
        try {
            const url = `${this.baseURL}`;

            const response = await axiosRequest<ExpenseResponse, ExpenseRequest>(
                HttpMethod.POST,
                url,
                undefined,
                expense,
                undefined
            );

            return response;
        } catch (error) {
            console.error('Expense Service.post:', error);
            throw error;
        }
    }

    public static export = async (request: ExpenseExportRequest): Promise<ExpenseExportResponse> => {
        try {
            const url = `${this.baseURL}/csv/export`;

            const response = await axiosRequest<ExpenseExportResponse, ExpenseExportRequest>(
                HttpMethod.POST,
                url,
                undefined,
                request,
                undefined
            );

            return response;
        } catch (error) {
            console.error('GroupService.export:', error);
            throw error;
        }
    }

    public static getAll = async (): Promise<ExpenseResponse[]> => {
        try {
            const url = `${this.baseURL}`;

            const query = { all: 'true'};

            const response = await axiosRequest<ExpenseResponse[], undefined>(
                HttpMethod.GET,
                url,
                query,
                undefined,
                undefined
            );

            return response;
        } catch (error) {
            console.error('GroupService.getAll:', error);
            throw error;
        }
    }

    public static findById = async (id: string): Promise<ExpenseResponse> => {
        try {
            const url = `${this.baseURL}/${id}`;

            const response = await axiosRequest<ExpenseResponse, undefined>(
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

export default ExpenseService;
