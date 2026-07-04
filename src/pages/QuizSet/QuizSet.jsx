import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus, Trash2, Save, X, Loader2,
    BookOpen, Layers, ScrollText, CheckCircle2,
    FileQuestion, ChevronRight, Search,
    Image as ImageIcon, PlusCircle,
    ArrowRight, Tag, ChevronDown,
    PlusSquare, FolderPlus, FilePlus,
    Circle, CheckCircle, Sparkles, Wand2,
    Video, Maximize2, Layout, Sliders,
    ChevronLeft, MoreVertical, LayoutGrid,
    Settings, Eye, History, ArrowLeft,
    Check, ClipboardList, Database, LayoutPanelLeft,
    MonitorPlay, ListChecks, FileText,
    ArrowUpRight, ExternalLink, Filter,
    MoreHorizontal, Download, Share2, Calendar,
    Pencil
} from 'lucide-react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

import {
    fetchExamTypes, createExamType, updateExamType, deleteExamType,
    fetchSections, createSection, updateSection, deleteSection,
    fetchChapters, createChapter, updateChapter, deleteChapter,
    fetchQuestions, createQuestion, updateQuestion, deleteQuestion,
    resetQuizState
} from '../../store/slices/quizSlice';
import api from '../../utils/api';

// --- Professional Simple Editor ---

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
                        ['image', 'video'],
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
    }, [placeholder]);

    useEffect(() => {
        if (quillRef.current && value !== quillRef.current.root.innerHTML) {
            if (!isLocalChange.current) {
                quillRef.current.root.innerHTML = value || '';
            }
        }
        isLocalChange.current = false;
    }, [value]);

    return (
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden focus-within:border-slate-400 transition-all">
            <div ref={containerRef} className="quill-simple-editor text-sm font-normal" style={{ minHeight }} />
        </div>
    );
};

// --- Success Modal ---
const SuccessModal = ({ isOpen, onClose, message, subMessage, buttonText = "Proceed to Next Step" }) => (
    <AnimatePresence>
        {isOpen && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
                <motion.div
                    initial={{ scale: 0.5, opacity: 0, y: 40 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.8, opacity: 0, y: 20 }}
                    className="bg-white rounded-[40px] p-10 max-w-sm w-full shadow-2xl border border-slate-100 text-center space-y-6 relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-2 bg-indigo-600" />

                    <div className="flex justify-center">
                        <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center text-indigo-600 animate-bounce">
                            <CheckCircle2 size={40} strokeWidth={2.5} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">Success!</h3>
                        <p className="text-[11px] font-black text-indigo-600 uppercase tracking-widest leading-relaxed">
                            {message}
                        </p>
                        {subMessage && (
                            <p className="text-xs font-bold text-slate-400 mt-2 leading-relaxed italic border-t border-slate-50 pt-4">
                                <span className="text-slate-900">Summary:</span> {subMessage}
                            </p>
                        )}
                    </div>

                    <button
                        onClick={onClose}
                        className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs hover:bg-indigo-600 transition-all shadow-xl shadow-slate-900/20 uppercase tracking-[0.3em]"
                    >
                        {buttonText}
                    </button>
                </motion.div>
            </div>
        )}
    </AnimatePresence>
);

// --- Compact sidebar list panel (Exam / Section / Chapter) ---
const SidebarStep = ({ step, title, icon: Icon, currentLabel, placeholder, isCurrent, disabled, onClick }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-left transition-all rounded-xl border
            ${disabled 
                ? 'opacity-40 cursor-not-allowed border-transparent bg-transparent' 
                : 'cursor-pointer border-transparent bg-transparent hover:bg-slate-50/60 hover:text-slate-900'
            }
            ${isCurrent && !disabled 
                ? '!border-indigo-100 bg-indigo-50/40 shadow-sm shadow-indigo-100/10' 
                : ''
            }
        `}
    >
        <div className={`p-2 rounded-lg shrink-0 transition-all ${isCurrent && !disabled ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200/50' : 'bg-slate-100 text-slate-400'}`}>
            <Icon size={14} />
        </div>
        <div className="min-w-0 flex-1">
            <p className={`text-[8px] font-black uppercase tracking-widest ${isCurrent && !disabled ? 'text-indigo-500' : 'text-slate-400'}`}>{step} / {title}</p>
            <p className={`text-xs font-bold truncate mt-0.5 ${currentLabel ? 'text-slate-800' : 'text-slate-300 italic'}`}>
                {currentLabel || placeholder}
            </p>
        </div>
        <ChevronRight size={12} className={isCurrent && !disabled ? 'text-indigo-400' : 'text-slate-200'} />
    </button>
);

// --- Reusable question composer block (used for batch items and single edit) ---
const QuestionBlock = ({
    index, value, onTextChange, onOptionTextChange, onOptionTraitChange, onCorrectChange,
    isTraitBased, activePair, onRemove, removable
}) => (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 space-y-4 relative">
        {removable && (
            <button
                type="button"
                onClick={onRemove}
                className="absolute top-5 right-5 p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                title="Remove this question"
            >
                <Trash2 size={16} />
            </button>
        )}

        <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center font-black text-xs shrink-0">
                {index}
            </div>
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest">Question {index}</h4>
        </div>

        <SimpleEditor
            value={value.questionText}
            onChange={onTextChange}
            placeholder="Enter your question here..."
        />

        <div className="space-y-2.5">
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <div className="w-1 h-3 bg-indigo-600 rounded-full" /> Choice Grid
            </label>
            <div className="bg-slate-50/50 p-1.5 rounded-2xl space-y-1 border border-slate-100">
                {['A', 'B', 'C', 'D'].map(k => (
                    <div key={k} className={`flex items-start gap-2.5 bg-white p-2 rounded-xl border transition-all ${!isTraitBased && value.correctAnswer === k ? 'border-indigo-600 ring-4 ring-indigo-50/50 bg-gradient-to-r from-indigo-50/20 to-transparent' : isTraitBased ? 'border-slate-100' : 'border-slate-100 hover:border-slate-200'}`}>
                        {!isTraitBased && (
                            <div className="flex flex-col items-center gap-1.5 py-1 w-12 shrink-0 border-r border-slate-50">
                                <span className={`text-xs font-black ${value.correctAnswer === k ? 'text-indigo-600' : 'text-slate-300'}`}>{k}</span>
                                <button
                                    type="button"
                                    onClick={() => onCorrectChange(k)}
                                    className={`w-6 h-6 rounded-md transition-all border-2 flex items-center justify-center ${value.correctAnswer === k
                                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
                                        : 'bg-white border-slate-100 text-slate-100 hover:text-indigo-400 hover:border-indigo-100'
                                        }`}
                                >
                                    <Check size={12} strokeWidth={4} />
                                </button>
                            </div>
                        )}
                        {isTraitBased && (
                            <div className="flex flex-col items-center gap-1 py-1 w-12 shrink-0 border-r border-slate-50">
                                <span className="text-xs font-black text-slate-400">{k}</span>
                                <div className={`px-1 py-0.5 rounded text-[6px] font-black uppercase tracking-wider text-center leading-tight ${value.options[k].traitMapping === 'CAREER_1' ? 'bg-blue-100 text-blue-700' : value.options[k].traitMapping === 'CAREER_2' ? 'bg-indigo-100 text-indigo-700' : value.options[k].traitMapping === 'BOTH' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-400'}`}>
                                    {value.options[k].traitMapping === 'CAREER_1' ? 'Car.1' :
                                     value.options[k].traitMapping === 'CAREER_2' ? 'Car.2' :
                                     value.options[k].traitMapping === 'BOTH' ? 'Both' : 'None'}
                                </div>
                            </div>
                        )}
                        <div className="flex-1 min-w-0 flex flex-col gap-1">
                            <SimpleEditor
                                value={value.options[k].text}
                                onChange={(val) => onOptionTextChange(k, val)}
                                placeholder={`Response choice ${k}...`}
                                minHeight="60px"
                            />

                            {isTraitBased && (
                                <div className="flex flex-col gap-1.5 mt-2">
                                    <div className="flex items-center gap-4">
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest shrink-0 w-20">Trait Map</label>
                                        <select
                                            value={value.options[k].traitMapping || 'NONE'}
                                            onChange={(e) => onOptionTraitChange(k, e.target.value)}
                                            className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-700 outline-none focus:border-indigo-500 cursor-pointer"
                                        >
                                            <option value="NONE">No points awarded</option>
                                            {activePair && (
                                                <>
                                                    <option value="CAREER_1">+1 → {activePair.career1}</option>
                                                    <option value="CAREER_2">+1 → {activePair.career2}</option>
                                                    <option value="BOTH">+1 → {activePair.career1} &amp; {activePair.career2}</option>
                                                </>
                                            )}
                                            {!activePair && (
                                                <>
                                                    <option value="CAREER_1">+1 → Career 1</option>
                                                    <option value="CAREER_2">+1 → Career 2</option>
                                                    <option value="BOTH">+1 → Both Careers</option>
                                                </>
                                            )}
                                        </select>
                                    </div>
                                    {value.options[k].traitMapping && value.options[k].traitMapping !== 'NONE' && (
                                        <span className="text-[9px] font-bold text-violet-600 ml-24">
                                            {value.options[k].traitMapping === 'BOTH' ? 'Awards 1 point to each career' : 'Awards 1 point'}
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

// --- Generic data table used to browse Exams / Sections / Chapters on the right panel ---
const DataTable = ({ title, addLabel, onAdd, items, columns, onView, onEdit, onDelete, emptyText, contextBar }) => (
    <div className="space-y-3.5 animate-in fade-in duration-300">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
                <div className="w-1 h-5 bg-slate-900 rounded-full" />
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">{title}</h3>
            </div>
            <button
                onClick={onAdd}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-md shadow-indigo-100"
            >
                <PlusSquare size={12} /> {addLabel}
            </button>
        </div>

        {contextBar}

        <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gradient-to-r from-slate-50 to-indigo-50/20 border-b border-slate-100">
                            {columns.map(col => (
                                <th key={col.header} className="px-4 py-2.5 text-left text-[8px] font-black text-slate-400 uppercase tracking-widest">{col.header}</th>
                            ))}
                            <th className="px-4 py-2.5 text-right text-[8px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {items.length > 0 ? items.map((item, idx) => (
                            <tr key={item._id || idx} className="hover:bg-slate-50/80 transition-colors group cursor-pointer" onClick={() => onView(item)}>
                                {columns.map(col => (
                                    <td key={col.header} className="px-4 py-2.5 whitespace-nowrap">
                                        {col.render(item)}
                                    </td>
                                ))}
                                <td className="px-4 py-2.5 text-right">
                                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                        <button onClick={(e) => { e.stopPropagation(); onView(item); }} className="p-1 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all" title="View">
                                            <Eye size={12} />
                                        </button>
                                        <button onClick={(e) => { e.stopPropagation(); onEdit(item); }} className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" title="Edit">
                                            <Pencil size={12} />
                                        </button>
                                        <button onClick={(e) => { e.stopPropagation(); onDelete(item._id); }} className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all" title="Delete">
                                            <Trash2 size={12} />
                                        </button>
                                        <button onClick={(e) => { e.stopPropagation(); onView(item); }} className="px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-widest bg-slate-900 text-white hover:bg-indigo-600 transition-all">
                                            View
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={columns.length + 1} className="px-6 py-20 text-center text-[10px] font-bold text-slate-300 uppercase tracking-widest italic">
                                    {emptyText}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
);

const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '---';

const makeEmptyOption = () => ({ text: '', traitMapping: 'NONE' });
const makeEmptyQuestion = () => ({
    localId: `q_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    questionText: '',
    options: { A: makeEmptyOption(), B: makeEmptyOption(), C: makeEmptyOption(), D: makeEmptyOption() },
    correctAnswer: 'A'
});

const QuizSet = () => {
    const dispatch = useDispatch();
    const { examTypes, sections, chapters, questions, loading, success, lastCreatedId } = useSelector(state => state.quiz);

    const [viewMode, setViewMode] = useState('studio'); // 'studio' | 'bank'
    const [activeExamId, setActiveExamId] = useState('');
    const [activeSectionId, setActiveSectionId] = useState('');
    const [activeChapterId, setActiveChapterId] = useState('');
    const [expandedQuestions, setExpandedQuestions] = useState({});
    const [createType, setCreateType] = useState('exam');
    const [isTraitBased, setIsTraitBased] = useState(false);
    const [modal, setModal] = useState({ open: false, title: '', fields: [], icon: null, onSubmit: null, contextLabel: '', contextValue: '' });
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [successPrompt, setSuccessPrompt] = useState({ title: '', nextStep: '', buttonText: '' });

    // Dynamic Aptitude Config Fetching
    const [aptConfig, setAptConfig] = useState(null);
    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const res = await api.get('/aptitude-results/config/settings');
                if (res.data) setAptConfig(res.data);
            } catch (err) {
                console.error('Failed to load Aptitude setting config:', err);
            }
        };
        fetchConfig();
    }, []);

    useEffect(() => {
        dispatch(fetchExamTypes());
        dispatch(fetchSections());
        dispatch(fetchChapters());
        dispatch(fetchQuestions());
    }, [dispatch]);

    const activeExam = useMemo(() => examTypes.find(e => (e._id || e.id) === activeExamId), [examTypes, activeExamId]);
    const filteredSections = useMemo(() => sections.filter(s => (s.examType?._id || s.examType) === activeExamId), [sections, activeExamId]);
    const activeSection = useMemo(() => sections.find(s => (s._id || s.id) === activeSectionId), [sections, activeSectionId]);
    const filteredChapters = useMemo(() => chapters.filter(c => (c.section?._id || c.section) === activeSectionId), [chapters, activeSectionId]);
    const activeChapter = useMemo(() => chapters.find(c => (c._id || c.id) === activeChapterId), [chapters, activeChapterId]);
    const activeChapterQuestions = useMemo(() => questions.filter(q => (q.chapter?._id || q.chapter) === activeChapterId), [questions, activeChapterId]);

    // Selecting a level resets deeper levels
    const selectExam = (id) => { setActiveExamId(id); setActiveSectionId(''); setActiveChapterId(''); };
    const selectSection = (id) => { setActiveSectionId(id); setActiveChapterId(''); };
    const selectChapter = (id) => setActiveChapterId(id);

    // --- Exam / Section / Chapter creation (still via quick modal, triggered from sidebar) ---
    useEffect(() => {
        if (success && lastCreatedId && (createType === 'exam' || createType === 'section' || createType === 'chapter')) {
            let title = '';
            let nextStep = '';

            if (createType === 'exam') {
                setActiveExamId(lastCreatedId);
                title = 'Exam Type Registered';
                nextStep = 'The exam catalog is ready. Please define the sections (territories) for this exam.';
            } else if (createType === 'section') {
                setActiveSectionId(lastCreatedId);
                title = 'Section Node Created';
                nextStep = 'Section is live. Now establish the chapter-level modules within this section.';
            } else if (createType === 'chapter') {
                setActiveChapterId(lastCreatedId);
                title = 'Chapter Established';
                nextStep = 'Architecture complete! You can now start adding questions to this chapter.';
            }

            setSuccessPrompt({ title, nextStep, buttonText: 'Proceed to Next Step' });
            setShowSuccessModal(true);
            setModal(prev => ({ ...prev, open: false }));
            setCreateType(null);
        }
    }, [success, lastCreatedId, createType]);

    const handleCloseSuccess = () => {
        setShowSuccessModal(false);
        dispatch(resetQuizState());
    };

    const openCreateExam = (editData) => {
        const isEdit = !!editData;
        setModal({
            open: true, icon: Database, title: isEdit ? 'Edit Exam Metadata' : 'Exam Metadata',
            fields: [
                { name: 'examType', label: 'Name', required: true, value: editData?.examType || '' },
                { name: 'className', label: 'Class', type: 'select', options: ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'], required: true, value: editData?.className || '' },
                { name: 'language', label: 'Language', type: 'select', options: ['Hindi', 'English', 'Marathi'], required: true, value: editData?.language || '' }
            ],
            onSubmit: (data) => {
                if (isEdit) { setCreateType('exam'); dispatch(updateExamType({ id: editData._id, data })); }
                else { setCreateType('exam'); dispatch(createExamType(data)); }
            }
        });
    };
    const openCreateSection = (editData) => {
        const isEdit = !!editData;
        setModal({
            open: true, icon: Layers, title: isEdit ? 'Edit Section' : 'Create Section',
            fields: [{ name: 'sectionName', label: 'Section Label', required: true, value: editData?.sectionName || '' }],
            contextLabel: 'Exam Context', contextValue: activeExam?.examType,
            onSubmit: (data) => {
                if (isEdit) { setCreateType('section'); dispatch(updateSection({ id: editData._id, data })); }
                else { setCreateType('section'); dispatch(createSection({ ...data, examType: activeExamId })); }
            }
        });
    };
    const openCreateChapter = (editData) => {
        const isEdit = !!editData;
        setModal({
            open: true, icon: ScrollText, title: isEdit ? 'Edit Chapter' : 'Create Chapter',
            fields: [
                { name: 'chapterName', label: 'Chapter Heading', required: true, value: editData?.chapterName || '' },
                { name: 'sequence', label: 'Order Index', type: 'number', required: true, value: editData?.sequence || '' }
            ],
            contextLabel: 'Section Context', contextValue: activeSection?.sectionName,
            onSubmit: (data) => {
                const payload = { ...data, sequence: Number(data.sequence) || 1 };
                if (isEdit) { setCreateType('chapter'); dispatch(updateChapter({ id: editData._id, data: payload })); }
                else { setCreateType('chapter'); dispatch(createChapter({ ...payload, examType: activeExamId, section: activeSectionId })); }
            }
        });
    };

    // --- Batch question composer state ---
    const [batch, setBatch] = useState([makeEmptyQuestion()]);
    const [batchSaving, setBatchSaving] = useState(false);
    const [editForm, setEditForm] = useState(null); // { _id, questionText, options, correctAnswer }

    const addBlock = () => setBatch(prev => [...prev, makeEmptyQuestion()]);
    const removeBlock = (localId) => setBatch(prev => prev.length > 1 ? prev.filter(q => q.localId !== localId) : prev);
    const updateBlockField = (localId, field, val) => setBatch(prev => prev.map(q => q.localId === localId ? { ...q, [field]: val } : q));
    const updateBlockOption = (localId, key, field, val) => setBatch(prev => prev.map(q => q.localId === localId
        ? { ...q, options: { ...q.options, [key]: { ...q.options[key], [field]: val } } }
        : q));
    const resetBatch = () => setBatch([makeEmptyQuestion()]);

    const loadQuestionForEdit = (q) => {
        setEditForm({
            _id: q._id,
            questionText: q.questionText || '',
            options: {
                A: { text: q.options?.A?.text || '', traitMapping: q.options?.A?.traitMapping || 'NONE' },
                B: { text: q.options?.B?.text || '', traitMapping: q.options?.B?.traitMapping || 'NONE' },
                C: { text: q.options?.C?.text || '', traitMapping: q.options?.C?.traitMapping || 'NONE' },
                D: { text: q.options?.D?.text || '', traitMapping: q.options?.D?.traitMapping || 'NONE' }
            },
            correctAnswer: q.correctAnswer || 'A'
        });
        setIsTraitBased(q.isTraitBased || false);
        setViewMode('studio');
    };
    const cancelEdit = () => {
        setEditForm(null);
        setViewMode('bank');
    };
    const updateEditField = (field, val) => setEditForm(prev => ({ ...prev, [field]: val }));
    const updateEditOption = (key, field, val) => setEditForm(prev => ({ ...prev, options: { ...prev.options, [key]: { ...prev.options[key], [field]: val } } }));

    const getChapterPair = (seq) => aptConfig?.careerPairs?.find(p => p.chapterSequence === seq);
    const activePair = getChapterPair(activeChapter?.sequence);

    const isAptitudeClass = (() => {
        const cn = parseInt(activeExam?.className);
        return !isNaN(cn) && cn > 5;
    })();

    useEffect(() => {
        if (activeExamId && isAptitudeClass) setIsTraitBased(true);
    }, [activeExamId, isAptitudeClass]);

    // Whenever the active chapter changes, reset the composer and always land on the
    // Question List first — the editor is only reached deliberately via "Add Question".
    useEffect(() => {
        resetBatch();
        setEditForm(null);
        setViewMode('bank');
        setExpandedQuestions({});
    }, [activeChapterId]);

    const openComposerForNew = () => {
        setEditForm(null);
        resetBatch();
        setViewMode('studio');
    };

    const handleSaveAll = async (e) => {
        e.preventDefault();
        const validBatch = batch.filter(q => q.questionText.trim());
        if (!validBatch.length) return;
        setBatchSaving(true);
        try {
            await Promise.all(validBatch.map(q => dispatch(createQuestion({
                questionText: q.questionText,
                options: q.options,
                correctAnswer: q.correctAnswer,
                isTraitBased,
                examType: activeExamId,
                section: activeSectionId,
                chapter: activeChapterId
            }))));
            resetBatch();
            setSuccessPrompt({
                title: `${validBatch.length} Question${validBatch.length > 1 ? 's' : ''} Secured`,
                nextStep: 'All questions have been added to the vault. Continue adding more whenever you\'re ready.',
                buttonText: 'View Question List'
            });
            setShowSuccessModal(true);
            setViewMode('bank');
        } finally {
            setBatchSaving(false);
        }
    };

    const handleUpdateQuestion = (e) => {
        e.preventDefault();
        dispatch(updateQuestion({
            id: editForm._id,
            data: {
                questionText: editForm.questionText,
                options: editForm.options,
                correctAnswer: editForm.correctAnswer,
                isTraitBased
            }
        }));
        setEditForm(null);
        setViewMode('bank');
    };

    return (
        <div className="min-h-screen bg-slate-100/70 flex flex-col font-sans text-slate-600 antialiased selection:bg-indigo-600 selection:text-white">

            <SuccessModal
                isOpen={showSuccessModal}
                onClose={handleCloseSuccess}
                message={successPrompt.title}
                subMessage={successPrompt.nextStep}
                buttonText={successPrompt.buttonText}
            />

            <main className="flex-1 w-full max-w-[1500px] mx-auto py-4 px-4">
                <div className="grid grid-cols-12 gap-4 items-start">

                    {/* Persistent left navigation panel */}
                    <aside className="col-span-12 lg:col-span-3 lg:sticky lg:top-0 bg-white border border-slate-100 rounded-3xl p-3.5 space-y-2 shadow-sm shadow-slate-100/30">
                        <SidebarStep
                            step="01" title="Exam" icon={Database}
                            currentLabel={activeExam?.examType}
                            placeholder="No exam selected"
                            isCurrent={!activeExamId}
                            onClick={() => { setActiveExamId(''); setActiveSectionId(''); setActiveChapterId(''); }}
                        />
                        <SidebarStep
                            step="02" title="Section" icon={Layers}
                            currentLabel={activeSection?.sectionName}
                            placeholder={activeExamId ? 'No section selected' : 'Select an exam first'}
                            isCurrent={!!activeExamId && !activeSectionId}
                            disabled={!activeExamId}
                            onClick={() => { setActiveSectionId(''); setActiveChapterId(''); }}
                        />
                        <SidebarStep
                            step="03" title="Chapter" icon={ScrollText}
                            currentLabel={activeChapter?.chapterName}
                            placeholder={activeSectionId ? 'No chapter selected' : 'Select a section first'}
                            isCurrent={!!activeSectionId && !activeChapterId}
                            disabled={!activeSectionId}
                            onClick={() => setActiveChapterId('')}
                        />
                    </aside>

                    {/* Main working panel */}
                    <div className="col-span-12 lg:col-span-9 space-y-5">
                        {!activeExamId ? (
                            <DataTable
                                title="All Exams"
                                addLabel="New Exam"
                                onAdd={() => openCreateExam()}
                                items={examTypes}
                                onView={(item) => selectExam(item._id)}
                                onEdit={openCreateExam}
                                onDelete={(id) => { if (window.confirm('Delete this exam type? This will affect all related data.')) dispatch(deleteExamType(id)); }}
                                emptyText="No exams registered yet — create your first one"
                                columns={[
                                    { header: 'Class', render: item => <span className="px-3 py-1 rounded-lg text-[10px] font-black uppercase bg-slate-100 text-slate-500">{item.className || 'N/A'}</span> },
                                    { header: 'Exam Name', render: item => (
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-slate-50 text-slate-400"><Database size={14} /></div>
                                            <span className="text-xs font-bold text-slate-700">{item.examType || 'Untitled'}</span>
                                        </div>
                                    ) },
                                    { header: 'Language', render: item => <span className="text-[10px] font-semibold text-slate-400 uppercase">{item.language || 'Standard'}</span> },
                                    { header: 'Registered', render: item => (
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                                            <Calendar size={12} strokeWidth={2.5} /> {fmtDate(item.createdAt)}
                                        </div>
                                    ) }
                                ]}
                            />
                        ) : !activeSectionId ? (
                            <DataTable
                                title="Sections"
                                addLabel="New Section"
                                onAdd={() => openCreateSection()}
                                items={filteredSections}
                                onView={(item) => selectSection(item._id)}
                                onEdit={openCreateSection}
                                onDelete={(id) => { if (window.confirm('Delete this section? This will affect all related chapters.')) dispatch(deleteSection(id)); }}
                                emptyText="No sections yet for this exam — create one to continue"
                                contextBar={
                                    <div className="flex flex-wrap items-center gap-3 px-5 py-3 bg-indigo-50/60 border border-indigo-100 rounded-xl">
                                        <span className="flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest shrink-0">
                                            <Database size={12} /> Managing sections for:
                                        </span>
                                        <select
                                            value={activeExamId}
                                            onChange={(e) => selectExam(e.target.value)}
                                            className="px-3 py-1.5 bg-white border border-indigo-100 rounded-lg text-[10px] font-black text-indigo-600 outline-none cursor-pointer"
                                        >
                                            {examTypes.map(et => <option key={et._id} value={et._id}>{et.examType}</option>)}
                                        </select>
                                        <span className="text-[10px] font-bold text-indigo-400 ml-auto">
                                            {filteredSections.length} section{filteredSections.length !== 1 ? 's' : ''} created so far — add as many as this exam needs
                                        </span>
                                    </div>
                                }
                                columns={[
                                    { header: 'Section Name', render: item => (
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-slate-50 text-slate-400"><Layers size={14} /></div>
                                            <span className="text-xs font-bold text-slate-700">{item.sectionName || 'Untitled'}</span>
                                        </div>
                                    ) },
                                    { header: 'Chapters', render: item => {
                                        const count = chapters.filter(c => (c.section?._id || c.section) === item._id).length;
                                        return <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">{count} chapter{count !== 1 ? 's' : ''}</span>;
                                    } },
                                    { header: 'Registered', render: item => (
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                                            <Calendar size={12} strokeWidth={2.5} /> {fmtDate(item.createdAt)}
                                        </div>
                                    ) }
                                ]}
                            />
                        ) : !activeChapterId ? (
                            <DataTable
                                title="Chapters"
                                addLabel="New Chapter"
                                onAdd={() => openCreateChapter()}
                                items={filteredChapters}
                                onView={(item) => selectChapter(item._id)}
                                onEdit={openCreateChapter}
                                onDelete={(id) => { if (window.confirm('Delete this chapter? This will affect all related questions.')) dispatch(deleteChapter(id)); }}
                                emptyText="No chapters yet for this section — create one to add questions"
                                contextBar={
                                    <div className="flex flex-wrap items-center gap-3 px-5 py-3 bg-indigo-50/60 border border-indigo-100 rounded-xl">
                                        <span className="flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest shrink-0">
                                            <ScrollText size={12} /> Creating chapters for:
                                        </span>
                                        <select
                                            value={activeExamId}
                                            onChange={(e) => selectExam(e.target.value)}
                                            className="px-3 py-1.5 bg-white border border-indigo-100 rounded-lg text-[10px] font-black text-indigo-600 outline-none cursor-pointer"
                                        >
                                            {examTypes.map(et => <option key={et._id} value={et._id}>{et.examType}</option>)}
                                        </select>
                                        <ChevronRight size={10} className="text-indigo-300" />
                                        <select
                                            value={activeSectionId}
                                            onChange={(e) => selectSection(e.target.value)}
                                            className="px-3 py-1.5 bg-white border border-indigo-100 rounded-lg text-[10px] font-black text-indigo-600 outline-none cursor-pointer"
                                        >
                                            <option value="">Select Section</option>
                                            {filteredSections.map(s => <option key={s._id} value={s._id}>{s.sectionName}</option>)}
                                        </select>
                                        <span className="text-[10px] font-bold text-indigo-400 ml-auto">
                                            Pick any section above to manage its chapters — no need to go back
                                        </span>
                                    </div>
                                }
                                columns={[
                                    { header: 'Chapter Name', render: item => (
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-slate-50 text-slate-400"><ScrollText size={14} /></div>
                                            <span className="text-xs font-bold text-slate-700">{item.chapterName || 'Untitled'}</span>
                                        </div>
                                    ) },
                                    { header: 'Order', render: item => <span className="text-[10px] font-black text-slate-400">#{item.sequence || '-'}</span> },
                                    { header: 'Questions', render: item => {
                                        const count = questions.filter(q => (q.chapter?._id || q.chapter) === item._id).length;
                                        return <span className="text-[10px] font-black text-violet-600 bg-violet-50 px-2.5 py-1 rounded-lg">{count} question{count !== 1 ? 's' : ''}</span>;
                                    } },
                                    { header: 'Registered', render: item => (
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                                            <Calendar size={12} strokeWidth={2.5} /> {fmtDate(item.createdAt)}
                                        </div>
                                    ) }
                                ]}
                            />
                        ) : (
                            <>
                                {/* Context switcher: pick which exam / section / chapter you're working on */}
                                <div className="flex flex-wrap items-center gap-2 bg-gradient-to-r from-slate-50 via-white to-slate-50/50 border border-slate-100 rounded-xl px-4 py-2.5 shadow-sm">
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest shrink-0">Working on:</span>
                                    <select
                                        value={activeExamId}
                                        onChange={(e) => selectExam(e.target.value)}
                                        className="px-2 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[9px] font-black text-indigo-600 outline-none cursor-pointer"
                                    >
                                        <option value="">Select Exam</option>
                                        {examTypes.map(et => <option key={et._id} value={et._id}>{et.examType}</option>)}
                                    </select>
                                    <ChevronRight size={8} className="text-slate-300 animate-pulse" />
                                    <select
                                        value={activeSectionId}
                                        onChange={(e) => selectSection(e.target.value)}
                                        className="px-2 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[9px] font-black text-indigo-600 outline-none cursor-pointer"
                                        disabled={!activeExamId}
                                    >
                                        <option value="">Select Section</option>
                                        {filteredSections.map(s => <option key={s._id} value={s._id}>{s.sectionName}</option>)}
                                    </select>
                                    <ChevronRight size={8} className="text-slate-300 animate-pulse" />
                                    <select
                                        value={activeChapterId}
                                        onChange={(e) => selectChapter(e.target.value)}
                                        className="px-2 py-1 bg-slate-900 text-white border border-slate-800 rounded-lg text-[9px] font-black outline-none cursor-pointer"
                                        disabled={!activeSectionId}
                                    >
                                        <option value="">Select Chapter</option>
                                        {filteredChapters.map(c => <option key={c._id} value={c._id}>{c.chapterName}</option>)}
                                    </select>
                                </div>

                                {/* Tab switcher: Question List <-> Editor */}
                                <div className="flex items-center gap-1 bg-slate-50 border border-slate-100 rounded-lg p-0.5 w-fit">
                                    <button
                                        onClick={() => setViewMode('bank')}
                                        className={`px-4 py-1.5 rounded-md text-[9px] font-black uppercase tracking-widest transition-all ${
                                            viewMode === 'bank'
                                                ? 'bg-white text-indigo-600 shadow-sm'
                                                : 'text-slate-400 hover:text-slate-600'
                                        }`}
                                    >
                                        Question List
                                    </button>
                                    <button
                                        onClick={() => { if (viewMode !== 'studio') openComposerForNew(); }}
                                        className={`px-4 py-1.5 rounded-md text-[9px] font-black uppercase tracking-widest transition-all ${
                                            viewMode === 'studio'
                                                ? 'bg-white text-indigo-600 shadow-sm'
                                                : 'text-slate-400 hover:text-slate-600'
                                        }`}
                                    >
                                        Editor
                                    </button>
                                </div>

                            <AnimatePresence mode="wait">
                                {viewMode === 'bank' ? (
                                    <motion.div key="bank" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3.5 pb-24">
                                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                            <div>
                                                <h2 className="text-xl font-black text-slate-900 tracking-tight">Question List</h2>
                                                <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-[0.2em]">{activeChapter?.chapterName}</p>
                                            </div>
                                            <div className="flex items-center gap-2.5">
                                                {activeChapterQuestions.length > 0 && (
                                                    <span className="text-[9px] font-black text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 uppercase tracking-widest">{activeChapterQuestions.length} VERIFIED QUESTIONS</span>
                                                )}
                                                <button
                                                    onClick={openComposerForNew}
                                                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-md shadow-indigo-100"
                                                >
                                                    <PlusCircle size={12} /> Add Question
                                                </button>
                                            </div>
                                        </div>

                                        {activeChapterQuestions.length === 0 ? (
                                            <div className="py-16 flex flex-col items-center justify-center text-center bg-white border border-dashed border-slate-200 rounded-[24px]">
                                                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-4 animate-pulse">
                                                    <FileQuestion size={22} />
                                                </div>
                                                <h3 className="text-sm font-black text-slate-900 tracking-tight">No questions yet</h3>
                                                <p className="text-[10px] font-bold text-slate-400 mt-1 max-w-xs leading-relaxed">
                                                    This chapter is empty. Add your first question to start building the quiz.
                                                </p>
                                                <button
                                                    onClick={openComposerForNew}
                                                    className="mt-6 flex items-center gap-1.5 px-5 py-2.5 bg-slate-900 text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg shadow-slate-100"
                                                >
                                                    <PlusCircle size={14} /> Add Question
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                {activeChapterQuestions.map((q, idx) => {
                                                    const isExpanded = !!expandedQuestions[q._id];
                                                    return (
                                                        <div 
                                                            key={q._id} 
                                                            className={`border rounded-xl overflow-hidden transition-all duration-300 ${
                                                                isExpanded 
                                                                    ? 'bg-gradient-to-br from-indigo-50/20 via-white to-violet-50/10 border-indigo-200 shadow-md shadow-indigo-100/5' 
                                                                    : 'bg-white border-slate-100 hover:border-indigo-100 shadow-sm hover:shadow-md hover:shadow-slate-100/40'
                                                            }`}
                                                        >
                                                            {/* Accordion Header */}
                                                            <div 
                                                                onClick={() => setExpandedQuestions(prev => ({ ...prev, [q._id]: !prev[q._id] }))}
                                                                className="flex items-center justify-between py-2.5 px-3.5 cursor-pointer hover:bg-slate-50/30 transition-colors"
                                                            >
                                                                <div className="flex items-center gap-3.5 flex-1 min-w-0">
                                                                    <div className={`w-7 h-7 rounded-md flex items-center justify-center font-black text-xs shrink-0 transition-colors ${
                                                                        isExpanded ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100/30' : 'bg-slate-900 text-white'
                                                                    }`}>
                                                                        #{idx + 1}
                                                                    </div>
                                                                    <div 
                                                                        className="text-xs font-bold text-slate-700 truncate prose prose-xs max-w-full"
                                                                        dangerouslySetInnerHTML={{ __html: q.questionText }}
                                                                    />
                                                                </div>
                                                                <div className="flex items-center gap-1.5 shrink-0">
                                                                    <button 
                                                                        onClick={(e) => { e.stopPropagation(); loadQuestionForEdit(q); }} 
                                                                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                                                        title="Edit"
                                                                    >
                                                                        <Pencil size={12} />
                                                                    </button>
                                                                    <button 
                                                                        onClick={(e) => { e.stopPropagation(); if (window.confirm('Delete this question?')) dispatch(deleteQuestion(q._id)); }} 
                                                                        className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                                                                        title="Delete"
                                                                    >
                                                                        <Trash2 size={12} />
                                                                    </button>
                                                                    <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                                                                </div>
                                                            </div>

                                                            {/* Accordion Content */}
                                                            <AnimatePresence initial={false}>
                                                                {isExpanded && (
                                                                    <motion.div
                                                                        initial={{ height: 0, opacity: 0 }}
                                                                        animate={{ height: 'auto', opacity: 1 }}
                                                                        exit={{ height: 0, opacity: 0 }}
                                                                        transition={{ duration: 0.2 }}
                                                                        className="border-t border-slate-50 bg-slate-50/10"
                                                                    >
                                                                        <div className="p-3 pt-1.5">
                                                                            <div className="grid grid-cols-2 gap-1.5">
                                                                                {['A', 'B', 'C', 'D'].map(k => (
                                                                                    <div 
                                                                                        key={k} 
                                                                                        className={`py-1.5 px-2.5 rounded-lg border text-[9px] font-black flex items-center gap-2 transition-all ${
                                                                                            q.correctAnswer === k 
                                                                                                ? 'bg-gradient-to-r from-indigo-600 to-violet-600 border-indigo-600 text-white shadow-md shadow-indigo-200/30' 
                                                                                                : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
                                                                                        }`}
                                                                                    >
                                                                                        <span className={`w-4 h-4 rounded flex items-center justify-center font-bold text-[8px] transition-colors ${
                                                                                            q.correctAnswer === k ? 'bg-white/20 text-white' : 'bg-slate-50 text-slate-500'
                                                                                        }`}>{k}</span>
                                                                                        <div className="truncate" dangerouslySetInnerHTML={{ __html: q.options[k]?.text || '---' }} />
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    </motion.div>
                                                                )}
                                                            </AnimatePresence>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </motion.div>
                                ) : (
                                    <motion.div key="studio" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3.5">

                                        <div className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center justify-between shadow-sm">
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => setViewMode('bank')}
                                                    className="p-1.5 rounded-lg transition-all bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                                                    title="Back to question list"
                                                >
                                                    <ArrowLeft size={14} />
                                                </button>
                                                <div>
                                                    <h3 className="text-xs font-bold text-slate-800">{editForm ? 'Edit Question' : 'Question Composer'}</h3>
                                                    <p className="text-[10px] text-slate-400 mt-0.5">
                                                        {editForm ? 'Update this question, then save your changes.' : 'Build several questions at once.'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {activeExamId && (
                                                    <span className={`px-2.5 py-1 rounded-md text-[8px] font-black uppercase tracking-widest border ${isAptitudeClass ? 'bg-violet-50 text-violet-600 border-violet-200' : 'bg-emerald-50 text-emerald-600 border-emerald-200'}`}>
                                                        {isAptitudeClass ? 'CAREER APTITUDE' : 'IQ TEST'}
                                                    </span>
                                                )}
                                                <label className="flex items-center gap-1.5 cursor-pointer bg-white px-2 py-1 border border-slate-200 rounded-md shadow-sm hover:bg-slate-50 transition-colors">
                                                    <input
                                                        type="checkbox"
                                                        checked={isTraitBased}
                                                        onChange={(e) => setIsTraitBased(e.target.checked)}
                                                        className="w-3.5 h-3.5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                                                    />
                                                    <span className="text-[10px] font-bold text-slate-700">Trait-Based</span>
                                                </label>
                                            </div>
                                        </div>

                                        {editForm ? (
                                            <form onSubmit={handleUpdateQuestion} className="space-y-3.5">
                                                <QuestionBlock
                                                    index={1}
                                                    value={editForm}
                                                    onTextChange={(val) => updateEditField('questionText', val)}
                                                    onOptionTextChange={(k, val) => updateEditOption(k, 'text', val)}
                                                    onOptionTraitChange={(k, val) => updateEditOption(k, 'traitMapping', val)}
                                                    onCorrectChange={(k) => updateEditField('correctAnswer', k)}
                                                    isTraitBased={isTraitBased}
                                                    activePair={activePair}
                                                    removable={false}
                                                />
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        type="submit"
                                                        disabled={loading}
                                                        className="px-6 py-2.5 bg-slate-900 text-white rounded-lg font-black text-[9px] uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all flex items-center gap-2.5 shadow-md shadow-slate-100 group cursor-pointer"
                                                    >
                                                        {loading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Update Question <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={cancelEdit}
                                                        className="px-4 py-2.5 bg-amber-50 text-amber-600 border border-amber-200 rounded-lg font-black text-[9px] uppercase tracking-widest hover:bg-amber-100 transition-all cursor-pointer"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </form>
                                        ) : (
                                            <form onSubmit={handleSaveAll} className="space-y-3.5">
                                                {batch.map((q, i) => (
                                                    <QuestionBlock
                                                        key={q.localId}
                                                        index={i + 1}
                                                        value={q}
                                                        onTextChange={(val) => updateBlockField(q.localId, 'questionText', val)}
                                                        onOptionTextChange={(k, val) => updateBlockOption(q.localId, k, 'text', val)}
                                                        onOptionTraitChange={(k, val) => updateBlockOption(q.localId, k, 'traitMapping', val)}
                                                        onCorrectChange={(k) => updateBlockField(q.localId, 'correctAnswer', k)}
                                                        isTraitBased={isTraitBased}
                                                        activePair={activePair}
                                                        removable={batch.length > 1}
                                                        onRemove={() => removeBlock(q.localId)}
                                                    />
                                                ))}

                                                <div className="flex flex-wrap items-center gap-3 pt-1">
                                                    <button
                                                        type="button"
                                                        onClick={addBlock}
                                                        className="flex items-center gap-1.5 px-4 py-2.5 bg-white border border-dashed border-slate-200 text-slate-400 rounded-lg text-[9px] font-black uppercase tracking-widest hover:border-indigo-300 hover:text-indigo-600 transition-all cursor-pointer"
                                                    >
                                                        <PlusCircle size={14} /> Add Another Question
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        disabled={batchSaving}
                                                        className="px-6 py-2.5 bg-slate-900 text-white rounded-lg font-black text-[9px] uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all flex items-center gap-2.5 shadow-md shadow-slate-100 group cursor-pointer"
                                                    >
                                                        {batchSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save {batch.length} Question{batch.length > 1 ? 's' : ''} <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                                                    </button>
                                                </div>
                                            </form>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            </>
                        )}
                    </div>
                </div>
            </main>

            <QuickCreateModal isOpen={modal.open} onClose={() => setModal({ ...modal, open: false })} title={modal.title} icon={modal.icon} fields={modal.fields} onSubmit={modal.onSubmit} loading={loading} contextLabel={modal.contextLabel} contextValue={modal.contextValue} />
        </div>
    );
};

const QuickCreateModal = ({ isOpen, onClose, title, icon: Icon, fields, onSubmit, loading, contextLabel, contextValue }) => {
    const [formData, setFormData] = useState({});
    useEffect(() => { if (isOpen) { const defaults = {}; fields.forEach(f => { if (f.name === 'sequence') defaults[f.name] = fields.length; else if (f.value) defaults[f.name] = f.value; }); setFormData(defaults); } }, [isOpen, fields]);
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/10 backdrop-blur-md">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-[32px] p-10 max-w-sm w-full shadow-2xl border border-white">
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-50">
                    <div className="flex items-center gap-4 text-slate-900"><div className="p-3 bg-slate-900 text-white rounded-2xl"><Icon size={20} /></div><h3 className="text-sm font-black uppercase tracking-tight">{title}</h3></div>
                    <button onClick={onClose} className="p-1 hover:bg-slate-50 text-slate-400 rounded-full transition-colors"><X size={20} /></button>
                </div>
                {contextValue && <div className="mb-8 p-5 bg-slate-50 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><div className="w-1.5 h-1.5 bg-indigo-600 rounded-full" /> {contextValue}</div>}
                <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="space-y-5">
                    {fields.filter(f => !f.hidden).map(f => (
                        <div key={f.name} className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{f.label}</label>
                            {f.type === 'select' ? (
                                <select className="w-full px-5 py-3 bg-white border border-slate-100 rounded-xl text-sm font-bold outline-none h-12 focus:border-indigo-600 transition-all appearance-none" onChange={(e) => setFormData(p => ({ ...p, [f.name]: e.target.value }))} required={f.required} value={formData[f.name] || ''}>
                                    <option value="">Select Option</option>{f.options.map(o => <option key={o.id || o} value={o.id || o}>{o.label || o}</option>)}
                                </select>
                            ) : (
                                <input type={f.type || 'text'} className="w-full px-5 py-3 bg-white border border-slate-100 rounded-xl text-sm font-bold outline-none h-12 focus:border-indigo-600 transition-all placeholder:text-slate-200" onChange={(e) => setFormData(p => ({ ...p, [f.name]: e.target.value }))} required={f.required} value={formData[f.name] || ''} />
                            )}
                        </div>
                    ))}
                    <button type="submit" disabled={loading} className="w-full py-4 mt-6 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.4em] hover:bg-indigo-600 transition-all flex items-center justify-center gap-3 shadow-xl">
                        {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} Save Record
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default QuizSet;