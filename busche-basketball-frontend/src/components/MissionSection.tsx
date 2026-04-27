import { TopoBackground } from "./TopoBackground";

export const MissionSection = () => {
    return (
        <section
            className="relative py-16 md:py-24 overflow-hidden"
            style={{
                background:
                    "radial-gradient(ellipse at 90% 10%, rgba(0,159,253,0.08) 0%, transparent 50%), #264653",
            }}
        >
            <TopoBackground opacity={0.055} />
            <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8">
                {/* Header */}
                <div className="mb-12 md:mb-16">
                    <p className="text-primary font-semibold text-xs uppercase tracking-[0.3em] mb-3">
                        Our Foundation
                    </p>
                    <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                        What Drives Us
                    </h2>
                    <div className="mt-3 h-0.5 w-14 rounded-full bg-primary/60" />
                </div>

                {/* Three-column card grid */}
                <div className="grid md:grid-cols-3 gap-5">

                    {/* Card 1 — Mission (dark glass) */}
                    <div
                        className="relative rounded-2xl overflow-hidden flex flex-col justify-between p-8 md:p-10 min-h-[260px] border border-white/10 group hover:border-white/20 transition-all duration-300"
                        style={{
                            background:
                                "linear-gradient(145deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 100%)",
                        }}
                    >
                        {/* Decorative large quote */}
                        <span
                            aria-hidden="true"
                            className="absolute -top-4 -left-2 font-serif leading-none select-none pointer-events-none text-primary/15 transition-all duration-500 group-hover:text-primary/25"
                            style={{ fontSize: "160px", lineHeight: 1 }}
                        >
                            &ldquo;
                        </span>

                        {/* Subtle top glow on hover */}
                        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="relative z-10">
                            <p className="text-primary text-[10px] font-bold uppercase tracking-[0.3em] mb-5">
                                Our Mission
                            </p>
                            <p className="text-white/90 text-lg md:text-xl font-light italic leading-relaxed">
                                "To empower students to become lifelong learners and leaders of the world."
                            </p>
                        </div>

                        <p className="relative z-10 text-primary/70 text-xs font-semibold uppercase tracking-[0.25em] mt-6">
                            — Busche Academy
                        </p>
                    </div>

                    {/* Card 2 — Vision (white) */}
                    <div className="rounded-2xl bg-white p-8 md:p-10 flex flex-col gap-5 border border-transparent hover:-translate-y-2 hover:shadow-[0_24px_48px_rgba(0,0,0,0.18)] transition-all duration-300 cursor-default group">
                        {/* Icon */}
                        <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary/15 transition-colors duration-300">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>

                        <div>
                            <h3 className="font-bold text-slate-900 text-lg mb-3">Our Vision</h3>
                            {/* NOTE: Vision statement derived — client should confirm or supply official text */}
                            <p className="text-slate-500 text-sm leading-relaxed">
                                To be the premier academy where rigorous academics and elite athletics unite to develop tomorrow's leaders.
                            </p>
                        </div>

                        {/* Animated accent bar */}
                        <div className="mt-auto pt-4 border-t border-slate-100">
                            <div className="h-0.5 rounded-full bg-primary w-0 group-hover:w-12 transition-all duration-500 ease-out" />
                        </div>
                    </div>

                    {/* Card 3 — Values (primary blue) */}
                    <div className="rounded-2xl bg-primary p-8 md:p-10 flex flex-col gap-6 hover:-translate-y-2 hover:shadow-[0_24px_48px_rgba(0,159,253,0.35)] transition-all duration-300 cursor-default group">
                        {/* Icon */}
                        <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center text-white shrink-0 group-hover:bg-white/30 transition-colors duration-300">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                            </svg>
                        </div>

                        <div>
                            <h3 className="font-bold text-white text-lg mb-4">Our Values</h3>
                            <div className="flex flex-col gap-2.5">
                                {[
                                    { label: "Diversity", desc: "Celebrating every background & culture" },
                                    { label: "Excellence", desc: "High standards in academics & athletics" },
                                    { label: "Community & Family", desc: "Rooted in connection, care & belonging" },
                                ].map((v) => (
                                    <div
                                        key={v.label}
                                        className="flex items-start gap-3 group/pill"
                                    >
                                        <span className="mt-1 w-1.5 h-1.5 rounded-full bg-white/60 shrink-0 group-hover/pill:bg-white transition-colors duration-200" />
                                        <div>
                                            <span className="text-white font-semibold text-sm">{v.label}</span>
                                            <p className="text-white/60 text-xs leading-relaxed group-hover/pill:text-white/80 transition-colors duration-200">{v.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};
