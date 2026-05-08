import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { SectionNav } from "../components/SectionNav";
import { TestimonialsMarquee } from "../components/TestimonialsMarquee";
import { MissionSection } from "../components/MissionSection";
import { publicApi } from "../api/publicApi";
import type { StaffMemberDto } from "../types";


const SECTION_NAV = [
    { id: "overview", label: "Overview" },
    { id: "mission", label: "Mission & Values" },
    { id: "program", label: "Our Program" },
    { id: "faculty", label: "Faculty & Staff" },
    { id: "contact", label: "Contact" },
];

function sortMembers(list: StaffMemberDto[]): StaffMemberDto[] {
    return [...list].sort((a, b) => {
        const oa = a.displayOrder ?? 0, ob = b.displayOrder ?? 0;
        return oa !== ob ? oa - ob : a.fullName.localeCompare(b.fullName);
    });
}

const StaffCard = ({ member, onSelect }: { member: StaffMemberDto; onSelect: (m: StaffMemberDto) => void }) => (
    <button
        type="button"
        onClick={() => onSelect(member)}
        className="group text-left bg-white rounded-xl border border-slate-200 shadow-card hover:border-primary/30 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 overflow-hidden w-full"
    >
        <div className="h-48 bg-slate-100 overflow-hidden">
            {member.primaryPhotoUrl ? (
                <img
                    src={member.primaryPhotoUrl}
                    alt={member.fullName}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <img
                        src="/images/default-avatar.svg"
                        alt={member.fullName}
                        className="w-16 h-16 opacity-40"
                        onError={(e) => {
                            (e.currentTarget as HTMLImageElement).style.display = "none";
                        }}
                    />
                </div>
            )}
        </div>
        <div className="p-4">
            <p className="font-bold text-slate-900 group-hover:text-primary transition-colors">{member.fullName}</p>
            <p className="text-primary text-sm font-semibold uppercase tracking-wide mt-0.5">
                {member.position}
            </p>
            <p className="mt-2 text-xs text-slate-400 group-hover:text-primary transition-colors flex items-center gap-1">
                View profile
                <svg className="w-3 h-3 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </p>
        </div>
    </button>
);

// Accent divider used between major page sections
const AccentDivider = () => (
    <div className="max-w-6xl mx-auto px-4">
        <div className="h-px bg-gradient-to-r from-primary/40 via-aqua/30 to-transparent" />
    </div>
);

export const AboutPage = () => {
    const heroRef = useRef<HTMLDivElement | null>(null);
    const [staff, setStaff] = useState<StaffMemberDto[]>([]);
    const [staffLoading, setStaffLoading] = useState(true);
    const [staffError, setStaffError] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState<StaffMemberDto | null>(null);

    useEffect(() => {
        if (heroRef.current) {
            gsap.fromTo(
                heroRef.current,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
            );
        }
    }, []);

    useEffect(() => {
        let cancelled = false;
        setStaffLoading(true);
        setStaffError(false);

        publicApi
            .getStaff()
            .then((data) => {
                if (!cancelled) {
                    setStaff(data.filter((s) => s.active));
                }
            })
            .catch(() => {
                if (!cancelled) setStaffError(true);
            })
            .finally(() => {
                if (!cancelled) setStaffLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, []);

    const adminStaff = sortMembers(staff.filter((s) => s.adminStaff === true));
    const departmentStaff = sortMembers(staff.filter((s) => s.adminStaff !== true));

    return (
        <>
        <div className="min-h-screen bg-white">
            {/* Hero */}
            <section className="relative bg-slate-900 text-white overflow-hidden">
                {/* #1 — gradient opacity bumped to 15 */}
                <div className="absolute inset-0 opacity-15">
                    <div
                        className="absolute inset-0"
                        style={{
                            backgroundImage:
                                "radial-gradient(circle at 25% 25%, #009FFD 0%, transparent 50%), radial-gradient(circle at 75% 75%, #2AFC98 0%, transparent 50%)",
                        }}
                    />
                </div>
                {/* #2 — hero content with pb-20 to clear stat strip */}
                <div ref={heroRef} className="relative max-w-6xl mx-auto px-4 py-20 md:py-28 pb-20">
                    <div className="max-w-3xl">
                        <p className="text-primary font-semibold text-sm uppercase tracking-[0.2em] mb-4">
                            ABOUT BUSCHE ACADEMY
                        </p>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                            Where Every Student Becomes a Leader
                        </h1>
                        <p className="text-lg md:text-xl text-slate-300 leading-relaxed mb-8 max-w-2xl">
                            A private coeducational boarding and day school in Chester, New Hampshire, empowering
                            students from around the world.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link to="/admissions" className="btn-primary px-6 py-3">
                                Learn About Admissions
                            </Link>
                            <Link
                                to="/student-life"
                                className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-lg border border-slate-500 text-white hover:bg-white/10 hover:border-white transition-all duration-200"
                            >
                                Explore Campus Life
                            </Link>
                        </div>
                    </div>
                </div>
                {/* #2 — frosted-glass stat strip (hidden on mobile to avoid overlap) */}
                <div className="hidden sm:block absolute bottom-0 left-0 right-0 backdrop-blur-sm bg-white/5 border-t border-white/10">
                    <div className="max-w-6xl mx-auto px-4 py-4 grid grid-cols-3 divide-x divide-white/10">
                        {[
                            { value: "70 Acres", label: "Campus" },
                            { value: "Grades 6–12 + PG", label: "Enrollment" },
                            { value: "Chester, NH", label: "Location" },
                        ].map((s) => (
                            <div key={s.label} className="px-4 first:pl-0 text-center">
                                <p className="text-lg font-bold text-white">{s.value}</p>
                                <p className="text-xs text-slate-400 uppercase tracking-wide">{s.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SectionNav */}
            <SectionNav sections={SECTION_NAV} />

            {/* Section: Overview */}
            <section
                id="overview"
                className="py-16 md:py-20 bg-white"
                style={{ scrollMarginTop: "80px" }}
            >
                <div className="max-w-6xl mx-auto px-4">
                    {/* #3 — eyebrow accent bar */}
                    <p className="text-primary font-semibold text-sm uppercase tracking-[0.2em] mb-2">
                        OUR SCHOOL
                    </p>
                    <div className="w-12 h-1 rounded-full bg-gradient-to-r from-primary to-aqua mb-3 mt-1" />
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-10">
                        A Diverse Community Built for Excellence
                    </h2>

                    <div className="grid lg:grid-cols-2 gap-12 items-start">
                        {/* Left */}
                        <div className="space-y-5">
                            <p className="text-slate-600 leading-relaxed">
                                Busche Academy (BA) is a private coeducational boarding and day school in Chester,
                                New Hampshire, offering a college preparatory, multicultural education to students
                                in grades 6–12 and postgraduates.
                            </p>
                            <p className="text-slate-600 leading-relaxed">
                                Located in southeastern New Hampshire, Chester is a quaint, New England town with
                                rural character and warm hospitality. Our campus spans 70 acres originally home to
                                Chester College — a true collegiate environment for our students.
                            </p>
                            <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-xl">
                                <p className="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-2">
                                    OUR MISSION
                                </p>
                                <p className="text-slate-800 font-medium leading-relaxed">
                                    To empower students to become lifelong learners and leaders of the world.
                                </p>
                            </div>
                        </div>

                        {/* Right: value cards — #8 upgraded */}
                        <div className="space-y-4">
                            {[
                                {
                                    title: "Diversity",
                                    body: "The school deeply values the diverse makeup of its school community and encourages students from every possible cultural background.",
                                    borderColor: "border-l-primary",
                                    icon: (
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    ),
                                },
                                {
                                    title: "Excellence",
                                    body: "A high level of rigor and expectation of excellence in all components of the school's operation — academic, athletic, and boarding program.",
                                    borderColor: "border-l-aqua",
                                    icon: (
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    ),
                                },
                                {
                                    title: "Community & Family",
                                    body: "The sense of community and family, not only within the school itself, but also in the greater Chester community, is a critical value.",
                                    borderColor: "border-l-primary",
                                    icon: (
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                        </svg>
                                    ),
                                },
                            ].map((card) => (
                                <div
                                    key={card.title}
                                    className={`bg-white rounded-2xl border border-slate-200 border-l-4 ${card.borderColor} shadow-card p-6 hover:border-primary/30 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300`}
                                >
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                                        {card.icon}
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-2">{card.title}</h3>
                                    <p className="text-slate-600 text-sm leading-relaxed">{card.body}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* #5 — accent divider */}
            <AccentDivider />

            {/* Section: Mission, Vision & Values */}
            <div id="mission" style={{ scrollMarginTop: "80px" }}>
                <MissionSection />
            </div>

            {/* #5 — accent divider */}
            <AccentDivider />

            {/* Section: Our Program */}
            <section
                id="program"
                className="py-16 md:py-20 bg-slate-50"
                style={{ scrollMarginTop: "80px" }}
            >
                <div className="max-w-6xl mx-auto px-4">
                    {/* #3 — eyebrow accent bar */}
                    <p className="text-primary font-semibold text-sm uppercase tracking-[0.2em] mb-2">
                        ACADEMICS &amp; ATHLETICS
                    </p>
                    <div className="w-12 h-1 rounded-full bg-gradient-to-r from-primary to-aqua mb-3 mt-1" />
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-10">
                        What Sets Busche Academy Apart
                    </h2>

                    {/* CMCC Partnership highlight */}
                    <div className="bg-slate-900 text-white rounded-2xl p-8 md:p-10 mb-10">
                        <div className="grid md:grid-cols-2 gap-8 items-center">
                            <div>
                                <p className="text-primary font-semibold text-xs uppercase tracking-[0.2em] mb-3">
                                    EXCLUSIVE PARTNERSHIP
                                </p>
                                <h3 className="text-2xl md:text-3xl font-bold mb-4 leading-tight">
                                    Graduate with Your Associate's Degree
                                </h3>
                                <p className="text-slate-300 leading-relaxed mb-6">
                                    Through our exclusive partnership with Community College of the North (CMCC),
                                    Busche Academy students can simultaneously earn their high school diploma
                                    and an Associate's Degree — graduating with 60+ college credits before
                                    ever setting foot on a university campus.
                                </p>
                                <Link
                                    to="/academics"
                                    className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors text-sm"
                                >
                                    Learn more about Academics
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            </div>
                            {/* #9 — CMCC bullet points upgraded to icon wells */}
                            <div className="space-y-4">
                                {[
                                    {
                                        title: "2-in-1 Degree",
                                        body: "Students earn a High School Diploma and an Associate's Degree simultaneously.",
                                        icon: (
                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                            </svg>
                                        ),
                                    },
                                    {
                                        title: "60+ College Credits",
                                        body: "Earn transferable credits that count toward a Bachelor's Degree at most universities.",
                                        icon: (
                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                            </svg>
                                        ),
                                    },
                                    {
                                        title: "Save on Tuition",
                                        body: "Arrive at university as a sophomore — significantly reducing the time and cost of your degree.",
                                        icon: (
                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        ),
                                    },
                                    {
                                        title: "Stand Out in Admissions",
                                        body: "College admissions officers recognize the achievement of dual-degree graduates.",
                                        icon: (
                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                            </svg>
                                        ),
                                    },
                                ].map((item) => (
                                    <div key={item.title} className="flex items-start gap-3">
                                        <div className="w-6 h-6 rounded-lg bg-primary/20 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-white text-sm">{item.title}</p>
                                            <p className="text-slate-400 text-sm leading-relaxed">{item.body}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Program highlight cards */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
                        {[
                            {
                                icon: (
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                ),
                                title: "Training Philosophy",
                                body: "Our coaches focus on individual development, film study, and competitive game preparation to maximize each athlete's potential.",
                            },
                            {
                                icon: (
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                ),
                                title: "Academic Excellence",
                                body: "Small class sizes, dedicated faculty, and the CMCC partnership ensure every student thrives academically.",
                            },
                            {
                                icon: (
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                    </svg>
                                ),
                                title: "Recruiting Pipeline",
                                body: "Exposure games, film, and direct coach relationships connect our athletes with college programs across all divisions.",
                            },
                            {
                                icon: (
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                ),
                                title: "Global Community",
                                body: "Students from the US and around the world build lifelong friendships and a truly international network.",
                            },
                        ].map((card) => (
                            <div
                                key={card.title}
                                className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 hover:border-primary/30 hover:shadow-card-hover transition-all duration-300"
                            >
                                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                                    {card.icon}
                                </div>
                                <h3 className="font-bold text-slate-900 mb-2">{card.title}</h3>
                                <p className="text-slate-600 text-sm leading-relaxed">{card.body}</p>
                            </div>
                        ))}
                    </div>

                    {/* #10 — 8 Reasons with group hover on number badge */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-8">
                        <h3 className="text-xl font-bold text-slate-900 mb-6">8 Reasons to Choose Busche Academy</h3>
                        <div className="grid sm:grid-cols-2 gap-4">
                            {[
                                "NCAA-certified program with proven college placement",
                                "Exclusive CMCC partnership — earn an Associate's Degree while in high school",
                                "Small 9:1 student-to-faculty ratio for personalized attention",
                                "70-acre campus just 40 miles from Boston",
                                "Coeducational boarding and day enrollment for grades 6–12 + postgrad",
                                "Financial aid available to qualified students",
                                "Diverse community with students from the US and around the world",
                                "Dedicated coaching staff focused on college recruiting and player development",
                            ].map((item, idx) => (
                                <div key={idx} className="group flex items-start gap-3">
                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center mt-0.5 group-hover:bg-primary group-hover:text-white transition-colors duration-200">
                                        {idx + 1}
                                    </span>
                                    <p className="text-slate-700 text-sm leading-relaxed">{item}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* #5 — accent divider */}
            <AccentDivider />

            {/* Testimonials */}
            <section className="py-12 bg-white border-t border-slate-100">
                <div className="max-w-6xl mx-auto px-4 mb-8">
                    {/* #3 — eyebrow accent bar */}
                    <p className="text-primary font-semibold text-sm uppercase tracking-[0.2em]">
                        VOICES FROM OUR COMMUNITY
                    </p>
                    <div className="w-12 h-1 rounded-full bg-gradient-to-r from-primary to-aqua mt-1" />
                </div>
                <TestimonialsMarquee />
            </section>

            {/* #5 — accent divider */}
            <AccentDivider />

            {/* Section: Faculty & Staff */}
            <section
                id="faculty"
                className="py-16 md:py-20 bg-slate-50"
                style={{ scrollMarginTop: "80px" }}
            >
                <div className="max-w-6xl mx-auto px-4">
                    {/* #3 — eyebrow accent bar */}
                    <p className="text-primary font-semibold text-sm uppercase tracking-[0.2em] mb-2">
                        OUR PEOPLE
                    </p>
                    <div className="w-12 h-1 rounded-full bg-gradient-to-r from-primary to-aqua mb-3 mt-1" />
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                        Meet the Team
                    </h2>
                    <p className="text-slate-600 mb-10">
                        The dedicated faculty and staff who make Busche Academy exceptional.
                    </p>

                    {staffLoading && (
                        <div className="flex items-center gap-3 text-slate-500 py-12">
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    fill="none"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                            </svg>
                            <span>Loading faculty...</span>
                        </div>
                    )}

                    {staffError && !staffLoading && (
                        <p className="text-slate-500 italic py-12">Faculty information coming soon.</p>
                    )}

                    {!staffLoading && !staffError && (
                        <>
                            {adminStaff.length === 0 && departmentStaff.length === 0 && (
                                <p className="text-slate-500 italic py-12">Faculty information coming soon.</p>
                            )}

                            {adminStaff.length > 0 && (
                                <div className="flex flex-wrap justify-center gap-5">
                                    {adminStaff.map((member) => (
                                        <div key={member.id} className="w-full sm:w-56 lg:w-60 xl:w-64">
                                            <StaffCard member={member} onSelect={setSelectedStaff} />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {adminStaff.length > 0 && departmentStaff.length > 0 && (
                                <div className="mt-10" />
                            )}

                            {departmentStaff.length > 0 && (
                                <div className="flex flex-wrap justify-center gap-5">
                                    {departmentStaff.map((member) => (
                                        <div key={member.id} className="w-full sm:w-56 lg:w-60 xl:w-64">
                                            <StaffCard member={member} onSelect={setSelectedStaff} />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>

            {/* #5 — accent divider */}
            <AccentDivider />

            {/* Section: Contact */}
            <section
                id="contact"
                className="py-16 md:py-20 bg-white"
                style={{ scrollMarginTop: "80px" }}
            >
                <div className="max-w-6xl mx-auto px-4">
                    {/* #3 — eyebrow accent bar */}
                    <p className="text-primary font-semibold text-sm uppercase tracking-[0.2em] mb-2">
                        GET IN TOUCH
                    </p>
                    <div className="w-12 h-1 rounded-full bg-gradient-to-r from-primary to-aqua mb-3 mt-1" />
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-10">
                        Contact Busche Academy
                    </h2>

                    <div className="grid md:grid-cols-2 gap-8 items-start">
                        {/* Left: contact info */}
                        <div className="bg-slate-900 text-white rounded-2xl p-8 space-y-5">
                            <div className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <div>
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Address</p>
                                    <p className="text-slate-100">40 Chester Street</p>
                                    <p className="text-slate-100">Chester, New Hampshire 03036</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <div>
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Phone</p>
                                    <p className="text-slate-100">(603) 887-5200</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <div>
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Email</p>
                                    <a
                                        href="mailto:info@buscheacademy.org"
                                        className="text-primary hover:underline"
                                    >
                                        info@buscheacademy.org
                                    </a>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div>
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Office Hours</p>
                                    <p className="text-slate-100">Monday–Friday, 8:00am–4:30pm</p>
                                </div>
                            </div>
                        </div>

                        {/* Right: contact info + apply card */}
                        <div className="space-y-4">
                            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
                                <p className="text-slate-700 text-sm leading-relaxed">
                                    To schedule a visit, email us at{" "}
                                    <a href="mailto:info@buscheacademy.org" className="text-primary hover:underline font-medium">
                                        info@buscheacademy.org
                                    </a>
                                </p>
                                <p className="text-slate-700 text-sm leading-relaxed">
                                    For general information about our programs, email us at{" "}
                                    <a href="mailto:info@buscheacademy.org" className="text-primary hover:underline font-medium">
                                        info@buscheacademy.org
                                    </a>
                                </p>
                            </div>
                            <a
                                href="https://bit.ly/gobuscheacademy"
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-4 w-full bg-primary text-white rounded-2xl p-6 hover:bg-primary/90 transition-all duration-200 group"
                            >
                                <div className="w-10 h-10 rounded-xl bg-white/20 text-white flex items-center justify-center flex-shrink-0">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold">Apply Now</p>
                                    <p className="text-sm text-blue-100 mt-0.5">Start your application today</p>
                                </div>
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA strip */}
            <section className="py-16 md:py-20 bg-slate-900 text-white">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Join the Busche Academy Community
                    </h2>
                    <p className="text-lg text-slate-300 mb-8 max-w-xl mx-auto">
                        Take the first step toward an exceptional education in Chester, New Hampshire.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <a
                            href="https://bit.ly/gobuscheacademy"
                            target="_blank"
                            rel="noreferrer"
                            className="btn-primary px-8 py-3 text-base"
                        >
                            Apply Now
                        </a>
                    </div>
                    <p className="text-slate-400 text-sm mt-6">
                        For admissions inquiries, email us at{" "}
                        <a href="mailto:info@buscheacademy.org" className="text-primary hover:underline">
                            info@buscheacademy.org
                        </a>
                    </p>
                </div>
            </section>
        </div>

        {/* Staff detail modal */}
        {selectedStaff && (
            <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 py-6"
                onClick={() => setSelectedStaff(null)}
            >
                <div
                    className="relative max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-elevated"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="relative h-36 bg-slate-900">
                        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 50% 50%, #009FFD 0%, transparent 70%)" }} />
                        <button
                            type="button"
                            onClick={() => setSelectedStaff(null)}
                            className="absolute right-4 top-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-10"
                        >
                            <span className="sr-only">Close</span>
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <div className="absolute -bottom-12 left-8">
                            <div className="w-24 h-24 rounded-xl overflow-hidden bg-slate-200 border-4 border-white shadow-lg">
                                {selectedStaff.primaryPhotoUrl ? (
                                    <img src={selectedStaff.primaryPhotoUrl} alt={selectedStaff.fullName} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                                        <svg viewBox="0 0 24 24" className="w-10 h-10" aria-hidden="true">
                                            <circle cx="12" cy="8" r="3.5" className="fill-none stroke-current" strokeWidth="1.5" />
                                            <path d="M6 18.5c1.6-2.2 3.5-3.3 6-3.3s4.4 1.1 6 3.3" className="fill-none stroke-current" strokeWidth="1.5" strokeLinecap="round" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="pt-16 pb-8 px-8">
                        <h2 className="text-2xl font-bold text-slate-900">{selectedStaff.fullName}</h2>
                        <p className="text-primary font-semibold uppercase tracking-wide text-sm mt-1">{selectedStaff.position}</p>

                        {(selectedStaff.bio) && (
                            <div className="mt-5">
                                <p className="text-slate-600 leading-relaxed">{selectedStaff.bio}</p>
                            </div>
                        )}
                        {!selectedStaff.bio && (
                            <p className="mt-5 text-slate-400 italic text-sm">Bio coming soon.</p>
                        )}

                        {(selectedStaff.email || selectedStaff.phone) && (
                            <div className="mt-6 pt-6 border-t border-slate-200">
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Contact Information</p>
                                <div className="space-y-2">
                                    {selectedStaff.email && (
                                        <a href={`mailto:${selectedStaff.email}`} className="flex items-center gap-2 text-sm text-slate-700 hover:text-primary transition-colors">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                            {selectedStaff.email}
                                        </a>
                                    )}
                                    {selectedStaff.phone && (
                                        <p className="flex items-center gap-2 text-sm text-slate-700">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                            {selectedStaff.phone}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )}
        </>
    );
};
