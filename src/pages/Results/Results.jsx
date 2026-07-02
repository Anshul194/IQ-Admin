import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchStudents } from '../../store/slices/studentSlice';
import { fetchExamTypes } from '../../store/slices/quizSlice';
import {
    FileText, Search, Filter, Calendar,
    CheckCircle2, XCircle, Clock, Award,
    ChevronRight, Loader2, Database,
    Users, BookOpen, Layers, ChevronLeft,
    RefreshCcw, Brain, BarChart2, Download
} from 'lucide-react';
import ExportMenu from '../../components/Common/ExportMenu';
import api from '../../utils/api';

const STATUS_COLORS = {
    PASSED: {
        bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100',
        icon: <CheckCircle2 size={12} />
    },
    RETEST_REQUIRED: {
        bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100',
        icon: <RefreshCcw size={12} />
    },
    pass: {
        bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100',
        icon: <CheckCircle2 size={12} />
    },
    fail: {
        bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-100',
        icon: <XCircle size={12} />
    },
    pending: {
        bg: 'bg-slate-50', text: 'text-slate-500', border: 'border-slate-100',
        icon: <Clock size={12} />
    }
};

const Results = () => {
    const dispatch = useDispatch();
    const { students } = useSelector(state => state.student);
    const { examTypes } = useSelector(state => state.quiz);

    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedStudent, setSelectedStudent] = useState('');
    const [selectedExam, setSelectedExam] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [page, setPage] = useState(1);
    const [totalResults, setTotalResults] = useState(0);
    const [selectedResult, setSelectedResult] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const limit = 20;

    useEffect(() => {
        dispatch(fetchStudents());
        dispatch(fetchExamTypes());
    }, [dispatch]);

    useEffect(() => {
        fetchResults();
    }, [page, selectedStudent, selectedExam, statusFilter, search]);

    const fetchResults = async () => {
        setLoading(true);
        try {
            let query = `?page=${page}&limit=${limit}`;
            if (selectedStudent) query += `&studentId=${selectedStudent}`;
            if (selectedExam) query += `&examId=${selectedExam}`;
            if (statusFilter) query += `&status=${statusFilter}`;
            if (search) query += `&studentName=${search}`;

            const response = await api.get(`/results${query}`);
            const resultsData = response?.data?.data?.data || response?.data?.data || [];
            const meta = response?.data?.meta || response?.data?.data?.meta || {};

            setResults(resultsData);
            setTotalResults(meta.total || resultsData.length || 0);
        } catch (error) {
            console.error('Failed to fetch results:', error);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadPDF = async (resultId, type) => {
        try {
            const response = await api.get(`/results/${resultId}/${type}`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${type}_${resultId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error(`Failed to download ${type}:`, err);
            alert(`Could not download ${type}. Result may not be eligible.`);
        }
    };

    const getStatusStyle = (status) => STATUS_COLORS[status] || STATUS_COLORS.pending;

    return (
        <div className="animate-fade-in space-y-8 pb-12 font-sans">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Assessment Archive</h1>
                    <div className="h-6 w-px bg-slate-200 hidden md:block" />
                    <span className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mt-1 hidden md:block">IQ Performance Metrics</span>
                </div>
                <ExportMenu exportType="results" label="Export Results" />
            </div>

            <div className="bg-white border border-slate-100 rounded-[32px] p-6 md:p-10 shadow-sm">
                {/* Filters */}
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-10">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="relative group">
                            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-violet-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search Name..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-violet-500/5 focus:border-violet-500/30 transition-all placeholder:text-slate-300"
                            />
                        </div>

                        <div className="relative group">
                            <Users size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-violet-500 transition-colors" />
                            <select
                                value={selectedStudent}
                                onChange={(e) => setSelectedStudent(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-violet-500/5 focus:border-violet-500/30 transition-all appearance-none cursor-pointer"
                            >
                                <option value="">Select Student</option>
                                {students.map(s => <option key={s._id} value={s.userId?._id || s.userId}>{s.studentName}</option>)}
                            </select>
                            <ChevronRight size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none rotate-90" />
                        </div>

                        <div className="relative group">
                            <BookOpen size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-violet-500 transition-colors" />
                            <select
                                value={selectedExam}
                                onChange={(e) => setSelectedExam(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-violet-500/5 focus:border-violet-500/30 transition-all appearance-none cursor-pointer"
                            >
                                <option value="">Select Exam</option>
                                {examTypes.map(e => (
                                    <option key={e._id} value={e._id}>
                                        {e.examType} - {e.className}
                                    </option>
                                ))}
                            </select>
                            <ChevronRight size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none rotate-90" />
                        </div>

                        <div className="relative group">
                            <Layers size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-violet-500 transition-colors" />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-violet-500/5 focus:border-violet-500/30 transition-all appearance-none cursor-pointer"
                            >
                                <option value="">All Status</option>
                                <option value="PASSED">Passed</option>
                                <option value="RETEST_REQUIRED">Retest Required</option>
                            </select>
                            <ChevronRight size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none rotate-90" />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="px-5 py-3 bg-violet-600 text-white rounded-2xl flex items-center gap-2 shadow-lg shadow-violet-200">
                            <Database size={16} />
                            <span className="text-xs font-black uppercase tracking-widest">{totalResults} Found</span>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-2xl overflow-hidden border border-slate-100">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Student</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Program</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Score / IQ</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Time</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right pr-8">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {loading ? (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-20 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <Loader2 size={32} className="animate-spin text-violet-500" />
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Fetching reports...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : results.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-20 text-center opacity-30">
                                            <div className="flex flex-col items-center gap-2">
                                                <Award size={48} />
                                                <p className="text-xs font-black uppercase tracking-[0.2em]">No diagnostic data</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    results.map((row) => {
                                        const statusStyle = getStatusStyle(row.status);
                                        const isPassed = row.status === 'PASSED' || row.status === 'pass';
                                        return (
                                            <tr key={row._id} className="hover:bg-slate-50 transition-colors group">
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-violet-100 text-violet-600 rounded-xl flex items-center justify-center font-black text-xs">
                                                            {row.userId?.fullName?.charAt(0) || 'U'}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-slate-900">{row.userId?.fullName || 'Anonymous'}</p>
                                                            <p className="text-[10px] font-semibold text-slate-400 capitalize">{row.examId?.className || 'N/A'} • {row.userId?.contactNumber || 'No Contact'}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-2">
                                                        <div className="p-1.5 bg-indigo-50 text-indigo-500 rounded-lg">
                                                            <FileText size={14} />
                                                        </div>
                                                        <div>
                                                            <span className="text-xs font-bold text-slate-700 uppercase block">{row.examId?.examType || 'IQ Test'}</span>
                                                            <span className="text-[9px] font-medium text-slate-400 capitalize">{row.examId?.language || 'English'}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex flex-col gap-0.5">
                                                        <span className="text-sm font-black text-slate-900">
                                                            {row.correctAnswers ?? row.score ?? 0} / 40 correct
                                                        </span>
                                                        {isPassed && row.iqScore != null && (
                                                            <span className="flex items-center gap-1 text-[10px] font-black text-violet-600">
                                                                <Brain size={10} />
                                                                IQ: {Number(row.iqScore).toFixed(3)}
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-1 text-xs font-bold text-slate-600">
                                                        <Clock size={12} className="text-slate-400" />
                                                        {row.timeTaken != null ? `${row.timeTaken} min` : '—'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-bold text-slate-700">{new Date(row.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                                        <span className="text-[10px] font-medium text-slate-400">{new Date(row.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                                                        {statusStyle.icon}
                                                        {row.status === 'RETEST_REQUIRED' ? 'Retest' : row.status}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 text-right pr-8">
                                                    <div className="flex items-center justify-end gap-1">
                                                        {isPassed && (
                                                            <>
                                                                <button
                                                                    onClick={() => handleDownloadPDF(row._id, 'report')}
                                                                    title="Download Report"
                                                                    className="p-2 text-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all active:scale-90"
                                                                >
                                                                    <BarChart2 size={15} />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDownloadPDF(row._id, 'certificate')}
                                                                    title="Download Certificate"
                                                                    className="p-2 text-emerald-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all active:scale-90"
                                                                >
                                                                    <Download size={15} />
                                                                </button>
                                                            </>
                                                        )}
                                                        <button
                                                            onClick={() => { setSelectedResult(row); setModalOpen(true); }}
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
                {totalResults > limit && (
                    <div className="mt-10 flex items-center justify-center gap-2">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(p => p - 1)}
                            className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-400 hover:text-violet-600 disabled:opacity-30 transition-all"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <div className="px-6 py-2.5 bg-white border border-slate-100 rounded-xl">
                            <span className="text-xs font-black text-slate-900 tracking-widest">PAGE {page}</span>
                        </div>
                        <button
                            disabled={results.length < limit}
                            onClick={() => setPage(p => p + 1)}
                            className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-400 hover:text-violet-600 disabled:opacity-30 transition-all"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                )}
            </div>

            <AnimatePresence>
                {modalOpen && selectedResult && (
                    <ResultDetailModal
                        result={selectedResult}
                        onClose={() => { setModalOpen(false); setSelectedResult(null); }}
                        onDownload={handleDownloadPDF}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// Result Detail Modal
// ─────────────────────────────────────────────────────────────────────────────
const ResultDetailModal = ({ result, onClose, onDownload }) => {
    const isPassed = result.status === 'PASSED' || result.status === 'pass';
    const isRetest = result.status === 'RETEST_REQUIRED';

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden border border-slate-100"
            >
                {/* Header */}
                <div className="p-8 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 ${isPassed ? 'bg-violet-600' : 'bg-amber-500'} text-white rounded-2xl flex items-center justify-center shadow-lg`}>
                            {isPassed ? <Award size={28} /> : <RefreshCcw size={28} />}
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-slate-900 leading-tight">Score Report</h3>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{result.userId?.fullName}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-3 hover:bg-white rounded-2xl transition-colors text-slate-400 hover:text-slate-900 border border-transparent hover:border-slate-100">
                        <XCircle size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">

                    {/* Retest notice */}
                    {isRetest && (
                        <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-100 rounded-2xl">
                            <RefreshCcw size={18} className="text-amber-500 mt-0.5 shrink-0" />
                            <div>
                                <p className="text-xs font-black text-amber-700 uppercase tracking-widest mb-0.5">Retest Required</p>
                                <p className="text-xs font-medium text-amber-600">Student must score at least 11 correct answers to pass the IQ Test.</p>
                            </div>
                        </div>
                    )}

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-5 bg-violet-50 rounded-3xl border border-violet-100 text-center">
                            <p className="text-[10px] font-black text-violet-400 uppercase tracking-widest mb-1">Correct</p>
                            <p className="text-2xl font-black text-violet-700">{result.correctAnswers ?? result.score ?? 0}/40</p>
                        </div>
                        {isPassed && result.iqScore != null ? (
                            <div className="p-5 bg-indigo-50 rounded-3xl border border-indigo-100 text-center">
                                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">IQ Score</p>
                                <p className="text-2xl font-black text-indigo-700">{Number(result.iqScore).toFixed(3)}</p>
                            </div>
                        ) : (
                            <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100 text-center">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">IQ Score</p>
                                <p className="text-2xl font-black text-slate-300">N/A</p>
                            </div>
                        )}
                        <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100 text-center">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Time Taken</p>
                            <p className="text-2xl font-black text-slate-700">{result.timeTaken != null ? `${result.timeTaken}m` : '—'}</p>
                        </div>
                        <div className="p-5 bg-emerald-50 rounded-3xl border border-emerald-100 text-center">
                            <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Status</p>
                            <p className="text-sm font-black text-emerald-700 uppercase leading-tight mt-1">
                                {result.status === 'RETEST_REQUIRED' ? 'RETEST' : result.status}
                            </p>
                        </div>
                    </div>

                    {/* Area-wise scores */}
                    {result.areaScores && result.areaScores.length > 0 && (
                        <div className="space-y-3">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Area-Wise Performance</h4>
                            <div className="overflow-hidden rounded-2xl border border-slate-100">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-slate-50">
                                            <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Area</th>
                                            <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Correct</th>
                                            {isPassed && (
                                                <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">%</th>
                                            )}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {result.areaScores.map((area, idx) => {
                                            const totalCorrect = result.correctAnswers ?? result.correctAnswersCount ?? 0;
                                            const pct = isPassed && totalCorrect > 0
                                                ? ((area.correctAnswers / totalCorrect) * 100).toFixed(2)
                                                : null;
                                            return (
                                                <tr key={idx} className="hover:bg-slate-50/50">
                                                    <td className="px-4 py-3 text-xs font-bold text-slate-700">{area.areaName}</td>
                                                    <td className="px-4 py-3 text-xs font-black text-slate-900 text-center">{area.correctAnswers}</td>
                                                    {isPassed && (
                                                        <td className="px-4 py-3 text-xs font-bold text-violet-600 text-center">{pct}%</td>
                                                    )}
                                                </tr>
                                            );
                                        })}
                                        <tr className="bg-slate-900 text-white">
                                            <td className="px-4 py-3 text-xs font-black">Grand Total</td>
                                            <td className="px-4 py-3 text-xs font-black text-center">{result.correctAnswers ?? result.correctAnswersCount ?? 0}</td>
                                            {isPassed && <td className="px-4 py-3 text-xs font-black text-center">100%</td>}
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Assessment Context */}
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Assessment Context</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="p-4 bg-white border border-slate-100 rounded-2xl flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-500">Program</span>
                                <span className="text-xs font-black text-slate-900">{result.examId?.examType}</span>
                            </div>
                            <div className="p-4 bg-white border border-slate-100 rounded-2xl flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-500">Class</span>
                                <span className="text-xs font-black text-slate-900">{result.examId?.className} Class</span>
                            </div>
                            <div className="p-4 bg-white border border-slate-100 rounded-2xl flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-500">Language</span>
                                <span className="text-xs font-black text-slate-900 uppercase">{result.examId?.language}</span>
                            </div>
                            <div className="p-4 bg-white border border-slate-100 rounded-2xl flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-500">Completed On</span>
                                <span className="text-xs font-black text-slate-900">{new Date(result.completedAt || result.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center">
                    <div className="flex gap-2">
                        {isPassed && (
                            <>
                                <button
                                    onClick={() => onDownload(result._id, 'report')}
                                    className="px-5 py-2.5 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center gap-1.5"
                                >
                                    <BarChart2 size={13} /> Report PDF
                                </button>
                                <button
                                    onClick={() => onDownload(result._id, 'certificate')}
                                    className="px-5 py-2.5 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all flex items-center gap-1.5"
                                >
                                    <Award size={13} /> Certificate
                                </button>
                            </>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="px-8 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg"
                    >
                        Close Report
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default Results;
