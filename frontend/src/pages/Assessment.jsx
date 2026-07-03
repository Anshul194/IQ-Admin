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
import { getQuizQuestions, submitAssessment, clearAssessment } from '../store/slices/assessmentSlice';
import { downloadCertificate, downloadReport } from '../utils/api';

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

    // Data States
    const [answers, setAnswers] = useState({});
    const [marked, setMarked] = useState(new Set());
    const [visited, setVisited] = useState(new Set([0]));

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
        } else if (timeLeft === 0 && !loading) handleSubmit();
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

    const handleSubmit = async () => {
        const formattedAnswers = Object.entries(answers).map(([gIdx, optionIdx]) => {
            let cumulative = 0;
            let qData = null;
            for (let s of sections) {
                if (parseInt(gIdx) < cumulative + s.questions.length) {
                    qData = s.questions[parseInt(gIdx) - cumulative];
                    break;
                }
                cumulative += s.questions.length;
            }
            return {
                questionId: qData.id,
                selectedOption: qData.options[optionIdx].key
            };
        });

        const timeTaken = Math.round((Date.now() - startTime) / 60000);

        const payload = {
            examId: examId,
            timeTaken,
            answers: formattedAnswers
        };

        dispatch(submitAssessment(payload));
    };

    if (loading) return <div className="h-screen flex items-center justify-center bg-white"><div className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin" /></div>;
    if (error) return <div className="h-screen flex flex-col items-center justify-center bg-white p-6 text-center"><AlertCircle size={48} className="text-rose-500 mb-4" /><h2 className="text-2xl font-bold mb-2">Sync Error</h2><p className="text-slate-500 mb-6 max-w-sm">{error}</p><button onClick={() => window.location.reload()} className="px-10 py-3 bg-slate-900 text-white rounded font-bold">Retry Connection</button></div>;

    if (isFinished && lastResult) {
        const isPassed = lastResult.status === 'PASSED';
        const areas = lastResult.areas || [];
        const resultId = lastResult.resultId || lastResult._id;
        const totalQ = lastResult.totalQuestions || 40;
        const pct = lastResult.percentage ?? lastResult.totalPercentage ?? Math.round((lastResult.correctAnswers / totalQ) * 100);
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
                                    <h2 className="text-4xl font-black text-slate-900 leading-tight">Congratulations,<br />{user?.name}!</h2>
                                    <p className="text-slate-600 font-medium">You have successfully cleared the {isJunior ? 'IQ TEST' : 'Career Test'} with excellence.</p>
                                    <div className="inline-block px-6 py-3 bg-emerald-500 text-white font-bold rounded-full text-xl shadow-lg">PASSED</div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center mx-auto text-slate-500">
                                        <RefreshCw size={48} />
                                    </div>
                                    <h2 className="text-4xl font-black text-slate-900 leading-tight">Keep Practicing,<br />{user?.name}</h2>
                                    <p className="text-slate-600 font-medium">You were close! Re-review your weak areas in the {isJunior ? 'IQ TEST' : 'Career Test'} and try again to unlock your certificate.</p>
                                    <div className="inline-block px-6 py-3 bg-slate-400 text-white font-bold rounded-full text-xl shadow-lg">RE-ATTEMPT</div>
                                </div>
                            )}
                        </div>

                        <div className="flex-1 p-10 space-y-6 overflow-y-auto max-h-[80vh]">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-5 bg-slate-50 rounded-xl border border-slate-100">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Score</p>
                                    <p className="text-3xl font-black text-slate-900">{pct}%</p>
                                </div>
                                <div className="p-5 bg-slate-50 rounded-xl border border-slate-100">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Correct</p>
                                    <p className="text-3xl font-black text-slate-900">{lastResult.correctAnswers || lastResult.correctAnswersCount}/{totalQ}</p>
                                </div>
                                {isPassed && lastResult.iqScore && (
                                    <div className="p-5 bg-indigo-50 rounded-xl border border-indigo-100 col-span-2">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-1">IQ Score</p>
                                        <p className="text-3xl font-black text-indigo-600">{lastResult.iqScore}</p>
                                    </div>
                                )}
                            </div>

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
                                            onClick={() => downloadCertificate(resultId)}
                                            className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-slate-800 transition-all"
                                        >
                                            <Download size={14} /> Certificate
                                        </button>
                                        <button
                                            onClick={() => downloadReport(resultId)}
                                            className="flex-1 flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white rounded-xl font-bold text-xs hover:bg-indigo-700 transition-all"
                                        >
                                            <FileText size={14} /> Report
                                        </button>
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
                        <div className="w-8 h-8 bg-slate-900 rounded flex items-center justify-center text-white">
                            <Brain size={18} />
                        </div>
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
                    <div className="flex-1 flex flex-col overflow-hidden border-r border-slate-200 bg-white">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Section {activeSection + 1}</span>
                                <div className="h-3 w-px bg-slate-300" />
                                <span className="text-xs font-bold text-slate-900 uppercase">{sections[activeSection]?.title || 'Loading...'}</span>
                            </div>
                            <div className="flex items-center gap-2 font-mono font-bold text-slate-700 bg-slate-50 px-4 py-1.5 rounded-full border border-slate-100">
                                <Timer size={14} className={timeLeft < 300 ? 'text-rose-500' : 'text-slate-400'} />
                                <span className={timeLeft < 300 ? 'text-rose-600 animate-pulse font-black' : ''}>{formatTime(timeLeft)}</span>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 md:p-12 lg:p-16 custom-scrollbar">
                            <div className="max-w-3xl mx-auto space-y-12">
                                <div className="space-y-6">
                                    <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] px-3 py-1 bg-indigo-50 rounded-lg">Question #{getGlobalIdx(activeSection, currentQuestionIdx) + 1}</span>
                                    <div
                                        className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight q-text-html"
                                        dangerouslySetInnerHTML={{ __html: currentQuestion?.question }}
                                    />
                                </div>

                                {currentQuestion?.image && (
                                    <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl flex justify-center shadow-inner">
                                        <img src={currentQuestion.image} alt="Diagnostic Context" className="max-h-[300px] rounded shadow-sm border border-white" />
                                    </div>
                                )}

                                <div className="grid grid-cols-1 gap-4">
                                    {currentQuestion?.options.map((opt, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setAnswers(prev => ({ ...prev, [currentGlobalIdx]: idx }))}
                                            className={`w-full flex items-center p-6 rounded-2xl border-2 transition-all text-left group ${answers[currentGlobalIdx] === idx
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

                            <button onClick={handleNext} className="px-14 py-4 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-800 transition-all flex items-center gap-3 shadow-2xl shadow-slate-900/10 active:scale-95">
                                {currentGlobalIdx === allQuestionsCount - 1 ? (submitting ? 'Authenticating...' : 'Submit & Finish') : 'Save & Continue'}
                                {currentGlobalIdx !== allQuestionsCount - 1 && <ArrowRight size={18} />}
                            </button>
                        </div>
                    </div>

                    <aside className="w-80 bg-slate-50 border-l border-slate-200 flex flex-col hidden lg:flex shrink-0">
                        <div className="flex border-b border-slate-200 bg-white shrink-0">
                            <button onClick={() => setSidebarTab('palette')} className={`flex-1 flex items-center justify-center gap-2 py-5 text-[10px] font-black uppercase tracking-widest transition-all ${sidebarTab === 'palette' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/10' : 'text-slate-400'}`}>Palette</button>
                            <button onClick={() => setSidebarTab('content')} className={`flex-1 flex items-center justify-center gap-2 py-5 text-[10px] font-black uppercase tracking-widest transition-all ${sidebarTab === 'content' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/10' : 'text-slate-400'}`}>By Section</button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
                            {sidebarTab === 'palette' ? (
                                <div className="space-y-10">
                                    <div className="grid grid-cols-4 gap-3">
                                        {[...Array(allQuestionsCount)].map((_, i) => {
                                            const status = getStatus(i);
                                            return (
                                                <button key={i} onClick={() => {
                                                    let cumulative = 0;
                                                    for (let sIdx = 0; sIdx < sections.length; sIdx++) {
                                                        if (i < cumulative + sections[sIdx].questions.length) {
                                                            setActiveSection(sIdx);
                                                            setCurrentQuestionIdx(i - cumulative);
                                                            break;
                                                        }
                                                        cumulative += sections[sIdx].questions.length;
                                                    }
                                                }}
                                                    className={`aspect-square rounded-lg flex items-center justify-center text-[11px] font-black transition-all border-2 ${currentGlobalIdx === i ? 'ring-2 ring-indigo-200 ring-offset-4 scale-110 z-10' : ''
                                                        } ${status === 'answered' ? 'bg-emerald-500 border-emerald-500 text-white shadow-md' :
                                                            status === 'marked' ? 'bg-amber-500 border-amber-500 text-white' :
                                                                status === 'not-answered' ? 'bg-rose-500 border-rose-500 text-white' :
                                                                    'bg-white border-slate-200 text-slate-400'
                                                        }`}>
                                                    {i + 1}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-4 shadow-sm">
                                        <div className="flex items-center gap-3"><div className="w-4 h-4 rounded bg-emerald-500" /><span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Answered</span></div>
                                        <div className="flex items-center gap-3"><div className="w-4 h-4 rounded bg-rose-500" /><span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Unanswered</span></div>
                                        <div className="flex items-center gap-3"><div className="w-4 h-4 rounded bg-white border-2 border-slate-200" /><span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Not Visited</span></div>
                                        <div className="flex items-center gap-3"><div className="w-4 h-4 rounded bg-amber-500" /><span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Review</span></div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {sections.map((section, sIdx) => (
                                        <div key={sIdx} className="border border-slate-200 rounded-xl bg-white overflow-hidden shadow-sm">
                                            <button onClick={() => {
                                                const next = new Set(expandedSections);
                                                if (next.has(sIdx)) next.delete(sIdx); else next.add(sIdx);
                                                setExpandedSections(next);
                                            }} className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-all font-bold text-xs uppercase text-slate-900 tracking-tight">
                                                {section.title}
                                                {expandedSections.has(sIdx) ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                            </button>
                                            <AnimatePresence>
                                                {expandedSections.has(sIdx) && (
                                                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden bg-slate-50/30">
                                                        {section.questions.map((_, qIdx) => (
                                                            <button key={qIdx} onClick={() => { setActiveSection(sIdx); setCurrentQuestionIdx(qIdx); }} className={`w-full p-4 pl-10 text-left text-[11px] font-bold border-l-4 transition-all ${activeSection === sIdx && currentQuestionIdx === qIdx ? 'bg-indigo-50 text-indigo-700 border-indigo-600' : 'text-slate-500 border-transparent hover:bg-slate-50'}`}>Q{qIdx + 1}: Diagnostic Item</button>
                                                        ))}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="p-6 bg-white border-t border-slate-200">
                            <button onClick={handleSubmit} disabled={submitting} className="w-full py-4 bg-indigo-600 text-white font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 disabled:opacity-50">
                                {submitting ? 'Syncing...' : 'Final Submission'}
                            </button>
                        </div>
                    </aside>
                </div>
            </div>
        </MainLayout>
    );
};

export default Assessment;
