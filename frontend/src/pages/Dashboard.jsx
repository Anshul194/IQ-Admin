import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Compass, Play, FileText, Users, Award, ChevronRight, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/MainLayout';

import { useDispatch, useSelector } from 'react-redux';
import { getMyResults } from '../store/slices/assessmentSlice';
import api from '../utils/api';

const Dashboard = ({ user }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { results, loading } = useSelector((state) => state.assessment);
    const isJunior = parseInt(user?.grade) <= 6;

    const [examTypes, setExamTypes] = useState([]);
    const [showLanguageModal, setShowLanguageModal] = useState(false);
    const [availableLanguages, setAvailableLanguages] = useState([]);

    useEffect(() => {
        dispatch(getMyResults());
        const loadExamTypes = async () => {
            try {
                const response = await api.get('/exam-types');
                const examTypesList = response?.data?.data || response?.data || response || [];
                setExamTypes(examTypesList);
            } catch (err) {
                console.error("Failed to load exam types:", err);
            }
        };
        loadExamTypes();
    }, [dispatch]);

    const cards = [
        { title: 'My Results', icon: <FileText size={20} />, text: 'View and download your diagnostic reports.', link: '/results' },
        { title: 'Leaderboard', icon: <Users size={20} />, text: 'See your ranking among global students.', link: '#' },
        { title: 'Certificates', icon: <Award size={20} />, text: 'Managed your earned achievement badges.', link: '#' }
    ];

    return (
        <MainLayout user={user}>
            <div className="p-6 md:p-10 lg:p-12 max-w-7xl mx-auto space-y-10">
                <header className="space-y-2">
                    <h2 className="text-3xl font-bold text-slate-800 tracking-tight">
                        {isJunior ? 'Mental Performance Hub' : 'Career Aptitude Portal'}
                    </h2>
                    <p className="text-slate-500 font-medium">Welcome back, <span className="text-slate-900 font-bold">{user.name}</span>. Start your session below.</p>
                </header>

                {/* Hero Test Card - Udemy Style */}
                <div className="bg-white border border-slate-200 rounded-lg overflow-hidden flex flex-col md:flex-row shadow-sm">
                    <div className="flex-1 p-8 md:p-12 space-y-6">
                        <div className="inline-flex px-3 py-1 bg-violet-50 text-violet-600 rounded text-[10px] font-bold uppercase tracking-wider border border-violet-100">
                            Recommended for you
                        </div>
                        <h3 className="text-4xl font-black text-slate-900 leading-tight">
                            {parseInt(user?.grade) <= 6 ? 'IQ TEST' : 'Career Test'}
                        </h3>
                        <p className="text-slate-600 text-lg leading-relaxed max-w-xl">
                            Our standard diagnostic test measures logic, memory, and spatial reasoning. Finish the test to unlock your career roadmap.
                        </p>
                        <div className="flex flex-wrap gap-4 pt-4">
                            <button
                                onClick={() => {
                                    const userGrade = user?.grade || '1';
                                    const gradeNumber = userGrade.match(/\d+/)?.[0] || userGrade;

                                    const matchingExamTypes = examTypes.filter(et => {
                                        const etClassNum = et.className?.match(/\d+/)?.[0] || et.className;
                                        return etClassNum === gradeNumber;
                                    });

                                    const languages = Array.from(new Set(matchingExamTypes.map(et => et.language).filter(Boolean)));

                                    if (languages.length > 1) {
                                        setAvailableLanguages(languages);
                                        setShowLanguageModal(true);
                                    } else if (languages.length === 1) {
                                        navigate(`/assessment?lang=${languages[0]}`);
                                    } else {
                                        navigate(`/assessment?lang=${user?.language || 'English'}`);
                                    }
                                }}
                                className="px-8 py-4 bg-violet-600 text-white rounded font-bold text-lg hover:bg-violet-700 transition-all flex items-center gap-2"
                            >
                                Start Test Now <Play size={20} fill="currentColor" />
                            </button>
                            <button className="px-8 py-4 border border-slate-300 rounded font-bold text-lg hover:bg-slate-50 transition-all text-slate-700">
                                View Details
                            </button>
                        </div>
                    </div>
                    <div className="w-full md:w-80 bg-slate-50 border-l border-slate-200 flex items-center justify-center p-10 shrink-0">
                        {isJunior ? <Brain size={120} className="text-slate-200" /> : <Compass size={120} className="text-slate-200" />}
                    </div>
                </div>

                {/* Grid of smaller cards */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cards.map((card, i) => (
                        <button key={i} className="bg-white border border-slate-200 p-6 rounded-lg text-left hover:border-slate-400 transition-all group">
                            <div className="w-10 h-10 rounded bg-slate-100 flex items-center justify-center mb-4 text-violet-600 group-hover:bg-violet-600 group-hover:text-white transition-all">
                                {card.icon}
                            </div>
                            <h4 className="font-bold text-lg text-slate-900 mb-1">{card.title}</h4>
                            <p className="text-slate-500 text-sm font-medium">{card.text}</p>
                        </button>
                    ))}
                </div>

                {/* History Table - Simple */}
                <div className="pt-10">
                    <h3 className="text-xl font-bold mb-6 text-slate-800">Recent Activity</h3>
                    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-wider border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4">Assessment Name</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Preview</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {results && results.length > 0 ? (
                                    results.map((res, i) => (
                                        <tr key={i} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 font-bold text-slate-800">
                                                {res.isAptitude ? 'Career Aptitude Test' : 'IQ Test'}
                                            </td>
                                            <td className="px-6 py-4 text-slate-500 font-medium">{new Date(res.createdAt).toLocaleDateString()}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${res.status === 'PASSED' || res.isAptitude ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-100 text-slate-500'}`}>
                                                    {res.isAptitude ? 'COMPLETED' : res.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button onClick={() => navigate(`/results/${res._id}?type=${res.isAptitude ? 'aptitude' : 'standard'}`)} className="text-violet-600 font-bold text-xs hover:underline">View Breakdown</button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center text-slate-400 font-medium">
                                            {loading ? 'Refreshing history...' : 'No recent tests found. Take your first test to see logs here.'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Language Selection Modal */}
            <AnimatePresence>
                {showLanguageModal && (
                    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100"
                        >
                            <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50">
                                <div>
                                    <h3 className="text-lg font-black text-slate-800">Select Exam Language</h3>
                                    <p className="text-xs text-slate-500 font-medium mt-0.5">Please choose your preferred language for the test</p>
                                </div>
                                <button
                                    onClick={() => setShowLanguageModal(false)}
                                    className="p-2 hover:bg-slate-200/60 rounded-xl text-slate-400 hover:text-slate-600 transition-all"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 gap-3">
                                    {availableLanguages.map((lang) => (
                                        <button
                                            key={lang}
                                            onClick={() => {
                                                setShowLanguageModal(false);
                                                navigate(`/assessment?lang=${lang}`);
                                            }}
                                            className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-violet-50 border border-slate-200 hover:border-violet-300 rounded-xl font-bold text-slate-800 hover:text-violet-700 transition-all group"
                                        >
                                            <span className="text-base font-black tracking-tight">{lang}</span>
                                            <span className="w-8 h-8 rounded-full bg-white border border-slate-200 group-hover:border-violet-300 flex items-center justify-center text-slate-400 group-hover:text-violet-600 shadow-sm transition-all text-sm font-black">
                                                →
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </MainLayout>
    );
};

export default Dashboard;
