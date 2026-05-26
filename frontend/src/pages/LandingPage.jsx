import { motion } from 'framer-motion';
import { Brain, LayoutDashboard, ArrowRight, Star, Users, Trophy, ChevronRight, Globe, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-white text-slate-800 font-sans">
            {/* Header - Simple Udemy Style */}
            <nav className="h-16 md:h-20 border-b border-slate-200 flex items-center justify-between px-6 md:px-12 sticky top-0 bg-white z-[100]">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-violet-600 rounded flex items-center justify-center text-white">
                        <Brain size={18} />
                    </div>
                    <span className="text-xl font-bold tracking-tighter">IQMastery</span>
                </div>

                <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-600">
                    <a href="#features" className="hover:text-violet-600 transition-colors">Test Types</a>
                    <a href="#science" className="hover:text-violet-600 transition-colors">How it works</a>
                    <div className="h-6 w-px bg-slate-200" />
                    <Link to="/login" className="px-5 py-2 border border-slate-900 font-bold hover:bg-slate-50 transition-all">
                        Log In
                    </Link>
                    <Link to="/login" className="px-5 py-2 bg-slate-900 border border-slate-900 text-white font-bold hover:bg-slate-800 transition-all">
                        Sign Up
                    </Link>
                </div>

                <button className="lg:hidden p-2"><Star size={20} /></button>
            </nav>

            {/* Hero - Clean & Direct */}
            <header className="py-20 md:py-32 px-6">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">
                    <div className="flex-1 space-y-8 text-center md:text-left">
                        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight">
                            Smart assessments for <span className="text-violet-600">smarter futures.</span>
                        </h1>
                        <p className="text-xl text-slate-600 max-w-xl leading-relaxed">
                            Join over 1 million students measuring their IQ and career aptitude with the world's most trusted diagnostic platform.
                        </p>
                        <div className="flex flex-col sm:row gap-4 pt-4">
                            <Link to="/login" className="px-10 py-4 bg-violet-600 text-white font-bold text-lg hover:bg-violet-700 transition-all shadow-lg shadow-violet-200">
                                Get Started Today
                            </Link>
                        </div>
                    </div>
                    <div className="flex-1 w-full bg-slate-50 border border-slate-200 rounded-lg p-10 flex items-center justify-center shadow-sm">
                        <Brain size={240} className="text-slate-200" />
                    </div>
                </div>
            </header>

            {/* Social Proof */}
            <div className="bg-slate-50 border-y border-slate-200 py-10">
                <div className="max-w-6xl mx-auto px-6 text-center italic text-slate-400 font-medium">
                    Trusted by 500+ schools and educational institutions worldwide
                </div>
            </div>

            {/* Features - Grid */}
            <section id="features" className="py-24 px-6">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold mb-16 text-center md:text-left">Powerful tools for your education</h2>
                    <div className="grid md:grid-cols-3 gap-10">
                        {[
                            { title: 'School Connect', icon: <Users />, desc: 'Integrated with top school boards for seamless tracking.' },
                            { title: 'Career Pathing', icon: <Trophy />, desc: 'AI-driven suggestions for your professional future.' },
                            { title: 'Safe Exams', icon: <Shield />, desc: 'Monitored test environment ensuring total integrity.' }
                        ].map((item, i) => (
                            <div key={i} className="space-y-4">
                                <div className="w-12 h-12 rounded bg-violet-50 text-violet-600 flex items-center justify-center shadow-sm">
                                    {item.icon}
                                </div>
                                <h4 className="text-xl font-bold">{item.title}</h4>
                                <p className="text-slate-500 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 bg-slate-900 text-white px-6">
                <div className="max-w-6xl mx-auto flex flex-col md:row justify-between items-center gap-10">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-violet-600 rounded flex items-center justify-center text-white">
                            <Brain size={14} />
                        </div>
                        <span className="font-bold text-lg tracking-tighter">IQMastery</span>
                    </div>
                    <div className="flex gap-8 text-sm font-medium text-slate-400">
                        <a href="#" className="hover:text-white transition-all">Privacy</a>
                        <a href="#" className="hover:text-white transition-all">Terms</a>
                        <a href="#" className="hover:text-white transition-all">Help</a>
                    </div>
                    <p className="text-xs text-slate-500">© 2026 IQMastery. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
