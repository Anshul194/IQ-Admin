import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Brain, ArrowRight, ArrowLeft, Timer, CheckCircle,
    AlertCircle, X, Flag, Trash2, ChevronDown, ChevronUp,
    LayoutGrid, List, Award, Download, Share2, RefreshCw, FileText
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import { useDispatch, useSelector } from 'react-redux';
import CareerAptitudeCertificate from '../components/CareerAptitudeCertificate';
import { getQuizQuestions, submitAssessment, clearAssessment } from '../store/slices/assessmentSlice';
import { downloadCertificate, downloadReport } from '../utils/api';
const stripHtml = (html) => {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
};

const Assessment = ({ user }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { sections, loading, submitting, error, lastResult, examId, examName } = useSelector((state) => state.assessment);

    // UI States
    const [isFinished, setIsFinished] = useState(false);
    const isJunior = parseInt(user?.grade) <= 6;
    const maxTime = isJunior ? 3600 : 7200;
    const [timeLeft, setTimeLeft] = useState(maxTime);
    const [startTime, setStartTime] = useState(null);
    const [activeSection, setActiveSection] = useState(0);
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [expandedSections, setExpandedSections] = useState(new Set([0]));
    const [sidebarTab, setSidebarTab] = useState('palette');
    const [isMobilePaletteOpen, setIsMobilePaletteOpen] = useState(false);
    const [showSubmitModal, setShowSubmitModal] = useState(false);

    // Data States
    const [answers, setAnswers] = useState({});
    const [marked, setMarked] = useState(new Set());
    const [visited, setVisited] = useState(new Set([0]));
    const [isDownloadingCert, setIsDownloadingCert] = useState(false);
    const [isDownloadingReport, setIsDownloadingReport] = useState(false);

    useEffect(() => {
        dispatch(getQuizQuestions(user?.grade || '1'));
        setStartTime(Date.now());
        return () => dispatch(clearAssessment());
    }, [user, dispatch]);

    useEffect(() => {
        if (lastResult) setIsFinished(true);
    }, [lastResult]);

    const allQuestionsCount = useMemo(() => sections.reduce((acc, s) => acc + s.questions.length, 0), [sections]);

    const getGlobalIdx = (sIdx, qIdx) => {
        return sections.slice(0, sIdx).reduce((acc, s) => acc + s.questions.length, 0) + qIdx;
    };

    const currentGlobalIdx = getGlobalIdx(activeSection, currentQuestionIdx);

    useEffect(() => {
        if (!loading && sections.length > 0 && timeLeft > 0 && !isFinished) {
            const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
            return () => clearInterval(timer);
        } else if (timeLeft === 0 && !loading) handleSubmit(true);
    }, [timeLeft, isFinished, loading, sections]);

    useEffect(() => {
        setVisited(prev => new Set([...prev, currentGlobalIdx]));
    }, [currentGlobalIdx]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const handleNext = () => {
        if (currentQuestionIdx < sections[activeSection].questions.length - 1) {
            setCurrentQuestionIdx(prev => prev + 1);
        } else if (activeSection < sections.length - 1) {
            setActiveSection(prev => prev + 1);
            setCurrentQuestionIdx(0);
        }
    };

    const handleBack = () => {
        if (currentQuestionIdx > 0) setCurrentQuestionIdx(prev => prev - 1);
        else if (activeSection > 0) {
            setActiveSection(prev => prev - 1);
            setCurrentQuestionIdx(sections[activeSection - 1].questions.length - 1);
        }
    };

    const getStatus = (gIdx) => {
        const isAnswered = answers[gIdx] !== undefined;
        const isMarked = marked.has(gIdx);
        const isVisited = visited.has(gIdx);

        if (isMarked) return 'marked';
        if (isAnswered) return 'answered';
        if (isVisited) return 'not-answered';
        return 'not-visited';
    };

    const executeSubmit = () => {
        let interestAnswers = [];
        let academicAnswers = [];
        let standardAnswers = [];

        if (isJunior) {
            let gIdxCounter = 0;
            for (let s of sections) {
                for (let q of s.questions) {
                    const optionIdx = answers[gIdxCounter];
                    if (optionIdx !== undefined && q.options[optionIdx]) {
                        standardAnswers.push({
                            questionId: q.id,
                            selectedOption: q.options[optionIdx].key
                        });
                    }
                    gIdxCounter++;
                }
            }
        } else {
            // Section 0 is Interest
            const interestSection = sections[0];
            if (interestSection) {
                interestAnswers = interestSection.questions.map((q, qIdx) => {
                    const gIdx = qIdx;
                    const optionIdx = answers[gIdx];
                    let selectedOption = 'A'; // Default to 'A' if skipped, since interest answers cannot be empty/null
                    if (optionIdx !== undefined && q.options[optionIdx]) {
                        selectedOption = q.options[optionIdx].key;
                    }
                    return {
                        questionId: q.id,
                        selectedOption
                    };
                });
            }

            // Section 1 is Academic
            const academicSection = sections[1];
            if (academicSection) {
                const prevCount = interestSection ? interestSection.questions.length : 0;
                academicAnswers = academicSection.questions.map((q, qIdx) => {
                    const gIdx = prevCount + qIdx;
                    const optionIdx = answers[gIdx];
                    let selectedOption = null;
                    if (optionIdx !== undefined && q.options[optionIdx]) {
                        selectedOption = q.options[optionIdx].key;
                    }
                    return {
                        questionId: q.id,
                        selectedOption
                    };
                });
            }

            // Fallback for single-section tests (e.g. dummy test setups)
            if (interestAnswers.length === 0 && academicAnswers.length > 0) {
                const fallbackQ = academicSection.questions[0];
                interestAnswers = [{
                    questionId: fallbackQ.id,
                    selectedOption: 'A'
                }];
            } else if (academicAnswers.length === 0 && interestAnswers.length > 0) {
                const fallbackQ = interestSection.questions[0];
                academicAnswers = [{
                    questionId: fallbackQ.id,
                    selectedOption: null
                }];
            }
        }

        const timeTaken = Math.round((Date.now() - startTime) / 60000);

        const payload = {
            examId: examId,
            timeTaken: Math.max(1, timeTaken),
            interestAnswers: isJunior ? undefined : interestAnswers,
            academicAnswers: isJunior ? undefined : academicAnswers,
            answers: isJunior ? standardAnswers : undefined
        };

        dispatch(submitAssessment(payload));
    };

    const handleSubmit = (isAutoSubmit = false) => {
        if (isAutoSubmit) {
            executeSubmit();
        } else {
            setShowSubmitModal(true);
        }
    };

    const renderSidebarContent = (showCloseButton = false) => {
        return (
            <>
                {/* Section Navigation Tabs in Sidebar */}
                <div className="p-4 border-b border-slate-200 bg-white shrink-0 flex items-center gap-2 shadow-sm">
                    <div className="flex-1 flex gap-2">
                        {sections.map((sec, sIdx) => {
                            const isSectionActive = activeSection === sIdx;
                            const sectionQuestions = sec.questions || [];
                            const completedCount = sectionQuestions.filter((_, qIdx) => {
                                const globalIdx = getGlobalIdx(sIdx, qIdx);
                                return answers[globalIdx] !== undefined;
                            }).length;

                            return (
                                <button
                                    key={sIdx}
                                    onClick={() => {
                                        setActiveSection(sIdx);
                                        setCurrentQuestionIdx(0);
                                    }}
                                    className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-xl border text-[9px] md:text-[10px] font-black transition-all ${
                                        isSectionActive
                                            ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                                            : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                                    }`}
                                >
                                    <span>SEC {String.fromCharCode(65 + sIdx)}</span>
                                    <span className={`px-1.5 py-0.5 rounded-full text-[8px] md:text-[9px] ${
                                        isSectionActive ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-400'
                                    }`}>
                                        {completedCount}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                    {showCloseButton && (
                        <button
                            onClick={() => setIsMobilePaletteOpen(false)}
                            className="lg:hidden p-2 hover:bg-slate-100 rounded-xl text-slate-400"
                        >
                            <X size={18} />
                        </button>
                    )}
                </div>

                {/* Sidebar Scrollable Area */}
                <div className="flex-1 overflow-y-auto p-6 scroll-smooth space-y-6 scrollbar-none">
                    {sections[activeSection]?.chapters?.map((chap, cIdx) => (
                        <div key={chap.id || cIdx} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                            {/* Chapter Header */}
                            <button
                                onClick={() => {
                                    if (chap.questions && chap.questions.length > 0) {
                                        const firstQuestionId = chap.questions[0].id;
                                        const flatIdx = sections[activeSection].questions.findIndex(q => q.id === firstQuestionId);
                                        if (flatIdx !== -1) {
                                            setCurrentQuestionIdx(flatIdx);
                                            setIsMobilePaletteOpen(false);
                                        }
                                    }
                                }}
                                className="w-full flex items-center justify-between p-4 bg-slate-50/50 hover:bg-slate-50 transition-colors border-b border-slate-100 text-left"
                            >
                                <span className="font-extrabold text-[10px] text-slate-800 uppercase tracking-wider">
                                    {chap.title}
                                </span>
                                <span className="text-[9px] font-bold bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">
                                    {chap.questions?.length || 0} Qs
                                </span>
                            </button>

                            {/* Chapter Questions Palette Grid (Square Boxes) */}
                            <div className="flex flex-wrap gap-2 p-4 bg-white">
                                {chap.questions?.map((q) => {
                                    const flatIdx = sections[activeSection].questions.findIndex(question => question.id === q.id);
                                    const globalIdx = getGlobalIdx(activeSection, flatIdx);
                                    const isCurrent = activeSection === activeSection && currentQuestionIdx === flatIdx;
                                    const status = getStatus(globalIdx);

                                    return (
                                        <button
                                            key={q.id}
                                            onClick={() => {
                                                if (flatIdx !== -1) {
                                                    setCurrentQuestionIdx(flatIdx);
                                                    setIsMobilePaletteOpen(false);
                                                }
                                            }}
                                            className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black transition-all border-2 ${
                                                isCurrent
                                                    ? 'ring-2 ring-indigo-200 ring-offset-2 scale-110 z-10 border-indigo-600 bg-indigo-600 text-white'
                                                    : status === 'answered'
                                                    ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm'
                                                    : status === 'marked'
                                                    ? 'bg-amber-500 border-amber-500 text-white'
                                                    : status === 'not-answered'
                                                    ? 'bg-rose-500 border-rose-500 text-white'
                                                    : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'
                                            }`}
                                        >
                                            {flatIdx + 1}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}

                    {/* Status Indicator Legend */}
                    <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-4 h-4 rounded bg-emerald-500" />
                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Answered</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-4 h-4 rounded bg-rose-500" />
                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Unanswered</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-4 h-4 rounded bg-white border-2 border-slate-200" />
                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Not Visited</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-4 h-4 rounded bg-amber-500" />
                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Review</span>
                        </div>
                    </div>
                </div>

                {/* Sidebar Footer Submission Button */}
                <div className="p-6 bg-white border-t border-slate-200 shrink-0">
                    <button onClick={() => handleSubmit(false)} disabled={submitting} className="w-full py-3 bg-indigo-600 text-white font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 disabled:opacity-50">
                        {submitting ? 'Syncing...' : 'Final Submission'}
                    </button>
                </div>
            </>
        );
    };

    if (loading) return <div className="h-screen flex items-center justify-center bg-white"><div className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin" /></div>;
    if (error) return <div className="h-screen flex flex-col items-center justify-center bg-white p-6 text-center"><AlertCircle size={48} className="text-rose-500 mb-4" /><h2 className="text-2xl font-bold mb-2">Sync Error</h2><p className="text-slate-500 mb-6 max-w-sm">{error}</p><button onClick={() => window.location.reload()} className="px-10 py-3 bg-slate-900 text-white rounded font-bold">Retry Connection</button></div>;

    if (isFinished && lastResult) {
        const isAptitude = !!lastResult.careerAssessment;
        const isPassed = lastResult.status === 'PASSED' || isAptitude;
        const areas = lastResult.areas || [];
        const resultId = lastResult.resultId || lastResult._id;
        const totalQ = lastResult.totalQuestions || (isAptitude ? 50 : 40);
        
        let pct = 0;
        if (isAptitude) {
            pct = Math.round((lastResult.academicAssessment?.grandTotal / (lastResult.academicAssessment?.subjects?.length * 10 || 50)) * 100);
        } else {
            pct = lastResult.percentage ?? lastResult.totalPercentage ?? Math.round((lastResult.correctAnswers / totalQ) * 100);
        }

        return (
            <MainLayout user={user} isTesting={true}>
                <div className="h-full flex flex-col items-center justify-center p-6 bg-slate-50 overflow-y-auto">
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-4xl w-full bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
                        <div className={`w-full md:w-1/2 p-10 flex flex-col items-center justify-center text-center ${isPassed ? 'bg-emerald-50' : 'bg-slate-50'}`}>
                            {isPassed ? (
                                <div className="space-y-6">
                                    <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto text-white shadow-xl shadow-emerald-200">
                                        <Award size={48} />
                                    </div>
                                    <h2 className="text-4xl font-black text-slate-900 leading-tight">Congratulations,<br />{user?.fullName || user?.name}!</h2>
                                    <p className="text-slate-600 font-medium">You have successfully cleared the {isAptitude ? 'Career Aptitude Test' : (isJunior ? 'IQ TEST' : 'Career Test')} with excellence.</p>
                                    <div className="inline-block px-6 py-3 bg-emerald-500 text-white font-bold rounded-full text-xl shadow-lg">
                                        {isAptitude ? 'COMPLETED' : 'PASSED'}
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center mx-auto text-slate-500">
                                        <RefreshCw size={48} />
                                    </div>
                                    <h2 className="text-4xl font-black text-slate-900 leading-tight">Keep Practicing,<br />{user?.fullName || user?.name}</h2>
                                    <p className="text-slate-600 font-medium">You were close! Re-review your weak areas in the {isJunior ? 'IQ TEST' : 'Career Test'} and try again to unlock your certificate.</p>
                                    <div className="inline-block px-6 py-3 bg-slate-400 text-white font-bold rounded-full text-xl shadow-lg">RE-ATTEMPT</div>
                                </div>
                            )}
                        </div>

                        <div className="flex-1 p-10 space-y-6 overflow-y-auto max-h-[80vh]">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-5 bg-slate-50 rounded-xl border border-slate-100">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{isAptitude ? 'Academic Score' : 'Score'}</p>
                                    <p className="text-3xl font-black text-slate-900">{pct}%</p>
                                </div>
                                <div className="p-5 bg-slate-50 rounded-xl border border-slate-100">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Correct</p>
                                    <p className="text-3xl font-black text-slate-900">
                                        {isAptitude 
                                            ? `${lastResult.academicAssessment?.grandTotal}/${lastResult.academicAssessment?.subjects?.length * 10 || 50}` 
                                            : `${lastResult.correctAnswers || lastResult.correctAnswersCount}/${totalQ}`
                                        }
                                    </p>
                                </div>
                                {isAptitude && lastResult.careerAssessment?.grandTotal !== undefined && (
                                    <div className="p-5 bg-indigo-50 rounded-xl border border-indigo-100 col-span-2">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-1">Career Affinity Score</p>
                                        <p className="text-3xl font-black text-indigo-600">{lastResult.careerAssessment.grandTotal}</p>
                                    </div>
                                )}
                                {!isAptitude && isPassed && lastResult.iqScore && (
                                    <div className="p-5 bg-indigo-50 rounded-xl border border-indigo-100 col-span-2">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-1">IQ Score</p>
                                        <p className="text-3xl font-black text-indigo-600">{lastResult.iqScore}</p>
                                    </div>
                                )}
                            </div>

                            {/* Certificate preview for Aptitude results */}
                            {isAptitude && (
                                <div className="space-y-3 pt-2">
                                    <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Certificate Preview</h3>
                                    <div className="overflow-x-auto border border-slate-200 rounded-xl flex justify-center p-3 bg-slate-100 scale-75 origin-top">
                                        <CareerAptitudeCertificate
                                            studentName={user?.fullName || user?.name || 'Student'}
                                            className={user?.grade || 'N/A'}
                                            completedAt={new Date()}
                                            resultId={resultId}
                                            interestAreas={lastResult.careerAssessment?.areas?.map(a => ({ label: a.name, score: a.score })) || []}
                                            academicSubjects={lastResult.academicAssessment?.subjects?.map(s => ({ label: s.name, correct: s.correctAnswers, outOf: 10 })) || []}
                                        />
                                    </div>
                                </div>
                            )}

                            {areas.length > 0 && (
                                <div className="space-y-3">
                                    <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Area-wise Breakdown</h3>
                                    <div className="space-y-2">
                                        {areas.map((area, i) => (
                                            <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                                                <span className="text-xs font-bold text-slate-700">{area.name}</span>
                                                <div className="flex items-center gap-3">
                                                    <div className="h-1.5 w-20 bg-slate-200 rounded-full overflow-hidden">
                                                        <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${area.percentage}%` }} />
                                                    </div>
                                                    <span className="text-xs font-black text-slate-900 w-8 text-right">{area.correctAnswers}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {isPassed && (
                                <div className="space-y-3 pt-2">
                                    <div className="flex gap-3">
                                        <button
                                            onClick={async () => {
                                                setIsDownloadingCert(true);
                                                try {
                                                    await downloadCertificate(resultId, isAptitude);
                                                } catch (error) {
                                                    console.error('Download failed:', error);
                                                } finally {
                                                    setIsDownloadingCert(false);
                                                }
                                            }}
                                            disabled={isDownloadingCert}
                                            className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isDownloadingCert ? (
                                                <div className="w-[14px] h-[14px] border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                <Download size={14} />
                                            )}
                                            {isDownloadingCert ? 'Downloading...' : 'Certificate'}
                                        </button>
                                        {!isAptitude && (
                                            <button
                                                onClick={async () => {
                                                    setIsDownloadingReport(true);
                                                    try {
                                                        await downloadReport(resultId, isAptitude);
                                                    } catch (error) {
                                                        console.error('Download failed:', error);
                                                    } finally {
                                                        setIsDownloadingReport(false);
                                                    }
                                                }}
                                                disabled={isDownloadingReport}
                                                className="flex-1 flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white rounded-xl font-bold text-xs hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {isDownloadingReport ? (
                                                    <div className="w-[14px] h-[14px] border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                ) : (
                                                    <FileText size={14} />
                                                )}
                                                {isDownloadingReport ? 'Downloading...' : 'Report'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-3 pt-2">
                                <button onClick={() => navigate('/dashboard')} className="flex-1 py-3 border-2 border-slate-200 rounded-xl font-bold text-xs text-slate-600 hover:bg-slate-50 transition-colors">Dashboard</button>
                                <button onClick={() => navigate('/results')} className="flex-1 py-3 border-2 border-slate-200 rounded-xl font-bold text-xs text-slate-600 hover:bg-slate-50 transition-colors">All Results</button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </MainLayout>
        );
    }

    const progressPercentage = allQuestionsCount > 0 ? Math.round((Object.keys(answers).length / allQuestionsCount) * 100) : 0;
    const currentQuestion = sections[activeSection]?.questions[currentQuestionIdx];

    return (
        <MainLayout user={user} isTesting={true}>
            <div className="h-full flex flex-col overflow-hidden bg-slate-50">
                {/* Real-time Exam Header */}
                <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-10 shadow-sm">
                    <div className="flex items-center gap-4">
                        <img src="/logo-1.png" alt="Navodaya Wala" className="h-10 w-auto object-contain" />
                        <h1 className="text-sm font-black text-slate-900 uppercase tracking-tighter">
                            {isJunior ? 'IQ TEST' : 'CAREER APTITUDE TEST'}
                        </h1>
                        <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded border border-amber-200 uppercase tracking-wider">Timed Session</span>
                    </div>
                    <button
                        onClick={() => { if (window.confirm('Quit exam and go to dashboard? Progressive save active.')) navigate('/dashboard') }}
                        className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-rose-600 transition-colors"
                    >
                        <X size={16} /> Exit Exam
                    </button>
                </div>

                <div className="h-1.5 bg-slate-200 w-full shrink-0 relative">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${progressPercentage}%` }} className="h-full bg-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.5)]" />
                </div>

                <div className="flex-1 flex overflow-hidden">
                    {/* Mobile Sidebar Backdrop & Drawer (Animated via AnimatePresence) */}
                    <AnimatePresence>
                        {isMobilePaletteOpen && (
                            <>
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[9999] lg:hidden"
                                    onClick={() => setIsMobilePaletteOpen(false)}
                                />
                                <motion.aside
                                    initial={{ x: '-100%' }}
                                    animate={{ x: 0 }}
                                    exit={{ x: '-100%' }}
                                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                                    className="fixed inset-y-0 left-0 w-80 bg-slate-50 border-r border-slate-200 flex flex-col z-[10000] shadow-2xl lg:hidden overflow-hidden"
                                >
                                    {renderSidebarContent(true)}
                                </motion.aside>
                            </>
                        )}
                    </AnimatePresence>

                    {/* Static Desktop Sidebar */}
                    <aside className="w-80 bg-slate-50 border-r border-slate-200 flex flex-col hidden lg:flex shrink-0">
                        {renderSidebarContent(false)}
                    </aside>

                    {/* Hide the legacy inline sidebar code */}
                    <div className="hidden">
                        <aside className="hidden">
                        {/* Section Navigation Tabs in Sidebar */}
                        <div className="p-4 border-b border-slate-200 bg-white shrink-0 flex items-center gap-2 shadow-sm">
                            <div className="flex-1 flex gap-2">
                                {sections.map((sec, sIdx) => {
                                    const isSectionActive = activeSection === sIdx;
                                    const sectionQuestions = sec.questions || [];
                                    const completedCount = sectionQuestions.filter((_, qIdx) => {
                                        const globalIdx = getGlobalIdx(sIdx, qIdx);
                                        return answers[globalIdx] !== undefined;
                                    }).length;

                                    return (
                                        <button
                                            key={sIdx}
                                            onClick={() => {
                                                setActiveSection(sIdx);
                                                setCurrentQuestionIdx(0);
                                            }}
                                            className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-xl border text-[9px] md:text-[10px] font-black transition-all ${
                                                isSectionActive
                                                    ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                                                    : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                                            }`}
                                        >
                                            <span>SEC {String.fromCharCode(65 + sIdx)}</span>
                                            <span className={`px-1.5 py-0.5 rounded-full text-[8px] md:text-[9px] ${
                                                isSectionActive ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-400'
                                            }`}>
                                                {completedCount}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                            <button
                                onClick={() => setIsMobilePaletteOpen(false)}
                                className="lg:hidden p-2 hover:bg-slate-100 rounded-xl text-slate-400"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Sidebar Scrollable Area */}
                        <div className="flex-1 overflow-y-auto p-6 scroll-smooth space-y-6 scrollbar-none">
                            {sections[activeSection]?.chapters?.map((chap, cIdx) => (
                                <div key={chap.id || cIdx} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                                    {/* Chapter Header */}
                                    <button
                                        onClick={() => {
                                            if (chap.questions && chap.questions.length > 0) {
                                                const firstQuestionId = chap.questions[0].id;
                                                const flatIdx = sections[activeSection].questions.findIndex(q => q.id === firstQuestionId);
                                                if (flatIdx !== -1) {
                                                    setCurrentQuestionIdx(flatIdx);
                                                }
                                            }
                                        }}
                                        className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 border-b border-slate-200 transition-all text-left"
                                    >
                                        <span className="font-extrabold text-[10px] text-slate-800 uppercase tracking-wider">
                                            {chap.title}
                                        </span>
                                        <span className="text-[9px] font-bold bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">
                                            {chap.questions?.length || 0} Qs
                                        </span>
                                    </button>

                                    {/* Chapter Questions Palette Grid (Square Boxes) */}
                                    <div className="flex flex-wrap gap-2 p-4 bg-white">
                                        {chap.questions?.map((q) => {
                                            const flatIdx = sections[activeSection].questions.findIndex(question => question.id === q.id);
                                            const globalIdx = getGlobalIdx(activeSection, flatIdx);
                                            const isCurrent = activeSection === activeSection && currentQuestionIdx === flatIdx;
                                            const status = getStatus(globalIdx);

                                            return (
                                                <button
                                                    key={q.id}
                                                    onClick={() => {
                                                        if (flatIdx !== -1) {
                                                            setCurrentQuestionIdx(flatIdx);
                                                            setIsMobilePaletteOpen(false);
                                                        }
                                                    }}
                                                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black transition-all border-2 ${
                                                        isCurrent
                                                            ? 'ring-2 ring-indigo-200 ring-offset-2 scale-110 z-10 border-indigo-600 bg-indigo-600 text-white'
                                                            : status === 'answered'
                                                            ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm'
                                                            : status === 'marked'
                                                            ? 'bg-amber-500 border-amber-500 text-white'
                                                            : status === 'not-answered'
                                                            ? 'bg-rose-500 border-rose-500 text-white'
                                                            : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'
                                                    }`}
                                                >
                                                    {flatIdx + 1}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}

                            {/* Status Indicator Legend */}
                            <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-4 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="w-4 h-4 rounded bg-emerald-500" />
                                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Answered</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-4 h-4 rounded bg-rose-500" />
                                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Unanswered</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-4 h-4 rounded bg-white border-2 border-slate-200" />
                                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Not Visited</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-4 h-4 rounded bg-amber-500" />
                                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Review</span>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar Footer Submission Button */}
                        <div className="p-6 bg-white border-t border-slate-200 shrink-0">
                            <button onClick={() => handleSubmit(false)} disabled={submitting} className="w-full py-3 bg-indigo-600 text-white font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 disabled:opacity-50">
                                {submitting ? 'Syncing...' : 'Final Submission'}
                            </button>
                        </div>
                        </aside>
                    </div>

                    {/* Right Main Question Area */}
                    <div className="flex-1 flex flex-col overflow-hidden bg-white">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-black text-slate-900 uppercase tracking-wider">Section {String.fromCharCode(65 + activeSection)}</span>
                                <button
                                    onClick={() => setIsMobilePaletteOpen(true)}
                                    className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-[9px] font-black uppercase tracking-wider text-slate-600 transition-colors"
                                >
                                    <LayoutGrid size={12} /> Palette
                                </button>
                            </div>
                            <div className="flex items-center gap-2 font-mono font-bold text-slate-700 bg-slate-50 px-4 py-1.5 rounded-full border border-slate-100">
                                <Timer size={14} className={timeLeft < 300 ? 'text-rose-500' : 'text-slate-400'} />
                                <span className={timeLeft < 300 ? 'text-rose-600 animate-pulse font-black' : ''}>{formatTime(timeLeft)}</span>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto py-6 px-6 md:px-12 lg:px-16 custom-scrollbar">
                            <div className="max-w-full mx-auto space-y-6">
                                <div className="space-y-3">
                                    <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] px-3 py-1 bg-indigo-50 rounded-lg">Question #{getGlobalIdx(activeSection, currentQuestionIdx) + 1}</span>
                                    <div
                                        className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight q-text-html"
                                        dangerouslySetInnerHTML={{ __html: currentQuestion?.question }}
                                    />
                                </div>

                                {currentQuestion?.image && (
                                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex justify-center shadow-inner">
                                        <img src={currentQuestion.image} alt="Diagnostic Context" className="max-h-[220px] rounded shadow-sm border border-white" />
                                    </div>
                                )}

                                <div className="grid grid-cols-1 gap-3.5">
                                    {currentQuestion?.options?.map((opt, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => {
                                                setAnswers(prev => ({ ...prev, [currentGlobalIdx]: idx }));
                                                if (currentGlobalIdx < allQuestionsCount - 1) {
                                                    setTimeout(() => {
                                                        handleNext();
                                                    }, 150);
                                                }
                                            }}
                                            className={`w-full flex items-center p-4 md:p-3 rounded-2xl border-2 transition-all text-left group ${answers[currentGlobalIdx] === idx
                                                ? 'border-indigo-600 bg-indigo-50/30'
                                                : 'border-slate-100 hover:border-slate-300 bg-white'
                                                }`}
                                        >
                                            <div className={`w-10 h-10 rounded-xl border flex items-center justify-center font-black text-sm mr-6 transition-all ${answers[currentGlobalIdx] === idx ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-500'
                                                }`}>
                                                {opt.key}
                                            </div>
                                            <div
                                                className={`font-bold text-lg transition-all ${answers[currentGlobalIdx] === idx ? 'text-slate-900' : 'text-slate-600'}`}
                                                dangerouslySetInnerHTML={{ __html: opt.text }}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="h-24 bg-white border-t border-slate-200 flex items-center justify-between px-6 md:px-12 shrink-0 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
                            <div className="flex items-center gap-8">
                                <button onClick={() => setMarked(p => { let n = new Set(p); if (n.has(currentGlobalIdx)) n.delete(currentGlobalIdx); else n.add(currentGlobalIdx); return n; })} className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-colors ${marked.has(currentGlobalIdx) ? 'text-amber-600 bg-amber-50 px-4 py-2 rounded-lg' : 'text-slate-400 hover:text-slate-900'}`}>
                                    <Flag size={18} /> {marked.has(currentGlobalIdx) ? 'Review Priority set' : 'Save for Review'}
                                </button>
                                <div className="h-6 w-px bg-slate-200" />
                                <button onClick={() => setAnswers(p => { let n = { ...p }; delete n[currentGlobalIdx]; return n; })} className="text-[10px] font-black text-slate-300 hover:text-rose-500 transition-colors flex items-center gap-2 uppercase tracking-widest" title="Clear selection">
                                    <Trash2 size={18} /> Clear Option
                                </button>
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleBack}
                                    disabled={currentGlobalIdx === 0}
                                    className="px-4 py-3 md:px-5 md:py-3 bg-white border border-slate-300 text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-50 transition-all flex items-center gap-2"
                                >
                                    <ArrowLeft size={16} />
                                    <span className="hidden md:inline">Prev</span>
                                </button>

                                <button
                                    onClick={currentGlobalIdx === allQuestionsCount - 1 ? () => handleSubmit(false) : handleNext}
                                    className="px-4 py-3 md:px-5 md:py-3 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-800 transition-all flex items-center gap-2 shadow-2xl shadow-slate-900/10 active:scale-95"
                                >
                                    {currentGlobalIdx === allQuestionsCount - 1 ? (
                                        submitting ? (
                                            'Syncing...'
                                        ) : (
                                            'Submit & Finish'
                                        )
                                    ) : (
                                        <>
                                            <span className="hidden md:inline">Next</span>
                                            <ArrowRight size={16} />
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* Custom Submission Modal */}
                    {showSubmitModal && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                            {/* Translucent overlay with backdrop blur */}
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="fixed inset-0 bg-slate-900/60 backdrop-blur-md" 
                                onClick={() => setShowSubmitModal(false)}
                            />
                            
                            {/* Modal content box */}
                            <motion.div 
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-slate-100 flex flex-col items-center text-center space-y-6 relative z-10"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500">
                                    <AlertCircle size={32} />
                                </div>
                                
                                <div className="space-y-2">
                                    <h3 className="text-xl font-extrabold text-slate-900">
                                        {Object.keys(answers).length < allQuestionsCount ? 'Unfinished Questions' : 'Confirm Submission'}
                                    </h3>
                                    <p className="text-slate-500 text-sm font-medium leading-relaxed">
                                        {Object.keys(answers).length < allQuestionsCount 
                                            ? "You haven't visited or attended all the questions. So do you really want to submit?" 
                                            : "Are you sure you want to submit your assessment? Once submitted, your answers cannot be modified."}
                                    </p>
                                </div>
                                
                                <div className="flex w-full gap-3">
                                    <button 
                                        onClick={() => setShowSubmitModal(false)}
                                        className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-widest rounded-xl transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        onClick={() => {
                                            setShowSubmitModal(false);
                                            executeSubmit();
                                        }}
                                        className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-colors shadow-lg shadow-rose-200"
                                    >
                                        Yes, Submit
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
};

export default Assessment;
