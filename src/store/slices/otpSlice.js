import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

// Async Thunk for Sending WhatsApp OTP
export const sendWhatsAppOtp = createAsyncThunk(
    'otp/sendWhatsAppOtp',
    async (payload, { rejectWithValue }) => {
        try {
            const response = await api.post('/api/whatsapp/send', payload);
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

// Async Thunk for Sending SMS OTP
export const sendSmsOtp = createAsyncThunk(
    'otp/sendSmsOtp',
    async (payload, { rejectWithValue }) => {
        try {
            const response = await api.post('/api/sms/send', payload);
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

// Async Thunk for Sending Bulk SMS OTP
export const sendBulkSmsOtp = createAsyncThunk(
    'otp/sendBulkSmsOtp',
    async (payload, { rejectWithValue }) => {
        try {
            const response = await api.post('/api/sms/send-bulk', payload);
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

const initialState = {
    loading: false,
    error: null,
    lastOtp: null,
    otpSent: false,
};

const otpSlice = createSlice({
    name: 'otp',
    initialState,
    reducers: {
        clearOtpError: (state) => {
            state.error = null;
        },
        resetOtpState: (state) => {
            state.loading = false;
            state.error = null;
            state.lastOtp = null;
            state.otpSent = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(sendWhatsAppOtp.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.otpSent = false;
            })
            .addCase(sendWhatsAppOtp.fulfilled, (state, action) => {
                state.loading = false;
                state.otpSent = true;
                state.lastOtp = action.payload;
            })
            .addCase(sendWhatsAppOtp.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(sendSmsOtp.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.otpSent = false;
            })
            .addCase(sendSmsOtp.fulfilled, (state, action) => {
                state.loading = false;
                state.otpSent = true;
                state.lastOtp = action.payload;
            })
            .addCase(sendSmsOtp.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(sendBulkSmsOtp.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.otpSent = false;
            })
            .addCase(sendBulkSmsOtp.fulfilled, (state, action) => {
                state.loading = false;
                state.otpSent = true;
                state.lastOtp = action.payload;
            })
            .addCase(sendBulkSmsOtp.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearOtpError, resetOtpState } = otpSlice.actions;
export default otpSlice.reducer;
