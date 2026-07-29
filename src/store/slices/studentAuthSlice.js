import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const checkMobile = createAsyncThunk(
    'studentAuth/checkMobile',
    async (mobileNumber, { rejectWithValue }) => {
        try {
            return await api.post('/auth/student/check-mobile', { mobileNumber });
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const sendOtp = createAsyncThunk(
    'studentAuth/sendOtp',
    async ({ mobileNumber, type }, { rejectWithValue }) => {
        try {
            return await api.post('/auth/student/send-otp', { mobileNumber, type });
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const verifyOtp = createAsyncThunk(
    'studentAuth/verifyOtp',
    async ({ mobileNumber, otp, type }, { rejectWithValue }) => {
        try {
            return await api.post('/auth/student/verify-otp', { mobileNumber, otp, type });
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const loginWithDob = createAsyncThunk(
    'studentAuth/loginWithDob',
    async ({ mobileNumber, dob }, { rejectWithValue }) => {
        try {
            return await api.post('/auth/student/login', { mobileNumber, dob });
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const registerStudent = createAsyncThunk(
    'studentAuth/registerStudent',
    async (payload, { rejectWithValue }) => {
        try {
            return await api.post('/auth/student/register', payload);
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const changeDob = createAsyncThunk(
    'studentAuth/changeDob',
    async ({ mobileNumber, otp, newDob }, { rejectWithValue }) => {
        try {
            return await api.post('/auth/student/change-dob', { mobileNumber, otp, newDob });
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

const initialState = {
    step: 'landing',
    mobileNumber: '',
    isRegistered: null,
    otpType: null,
    otpVerified: false,
    otpExpiresIn: null,
    loading: false,
    error: null,
    user: null,
    token: null,
    isAuthenticated: false,
};

const studentAuthSlice = createSlice({
    name: 'studentAuth',
    initialState,
    reducers: {
        resetStudentAuth: () => initialState,
        setMobileNumber: (state, action) => {
            state.mobileNumber = action.payload;
        },
        setStep: (state, action) => {
            state.step = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        logoutStudent: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.step = 'landing';
            state.mobileNumber = '';
            state.isRegistered = null;
            state.otpVerified = false;
            localStorage.removeItem('studentToken');
            localStorage.removeItem('studentUser');
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(checkMobile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(checkMobile.fulfilled, (state, action) => {
                state.loading = false;
                const { isRegistered } = action.payload.data;
                state.isRegistered = isRegistered;
                state.step = isRegistered ? 'dob' : 'register-otp';
                state.otpType = isRegistered ? 'dob_change' : 'registration';
            })
            .addCase(checkMobile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(sendOtp.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(sendOtp.fulfilled, (state, action) => {
                state.loading = false;
                state.step = state.otpType === 'registration' ? 'register-otp-verify' : 'change-dob-otp-verify';
                state.otpExpiresIn = action.payload.data?.expiresIn || 300;
            })
            .addCase(sendOtp.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(verifyOtp.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(verifyOtp.fulfilled, (state) => {
                state.loading = false;
                state.otpVerified = true;
                if (state.otpType === 'registration') {
                    state.step = 'registration-form';
                } else {
                    state.step = 'change-dob-form';
                }
            })
            .addCase(verifyOtp.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(loginWithDob.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginWithDob.fulfilled, (state, action) => {
                state.loading = false;
                const { accessToken, user } = action.payload.data;
                state.token = accessToken;
                state.user = user;
                state.isAuthenticated = true;
                state.step = 'dashboard';
                localStorage.setItem('studentToken', accessToken);
                localStorage.setItem('studentUser', JSON.stringify(user));
            })
            .addCase(loginWithDob.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(registerStudent.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerStudent.fulfilled, (state, action) => {
                state.loading = false;
                const { accessToken, user } = action.payload.data;
                state.token = accessToken;
                state.user = user;
                state.isAuthenticated = true;
                state.step = 'dashboard';
                localStorage.setItem('studentToken', accessToken);
                localStorage.setItem('studentUser', JSON.stringify(user));
            })
            .addCase(registerStudent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(changeDob.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(changeDob.fulfilled, (state, action) => {
                state.loading = false;
                const { accessToken, user } = action.payload.data;
                state.token = accessToken;
                state.user = user;
                state.isAuthenticated = true;
                state.step = 'dashboard';
                localStorage.setItem('studentToken', accessToken);
                localStorage.setItem('studentUser', JSON.stringify(user));
            })
            .addCase(changeDob.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { resetStudentAuth, setMobileNumber, setStep, clearError, setError, logoutStudent } = studentAuthSlice.actions;
export default studentAuthSlice.reducer;
