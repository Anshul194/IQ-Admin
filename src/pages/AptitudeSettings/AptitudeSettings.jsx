import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

const AptitudeSettings = () => {
    const [config, setConfig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const res = await api.get('/aptitude-results/config/settings');
                setConfig(res.data);
                setLoading(false);
            } catch (error) {
                console.error('Error:', error);
                setLoading(false);
            }
        };
        fetchConfig();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.patch('/aptitude-results/config/settings', config);
            setMessage('Settings updated successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('Error saving config:', error);
            setMessage('Failed to save settings.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8">Loading settings...</div>;
    if (!config) return <div className="p-8">Failed to load configuration.</div>;

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6 border-b pb-4">
                <h1 className="text-2xl font-bold text-gray-800">Aptitude Test Settings</h1>
                {message && <span className="text-sm font-semibold text-green-600 bg-green-50 px-3 py-1 rounded">{message}</span>}
            </div>

            <form onSubmit={handleSave} className="space-y-8">
                {/* 1. Global Time */}
                <div className="bg-white p-6 border rounded shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Global Settings</h2>
                    <div className="max-w-xs">
                        <label className="block text-sm font-medium text-gray-600 mb-1">Max Exam Duration (Minutes)</label>
                        <input
                            type="number"
                            value={config.maxTimeMinutes}
                            onChange={(e) => setConfig({ ...config, maxTimeMinutes: Number(e.target.value) })}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>
                </div>

                {/* 2. Interests (Section 1) */}
                <div className="bg-white p-6 border rounded shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Interest & Personality (Section 1 Careers)</h2>
                    <div className="space-y-6">
                        {config.careerPairs.map((pair, idx) => (
                            <div key={idx} className="flex flex-col md:flex-row gap-4 p-4 bg-gray-50 border rounded items-center">
                                <div className="w-full md:w-16 text-center font-bold text-gray-500 text-sm">
                                    Chap {pair.chapterSequence}
                                </div>
                                <div className="flex-1 w-full relative">
                                    <label className="block text-xs font-semibold text-gray-500 mb-1">First Career Name</label>
                                    <input
                                        type="text"
                                        value={pair.career1}
                                        onChange={(e) => {
                                            const newPairs = [...config.careerPairs];
                                            newPairs[idx].career1 = e.target.value;
                                            setConfig({ ...config, careerPairs: newPairs });
                                        }}
                                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                                <div className="flex-1 w-full relative">
                                    <label className="block text-xs font-semibold text-gray-500 mb-1">Second Career Name</label>
                                    <input
                                        type="text"
                                        value={pair.career2}
                                        onChange={(e) => {
                                            const newPairs = [...config.careerPairs];
                                            newPairs[idx].career2 = e.target.value;
                                            setConfig({ ...config, careerPairs: newPairs });
                                        }}
                                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 3. Academic (Section 2) */}
                <div className="bg-white p-6 border rounded shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Academic Subjects (Section 2)</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {config.academicSubjects.map((sub, idx) => (
                            <div key={idx} className="w-full">
                                <label className="block text-xs font-semibold text-gray-500 mb-1">Chap {sub.chapterSequence} Subject</label>
                                <input
                                    type="text"
                                    value={sub.subjectName}
                                    onChange={(e) => {
                                        const newSubs = [...config.academicSubjects];
                                        newSubs[idx].subjectName = e.target.value;
                                        setConfig({ ...config, academicSubjects: newSubs });
                                    }}
                                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="py-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-6 py-2 bg-blue-600 text-white font-semibold rounded shadow hover:bg-blue-700 disabled:opacity-50"
                    >
                        {saving ? 'Saving...' : 'Save Configuration'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AptitudeSettings;
