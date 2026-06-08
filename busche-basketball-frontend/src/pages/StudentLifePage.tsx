import { SectionNav } from "../components/SectionNav";
import { DocumentLink } from "../components/DocumentLink";

const SECTION_NAV = [
    { id: "housing", label: "Housing" },
    { id: "dining", label: "Dining" },
    { id: "policies", label: "Dorm Policies" },
];

// ── Inline SVG icons ──────────────────────────────────────────────────────────

const BuildingIcon = () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0H3m2 0h14M9 7h1m-1 4h1m4-4h1m-1 4h1M9 15h6" />
    </svg>
);

const BedIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h18M3 12V8a2 2 0 012-2h14a2 2 0 012 2v4M3 12v5m18-5v5M5 17h14" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12V8h14v4" />
    </svg>
);

const DeskIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16v4H4zM6 11v6M18 11v6M9 17h6" />
    </svg>
);

const WifiIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M1.371 8.143c5.858-5.857 15.356-5.857 21.213 0" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.093 11.866a9.5 9.5 0 0113.814 0" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.516 15.289a5 5 0 016.968 0" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 19h.01" />
    </svg>
);

const CheckCircleIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const UtensilsIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 2v7c0 1.5 1 2.5 2 3v10M7 2v20M13 2c0 0 4 2.5 4 7s-4 7-4 7v6" />
    </svg>
);

const ClockIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
    </svg>
);

const ShieldIcon = () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
);

// ── Section divider ───────────────────────────────────────────────────────────

const AccentDivider = () => (
    <div className="h-px bg-gradient-to-r from-primary/40 via-aqua/30 to-transparent my-0" />
);

// ── Room amenity icon map ─────────────────────────────────────────────────────

type AmenityEntry = {
    label: string;
    icon: React.ReactNode;
    accent: "primary" | "aqua";
};

const ROOM_AMENITIES: AmenityEntry[] = [
    { label: "Bed (height adjustable)", icon: <BedIcon />, accent: "primary" },
    { label: "Mattress", icon: <BedIcon />, accent: "aqua" },
    { label: "Writing Desk", icon: <DeskIcon />, accent: "primary" },
    { label: "Chair", icon: <DeskIcon />, accent: "aqua" },
    { label: "Dresser", icon: <DeskIcon />, accent: "primary" },
    { label: "High-Speed WiFi", icon: <WifiIcon />, accent: "aqua" },
];

const ON_SITE_ACCESS: AmenityEntry[] = [
    { label: "Student Lounges", icon: <BuildingIcon />, accent: "primary" },
    { label: "Laundry Facilities", icon: <CheckCircleIcon />, accent: "aqua" },
    { label: "Ice Machine", icon: <CheckCircleIcon />, accent: "primary" },
    { label: "Vending Machine", icon: <CheckCircleIcon />, accent: "aqua" },
    { label: "Water Fountain", icon: <CheckCircleIcon />, accent: "primary" },
];

// ── Core values pill colors ───────────────────────────────────────────────────

type ValueEntry = {
    label: string;
    variant: "primary" | "aqua";
};

const CORE_VALUES: ValueEntry[] = [
    { label: "Respect", variant: "primary" },
    { label: "Honesty", variant: "aqua" },
    { label: "Care", variant: "primary" },
    { label: "Safety", variant: "aqua" },
    { label: "Responsibility", variant: "primary" },
];

// ── Page component ────────────────────────────────────────────────────────────

export const StudentLifePage = () => (
    <div className="min-h-screen bg-white">

        {/* ── Hero ── */}
        <section className="relative bg-slate-900 text-white overflow-hidden">
            <div
                className="absolute inset-0 opacity-[0.15]"
                style={{
                    backgroundImage:
                        "radial-gradient(circle at 25% 25%, #009FFD 0%, transparent 50%), radial-gradient(circle at 75% 75%, #2AFC98 0%, transparent 50%)",
                }}
            />
            <div className="relative max-w-6xl mx-auto px-4 py-20 md:py-28">
                <div className="max-w-3xl">
                    <p className="text-primary font-semibold text-sm uppercase tracking-[0.2em] mb-4">
                        STUDENT LIFE
                    </p>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                        Life at Busche Academy
                    </h1>
                    <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl">
                        A welcoming campus where students live, learn, and grow together in Chester,
                        New Hampshire.
                    </p>
                </div>
            </div>

            {/* Hero stat strip */}
            <div className="relative border-t border-white/10 bg-white/5 backdrop-blur-sm">
                <div className="max-w-6xl mx-auto px-4 py-5">
                    <div className="grid grid-cols-3 divide-x divide-white/10">
                        {[
                            { stat: "2", label: "Dormitories" },
                            { stat: "3", label: "Meals Per Day" },
                            { stat: "Chester, NH", label: "Campus Location" },
                        ].map(({ stat, label }) => (
                            <div key={label} className="flex flex-col items-center px-4 py-1 text-center">
                                <span className="text-2xl md:text-3xl font-bold text-white">{stat}</span>
                                <span className="text-xs text-slate-400 mt-1 leading-tight">{label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>

        <SectionNav sections={SECTION_NAV} />

        {/* ── Housing ── */}
        <section id="housing" className="py-16 md:py-20 bg-white" style={{ scrollMarginTop: "80px" }}>
            <div className="max-w-6xl mx-auto px-4">
                <p className="text-primary font-semibold text-sm uppercase tracking-[0.2em] mb-2">
                    CAMPUS HOUSING
                </p>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-1">
                    Home Away From Home
                </h2>
                <div className="w-12 h-1 rounded-full bg-gradient-to-r from-primary to-aqua mb-4" />
                <p className="text-slate-600 mb-10 max-w-2xl">
                    Our dormitories were originally built for Chester College, giving students a true
                    collegiate living experience.
                </p>

                {/* Dorm cards */}
                <div className="grid md:grid-cols-2 gap-6 mb-12">
                    {[
                        {
                            name: "Adams Hall",
                            desc: "One of two historic residence halls on the former Chester College campus. Students live in shared rooms with classic college-style furniture.",
                            exterior: "/adams-hall-exterior.jpg",
                            interior: "/adams-hall-interior.jpg",
                        },
                        {
                            name: "Preston Hall",
                            desc: "Our second dormitory, offering the same quality living environment. Both halls are supervised by adult staff who live alongside students.",
                            exterior: "/preston-hall-exterior.jpg",
                            interior: "/preston-hall-interior.jpg",
                        },
                    ].map((dorm) => (
                        <div
                            key={dorm.name}
                            className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden border-l-4 border-l-primary
                                hover:-translate-y-1 hover:shadow-card-hover hover:border-primary/40
                                transition-all duration-300"
                        >
                            {/* 2-photo grid: exterior + interior */}
                            <div className="grid grid-cols-2 h-52">
                                <img
                                    src={dorm.exterior}
                                    alt={`${dorm.name} exterior`}
                                    className="w-full h-full object-cover"
                                />
                                <img
                                    src={dorm.interior}
                                    alt={`${dorm.name} interior`}
                                    className="w-full h-full object-cover border-l-2 border-white"
                                />
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-slate-900 mb-2">{dorm.name}</h3>
                                <p className="text-slate-600 text-sm leading-relaxed">{dorm.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Room amenities */}
                <div className="mb-10">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Every Room Includes</h3>
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {ROOM_AMENITIES.map((item) => (
                            <div
                                key={item.label}
                                className="flex items-center gap-3 bg-slate-50 rounded-xl px-3 py-2.5 hover:bg-sky-50 transition-colors duration-200"
                            >
                                <div className={`flex-shrink-0 rounded-lg p-1.5 ${item.accent === "aqua" ? "bg-aqua/10 text-emerald-600" : "bg-primary/10 text-primary"}`}>
                                    {item.icon}
                                </div>
                                <span className="text-slate-700 text-sm font-medium">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* On-site access */}
                <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-4">On-Site Access</h3>
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {ON_SITE_ACCESS.map((item) => (
                            <div
                                key={item.label}
                                className="flex items-center gap-3 bg-slate-50 rounded-xl px-3 py-2.5 hover:bg-sky-50 transition-colors duration-200"
                            >
                                <div className={`flex-shrink-0 rounded-lg p-1.5 ${item.accent === "aqua" ? "bg-aqua/10 text-emerald-600" : "bg-primary/10 text-primary"}`}>
                                    {item.icon}
                                </div>
                                <span className="text-slate-700 text-sm font-medium">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>

        <AccentDivider />

        {/* ── Dining ── */}
        <section id="dining" className="py-16 md:py-20 bg-slate-50" style={{ scrollMarginTop: "80px" }}>
            <div className="max-w-6xl mx-auto px-4">
                <p className="text-primary font-semibold text-sm uppercase tracking-[0.2em] mb-2">
                    DINING SERVICES
                </p>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-1">
                    Chef-Prepared Meals Every Day
                </h2>
                <div className="w-12 h-1 rounded-full bg-gradient-to-r from-primary to-aqua mb-4" />
                <p className="text-slate-600 mb-10 max-w-2xl">
                    Our dining program is led by Executive Chef Ralph Notenboom, bringing world-class
                    culinary expertise to our students.
                </p>

                <div className="grid lg:grid-cols-2 gap-8 items-start">
                    {/* Chef bio */}
                    <div className="bg-slate-900 text-white rounded-2xl p-8">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="bg-primary/20 text-primary rounded-xl p-2.5">
                                <UtensilsIcon />
                            </div>
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-[0.2em]">
                                Meet the Chef
                            </p>
                        </div>
                        <h3 className="text-2xl font-bold mb-1">Chef Ralph Notenboom</h3>
                        <p className="text-primary font-semibold text-sm uppercase tracking-wide mb-4">
                            Executive Chef & Director of Dining Services
                        </p>
                        <p className="text-slate-300 leading-relaxed mb-5">
                            Chef Notenboom was born in Rotterdam, The Netherlands into a restaurant family.
                            A graduate of the VBH School of Culinary Arts, he received top honors and
                            worked in Michelin-starred restaurants before joining Busche Academy.
                        </p>
                        <a href="mailto:chef@buscheacademy.org" className="text-primary hover:underline text-sm">
                            chef@buscheacademy.org
                        </a>
                    </div>

                    {/* Hours */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="bg-primary/10 text-primary rounded-xl p-2.5">
                                <ClockIcon />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">Hours of Operation</h3>
                        </div>
                        <div className="space-y-5">
                            <div>
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                                    Monday–Friday
                                </p>
                                <div className="space-y-0.5 text-sm text-slate-700">
                                    {[
                                        { meal: "Breakfast", time: "7:00am – 8:00am" },
                                        { meal: "Lunch", time: "11:00am – 12:00pm" },
                                        { meal: "Dinner", time: "5:00pm – 6:30pm" },
                                    ].map(({ meal, time }) => (
                                        <div
                                            key={meal}
                                            className="flex justify-between hover:bg-sky-50 rounded-lg px-2 py-1.5 -mx-2 transition-colors duration-150"
                                        >
                                            <span>{meal}</span>
                                            <span className="font-medium">{time}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="border-t border-slate-100 pt-4">
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                                    Saturday & Sunday
                                </p>
                                <div className="space-y-0.5 text-sm text-slate-700">
                                    {[
                                        { meal: "Brunch", time: "10:00am – 12:00pm" },
                                        { meal: "Dinner", time: "5:00pm – 6:30pm" },
                                    ].map(({ meal, time }) => (
                                        <div
                                            key={meal}
                                            className="flex justify-between hover:bg-sky-50 rounded-lg px-2 py-1.5 -mx-2 transition-colors duration-150"
                                        >
                                            <span>{meal}</span>
                                            <span className="font-medium">{time}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <p className="text-xs text-slate-500 mt-5 border-t border-slate-100 pt-4">
                            For questions about menu options or dietary needs, email{" "}
                            <a href="mailto:chef@buscheacademy.org" className="text-primary hover:underline">
                                chef@buscheacademy.org
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <AccentDivider />

        {/* ── Dorm Policies ── */}
        <section id="policies" className="py-16 md:py-20 bg-white" style={{ scrollMarginTop: "80px" }}>
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex items-center gap-3 mb-2">
                    <div className="bg-primary/10 text-primary rounded-xl p-2.5">
                        <ShieldIcon />
                    </div>
                    <p className="text-primary font-semibold text-sm uppercase tracking-[0.2em]">
                        RESIDENTIAL LIFE
                    </p>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-1">
                    Dorm Policies & Expectations
                </h2>
                <div className="w-12 h-1 rounded-full bg-gradient-to-r from-primary to-aqua mb-4" />
                <p className="text-slate-600 mb-6 max-w-2xl">
                    We maintain a structured, safe, and respectful living environment for all students.
                </p>

                <p className="text-slate-600 leading-relaxed mb-6 max-w-2xl">
                    At Busche Academy, we emphasize respect, honesty, care, safety, and responsibility.
                    These values are reflected in our residential policies.
                </p>

                {/* Core value pills */}
                <div className="flex flex-wrap gap-2 mb-8">
                    {CORE_VALUES.map((v) => (
                        <span
                            key={v.label}
                            className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide
                                ${v.variant === "aqua"
                                    ? "bg-aqua/10 text-emerald-700"
                                    : "bg-primary/10 text-primary"
                                }`}
                        >
                            {v.label}
                        </span>
                    ))}
                </div>

                <div className="mb-6">
                    <DocumentLink documentKey="DORM_POLICIES" label="Dorm Policies & Guidelines" />
                </div>

                <p className="text-sm text-slate-600 mb-3">
                    For questions about residential life, contact{" "}
                    <a href="mailto:info@buscheacademy.org" className="text-primary hover:underline">
                        info@buscheacademy.org
                    </a>
                </p>
                <p className="text-sm text-slate-500">
                    Adult staff live alongside students in all dormitories to ensure safety and comfort.
                </p>
            </div>
        </section>
    </div>
);
