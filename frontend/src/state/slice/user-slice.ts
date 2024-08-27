import { ActionReducerMapBuilder, createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import AuthService from "../../service/api-service/auth-service";
import UserGetResponse from "../../service/api-service/schema/response/UserGetResponse";

export interface UserState {
    id: string;
    firstname: string;
    lastname: string;
    fullname: string;
    username: string;
    email: string;
    nickname: string;

    loading: boolean;
}

const initialState: UserState = {
    id: '',
    username: '',
    email: '',
    nickname: '',
    firstname: '',
    lastname: '',
    fullname: '',

    loading: false,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        resetUser: (state: UserState) => {
            state.id = '';
            state.username = '';
            state.email = '';
            state.nickname = '';
            state.firstname = '';
            state.lastname = '';
            state.fullname = '';
        },
        setUser: (state: UserState, action: PayloadAction<UserGetResponse>) => {
            try {
                state.id = action.payload.id;
                state.username = action.payload.username;
                state.email = action.payload.email;
                state.nickname = action.payload.nickname;
                state.firstname = action.payload.firstname;
                state.lastname = action.payload.lastname;
                state.fullname = action.payload.fullname;
            } catch (error) {
                console.error('Error in auth slice setUser', error);
            }
            
        },
        setLoading: (state: UserState, action: PayloadAction<boolean>) => {
            console.log('setLoading state', state, 'action', action);
            state.loading = action.payload;
        }
    },
    extraReducers: (builder: ActionReducerMapBuilder<UserState>) => {
        builder
            .addCase(fetchUser.pending, () => {
                console.log('fetchUser.pending');
            })
            .addCase(fetchUser.fulfilled, (state: UserState, action: PayloadAction<UserGetResponse>) => {
                console.log('we have fetchUsered.fulfilled with action', action);
                state.id = action.payload.id;
                state.username = action.payload.username;
                state.email = action.payload.email;
                state.nickname = action.payload.nickname;
                state.firstname = action.payload.firstname;
                state.lastname = action.payload.lastname;
                state.fullname = action.payload.fullname;

                state.loading = false;

                console.log('state updated', state);

            })
            .addCase(fetchUser.rejected, () => {
                console.error('Error in auth slice fetchUser');
            });
    },
});

export const fetchUser = createAsyncThunk('auth/fetchUser', async (): Promise<UserGetResponse> => {
    try {
        const response = await AuthService.get();
        return response;
    } catch (error) {
        console.error('Error in auth slice fetchUser', error);
        throw error;
    }
});

export const { setUser, setLoading, resetUser } = userSlice.actions;
export default userSlice.reducer;
