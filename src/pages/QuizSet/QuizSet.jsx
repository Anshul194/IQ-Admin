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
    MoreHorizontal, Download, Share2, Calendar
} from 'lucide-react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

import {
    fetchExamTypes, createExamType,
    fetchSections, createSection,
    fetchChapters, createChapter,
    fetchQuestions, createQuestion, deleteQuestion,
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

// --- Highlighted Action Row ---
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

const CompactRow = ({ title, items, activeId, onSelect, onAdd, icon: Icon, labelKey, typeLabel }) => (
    <div className="w-full space-y-4">
        <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
                <div className="w-1.5 h-6 bg-slate-900 rounded-full" />
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">{title}</h4>
            </div>
            <button
                onClick={onAdd}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg shadow-indigo-100"
            >
                <PlusSquare size={14} /> New {typeLabel}
            </button>
        </div>

        <div className="bg-white border border-slate-100 rounded-[24px] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-50">
                            <th className="px-6 py-4 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Class</th>
                            <th className="px-6 py-4 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">{typeLabel} Name</th>
                            <th className="px-6 py-4 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Metadata</th>
                            <th className="px-6 py-4 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Registered</th>
                            <th className="px-6 py-4 text-right text-[9px] font-black text-slate-400 uppercase tracking-widest">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {items.length > 0 ? items.map((item, idx) => (
                            <tr
                                key={item._id || idx}
                                onClick={() => onSelect(item._id)}
                                className={`hover:bg-slate-50/80 transition-colors cursor-pointer group ${activeId === item._id ? 'bg-indigo-50/40' : ''}`}
                            >
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${activeId === item._id ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                        {item.className || 'N/A'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${activeId === item._id ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-50 text-slate-400'}`}>
                                            <Icon size={14} />
                                        </div>
                                        <span className={`text-xs font-bold ${activeId === item._id ? 'text-indigo-600' : 'text-slate-700'}`}>
                                            {item[labelKey] || 'Untitled'}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="text-[10px] font-semibold text-slate-400 uppercase">{item.language || item.sequence || 'Standard'}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                                        <Calendar size={12} strokeWidth={2.5} />
                                        {item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '---'}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeId === item._id
                                            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-100'
                                            : 'bg-slate-900 text-white opacity-0 group-hover:opacity-100 hover:bg-indigo-600'
                                            }`}
                                    >
                                        {activeId === item._id ? 'Active' : 'Next Step'}
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="5" className="px-6 py-20 text-center text-[10px] font-bold text-slate-300 uppercase tracking-widest italic">
                                    No node records available in this sequence
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
);

const QuizSet = () => {
    const dispatch = useDispatch();
    const { examTypes, sections, chapters, questions, loading, success, lastCreatedId } = useSelector(state => state.quiz);

    const [viewMode, setViewMode] = useState('studio');
    const [activeExamId, setActiveExamId] = useState('');
    const [activeSectionId, setActiveSectionId] = useState('');
    const [activeChapterId, setActiveChapterId] = useState('');
    const [createType, setCreateType] = useState('exam');
    const [isTraitBased, setIsTraitBased] = useState(false);
    const [modal, setModal] = useState({ open: false, title: '', fields: [], icon: null, onSubmit: null, contextLabel: '', contextValue: '' });
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [successPrompt, setSuccessPrompt] = useState({ title: '', nextStep: '' });

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

    useEffect(() => {
        if (success && lastCreatedId && createType) {
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
                nextStep = 'Architecture complete! You can now start adding core questions to this chapter.';
            } else if (createType === 'question') {
                title = 'Question Secured';
                nextStep = 'Node successfully added to the vault. Continue adding more or switch to records view.';
            }

            setSuccessPrompt({
                title,
                nextStep,
                buttonText: createType === 'question' ? 'Add Another Question' : 'Proceed to Next Step'
            });
            setShowSuccessModal(true);
            setModal(prev => ({ ...prev, open: false }));
            setCreateType(null);
        }
    }, [success, lastCreatedId, createType]);

    const handleCloseSuccess = () => {
        setShowSuccessModal(false);
        dispatch(resetQuizState());
    };

    const currentStep = !activeExamId ? 1 : !activeSectionId ? 2 : !activeChapterId ? 3 : 4;

    const goBack = () => {
        if (activeChapterId) setActiveChapterId('');
        else if (activeSectionId) setActiveSectionId('');
        else if (activeExamId) setActiveExamId('');
    };

    const openCreateExam = () => setModal({
        open: true, icon: Database, title: 'Exam Metadata',
        fields: [{ name: 'examType', label: 'Name', required: true }, { name: 'className', label: 'Class', type: 'select', options: ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'], required: true }, { name: 'language', label: 'Language', type: 'select', options: ['Hindi', 'English', 'Marathi'], required: true }],
        onSubmit: (data) => { setCreateType('exam'); dispatch(createExamType(data)); }
    });
    const openCreateSection = () => setModal({
        open: true, icon: Layers, title: 'Create Section',
        fields: [{ name: 'sectionName', label: 'Section Label', required: true }],
        contextLabel: 'Exam Context', contextValue: activeExam?.examType,
        onSubmit: (data) => { setCreateType('section'); dispatch(createSection({ ...data, examType: activeExamId })); }
    });
    const openCreateChapter = () => setModal({
        open: true, icon: ScrollText, title: 'Create Chapter',
        fields: [{ name: 'chapterName', label: 'Chapter Heading', required: true }, { name: 'sequence', label: 'Order Index', type: 'number', required: true }],
        contextLabel: 'Section Context', contextValue: activeSection?.sectionName,
        onSubmit: (data) => { setCreateType('chapter'); dispatch(createChapter({ ...data, sequence: Number(data.sequence) || 1, examType: activeExamId, section: activeSectionId })); }
    });

    const [qForm, setQForm] = useState({ questionText: '', options: { A: { text: '', traitMapping: 'NONE' }, B: { text: '', traitMapping: 'NONE' }, C: { text: '', traitMapping: 'NONE' }, D: { text: '', traitMapping: 'NONE' } }, correctAnswer: 'A' });
    const handleQSubmit = (e) => {
        e.preventDefault();
        setCreateType('question');

        const payload = { ...qForm };
        // Auto-map traits based on exact strict requirements (Option A->Career 1, etc.)
        if (isTraitBased) {
            payload.options.A.traitMapping = 'CAREER_1';
            payload.options.B.traitMapping = 'CAREER_2';
            payload.options.C.traitMapping = 'BOTH';
            payload.options.D.traitMapping = 'NONE';
        }

        dispatch(createQuestion({ ...payload, isTraitBased, examType: activeExamId, section: activeSectionId, chapter: activeChapterId }));
    };
    useEffect(() => { if (success && !showSuccessModal) setQForm({ questionText: '', options: { A: { text: '', traitMapping: 'NONE' }, B: { text: '', traitMapping: 'NONE' }, C: { text: '', traitMapping: 'NONE' }, D: { text: '', traitMapping: 'NONE' } }, correctAnswer: 'A' }); }, [success, showSuccessModal]);

    return (
        <div className="min-h-screen bg-slate-50/20 flex flex-col font-sans text-slate-600 antialiased selection:bg-indigo-600 selection:text-white">

            <SuccessModal
                isOpen={showSuccessModal}
                onClose={handleCloseSuccess}
                message={successPrompt.title}
                subMessage={successPrompt.nextStep}
                buttonText={successPrompt.buttonText}
            />

            {/* Clean Header */}
            <header className="sticky top-0 z-[50] bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-3">
                <div className="max-w-[1400px] mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center shadow-lg shadow-indigo-100"><LayoutPanelLeft size={16} /></div>
                        <h1 className="text-sm font-bold text-slate-900 uppercase tracking-tight">Quiz Studio</h1>
                    </div>

                    <div className="hidden lg:flex items-center gap-1.5 bg-slate-50 border border-slate-100 rounded-lg p-1">
                        {[
                            { label: 'Exam', val: activeExam?.examType, active: activeExamId, reset: () => { setActiveExamId(''); setActiveSectionId(''); setActiveChapterId(''); } },
                            { label: 'Section', val: activeSection?.sectionName, active: activeSectionId, reset: () => { setActiveSectionId(''); setActiveChapterId(''); } },
                            { label: 'Chapter', val: activeChapter?.chapterName, active: activeChapterId, reset: () => { setActiveChapterId(''); } }
                        ].map((s, idx) => (
                            <React.Fragment key={idx}>
                                <button onClick={s.active ? s.reset : undefined} className={`px-4 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all ${s.active ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 opacity-50'}`}>
                                    {s.val || s.label}
                                </button>
                                {idx < 2 && <span className="text-slate-200 text-[10px]">/</span>}
                            </React.Fragment>
                        ))}
                    </div>

                    <div className="flex items-center gap-2">
                        <button onClick={() => setViewMode(viewMode === 'bank' ? 'studio' : 'bank')} className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-all">
                            {viewMode === 'bank' ? <Sliders size={14} /> : <ListChecks size={14} />} {viewMode === 'bank' ? 'EDITOR' : 'QUESTION LIST'}
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-1 w-full max-w-[1400px] mx-auto py-10 px-8">

                {!activeChapterId && viewMode === 'studio' ? (
                    <div className="space-y-12 animate-in fade-in duration-500">
                        {currentStep === 1 && (
                            <CompactRow title="Step 01 / Category" typeLabel="EXAM" items={examTypes} activeId={activeExamId} onSelect={setActiveExamId} onAdd={openCreateExam} icon={Database} labelKey="examType" />
                        )}

                        {activeExamId && currentStep === 2 && (
                            <div className="space-y-6">
                                <button onClick={goBack} className="flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-indigo-600 uppercase tracking-widest transition-all group">
                                    <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Category Selection
                                </button>
                                <CompactRow title="Step 02 / Territory" typeLabel="SECTION" items={filteredSections} activeId={activeSectionId} onSelect={setActiveSectionId} onAdd={openCreateSection} icon={Layers} labelKey="sectionName" />
                            </div>
                        )}

                        {activeSectionId && currentStep === 3 && (
                            <div className="space-y-6">
                                <button onClick={goBack} className="flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-indigo-600 uppercase tracking-widest transition-all group">
                                    <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Sections
                                </button>
                                <CompactRow title="Step 03 / Module" typeLabel="CHAPTER" items={filteredChapters} activeId={activeChapterId} onSelect={setActiveChapterId} onAdd={openCreateChapter} icon={ScrollText} labelKey="chapterName" />
                            </div>
                        )}
                    </div>
                ) : (
                    <AnimatePresence mode="wait">
                        {viewMode === 'studio' ? (
                            <motion.div key="studio" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                                <button onClick={goBack} className="flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-indigo-600 uppercase tracking-widest transition-all group">
                                    <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Exit Editor / Return to Chapters
                                </button>

                                <div className="grid grid-cols-12 gap-10 items-start">
                                    {/* Centered Form Panel */}
                                    <div className="col-span-12 lg:col-span-9 space-y-8 bg-white border border-slate-100 rounded-2xl p-10 shadow-sm">
                                        <div className="flex items-center justify-between border-b border-slate-50 pb-8">
                                            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">
                                                <span className="text-indigo-600">{activeExam?.examType}</span> <ChevronRight size={10} /> <span className="text-indigo-600">{activeSection?.sectionName}</span> <ChevronRight size={10} /> <span className="text-slate-900 border-b-2 border-indigo-600 pb-0.5">{activeChapter?.chapterName}</span>
                                            </div>
                                            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black border border-emerald-100">
                                                SECURE NODE ACTIVE
                                            </div>
                                        </div>

                                        <form onSubmit={handleQSubmit} className="space-y-6">
                                            <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-100">
                                                <div>
                                                    <h3 className="text-sm font-bold text-slate-800">Question Content</h3>
                                                    <p className="text-xs text-slate-500 mt-1">Compose the question stem.</p>
                                                </div>
                                                <label className="flex items-center gap-2 cursor-pointer bg-white px-3 py-1.5 border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 transition-colors">
                                                    <input
                                                        type="checkbox"
                                                        checked={isTraitBased}
                                                        onChange={(e) => setIsTraitBased(e.target.checked)}
                                                        className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                                                    />
                                                    <span className="text-xs font-bold text-slate-700">Trait-Based (Career/Personality)</span>
                                                </label>
                                            </div>
                                            <SimpleEditor
                                                value={qForm.questionText}
                                                onChange={(val) => setQForm(p => ({ ...p, questionText: val }))}
                                                placeholder="Enter your question here..."
                                            />

                                            <div className="space-y-6">
                                                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                                    <div className="w-1 h-3 bg-indigo-600 rounded-full" /> Choice Grid
                                                </label>
                                                <div className="bg-slate-50/50 p-2 rounded-2xl space-y-2 border border-slate-100">
                                                    {['A', 'B', 'C', 'D'].map(k => (
                                                        <div key={k} className={`flex items-start gap-4 bg-white p-3 rounded-xl border transition-all ${!isTraitBased && qForm.correctAnswer === k ? 'border-indigo-600 ring-4 ring-indigo-50 shadow-sm' : 'border-slate-100 hover:border-slate-200'}`}>
                                                            {!isTraitBased && (
                                                                <div className="flex flex-col items-center gap-3 py-2 w-16 shrink-0 border-r border-slate-50">
                                                                    <span className={`text-sm font-black ${qForm.correctAnswer === k ? 'text-indigo-600' : 'text-slate-300'}`}>{k}</span>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => setQForm(p => ({ ...p, correctAnswer: k }))}
                                                                        className={`w-7 h-7 rounded-lg transition-all border-2 flex items-center justify-center ${qForm.correctAnswer === k
                                                                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg'
                                                                            : 'bg-white border-slate-100 text-slate-100 hover:text-indigo-400 hover:border-indigo-100'
                                                                            }`}
                                                                    >
                                                                        <Check size={16} strokeWidth={4} />
                                                                    </button>
                                                                </div>
                                                            )}
                                                            <div className="flex-1 min-w-0 flex flex-col gap-2">
                                                                <SimpleEditor value={qForm.options[k].text} onChange={(val) => setQForm(p => ({ ...p, options: { ...p.options, [k]: { ...p.options[k], text: val } } }))} placeholder={`Response choice ${k}...`} minHeight="60px" />

                                                                {isTraitBased && (
                                                                    <div className="flex items-center mt-1">
                                                                        {(() => {
                                                                            const pair = aptConfig?.careerPairs?.find(p => p.chapterSequence === activeChapter?.sequence);
                                                                            const c1 = pair?.career1 || 'First Career';
                                                                            const c2 = pair?.career2 || 'Second Career';

                                                                            let badgeText = '';
                                                                            let badgeColor = '';
                                                                            if (k === 'A') { badgeText = `Aura/Points → ${c1} (+1)`; badgeColor = 'bg-blue-50 text-blue-600 border-blue-200'; }
                                                                            else if (k === 'B') { badgeText = `Aura/Points → ${c2} (+1)`; badgeColor = 'bg-indigo-50 text-indigo-600 border-indigo-200'; }
                                                                            else if (k === 'C') { badgeText = `Aura/Points → BOTH: ${c1} & ${c2} (+1 each)`; badgeColor = 'bg-purple-50 text-purple-600 border-purple-200'; }
                                                                            else if (k === 'D') { badgeText = `Does not award points.`; badgeColor = 'bg-slate-50 text-slate-500 border-slate-200'; }

                                                                            return (
                                                                                <span className={`text-[10px] font-bold uppercase tracking-wide px-3 py-1.5 rounded-md border ${badgeColor}`}>
                                                                                    {badgeText}
                                                                                </span>
                                                                            );
                                                                        })()}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="pt-6">
                                                <button
                                                    type="submit"
                                                    disabled={loading}
                                                    className="px-10 py-4 bg-slate-900 text-white rounded-xl font-black text-[11px] uppercase tracking-[0.3em] hover:bg-indigo-600 transition-all flex items-center gap-4 shadow-xl shadow-slate-100 group"
                                                >
                                                    {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} Secure Progress <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                                </button>
                                            </div>
                                        </form>
                                    </div>

                                    {/* Sidebar Bank */}
                                    <div className="hidden lg:col-span-3 lg:flex flex-col gap-8 sticky top-24">
                                        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-50 pb-4">Live Session Vault</h4>
                                            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                                                {activeChapterQuestions.map((q, idx) => (
                                                    <div key={q._id} className="p-4 bg-slate-50 border border-slate-100 rounded-xl group relative hover:bg-white hover:border-indigo-200 transition-all cursor-default">
                                                        <button onClick={() => dispatch(deleteQuestion(q._id))} className="absolute top-2 right-2 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={12} /></button>
                                                        <p className="text-[10px] font-bold text-slate-700 line-clamp-2 italic" dangerouslySetInnerHTML={{ __html: q.questionText }} />
                                                        <div className="mt-3 flex items-center gap-2">
                                                            <div className="px-1.5 py-0.5 bg-indigo-600 text-white rounded text-[8px] font-black">{q.correctAnswer}</div>
                                                            <span className="text-[8px] font-bold text-slate-300 uppercase">STORED_SEQ_0{idx + 1}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                                {activeChapterQuestions.length === 0 && <p className="text-[10px] text-slate-300 italic text-center py-10 uppercase tracking-widest">Vault Empty</p>}
                                            </div>
                                        </div>

                                        <div className="p-6 bg-slate-900 rounded-2xl text-white shadow-2xl relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-600 opacity-20 blur-3xl group-hover:opacity-40 transition-opacity" />
                                            <p className="text-[10px] font-black uppercase text-indigo-400 mb-3 tracking-widest leading-none underline decoration-indigo-400 underline-offset-4">Quality Indicator</p>
                                            <p className="text-xs font-bold leading-relaxed mb-4">You have successfully secured {activeChapterQuestions.length} nodes to the repository.</p>
                                            <div className="flex gap-1">
                                                <div className="h-1 bg-white/10 flex-1 rounded-full overflow-hidden"><div className="h-full bg-indigo-500 w-1/2" /></div>
                                                <div className="h-1 bg-white/10 flex-1 rounded-full" />
                                                <div className="h-1 bg-white/10 flex-1 rounded-full" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div key="bank" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 pb-32">
                                <button onClick={() => setViewMode('studio')} className="flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-indigo-600 uppercase tracking-widest transition-all group">
                                    <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Return to Editor / Selection
                                </button>

                                <div className="flex items-center justify-between pb-8 border-b border-slate-100">
                                    <div>
                                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Chapter Question List</h2>
                                        <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-[0.2em]">{activeChapter?.chapterName}</p>
                                    </div>
                                    <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-5 py-2 rounded-xl border border-indigo-100 uppercase tracking-widest">{activeChapterQuestions.length} VERIFIED QUESTIONS</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {activeChapterQuestions.map((q, idx) => (
                                        <div key={q._id} className="bg-white border border-slate-100 rounded-[32px] p-8 relative group hover:border-indigo-200 transition-all hover:shadow-xl hover:shadow-indigo-500/5">
                                            <button onClick={() => dispatch(deleteQuestion(q._id))} className="absolute top-8 right-8 p-2.5 bg-rose-50 text-rose-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-100"><Trash2 size={16} /></button>
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-xs">#{idx + 1}</div>
                                                <div className="h-px bg-slate-50 flex-1" />
                                            </div>
                                            <div className="text-xs font-bold text-slate-700 mb-8 prose prose-xs" dangerouslySetInnerHTML={{ __html: q.questionText }} />
                                            <div className="grid grid-cols-2 gap-3">
                                                {['A', 'B', 'C', 'D'].map(k => (
                                                    <div key={k} className={`p-3 rounded-xl border-2 text-[10px] font-black flex items-center gap-2 ${q.correctAnswer === k ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-white border-slate-50 text-slate-300'}`}>
                                                        <span className={`w-5 h-5 rounded-md flex items-center justify-center ${q.correctAnswer === k ? 'bg-white/20' : 'bg-slate-100'}`}>{k}</span>
                                                        <div className="truncate" dangerouslySetInnerHTML={{ __html: q.options[k]?.text }} />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {!activeChapterQuestions.length && <div className="py-40 text-center opacity-10 font-black uppercase tracking-[1em] text-slate-900">Repository Empty</div>}
                            </motion.div>
                        )}
                    </AnimatePresence>
                )}
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
