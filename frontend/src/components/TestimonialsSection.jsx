import { motion } from 'framer-motion';
import { Quote, User } from 'lucide-react';

const TestimonialsSection = () => {
    const testimonials = [
        {
            quote: "The Career Aptitude report was a revelation for my daughter in Class 10. It mapped out streams and paths we hadn't even considered, giving us a clear direction.",
            name: "Rohan Deshmukh",
            role: "Parent of Class 10 Student",
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150",
            featured: false
        },
        {
            quote: "Thanks to INLESYS for conducting INIQTEST. The test session was live, supervised and interactive and joyful experience. Medal and Certificate awarded to me for securing IQ Score of 135 inspired me a lot.",
            name: "Ayush Gaikwad",
            role: "Grade 3 Student",
            image: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&q=80&w=150",
            featured: true
        },
        {
            quote: "A very interactive test process. The detailed subject-wise analysis helped me focus my preparation on my actual weak spots and secure my college admission.",
            name: "Sneha Patil",
            role: "Class 12 Student",
            image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
            featured: false
        }
    ];

    return (
        <section id="testimonials" className="relative py-28 px-6 bg-slate-50 overflow-hidden">
            {/* Subtle background glow */}
            <div className="absolute top-0 right-0 w-[30rem] h-[30rem] bg-[#0845A5]/5 rounded-full blur-[100px] -z-0" />
            <div className="absolute bottom-0 left-0 w-[24rem] h-[24rem] bg-[#F14E2B]/5 rounded-full blur-[100px] -z-0" />

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <span className="text-[11px] font-black uppercase tracking-[0.3em] text-[#F14E2B] mb-3 block">
                        Testimonials
                    </span>
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-6">
                        Trusted by Students &
                        <br />
                        <span className="text-[#0845A5]">Appreciated by Parents</span>
                    </h2>
                    <p className="text-slate-500 font-medium text-sm md:text-base leading-relaxed">
                        Read the experiences of students and parents who have benefited from our IQ and Career Aptitude Assessments and taken confident steps toward a brighter future.
                    </p>
                </div>

                {/* Grid */}
                <div className="grid lg:grid-cols-3 gap-8 items-stretch">
                    {testimonials.map((t, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className={`relative rounded-[2.5rem] border p-8 flex flex-col justify-between transition-all duration-500 hover:shadow-2xl hover:shadow-slate-200/80 ${
                                t.featured 
                                ? 'bg-white border-[#0845A5]/30 shadow-xl shadow-slate-200/60 lg:scale-[1.03] z-10' 
                                : 'bg-slate-50/50 border-slate-200/80 hover:bg-white hover:border-slate-300'
                            }`}
                        >
                            <div>
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-10 h-10 rounded-xl bg-[#0845A5]/10 flex items-center justify-center">
                                        <Quote size={20} className="text-[#0845A5]" />
                                    </div>
                                    {t.featured && (
                                        <span className="text-[9px] font-black uppercase tracking-wider text-[#F14E2B] bg-[#F14E2B]/10 px-2.5 py-1 rounded-full">
                                            Featured Review
                                        </span>
                                    )}
                                </div>
                                <p className="text-slate-600 text-sm md:text-base font-medium leading-relaxed italic mb-8">
                                    "{t.quote}"
                                </p>
                            </div>

                            <div className="flex items-center gap-4 pt-6 border-t border-slate-100">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border ${
                                    t.featured 
                                    ? 'bg-[#F14E2B]/10 text-[#F14E2B] border-[#F14E2B]/30' 
                                    : 'bg-[#0845A5]/10 text-[#0845A5] border-slate-200'
                                }`}>
                                    <User size={24} className="stroke-[2.5]" />
                                </div>
                                <div>
                                    <h4 className="font-black text-slate-900 text-base leading-tight">{t.name}</h4>
                                    <p className="text-xs text-slate-400 font-extrabold uppercase tracking-wider mt-0.5">{t.role}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
