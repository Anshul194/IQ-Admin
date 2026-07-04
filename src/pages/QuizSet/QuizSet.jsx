import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import {
    ChevronDown, ChevronRight, Plus, Trash2, Edit2,
    Layers, BookOpen, FileText, Settings, AlignLeft, X, AlertTriangle, Loader2
} from 'lucide-react';

import {
    fetchExamTypes, createExamType, deleteExamType,
    fetchSections, createSection, deleteSection,
    fetchChapters, createChapter, deleteChapter,
    fetchQuestions, createQuestion, updateQuestion, deleteQuestion,
    createBatchQuestions
} from '../../store/slices/quizSlice';
import api from '../../utils/api';

// --- Simple Editor ---
const SimpleEditor = ({ value, onChange, placeholder, minHeight = "60px" }) => {
    const containerRef = useRef(null);
    const quillRef = useRef(null);
    const isLocalChange = useRef(false);

    useEffect(() => {
        if (containerRef.current && !quillRef.current) {
            quillRef.current = new Quill(containerRef.current, {
                theme: 'snow',
                placeholder: placeholder || 'Type or drop content...',
                modules: {
                    toolbar: [
                        ['bold', 'italic', 'underline'],
                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                        ['clean']
                    ],
                }
            });
            quillRef.current.on('text-change', () => {
                isLocalChange.current = true;
                const html = quillRef.current.root.innerHTML;
                onChange(html === '<p><br></p>' ? '' : html);
            });
        }
    }, [placeholder, onChange]);

    useEffect(() => {
        if (quillRef.current && value !== quillRef.current.root.innerHTML) {
            if (!isLocalChange.current) {
                quillRef.current.root.innerHTML = value || '';
            }
        }
        isLocalChange.current = false;
    }, [value]);

    return (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden focus-within:border-indigo-500 transition-all shadow-sm">
            <div ref={containerRef} className="quill-simple-editor text-sm font-normal" style={{ minHeight }} />
        </div>
    );
};

// --- Modal Component ---
const Modal = ({ isOpen, onClose, title, children }) => (
    <AnimatePresence>
        {isOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                    <div className="flex justify-between items-center p-5 border-b border-slate-100">
                        <h3 className="font-bold text-slate-800">{title}</h3>
                        <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg text-slate-400"><X size={18} /></button>
                    </div>
                    <div className="p-5">{children}</div>
                </motion.div>
            </div>
        )}
    </AnimatePresence>
);

// --- Delete Confirmation Modal ---
const DeleteModal = ({ target, label, onConfirm, onCancel, loading }) => (
    <AnimatePresence>
        {target && (
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
                onClick={onCancel}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92 }}
                    onClick={e => e.stopPropagation()}
                    className="bg-white rounded-3xl shadow-2xl shadow-slate-200/60 p-8 max-w-md w-full"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500">
                            <AlertTriangle size={22} strokeWidth={2.5} />
                        </div>
                        <button onClick={onCancel} className="p-2 text-slate-300 hover:text-slate-600 transition-colors rounded-xl hover:bg-slate-50">
                            <X size={18} />
                        </button>
                    </div>
                    <h2 className="text-lg font-black text-slate-900 mb-1">Confirm Deletion</h2>
                    <p className="text-sm text-slate-500 font-medium mb-6">This action is permanent and cannot be undone.</p>

                    <div className="p-4 bg-slate-50 rounded-2xl mb-6">
                        <p className="text-sm font-bold text-slate-900">Are you sure you want to delete this {label}?</p>
                        <p className="text-xs font-semibold text-slate-400 mt-1 truncate">{target?.name || target?._id || ''}</p>
                    </div>

                    <div className="flex gap-3">
                        <button onClick={onCancel}
                            className="flex-1 py-3 bg-slate-50 text-slate-600 font-bold text-sm rounded-xl hover:bg-slate-100 transition-all">
                            Cancel
                        </button>
                        <button onClick={onConfirm} disabled={loading}
                            className="flex-1 py-3 bg-rose-500 text-white font-bold text-sm rounded-xl hover:bg-rose-600 disabled:opacity-60 transition-all flex items-center justify-center gap-2 shadow-lg shadow-rose-100">
                            {loading ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                            {loading ? 'Deleting...' : 'Yes, Delete'}
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
);

const QuizSet = () => {
    const dispatch = useDispatch();
    const { examTypes, sections, chapters, questions, loading } = useSelector(state => state.quiz);

    const [expandedExams, setExpandedExams] = useState({});
    const [expandedSections, setExpandedSections] = useState({});
    const [expandedChapters, setExpandedChapters] = useState({});

    const toggleExam = (id) => setExpandedExams(p => ({ ...p, [id]: !p[id] }));
    const toggleSection = (id) => setExpandedSections(p => ({ ...p, [id]: !p[id] }));
    const toggleChapter = (id) => setExpandedChapters(p => ({ ...p, [id]: !p[id] }));

    const [viewMode, setViewMode] = useState('list'); // 'list' | 'add_question' | 'edit_question'
    const [activeContext, setActiveContext] = useState({ examId: null, sectionId: null, chapterId: null });
    const [editQuestionData, setEditQuestionData] = useState(null);

    const [aptConfig, setAptConfig] = useState(null);
    useEffect(() => {
        api.get('/aptitude-results/config/settings').then(res => {
            if (res.data) setAptConfig(res.data);
        }).catch(err => console.error(err));
    }, []);

    useEffect(() => {
        dispatch(fetchExamTypes());
        dispatch(fetchSections());
        dispatch(fetchChapters());
        dispatch(fetchQuestions());
    }, [dispatch]);

    const [deleteTarget, setDeleteTarget] = useState(null);

    // Modals
    const [modal, setModal] = useState({ open: false, type: null, parentId: null });
    const closeModal = () => setModal({ open: false, type: null, parentId: null });

    const handleCreateExam = (e) => {
        e.preventDefault();
        dispatch(createExamType({ examType: e.target.examType.value, className: e.target.className.value, language: e.target.language.value }));
        closeModal();
    };

    const handleCreateSection = (e) => {
        e.preventDefault();
        dispatch(createSection({ sectionName: e.target.sectionName.value, examType: modal.parentId }));
        setExpandedExams(p => ({ ...p, [modal.parentId]: true }));
        closeModal();
    };

    const handleCreateChapter = (e) => {
        e.preventDefault();
        dispatch(createChapter({ chapterName: e.target.chapterName.value, sequence: parseInt(e.target.sequence.value) || 1, examType: activeContext.examId, section: modal.parentId }));
        setExpandedSections(p => ({ ...p, [modal.parentId]: true }));
        closeModal();
    };

    const defaultOption = () => ({ text: '', traitMapping: 'NONE', careerPairIndex: null });

    const openQuestionAdd = (examId, sectionId, chapterId) => {
        setActiveContext({ examId, sectionId, chapterId });
        setEditQuestionData({ questionText: '', options: { A: defaultOption(), B: defaultOption(), C: defaultOption(), D: defaultOption() }, correctAnswer: 'A' });
        setViewMode('add_question');
    };

    const openQuestionEdit = (q, examId, sectionId, chapterId) => {
        setActiveContext({ examId, sectionId, chapterId });
        setEditQuestionData({ ...q });
        setViewMode('edit_question');
    };

    const resetQuestionForm = () => {
        setEditQuestionData({
            questionText: '',
            options: { A: defaultOption(), B: defaultOption(), C: defaultOption(), D: defaultOption() },
            correctAnswer: 'A'
        });
    };

    const handleSaveQuestion = async (e, afterSave = 'back') => {
        e.preventDefault();
        const activeExam = examTypes.find(e => e._id === activeContext.examId);
        const isAptitudeClass = parseInt(activeExam?.className) > 5;
        const payload = {
            questionText: editQuestionData.questionText,
            options: editQuestionData.options,
            correctAnswer: editQuestionData.correctAnswer,
            isTraitBased: isAptitudeClass,
            examType: activeContext.examId,
            section: activeContext.sectionId,
            chapter: activeContext.chapterId
        };
        if (viewMode === 'add_question') await dispatch(createQuestion(payload));
        else await dispatch(updateQuestion({ id: editQuestionData._id, data: payload }));
        if (afterSave === 'another') {
            resetQuestionForm();
        } else {
            setViewMode('list');
        }
    };

    if (viewMode === 'add_question' || viewMode === 'edit_question') {
        const activeExam = examTypes.find(e => e._id === activeContext.examId);
        const activeChapter = chapters.find(c => c._id === activeContext.chapterId);
        const isAptitudeClass = parseInt(activeExam?.className) > 5;
        const chapterSeq = Number(activeChapter?.sequence);
        const activePair = aptConfig?.careerPairs?.find(p => Number(p.chapterSequence) === chapterSeq) || null;

        return (
            <div className="min-h-screen bg-slate-50 p-6 font-sans text-slate-800">
                <div className="max-w-5xl mx-auto space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold">{viewMode === 'add_question' ? 'Add New Question' : 'Edit Question'}</h2>
                            <p className="text-slate-500 text-sm mt-1">{activeChapter?.chapterName}</p>
                        </div>
                        <button onClick={() => setViewMode('list')} className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold hover:bg-slate-50 shadow-sm transition-all">Back to List</button>
                    </div>

                    <form onSubmit={(e) => handleSaveQuestion(e, 'back')} className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-8">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-3">Question Prompt</label>
                            <SimpleEditor value={editQuestionData.questionText} onChange={(v) => setEditQuestionData(p => ({ ...p, questionText: v }))} placeholder="Type the question..." />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-3">Answer Choices</label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {['A', 'B', 'C', 'D'].map(k => (
                                    <div key={k} className={`p-5 rounded-2xl border transition-all ${editQuestionData.correctAnswer === k && !isAptitudeClass ? 'border-indigo-500 bg-indigo-50/30 shadow-sm ring-4 ring-indigo-50/50' : 'border-slate-200 bg-white'}`}>
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="font-bold text-slate-700">Option {k}</span>
                                            {!isAptitudeClass && (
                                                <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold">
                                                    <input type="radio" checked={editQuestionData.correctAnswer === k} onChange={() => setEditQuestionData(p => ({ ...p, correctAnswer: k }))} className="w-4 h-4 text-indigo-600 focus:ring-indigo-500" /> Correct
                                                </label>
                                            )}
                                        </div>
                                        <SimpleEditor value={editQuestionData.options[k].text} onChange={(v) => setEditQuestionData(p => ({ ...p, options: { ...p.options, [k]: { ...p.options[k], text: v } } }))} minHeight="80px" />

                                        {isAptitudeClass && (
                                            <div className="mt-4 pt-4 border-t border-slate-100">
                                                <label className="text-xs font-bold text-slate-500 mb-2 block">Trait Mapping</label>
                                                {aptConfig?.careerPairs?.length ? (
                                                    <>
                                                        <div className="flex gap-2">
                                                            <select
                                                                value={editQuestionData.options[k]?.careerPairIndex ?? (activePair ? aptConfig.careerPairs.indexOf(activePair) : 0)}
                                                                onChange={(e) => setEditQuestionData(p => ({ ...p, options: { ...p.options, [k]: { ...p.options[k], careerPairIndex: Number(e.target.value) } } }))}
                                                                className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm outline-none focus:border-indigo-500"
                                                            >
                                                                {aptConfig.careerPairs.map((pair, pi) => (
                                                                    <option key={pi} value={pi}>Pair {pi + 1}</option>
                                                                ))}
                                                            </select>
                                                            <select
                                                                value={editQuestionData.options[k]?.traitMapping || 'NONE'}
                                                                onChange={(e) => setEditQuestionData(p => ({ ...p, options: { ...p.options, [k]: { ...p.options[k], traitMapping: e.target.value } } }))}
                                                                className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm outline-none focus:border-indigo-500"
                                                            >
                                                                <option value="NONE">No points</option>
                                                                <option value="CAREER_1">{aptConfig.careerPairs[editQuestionData.options[k]?.careerPairIndex ?? (activePair ? aptConfig.careerPairs.indexOf(activePair) : 0)]?.career1 || 'Career 1'}</option>
                                                                <option value="CAREER_2">{aptConfig.careerPairs[editQuestionData.options[k]?.careerPairIndex ?? (activePair ? aptConfig.careerPairs.indexOf(activePair) : 0)]?.career2 || 'Career 2'}</option>
                                                                <option value="BOTH">Both</option>
                                                            </select>
                                                        </div>
                                                        <p className="text-[9px] text-slate-400 font-medium">
                                                            {(() => {
                                                                const pi = editQuestionData.options[k]?.careerPairIndex ?? (activePair ? aptConfig.careerPairs.indexOf(activePair) : -1);
                                                                const pair = pi >= 0 ? aptConfig.careerPairs[pi] : null;
                                                                const tm = editQuestionData.options[k]?.traitMapping || 'NONE';
                                                                if (tm === 'NONE') return 'No points awarded';
                                                                const c1 = pair?.career1 || 'Career 1';
                                                                const c2 = pair?.career2 || 'Career 2';
                                                                if (tm === 'CAREER_1') return `+1 → ${c1}`;
                                                                if (tm === 'CAREER_2') return `+1 → ${c2}`;
                                                                if (tm === 'BOTH') return `+1 → Both (${c1} + ${c2})`;
                                                                return '';
                                                            })()}
                                                        </p>
                                                    </>
                                                ) : (
                                                    <p className="text-[10px] font-semibold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg">No career pairs configured — go to Aptitude Settings to add them.</p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-100 flex gap-4 justify-end">
                            <button type="button" onClick={() => setViewMode('list')} className="px-6 py-3 rounded-xl border border-slate-200 font-semibold text-slate-600 hover:bg-slate-50 transition-all">Cancel</button>
                            {viewMode === 'add_question' && (
                                <button type="button" onClick={(e) => handleSaveQuestion(e, 'another')} disabled={loading} className="px-6 py-3 rounded-xl border-2 border-indigo-200 text-indigo-600 font-bold hover:bg-indigo-50 transition-all">
                                    {loading ? 'Saving...' : 'Save & Add Another'}
                                </button>
                            )}
                            <button type="submit" disabled={loading} className="px-8 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all">
                                {viewMode === 'add_question' ? 'Save & Back to List' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    // MAIN DATA TABLE VIEW
    return (
        <div className="min-h-screen bg-slate-50/50 p-6 md:p-8 font-sans text-slate-800" style={{ fontFamily: "'Montserrat', sans-serif" }}>

            {/* Headers */}
            <div className="max-w-6xl mx-auto flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Quiz & Exam Database</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage the entire hierarchy of exams, sections, and questions effortlessly.</p>
                </div>
                <button onClick={() => setModal({ open: true, type: 'exam' })} className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-600 transition-all shadow-md">
                    <Plus size={16} /> New Exam
                </button>
            </div>

            <div className="max-w-6xl mx-auto bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 p-4 border-b border-slate-200 bg-slate-50/80 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <div className="col-span-1">Expand</div>
                    <div className="col-span-4">Node Name</div>
                    <div className="col-span-3">Type / Meta</div>
                    <div className="col-span-2">Items</div>
                    <div className="col-span-2 text-right">Actions</div>
                </div>

                {/* Exapandable Hierarchy Logic */}
                <div className="divide-y divide-slate-100">
                    {examTypes.length === 0 && <div className="p-8 text-center text-slate-400">No exams configured yet.</div>}

                    {examTypes.map(exam => {
                        const examSections = sections.filter(s => (s.examType?._id || s.examType) === exam._id);
                        return (
                            <React.Fragment key={exam._id}>
                                {/* EXAM ROW */}
                                <div className={`grid grid-cols-12 gap-4 p-4 items-center hover:bg-slate-50 cursor-pointer transition-colors ${expandedExams[exam._id] ? 'bg-indigo-50/20' : ''}`} onClick={() => toggleExam(exam._id)}>
                                    <div className="col-span-1 text-slate-400">{expandedExams[exam._id] ? <ChevronDown size={18} /> : <ChevronRight size={18} />}</div>
                                    <div className="col-span-4 flex items-center gap-3">
                                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><BookOpen size={16} /></div>
                                        <span className="font-bold text-slate-800">{exam.examType}</span>
                                    </div>
                                    <div className="col-span-3 text-sm text-slate-500 flex flex-col">
                                        <span>Class {exam.className}</span>
                                        <span className="text-xs text-slate-400">{exam.language}</span>
                                    </div>
                                    <div className="col-span-2 text-sm text-slate-500 font-semibold">{examSections.length} Sections</div>
                                    <div className="col-span-2 flex justify-end gap-2" onClick={e => e.stopPropagation()}>
                                        <button onClick={() => setModal({ open: true, type: 'section', parentId: exam._id })} className="flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-lg hover:border-indigo-500 hover:text-indigo-600 transition-all shadow-sm">
                                            <Plus size={12} /> Add Section
                                        </button>
                                        <button onClick={() => setDeleteTarget({ id: exam._id, type: 'exam', name: exam.examType })} className="p-1.5 border border-transparent text-rose-500 hover:bg-rose-50 rounded-lg transition-colors" title="Delete Exam"><Trash2 size={16} /></button>
                                    </div>
                                </div>

                                {/* SECTIONS EMPTY STATE */}
                                {expandedExams[exam._id] && examSections.length === 0 && (
                                    <div className="p-6 text-center text-slate-400 text-sm bg-slate-50/50 border-t border-slate-50">
                                        No sections found. Click "Add Section" to begin organizing your exam.
                                    </div>
                                )}

                                {/* SECTIONS */}
                                {expandedExams[exam._id] && examSections.map(seq => {
                                    const sectionChapters = chapters.filter(c => (c.section?._id || c.section) === seq._id);
                                    return (
                                        <React.Fragment key={seq._id}>
                                            <div className={`grid grid-cols-12 gap-4 p-4 pl-12 items-center hover:bg-slate-50 border-t border-slate-50 cursor-pointer transition-colors bg-slate-50/50 ${expandedSections[seq._id] ? 'bg-blue-50/20' : ''}`} onClick={() => toggleSection(seq._id)}>
                                                <div className="col-span-1 text-slate-400">{expandedSections[seq._id] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}</div>
                                                <div className="col-span-4 flex items-center gap-3">
                                                    <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg"><Layers size={14} /></div>
                                                    <span className="font-semibold text-slate-700">{seq.sectionName}</span>
                                                </div>
                                                <div className="col-span-3 text-xs text-slate-400 uppercase tracking-widest font-semibold">Section</div>
                                                <div className="col-span-2 text-sm text-slate-500">{sectionChapters.length} Chapters</div>
                                                <div className="col-span-2 flex justify-end gap-2" onClick={e => e.stopPropagation()}>
                                                    <button onClick={() => { setActiveContext({ examId: exam._id }); setModal({ open: true, type: 'chapter', parentId: seq._id }); }} className="flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-lg hover:border-blue-500 hover:text-blue-600 transition-all shadow-sm">
                                                        <Plus size={12} /> Add Chapter
                                                    </button>
                                                    <button onClick={() => setDeleteTarget({ id: seq._id, type: 'section', name: seq.sectionName })} className="p-1.5 border border-transparent text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"><Trash2 size={14} /></button>
                                                </div>
                                            </div>

                                            {/* CHAPTERS EMPTY STATE */}
                                            {expandedSections[seq._id] && sectionChapters.length === 0 && (
                                                <div className="p-6 text-center text-slate-400 text-sm bg-slate-100/30 border-t border-slate-50">
                                                    No chapters defined. Click "Add Chapter" to create one.
                                                </div>
                                            )}

                                            {/* CHAPTERS */}
                                            {expandedSections[seq._id] && sectionChapters.map(chap => {
                                                const chapQuestions = questions.filter(q => (q.chapter?._id || q.chapter) === chap._id);
                                                return (
                                                    <React.Fragment key={chap._id}>
                                                        <div className={`grid grid-cols-12 gap-4 p-4 pl-20 items-center hover:bg-slate-50 border-t border-slate-50 cursor-pointer transition-colors bg-slate-100/30 ${expandedChapters[chap._id] ? 'bg-violet-50/20' : ''}`} onClick={() => toggleChapter(chap._id)}>
                                                            <div className="col-span-1 text-slate-400">{expandedChapters[chap._id] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}</div>
                                                            <div className="col-span-4 flex items-center gap-3">
                                                                <div className="p-1.5 bg-violet-50 text-violet-600 rounded-lg"><FileText size={14} /></div>
                                                                <span className="font-semibold text-slate-700">{chap.chapterName}</span>
                                                            </div>
                                                            <div className="col-span-3 text-xs text-slate-400 font-medium">
                                                                <span>Ch. {chap.sequence}</span>
                                                                <span className="mx-1.5 text-slate-300">|</span>
                                                                <span>Sec: {seq.sectionName}</span>
                                                            </div>
                                                            <div className="col-span-2 text-sm text-slate-500">{chapQuestions.length} Questions</div>
                                                            <div className="col-span-2 flex justify-end gap-2" onClick={e => e.stopPropagation()}>
                                                                <button onClick={() => openQuestionAdd(exam._id, seq._id, chap._id)} className="flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-lg hover:border-indigo-500 hover:text-indigo-600 transition-all shadow-sm">
                                                                    <Plus size={12} /> Add Q's
                                                                </button>
                                                                <button onClick={() => setDeleteTarget({ id: chap._id, type: 'chapter', name: chap.chapterName })} className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"><Trash2 size={14} /></button>
                                                            </div>
                                                        </div>

                                                        {/* QUESTIONS LIST */}
                                                        {expandedChapters[chap._id] && (
                                                            <div className="bg-slate-50/80 border-t border-slate-100 p-6 pl-28">
                                                                <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                                                                    {chapQuestions.length === 0 ? (
                                                                        <div className="p-8 text-center text-slate-400 text-sm">No questions drafted. Click "Add Q's" to start writing.</div>
                                                                    ) : (
                                                                        <table className="w-full text-sm">
                                                                            <thead>
                                                                                <tr className="bg-slate-50 border-b border-slate-100 text-left text-xs text-slate-500 uppercase tracking-widest">
                                                                                    <th className="p-4 w-12 font-bold">No.</th>
                                                                                    <th className="p-4 font-bold">Question Prompt</th>
                                                                                    <th className="p-4 w-28 font-bold">Correct Option</th>
                                                                                    <th className="p-4 w-24 text-right font-bold">Actions</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody className="divide-y divide-slate-100">
                                                                                {chapQuestions.map((q, idx) => (
                                                                                    <tr key={q._id} className="hover:bg-slate-50/50">
                                                                                        <td className="p-4 align-top font-bold text-slate-400">{idx + 1}</td>
                                                                                        <td className="p-4 align-top">
                                                                                            <div className="prose prose-sm text-slate-700 max-w-full truncate overflow-hidden line-clamp-3" dangerouslySetInnerHTML={{ __html: q.questionText }} />
                                                                                        </td>
                                                                                        <td className="p-4 align-top font-black text-emerald-600">Option {q.correctAnswer}</td>
                                                                                        <td className="p-4 align-top text-right">
                                                                                            <button onClick={() => openQuestionEdit(q, exam._id, seq._id, chap._id)} className="p-1.5 text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors"><Edit2 size={14} /></button>
                                                                                            <button onClick={() => setDeleteTarget({ id: q._id, type: 'question', name: 'Question' })} className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors ml-1"><Trash2 size={14} /></button>
                                                                                        </td>
                                                                                    </tr>
                                                                                ))}
                                                                            </tbody>
                                                                        </table>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </React.Fragment>
                                                )
                                            })}
                                        </React.Fragment>
                                    )
                                })}
                            </React.Fragment>
                        )
                    })}
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <DeleteModal
                target={deleteTarget}
                label={deleteTarget?.type || ''}
                loading={loading}
                onCancel={() => setDeleteTarget(null)}
                onConfirm={() => {
                    if (!deleteTarget) return;
                    if (deleteTarget.type === 'exam') dispatch(deleteExamType(deleteTarget.id));
                    if (deleteTarget.type === 'section') dispatch(deleteSection(deleteTarget.id));
                    if (deleteTarget.type === 'chapter') dispatch(deleteChapter(deleteTarget.id));
                    if (deleteTarget.type === 'question') dispatch(deleteQuestion(deleteTarget.id));
                    setDeleteTarget(null);
                }}
            />

            {/* Quick Creation Modals */}
            <Modal isOpen={modal.open && modal.type === 'exam'} onClose={closeModal} title="Register New Exam">
                <form onSubmit={handleCreateExam} className="space-y-4">
                    <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Exam Track Name</label>
                        <input name="examType" required className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:border-indigo-500 outline-none" placeholder="e.g. Diagnostic Exam" /></div>
                    <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Target Class</label>
                        <select name="className" required className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:border-indigo-500 outline-none bg-white">
                            {['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'].map(c => <option key={c} value={c}>{c}</option>)}
                        </select></div>
                    <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Language Medium</label>
                        <select name="language" required className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:border-indigo-500 outline-none bg-white">
                            <option value="English">English</option><option value="Hindi">Hindi</option><option value="Marathi">Marathi</option>
                        </select></div>
                    <button type="submit" className="w-full bg-indigo-600 text-white font-bold rounded-lg p-3 hover:bg-slate-900 transition-colors mt-2">Initialize Exam</button>
                </form>
            </Modal>

            <Modal isOpen={modal.open && modal.type === 'section'} onClose={closeModal} title="Add Section to Exam">
                <form onSubmit={handleCreateSection} className="space-y-4">
                    <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Section Alias</label>
                        <input name="sectionName" required className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:border-indigo-500 outline-none" placeholder="e.g. Mathematics Module" /></div>
                    <button type="submit" className="w-full bg-blue-600 text-white font-bold rounded-lg p-3 hover:bg-slate-900 transition-colors mt-2">Save Section</button>
                </form>
            </Modal>

            <Modal isOpen={modal.open && modal.type === 'chapter'} onClose={closeModal} title="Establish New Chapter">
                <form onSubmit={handleCreateChapter} className="space-y-4">
                    <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Chapter Heading</label>
                        <input name="chapterName" required className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:border-indigo-500 outline-none" placeholder="e.g. Fundamental Algebra" /></div>
                    <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Ch. Sequence Rank</label>
                        <input name="sequence" type="number" required className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:border-indigo-500 outline-none" placeholder="1"
                            defaultValue={(() => {
                                const parentSection = sections.find(s => s._id === modal.parentId);
                                if (!parentSection) return 1;
                                const existing = chapters.filter(c => (c.section?._id || c.section) === modal.parentId);
                                return existing.length > 0 ? Math.max(...existing.map(c => c.sequence || 0)) + 1 : 1;
                            })()} /></div>
                    <button type="submit" className="w-full bg-violet-600 text-white font-bold rounded-lg p-3 hover:bg-slate-900 transition-colors mt-2">Add Chapter Node</button>
                </form>
            </Modal>

        </div>
    );
};

export default QuizSet;
