import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Phone, Calendar, User, BookOpen, Globe, ArrowRight, ShieldCheck, AlertCircle, CheckCircle2, Star, Users, Award, Sparkles, RefreshCw } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { checkMobileNumber, requestOtp, registerNewStudent } from '../store/slices/authSlice';

const RegisterPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, isRegistered, otpSent, flowStep } = useSelector((state) => state.auth);

    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [name, setName] = useState('');
    const [dob, setDob] = useState('');
    const [studentClass, setStudentClass] = useState('');
    const [language, setLanguage] = useState('English');
    const [resendTimer, setResendTimer] = useState(0);

    const classes = ['6', '7', '8', '9', '10', '11', '12'];
    const languages = ['English', 'Hindi'];

    useEffect(() => {
        if (resendTimer > 0) {
            const t = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(t);
        }
    }, [resendTimer]);

    const handleCheckMobile = async () => {
        await dispatch(checkMobileNumber(phone));
        // checkMobileNumber.fulfilled sets isRegistered, flowStep to 'sending-otp'
        // useEffect below auto-sends OTP
    };

    useEffect(() => {
        if (flowStep === 'sending-otp' && isRegistered === false) {
            dispatch(requestOtp({ mobileNumber: phone, type: 'registration' }));
        }
    }, [flowStep]);

    const handleResend = () => {
        if (resendTimer > 0) return;
        dispatch(requestOtp({ mobileNumber: phone, type: 'registration' }));
        setResendTimer(60);
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        const payload = { mobileNumber: phone, otp, name, dob, class: studentClass, language };
        const res = await dispatch(registerNewStudent(payload));
        if (registerNewStudent.fulfilled.match(res)) navigate('/dashboard');
    };

    const highlights = [
        { icon: CheckCircle2, text: 'Instant IQ & Career Reports' },
        { icon: ShieldCheck, text: 'Secure AI-Proctored Exams' },
        { icon: Star, text: 'Trusted by 500+ Schools' },
        { icon: Award, text: 'Scholarship Opportunities' },
    ];

    return (
        <div className="h-screen w-screen overflow-hidden flex font-sans antialiased">
            <div className="hidden lg:flex lg:w-1/2 h-screen bg-indigo-950 relative overflow-hidden flex-col justify-between">
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950" />
                    <div className="absolute -top-1/4 -right-1/4 w-[140%] h-[140%] bg-gradient-to-bl from-indigo-500/15 via-transparent to-transparent rotate-12" />
                </div>
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="relative z-10 px-12 mt-24">
                    <span className="inline-block text-[11px] font-black uppercase tracking-[0.3em] text-indigo-300 mb-4">Know Yourself Better</span>
                    <h2 className="text-[44px] xl:text-[52px] font-black leading-[1.05] text-white max-w-xl">Discover Your True Intelligence</h2>
                    <p className="text-indigo-200 text-base leading-relaxed max-w-lg mt-5">
                        India's most trusted psychometric platform for students. Get your IQ score, career guidance, and scholarship pathways — all in one report.
                    </p>
                </motion.div>
                <div className="relative z-10">
                    <div className="grid grid-cols-2 border-t border-white/10">
                        {highlights.map((h, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.08 }}
                                className={`flex items-center gap-3 px-12 py-5 ${i % 2 === 0 ? 'border-r' : ''} ${i < 2 ? 'border-b' : ''} border-white/10`}>
                                <h.icon size={18} className="text-indigo-300 shrink-0" />
                                <span className="text-sm font-bold text-white">{h.text}</span>
                            </motion.div>
                        ))}
                    </div>
                    <div className="grid grid-cols-3 bg-indigo-600">
                        {[{ val: '50K+', label: 'Students' }, { val: '500+', label: 'Schools' }, { val: '98%', label: 'Satisfaction' }].map((s, i) => (
                            <div key={i} className={`text-center py-5 ${i !== 2 ? 'border-r border-white/20' : ''}`}>
                                <div className="text-2xl font-black text-white">{s.val}</div>
                                <div className="text-[10px] font-bold text-indigo-100 uppercase tracking-widest mt-0.5">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="w-full lg:w-1/2 h-screen bg-white flex items-center justify-center p-6 lg:p-10 relative overflow-hidden">
                <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="w-full max-w-md space-y-4">
                    <div className="flex items-center mb-6 gap-2">
                        <img src="/logo-1.png" alt="Navodaya Wala" className="h-9 w-auto object-contain" />
                    </div>

                    {(flowStep !== 'register-form' && flowStep !== 'sending-otp') && (
                        <>
                            <div className="space-y-1.5">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100">
                                    <Sparkles size={10} /> New Student
                                </div>
                                <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-2">Register</h1>
                                <p className="text-slate-500 text-xs">Create your account to start your IQ journey.</p>
                            </div>

                            <form onSubmit={(e) => { e.preventDefault(); handleCheckMobile(); }} className="space-y-3.5">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Mobile Number</label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Phone size={15} /></div>
                                        <input type="tel" required placeholder="Enter your 10-digit mobile number"
                                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 placeholder:text-slate-300 placeholder:font-normal focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all"
                                            value={phone} onChange={(e) => setPhone(e.target.value)} />
                                    </div>
                                </div>

                                {error && (
                                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                                        className="flex items-center gap-3 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-600">
                                        <AlertCircle size={15} className="shrink-0" />
                                        <span className="text-xs font-bold">{typeof error === 'string' ? error : 'Something went wrong.'}</span>
                                    </motion.div>
                                )}

                                <button type="submit" disabled={loading}
                                    className="w-full py-3.5 bg-indigo-600 text-white rounded-xl font-black text-sm hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]">
                                    {loading ? (
                                        <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> Checking...</>
                                    ) : (<>Continue <ArrowRight size={16} /></>)}
                                </button>
                            </form>

                            {isRegistered === true && (
                                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-center space-y-2">
                                    <p className="text-xs font-bold">This mobile number is already registered.</p>
                                    <Link to="/login" className="inline-block text-xs font-black text-indigo-600 hover:underline">Sign in instead →</Link>
                                </div>
                            )}

                            <div className="relative flex items-center gap-4">
                                <div className="flex-1 h-px bg-slate-100" />
                                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Secure Registration</span>
                                <div className="flex-1 h-px bg-slate-100" />
                            </div>
                        </>
                    )}

                    {flowStep === 'sending-otp' && (
                        <div className="flex flex-col items-center justify-center py-10 space-y-4">
                            <svg className="animate-spin h-10 w-10 text-indigo-600" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            <p className="text-sm font-bold text-slate-500">Sending OTP to {phone.slice(0, 2)}****{phone.slice(-2)}...</p>
                        </div>
                    )}

                    {flowStep === 'register-form' && (
                        <>
                            <div className="space-y-1.5">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                                    <CheckCircle2 size={10} /> OTP Sent
                                </div>
                                <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-2">Create Account</h1>
                                <p className="text-slate-500 text-xs">Fill in your details to complete registration.</p>
                            </div>

                            <form onSubmit={handleRegister} className="space-y-3.5">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest">OTP</label>
                                    <input type="text" required placeholder="Enter OTP sent to your mobile"
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 placeholder:text-slate-300 placeholder:font-normal focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all tracking-[0.3em] text-center"
                                        value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6} />
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-slate-400">Didn't receive OTP?</span>
                                    <button type="button" onClick={handleResend} disabled={resendTimer > 0}
                                        className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors disabled:text-slate-300 disabled:cursor-not-allowed">
                                        <RefreshCw size={12} className={resendTimer > 0 ? 'animate-spin' : ''} />
                                        {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend'}
                                    </button>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Full Name</label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><User size={15} /></div>
                                        <input type="text" required placeholder="Enter your full name"
                                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 placeholder:text-slate-300 placeholder:font-normal focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all"
                                            value={name} onChange={(e) => setName(e.target.value)} />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Date of Birth</label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Calendar size={15} /></div>
                                        <input type="date" required
                                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all"
                                            value={dob} onChange={(e) => setDob(e.target.value)} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Class</label>
                                        <div className="relative">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><BookOpen size={15} /></div>
                                            <select required
                                                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all appearance-none"
                                                value={studentClass} onChange={(e) => setStudentClass(e.target.value)}>
                                                <option value="">Select</option>
                                                {classes.map((c) => <option key={c} value={c}>Class {c}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Language</label>
                                        <div className="relative">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Globe size={15} /></div>
                                            <select
                                                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all appearance-none"
                                                value={language} onChange={(e) => setLanguage(e.target.value)}>
                                                {languages.map((l) => <option key={l} value={l}>{l}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {error && (
                                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                                        className="flex items-center gap-3 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-600">
                                        <AlertCircle size={15} className="shrink-0" />
                                        <span className="text-xs font-bold">{typeof error === 'string' ? error : 'Registration failed.'}</span>
                                    </motion.div>
                                )}

                                <button type="submit" disabled={loading}
                                    className="w-full py-3.5 bg-indigo-600 text-white rounded-xl font-black text-sm hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]">
                                    {loading ? (
                                        <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> Creating Account...</>
                                    ) : (<>Create Account <ArrowRight size={16} /></>)}
                                </button>
                            </form>
                        </>
                    )}

                    <div className="flex items-center justify-center gap-6">
                        {[{ icon: ShieldCheck, label: 'SSL Encrypted' }, { icon: Users, label: '50K+ Students' }, { icon: Star, label: 'Trusted Platform' }].map((t, i) => (
                            <div key={i} className="flex flex-col items-center gap-1 text-center">
                                <div className="w-8 h-8 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center text-slate-400"><t.icon size={15} /></div>
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider leading-tight">{t.label}</span>
                            </div>
                        ))}
                    </div>

                    <div className="text-center space-y-2">
                        <p className="text-[11px] text-slate-400">
                            Already have an account?{' '}
                            <Link to="/login" className="text-indigo-600 font-bold hover:underline">Sign in</Link>
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

export default RegisterPage;
