import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import LocalStorageService from "../../service/local-storage-service";

export interface AuthState {
    token: string | null;
};

const initialState: AuthState = {
    token: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setToken: (state: AuthState, action: PayloadAction<string>) => {
            LocalStorageService.storeToken(action.payload);
            state.token = action.payload;
        },
        resetToken: (state: AuthState) => {
            LocalStorageService.removeToken();
            state.token = null;
        },
    },
});

export default authSlice.reducer;
export const { setToken, resetToken } = authSlice.actions;
