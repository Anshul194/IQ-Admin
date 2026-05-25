import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    theme: 'light',
    sidebarOpen: true,
    notifications: [],
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        toggleTheme: (state) => {
            state.theme = state.theme === 'light' ? 'dark' : 'light';
        },
        setSidebarOpen: (state, action) => {
            state.sidebarOpen = action.payload;
        },
        addNotification: (state, action) => {
            state.notifications.push(action.payload);
        },
        clearNotifications: (state) => {
            state.notifications = [];
        },
    },
});

export const { toggleTheme, setSidebarOpen, addNotification, clearNotifications } = uiSlice.actions;
export default uiSlice.reducer;
