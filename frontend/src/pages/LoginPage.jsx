import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Calendar, ArrowRight, ShieldCheck, AlertCircle, CheckCircle2, Star, Users, Award, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginStudent } from '../store/slices/authSlice';
import { Link } from 'react-router-dom';

// ─── Login Page ────────────────────────────────────────────────────────────
const LoginPage = () => {
    const [phone, setPhone] = useState('');
    const [dob, setDob] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.auth);

    const handleLogin = async (e) => {
        e.preventDefault();
        const res = await dispatch(loginStudent({ mobileNumber: phone, dob }));
        if (loginStudent.fulfilled.match(res)) navigate('/dashboard');
    };

    const highlights = [
        { icon: CheckCircle2, text: 'Instant IQ & Career Reports' },
        { icon: ShieldCheck, text: 'Secure AI-Proctored Exams' },
        { icon: Star, text: 'Trusted by 500+ Schools' },
        { icon: Award, text: 'Scholarship Opportunities' },
    ];

    return (
        <div className="h-screen w-screen overflow-hidden flex font-sans antialiased">

            {/* ── LEFT PANEL (Stats pinned to the very bottom, no gap) ────────────────────────────── */}
            <div className="hidden lg:flex lg:w-1/2 h-screen bg-indigo-950 relative overflow-hidden flex-col justify-between">

                {/* Background wash */}
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950" />
                    <div className="absolute -top-1/4 -right-1/4 w-[140%] h-[140%] bg-gradient-to-bl from-indigo-500/15 via-transparent to-transparent rotate-12" />
                </div>

                {/* Headline block */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative z-10 px-12 mt-24"
                >
                    <span className="inline-block text-[11px] font-black uppercase tracking-[0.3em] text-indigo-300 mb-4">
                        Know Yourself Better
                    </span>
                    <h2 className="text-[44px] xl:text-[52px] font-black leading-[1.05] text-white max-w-xl">
                        Discover Your True Intelligence
                    </h2>
                    <p className="text-indigo-200 text-base leading-relaxed max-w-lg mt-5">
                        India's most trusted psychometric platform for students. Get your IQ score, career guidance, and scholarship pathways — all in one report.
                    </p>
                </motion.div>

                {/* Bottom — highlights grid + stat strip, flush with viewport bottom */}
                <div className="relative z-10">
                    <div className="grid grid-cols-2 border-t border-white/10">
                        {highlights.map((h, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + i * 0.08 }}
                                className={`flex items-center gap-3 px-12 py-5 ${i % 2 === 0 ? 'border-r' : ''} ${i < 2 ? 'border-b' : ''} border-white/10`}
                            >
                                <h.icon size={18} className="text-indigo-300 shrink-0" />
                                <span className="text-sm font-bold text-white">{h.text}</span>
                            </motion.div>
                        ))}
                    </div>

                    {/* Stat strip — flush at the very bottom, no padding/gap below */}
                    <div className="grid grid-cols-3 bg-indigo-600">
                        {[
                            { val: '50K+', label: 'Students' },
                            { val: '500+', label: 'Schools' },
                            { val: '98%', label: 'Satisfaction' },
                        ].map((s, i) => (
                            <div key={i} className={`text-center py-5 ${i !== 2 ? 'border-r border-white/20' : ''}`}>
                                <div className="text-2xl font-black text-white">{s.val}</div>
                                <div className="text-[10px] font-bold text-indigo-100 uppercase tracking-widest mt-0.5">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── RIGHT PANEL (White - unchanged) ────────────────────────────── */}
            <div className="w-full lg:w-1/2 h-screen bg-white flex items-center justify-center p-6 lg:p-10 relative overflow-hidden">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="w-full max-w-md space-y-4"
                >
                    {/* Header */}
                    <div className=" top-4 left-4 flex items-center mb-9 gap-2">
                    <img src="/logo-1.png" alt="Navodaya Wala" className="h-9 w-auto  object-contain" />
                </div>
                    <div className="space-y-1.5">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100">
                            <Sparkles size={10} /> Student Portal
                        </div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-2">Welcome Back</h1>
                        <p className="text-slate-500 text-xs">Sign in to access your IQ assessment dashboard and reports.</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleLogin} className="space-y-3.5">
                        {/* Phone */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Mobile Number</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                    <Phone size={15} />
                                </div>
                                <input
                                    type="tel"
                                    required
                                    placeholder="Enter your 10-digit mobile number"
                                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 placeholder:text-slate-300 placeholder:font-normal focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* DOB */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Date of Birth</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                    <Calendar size={15} />
                                </div>
                                <input
                                    type="date"
                                    required
                                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all"
                                    value={dob}
                                    onChange={(e) => setDob(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-3 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-600"
                            >
                                <AlertCircle size={15} className="shrink-0" />
                                <span className="text-xs font-bold">{typeof error === 'string' ? error : 'Invalid credentials. Please check your mobile number and date of birth.'}</span>
                            </motion.div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 bg-indigo-600 text-white rounded-xl font-black text-sm hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Verifying Identity...
                                </>
                            ) : (
                                <>Sign In to Dashboard <ArrowRight size={16} /></>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative flex items-center gap-4">
                        <div className="flex-1 h-px bg-slate-100" />
                        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Secure Login</span>
                        <div className="flex-1 h-px bg-slate-100" />
                    </div>

                    {/* Trust row */}
                    <div className="flex items-center justify-center gap-6">
                        {[
                            { icon: ShieldCheck, label: 'SSL Encrypted' },
                            { icon: Users, label: '50K+ Students' },
                            { icon: Star, label: 'Trusted Platform' },
                        ].map((t, i) => (
                            <div key={i} className="flex flex-col items-center gap-1 text-center">
                                <div className="w-8 h-8 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                                    <t.icon size={15} />
                                </div>
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider leading-tight">{t.label}</span>
                            </div>
                        ))}
                    </div>

                    {/* Footer */}
                    <div className="text-center space-y-2">
                        <p className="text-[11px] text-slate-400">
                            By signing in, you agree to our{' '}
                            <a href="#" className="text-indigo-600 font-bold hover:underline">Terms of Use</a>
                            {' '}and{' '}
                            <a href="#" className="text-indigo-600 font-bold hover:underline">Privacy Policy</a>
                        </p>
                        <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors">
                            ← Back to Home
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default LoginPage;