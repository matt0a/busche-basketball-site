import { SectionNav } from "../components/SectionNav";
import { DocumentLink } from "../components/DocumentLink";
import { CollegeMarquee } from "../components/CollegeMarquee";
import {
    BookOpen,
    Buildings,
    Check,
    CheckCircle,
    FileText,
    GraduationCap,
    Star,
    Trophy,
    UsersThree,
} from "@phosphor-icons/react";

const SECTION_NAV = [
    { id: "overview", label: "Overview" },
    { id: "curriculum", label: "Curriculum" },
    { id: "ncaa-eligibility", label: "NCAA Eligibility" },
    { id: "outcomes", label: "College Outcomes" },
];


// ── Section divider ───────────────────────────────────────────────────────────

const AccentDivider = () => (
    <div className="h-px bg-gradient-to-r from-primary/40 via-aqua/30 to-transparent my-0" />
);

// ── Data ──────────────────────────────────────────────────────────────────────

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
        icon: <GraduationCap size={24} weight="duotone" />,
        accent: "primary",
    },
    {
        title: "9:1 Student–Teacher Ratio",
        body: "Small class sizes mean every student receives personal attention and mentorship from faculty who know them individually — not just as a name on a roster.",
        icon: <UsersThree size={24} weight="duotone" />,
        accent: "aqua",
    },
    {
        title: "Grades 6–12 + PG",
        body: "We serve students from middle school through high school and postgraduate year. PG students have additional pathways to earn college credits through CLEP exams, with free preparation available through Modern States.",
        icon: <BookOpen size={24} weight="duotone" />,
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
        body: "Student-athletes meet eligibility requirements for collegiate athletics at D1, D2, and D3 programs.",
        icon: <Trophy size={20} weight="duotone" />,
    },
    {
        heading: "NH Dept. of Education",
        body: "Approved by the New Hampshire Department of Education.",
        icon: <Buildings size={20} weight="duotone" />,
    },
    {
        heading: "CMCC Partnership",
        body: "Concurrent enrollment through Central Maine Community College (CMCC).",
        icon: <Star size={20} weight="duotone" />,
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
            <div className="relative max-w-6xl mx-auto px-6 sm:px-8 py-24 md:py-32">
                <div className="max-w-3xl">
                    <p className="text-primary font-semibold text-sm uppercase tracking-[0.2em] mb-4">
                        ACADEMICS
                    </p>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                        A Rigorous, Future-Ready Curriculum
                    </h1>
                    <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl">
                        College-prep coursework, CMCC college credits, and a 9:1 student-teacher ratio — built to get students ready for the next level on and off the court.
                    </p>
                </div>
            </div>

            {/* Hero stat strip */}
            <div className="relative border-t border-white/10 bg-white/5 backdrop-blur-sm">
                <div className="max-w-6xl mx-auto px-6 sm:px-8 py-6">
                    <div className="grid grid-cols-3 divide-x divide-white/10">
                        {[
                            { stat: "9:1", label: "Student–Teacher Ratio" },
                            { stat: "60+", label: "College Credits Available" },
                            { stat: "6–12 + PG", label: "Grade Range" },
                        ].map(({ stat, label }) => (
                            <div key={label} className="flex flex-col items-center px-4 py-2 text-center">
                                <span className="text-3xl md:text-4xl font-bold text-white">{stat}</span>
                                <span className="text-xs text-slate-400 mt-1.5 leading-tight">{label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>

        <SectionNav sections={SECTION_NAV} />

        {/* ── Overview ── */}
        <section id="overview" className="py-20 md:py-28 bg-white" style={{ scrollMarginTop: "80px" }}>
            <div className="max-w-6xl mx-auto px-6 sm:px-8">
                <p className="text-primary font-semibold text-sm uppercase tracking-[0.2em] mb-2">
                    ACADEMICS AT BUSCHE ACADEMY
                </p>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-1">
                    College Prep from Day One
                </h2>
                <div className="w-12 h-1 rounded-full bg-gradient-to-r from-primary to-aqua mb-12" />

                <div className="grid lg:grid-cols-2 gap-14 items-start">
                    {/* Left: prose + accreditation */}
                    <div className="space-y-6">
                        <p className="text-slate-600 leading-relaxed text-lg">
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
                        <p className="text-slate-600 leading-relaxed">
                            Every student has access to academic support, college counseling, and individualized guidance — ensuring no one falls behind and every student is prepared for life after Busche Academy.
                        </p>

                        {/* Accreditation box */}
                        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-7">
                            <p className="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-6">
                                ACCREDITATION & RECOGNITION
                            </p>
                            <div className="flex flex-wrap items-center gap-8 mb-7 pb-6 border-b border-primary/10">
                                <img src="/nh-doe-logo.jpg" alt="NH Department of Education" className="h-8 object-contain" />
                                <img src="/ncaa-approved-badge.jpg" alt="NCAA Approved" className="h-14 w-14 object-contain" />
                                <img src="/ncaa-approved-courses.jpg" alt="NCAA Approved Courses" className="h-8 object-contain" />
                            </div>
                            <div className="grid gap-5">
                                {ACCREDITATION_ITEMS.map((item) => (
                                    <div key={item.heading} className="flex gap-4 items-start group">
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

                    {/* Right: highlight cards + campus photos */}
                    <div className="space-y-5">
                        {/* Campus photos */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="rounded-2xl overflow-hidden aspect-video">
                                <img
                                    src="/hero-3.avif"
                                    alt="Busche Academy campus"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="rounded-2xl overflow-hidden aspect-video">
                                <img
                                    src="/academics-classroom.jpg"
                                    alt="Busche Academy classroom"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>

                        {HIGHLIGHT_CARDS.map((card) => (
                            <div
                                key={card.title}
                                className={`bg-white rounded-2xl border border-slate-200 shadow-card p-7 flex gap-5 items-start
                                    hover:-translate-y-1 hover:shadow-card-hover hover:border-primary/30
                                    transition-all duration-300
                                    ${card.accent === "aqua" ? "border-l-4 border-l-aqua" : "border-l-4 border-l-primary"}`}
                            >
                                <div className={`flex-shrink-0 rounded-xl p-3 ${card.accent === "aqua" ? "bg-aqua/10 text-emerald-600" : "bg-primary/10 text-primary"}`}>
                                    {card.icon}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">{card.title}</h3>
                                    <p className="text-slate-600 leading-relaxed">{card.body}</p>
                                </div>
                            </div>
                        ))}
                    </div>
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
                                <FileText size={20} weight="duotone" />
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
        <section id="ncaa-eligibility" className="py-20 md:py-28 bg-white" style={{ scrollMarginTop: "80px" }}>
            <div className="max-w-6xl mx-auto px-6 sm:px-8">
                <p className="text-primary font-semibold text-sm uppercase tracking-[0.2em] mb-2">
                    NCAA ELIGIBILITY
                </p>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-1">
                    Officially NCAA Listed
                </h2>
                <div className="w-12 h-1 rounded-full bg-gradient-to-r from-primary to-aqua mb-12" />

                <div className="grid lg:grid-cols-2 gap-14 items-start">
                    {/* Left: explanation + bullet points */}
                    <div className="space-y-6">
                        <p className="text-slate-600 leading-relaxed text-lg">
                            Busche Academy is officially registered in the NCAA Eligibility Center. Student-athletes
                            who complete our NCAA-approved core courses meet the academic requirements for
                            collegiate athletic eligibility at D1, D2, and D3 programs.
                        </p>
                        <p className="text-slate-600 leading-relaxed">
                            Every course on our transcript has been reviewed and approved by the NCAA. Families can trust that a Busche Academy diploma opens doors at the college level — both academically and athletically.
                        </p>

                        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-7 space-y-4">
                            <p className="text-xs font-semibold text-primary uppercase tracking-[0.2em]">Key Facts</p>
                            {[
                                "Officially listed in the NCAA Eligibility Center (HS Code 853269)",
                                "All core courses reviewed and approved by the NCAA",
                                "Graduates meet academic requirements for D1, D2, and D3 eligibility",
                                "CEEB/ACT Code 301517 — accepted by all major college testing services",
                                "Located in Chester, New Hampshire",
                            ].map((point) => (
                                <div key={point} className="flex items-start gap-3">
                                    <Check size={16} weight="bold" className="flex-shrink-0 mt-0.5 text-primary" />
                                    <p className="text-slate-700 text-sm leading-relaxed">{point}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: screenshot */}
                    <div className="space-y-4">
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
                            <img
                                src="/ncaa-eligibility.jpg"
                                alt="NCAA Eligibility Center — Busche Academy listed with approved core courses"
                                className="w-full object-contain"
                            />
                        </div>
                        <p className="text-sm text-slate-500 text-center">
                            NCAA Eligibility Center — official listing for Busche Academy
                        </p>
                    </div>
                </div>
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
                        <CheckCircle size={20} weight="duotone" />
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
