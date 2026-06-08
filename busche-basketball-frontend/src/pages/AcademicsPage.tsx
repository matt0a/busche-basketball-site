import { SectionNav } from "../components/SectionNav";
import { DocumentLink } from "../components/DocumentLink";
import { CollegeMarquee } from "../components/CollegeMarquee";

const SECTION_NAV = [
    { id: "overview", label: "Overview" },
    { id: "curriculum", label: "Curriculum" },
    { id: "ncaa-eligibility", label: "NCAA Eligibility" },
    { id: "outcomes", label: "College Outcomes" },
];

// ── Inline SVG icons ──────────────────────────────────────────────────────────

const GraduationCapIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422A12.083 12.083 0 0121 17.5c0 1.657-4.03 3-9 3s-9-1.343-9-3c0-1.09.693-2.1 1.84-2.922L12 14z" />
    </svg>
);

const UsersIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87m6-4a4 4 0 11-8 0 4 4 0 018 0zm6 4a2 2 0 100-4 2 2 0 000 4zM3 18a2 2 0 100-4 2 2 0 000 4z" />
    </svg>
);

const BookOpenIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
);

const TrophyIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 21h8M12 17v4M7 4H5a2 2 0 00-2 2v2c0 3.314 2.686 6 6 6h2m7-10h2a2 2 0 012 2v2c0 3.314-2.686 6-6 6h-2M7 4h10v6a5 5 0 01-10 0V4z" />
    </svg>
);

const BuildingIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0H3m2 0h14M9 7h1m-1 4h1m4-4h1m-1 4h1M9 15h6" />
    </svg>
);

const StarIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
);

const FileDocIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 3v5a1 1 0 001 1h5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 13h6M9 17h4" />
    </svg>
);

const CheckCircleIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

// ── Section divider ───────────────────────────────────────────────────────────

const AccentDivider = () => (
    <div className="h-px bg-gradient-to-r from-primary/40 via-aqua/30 to-transparent my-0" />
);

// ── Highlight card data ───────────────────────────────────────────────────────

type HighlightCard = {
    title: string;
    body: string;
    icon: React.ReactNode;
    accent: "primary" | "aqua";
};

const HIGHLIGHT_CARDS: HighlightCard[] = [
    {
        title: "CMCC Partnership",
        body: "Through our concurrent enrollment partnership with Central Maine Community College (CMCC), students have the opportunity to earn college credits in high school, helping reduce time and cost in college.",
        icon: <GraduationCapIcon />,
        accent: "primary",
    },
    {
        title: "9:1 Ratio",
        body: "Small class sizes mean every student receives personal attention and mentorship from faculty who know them individually.",
        icon: <UsersIcon />,
        accent: "aqua",
    },
    {
        title: "Grades 6–12 + PG",
        body: "We serve students from middle school through high school and postgraduate year. PG students have additional pathways to earn college credits through CLEP exams, with free preparation available through Modern States.",
        icon: <BookOpenIcon />,
        accent: "primary",
    },
];

type AccreditationItem = {
    heading: string;
    body: string;
    icon: React.ReactNode;
};

const ACCREDITATION_ITEMS: AccreditationItem[] = [
    {
        heading: "NCAA Certified Program",
        body: "Student-athletes meet eligibility requirements for collegiate athletics.",
        icon: <TrophyIcon />,
    },
    {
        heading: "NH Dept. of Education",
        body: "Approved by the New Hampshire Department of Education.",
        icon: <BuildingIcon />,
    },
    {
        heading: "CMCC Partnership",
        body: "Concurrent enrollment through Central Maine Community College (CMCC).",
        icon: <StarIcon />,
    },
];

type DocumentEntry = {
    documentKey: string;
    label: string;
};

const DOCUMENTS: DocumentEntry[] = [
    { documentKey: "HS_CURRICULUM", label: "High School Curriculum" },
    { documentKey: "PG_CURRICULUM", label: "PG / Postgraduate Curriculum" },
    { documentKey: "CALENDAR", label: "Academic Calendar" },
    { documentKey: "CATALOG", label: "Course Catalog" },
];

// ── Page component ────────────────────────────────────────────────────────────

export const AcademicsPage = () => (
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
                        ACADEMICS
                    </p>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                        A Rigorous, Future-Ready Curriculum
                    </h1>
                    <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl">
                        College-prep coursework, CMCC college credits, and a 9:1 student-teacher ratio.
                    </p>
                </div>
            </div>

            {/* Hero stat strip */}
            <div className="relative border-t border-white/10 bg-white/5 backdrop-blur-sm">
                <div className="max-w-6xl mx-auto px-4 py-5">
                    <div className="grid grid-cols-3 divide-x divide-white/10">
                        {[
                            { stat: "9:1", label: "Student–Teacher Ratio" },
                            { stat: "60+", label: "College Credits Available" },
                            { stat: "6–12 + PG", label: "Grade Range" },
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

        {/* ── Overview ── */}
        <section id="overview" className="py-16 md:py-20 bg-white" style={{ scrollMarginTop: "80px" }}>
            <div className="max-w-6xl mx-auto px-4">
                <p className="text-primary font-semibold text-sm uppercase tracking-[0.2em] mb-2">
                    ACADEMICS AT BUSCHE ACADEMY
                </p>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-1">
                    College Prep from Day One
                </h2>
                {/* Eyebrow accent bar */}
                <div className="w-12 h-1 rounded-full bg-gradient-to-r from-primary to-aqua mb-10" />

                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    {/* Left: prose */}
                    <div className="space-y-5">
                        <p className="text-slate-600 leading-relaxed">
                            Busche Academy's academic curriculum is designed to provide a wide range of
                            intellectual opportunities that allow our students to delve deeply into areas
                            of particular interest. With foundational courses, honors classes, and
                            independent study, students choose from a wide selection of traditional and
                            innovative courses.
                        </p>
                        <p className="text-slate-600 leading-relaxed">
                            We offer a rigorous academic curriculum taught by passionate, diverse, and
                            expert teachers. Advanced Placement (AP) courses will be offered in the
                            future.
                        </p>
                    </div>

                    {/* Right: highlight cards */}
                    <div className="space-y-4">
                        {HIGHLIGHT_CARDS.map((card) => (
                            <div
                                key={card.title}
                                className={`bg-white rounded-2xl border border-slate-200 shadow-card p-6 flex gap-4 items-start
                                    hover:-translate-y-1 hover:shadow-card-hover hover:border-primary/30
                                    transition-all duration-300
                                    ${card.accent === "aqua" ? "border-l-4 border-l-aqua" : "border-l-4 border-l-primary"}`}
                            >
                                <div className={`flex-shrink-0 rounded-xl p-2.5 ${card.accent === "aqua" ? "bg-aqua/10 text-emerald-600" : "bg-primary/10 text-primary"}`}>
                                    {card.icon}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-1">{card.title}</h3>
                                    <p className="text-slate-600 text-sm leading-relaxed">{card.body}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Accreditation box */}
                <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 mt-10">
                    <p className="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-5">
                        ACCREDITATION & RECOGNITION
                    </p>
                    {/* Official logos */}
                    <div className="flex flex-wrap items-center gap-8 mb-6 pb-6 border-b border-primary/10">
                        <img src="/nh-doe-logo.jpg" alt="NH Department of Education" className="h-8 object-contain" />
                        <img src="/ncaa-approved-badge.jpg" alt="NCAA Approved" className="h-14 w-14 object-contain" />
                        <img src="/ncaa-approved-courses.jpg" alt="NCAA Approved Courses" className="h-8 object-contain" />
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {ACCREDITATION_ITEMS.map((item) => (
                            <div key={item.heading} className="flex gap-3 items-start group">
                                <div className="flex-shrink-0 bg-primary/10 text-primary rounded-xl p-2.5 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                    {item.icon}
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-900 mb-1">{item.heading}</p>
                                    <p className="text-sm text-slate-600 leading-relaxed">{item.body}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <p className="text-xs text-slate-500 mt-6 border-t border-primary/10 pt-4">
                        Accreditation details available upon request.
                    </p>
                </div>
            </div>
        </section>

        <AccentDivider />

        {/* ── Curriculum ── */}
        <section id="curriculum" className="py-16 md:py-20 bg-slate-50" style={{ scrollMarginTop: "80px" }}>
            <div className="max-w-6xl mx-auto px-4">
                <p className="text-primary font-semibold text-sm uppercase tracking-[0.2em] mb-2">
                    CURRICULUM RESOURCES
                </p>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-1">
                    Download Program Documents
                </h2>
                <div className="w-12 h-1 rounded-full bg-gradient-to-r from-primary to-aqua mb-4" />
                <p className="text-slate-600 mb-8">
                    The following documents describe our academic programs. Uploaded files open as PDFs.
                </p>

                <div className="grid md:grid-cols-2 gap-4 max-w-2xl">
                    {DOCUMENTS.map(({ documentKey, label }) => (
                        <div
                            key={documentKey}
                            className="bg-white rounded-2xl border border-slate-200 shadow-card p-4 flex items-center gap-3 hover:-translate-y-0.5 hover:shadow-card-hover hover:border-primary/30 transition-all duration-300"
                        >
                            <div className="flex-shrink-0 bg-primary/10 text-primary rounded-xl p-2.5">
                                <FileDocIcon />
                            </div>
                            <DocumentLink documentKey={documentKey} label={label} />
                        </div>
                    ))}
                </div>

                <p className="text-sm text-slate-500 mt-6">
                    PDFs are updated by Busche Academy staff. Contact{" "}
                    <a href="mailto:info@buscheacademy.org" className="text-primary hover:underline">
                        info@buscheacademy.org
                    </a>{" "}
                    if you need the latest version.
                </p>
            </div>
        </section>

        <AccentDivider />

        {/* ── NCAA Eligibility ── */}
        <section id="ncaa-eligibility" className="py-16 md:py-20 bg-white" style={{ scrollMarginTop: "80px" }}>
            <div className="max-w-6xl mx-auto px-4">
                <p className="text-primary font-semibold text-sm uppercase tracking-[0.2em] mb-2">
                    NCAA ELIGIBILITY
                </p>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-1">
                    Officially NCAA Listed
                </h2>
                <div className="w-12 h-1 rounded-full bg-gradient-to-r from-primary to-aqua mb-6" />
                <p className="text-slate-600 mb-8 max-w-2xl">
                    Busche Academy is officially registered in the NCAA Eligibility Center. Student-athletes
                    who complete our NCAA-approved core courses meet the academic requirements for
                    collegiate athletic eligibility at D1, D2, and D3 programs.
                </p>
                <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden max-w-2xl">
                    <img
                        src="/ncaa-eligibility.jpg"
                        alt="NCAA Eligibility Center — Busche Academy listed with approved core courses"
                        className="w-full object-contain"
                    />
                </div>
                <p className="text-sm text-slate-500 mt-4">
                    NCAA HS Code: 853269 · CEEB/ACT Code: 301517 · Chester, New Hampshire
                </p>
            </div>
        </section>

        <AccentDivider />

        {/* ── College Outcomes ── */}
        <section id="outcomes" className="py-16 md:py-20 bg-white" style={{ scrollMarginTop: "80px" }}>
            <div className="max-w-6xl mx-auto px-4">
                <p className="text-primary font-semibold text-sm uppercase tracking-[0.2em] mb-2">
                    COLLEGE OUTCOMES
                </p>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-1">
                    Our Students Go On To
                </h2>
                <div className="w-12 h-1 rounded-full bg-gradient-to-r from-primary to-aqua mb-4" />
                <p className="text-slate-600 mb-10 max-w-2xl">
                    Busche Academy graduates have been accepted to some of the most prestigious colleges
                    and universities in the world.
                </p>

                {/* Decorative "check" row before marquee */}
                <div className="flex items-center gap-2 mb-6">
                    <div className="bg-aqua/10 text-emerald-600 rounded-xl p-1.5">
                        <CheckCircleIcon />
                    </div>
                    <span className="text-sm font-medium text-slate-600">D1, D2, D3 &amp; Ivy League placements</span>
                </div>

                <CollegeMarquee />

                <p className="text-xs text-slate-400 mt-6 text-center">
                    A selection of schools where Busche Academy students have been accepted.
                </p>
            </div>
        </section>
    </div>
);
