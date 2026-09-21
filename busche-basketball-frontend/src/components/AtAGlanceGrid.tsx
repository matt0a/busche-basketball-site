import { useState } from "react";
import { TopoBackground } from "./TopoBackground";
import {
    Basketball,
    BookOpen,
    ChalkboardTeacher,
    Globe,
    GraduationCap,
    House,
    MapPin,
    Student,
    UsersThree,
} from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";

type Tile = {
    stat: string;
    headline: string;
    description: string;
    Icon: Icon;
};

const TILES: Tile[] = [
    {
        stat: "150",
        headline: "150 students in our student body",
        description:
            "Day and boarding students from across the US and internationally — a close-knit community of learners and athletes.",
        Icon: UsersThree,
    },
    {
        stat: "20+",
        headline: "20+ countries represented on campus",
        description:
            "Our students bring global perspectives that enrich every classroom and dorm conversation.",
        Icon: Globe,
    },
    {
        stat: "100%",
        headline: "100% college placement rate",
        description:
            "Every Busche graduate goes on to pursue higher education — an unbroken record of college acceptance.",
        Icon: GraduationCap,
    },
    {
        stat: "60+",
        headline: "60+ college credits available",
        description:
            "Through our CMCC partnership, students leave with transferable credits that count toward their degree.",
        Icon: BookOpen,
    },
    {
        stat: "9:1",
        headline: "9-to-1 student-faculty ratio",
        description:
            "Small classes mean personalized attention — every student is known by name, not by number.",
        Icon: ChalkboardTeacher,
    },
    {
        stat: "70",
        headline: "70-acre New England campus",
        description:
            "Nestled in Chester, NH, our campus offers space to train, study, and find inspiration in nature.",
        Icon: House,
    },
    {
        stat: "40 mi",
        headline: "40 miles from Boston",
        description:
            "Rural peace, city access — Chester sits 40 miles from Boston and 13 miles from Manchester, NH.",
        Icon: MapPin,
    },
    {
        stat: "3",
        headline: "3 elite basketball teams",
        description:
            "Our National and Regional teams compete at the highest prep school level with college-track coaching.",
        Icon: Basketball,
    },
    {
        stat: "6–PG",
        headline: "Grades 6 through 12 + Postgraduate",
        description:
            "From middle school through postgraduate year, Busche supports every stage of a student's journey.",
        Icon: Student,
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
                                    <t.Icon size={36} weight="duotone" />
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
