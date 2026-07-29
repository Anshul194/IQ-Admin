import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import {
    Phone, ArrowRight, Calendar, ShieldCheck, User, GraduationCap,
    Languages, Lock, CheckCircle2, AlertTriangle, ArrowLeft,
    RefreshCw, Clock, Sparkles, Eye, EyeOff, Mail, ChevronLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
    checkMobile, sendOtp, verifyOtp, loginWithDob,
    registerStudent, changeDob, resetStudentAuth, clearError, setError
} from '../../store/slices/studentAuthSlice';

const StepIndicator = ({ steps, current }) => (
    <div className="flex items-center justify-center gap-2 mb-10">
        {steps.map((label, i) => (
            <div key={i} className="flex items-center gap-2">
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                    i <= current
                        ? 'bg-violet-100 text-violet-700'
                        : 'bg-slate-50 text-slate-300'
                }`}>
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                        i < current ? 'bg-violet-600 text-white' :
                        i === current ? 'border-2 border-violet-600' : 'border-2 border-slate-200'
                    }`}>
                        {i < current ? <CheckCircle2 size={10} /> : i + 1}
                    </div>
                    <span className="hidden sm:inline">{label}</span>
                </div>
                {i < steps.length - 1 && (
                    <div className={`w-6 h-px ${i < current ? 'bg-violet-300' : 'bg-slate-200'}`} />
                )}
            </div>
        ))}
    </div>
);

const StudentLogin = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {
        step, mobileNumber, isRegistered, otpType, otpVerified,
        loading, error, user, isAuthenticated
    } = useSelector((state) => state.studentAuth);

    const [localMobile, setLocalMobile] = useState('');
    const [dob, setDob] = useState('');
    const [otpInput, setOtpInput] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [otpCount, setOtpCount] = useState(0);
    const [otpTimer, setOtpTimer] = useState(0);
    const [otpDisabled, setOtpDisabled] = useState(false);
    const [resendDelay, setResendDelay] = useState(0);
    const [dobError, setDobError] = useState(false);

    const [regName, setRegName] = useState('');
    const [regDob, setRegDob] = useState('');
    const [regClass, setRegClass] = useState('');
    const [regLanguage, setRegLanguage] = useState('');

    const [newDob, setNewDob] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const timerRef = useRef(null);

    const steps = step === 'dob' || step.startsWith('register') || step.startsWith('change-dob')
        ? ['Verify', 'Dashboard']
        : ['Mobile', 'Verify', 'Register', 'Dashboard'];

    const getCurrentStepIndex = () => {
        if (step === 'landing') return -1;
        if (step === 'mobile') return 0;
        if (step === 'dob') return 0;
        if (step === 'register-otp' || step === 'register-otp-verify') return 1;
        if (step === 'change-dob-otp-verify') return 1;
        if (step === 'registration-form') return 2;
        if (step === 'change-dob-form') return 2;
        if (step === 'dashboard') return steps.length - 1;
        return 0;
    };

    useEffect(() => {
        if (isAuthenticated && step === 'dashboard') {
            const timer = setTimeout(() => {
                navigate('/student/dashboard');
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [isAuthenticated, step, navigate]);

    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    useEffect(() => {
        if (resendDelay > 0) {
            timerRef.current = setInterval(() => {
                setResendDelay(prev => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [resendDelay]);

    const handleCheckMobile = (e) => {
        e.preventDefault();
        if (!/^\d{10}$/.test(localMobile)) {
            dispatch(setError('Mobile number must contain exactly 10 digits.'));
            return;
        }
        dispatch(checkMobile(localMobile));
    };

    const handleSendOtp = () => {
        const type = otpType || (isRegistered ? 'dob_change' : 'registration');
        dispatch(sendOtp({ mobileNumber, type }));
        setOtpSent(true);
        setOtpCount(prev => prev + 1);
        if (otpCount === 0) setResendDelay(0);
        else if (otpCount === 1) setResendDelay(60);
        else if (otpCount === 2) setResendDelay(120);
        if (otpCount >= 3) setOtpDisabled(true);
    };

    const handleVerifyOtp = (e) => {
        e.preventDefault();
        dispatch(verifyOtp({ mobileNumber, otp: otpInput, type: otpType }));
    };

    const handleLoginWithDob = (e) => {
        e.preventDefault();
        setDobError(false);
        dispatch(loginWithDob({ mobileNumber, dob }));
    };

    const handleRegister = (e) => {
        e.preventDefault();
        const nameRegex = /^[a-zA-Z\s]+$/;
        if (!nameRegex.test(regName)) {
            dispatch(setError('Student name should contain alphabets and spaces only.'));
            return;
        }
        const dobDate = new Date(regDob);
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        if (dobDate > today) {
            dispatch(setError('Date of Birth cannot be a future date.'));
            return;
        }
        dispatch(registerStudent({
            mobileNumber, otp: otpInput, studentName: regName,
            dob: regDob, class: regClass, preferredLanguage: regLanguage
        }));
    };

    const handleChangeDob = (e) => {
        e.preventDefault();
        dispatch(changeDob({ mobileNumber, otp: otpInput, newDob }));
    };

    const handleTryAgain = () => {
        setDob('');
        setDobError(false);
        dispatch(clearError());
    };

    const handleChangeDobFlow = () => {
        dispatch(clearError());
        setOtpType('dob_change');
        handleSendOtp();
    };

    const resetToLanding = () => {
        dispatch(resetStudentAuth());
        setLocalMobile('');
        setOtpInput('');
        setOtpSent(false);
        setOtpCount(0);
        setDobError(false);
    };

    const StepTitle = ({ title, subtitle }) => (
        <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">{title}</h2>
            {subtitle && <p className="mt-2 text-sm font-semibold text-slate-400">{subtitle}</p>}
        </div>
    );

    const renderLanding = () => (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-8">
            <div className="inline-flex p-4 bg-violet-50 rounded-3xl text-violet-600">
                <ShieldCheck size={48} strokeWidth={1.5} />
            </div>
            <div className="space-y-3">
                <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-tight">
                    Student <span className="premium-text-gradient">Login</span>
                </h1>
                <p className="text-lg font-semibold text-slate-400 max-w-md mx-auto">
                    Access your learning dashboard. Enter your registered mobile number to continue.
                </p>
            </div>
            <form onSubmit={handleCheckMobile} className="max-w-sm mx-auto space-y-5">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                        Mobile Number
                    </label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-300 group-focus-within:text-violet-600 transition-colors">
                            <Phone size={18} strokeWidth={2.5} />
                        </div>
                        <input
                            type="tel"
                            placeholder="Enter 10-digit mobile number"
                            maxLength={10}
                            className="w-full pl-14 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-8 focus:ring-violet-500/5 focus:border-violet-500/30 focus:bg-white transition-all font-bold text-slate-700 placeholder:text-slate-300 text-center text-lg tracking-widest"
                            value={localMobile}
                            onChange={(e) => setLocalMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                            required
                        />
                    </div>
                </div>

                {error && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                        className="bg-rose-50 border border-rose-100 text-rose-500 p-3 rounded-xl text-[10px] font-black text-center uppercase tracking-widest">
                        {error}
                    </motion.div>
                )}

                <button
                    type="submit" disabled={loading || localMobile.length !== 10}
                    className="w-full premium-gradient text-white py-5 rounded-[24px] font-black text-lg shadow-2xl shadow-violet-200 flex items-center justify-center space-x-3 hover:opacity-90 disabled:opacity-50 transition-all active:scale-95"
                >
                    <span className="tracking-widest uppercase text-sm">{loading ? 'Checking...' : 'Continue'}</span>
                    {!loading && <ArrowRight size={20} strokeWidth={3} />}
                </button>

                <button type="button" onClick={() => navigate('/login')}
                    className="text-xs font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">
                    Admin Login
                </button>
            </form>
        </motion.div>
    );

    const renderDobEntry = () => (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-sm mx-auto space-y-8">
            <StepTitle title="Welcome Back!" subtitle="Enter your Date of Birth to continue." />

            <form onSubmit={handleLoginWithDob} className="space-y-5">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                        Date of Birth
                    </label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-300 group-focus-within:text-violet-600 transition-colors">
                            <Calendar size={18} strokeWidth={2.5} />
                        </div>
                        <input
                            type="date"
                            className="w-full pl-14 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-8 focus:ring-violet-500/5 focus:border-violet-500/30 focus:bg-white transition-all font-bold text-slate-700"
                            value={dob}
                            onChange={(e) => { setDob(e.target.value); setDobError(false); }}
                            required
                        />
                    </div>
                </div>

                {dobError && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                        className="bg-amber-50 border border-amber-100 rounded-xl p-4 space-y-3">
                        <p className="text-[10px] font-black text-amber-600 text-center uppercase tracking-widest">
                            Incorrect Date of Birth
                        </p>
                        <div className="flex gap-2">
                            <button type="button" onClick={handleTryAgain}
                                className="flex-1 py-3 bg-white border border-amber-200 text-amber-700 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-amber-50 transition-all">
                                Try Again
                            </button>
                            <button type="button" onClick={handleChangeDobFlow}
                                className="flex-1 py-3 bg-amber-600 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-amber-700 transition-all">
                                Change DOB
                            </button>
                        </div>
                    </motion.div>
                )}

                {error && !dobError && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                        className="bg-rose-50 border border-rose-100 text-rose-500 p-3 rounded-xl text-[10px] font-black text-center uppercase tracking-widest">
                        {error}
                    </motion.div>
                )}

                <button
                    type="submit" disabled={loading || !dob}
                    className="w-full premium-gradient text-white py-5 rounded-[24px] font-black text-lg shadow-2xl shadow-violet-200 flex items-center justify-center space-x-3 hover:opacity-90 disabled:opacity-50 transition-all active:scale-95"
                >
                    <span className="tracking-widest uppercase text-sm">{loading ? 'Verifying...' : 'Login'}</span>
                    {!loading && <ArrowRight size={20} strokeWidth={3} />}
                </button>

                <button type="button" onClick={resetToLanding}
                    className="w-full text-xs font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest flex items-center justify-center gap-1">
                    <ArrowLeft size={14} /> Use Different Number
                </button>
            </form>
        </motion.div>
    );

    const renderOtpSend = () => (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-sm mx-auto space-y-8">
            <div className="text-center">
                <div className="inline-flex p-3 bg-violet-50 rounded-2xl text-violet-600 mb-4">
                    <Lock size={32} strokeWidth={1.5} />
                </div>
                <StepTitle
                    title={otpType === 'registration' ? 'Verify Your Number' : 'Secure Your Identity'}
                    subtitle={`We will send a one-time password to ${mobileNumber.slice(0, 2)}****${mobileNumber.slice(-2)}`}
                />
            </div>

            <button
                onClick={handleSendOtp}
                disabled={loading || otpDisabled}
                className="w-full premium-gradient text-white py-5 rounded-[24px] font-black text-lg shadow-2xl shadow-violet-200 flex items-center justify-center space-x-3 hover:opacity-90 disabled:opacity-50 transition-all active:scale-95"
            >
                <span className="tracking-widest uppercase text-sm">
                    {loading ? 'Sending...' : otpDisabled ? 'Limit Reached' : 'Send OTP'}
                </span>
                {!loading && !otpDisabled && <ArrowRight size={20} strokeWidth={3} />}
            </button>

            {otpDisabled && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="bg-rose-50 border border-rose-100 text-rose-600 p-4 rounded-xl text-center">
                    <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed">
                        Maximum OTP attempts have been reached. Please try again after some time or contact support if the issue persists.
                    </p>
                </motion.div>
            )}

            {error && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-rose-50 border border-rose-100 text-rose-500 p-3 rounded-xl text-[10px] font-black text-center uppercase tracking-widest">
                    {error}
                </motion.div>
            )}

            <button type="button" onClick={resetToLanding}
                className="w-full text-xs font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest flex items-center justify-center gap-1">
                <ArrowLeft size={14} /> Use Different Number
            </button>
        </motion.div>
    );

    const renderOtpVerify = () => (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-sm mx-auto space-y-8">
            <div className="text-center">
                <div className="inline-flex p-3 bg-emerald-50 rounded-2xl text-emerald-600 mb-4">
                    <ShieldCheck size={32} strokeWidth={1.5} />
                </div>
                <StepTitle title="Enter OTP" subtitle={`Sent to ${mobileNumber.slice(0, 2)}****${mobileNumber.slice(-2)}`} />
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-5">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                        One-Time Password
                    </label>
                    <input
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        placeholder="000000"
                        className="w-full py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-8 focus:ring-violet-500/5 focus:border-violet-500/30 focus:bg-white transition-all font-bold text-slate-700 text-center text-2xl tracking-[0.3em] placeholder:text-slate-200"
                        value={otpInput}
                        onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        required
                    />
                </div>

                {error && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                        className="bg-rose-50 border border-rose-100 text-rose-500 p-3 rounded-xl text-[10px] font-black text-center uppercase tracking-widest">
                        {error}
                    </motion.div>
                )}

                <button
                    type="submit" disabled={loading || otpInput.length !== 6}
                    className="w-full premium-gradient text-white py-5 rounded-[24px] font-black text-lg shadow-2xl shadow-violet-200 flex items-center justify-center space-x-3 hover:opacity-90 disabled:opacity-50 transition-all active:scale-95"
                >
                    <span className="tracking-widest uppercase text-sm">{loading ? 'Verifying...' : 'Verify OTP'}</span>
                    {!loading && <ShieldCheck size={20} strokeWidth={3} />}
                </button>
            </form>

            <div className="text-center space-y-3">
                {resendDelay > 0 ? (
                    <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-400">
                        <Clock size={14} />
                        <span>Resend OTP in <span className="text-violet-600">{resendDelay}s</span></span>
                    </div>
                ) : (
                    !otpDisabled && (
                        <button onClick={handleSendOtp} disabled={loading}
                            className="text-xs font-bold text-violet-600 hover:text-violet-700 transition-colors uppercase tracking-widest flex items-center justify-center gap-1 mx-auto">
                            <RefreshCw size={14} /> Resend OTP
                        </button>
                    )
                )}

                {otpDisabled && (
                    <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">
                        Maximum OTP attempts reached
                    </p>
                )}
            </div>
        </motion.div>
    );

    const renderRegistrationForm = () => (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-lg mx-auto space-y-8">
            <StepTitle title="Complete Registration" subtitle="Fill in your details to create your account." />

            <form onSubmit={handleRegister} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                            Full Name <span className="text-rose-400">*</span>
                        </label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-300 group-focus-within:text-violet-600 transition-colors">
                                <User size={18} strokeWidth={2.5} />
                            </div>
                            <input type="text" placeholder="Enter your full name"
                                className="w-full pl-14 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-8 focus:ring-violet-500/5 focus:border-violet-500/30 focus:bg-white transition-all font-bold text-slate-700 placeholder:text-slate-300"
                                value={regName}
                                onChange={(e) => setRegName(e.target.value.replace(/[^a-zA-Z\s]/g, ''))}
                                required />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                            Date of Birth <span className="text-rose-400">*</span>
                        </label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-300 group-focus-within:text-violet-600 transition-colors">
                                <Calendar size={18} strokeWidth={2.5} />
                            </div>
                            <input type="date"
                                className="w-full pl-14 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-8 focus:ring-violet-500/5 focus:border-violet-500/30 focus:bg-white transition-all font-bold text-slate-700"
                                value={regDob}
                                onChange={(e) => setRegDob(e.target.value)}
                                required />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                            Class <span className="text-rose-400">*</span>
                        </label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-300 group-focus-within:text-violet-600 transition-colors">
                                <GraduationCap size={18} strokeWidth={2.5} />
                            </div>
                            <select
                                className="w-full pl-14 pr-10 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-8 focus:ring-violet-500/5 focus:border-violet-500/30 focus:bg-white transition-all font-bold text-slate-700 appearance-none cursor-pointer"
                                value={regClass}
                                onChange={(e) => setRegClass(e.target.value)}
                                required>
                                <option value="">Select Class</option>
                                {['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'].map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                            Preferred Language <span className="text-rose-400">*</span>
                        </label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-300 group-focus-within:text-violet-600 transition-colors">
                                <Languages size={18} strokeWidth={2.5} />
                            </div>
                            <select
                                className="w-full pl-14 pr-10 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-8 focus:ring-violet-500/5 focus:border-violet-500/30 focus:bg-white transition-all font-bold text-slate-700 appearance-none cursor-pointer"
                                value={regLanguage}
                                onChange={(e) => setRegLanguage(e.target.value)}
                                required>
                                <option value="">Select Language</option>
                                <option value="English">English</option>
                                <option value="Hindi">Hindi</option>
                                <option value="Marathi">Marathi</option>
                            </select>
                        </div>
                    </div>
                </div>

                {error && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                        className="bg-rose-50 border border-rose-100 text-rose-500 p-3 rounded-xl text-[10px] font-black text-center uppercase tracking-widest">
                        {error}
                    </motion.div>
                )}

                <button
                    type="submit" disabled={loading || !regName || !regDob || !regClass || !regLanguage}
                    className="w-full premium-gradient text-white py-5 rounded-[24px] font-black text-lg shadow-2xl shadow-violet-200 flex items-center justify-center space-x-3 hover:opacity-90 disabled:opacity-50 transition-all active:scale-95"
                >
                    <span className="tracking-widest uppercase text-sm">{loading ? 'Registering...' : 'Create Account'}</span>
                    {!loading && <User size={20} strokeWidth={3} />}
                </button>
            </form>

            <button type="button" onClick={resetToLanding}
                className="w-full text-xs font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest flex items-center justify-center gap-1">
                <ArrowLeft size={14} /> Use Different Number
            </button>
        </motion.div>
    );

    const renderChangeDobForm = () => (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-sm mx-auto space-y-8">
            <StepTitle title="Update Date of Birth" subtitle="Enter your new Date of Birth." />

            <form onSubmit={handleChangeDob} className="space-y-5">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                        New Date of Birth
                    </label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-300 group-focus-within:text-violet-600 transition-colors">
                            <Calendar size={18} strokeWidth={2.5} />
                        </div>
                        <input
                            type="date"
                            className="w-full pl-14 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-8 focus:ring-violet-500/5 focus:border-violet-500/30 focus:bg-white transition-all font-bold text-slate-700"
                            value={newDob}
                            onChange={(e) => setNewDob(e.target.value)}
                            required />
                    </div>
                </div>

                {error && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                        className="bg-rose-50 border border-rose-100 text-rose-500 p-3 rounded-xl text-[10px] font-black text-center uppercase tracking-widest">
                        {error}
                    </motion.div>
                )}

                <button
                    type="submit" disabled={loading || !newDob}
                    className="w-full premium-gradient text-white py-5 rounded-[24px] font-black text-lg shadow-2xl shadow-violet-200 flex items-center justify-center space-x-3 hover:opacity-90 disabled:opacity-50 transition-all active:scale-95"
                >
                    <span className="tracking-widest uppercase text-sm">{loading ? 'Updating...' : 'Update & Login'}</span>
                    {!loading && <ArrowRight size={20} strokeWidth={3} />}
                </button>
            </form>
        </motion.div>
    );

    const renderDashboard = () => (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md mx-auto text-center space-y-6">
            <div className="inline-flex p-4 bg-emerald-50 rounded-3xl text-emerald-600">
                <CheckCircle2 size={56} strokeWidth={1.5} />
            </div>
            <div className="space-y-2">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Welcome, {user?.studentName || 'Student'}!</h2>
                <p className="text-sm font-semibold text-slate-400">You are now logged in. Redirecting to your dashboard...</p>
            </div>
            <div className="flex justify-center">
                <div className="w-8 h-8 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
            </div>
        </motion.div>
    );

    const renderStep = () => {
        switch (step) {
            case 'landing': return renderLanding();
            case 'dob': return renderDobEntry();
            case 'register-otp':
            case 'change-dob-otp': return renderOtpSend();
            case 'register-otp-verify':
            case 'change-dob-otp-verify': return renderOtpVerify();
            case 'registration-form': return renderRegistrationForm();
            case 'change-dob-form': return renderChangeDobForm();
            case 'dashboard': return renderDashboard();
            default: return renderLanding();
        }
    };

    return (
        <div className="min-h-screen w-full flex bg-[#fdfcff] font-sans overflow-hidden">
            <div className="hidden lg:flex lg:w-1/2 p-16 bg-[#f7f4ff] flex-col justify-between relative">
                <div>
                    <img src="/logo-1.png" alt="Navodaya Wala" className="h-12 w-auto object-contain" />
                </div>
                <div className="max-w-lg w-full space-y-12 relative z-10 my-auto pt-16">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-violet-100/50 rounded-full text-violet-600 text-[10px] font-black uppercase tracking-widest mb-6 border border-violet-200/50">
                            <Sparkles size={12} />
                            <span>Student Portal</span>
                        </div>
                        <h1 className="text-6xl font-black text-slate-900 leading-[1.05] tracking-tight">
                            Your <span className="premium-text-gradient">Learning</span> Journey Starts Here.
                        </h1>
                        <p className="mt-8 text-lg text-slate-500 font-medium leading-relaxed">
                            Access your courses, track your progress, and achieve your academic goals with personalized learning resources.
                        </p>
                    </motion.div>
                    <div className="grid grid-cols-2 gap-8 mt-12">
                        <div className="bg-white/60 backdrop-blur-md p-8 rounded-[32px] shadow-sm border border-white">
                            <h3 className="text-4xl font-black text-slate-900 tracking-tighter">12.8k</h3>
                            <p className="text-[10px] text-slate-400 font-black mt-2 uppercase tracking-widest">Active Learners</p>
                        </div>
                        <div className="bg-white/60 backdrop-blur-md p-8 rounded-[32px] shadow-sm border border-white">
                            <h3 className="text-4xl font-black text-slate-900 tracking-tighter">500+</h3>
                            <p className="text-[10px] text-slate-400 font-black mt-2 uppercase tracking-widest">Courses Available</p>
                        </div>
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-80 h-80 bg-violet-400/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-fuchsia-400/10 rounded-full blur-[140px]"></div>
            </div>

            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:px-24 md:py-16 bg-white relative">
                <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full max-w-lg space-y-8"
                >
                    <button onClick={() => navigate('/')}
                        className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-slate-900 uppercase tracking-widest transition-colors mb-4">
                        <ChevronLeft size={14} /> Back to Home
                    </button>

                    <div className="lg:hidden flex justify-center mb-4">
                        <img src="/logo-1.png" alt="Navodaya Wala" className="h-10 w-auto object-contain" />
                    </div>

                    {step !== 'landing' && step !== 'dashboard' && (
                        <StepIndicator steps={steps} current={getCurrentStepIndex()} />
                    )}

                    <AnimatePresence mode="wait">
                        {renderStep()}
                    </AnimatePresence>
                </motion.div>

                <div className="absolute bottom-10 flex space-x-6 text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                    <a href="#" className="hover:text-slate-900 transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-slate-900 transition-colors">Terms of Service</a>
                    <a href="#" className="hover:text-slate-900 transition-colors">Contact Support</a>
                </div>
            </div>
        </div>
    );
};

export default StudentLogin;
