import { motion } from 'framer-motion';

const LeadershipSection = () => {
    const leaders = [
        {
            name: "Mr. Shrisagar Mali",
            role: "Chief Executive Officer",
            image: "/Shrisagar (2).png",
            tags: ["Teacher", "Motivational Speaker", "Educational Counselor", "Career Coach & Writer"]
        },
        {
            name: "Mrs. Dhanshree Mali",
            role: "Chief Administrative Officer",
            image: "/Dhanshree.png",
            tags: ["Educator", "Curriculum Developer", "Podcaster, Blogger & EdTech Consultant"]
        }
    ];

    return (
        <section id="leadership" className="relative py-28 px-6 bg-white overflow-hidden">
            {/* Subtle background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-[#0845A5]/5 rounded-full blur-[120px] -z-0" />

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <div className="text-center max-w-4xl mx-auto mb-20">
                    <span className="text-[11px] font-black uppercase tracking-[0.3em] text-[#F14E2B] mb-3 block">
                        Our Core Leadership
                    </span>
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-6">
                        Meet Our <span className="text-[#0845A5]">Leadership</span>
                    </h2>
                    <p className="text-slate-500 font-medium text-sm md:text-base leading-relaxed max-w-3xl mx-auto">
                        Meet the visionary leaders, passionate educators, career experts, and industry professionals dedicated to helping students discover their true potential through accurate assessments, personalized guidance, and innovative educational solutions.
                    </p>
                </div>

                {/* Leaders Grid */}
                <div className="grid md:grid-cols-2 gap-12 lg:gap-16 max-w-4xl mx-auto">
                    {leaders.map((leader, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: i * 0.2 }}
                            className="group relative bg-slate-50 rounded-[2.5rem] border border-slate-200/80 p-6 lg:p-8 hover:border-slate-300 hover:bg-white hover:shadow-2xl hover:shadow-slate-200/80 transition-all duration-500 flex flex-col items-center text-center"
                        >
                            {/* Image Showcase */}
                            <div className="relative w-[70%] aspect-[4/5] rounded-3xl overflow-hidden border border-slate-200 bg-white mb-6 shadow-sm group-hover:shadow-md transition-shadow duration-500">
                                <img
                                    src={leader.image}
                                    alt={leader.name}
                                    className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/35 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            </div>

                            {/* Info */}
                            <h3 className="text-2xl font-black text-slate-950 transition-colors duration-300 group-hover:text-[#0845A5]">
                                {leader.name}
                            </h3>
                            
                            <p className="text-sm font-extrabold uppercase tracking-wider text-[#F14E2B] mt-1.5 mb-5">
                                {leader.role}
                            </p>

                            <div className="h-px bg-slate-200/80 w-full mb-5" />

                            {/* Tags list */}
                            <div className="flex flex-wrap justify-center gap-2">
                                {leader.tags.map((tag, idx) => (
                                    <span 
                                        key={idx} 
                                        className="text-[12px] font-bold text-slate-600 bg-slate-200/50 hover:bg-slate-200 px-4 py-2 rounded-full transition-colors duration-300"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default LeadershipSection;
