import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchQuiz, submitExam, getResults, getCertificates } from '../../utils/api';

export const getQuizQuestions = createAsyncThunk(
    'assessment/getQuizQuestions',
    async (grade, { rejectWithValue }) => {
        try {
            const response = await fetchQuiz(grade);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch questions');
        }
    }
);

export const submitAssessment = createAsyncThunk(
    'assessment/submitAssessment',
    async (payload, { rejectWithValue }) => {
        try {
            const response = await submitExam(payload);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Submission failed');
        }
    }
);

export const getMyResults = createAsyncThunk(
    'assessment/getMyResults',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getResults();
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch results');
        }
    }
);

export const getMyCertificates = createAsyncThunk(
    'assessment/getMyCertificates',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getCertificates();
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch certificates');
        }
    }
);

const assessmentSlice = createSlice({
    name: 'assessment',
    initialState: {
        sections: [],
        results: [],
        certificates: [],
        lastResult: null,
        examId: null,
        examName: null,
        loading: false,
        submitting: false,
        error: null,
    },
    reducers: {
        clearAssessment: (state) => {
            state.sections = [];
            state.lastResult = null;
            state.examId = null;
            state.examName = null;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // ... (keep previous cases)
            .addCase(getQuizQuestions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getQuizQuestions.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload?.length > 0) {
                    // Extract ExamType ID and Name from the first question
                    state.examId = action.payload[0].examType?._id || action.payload[0].examId;
                    state.examName = action.payload[0].examType?.examType || action.payload[0].examName || 'Assessment';
                }
                const grouped = action.payload.reduce((acc, q) => {
                    const sectionName = q.section?.sectionName || 'General';
                    if (!acc[sectionName]) acc[sectionName] = { title: sectionName, questions: [] };
                    acc[sectionName].questions.push({
                        id: q._id,
                        type: q.chapter?.chapterName || 'Aptitude',
                        question: q.questionText,
                        options: [
                            { key: 'A', text: q.options.A.text },
                            { key: 'B', text: q.options.B.text },
                            { key: 'C', text: q.options.C.text },
                            { key: 'D', text: q.options.D.text }
                        ],
                        image: q.questionImage?.fileUrl,
                        correctOption: q.correctAnswer
                    });
                    return acc;
                }, {});
                state.sections = Object.values(grouped);
            })
            .addCase(getQuizQuestions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(submitAssessment.pending, (state) => {
                state.submitting = true;
            })
            .addCase(submitAssessment.fulfilled, (state, action) => {
                state.submitting = false;
                state.lastResult = action.payload;
            })
            .addCase(submitAssessment.rejected, (state, action) => {
                state.submitting = false;
                state.error = action.payload;
            })
            .addCase(getMyResults.fulfilled, (state, action) => {
                state.results = action.payload;
            })
            .addCase(getMyCertificates.fulfilled, (state, action) => {
                state.certificates = action.payload;
            });
    },
});

export const { clearAssessment } = assessmentSlice.actions;
export default assessmentSlice.reducer;
