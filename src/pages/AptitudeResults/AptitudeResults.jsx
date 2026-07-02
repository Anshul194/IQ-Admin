import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchStudents } from '../../store/slices/studentSlice';
import { fetchExamTypes } from '../../store/slices/quizSlice';
import {
    fetchAllAptitudeResults,
    fetchAptitudeResultById,
    clearCurrentResult
} from '../../store/slices/aptitudeSlice';
import {
    Brain, Search, Users, BookOpen, ChevronRight, ChevronLeft,
    Loader2, Database, XCircle, Download, BarChart2, Clock,
    CheckCircle2, Target, Layers, BookMarked
} from 'lucide-react';
import api from '../../utils/api';

// ─── Palette for career disciplines (10 items) ────────────────────────────────
const DISCIPLINE_COLORS = [
    'bg-rose-100 text-rose-700',
    'bg-blue-100 text-blue-700',
    'bg-amber-100 text-amber-700',
    'bg-purple-100 text-purple-700',
    'bg-green-100 text-green-700',
    'bg-cyan-100 text-cyan-700',
    'bg-orange-100 text-orange-700',
    'bg-slate-200 text-slate-700',
    'bg-pink-100 text-pink-700',
    'bg-indigo-100 text-indigo-700',
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const topDiscipline = (areas = []) =>
    areas.reduce((best, a) => (a.score > (best?.score ?? -1) ? a : best), null);

// ═════════════════════════════════════════════════════════════════════════════
// AptitudeResults Page
// ═════════════════════════════════════════════════════════════════════════════
const AptitudeResults = () => {
    const dispatch = useDispatch();
    const { students } = useSelector(s => s.student);
    const { examTypes } = useSelector(s => s.quiz);
    const { results, meta, fetchLoading } = useSelector(s => s.aptitude);

    const [search, setSearch] = useState('');
    const [selStudent, setSelStudent] = useState('');
    const [selExam, setSelExam] = useState('');
    const [page, setPage] = useState(1);
    const [selResult, setSelResult] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    const LIMIT = 20;

    // Initial data
    useEffect(() => {
        dispatch(fetchStudents());
        dispatch(fetchExamTypes());
    }, [dispatch]);

    // Reload table whenever filters change
    const loadResults = useCallback(() => {
        const params = { page, limit: LIMIT };
        if (selStudent) params.studentId = selStudent;
        if (selExam) params.examId = selExam;
        if (search) params.studentName = search;
        dispatch(fetchAllAptitudeResults(params));
    }, [dispatch, page, selStudent, selExam, search]);

    useEffect(() => { loadResults(); }, [loadResults]);

    const handleDownloadReport = async (id) => {
        try {
            const response = await api.get(`/aptitude-results/${id}/report`, { responseType: 'blob' });
            const blob = new Blob([response], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `aptitude_report_${id}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Report download failed:', err);
            alert('Could not download the report. Please try again.');
        }
    };

    const openModal = (row) => { setSelResult(row); setModalOpen(true); };
    const closeModal = () => { setSelResult(null); setModalOpen(false); dispatch(clearCurrentResult()); };

    return (
        <div className="animate-fade-in space-y-8 pb-12 font-sans">
            {/* Title */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-violet-600 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-200">
                        <Brain size={22} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">Career Aptitude Results</h1>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Interest & Academic Assessment</span>
                    </div>
                </div>
            </div>

            {/* Main Card */}
            <div className="bg-white border border-slate-100 rounded-[32px] p-6 md:p-10 shadow-sm">

                {/* Filters */}
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-10">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Name search */}
                        <div className="relative group">
                            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-violet-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search student..."
                                value={search}
                                onChange={e => { setSearch(e.target.value); setPage(1); }}
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-violet-500/5 focus:border-violet-500/30 transition-all placeholder:text-slate-300"
                            />
                        </div>

                        {/* Student filter */}
                        <div className="relative group">
                            <Users size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-violet-500 transition-colors" />
                            <select
                                value={selStudent}
                                onChange={e => { setSelStudent(e.target.value); setPage(1); }}
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-violet-500/5 focus:border-violet-500/30 transition-all appearance-none cursor-pointer"
                            >
                                <option value="">All Students</option>
                                {students.map(s => <option key={s._id} value={s.userId?._id || s.userId}>{s.studentName}</option>)}
                            </select>
                            <ChevronRight size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none rotate-90" />
                        </div>

                        {/* Exam type filter */}
                        <div className="relative group">
                            <BookOpen size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-violet-500 transition-colors" />
                            <select
                                value={selExam}
                                onChange={e => { setSelExam(e.target.value); setPage(1); }}
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-violet-500/5 focus:border-violet-500/30 transition-all appearance-none cursor-pointer"
                            >
                                <option value="">All Exams</option>
                                {examTypes.map(e => <option key={e._id} value={e._id}>{e.examType} – {e.className}</option>)}
                            </select>
                            <ChevronRight size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none rotate-90" />
                        </div>
                    </div>

                    <div className="px-5 py-3 bg-violet-600 text-white rounded-2xl flex items-center gap-2 shadow-lg shadow-violet-200 shrink-0">
                        <Database size={16} />
                        <span className="text-xs font-black uppercase tracking-widest">{meta.total ?? results.length} Found</span>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-2xl overflow-hidden border border-slate-100">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Student</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Exam</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Top Career</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Academic</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Time</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right pr-8">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {fetchLoading ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-20 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <Loader2 size={32} className="animate-spin text-violet-500" />
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading results…</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : results.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-20 text-center opacity-30">
                                            <div className="flex flex-col items-center gap-2">
                                                <Brain size={48} />
                                                <p className="text-xs font-black uppercase tracking-[0.2em]">No aptitude data</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    results.map(row => {
                                        const top = topDiscipline(row.careerScores?.map((c, i) => ({
                                            name: c.discipline, score: c.score
                                        })) || []);
                                        return (
                                            <tr key={row._id} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-violet-100 text-violet-600 rounded-xl flex items-center justify-center font-black text-xs">
                                                            {row.userId?.fullName?.charAt(0) || 'S'}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-slate-900">{row.userId?.fullName || 'Anonymous'}</p>
                                                            <p className="text-[10px] font-semibold text-slate-400">{row.examId?.className || 'N/A'} • {row.userId?.contactNumber || '–'}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <span className="text-xs font-bold text-slate-700">{row.examId?.examType || 'Aptitude Test'}</span>
                                                </td>
                                                <td className="px-6 py-5">
                                                    {top ? (
                                                        <span className="inline-block text-[9px] font-black px-2.5 py-1 rounded-full bg-violet-50 text-violet-700 leading-tight max-w-[180px] truncate">
                                                            {top.name}
                                                        </span>
                                                    ) : <span className="text-slate-300 text-xs">—</span>}
                                                </td>
                                                <td className="px-6 py-5">
                                                    <span className="text-sm font-black text-slate-900">{row.academicGrandTotal ?? 0}<span className="text-slate-400 font-normal text-xs">/50</span></span>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-1 text-xs font-bold text-slate-600">
                                                        <Clock size={12} className="text-slate-400" />
                                                        {row.timeTaken} min
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 text-right pr-8">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <button
                                                            onClick={() => handleDownloadReport(row._id)}
                                                            title="Download Report PDF"
                                                            className="p-2 text-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all active:scale-90"
                                                        >
                                                            <Download size={15} />
                                                        </button>
                                                        <button
                                                            onClick={() => openModal(row)}
                                                            className="p-2 text-slate-300 hover:text-violet-600 hover:bg-violet-50 rounded-xl transition-all active:scale-90"
                                                        >
                                                            <ChevronRight size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                {(meta.total ?? 0) > LIMIT && (
                    <div className="mt-10 flex items-center justify-center gap-2">
                        <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                            className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-400 hover:text-violet-600 disabled:opacity-30 transition-all">
                            <ChevronLeft size={18} />
                        </button>
                        <div className="px-6 py-2.5 bg-white border border-slate-100 rounded-xl">
                            <span className="text-xs font-black text-slate-900 tracking-widest">PAGE {page}</span>
                        </div>
                        <button disabled={results.length < LIMIT} onClick={() => setPage(p => p + 1)}
                            className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-400 hover:text-violet-600 disabled:opacity-30 transition-all">
                            <ChevronRight size={18} />
                        </button>
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            <AnimatePresence>
                {modalOpen && selResult && (
                    <AptitudeDetailModal
                        result={selResult}
                        onClose={closeModal}
                        onDownload={() => handleDownloadReport(selResult._id)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

// ═════════════════════════════════════════════════════════════════════════════
// AptitudeDetailModal
// ═════════════════════════════════════════════════════════════════════════════
const AptitudeDetailModal = ({ result, onClose, onDownload }) => {
    const careerAreas = (result.careerScores || []).map(c => ({
        name: c.discipline, score: c.score
    }));
    const careerGrand = result.careerGrandTotal ?? 0;

    const subjects = (result.academicScores || []).map(s => ({
        name: s.subject, correctAnswers: s.correctAnswers
    }));
    const academicGrand = result.academicGrandTotal ?? 0;

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            {/* Panel */}
            <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 24 }}
                className="relative w-full max-w-3xl bg-white rounded-[40px] shadow-2xl overflow-hidden border border-slate-100"
            >
                {/* Header */}
                <div className="p-8 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-violet-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-violet-100">
                            <Brain size={28} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-slate-900 leading-tight">Aptitude Report</h3>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{result.userId?.fullName}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-3 hover:bg-white rounded-2xl transition-colors text-slate-400 hover:text-slate-900 border border-transparent hover:border-slate-100">
                        <XCircle size={24} />
                    </button>
                </div>

                {/* Scrollable body */}
                <div className="p-8 space-y-8 max-h-[72vh] overflow-y-auto custom-scrollbar">

                    {/* Summary Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <StatCard label="Exam" value={result.examId?.examType || 'Aptitude'} color="violet" />
                        <StatCard label="Class" value={result.examId?.className || 'N/A'} color="indigo" />
                        <StatCard label="Time Taken" value={`${result.timeTaken} min`} color="slate" />
                        <StatCard label="Academic Score" value={`${academicGrand}/50`} color="emerald" />
                    </div>

                    {/* ── Section 1: Career Disciplines ─────────────────────── */}
                    <div className="space-y-3">
                        <SectionTitle icon={<Target size={16} />} label="Section 1 — Interest & Personality Assessment" />
                        <p className="text-[10px] text-slate-400 font-semibold ml-1">Career Grand Total: <strong className="text-slate-700">{careerGrand}</strong></p>

                        <div className="rounded-2xl overflow-hidden border border-slate-100">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-violet-600 text-white">
                                        <th className="px-4 py-3 text-[9px] font-black uppercase tracking-widest">Career Discipline</th>
                                        <th className="px-4 py-3 text-[9px] font-black uppercase tracking-widest text-center">Score</th>
                                        <th className="px-4 py-3 text-[9px] font-black uppercase tracking-widest text-center">%</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {careerAreas.map((area, idx) => {
                                        const pct = careerGrand > 0 ? ((area.score / careerGrand) * 100).toFixed(2) : '0.00';
                                        return (
                                            <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                                                <td className="px-4 py-3">
                                                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full mr-2 ${DISCIPLINE_COLORS[idx] || 'bg-slate-100 text-slate-600'}`}>#{idx + 1}</span>
                                                    <span className="text-xs font-bold text-slate-700">{area.name}</span>
                                                </td>
                                                <td className="px-4 py-3 text-xs font-black text-slate-900 text-center">{area.score}</td>
                                                <td className="px-4 py-3 text-xs font-bold text-violet-600 text-center">{pct}%</td>
                                            </tr>
                                        );
                                    })}
                                    <tr className="bg-slate-900 text-white">
                                        <td className="px-4 py-3 text-xs font-black">Grand Total</td>
                                        <td className="px-4 py-3 text-xs font-black text-center">{careerGrand}</td>
                                        <td className="px-4 py-3 text-xs font-black text-center">100%</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* ── Section 2: Academic Subjects ──────────────────────── */}
                    <div className="space-y-3">
                        <SectionTitle icon={<BookMarked size={16} />} label="Section 2 — Academic Proficiency Assessment" />
                        <p className="text-[10px] text-slate-400 font-semibold ml-1">Academic Grand Total: <strong className="text-slate-700">{academicGrand} / 50</strong></p>

                        <div className="rounded-2xl overflow-hidden border border-slate-100">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-emerald-600 text-white">
                                        <th className="px-4 py-3 text-[9px] font-black uppercase tracking-widest">Subject</th>
                                        <th className="px-4 py-3 text-[9px] font-black uppercase tracking-widest text-center">Correct</th>
                                        <th className="px-4 py-3 text-[9px] font-black uppercase tracking-widest text-center">%</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {subjects.map((sub, idx) => {
                                        const pct = academicGrand > 0 ? ((sub.correctAnswers / academicGrand) * 100).toFixed(2) : '0.00';
                                        return (
                                            <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                                                <td className="px-4 py-3 text-xs font-bold text-slate-700">{sub.name}</td>
                                                <td className="px-4 py-3 text-xs font-black text-slate-900 text-center">{sub.correctAnswers}</td>
                                                <td className="px-4 py-3 text-xs font-bold text-emerald-600 text-center">{pct}%</td>
                                            </tr>
                                        );
                                    })}
                                    <tr className="bg-slate-900 text-white">
                                        <td className="px-4 py-3 text-xs font-black">Grand Total</td>
                                        <td className="px-4 py-3 text-xs font-black text-center">{academicGrand}</td>
                                        <td className="px-4 py-3 text-xs font-black text-center">100%</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center">
                    <button
                        onClick={onDownload}
                        className="px-5 py-2.5 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center gap-2"
                    >
                        <Download size={13} /> Download Report PDF
                    </button>
                    <button
                        onClick={onClose}
                        className="px-8 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg"
                    >
                        Close
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

// ── Sub-components ─────────────────────────────────────────────────────────────

const StatCard = ({ label, value, color }) => {
    const colors = {
        violet: 'bg-violet-50 border-violet-100 text-violet-400 text-violet-700',
        indigo: 'bg-indigo-50 border-indigo-100 text-indigo-400 text-indigo-700',
        slate: 'bg-slate-50 border-slate-100 text-slate-400 text-slate-700',
        emerald: 'bg-emerald-50 border-emerald-100 text-emerald-400 text-emerald-700',
    }[color] || 'bg-slate-50 border-slate-100 text-slate-400 text-slate-700';

    return (
        <div className={`p-5 rounded-3xl border text-center ${colors.split(' ').slice(0, 2).join(' ')}`}>
            <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${colors.split(' ')[2]}`}>{label}</p>
            <p className={`text-lg font-black leading-tight ${colors.split(' ')[3]}`}>{value}</p>
        </div>
    );
};

const SectionTitle = ({ icon, label }) => (
    <div className="flex items-center gap-2">
        <div className="text-violet-600">{icon}</div>
        <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">{label}</h4>
    </div>
);

export default AptitudeResults;
