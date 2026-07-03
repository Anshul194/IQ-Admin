import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Award, ArrowLeft, Download, FileText, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import MainLayout from '../components/MainLayout';
import { useSelector } from 'react-redux';
import { getResultDetails, downloadCertificate, downloadReport } from '../utils/api';

const ResultDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                setLoading(true);
                const res = await getResultDetails(id);
                setResult(res.data || res);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load result details');
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchDetail();
    }, [id]);

    if (loading) return (
        <MainLayout user={user}>
            <div className="h-[60vh] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin" />
            </div>
        </MainLayout>
    );

    if (error) return (
        <MainLayout user={user}>
            <div className="flex flex-col items-center justify-center py-32 text-center space-y-4">
                <AlertCircle size={48} className="text-rose-500" />
                <h3 className="text-xl font-bold text-slate-900">Error Loading Details</h3>
                <p className="text-slate-500 text-sm max-w-md">{error}</p>
                <button onClick={() => navigate('/results')} className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm">
                    Back to Results
                </button>
            </div>
        </MainLayout>
    );

    if (!result) return null;

    const isPassed = result.status === 'PASSED';
    const isJunior = parseInt(result?.examId?.className || user?.grade) <= 6;
    const areas = result.areaScores || [];
    const pct = result.percentage ?? Math.round((result.correctAnswers / (result.totalQuestions || 40)) * 100);

    return (
        <MainLayout user={user}>
            <div className="p-6 md:p-10 lg:p-12 max-w-5xl mx-auto space-y-8">
                <button onClick={() => navigate('/results')} className="flex items-center gap-2 text-xs font-black text-slate-400 hover:text-indigo-600 uppercase tracking-widest transition-all group">
                    <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Results
                </button>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                    <div className={`p-8 ${isPassed ? 'bg-emerald-50' : 'bg-slate-50'} border-b border-slate-100`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900">{result.examId?.examType || 'Assessment'}</h2>
                                <p className="text-sm text-slate-500 font-medium mt-1">{result?.userId?.fullName || 'Student'} — Class {result.examId?.className || 'N/A'}</p>
                            </div>
                            <div className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full border text-xs font-black uppercase tracking-widest ${isPassed ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-slate-400 text-white border-slate-400'}`}>
                                {isPassed ? <CheckCircle size={14} /> : <XCircle size={14} />}
                                {result.status}
                            </div>
                        </div>
                    </div>

                    <div className="p-8 space-y-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="p-5 bg-slate-50 rounded-xl border border-slate-100">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Correct</p>
                                <p className="text-2xl font-black text-slate-900">{result.correctAnswers}/{result.totalQuestions}</p>
                            </div>
                            <div className="p-5 bg-slate-50 rounded-xl border border-slate-100">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Percentage</p>
                                <p className="text-2xl font-black text-slate-900">{pct}%</p>
                            </div>
                            <div className="p-5 bg-slate-50 rounded-xl border border-slate-100">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Time Taken</p>
                                <p className="text-2xl font-black text-slate-900">{result.timeTaken}m</p>
                            </div>
                            {isPassed && result.iqScore && (
                                <div className="p-5 bg-indigo-50 rounded-xl border border-indigo-100">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-1">IQ Score</p>
                                    <p className="text-2xl font-black text-indigo-600">{result.iqScore}</p>
                                </div>
                            )}
                        </div>

                        {areas.length > 0 && (
                            <div className="space-y-4">
                                <h3 className="text-sm font-black text-slate-700 uppercase tracking-widest">Area-wise Performance</h3>
                                <div className="space-y-3">
                                    {areas.map((area, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl">
                                            <span className="text-sm font-bold text-slate-700">{area.areaName || area.name}</span>
                                            <div className="flex items-center gap-4">
                                                <div className="h-2 w-32 bg-slate-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${Math.min(100, (area.correctAnswers / 8) * 100)}%` }} />
                                                </div>
                                                <span className="text-sm font-black text-slate-900 w-6 text-right">{area.correctAnswers}/8</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {isPassed && (
                            <div className="flex gap-4 pt-4 border-t border-slate-100">
                                <button onClick={() => downloadCertificate(result._id)} className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-slate-800 transition-all">
                                    <Download size={14} /> Download Certificate
                                </button>
                                <button onClick={() => downloadReport(result._id)} className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold text-xs hover:bg-indigo-700 transition-all">
                                    <FileText size={14} /> Download Report
                                </button>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </MainLayout>
    );
};

export default ResultDetail;
