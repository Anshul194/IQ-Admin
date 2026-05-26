import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Compass, Play, FileText, Users, Award, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/MainLayout';

import { useDispatch, useSelector } from 'react-redux';
import { getMyResults } from '../store/slices/assessmentSlice';
import { useEffect } from 'react';

const Dashboard = ({ user }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { results, loading } = useSelector((state) => state.assessment);
    const isJunior = parseInt(user?.grade) <= 6;

    useEffect(() => {
        dispatch(getMyResults());
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
                                onClick={() => navigate('/assessment')}
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
                                                {parseInt(user?.grade) <= 6 ? 'IQ TEST' : 'Career Test'}
                                            </td>
                                            <td className="px-6 py-4 text-slate-500 font-medium">{new Date(res.createdAt).toLocaleDateString()}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${res.status === 'pass' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-100 text-slate-500'}`}>
                                                    {res.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button onClick={() => navigate(`/results/${res._id}`)} className="text-violet-600 font-bold text-xs hover:underline">View Breakdown</button>
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
        </MainLayout>
    );
};

export default Dashboard;
