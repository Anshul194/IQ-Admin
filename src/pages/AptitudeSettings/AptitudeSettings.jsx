import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings2, Save, Loader2, Clock, Target, BookOpen, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../../utils/api';

const AptitudeSettings = () => {
    const [config, setConfig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [msgType, setMsgType] = useState('success');

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const res = await api.get('/aptitude-results/config/settings');
                setConfig(res.data);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchConfig();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');
        try {
            await api.patch('/aptitude-results/config/settings', config);
            setMsgType('success');
            setMessage('Configuration updated successfully!');
        } catch (error) {
            setMsgType('error');
            setMessage('Failed to save settings.');
        } finally {
            setSaving(false);
            setTimeout(() => setMessage(''), 3000);
        }
    };

    if (loading) return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
                <Loader2 size={32} className="animate-spin text-indigo-500" />
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading configuration...</p>
            </div>
        </div>
    );

    if (!config) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
            <AlertCircle size={48} className="text-rose-400" />
            <p className="text-sm font-bold text-slate-500">Failed to load configuration.</p>
            <button onClick={() => window.location.reload()} className="px-6 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold">Retry</button>
        </div>
    );

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-10 pb-16 font-sans">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
                        <Settings2 size={24} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Aptitude Core Config</h1>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Career Interest & Academic Settings</p>
                    </div>
                </div>
                {message && (
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest ${
                        msgType === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-rose-50 text-rose-600 border border-rose-200'
                    }`}>
                        {msgType === 'success' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                        {message}
                    </div>
                )}
            </div>

            <form onSubmit={handleSave} className="space-y-8">
                {/* 1. Global Time */}
                <div className="bg-white border border-slate-100 rounded-[32px] p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-6 pb-5 border-b border-slate-50">
                        <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl"><Clock size={18} /></div>
                        <div>
                            <h2 className="text-sm font-black text-slate-800 uppercase tracking-tight">Global Duration</h2>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Maximum time for the full aptitude assessment</p>
                        </div>
                    </div>
                    <div className="max-w-xs">
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Max Duration (Minutes)</label>
                        <input
                            type="number"
                            value={config.maxTimeMinutes}
                            onChange={(e) => setConfig({ ...config, maxTimeMinutes: Number(e.target.value) })}
                            className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all"
                            required
                        />
                    </div>
                </div>

                {/* 2. Career Pairs */}
                <div className="bg-white border border-slate-100 rounded-[32px] p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-6 pb-5 border-b border-slate-50">
                        <div className="p-2.5 bg-violet-50 text-violet-600 rounded-xl"><Target size={18} /></div>
                        <div>
                            <h2 className="text-sm font-black text-slate-800 uppercase tracking-tight">Interest & Personality — Career Pairs</h2>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Section 1 — Each chapter maps to a career pair (10 disciplines total)</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        {config.careerPairs.map((pair, idx) => (
                            <div key={idx} className="flex flex-col md:flex-row md:items-center gap-4 p-5 bg-slate-50 border border-slate-100 rounded-2xl">
                                <div className="w-full md:w-20 shrink-0">
                                    <span className="inline-block px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-[10px] font-black uppercase tracking-wider">Chap {pair.chapterSequence}</span>
                                </div>
                                <div className="flex-1">
                                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">First Career</label>
                                    <input
                                        type="text"
                                        value={pair.career1}
                                        onChange={(e) => {
                                            const newPairs = [...config.careerPairs];
                                            newPairs[idx].career1 = e.target.value;
                                            setConfig({ ...config, careerPairs: newPairs });
                                        }}
                                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-800 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Second Career</label>
                                    <input
                                        type="text"
                                        value={pair.career2}
                                        onChange={(e) => {
                                            const newPairs = [...config.careerPairs];
                                            newPairs[idx].career2 = e.target.value;
                                            setConfig({ ...config, careerPairs: newPairs });
                                        }}
                                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-800 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 3. Academic Subjects */}
                <div className="bg-white border border-slate-100 rounded-[32px] p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-6 pb-5 border-b border-slate-50">
                        <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl"><BookOpen size={18} /></div>
                        <div>
                            <h2 className="text-sm font-black text-slate-800 uppercase tracking-tight">Academic Subjects</h2>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Section 2 — Subject labels for academic proficiency assessment</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {config.academicSubjects.map((sub, idx) => (
                            <div key={idx} className="p-5 bg-slate-50 border border-slate-100 rounded-2xl">
                                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Chap {sub.chapterSequence}</label>
                                <input
                                    type="text"
                                    value={sub.subjectName}
                                    onChange={(e) => {
                                        const newSubs = [...config.academicSubjects];
                                        newSubs[idx].subjectName = e.target.value;
                                        setConfig({ ...config, academicSubjects: newSubs });
                                    }}
                                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-800 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-indigo-600 transition-all flex items-center gap-3 shadow-xl shadow-slate-200 disabled:opacity-60"
                    >
                        {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                        {saving ? 'Saving...' : 'Save Configuration'}
                    </button>
                </div>
            </form>
        </motion.div>
    );
};

export default AptitudeSettings;
