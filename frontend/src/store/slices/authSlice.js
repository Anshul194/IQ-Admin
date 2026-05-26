import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { studentLogin as studentLoginApi } from '../../utils/api';

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
    },
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
        },
        setUser: (state, action) => {
            state.user = action.payload;
        }
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
            });
    },
});

export const { logout, setUser } = authSlice.actions;
export default authSlice.reducer;
