import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
    studentLogin as studentLoginApi,
    checkMobile as checkMobileApi,
    sendOtp as sendOtpApi,
    verifyOtp as verifyOtpApi,
    registerStudent as registerStudentApi,
    changeDob as changeDobApi,
} from '../../utils/api';

export const loginStudent = createAsyncThunk(
    'auth/loginStudent',
    async ({ mobileNumber, dob }, { rejectWithValue }) => {
        try {
            const response = await studentLoginApi(mobileNumber, dob);
            if (response.success) {
                localStorage.setItem('accessToken', response.data.accessToken);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                return response.data;
            }
            return rejectWithValue(response.message || 'Login failed');
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Login failed');
        }
    }
);

export const checkMobileNumber = createAsyncThunk(
    'auth/checkMobileNumber',
    async (mobileNumber, { rejectWithValue }) => {
        try {
            const response = await checkMobileApi(mobileNumber);
            if (response.success) return response.data;
            return rejectWithValue(response.message || 'Failed to check mobile');
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to check mobile');
        }
    }
);

export const requestOtp = createAsyncThunk(
    'auth/requestOtp',
    async ({ mobileNumber, type }, { rejectWithValue }) => {
        try {
            const response = await sendOtpApi(mobileNumber, type);
            if (response.success) return response.data;
            return rejectWithValue(response.message || 'Failed to send OTP');
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to send OTP');
        }
    }
);

export const verifyOtpCode = createAsyncThunk(
    'auth/verifyOtpCode',
    async ({ mobileNumber, otp, type }, { rejectWithValue }) => {
        try {
            const response = await verifyOtpApi(mobileNumber, otp, type);
            if (response.success) return response.data;
            return rejectWithValue(response.message || 'Invalid OTP');
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Invalid OTP');
        }
    }
);

export const registerNewStudent = createAsyncThunk(
    'auth/registerNewStudent',
    async (payload, { rejectWithValue }) => {
        try {
            const response = await registerStudentApi(payload);
            if (response.success) {
                localStorage.setItem('accessToken', response.data.accessToken);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                return response.data;
            }
            return rejectWithValue(response.message || 'Registration failed');
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Registration failed');
        }
    }
);

export const updateDob = createAsyncThunk(
    'auth/updateDob',
    async ({ mobileNumber, otp, newDob }, { rejectWithValue }) => {
        try {
            const response = await changeDobApi(mobileNumber, otp, newDob);
            if (response.success) {
                localStorage.setItem('accessToken', response.data.accessToken);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                return response.data;
            }
            return rejectWithValue(response.message || 'Failed to update DOB');
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to update DOB');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: (() => {
            const saved = localStorage.getItem('user');
            if (!saved || saved === 'undefined') return null;
            try { return JSON.parse(saved); } catch (e) { return null; }
        })(),
        token: localStorage.getItem('accessToken') || null,
        loading: false,
        error: null,
        isRegistered: null,
        otpSent: false,
        otpVerified: false,
        flowStep: 'login',
    },
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isRegistered = null;
            state.otpSent = false;
            state.otpVerified = false;
            state.flowStep = 'login';
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
        },
        setFlowStep: (state, action) => {
            state.flowStep = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
        resetAuthFlow: (state) => {
            state.isRegistered = null;
            state.otpSent = false;
            state.otpVerified = false;
            state.flowStep = 'login';
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginStudent.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginStudent.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.accessToken;
            })
            .addCase(loginStudent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(checkMobileNumber.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(checkMobileNumber.fulfilled, (state, action) => {
                state.loading = false;
                state.isRegistered = action.payload.isRegistered;
                state.flowStep = action.payload.isRegistered ? 'dob' : 'sending-otp';
            })
            .addCase(checkMobileNumber.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(requestOtp.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(requestOtp.fulfilled, (state) => {
                state.loading = false;
                state.otpSent = true;
                state.flowStep = state.isRegistered === false ? 'register-form' : 'change-dob-form';
            })
            .addCase(requestOtp.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(verifyOtpCode.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(verifyOtpCode.fulfilled, (state) => {
                state.loading = false;
                state.otpVerified = true;
            })
            .addCase(verifyOtpCode.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(registerNewStudent.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerNewStudent.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.accessToken;
            })
            .addCase(registerNewStudent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateDob.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateDob.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.accessToken;
            })
            .addCase(updateDob.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { logout, setFlowStep, setError, clearError, resetAuthFlow } = authSlice.actions;
export default authSlice.reducer;
