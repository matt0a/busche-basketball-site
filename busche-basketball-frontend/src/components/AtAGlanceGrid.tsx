import { useState } from "react";
import { TopoBackground } from "./TopoBackground";

type Tile = {
    stat: string;
    headline: string;
    description: string;
    icon: React.ReactNode;
};

const TILES: Tile[] = [
    {
        stat: "150",
        headline: "150 students in our student body",
        description:
            "Day and boarding students from across the US and internationally — a close-knit community of learners and athletes.",
        icon: (
            <svg className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
        ),
    },
    {
        stat: "20+",
        headline: "20+ countries represented on campus",
        description:
            "Our students bring global perspectives that enrich every classroom and dorm conversation.",
        icon: (
            <svg className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
            </svg>
        ),
    },
    {
        stat: "100%",
        headline: "100% college placement rate",
        description:
            "Every Busche graduate goes on to pursue higher education — an unbroken record of college acceptance.",
        icon: (
            <svg className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
            </svg>
        ),
    },
    {
        stat: "60+",
        headline: "60+ college credits available",
        description:
            "Through our CMCC partnership, students leave with transferable credits and a head start on their degree.",
        icon: (
            <svg className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0118 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
        ),
    },
    {
        stat: "9:1",
        headline: "9-to-1 student-faculty ratio",
        description:
            "Small classes mean personalized attention — every student is known by name, not by number.",
        icon: (
            <svg className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
        ),
    },
    {
        stat: "70",
        headline: "70-acre New England campus",
        description:
            "Nestled in Chester, NH, our campus offers space to train, study, and find inspiration in nature.",
        icon: (
            <svg className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
        ),
    },
    {
        stat: "40 mi",
        headline: "40 miles from Boston",
        description:
            "Rural peace, city access — Chester sits 40 miles from Boston and 13 miles from Manchester, NH.",
        icon: (
            <svg className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
        ),
    },
    {
        stat: "2",
        headline: "2 elite basketball programs",
        description:
            "Our National and Regional teams compete at the highest prep school level with college-track coaching.",
        icon: (
            <svg className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <circle cx="12" cy="12" r="9" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.5 3 4 5.7 4 9s-1.5 6-4 9M12 3c-2.5 3-4 5.7-4 9s1.5 6 4 9M3 12h18" />
            </svg>
        ),
    },
    {
        stat: "6–PG",
        headline: "Grades 6 through 12 + Postgraduate",
        description:
            "From middle school through postgraduate year, Busche supports every stage of a student's journey.",
        icon: (
            <svg className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
        ),
    },
];

export const AtAGlanceGrid = () => {
    const [active, setActive] = useState(0);
    const tile = TILES[active];

    return (
        <section
            className="relative py-12 md:py-24 overflow-hidden"
            style={{
                background:
                    "radial-gradient(ellipse at 20% 80%, rgba(0,159,253,0.10) 0%, transparent 50%), radial-gradient(ellipse at 85% 15%, rgba(0,159,253,0.06) 0%, transparent 45%), #18303f",
            }}
        >
            <TopoBackground opacity={0.065} />
            <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8">
                {/* Section title */}
                <div className="mb-12 md:mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                        At a glance
                    </h2>
                    <div className="mt-3 h-0.5 w-14 rounded-full bg-primary" />
                </div>

                <div className="flex flex-col md:flex-row md:items-center gap-8 md:gap-20">
                    {/* 3×3 tile grid */}
                    <div
                        className="grid grid-cols-3 shrink-0 rounded-xl overflow-hidden ring-1 ring-white/8 mx-auto md:mx-0"
                        style={{ gap: "2px", background: "rgba(255,255,255,0.06)" }}
                    >
                        {TILES.map((t, idx) => (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => setActive(idx)}
                                aria-label={t.headline}
                                aria-pressed={idx === active}
                                className={`
                                    group relative
                                    w-[88px] h-[88px] sm:w-[108px] sm:h-[108px] md:w-[126px] md:h-[126px]
                                    flex items-center justify-center
                                    transition-all duration-250
                                    ${idx === active
                                        ? "bg-primary"
                                        : "bg-[#1e3a4a] hover:bg-[#1e3a4a]/80"
                                    }
                                `}
                            >
                                {/* Hover shimmer overlay on inactive */}
                                {idx !== active && (
                                    <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-250 bg-gradient-to-br from-white/8 to-transparent pointer-events-none" />
                                )}

                                {/* Icon */}
                                <span
                                    className={`
                                        text-white relative z-10
                                        transition-transform duration-250
                                        ${idx === active ? "scale-[1.45] sm:scale-110" : "scale-[1.3] sm:scale-100 group-hover:scale-[1.45] sm:group-hover:scale-110 opacity-60 group-hover:opacity-100"}
                                    `}
                                >
                                    {t.icon}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Stat panel — key forces remount → triggers fade-in-up */}
                    <div key={active} className="flex-1 min-w-0">
                        <p className="text-[52px] sm:text-[72px] md:text-[96px] lg:text-[112px] font-extrabold text-primary leading-none tabular-nums fade-in-up">
                            {tile.stat}
                        </p>

                        <div
                            className="fade-in-up"
                            style={{ animationDelay: "50ms" }}
                        >
                            <hr className="border-white/15 my-5 md:my-6" />
                            <p className="text-white text-xl md:text-2xl font-bold mb-3 leading-snug">
                                {tile.headline}
                            </p>
                            <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-md">
                                {tile.description}
                            </p>
                        </div>

                        {/* Tile position indicator */}
                        <div className="flex gap-1.5 mt-8 fade-in-up" style={{ animationDelay: "80ms" }}>
                            {TILES.map((_, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => setActive(idx)}
                                    aria-label={`Go to tile ${idx + 1}`}
                                    className={`h-1 rounded-full transition-all duration-300 ${
                                        idx === active
                                            ? "bg-primary w-6"
                                            : "bg-white/20 w-2 hover:bg-white/40"
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
