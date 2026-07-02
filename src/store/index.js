import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';
import teamReducer from './slices/teamSlice';
import studentReducer from './slices/studentSlice';
import quizReducer from './slices/quizSlice';
import dashboardReducer from './slices/dashboardSlice';
import aptitudeReducer from './slices/aptitudeSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    team: teamReducer,
    student: studentReducer,
    quiz: quizReducer,
    dashboard: dashboardReducer,
    aptitude: aptitudeReducer,
  },
});
