import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

// --- Thunks ---

// Exam Type
export const createExamType = createAsyncThunk('quiz/createExamType', async (data, { rejectWithValue }) => {
    try { const response = await api.post('/exam-types', data); return response.data; }
    catch (error) { return rejectWithValue(error.response?.data || error.message); }
});

export const fetchExamTypes = createAsyncThunk('quiz/fetchExamTypes', async (_, { rejectWithValue }) => {
    try { const response = await api.get('/exam-types'); return response.data; }
    catch (error) { return rejectWithValue(error.response?.data || error.message); }
});

export const updateExamType = createAsyncThunk('quiz/updateExamType', async ({ id, data }, { rejectWithValue }) => {
    try { const response = await api.patch(`/exam-types/${id}`, data); return response.data; }
    catch (error) { return rejectWithValue(error.response?.data || error.message); }
});

export const deleteExamType = createAsyncThunk('quiz/deleteExamType', async (id, { rejectWithValue }) => {
    try { await api.delete(`/exam-types/${id}`); return id; }
    catch (error) { return rejectWithValue(error.response?.data || error.message); }
});

// Section
export const createSection = createAsyncThunk('quiz/createSection', async (data, { rejectWithValue }) => {
    try { const response = await api.post('/sections', data); return response.data; }
    catch (error) { return rejectWithValue(error.response?.data || error.message); }
});

export const fetchSections = createAsyncThunk('quiz/fetchSections', async (_, { rejectWithValue }) => {
    try { const response = await api.get('/sections'); return response.data; }
    catch (error) { return rejectWithValue(error.response?.data || error.message); }
});

export const updateSection = createAsyncThunk('quiz/updateSection', async ({ id, data }, { rejectWithValue }) => {
    try { const response = await api.patch(`/sections/${id}`, data); return response.data; }
    catch (error) { return rejectWithValue(error.response?.data || error.message); }
});

export const deleteSection = createAsyncThunk('quiz/deleteSection', async (id, { rejectWithValue }) => {
    try { await api.delete(`/sections/${id}`); return id; }
    catch (error) { return rejectWithValue(error.response?.data || error.message); }
});

// Chapter
export const createChapter = createAsyncThunk('quiz/createChapter', async (data, { rejectWithValue }) => {
    try { const response = await api.post('/chapters', data); return response.data; }
    catch (error) { return rejectWithValue(error.response?.data || error.message); }
});

export const fetchChapters = createAsyncThunk('quiz/fetchChapters', async (_, { rejectWithValue }) => {
    try { const response = await api.get('/chapters'); return response.data; }
    catch (error) { return rejectWithValue(error.response?.data || error.message); }
});

export const updateChapter = createAsyncThunk('quiz/updateChapter', async ({ id, data }, { rejectWithValue }) => {
    try { const response = await api.patch(`/chapters/${id}`, data); return response.data; }
    catch (error) { return rejectWithValue(error.response?.data || error.message); }
});

export const deleteChapter = createAsyncThunk('quiz/deleteChapter', async (id, { rejectWithValue }) => {
    try { await api.delete(`/chapters/${id}`); return id; }
    catch (error) { return rejectWithValue(error.response?.data || error.message); }
});

// Question Master
export const createQuestion = createAsyncThunk('quiz/createQuestion', async (data, { rejectWithValue }) => {
    try { const response = await api.post('/question-masters', data); return response.data; }
    catch (error) { return rejectWithValue(error.response?.data || error.message); }
});

export const fetchQuestions = createAsyncThunk('quiz/fetchQuestions', async (_, { rejectWithValue }) => {
    try { const response = await api.get('/question-masters'); return response.data; }
    catch (error) { return rejectWithValue(error.response?.data || error.message); }
});

export const updateQuestion = createAsyncThunk('quiz/updateQuestion', async ({ id, data }, { rejectWithValue }) => {
    try { const response = await api.patch(`/question-masters/${id}`, data); return response.data; }
    catch (error) { return rejectWithValue(error.response?.data || error.message); }
});

export const deleteQuestion = createAsyncThunk('quiz/deleteQuestion', async (id, { rejectWithValue }) => {
    try { await api.delete(`/question-masters/${id}`); return id; }
    catch (error) { return rejectWithValue(error.response?.data || error.message); }
});

export const assignQuestions = createAsyncThunk('quiz/assignQuestions', async (data, { rejectWithValue }) => {
    try { const response = await api.post('/question-masters/assign', data); return response.data; }
    catch (error) { return rejectWithValue(error.response?.data || error.message); }
});

const initialState = {
    examTypes: [],
    sections: [],
    chapters: [],
    questions: [],
    loading: false,
    success: false,
    error: null,
    fetchLoading: false,
    lastCreatedId: null
};

const quizSlice = createSlice({
    name: 'quiz',
    initialState,
    reducers: {
        resetQuizState: (state) => {
            state.loading = false;
            state.success = false;
            state.error = null;
            state.lastCreatedId = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Exam Types
            .addCase(createExamType.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                const newDoc = action.payload?.data || action.payload;
                if (newDoc) { state.examTypes.push(newDoc); state.lastCreatedId = newDoc._id; }
            })
            .addCase(fetchExamTypes.pending, (state) => { state.fetchLoading = true; })
            .addCase(fetchExamTypes.fulfilled, (state, action) => { state.fetchLoading = false; state.examTypes = action.payload?.data || action.payload || []; })
            .addCase(fetchExamTypes.rejected, (state) => { state.fetchLoading = false; })

            // Sections
            .addCase(createSection.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                const newDoc = action.payload?.data || action.payload;
                if (newDoc) { state.sections.push(newDoc); state.lastCreatedId = newDoc._id; }
            })
            .addCase(fetchSections.pending, (state) => { state.fetchLoading = true; })
            .addCase(fetchSections.fulfilled, (state, action) => { state.fetchLoading = false; state.sections = action.payload?.data || action.payload || []; })
            .addCase(fetchSections.rejected, (state) => { state.fetchLoading = false; })

            // Chapters
            .addCase(createChapter.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                const newDoc = action.payload?.data || action.payload;
                if (newDoc) { state.chapters.push(newDoc); state.lastCreatedId = newDoc._id; }
            })
            .addCase(fetchChapters.pending, (state) => { state.fetchLoading = true; })
            .addCase(fetchChapters.fulfilled, (state, action) => { state.fetchLoading = false; state.chapters = action.payload?.data || action.payload || []; })
            .addCase(fetchChapters.rejected, (state) => { state.fetchLoading = false; })

            // Questions
            .addCase(createQuestion.fulfilled, (state, action) => { state.loading = false; state.success = true; if (action.payload?.data) state.questions.push(action.payload.data); })
            .addCase(fetchQuestions.pending, (state) => { state.fetchLoading = true; })
            .addCase(fetchQuestions.fulfilled, (state, action) => { state.fetchLoading = false; state.questions = action.payload?.data || action.payload || []; })
            .addCase(fetchQuestions.rejected, (state) => { state.fetchLoading = false; })

            // Global Mutation Matchers (ONLY for Create, Update, Delete, Assign)
            // This prevents fetching actions from triggering button loaders
            .addMatcher(
                (action) => action.type.startsWith('quiz/') && (action.type.includes('create') || action.type.includes('update') || action.type.includes('delete') || action.type.includes('assign')) && action.type.endsWith('/pending'),
                (state) => { state.loading = true; state.success = false; state.error = null; }
            )
            .addMatcher(
                (action) => action.type.startsWith('quiz/') && (action.type.includes('create') || action.type.includes('update') || action.type.includes('delete') || action.type.includes('assign')) && (action.type.endsWith('/fulfilled') || action.type.endsWith('/rejected')),
                (state, action) => { state.loading = false; if (action.type.endsWith('/rejected')) state.error = action.payload; }
            );
    }
});

export const { resetQuizState } = quizSlice.actions;
export default quizSlice.reducer;
