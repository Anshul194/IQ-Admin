import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Calendar, ArrowRight, Brain, ShieldCheck, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginStudent } from '../store/slices/authSlice';

const LoginPage = () => {
    const [phone, setPhone] = useState('');
    const [dob, setDob] = useState('');

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.auth);

    const handleLogin = async (e) => {
        e.preventDefault();
        const res = await dispatch(loginStudent({ mobileNumber: phone, dob }));
        if (loginStudent.fulfilled.match(res)) {
            navigate('/dashboard');
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-slate-900 border-t-4 border-violet-600 font-sans">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-sm">
                <div className="text-center mb-10">
                    <div onClick={() => navigate('/')} className="cursor-pointer flex items-center justify-center gap-2 mb-8">
                        <div className="w-10 h-10 bg-violet-600 rounded flex items-center justify-center text-white shadow-lg">
                            <Brain size={24} />
                        </div>
                        <span className="text-2xl font-black text-slate-900 tracking-tighter">IQMastery</span>
                    </div>
                    <h1 className="text-2xl font-bold mb-1">Student Log In</h1>
                    <p className="text-slate-500 text-sm">Access your assessment dashboard</p>
                </div>

                <div className="bg-white border border-slate-200 p-8 shadow-sm rounded">
                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700">Phone Number</label>
                            <input
                                type="tel"
                                required
                                placeholder="Enter your mobile number"
                                className="w-full border border-slate-900 rounded p-3 text-sm focus:ring-1 ring-violet-600 outline-none"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700">Date of Birth</label>
                            <input
                                type="date"
                                required
                                className="w-full border border-slate-900 rounded p-3 text-sm focus:ring-1 ring-violet-600 outline-none"
                                value={dob}
                                onChange={(e) => setDob(e.target.value)}
                            />
                        </div>

                        {error && (
                            <div className="p-3 bg-rose-50 text-rose-600 text-xs font-bold rounded border border-rose-100 flex items-center gap-2">
                                <AlertCircle size={14} /> {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-violet-600 py-4 text-white font-bold hover:bg-violet-700 transition-all flex items-center justify-center gap-2"
                        >
                            {loading ? "Verifying..." : "Log In"}
                        </button>
                    </form>
                </div>

                <p className="mt-8 text-center text-slate-500 text-xs">
                    By logging in, you agree to our <a href="#" className="text-violet-600 font-bold underline">Terms of Use</a> and <a href="#" className="text-violet-600 font-bold underline">Privacy Policy</a>.
                </p>
            </motion.div>
        </div>
    );
};

export default LoginPage;
