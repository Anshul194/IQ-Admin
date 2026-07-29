import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchQuiz, submitExam, getResults, getCertificates, getAptitudeResults } from '../../utils/api';

export const getQuizQuestions = createAsyncThunk(
    'assessment/getQuizQuestions',
    async ({ grade, language }, { rejectWithValue }) => {
        try {
            const response = await fetchQuiz(grade, language);
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
            const standardRes = await getResults();
            const standardData = (standardRes.data || standardRes || []).map(r => ({ ...r, isAptitude: false }));

            let aptitudeData = [];
            try {
                const aptitudeRes = await getAptitudeResults();
                aptitudeData = (aptitudeRes.data || aptitudeRes || []).map(r => ({ 
                    ...r, 
                    isAptitude: true,
                    // Synthesize percentage for UI table compatibility
                    percentage: Math.round((r.academicGrandTotal / (r.academicAnswers?.length || 50)) * 100)
                }));
            } catch (e) {
                console.error("Error fetching aptitude results:", e);
            }

            const combined = [...standardData, ...aptitudeData].sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );
            return combined;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch results');
        }
    }
);

export const getMyCertificates = createAsyncThunk(
    'assessment/getMyCertificates',
    async (_, { rejectWithValue }) => {
        try {
            const standardRes = await getCertificates();
            const standardData = (standardRes.data || standardRes || []).map(c => ({ ...c, isAptitude: false }));

            let aptitudeData = [];
            try {
                const aptitudeRes = await getAptitudeResults();
                aptitudeData = (aptitudeRes.data || aptitudeRes || []).map(c => ({ 
                    ...c, 
                    isAptitude: true 
                }));
            } catch (e) {
                console.error("Error fetching aptitude certificates:", e);
            }

            const combined = [...standardData, ...aptitudeData].sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );
            return combined;
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
                
                // Extract ExamType ID and Name from the first question in the nested structure
                let firstExamType = null;
                if (action.payload?.length > 0) {
                    const firstSection = action.payload[0];
                    if (firstSection.chapters?.length > 0) {
                        const firstChapter = firstSection.chapters[0];
                        if (firstChapter.questions?.length > 0) {
                            const firstQuestion = firstChapter.questions[0];
                            firstExamType = firstQuestion.examType;
                        }
                    }
                }
                if (firstExamType) {
                    state.examId = firstExamType._id || firstExamType;
                    state.examName = firstExamType.examType || 'Assessment';
                }

                // Map the hierarchical sections -> chapters -> questions to the format needed by Assessment.jsx
                state.sections = (action.payload || []).map(sec => {
                    const sectionName = sec.sectionName || 'General';
                    const questions = [];
                    const chapters = [];
                    if (sec.chapters && Array.isArray(sec.chapters)) {
                        for (const chap of sec.chapters) {
                            const chapQuestions = [];
                            if (chap.questions && Array.isArray(chap.questions)) {
                                for (const q of chap.questions) {
                                    const questionObj = {
                                        id: q._id,
                                        type: chap.chapterName || 'Aptitude',
                                        question: q.questionText,
                                        options: [
                                            { key: 'A', text: q.options?.A?.text || q.options?.A || '' },
                                            { key: 'B', text: q.options?.B?.text || q.options?.B || '' },
                                            { key: 'C', text: q.options?.C?.text || q.options?.C || '' },
                                            { key: 'D', text: q.options?.D?.text || q.options?.D || '' }
                                        ],
                                        image: q.questionImage?.fileUrl,
                                        correctOption: q.correctAnswer
                                    };
                                    questions.push(questionObj);
                                    chapQuestions.push(questionObj);
                                }
                            }
                            chapters.push({
                                id: chap._id,
                                title: chap.chapterName || 'Aptitude',
                                questions: chapQuestions
                            });
                        }
                    }
                    return {
                        title: sectionName,
                        questions,
                        chapters
                    };
                });
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
