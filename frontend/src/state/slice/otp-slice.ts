import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface OtpState {
    email: string | null;
}

const initialState: OtpState = {
    email: null,
};

const otpSlice = createSlice({
    name: 'otp',
    initialState,
    reducers: {
        setEmail: (state: OtpState, action: PayloadAction<string>) => {
            state.email = action.payload;
        },
        resetEmail: (state: OtpState) => {
            state.email = null;
        }
    },
});

export default otpSlice.reducer;
export const { setEmail, resetEmail } = otpSlice.actions;
