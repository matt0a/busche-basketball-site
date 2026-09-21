import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { publicApi } from "../api/publicApi";
import type { GameDto } from "../types";
import { gsap } from "gsap";
import { CollegeMarquee } from "../components/CollegeMarquee";
import { AtAGlanceGrid } from "../components/AtAGlanceGrid";
import { MissionSection } from "../components/MissionSection";
import {
    Basketball,
    CalendarBlank,
    CaretLeft,
    CaretRight,
    Clock,
    FileText,
    GraduationCap,
    House,
    MapPin,
} from "@phosphor-icons/react";

const slides = [
    {
        image: "/hero-1.jpg",
        label: "Chester, NH",
        headline: "Experience Education From Around the World",
        sub: "A private boarding school 40 miles from Boston.",
    },
    {
        image: "/hero-2.jpg",
        label: "Basketball Program",
        headline: "Elite Training, Academic Excellence",
        sub: "Student-athletes competing at the highest level while thriving in the classroom.",
    },
    {
        image: "/hero-3.avif",
        label: "Student Life",
        headline: "A Campus Built for Growth",
        sub: "70 acres in rural New Hampshire — where students live, learn, and become leaders.",
    },
    {
        image: "/hero-4.jpg",
        label: "Community",
        headline: "Bonds That Go Beyond the Court",
        sub: "At Busche Academy, teammates become family — celebrating every milestone together.",
    },
];


const sections = [
    {
        title: "Academics",
        description:
            "College-prep curriculum, CMCC partnership, AP courses, and 60+ college credits available.",
        href: "/academics",
        Icon: GraduationCap,
        color: "bg-primary/10 text-primary",
    },
    {
        title: "Student Life",
        description:
            "Adams Hall & Preston Hall dorms, chef-prepared dining, and a 70-acre campus to explore.",
        href: "/student-life",
        Icon: House,
        color: "bg-aqua/10 text-emerald-700",
    },
    {
        title: "Basketball Program",
        description:
            "National and Regional teams with elite coaching, competitive schedules, and college exposure.",
        href: "/basketball",
        Icon: Basketball,
        color: "bg-primary/10 text-primary",
    },
    {
        title: "Admissions",
        description:
            "Open to US and international students. Financial aid available. Day and boarding options.",
        href: "/admissions",
        Icon: FileText,
        color: "bg-slate-100 text-slate-700",
    },
];

export const HomePage = () => {
    const heroRef = useRef<HTMLDivElement | null>(null);
    const programRef = useRef<HTMLDivElement | null>(null);

    const [activeSlide, setActiveSlide] = useState(0);
    const [recent, setRecent] = useState<GameDto[]>([]);
    const [upcoming, setUpcoming] = useState<GameDto[]>([]);
    const [loading, setLoading] = useState(true);

    // Entrance animations on first load
    useEffect(() => {
        if (heroRef.current) {
            gsap.fromTo(
                heroRef.current,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.9, ease: "power2.out" }
            );
        }
        if (programRef.current) {
            gsap.fromTo(
                programRef.current.children,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, delay: 0.4, ease: "power2.out" }
            );
        }
    }, []);

    // Auto-rotate hero slides
    useEffect(() => {
        const id = setInterval(() => {
            setActiveSlide((prev) => (prev + 1) % slides.length);
        }, 7000);
        return () => clearInterval(id);
    }, []);

    // Load recent/upcoming games
    useEffect(() => {
        const load = async () => {
            try {
                const [recentGames, upcomingGames] = await Promise.all([
                    publicApi.getRecentGames(3),
                    publicApi.getUpcomingGames(3),
                ]);
                setRecent(recentGames);
                setUpcoming(upcomingGames);
            } catch (e) {
                console.error("Failed to load games", e);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const formatDateTime = (iso: string) =>
        new Date(iso).toLocaleString(undefined, {
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
        });

    const lastGame = recent[0];
    const nextGame = upcoming[0];

    const goToPrev = () =>
        setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
    const goToNext = () =>
        setActiveSlide((prev) => (prev + 1) % slides.length);

    return (
        <div className="min-h-screen bg-white">
            {/* SECTION 1 — HERO SLIDESHOW (full-bleed) */}
            <section className="relative h-[540px] md:h-[680px] bg-slate-900 text-white overflow-hidden">
                {/* Slides */}
                {slides.map((slide, idx) => (
                    <div
                        key={idx}
                        className={`absolute inset-0 transition-opacity duration-1000 ${
                            idx === activeSlide ? "opacity-100" : "opacity-0 pointer-events-none"
                        }`}
                    >
                        <img
                            src={slide.image}
                            alt={slide.headline}
                            className="w-full h-full object-cover"
                        />
                        {/* Multi-stop gradient — darker at left/bottom for legibility */}
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-900/50 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                    </div>
                ))}

                {/* Accent line left edge */}
                <div className="absolute left-0 inset-y-0 w-1 bg-gradient-to-b from-transparent via-primary to-transparent" />

                {/* Hero content */}
                <div ref={heroRef} className="relative h-full max-w-7xl mx-auto px-6 sm:px-8 flex flex-col justify-end pb-16 md:pb-20">
                    <div className="max-w-2xl space-y-4">
                        <p className="text-primary font-semibold text-xs md:text-sm uppercase tracking-[0.25em]">
                            Busche Academy · {slides[activeSlide].label}
                        </p>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight">
                            {slides[activeSlide].headline}
                        </h1>
                        <p className="text-base md:text-lg text-slate-200/90 leading-relaxed max-w-lg">
                            {slides[activeSlide].sub}
                        </p>
                        <div className="flex flex-wrap gap-3 pt-2">
                            <a
                                href="https://bit.ly/gobuscheacademy"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg bg-white text-slate-900 font-semibold text-sm hover:bg-slate-100 transition-all duration-200 shadow-lg"
                            >
                                Apply Now
                            </a>
                        </div>
                        <p className="text-slate-300/80 text-sm pt-1">
                            For admissions inquiries, email us at{" "}
                            <a href="mailto:info@buscheacademy.org" className="text-primary hover:underline">
                                info@buscheacademy.org
                            </a>
                        </p>
                    </div>
                </div>

                {/* Nav arrows */}
                <button
                    type="button"
                    onClick={goToPrev}
                    className="absolute right-16 md:right-20 bottom-6 h-9 w-9 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-all duration-200 backdrop-blur-sm"
                    aria-label="Previous slide"
                >
                    <CaretLeft size={16} weight="bold" aria-hidden="true" />
                </button>
                <button
                    type="button"
                    onClick={goToNext}
                    className="absolute right-4 md:right-8 bottom-6 h-9 w-9 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-all duration-200 backdrop-blur-sm"
                    aria-label="Next slide"
                >
                    <CaretRight size={16} weight="bold" aria-hidden="true" />
                </button>

                {/* Slide dots */}
                <div className="absolute bottom-7 left-1/2 -translate-x-1/2 flex gap-2">
                    {slides.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setActiveSlide(idx)}
                            aria-label={`Slide ${idx + 1}`}
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                                idx === activeSlide
                                    ? "bg-primary w-8"
                                    : "bg-white/30 w-2 hover:bg-white/50"
                            }`}
                        />
                    ))}
                </div>
            </section>

            {/* CREDENTIALS TRUST STRIP */}
            <div className="bg-slate-50 border-b border-slate-100 py-5">
                <div className="max-w-7xl mx-auto px-6 sm:px-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-12">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-[0.2em] shrink-0">
                        Recognized &amp; Accredited By
                    </p>
                    <div className="flex items-center gap-8 flex-wrap justify-center">
                        <img src="/nh-doe-logo.jpg" alt="NH Department of Education" className="h-7 object-contain" />
                        <img src="/ncaa-approved-badge.jpg" alt="NCAA Approved" className="h-12 w-12 object-contain" />
                        <img src="/ncaa-approved-courses.jpg" alt="NCAA Approved Courses" className="h-8 object-contain" />
                    </div>
                </div>
            </div>

            {/* SECTION 2 — AT A GLANCE */}
            <AtAGlanceGrid />

            {/* Upgrade #9a — gradient accent divider between AtAGlanceGrid and Explore */}
            <div className="h-px bg-gradient-to-r from-primary/40 via-aqua/30 to-transparent" />

            {/* SECTION 3 — EXPLORE BUSCHE ACADEMY */}
            <section className="bg-white py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-6 sm:px-8">
                    <div className="text-center mb-14">
                        <p className="text-primary font-semibold text-xs uppercase tracking-[0.25em] mb-3">
                            Explore Busche Academy
                        </p>
                        {/* Upgrade #1 — gradient accent bar under eyebrow */}
                        <div className="w-12 h-1 rounded-full bg-gradient-to-r from-primary to-aqua mx-auto mt-2 mb-6" />
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                            Everything You Need in One Place
                        </h2>
                    </div>

                    <div
                        ref={programRef}
                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5"
                    >
                        {sections.map((section, idx) => (
                            <Link
                                key={idx}
                                to={section.href}
                                className="group relative bg-white border border-slate-100 rounded-2xl p-7 shadow-card hover:shadow-lg hover:-translate-y-1 hover:border-primary/20 transition-all duration-300 flex flex-col overflow-hidden"
                            >
                                {/* Upgrade #2 — bottom gradient accent bar (replaces old top h-0.5 line) */}
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-aqua scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-b-2xl" />
                                <div
                                    className={`w-11 h-11 rounded-xl flex items-center justify-center mb-5 ${section.color} group-hover:scale-110 transition-transform duration-300`}
                                >
                                    <section.Icon size={24} weight="duotone" aria-hidden="true" />
                                </div>
                                <p className="font-bold text-slate-900 text-base mb-2 tracking-tight">
                                    {section.title}
                                </p>
                                <p className="text-sm text-slate-500 leading-relaxed flex-1">
                                    {section.description}
                                </p>
                                <p className="mt-5 text-primary text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all duration-200">
                                    Learn More
                                    <CaretRight size={14} weight="bold" aria-hidden="true" />
                                </p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* SECTION 3b — MISSION, VISION & VALUES */}
            <MissionSection />

            {/* SECTION 4 — BASKETBALL PROGRAM SPOTLIGHT */}
            <section className="bg-slate-50 border-t border-slate-100 py-16 md:py-20">
                <div className="max-w-7xl mx-auto px-6 sm:px-8">
                    <div className="grid md:grid-cols-[2fr,3fr] gap-10 md:gap-16 items-start">
                        {/* Left column — text */}
                        <div>
                            <p className="text-primary font-semibold text-sm uppercase tracking-[0.2em] mb-2">
                                Basketball Program
                            </p>
                            {/* Upgrade #3 — gradient accent bar under Basketball Program eyebrow */}
                            <div className="w-12 h-1 rounded-full bg-gradient-to-r from-primary to-aqua mb-4" />
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                                Compete. Develop. Advance.
                            </h2>
                            <p className="text-slate-600 leading-relaxed mb-6">
                                Busche Academy fields National and Regional teams with a full
                                competitive schedule. Student-athletes train daily and receive
                                personalized college recruiting support.
                            </p>
                            <Link
                                to="/basketball"
                                className="inline-flex items-center gap-2 text-primary hover:text-sky-600 font-medium transition-colors"
                            >
                                Explore the Program
                                <CaretRight size={16} weight="bold" aria-hidden="true" />
                            </Link>
                        </div>

                        {/* Right column — game cards */}
                        <div className="grid md:grid-cols-2 gap-4">
                            {/* Upgrade #4 & #5 — Last game card with icon well + left accent border */}
                            <div className="bg-white border border-slate-200 border-l-4 border-l-slate-300 rounded-2xl p-6 hover:border-primary/30 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300">
                                <div className="flex items-center gap-2 mb-3">
                                    {/* Clock / history icon well */}
                                    <div className="w-6 h-6 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center flex-shrink-0">
                                        <Clock size={14} weight="duotone" aria-hidden="true" />
                                    </div>
                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Last Game
                                    </p>
                                </div>
                                {loading ? (
                                    <p className="text-sm text-slate-400">Loading...</p>
                                ) : lastGame ? (
                                    <>
                                        <p className="font-bold text-slate-900 mb-1">
                                            {lastGame.teamName} vs {lastGame.opponent}
                                        </p>
                                        <p className="text-sm text-slate-600 mb-3">
                                            {formatDateTime(lastGame.gameDateTime)} · {lastGame.location}
                                        </p>
                                        {lastGame.scoreUs != null && lastGame.scoreThem != null && (
                                            <div className="flex items-center gap-3">
                                                <p className="text-lg font-bold text-slate-900">
                                                    {lastGame.scoreUs} – {lastGame.scoreThem}
                                                </p>
                                                {lastGame.win === true && (
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase bg-emerald-100 text-emerald-700">
                                                        WIN
                                                    </span>
                                                )}
                                                {lastGame.win === false && (
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase bg-rose-100 text-rose-700">
                                                        LOSS
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <p className="text-sm text-slate-500">
                                        No completed games recorded yet.
                                    </p>
                                )}
                            </div>

                            {/* Upgrade #4 & #5 — Next game card with icon well + left accent border */}
                            <div className="bg-white border border-slate-200 border-l-4 border-l-primary rounded-2xl p-6 hover:border-primary/30 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300">
                                <div className="flex items-center gap-2 mb-3">
                                    {/* Calendar icon well */}
                                    <div className="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                                        <CalendarBlank size={14} weight="duotone" aria-hidden="true" />
                                    </div>
                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Next Game
                                    </p>
                                </div>
                                {loading ? (
                                    <p className="text-sm text-slate-400">Loading...</p>
                                ) : nextGame ? (
                                    <>
                                        <p className="font-bold text-slate-900 mb-1">
                                            {nextGame.teamName} vs {nextGame.opponent}
                                        </p>
                                        <p className="text-sm text-slate-600 mb-3">
                                            {formatDateTime(nextGame.gameDateTime)} · {nextGame.location} ·{" "}
                                            {nextGame.homeAway === "HOME" ? "Home" : "Away"}
                                        </p>
                                        {nextGame.conferenceGame && (
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase bg-primary/10 text-primary">
                                                Conference Game
                                            </span>
                                        )}
                                    </>
                                ) : (
                                    <p className="text-sm text-slate-500">
                                        No upcoming games scheduled yet.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Upgrade #9b — gradient accent divider between Basketball and College Outcomes */}
            <div className="h-px bg-gradient-to-r from-primary/40 via-aqua/30 to-transparent" />

            {/* SECTION 5 — COLLEGE ACCEPTANCES MARQUEE */}
            <section className="bg-white border-y border-slate-100 py-14">
                <div className="max-w-7xl mx-auto px-6 sm:px-8 mb-8 text-center">
                    <p className="text-primary font-semibold text-sm uppercase tracking-[0.2em] mb-2">
                        College Outcomes
                    </p>
                    {/* Upgrade #6 — gradient accent bar under College Outcomes eyebrow */}
                    <div className="w-12 h-1 rounded-full bg-gradient-to-r from-primary to-aqua mx-auto mt-2 mb-6" />
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
                        Our Students Go On To
                    </h2>
                    <p className="text-slate-600 max-w-xl mx-auto">
                        A selection of colleges and universities where Busche Academy graduates
                        have been accepted.
                    </p>
                </div>
                <CollegeMarquee />
            </section>

            {/* SECTION 6 — CTA STRIP */}
            {/* Upgrade #7 — radial gradient overlay on charcoal bg */}
            <section className="relative overflow-hidden bg-charcoal text-white py-16 md:py-20">
                <div
                    className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage:
                            "radial-gradient(circle at 20% 50%, #009FFD 0%, transparent 50%), radial-gradient(circle at 80% 50%, #2AFC98 0%, transparent 50%)",
                    }}
                />
                <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Join the Busche Academy Community
                    </h2>
                    <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
                        Open to US and international students. Day and boarding enrollment
                        available.
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
                        For information or to schedule a visit, email us at{" "}
                        <a href="mailto:info@buscheacademy.org" className="text-primary hover:underline">
                            info@buscheacademy.org
                        </a>
                    </p>
                </div>
            </section>

            {/* SECTION 7 — LOCATION STRIP */}
            <section className="bg-slate-50 border-t border-slate-100 py-12">
                <div className="max-w-7xl mx-auto px-6 sm:px-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        {/* Upgrade #8 — pin icon well before "Our Campus" label */}
                        <div className="flex items-start gap-4">
                            <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                                <MapPin size={16} weight="duotone" aria-hidden="true" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-1">
                                    Our Campus
                                </p>
                                <p className="text-lg font-medium text-slate-900">
                                    Chester, New Hampshire — Just 40 miles from Boston
                                </p>
                                <p className="text-slate-600 text-sm mt-1">
                                    A safe, focused environment where student-athletes can thrive.
                                </p>
                            </div>
                        </div>
                        <a
                            href="mailto:info@buscheacademy.org"
                            className="inline-flex items-center gap-2 text-primary hover:text-sky-600 font-medium transition-colors"
                        >
                            info@buscheacademy.org
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
};
