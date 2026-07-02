/**
 * aptitudeSlice.js
 * Redux state for Career Aptitude Test results (admin view).
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

// ── Thunks ────────────────────────────────────────────────────────────────────

export const fetchAllAptitudeResults = createAsyncThunk(
    'aptitude/fetchAll',
    async (queryParams, { rejectWithValue }) => {
        try {
            const query = new URLSearchParams(queryParams).toString();
            const response = await api.get(`/aptitude-results?${query}`);
            return response.data || response;
        } catch (err) {
            return rejectWithValue(err?.message || 'Failed to fetch aptitude results');
        }
    }
);

export const fetchAptitudeResultById = createAsyncThunk(
    'aptitude/fetchById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/aptitude-results/${id}`);
            return response.data || response;
        } catch (err) {
            return rejectWithValue(err?.message || 'Failed to fetch result');
        }
    }
);

// ── Initial State ─────────────────────────────────────────────────────────────

const initialState = {
    results: [],
    currentResult: null,
    meta: { total: 0, page: 1, limit: 10 },
    fetchLoading: false,
    error: null
};

// ── Slice ─────────────────────────────────────────────────────────────────────

const aptitudeSlice = createSlice({
    name: 'aptitude',
    initialState,
    reducers: {
        clearCurrentResult: (state) => { state.currentResult = null; }
    },
    extraReducers: (builder) => {
        builder
            // fetchAll
            .addCase(fetchAllAptitudeResults.pending, (state) => { state.fetchLoading = true; state.error = null; })
            .addCase(fetchAllAptitudeResults.fulfilled, (state, action) => {
                state.fetchLoading = false;
                const payload = action.payload;
                state.results = payload?.data || payload || [];
                state.meta = payload?.meta || initialState.meta;
            })
            .addCase(fetchAllAptitudeResults.rejected, (state, action) => {
                state.fetchLoading = false;
                state.error = action.payload;
            })

            // fetchById
            .addCase(fetchAptitudeResultById.pending, (state) => { state.fetchLoading = true; })
            .addCase(fetchAptitudeResultById.fulfilled, (state, action) => {
                state.fetchLoading = false;
                state.currentResult = action.payload?.data || action.payload;
            })
            .addCase(fetchAptitudeResultById.rejected, (state) => { state.fetchLoading = false; });
    }
});

export const { clearCurrentResult } = aptitudeSlice.actions;
export default aptitudeSlice.reducer;
