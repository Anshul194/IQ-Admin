import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

// --- Thunks ---

// School Actions
export const createSchool = createAsyncThunk('student/createSchool', async (data, { rejectWithValue }) => {
    try { const response = await api.post('/schools', data); return response.data; }
    catch (error) { return rejectWithValue(error.response?.data || error.message); }
});

export const fetchSchools = createAsyncThunk('student/fetchSchools', async (_, { rejectWithValue }) => {
    try { const response = await api.get('/schools'); return response.data; }
    catch (error) { return rejectWithValue(error.response?.data || error.message); }
});

export const fetchSchoolById = createAsyncThunk('student/fetchSchoolById', async (id, { rejectWithValue }) => {
    try { const response = await api.get(`/schools/${id}`); return response.data; }
    catch (error) { return rejectWithValue(error.response?.data || error.message); }
});

export const updateSchool = createAsyncThunk('student/updateSchool', async ({ id, data }, { rejectWithValue }) => {
    try { const response = await api.patch(`/schools/${id}`, data); return response.data; }
    catch (error) { return rejectWithValue(error.response?.data || error.message); }
});

export const deleteSchool = createAsyncThunk('student/deleteSchool', async (id, { rejectWithValue }) => {
    try { await api.delete(`/schools/${id}`); return id; }
    catch (error) { return rejectWithValue(error.response?.data || error.message); }
});

// Student Actions
export const createStudent = createAsyncThunk('student/createStudent', async (data, { rejectWithValue }) => {
    try { const response = await api.post('/students', data); return response.data; }
    catch (error) { return rejectWithValue(error.response?.data || error.message); }
});

export const fetchStudents = createAsyncThunk('student/fetchStudents', async (_, { rejectWithValue }) => {
    try { const response = await api.get('/students'); return response.data; }
    catch (error) { return rejectWithValue(error.response?.data || error.message); }
});

export const fetchStudentById = createAsyncThunk('student/fetchStudentById', async (id, { rejectWithValue }) => {
    try { const response = await api.get(`/students/${id}`); return response.data; }
    catch (error) { return rejectWithValue(error.response?.data || error.message); }
});

export const updateStudent = createAsyncThunk('student/updateStudent', async ({ id, data }, { rejectWithValue }) => {
    try { const response = await api.patch(`/students/${id}`, data); return response.data; }
    catch (error) { return rejectWithValue(error.response?.data || error.message); }
});

export const deleteStudent = createAsyncThunk('student/deleteStudent', async (id, { rejectWithValue }) => {
    try { await api.delete(`/students/${id}`); return id; }
    catch (error) { return rejectWithValue(error.response?.data || error.message); }
});

// Exam Center Actions
export const createExamCenter = createAsyncThunk('student/createExamCenter', async (data, { rejectWithValue }) => {
    try { const response = await api.post('/exam-centers', data); return response.data; }
    catch (error) { return rejectWithValue(error.response?.data || error.message); }
});

export const fetchExamCenters = createAsyncThunk('student/fetchExamCenters', async (_, { rejectWithValue }) => {
    try { const response = await api.get('/exam-centers'); return response.data; }
    catch (error) { return rejectWithValue(error.response?.data || error.message); }
});

export const fetchExamCenterById = createAsyncThunk('student/fetchExamCenterById', async (id, { rejectWithValue }) => {
    try { const response = await api.get(`/exam-centers/${id}`); return response.data; }
    catch (error) { return rejectWithValue(error.response?.data || error.message); }
});

export const updateExamCenter = createAsyncThunk('student/updateExamCenter', async ({ id, data }, { rejectWithValue }) => {
    try { const response = await api.patch(`/exam-centers/${id}`, data); return response.data; }
    catch (error) { return rejectWithValue(error.response?.data || error.message); }
});

export const deleteExamCenter = createAsyncThunk('student/deleteExamCenter', async (id, { rejectWithValue }) => {
    try { await api.delete(`/exam-centers/${id}`); return id; }
    catch (error) { return rejectWithValue(error.response?.data || error.message); }
});

// Coordinator Action
export const fetchCoordinators = createAsyncThunk('student/fetchCoordinators', async (_, { rejectWithValue }) => {
    try { const response = await api.get('/users/role/Coordinator'); return response.data; }
    catch (error) { return rejectWithValue(error.response?.data || error.message); }
});

const initialState = {
    schools: [],
    students: [],
    coordinators: [],
    examCenters: [],
    currentEntity: null,
    loading: false,
    success: false,
    error: null,
    fetchLoading: false
};

const studentSlice = createSlice({
    name: 'student',
    initialState,
    reducers: {
        resetStudentState: (state) => {
            state.loading = false;
            state.success = false;
            state.error = null;
            state.currentEntity = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Loading and Success handlers
            .addCase(createSchool.pending, (state) => { state.loading = true; state.success = false; })
            .addCase(createSchool.fulfilled, (state, action) => { state.loading = false; state.success = true; if (action.payload?.data) state.schools.push(action.payload.data); })
            .addCase(updateSchool.fulfilled, (state, action) => {
                const updated = action.payload?.data || action.payload;
                state.schools = state.schools.map(s => s._id === updated._id ? updated : s);
                state.success = true;
                state.currentEntity = null;
            })
            .addCase(deleteSchool.fulfilled, (state, action) => { state.schools = state.schools.filter(s => s._id !== action.payload); })

            // Get By ID handlers
            .addCase(fetchSchoolById.pending, (state) => { state.loading = true; })
            .addCase(fetchSchoolById.fulfilled, (state, action) => { state.loading = false; state.currentEntity = action.payload?.data || action.payload; })
            .addCase(fetchStudentById.pending, (state) => { state.loading = true; })
            .addCase(fetchStudentById.fulfilled, (state, action) => { state.loading = false; state.currentEntity = action.payload?.data || action.payload; })
            .addCase(fetchExamCenterById.pending, (state) => { state.loading = true; })
            .addCase(fetchExamCenterById.fulfilled, (state, action) => { state.loading = false; state.currentEntity = action.payload?.data || action.payload; })

            // Generic Fetch handlers
            .addCase(fetchSchools.pending, (state) => { state.fetchLoading = true; })
            .addCase(fetchSchools.fulfilled, (state, action) => { state.fetchLoading = false; state.schools = action.payload?.data || action.payload || []; })
            .addCase(fetchStudents.fulfilled, (state, action) => { state.fetchLoading = false; state.students = action.payload?.data || action.payload || []; })
            .addCase(fetchExamCenters.fulfilled, (state, action) => { state.fetchLoading = false; state.examCenters = action.payload?.data || action.payload || []; })
            .addCase(fetchCoordinators.fulfilled, (state, action) => { state.fetchLoading = false; state.coordinators = action.payload?.data || action.payload || []; })

            // Student Update/Delete
            .addCase(updateStudent.fulfilled, (state, action) => {
                const updated = action.payload?.data || action.payload;
                state.students = state.students.map(s => s._id === updated._id ? updated : s);
                state.success = true;
                state.currentEntity = null;
            })
            .addCase(deleteStudent.fulfilled, (state, action) => { state.students = state.students.filter(s => s._id !== action.payload); })

            // Exam Center Update/Delete
            .addCase(updateExamCenter.fulfilled, (state, action) => {
                const updated = action.payload?.data || action.payload;
                state.examCenters = state.examCenters.map(c => c._id === updated._id ? updated : c);
                state.success = true;
                state.currentEntity = null;
            })
            .addCase(deleteExamCenter.fulfilled, (state, action) => { state.examCenters = state.examCenters.filter(c => c._id !== action.payload); });
    }
});

export const { resetStudentState } = studentSlice.actions;
export default studentSlice.reducer;
