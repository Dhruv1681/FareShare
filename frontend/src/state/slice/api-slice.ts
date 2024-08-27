import { createSlice } from "@reduxjs/toolkit";

export interface ApiState {
    counter: number;
    loading: boolean;
}

const initialState: ApiState = {
    counter: 0,
    loading: false,
};

const apiSlice = createSlice({
    name: 'api',
    initialState,
    reducers: {
        showLoading: (state: ApiState) => {
            console.log('showLoading called with state',state);
            state.counter++;
            if (state.counter > 0) {
                state.loading = true;
            }
            console.log('showLoading updated state',state);
        },
        hideLoading: (state: ApiState) => {
            console.log('hideLoading called with state',state);
            state.counter--;
            if (state.counter <= 0) {
                state.loading = false;
            }
            console.log('hideLoading updated state',state);
        },
    },
});

export default apiSlice.reducer;
export const { showLoading, hideLoading } = apiSlice.actions;
