import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Calendar, ArrowRight, Brain, ShieldCheck, AlertCircle, CheckCircle2, Star, Users, Award, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginStudent } from '../store/slices/authSlice';
import { Link } from 'react-router-dom';

// ─── Left Panel SVG ────────────────────────────────────────────────────────
const HeroIllustration = () => (
    <svg viewBox="0 0 400 340" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-sm mx-auto">
        {/* Background glow */}
        <circle cx="200" cy="170" r="140" fill="white" opacity="0.06" />
        <circle cx="200" cy="170" r="100" fill="white" opacity="0.06" />

        {/* Neural lines */}
        <line x1="200" y1="170" x2="90" y2="80" stroke="white" strokeWidth="1.2" strokeDasharray="5 4" opacity="0.3" />
        <line x1="200" y1="170" x2="310" y2="80" stroke="white" strokeWidth="1.2" strokeDasharray="5 4" opacity="0.3" />
        <line x1="200" y1="170" x2="70" y2="200" stroke="white" strokeWidth="1.2" strokeDasharray="5 4" opacity="0.3" />
        <line x1="200" y1="170" x2="330" y2="200" stroke="white" strokeWidth="1.2" strokeDasharray="5 4" opacity="0.3" />
        <line x1="200" y1="170" x2="130" y2="290" stroke="white" strokeWidth="1.2" strokeDasharray="5 4" opacity="0.3" />
        <line x1="200" y1="170" x2="270" y2="290" stroke="white" strokeWidth="1.2" strokeDasharray="5 4" opacity="0.3" />

        {/* Outer nodes */}
        <circle cx="90" cy="80" r="12" fill="white" opacity="0.15" />
        <circle cx="90" cy="80" r="6" fill="white" opacity="0.5" />
        <circle cx="310" cy="80" r="12" fill="white" opacity="0.15" />
        <circle cx="310" cy="80" r="6" fill="white" opacity="0.5" />
        <circle cx="70" cy="200" r="10" fill="white" opacity="0.12" />
        <circle cx="70" cy="200" r="5" fill="white" opacity="0.4" />
        <circle cx="330" cy="200" r="10" fill="white" opacity="0.12" />
        <circle cx="330" cy="200" r="5" fill="white" opacity="0.4" />
        <circle cx="130" cy="290" r="9" fill="white" opacity="0.1" />
        <circle cx="130" cy="290" r="4" fill="white" opacity="0.4" />
        <circle cx="270" cy="290" r="9" fill="white" opacity="0.1" />
        <circle cx="270" cy="290" r="4" fill="white" opacity="0.4" />

        {/* Center brain */}
        <circle cx="200" cy="170" r="46" fill="white" opacity="0.12" />
        <circle cx="200" cy="170" r="36" fill="white" opacity="0.18" />
        <path d="M182 158 C180 148 186 140 196 140 C200 136 208 136 212 140 C222 140 228 148 226 158 C230 162 230 172 226 176 C224 186 214 190 206 188 C202 192 196 192 192 188 C184 186 176 178 178 170 C174 166 176 160 182 158Z"
            fill="white" opacity="0.8" />
        <path d="M200 140 L200 188" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />

        {/* Score badge */}
        <rect x="256" y="46" width="76" height="40" rx="12" fill="white" opacity="0.18" />
        <text x="269" y="63" fontSize="8" fontWeight="700" fill="white" opacity="0.7" fontFamily="Inter,sans-serif">IQ SCORE</text>
        <text x="269" y="79" fontSize="14" fontWeight="900" fill="white" fontFamily="Inter,sans-serif">128</text>

        <rect x="68" y="42" width="80" height="40" rx="12" fill="white" opacity="0.18" />
        <text x="80" y="59" fontSize="8" fontWeight="700" fill="white" opacity="0.7" fontFamily="Inter,sans-serif">PERCENTILE</text>
        <text x="80" y="75" fontSize="14" fontWeight="900" fill="white" fontFamily="Inter,sans-serif">94th</text>

        <rect x="66" y="270" width="100" height="38" rx="12" fill="white" opacity="0.18" />
        <text x="78" y="287" fontSize="8" fontWeight="700" fill="white" opacity="0.7" fontFamily="Inter,sans-serif">TOP CAREER</text>
        <text x="78" y="301" fontSize="11" fontWeight="900" fill="white" fontFamily="Inter,sans-serif">Engineering</text>
    </svg>
);

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
        <div className="min-h-screen flex font-sans antialiased">

            {/* ── LEFT PANEL (Indigo) ────────────────────────────── */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 relative overflow-hidden flex-col items-center justify-center p-12">
                {/* Dot pattern */}
                <div className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
                {/* Top-left decoration */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-800/40 rounded-full translate-x-1/3 translate-y-1/3" />

                <div className="relative z-10 max-w-sm w-full text-white space-y-10">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                            <Brain size={20} className="text-white" />
                        </div>
                        <span className="text-2xl font-black tracking-tight">IQ<span className="text-indigo-200">Test</span></span>
                    </Link>

                    {/* Headline */}
                    <div className="space-y-4">
                        <h2 className="text-4xl font-black leading-tight">
                            Discover Your<br />
                            <span className="text-indigo-200">True Intelligence</span>
                        </h2>
                        <p className="text-indigo-200 text-sm leading-relaxed">
                            India's most trusted psychometric platform for students. Get your IQ score, career guidance, and scholarship pathways — all in one report.
                        </p>
                    </div>

                    {/* Illustration */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <HeroIllustration />
                    </motion.div>

                    {/* Highlights */}
                    <div className="space-y-3">
                        {highlights.map((h, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -15 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 + i * 0.1 }}
                                className="flex items-center gap-3"
                            >
                                <div className="w-6 h-6 bg-white/15 rounded-full flex items-center justify-center shrink-0">
                                    <h.icon size={13} className="text-white" />
                                </div>
                                <span className="text-sm font-semibold text-indigo-100">{h.text}</span>
                            </motion.div>
                        ))}
                    </div>

                    {/* Stat pills */}
                    <div className="flex gap-4 flex-wrap">
                        {[
                            { val: '50K+', label: 'Students' },
                            { val: '500+', label: 'Schools' },
                            { val: '98%', label: 'Satisfaction' },
                        ].map((s, i) => (
                            <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-2.5 text-center border border-white/15">
                                <div className="text-lg font-black text-white">{s.val}</div>
                                <div className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── RIGHT PANEL (White) ────────────────────────────── */}
            <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-6 lg:p-16 relative">
                {/* Mobile-only logo */}
                <div className="absolute top-6 left-6 lg:hidden flex items-center gap-2">
                    <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center">
                        <Brain size={16} className="text-white" />
                    </div>
                    <span className="text-lg font-black text-slate-900">IQ<span className="text-indigo-600">Test</span></span>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="w-full max-w-md space-y-8"
                >
                    {/* Header */}
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-xs font-black uppercase tracking-widest border border-indigo-100">
                            <Sparkles size={11} /> Student Portal
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-3">Welcome Back</h1>
                        <p className="text-slate-500 text-sm">Sign in to access your IQ assessment dashboard and reports.</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleLogin} className="space-y-5">
                        {/* Phone */}
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-700 uppercase tracking-widest">Mobile Number</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                    <Phone size={16} />
                                </div>
                                <input
                                    type="tel"
                                    required
                                    placeholder="Enter your 10-digit mobile number"
                                    className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-800 placeholder:text-slate-300 placeholder:font-normal focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* DOB */}
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-700 uppercase tracking-widest">Date of Birth</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                    <Calendar size={16} />
                                </div>
                                <input
                                    type="date"
                                    required
                                    className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all"
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
                                className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-600"
                            >
                                <AlertCircle size={16} className="shrink-0" />
                                <span className="text-xs font-bold">{typeof error === 'string' ? error : 'Invalid credentials. Please check your mobile number and date of birth.'}</span>
                            </motion.div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]"
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
                        <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Secure Login</span>
                        <div className="flex-1 h-px bg-slate-100" />
                    </div>

                    {/* Trust row */}
                    <div className="flex items-center justify-center gap-6">
                        {[
                            { icon: ShieldCheck, label: 'SSL Encrypted' },
                            { icon: Users, label: '50K+ Students' },
                            { icon: Star, label: 'Trusted Platform' },
                        ].map((t, i) => (
                            <div key={i} className="flex flex-col items-center gap-1.5 text-center">
                                <div className="w-9 h-9 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                                    <t.icon size={16} />
                                </div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-tight">{t.label}</span>
                            </div>
                        ))}
                    </div>

                    {/* Footer */}
                    <div className="text-center space-y-3">
                        <p className="text-xs text-slate-400">
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
