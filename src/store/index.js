import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';
import teamReducer from './slices/teamSlice';
import studentReducer from './slices/studentSlice';
import quizReducer from './slices/quizSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    team: teamReducer,
    student: studentReducer,
    quiz: quizReducer,
  },
});
