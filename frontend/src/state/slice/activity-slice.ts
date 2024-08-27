import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ActivityState {
    name: string;
}

const initialState: ActivityState = {
    name: '',
};

const activitySlice = createSlice({
    name: 'activity',
    initialState,
    reducers: {
        setDashboardActivity: (state: ActivityState) => {
            console.log('setDashboardActivity called with state',state);
            state.name = 'dashboard';
            console.log('setDashboardActivity updated state',state);
        },
        setExpensesActivity: (state: ActivityState) => {
            console.log('setExpenseActivity called with state',state);
            state.name = 'expenses';
            console.log('setExpenseActivity updated state',state);
        },
        setGroupsActivity: (state: ActivityState) => {
            console.log('setGroupsActivity called with state',state);
            state.name = 'groups';
            console.log('setGroupsActivity updated state',state);
        },
        setFriendsActivity: (state: ActivityState) => {
            console.log('setFriendsActivity called with state',state);
            state.name = 'friends';
            console.log('setFriendsActivity updated state',state);
        },
        setActivityActivity: (state: ActivityState) => {
            console.log('setActivityActivity called with state',state);
            state.name = 'activity';
            console.log('setActivityActivity updated state',state);
        },
        setSettingsActivity: (state: ActivityState) => {
            console.log('setSettingsActivity called with state',state);
            state.name = 'settings';
            console.log('setSettingsActivity updated state',state);
        },
        setActivity: (state: ActivityState, action: PayloadAction<string>) => {
            console.log('setActivity called with state',state,'action',action);
            state.name = action.payload;
            console.log('setActivity updated state',state);
        }
    },
});

export default activitySlice.reducer;
export const { 
    setDashboardActivity, 
    setExpensesActivity, 
    setGroupsActivity, 
    setFriendsActivity, 
    setActivityActivity, 
    setSettingsActivity, 
    setActivity } 
= activitySlice.actions;