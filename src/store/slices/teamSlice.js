import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

// ─── Thunks ─────────────────────────────────────────────────────────────────

export const createTeamMember = createAsyncThunk(
    'team/createTeamMember',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await api.post('/users/create-team', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const fetchUsersByRole = createAsyncThunk(
    'team/fetchUsersByRole',
    async (role, { rejectWithValue }) => {
        try {
            const response = await api.get(`/users/role/${encodeURIComponent(role)}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const fetchAllTeamMembers = createAsyncThunk(
    'team/fetchAllTeamMembers',
    async (_, { rejectWithValue }) => {
        try {
            const roles = [
                'Chief Administrative Officer',
                'Administrative Officer',
                'Chief Administrator',
                'Administrator',
                'Coordinator',
            ];
            const responses = await Promise.all(
                roles.map(role => api.get(`/users/role/${encodeURIComponent(role)}`))
            );
            const allMembers = responses.flatMap((res, idx) => {
                const members = res?.data || res || [];
                return members.map(m => ({ ...m, _role: roles[idx] }));
            });
            return allMembers;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const getTeamMemberById = createAsyncThunk(
    'team/getTeamMemberById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/users/${id}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const updateTeamMember = createAsyncThunk(
    'team/updateTeamMember',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/users/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const deleteTeamMember = createAsyncThunk(
    'team/deleteTeamMember',
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`/users/${id}`);
            return id; // return id so we can remove from state
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

// ─── State ───────────────────────────────────────────────────────────────────

const initialState = {
    loading: false,
    success: false,
    error: null,
    currentTeamMember: null,
    parentUsers: [],
    fetchingParents: false,
    allMembers: [],
    fetchingAll: false,
    selectedMember: null,
    fetchingSelected: false,
    updateLoading: false,
    updateSuccess: false,
    deleteLoading: false,
    deleteSuccess: false,
};

const teamSlice = createSlice({
    name: 'team',
    initialState,
    reducers: {
        resetTeamState: (state) => {
            state.loading = false;
            state.success = false;
            state.error = null;
        },
        resetUpdateState: (state) => {
            state.updateLoading = false;
            state.updateSuccess = false;
            state.error = null;
        },
        resetDeleteState: (state) => {
            state.deleteLoading = false;
            state.deleteSuccess = false;
        },
        clearSelectedMember: (state) => {
            state.selectedMember = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // CREATE
            .addCase(createTeamMember.pending, (state) => { state.loading = true; state.success = false; state.error = null; })
            .addCase(createTeamMember.fulfilled, (state, action) => { state.loading = false; state.success = true; state.currentTeamMember = action.payload; })
            .addCase(createTeamMember.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            // FETCH PARENTS
            .addCase(fetchUsersByRole.pending, (state) => { state.fetchingParents = true; state.parentUsers = []; })
            .addCase(fetchUsersByRole.fulfilled, (state, action) => { state.fetchingParents = false; state.parentUsers = action.payload?.data || action.payload || []; })
            .addCase(fetchUsersByRole.rejected, (state) => { state.fetchingParents = false; state.parentUsers = []; })
            // FETCH ALL
            .addCase(fetchAllTeamMembers.pending, (state) => { state.fetchingAll = true; state.allMembers = []; })
            .addCase(fetchAllTeamMembers.fulfilled, (state, action) => { state.fetchingAll = false; state.allMembers = action.payload || []; })
            .addCase(fetchAllTeamMembers.rejected, (state) => { state.fetchingAll = false; })
            // GET BY ID
            .addCase(getTeamMemberById.pending, (state) => { state.fetchingSelected = true; state.selectedMember = null; })
            .addCase(getTeamMemberById.fulfilled, (state, action) => { state.fetchingSelected = false; state.selectedMember = action.payload?.data || action.payload; })
            .addCase(getTeamMemberById.rejected, (state) => { state.fetchingSelected = false; })
            // UPDATE
            .addCase(updateTeamMember.pending, (state) => { state.updateLoading = true; state.updateSuccess = false; state.error = null; })
            .addCase(updateTeamMember.fulfilled, (state, action) => {
                state.updateLoading = false;
                state.updateSuccess = true;
                // Update in allMembers list
                const updated = action.payload?.data || action.payload;
                if (updated) {
                    state.allMembers = state.allMembers.map(m => m._id === updated._id ? { ...m, ...updated } : m);
                }
            })
            .addCase(updateTeamMember.rejected, (state, action) => { state.updateLoading = false; state.error = action.payload; })
            // DELETE
            .addCase(deleteTeamMember.pending, (state) => { state.deleteLoading = true; state.deleteSuccess = false; })
            .addCase(deleteTeamMember.fulfilled, (state, action) => {
                state.deleteLoading = false;
                state.deleteSuccess = true;
                state.allMembers = state.allMembers.filter(m => m._id !== action.payload);
            })
            .addCase(deleteTeamMember.rejected, (state, action) => { state.deleteLoading = false; state.error = action.payload; });
    },
});

export const { resetTeamState, resetUpdateState, resetDeleteState, clearSelectedMember } = teamSlice.actions;
export default teamSlice.reducer;
