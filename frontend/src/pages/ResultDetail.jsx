import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Award, ArrowLeft, Download, FileText, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import MainLayout from '../components/MainLayout';
import { useSelector } from 'react-redux';
import { getResultDetails, getAptitudeResultDetails, downloadCertificate, downloadReport } from '../utils/api';
import CareerAptitudeCertificate from '../components/CareerAptitudeCertificate';

const ResultDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { user } = useSelector((state) => state.auth);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDownloadingCert, setIsDownloadingCert] = useState(false);
    const [isDownloadingReport, setIsDownloadingReport] = useState(false);

    const type = searchParams.get('type');
    const isAptitude = type === 'aptitude';

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                setLoading(true);
                const res = isAptitude ? await getAptitudeResultDetails(id) : await getResultDetails(id);
                setResult(res.data || res);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load result details');
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchDetail();
    }, [id, isAptitude]);

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

    const isPassed = result.status === 'PASSED' || isAptitude;
    const isJunior = parseInt(result?.examId?.className || user?.grade) <= 6;
    
    // Normalizing properties
    const correctCount = isAptitude ? result.academicGrandTotal : result.correctAnswers;
    const totalQuestions = isAptitude ? (result.academicAnswers?.length || 50) : result.totalQuestions;
    const pct = result.percentage ?? Math.round((correctCount / (totalQuestions || 40)) * 100);

    const areas = isAptitude 
        ? [] 
        : (result.areaScores || []);

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
                                <h2 className="text-2xl font-black text-slate-900">{result.examId?.examType || (isAptitude ? 'Career Aptitude Test' : 'Assessment')}</h2>
                                <p className="text-sm text-slate-500 font-medium mt-1">{result?.userId?.fullName || 'Student'} — Class {result.examId?.className || 'N/A'}</p>
                            </div>
                            <div className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full border text-xs font-black uppercase tracking-widest ${isPassed ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-slate-400 text-white border-slate-400'}`}>
                                {isPassed ? <CheckCircle size={14} /> : <XCircle size={14} />}
                                {isAptitude ? 'COMPLETED' : result.status}
                            </div>
                        </div>
                    </div>

                    <div className="p-8 space-y-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="p-5 bg-slate-50 rounded-xl border border-slate-100">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{isAptitude ? 'Academic Score' : 'Correct'}</p>
                                <p className="text-2xl font-black text-slate-900">{correctCount}/{totalQuestions}</p>
                            </div>
                            <div className="p-5 bg-slate-50 rounded-xl border border-slate-100">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{isAptitude ? 'Academic Pct' : 'Percentage'}</p>
                                <p className="text-2xl font-black text-slate-900">{pct}%</p>
                            </div>
                            <div className="p-5 bg-slate-50 rounded-xl border border-slate-100">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Time Taken</p>
                                <p className="text-2xl font-black text-slate-900">{result.timeTaken}m</p>
                            </div>
                            {!isAptitude && isPassed && result.iqScore && (
                                <div className="p-5 bg-indigo-50 rounded-xl border border-indigo-100">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-1">IQ Score</p>
                                    <p className="text-2xl font-black text-indigo-600">{result.iqScore}</p>
                                </div>
                            )}
                            {isAptitude && result.careerGrandTotal !== undefined && (
                                <div className="p-5 bg-indigo-50 rounded-xl border border-indigo-100">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-1">Career Affinity</p>
                                    <p className="text-2xl font-black text-indigo-600">{result.careerGrandTotal}</p>
                                </div>
                            )}
                        </div>

                        {/* On-screen Preview of Certificate for Career Aptitude */}
                        {isAptitude && (
                            <div className="space-y-4">
                                <h3 className="text-sm font-black text-slate-700 uppercase tracking-widest">Certificate Preview</h3>
                                <div className="overflow-x-auto border border-slate-200 rounded-2xl flex justify-center p-6 bg-slate-100">
                                    <div className="scale-75 md:scale-90 lg:scale-100 origin-center my-4">
                                        <CareerAptitudeCertificate
                                            studentName={result.userId?.fullName || 'Student'}
                                            className={result.examId?.className || 'N/A'}
                                            completedAt={result.completedAt}
                                            resultId={result._id}
                                            interestAreas={result.careerScores?.map(cs => ({ label: cs.discipline, score: cs.score })) || []}
                                            academicSubjects={result.academicScores?.map(as => ({ label: as.subject, correct: as.correctAnswers, outOf: 10 })) || []}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

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
                                <button
                                    onClick={async () => {
                                        setIsDownloadingCert(true);
                                        try {
                                            await downloadCertificate(result._id, isAptitude);
                                        } catch (error) {
                                            console.error('Download failed:', error);
                                        } finally {
                                            setIsDownloadingCert(false);
                                        }
                                    }}
                                    disabled={isDownloadingCert}
                                    className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isDownloadingCert ? (
                                        <div className="w-[14px] h-[14px] border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <Download size={14} />
                                    )}
                                    {isDownloadingCert ? 'Downloading...' : 'Download Certificate'}
                                </button>
                                {!isAptitude && (
                                    <button
                                        onClick={async () => {
                                            setIsDownloadingReport(true);
                                            try {
                                                await downloadReport(result._id, isAptitude);
                                            } catch (error) {
                                                console.error('Download failed:', error);
                                            } finally {
                                                setIsDownloadingReport(false);
                                            }
                                        }}
                                        disabled={isDownloadingReport}
                                        className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold text-xs hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isDownloadingReport ? (
                                            <div className="w-[14px] h-[14px] border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <FileText size={14} />
                                        )}
                                        {isDownloadingReport ? 'Downloading...' : 'Download Report'}
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </MainLayout>
    );
};

export default ResultDetail;
