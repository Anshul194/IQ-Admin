import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const PartnerCoordinatorSection = () => {
    return (
        <section id="partner-coordinator" className="relative py-20 px-6 bg-white overflow-hidden">
            <div className="max-w-6xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="relative bg-gradient-to-r from-[#0845A5] to-[#042861] rounded-[3rem] p-10 md:p-16 overflow-hidden shadow-2xl shadow-[#0845A5]/25"
                >
                    {/* Decorative accent glow */}
                    <div className="absolute top-0 right-0 w-[24rem] h-[24rem] bg-[#F14E2B]/15 rounded-full blur-3xl -z-0" />
                    <div className="absolute -bottom-10 -left-10 w-[20rem] h-[20rem] bg-white/5 rounded-full blur-2xl -z-0" />

                    <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
                        {/* Text */}
                        <div className="text-center lg:text-left max-w-2xl">
                            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#F14E2B] bg-[#F14E2B]/10 px-3.5 py-1.5 rounded-full mb-5 inline-block">
                                Collaboration Opportunity
                            </span>
                            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight mb-4">
                                Partner with Us as a Coordinator
                            </h2>
                            <p className="text-white/85 font-medium text-sm md:text-base leading-relaxed">
                                Passionate about education and student success? Join our growing network of coordinators and help students make informed academic and career decisions through our innovative assessment platform.
                            </p>
                        </div>

                        {/* Action Button */}
                        <div className="shrink-0">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Link
                                    to="/login"
                                    className="px-8 py-5 bg-white text-[#0845A5] rounded-full font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-3 shadow-xl"
                                >
                                    Join Us
                                    <ArrowRight size={16} className="text-[#0845A5]" />
                                </Link>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default PartnerCoordinatorSection;
