import { motion } from 'framer-motion';
import { Check, Compass, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CareerAptitudeSection = () => {
    const benefits = [
        "Discover their natural strengths and abilities",
        "Identify careers that match their interests and personality",
        "Make informed academic and career decisions",
        "Avoid choosing unsuitable career paths",
        "Build confidence in future career planning",
        "Explore a wide range of career opportunities",
        "Plan a successful and fulfilling future"
    ];

    return (
        <section id="aptitude-details" className="relative py-28 px-6 bg-slate-50 overflow-hidden">
            {/* Subtle background glow */}
            <div className="absolute top-0 left-0 w-[30rem] h-[30rem] bg-[#F14E2B]/5 rounded-full blur-[100px] -z-0" />
            <div className="absolute bottom-0 right-0 w-[24rem] h-[24rem] bg-[#0845A5]/5 rounded-full blur-[100px] -z-0" />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid lg:grid-cols-12 gap-16 items-center">
                    
                    {/* Left: Content */}
                    <div className="lg:col-span-7 flex flex-col items-start">
                        <span className="text-[11px] font-black uppercase tracking-[0.3em] text-[#F14E2B] mb-3 block">
                            Career Aptitude Test
                        </span>
                        
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4">
                            Shape Your Future with the
                            <br />
                            <span className="text-[#0845A5]">Right Career Choice</span>
                        </h2>

                        <h3 className="text-xl font-bold text-slate-800 mt-2 mb-4">
                            Why Take a Career Aptitude Test?
                        </h3>

                        <p className="text-slate-500 font-medium text-sm md:text-base mb-8 leading-relaxed">
                            A Career Aptitude Test helps students:
                        </p>

                        {/* Benefits list */}
                        <div className="grid gap-4 w-full">
                            {benefits.map((benefit, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: i * 0.05 }}
                                    className="flex items-start gap-3.5 group"
                                >
                                    <div className="shrink-0 w-6 h-6 rounded-full bg-[#0845A5]/10 flex items-center justify-center mt-0.5 group-hover:bg-[#0845A5] transition-colors duration-300">
                                        <Check size={14} className="text-[#0845A5] group-hover:text-white transition-colors duration-300" />
                                    </div>
                                    <span className="text-slate-700 text-sm md:text-base font-medium leading-relaxed">
                                        {benefit}
                                    </span>
                                </motion.div>
                            ))}
                        </div>

                        {/* CTA button */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="mt-10"
                        >
                            <Link
                                to="/login"
                                className="group px-8 py-4 bg-[#0845A5] text-white rounded-full font-bold text-sm hover:bg-[#06388a] transition-all active:scale-95 flex items-center gap-2 shadow-lg shadow-[#0845A5]/20"
                            >
                                Start Assessment
                                <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                            </Link>
                        </motion.div>
                    </div>

                    {/* Right: Premium Image */}
                    <div className="lg:col-span-5 relative w-full">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="relative rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200/80 aspect-[4/5] md:aspect-[1/1] lg:aspect-[4/5] w-full"
                        >
                            <img
                                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800"
                                alt="Students choosing career options"
                                className="w-full h-full object-cover"
                            />
                            {/* Decorative gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent" />
                            
                            {/* Premium Floating Badge */}
                            <div className="absolute bottom-6 left-6 right-6 flex items-center gap-3 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-white/20">
                                <div className="w-10 h-10 rounded-xl bg-[#F14E2B]/10 flex items-center justify-center shrink-0">
                                    <Compass size={20} className="text-[#F14E2B]" />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-slate-800">10+ Career Tracks</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Comprehensive Mapping</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default CareerAptitudeSection;
