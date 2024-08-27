import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../slice/auth-slice";
import otpReducer from "../slice/otp-slice";
import userReducer from "../slice/user-slice";
import apiReducer from "../slice/api-slice";
import activityReducer from "../slice/activity-slice";

export const store = configureStore({
    reducer: {
        authReducer,
        otpReducer,
        userReducer,
        apiReducer,
        activityReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
