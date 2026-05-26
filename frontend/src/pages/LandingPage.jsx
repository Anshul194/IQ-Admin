import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Brain, ArrowRight, Star, Users, Shield, CheckCircle2,
    BarChart3, BookOpen, Zap, Clock, Award, GraduationCap,
    Target, TrendingUp, Play, Menu, X, Phone, Mail, MapPin,
    Quote, FlaskConical, Lightbulb, Sparkles, ChevronDown,
    BookMarked, PenLine
} from 'lucide-react';

// ─── SVG Illustrations ────────────────────────────────────────────────────────

const BrainIllustration = () => (
    <svg viewBox="0 0 480 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Glow background circles */}
        <circle cx="240" cy="200" r="180" fill="#EEF2FF" />
        <circle cx="240" cy="200" r="130" fill="#E0E7FF" />

        {/* Neural network lines */}
        <line x1="240" y1="200" x2="120" y2="100" stroke="#6366F1" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.4" />
        <line x1="240" y1="200" x2="360" y2="100" stroke="#6366F1" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.4" />
        <line x1="240" y1="200" x2="100" y2="220" stroke="#6366F1" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.4" />
        <line x1="240" y1="200" x2="380" y2="220" stroke="#6366F1" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.4" />
        <line x1="240" y1="200" x2="160" y2="320" stroke="#6366F1" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.4" />
        <line x1="240" y1="200" x2="320" y2="320" stroke="#6366F1" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.4" />
        <line x1="120" y1="100" x2="80" y2="160" stroke="#818CF8" strokeWidth="1" opacity="0.3" />
        <line x1="360" y1="100" x2="400" y2="160" stroke="#818CF8" strokeWidth="1" opacity="0.3" />
        <line x1="100" y1="220" x2="80" y2="160" stroke="#818CF8" strokeWidth="1" opacity="0.3" />
        <line x1="380" y1="220" x2="400" y2="160" stroke="#818CF8" strokeWidth="1" opacity="0.3" />
        <line x1="120" y1="100" x2="360" y2="100" stroke="#818CF8" strokeWidth="1" opacity="0.2" />
        <line x1="160" y1="320" x2="320" y2="320" stroke="#818CF8" strokeWidth="1" opacity="0.2" />

        {/* Node circles – outer */}
        <circle cx="120" cy="100" r="16" fill="white" stroke="#6366F1" strokeWidth="2" />
        <circle cx="120" cy="100" r="8" fill="#6366F1" />
        <circle cx="360" cy="100" r="16" fill="white" stroke="#6366F1" strokeWidth="2" />
        <circle cx="360" cy="100" r="8" fill="#6366F1" />
        <circle cx="100" cy="220" r="14" fill="white" stroke="#818CF8" strokeWidth="2" />
        <circle cx="100" cy="220" r="7" fill="#818CF8" />
        <circle cx="380" cy="220" r="14" fill="white" stroke="#818CF8" strokeWidth="2" />
        <circle cx="380" cy="220" r="7" fill="#818CF8" />
        <circle cx="160" cy="320" r="12" fill="white" stroke="#A5B4FC" strokeWidth="2" />
        <circle cx="160" cy="320" r="6" fill="#A5B4FC" />
        <circle cx="320" cy="320" r="12" fill="white" stroke="#A5B4FC" strokeWidth="2" />
        <circle cx="320" cy="320" r="6" fill="#A5B4FC" />
        <circle cx="80" cy="160" r="10" fill="white" stroke="#C7D2FE" strokeWidth="1.5" />
        <circle cx="80" cy="160" r="5" fill="#C7D2FE" />
        <circle cx="400" cy="160" r="10" fill="white" stroke="#C7D2FE" strokeWidth="1.5" />
        <circle cx="400" cy="160" r="5" fill="#C7D2FE" />

        {/* Center brain icon area */}
        <circle cx="240" cy="200" r="52" fill="white" stroke="#6366F1" strokeWidth="2.5" filter="url(#shadow)" />
        <circle cx="240" cy="200" r="44" fill="#EEF2FF" />
        {/* Brain shape simplified */}
        <path d="M220 188 C218 178 224 170 234 170 C238 166 246 166 250 170 C260 170 266 178 264 188 C268 192 268 202 264 206 C262 216 252 220 244 218 C240 222 234 222 230 218 C222 216 214 208 216 200 C212 196 214 190 220 188Z" fill="#6366F1" opacity="0.9" />
        <path d="M240 170 L240 218" stroke="white" strokeWidth="1.5" opacity="0.5" />
        <ellipse cx="228" cy="194" rx="5" ry="7" fill="white" opacity="0.6" />
        <ellipse cx="252" cy="194" rx="5" ry="7" fill="white" opacity="0.6" />

        {/* Floating score badges */}
        <rect x="310" y="60" width="90" height="42" rx="12" fill="white" stroke="#E0E7FF" strokeWidth="1.5" filter="url(#shadow2)" />
        <text x="322" y="78" fontSize="9" fontWeight="700" fill="#6B7280" fontFamily="Inter,sans-serif">IQ SCORE</text>
        <text x="322" y="94" fontSize="15" fontWeight="900" fill="#4F46E5" fontFamily="Inter,sans-serif">128</text>

        <rect x="78" y="56" width="100" height="42" rx="12" fill="white" stroke="#E0E7FF" strokeWidth="1.5" filter="url(#shadow2)" />
        <text x="90" y="74" fontSize="9" fontWeight="700" fill="#6B7280" fontFamily="Inter,sans-serif">PERCENTILE</text>
        <text x="90" y="90" fontSize="15" fontWeight="900" fill="#4F46E5" fontFamily="Inter,sans-serif">94th</text>

        <rect x="60" y="300" width="120" height="42" rx="12" fill="white" stroke="#E0E7FF" strokeWidth="1.5" filter="url(#shadow2)" />
        <text x="72" y="318" fontSize="9" fontWeight="700" fill="#6B7280" fontFamily="Inter,sans-serif">TOP CAREER</text>
        <text x="72" y="334" fontSize="12" fontWeight="900" fill="#4F46E5" fontFamily="Inter,sans-serif">Engineering</text>

        <rect x="300" y="300" width="110" height="42" rx="12" fill="white" stroke="#E0E7FF" strokeWidth="1.5" filter="url(#shadow2)" />
        <text x="312" y="318" fontSize="9" fontWeight="700" fill="#6B7280" fontFamily="Inter,sans-serif">GRADE CLASS</text>
        <text x="312" y="334" fontSize="12" fontWeight="900" fill="#4F46E5" fontFamily="Inter,sans-serif">10th</text>

        <defs>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#6366F1" floodOpacity="0.15" />
            </filter>
            <filter id="shadow2" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#000" floodOpacity="0.08" />
            </filter>
        </defs>
    </svg>
);

const WaveTopDivider = ({ fill = '#F8FAFC' }) => (
    <div className="w-full overflow-hidden -mb-1">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="w-full h-14 block">
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill={fill} />
        </svg>
    </div>
);

const WaveBottomDivider = ({ fill = '#F8FAFC' }) => (
    <div className="w-full overflow-hidden -mt-1">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="w-full h-14 block">
            <path d="M0,40 C360,0 1080,80 1440,40 L1440,0 L0,0 Z" fill={fill} />
        </svg>
    </div>
);

const StudentsIllustration = () => (
    <svg viewBox="0 0 320 220" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Screen/laptop */}
        <rect x="60" y="40" width="200" height="130" rx="12" fill="#EEF2FF" stroke="#C7D2FE" strokeWidth="2" />
        <rect x="72" y="52" width="176" height="106" rx="6" fill="white" />
        <rect x="100" y="170" width="120" height="10" rx="5" fill="#C7D2FE" />
        {/* Screen content - quiz question */}
        <rect x="84" y="64" width="100" height="8" rx="4" fill="#E0E7FF" />
        <rect x="84" y="78" width="150" height="6" rx="3" fill="#E0E7FF" />
        <rect x="84" y="96" width="70" height="22" rx="6" fill="#6366F1" />
        <rect x="162" y="96" width="70" height="22" rx="6" fill="#EEF2FF" stroke="#C7D2FE" strokeWidth="1" />
        <rect x="84" y="124" width="70" height="22" rx="6" fill="#EEF2FF" stroke="#C7D2FE" strokeWidth="1" />
        <rect x="162" y="124" width="70" height="22" rx="6" fill="#EEF2FF" stroke="#C7D2FE" strokeWidth="1" />
        {/* Check on selected option */}
        <circle cx="110" cy="107" r="6" fill="white" opacity="0.8" />
        <path d="M107 107 L110 110 L114 103" stroke="white" strokeWidth="2" strokeLinecap="round" />
        {/* Student figure */}
        <circle cx="268" cy="150" r="18" fill="#E0E7FF" stroke="#6366F1" strokeWidth="2" />
        <circle cx="268" cy="145" r="8" fill="#6366F1" />
        <path d="M252 168 C254 158 282 158 284 168" fill="#E0E7FF" stroke="#6366F1" strokeWidth="1.5" />
    </svg>
);

const ReportIllustration = () => (
    <svg viewBox="0 0 280 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="20" y="10" width="240" height="180" rx="16" fill="white" stroke="#E0E7FF" strokeWidth="2" />
        <rect x="20" y="10" width="240" height="40" rx="16" fill="#6366F1" />
        <rect x="20" y="34" width="240" height="16" fill="#6366F1" />
        <text x="36" y="36" fontSize="11" fontWeight="700" fill="white" fontFamily="Inter,sans-serif">IQ TEST REPORT</text>
        <text x="36" y="54" fontSize="9" fontWeight="600" fill="#A5B4FC" fontFamily="Inter,sans-serif">Aarav Sharma · Class 8</text>
        {/* Score circle */}
        <circle cx="230" cy="32" r="20" fill="white" opacity="0.15" />
        <text x="224" y="37" fontSize="13" fontWeight="900" fill="white" fontFamily="Inter,sans-serif">128</text>
        {/* Bars */}
        {[
            { y: 80, w: 160, label: 'Logical' },
            { y: 102, w: 130, label: 'Verbal' },
            { y: 124, w: 148, label: 'Math' },
            { y: 146, w: 120, label: 'Spatial' },
        ].map((b, i) => (
            <g key={i}>
                <text x="36" y={b.y - 4} fontSize="8" fill="#6B7280" fontFamily="Inter,sans-serif">{b.label}</text>
                <rect x="36" y={b.y} width="200" height="10" rx="5" fill="#F1F5F9" />
                <rect x="36" y={b.y} width={b.w} height="10" rx="5" fill="#6366F1" opacity="0.8" />
            </g>
        ))}
        {/* Career tags */}
        <rect x="36" y="168" width="58" height="16" rx="8" fill="#EEF2FF" />
        <text x="43" y="180" fontSize="8" fontWeight="700" fill="#6366F1" fontFamily="Inter,sans-serif">Engineering</text>
        <rect x="100" y="168" width="50" height="16" rx="8" fill="#EEF2FF" />
        <text x="107" y="180" fontSize="8" fontWeight="700" fill="#6366F1" fontFamily="Inter,sans-serif">Medicine</text>
    </svg>
);

// ─── Animated Counter ──────────────────────────────────────────────────────
const Counter = ({ end, suffix = '' }) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
        let start = 0;
        const step = end / 60;
        const timer = setInterval(() => {
            start += step;
            if (start >= end) { setCount(end); clearInterval(timer); }
            else setCount(Math.floor(start));
        }, 20);
        return () => clearInterval(timer);
    }, [end]);
    return <span>{count.toLocaleString()}{suffix}</span>;
};

const NavLink = ({ href, children }) => (
    <a href={href} className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">{children}</a>
);

const Tag = ({ children }) => (
    <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-indigo-50 text-indigo-600 border border-indigo-100">
        <Sparkles size={11} /> {children}
    </span>
);

// ─── Main ─────────────────────────────────────────────────────────────────────
const LandingPage = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [openFaq, setOpenFaq] = useState(null);

    useEffect(() => {
        const h = () => setScrolled(window.scrollY > 30);
        window.addEventListener('scroll', h);
        return () => window.removeEventListener('scroll', h);
    }, []);

    const stats = [
        { value: 50000, suffix: '+', label: 'Students Tested', icon: Users, color: 'bg-indigo-50 text-indigo-600' },
        { value: 500, suffix: '+', label: 'Schools Enrolled', icon: GraduationCap, color: 'bg-purple-50 text-purple-600' },
        { value: 98, suffix: '%', label: 'Satisfaction Rate', icon: Star, color: 'bg-amber-50 text-amber-500' },
        { value: 12, suffix: '+', label: 'Exam Types', icon: BookMarked, color: 'bg-emerald-50 text-emerald-600' },
    ];

    const tests = [
        { icon: Brain, label: 'IQ Test', bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-100', desc: 'Measure cognitive abilities across logical, verbal, and mathematical domains.', questions: 40, duration: '45 min', grades: 'All Classes' },
        { icon: Target, label: 'Career Aptitude', bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-100', desc: 'Discover career paths aligned with your natural strengths and personality.', questions: 60, duration: '60 min', grades: '8th – 12th' },
        { icon: FlaskConical, label: 'Diagnostic Eval', bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100', desc: 'Identify learning gaps across all subjects with a comprehensive evaluation.', questions: 50, duration: '50 min', grades: '1st – 10th' },
        { icon: GraduationCap, label: 'Scholarship Test', bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', desc: 'Competitive exam for identifying top academic performers for scholarships.', questions: 80, duration: '90 min', grades: '5th – 12th' },
    ];

    const features = [
        { icon: Shield, title: 'Secure Proctored Exams', desc: 'AI-monitored tests with integrity controls, ensuring fair evaluations every time.', bg: 'bg-rose-50', text: 'text-rose-500' },
        { icon: BarChart3, title: 'Instant PDF Reports', desc: 'Comprehensive 15-page reports generated immediately after completion.', bg: 'bg-indigo-50', text: 'text-indigo-600' },
        { icon: Award, title: 'Hindi & English', desc: 'Full bilingual support across all tests, questions, and reports.', bg: 'bg-sky-50', text: 'text-sky-600' },
        { icon: Phone, title: 'WhatsApp Alerts', desc: 'Automated notifications to parents for results and updates.', bg: 'bg-green-50', text: 'text-green-600' },
        { icon: TrendingUp, title: 'Percentile Rankings', desc: 'National-level scoring with class, school, and city comparisons.', bg: 'bg-violet-50', text: 'text-violet-600' },
        { icon: Award, title: 'Scholarship Pathways', desc: 'Top performers are automatically recommended for scholarships.', bg: 'bg-amber-50', text: 'text-amber-600' },
    ];

    const steps = [
        { step: '01', icon: BookOpen, title: 'Register & Enroll', desc: 'Students register through their school coordinator in under 2 minutes.' },
        { step: '02', icon: PenLine, title: 'Take the Test', desc: 'Secure, AI-proctored online exam on any device, anytime.' },
        { step: '03', icon: BarChart3, title: 'Instant Analysis', desc: 'Detailed score reports with percentile rankings and breakdowns.' },
        { step: '04', icon: Lightbulb, title: 'Career Guidance', desc: 'Personalized recommendations based on your cognitive profile.' },
    ];

    const testimonials = [
        { name: 'Priya Sharma', role: 'Student, Class 10', school: 'Delhi Public School', rating: 5, text: 'The IQ test gave me a completely new perspective on my strengths. The career report was incredibly accurate and helped me choose Science stream with confidence.' },
        { name: 'Rajesh Kumar', role: 'School Principal', school: "St. Mary's Convent", rating: 5, text: "We've enrolled over 800 students across 3 batches. The coordinator dashboard is excellent and parents love the detailed PDF reports." },
        { name: 'Anjali Mehta', role: 'Parent', school: 'Ryan International', rating: 5, text: "My son scored in the 94th percentile. The scholarship opportunity we found through IQ Test directly changed our family's trajectory." },
    ];

    const faqs = [
        { q: 'Who can take the IQ test?', a: 'Students from Class 1 to Class 12 can take our age-appropriate assessments. Each test is carefully calibrated for specific grade levels.' },
        { q: 'How long does it take to get results?', a: 'Results are available immediately after test submission. Detailed PDF reports are generated within minutes.' },
        { q: 'Is the test available in Hindi?', a: 'Yes! All our tests are available in both Hindi and English. Students can choose their preferred language at the start.' },
        { q: 'How do schools enroll?', a: 'Schools contact our team directly. A dedicated coordinator manages the entire student enrollment and examination process.' },
        { q: 'What does the report include?', a: 'The report includes IQ score, percentile rank, cognitive ability breakdown, personality traits, and personalized career recommendations.' },
    ];

    return (
        <div className="min-h-screen bg-white text-slate-800 font-sans antialiased overflow-x-hidden">

            {/* ── NAVBAR ─────────────────────────────────────────── */}
            <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-xl shadow-sm border-b border-slate-100' : 'bg-white'}`}>
                <div className="max-w-7xl mx-auto px-6 h-16 md:h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                            <Brain size={18} className="text-white" />
                        </div>
                        <span className="text-xl font-black tracking-tight text-slate-900">IQ<span className="text-indigo-600">Test</span></span>
                    </div>
                    <div className="hidden lg:flex items-center gap-8">
                        <NavLink href="#tests">Test Types</NavLink>
                        <NavLink href="#features">Features</NavLink>
                        <NavLink href="#how-it-works">How It Works</NavLink>
                        <NavLink href="#testimonials">Reviews</NavLink>
                        <NavLink href="#faq">FAQ</NavLink>
                    </div>
                    <div className="hidden lg:flex items-center gap-3">
                        <Link to="/login" className="px-5 py-2.5 text-sm font-bold text-slate-700 hover:text-indigo-600 transition-colors">Sign In</Link>
                        <Link to="/login" className="px-6 py-2.5 text-sm font-bold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">Get Started Free →</Link>
                    </div>
                    <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 rounded-xl border border-slate-200">
                        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
                <AnimatePresence>
                    {mobileOpen && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                            className="lg:hidden bg-white border-b border-slate-100 px-6 py-4 space-y-3 overflow-hidden">
                            {['Test Types', 'Features', 'How It Works', 'Reviews', 'FAQ'].map(l => (
                                <a key={l} href="#" onClick={() => setMobileOpen(false)} className="block text-sm font-semibold text-slate-600 py-2 border-b border-slate-50">{l}</a>
                            ))}
                            <Link to="/login" className="block w-full text-center py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm mt-2">Get Started Free</Link>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            {/* ── HERO ──────────────────────────────────────────── */}
            <section className="relative pt-28 md:pt-36 pb-0 px-6 overflow-hidden bg-gradient-to-br from-indigo-50/60 via-white to-purple-50/30">
                {/* Decorative dots grid */}
                <div className="absolute inset-0 pointer-events-none opacity-30"
                    style={{ backgroundImage: 'radial-gradient(circle, #6366F1 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

                <div className="relative max-w-7xl mx-auto">
                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20 pb-16">
                        {/* Left content */}
                        <div className="flex-1 text-center lg:text-left space-y-8">
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                <Tag>India's #1 IQ Assessment Platform</Tag>
                            </motion.div>
                            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                                className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 leading-[1.05]">
                                Unlock Your<br />Child's{' '}
                                <span className="text-indigo-600 relative">
                                    True Potential
                                    <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                                        <path d="M2 8 C80 2, 220 2, 298 8" stroke="#6366F1" strokeWidth="3" strokeLinecap="round" opacity="0.4" />
                                    </svg>
                                </span>
                            </motion.h1>
                            <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                                className="text-lg md:text-xl text-slate-500 max-w-xl leading-relaxed">
                                Certified psychometric assessments for Classes 1–12. Instant detailed reports, career guidance, and scholarship opportunities — trusted by <strong className="text-slate-700">500+ schools</strong> across India.
                            </motion.p>
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <Link to="/login" className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-base hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 hover:-translate-y-0.5">
                                    Start Free Assessment <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <a href="#how-it-works" className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white border-2 border-slate-200 rounded-2xl font-bold text-sm text-slate-700 hover:border-indigo-300 hover:text-indigo-600 transition-all">
                                    <Play size={15} className="text-indigo-500" /> How It Works
                                </a>
                            </motion.div>
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                                className="flex flex-wrap gap-4 justify-center lg:justify-start">
                                {['Psychometrically Validated', 'CBSE Aligned', 'Hindi + English', 'Instant Results'].map(b => (
                                    <span key={b} className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500">
                                        <CheckCircle2 size={13} className="text-emerald-500" /> {b}
                                    </span>
                                ))}
                            </motion.div>
                        </div>

                        {/* Right — brain illustration */}
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.2 }}
                            className="flex-1 w-full max-w-lg relative">
                            {/* Floating card 1 */}
                            <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
                                className="absolute -top-4 -left-4 z-10 bg-white rounded-2xl shadow-xl shadow-indigo-100 px-4 py-3 flex items-center gap-3 border border-indigo-50">
                                <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center"><Brain size={16} className="text-white" /></div>
                                <div><div className="text-xs font-black text-slate-900">IQ Score</div><div className="text-lg font-black text-indigo-600">128</div></div>
                            </motion.div>
                            {/* Floating card 2 */}
                            <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut', delay: 0.5 }}
                                className="absolute -bottom-2 -right-4 z-10 bg-white rounded-2xl shadow-xl shadow-emerald-100 px-4 py-3 flex items-center gap-3 border border-emerald-50">
                                <div className="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center"><CheckCircle2 size={16} className="text-white" /></div>
                                <div><div className="text-xs font-black text-slate-900">Percentile</div><div className="text-lg font-black text-emerald-600">94th</div></div>
                            </motion.div>
                            <BrainIllustration />
                        </motion.div>
                    </div>
                </div>
                <WaveTopDivider fill="#1E293B" />
            </section>

            {/* ── TRUST BAR ─────────────────────────────────────── */}
            <section className="bg-slate-800 py-5 px-6">
                <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Trusted By:</span>
                    {['CBSE Schools', 'ICSE Boards', 'State Boards', 'Private Institutions', 'NGO Partners'].map(b => (
                        <span key={b} className="text-xs font-bold text-slate-400 uppercase tracking-widest">{b}</span>
                    ))}
                </div>
            </section>
            <WaveBottomDivider fill="#1E293B" />

            {/* ── STATS ─────────────────────────────────────────── */}
            <section className="py-20 px-6 bg-white border-b border-slate-100">
                <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((s, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                            className="text-center space-y-2">
                            <div className={`inline-flex p-3 rounded-2xl mb-2 ${s.color}`}><s.icon size={22} /></div>
                            <div className="text-4xl font-black text-slate-900"><Counter end={s.value} suffix={s.suffix} /></div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{s.label}</div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ── TEST TYPES ────────────────────────────────────── */}
            <section id="tests" className="py-28 px-6 bg-slate-50 relative overflow-hidden">
                {/* Decorative bg circle */}
                <div className="absolute -right-40 top-20 w-[400px] h-[400px] bg-indigo-50 rounded-full opacity-60 pointer-events-none" />
                <div className="max-w-7xl mx-auto relative">
                    <div className="text-center space-y-4 mb-16">
                        <Tag>Assessment Types</Tag>
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Choose the Right Test</h2>
                        <p className="text-slate-500 max-w-xl mx-auto">Designed by psychologists & educators, calibrated for every grade level.</p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {tests.map((t, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                                className={`bg-white border-2 ${t.border} rounded-3xl p-7 hover:shadow-xl transition-all group cursor-pointer relative overflow-hidden`}>
                                {/* Decorative corner */}
                                <div className={`absolute top-0 right-0 w-20 h-20 ${t.bg} rounded-bl-[40px] opacity-50`} />
                                <div className={`w-12 h-12 ${t.bg} ${t.text} rounded-2xl flex items-center justify-center mb-5 relative z-10`}>
                                    <t.icon size={22} />
                                </div>
                                <h3 className="font-black text-lg text-slate-900 mb-2">{t.label}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed mb-5">{t.desc}</p>
                                <div className="pt-4 border-t border-slate-100 space-y-1.5">
                                    <div className="flex justify-between text-xs font-bold text-slate-400">
                                        <span className="flex items-center gap-1"><BookOpen size={10} /> {t.questions} Qs</span>
                                        <span className="flex items-center gap-1"><Clock size={10} /> {t.duration}</span>
                                    </div>
                                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Grades: {t.grades}</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── FEATURES ──────────────────────────────────────── */}
            <section id="features" className="py-28 px-6 bg-white relative overflow-hidden">
                <div className="absolute -left-40 bottom-20 w-[400px] h-[400px] bg-purple-50 rounded-full opacity-50 pointer-events-none" />
                <div className="max-w-7xl mx-auto relative">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        {/* Left illustration */}
                        <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                            className="flex-1 w-full max-w-sm mx-auto lg:mx-0">
                            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
                                <ReportIllustration />
                                <div className="mt-6 text-center">
                                    <div className="text-sm font-black text-slate-900">Sample IQ Report</div>
                                    <div className="text-xs text-slate-400 mt-1">15-page detailed analysis + career guidance</div>
                                </div>
                            </div>
                        </motion.div>
                        {/* Right features grid */}
                        <div className="flex-1 space-y-6">
                            <div className="text-center lg:text-left space-y-4 mb-8">
                                <Tag>Platform Features</Tag>
                                <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Everything Your School Needs</h2>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-5">
                                {features.map((f, i) => (
                                    <motion.div key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                                        className="flex gap-4 p-5 bg-white border border-slate-100 rounded-2xl hover:border-indigo-100 hover:shadow-lg hover:shadow-indigo-50 transition-all">
                                        <div className={`shrink-0 w-10 h-10 ${f.bg} ${f.text} rounded-xl flex items-center justify-center`}>
                                            <f.icon size={18} />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-slate-900 text-sm mb-1">{f.title}</h4>
                                            <p className="text-slate-500 text-xs leading-relaxed">{f.desc}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── HOW IT WORKS ──────────────────────────────────── */}
            <section id="how-it-works" className="py-28 px-6 bg-slate-50 relative overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center space-y-4 mb-20">
                        <Tag>Simple Process</Tag>
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">4 Steps to Success</h2>
                    </div>
                    {/* Steps with illustration */}
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="flex-1 grid sm:grid-cols-2 gap-6">
                            {steps.map((s, i) => (
                                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }} transition={{ delay: i * 0.12 }}
                                    className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-50 transition-all">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-black text-sm shadow-lg shadow-indigo-200">
                                            {s.step}
                                        </div>
                                        <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                                            <s.icon size={16} />
                                        </div>
                                    </div>
                                    <h4 className="font-black text-slate-900 mb-2">{s.title}</h4>
                                    <p className="text-slate-500 text-sm leading-relaxed">{s.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                        <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                            className="flex-1 w-full max-w-sm mx-auto lg:mx-0">
                            <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-xl shadow-slate-100">
                                <StudentsIllustration />
                                <div className="mt-6 space-y-3">
                                    <div className="flex items-center justify-between text-xs text-slate-500">
                                        <span className="font-bold">Progress</span><span className="font-black text-indigo-600">32 / 40 Questions</span>
                                    </div>
                                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <motion.div initial={{ width: 0 }} whileInView={{ width: '80%' }} viewport={{ once: true }}
                                            transition={{ duration: 1, delay: 0.3 }}
                                            className="h-full bg-indigo-600 rounded-full" />
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-slate-400">
                                        <Clock size={12} /> <span>18 min remaining</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ── TESTIMONIALS ─────────────────────────────────── */}
            <section id="testimonials" className="py-28 px-6 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center space-y-4 mb-16">
                        <Tag>Real Stories</Tag>
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">What Our Users Say</h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {testimonials.map((t, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                                className="bg-white border border-slate-200 rounded-3xl p-8 space-y-5 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-50 transition-all relative">
                                <div className="absolute top-6 right-6 text-indigo-100"><Quote size={36} /></div>
                                <div className="flex gap-1">{Array(t.rating).fill(0).map((_, j) => <Star key={j} size={14} className="text-amber-400 fill-amber-400" />)}</div>
                                <p className="text-slate-600 text-sm leading-relaxed">"{t.text}"</p>
                                <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-black text-sm">
                                        {t.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="font-black text-slate-900 text-sm">{t.name}</div>
                                        <div className="text-xs font-bold text-slate-400">{t.role} · {t.school}</div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA BANNER ───────────────────────────────────── */}
            <section className="py-20 px-6 bg-slate-50">
                <div className="max-w-5xl mx-auto">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                        className="relative bg-indigo-600 rounded-[32px] p-12 md:p-16 text-center overflow-hidden">
                        {/* Decorative SVG circles */}
                        <svg className="absolute top-0 right-0 opacity-10" width="300" height="300" viewBox="0 0 300 300">
                            <circle cx="250" cy="50" r="200" fill="white" />
                        </svg>
                        <svg className="absolute bottom-0 left-0 opacity-10" width="200" height="200" viewBox="0 0 200 200">
                            <circle cx="50" cy="150" r="150" fill="white" />
                        </svg>
                        <div className="relative z-10 space-y-6">
                            <div className="inline-flex p-3 bg-white/20 rounded-2xl"><Zap size={28} className="text-white" /></div>
                            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">Ready to Discover<br />Your Child's IQ?</h2>
                            <p className="text-indigo-200 max-w-lg mx-auto">Join 50,000+ students who have already unlocked their potential. Registration takes less than 2 minutes.</p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                                <Link to="/login" className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-indigo-600 rounded-2xl font-black hover:bg-indigo-50 transition-all shadow-xl">
                                    Enroll Now — It's Free <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <a href="tel:+911234567890" className="inline-flex items-center gap-3 px-8 py-4 border-2 border-white/30 text-white rounded-2xl font-bold text-sm hover:border-white/60 transition-all">
                                    <Phone size={15} /> +91 98765 43210
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── FAQ ──────────────────────────────────────────── */}
            <section id="faq" className="py-28 px-6 bg-white">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center space-y-4 mb-14">
                        <Tag>Got Questions?</Tag>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Frequently Asked Questions</h2>
                    </div>
                    <div className="space-y-3">
                        {faqs.map((faq, i) => (
                            <motion.div key={i} initial={{ opacity: 0, x: -15 }} whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                                className="border border-slate-200 rounded-2xl overflow-hidden">
                                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                    className="w-full px-6 py-5 flex items-center justify-between font-bold text-sm text-left text-slate-800 hover:bg-slate-50 transition-colors">
                                    {faq.q}
                                    <ChevronDown size={17} className={`text-slate-400 transition-transform shrink-0 ml-4 ${openFaq === i ? 'rotate-180 text-indigo-600' : ''}`} />
                                </button>
                                <AnimatePresence>
                                    {openFaq === i && (
                                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                                            <div className="px-6 pb-5 text-sm text-slate-500 leading-relaxed border-t border-slate-100 pt-4 bg-slate-50/50">{faq.a}</div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── FOOTER ───────────────────────────────────────── */}
            <footer className="bg-slate-900 text-white">
                <div className="max-w-7xl mx-auto px-6 pt-20 pb-10">
                    <div className="grid md:grid-cols-4 gap-12 pb-14 border-b border-white/8">
                        <div className="space-y-5">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center"><Brain size={18} /></div>
                                <span className="text-xl font-black tracking-tight">IQ<span className="text-indigo-400">Test</span></span>
                            </div>
                            <p className="text-slate-400 text-sm leading-relaxed">India's most trusted psychometric assessment platform for school students.</p>
                            <div className="space-y-2 text-sm text-slate-400">
                                <div className="flex items-center gap-2"><Mail size={14} className="text-indigo-400" /> support@iniqtest.com</div>
                                <div className="flex items-center gap-2"><Phone size={14} className="text-indigo-400" /> +91 98765 43210</div>
                                <div className="flex items-center gap-2"><MapPin size={14} className="text-indigo-400" /> Jaipur, Rajasthan, India</div>
                            </div>
                        </div>
                        {[
                            { title: 'Platform', links: ['IQ Test', 'Career Aptitude', 'Diagnostic Eval', 'Scholarship Test'] },
                            { title: 'Company', links: ['About Us', 'Blog', 'Careers', 'Press Kit'] },
                            { title: 'Support', links: ['Help Center', 'Contact Us', 'Privacy Policy', 'Terms of Service'] },
                        ].map((col, i) => (
                            <div key={i} className="space-y-5">
                                <h6 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">{col.title}</h6>
                                <ul className="space-y-3">
                                    {col.links.map(l => <li key={l}><a href="#" className="text-sm text-slate-500 hover:text-white transition-colors font-medium">{l}</a></li>)}
                                </ul>
                            </div>
                        ))}
                    </div>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 text-xs text-slate-600 font-medium">
                        <span>© 2026 IQTest Platform. All rights reserved.</span>
                        <div className="flex gap-6">
                            {['Privacy', 'Terms', 'Cookies'].map(l => <a key={l} href="#" className="hover:text-slate-400 transition-colors">{l}</a>)}
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
