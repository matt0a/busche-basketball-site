import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { publicApi } from "../api/publicApi";
import type { GameDto } from "../types";
import { gsap } from "gsap";

// Hero slides – swap image paths & captions for your real photos
const slides = [
    {
        image: "/hero-1.jpg",
        label: "Game Day",
        headline: "Competing across New England",
        sub: "High-level matchups for both Regional and National teams.",
    },
    {
        image: "/hero-2.jpg",
        label: "Practice",
        headline: "Daily skill development",
        sub: "Structured on-court work and strength & conditioning.",
    },
    {
        image: "/hero-3.jpg",
        label: "Global locker room",
        headline: "Student-athletes from around the world",
        sub: "International players thriving in a rigorous academic setting.",
    },
];

// Icons for program highlights
const TeamsIcon = () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);

const AcademicsIcon = () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
    </svg>
);

const PathwaysIcon = () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
);

const CommunityIcon = () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const HomePage: React.FC = () => {
    const heroRef = useRef<HTMLDivElement | null>(null);
    const gameCenterRef = useRef<HTMLDivElement | null>(null);
    const programRef = useRef<HTMLDivElement | null>(null);

    const [activeSlide, setActiveSlide] = useState(0);
    const [recent, setRecent] = useState<GameDto[]>([]);
    const [upcoming, setUpcoming] = useState<GameDto[]>([]);
    const [loading, setLoading] = useState(true);

    // Fade in sections on first load
    useEffect(() => {
        if (heroRef.current) {
            gsap.fromTo(
                heroRef.current,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.9, ease: "power2.out" }
            );
        }
        if (gameCenterRef.current) {
            gsap.fromTo(
                gameCenterRef.current,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.8, delay: 0.3, ease: "power2.out" }
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

    const programHighlights = [
        {
            icon: <TeamsIcon />,
            label: "Teams",
            title: "National & Regional squads",
            description: "Multiple teams allow players to compete at the level that best fits their development while gaining real game experience.",
        },
        {
            icon: <AcademicsIcon />,
            label: "Academics",
            title: "College-prep curriculum",
            description: "Student-athletes balance training with rigorous coursework and personalized academic support from Busche Academy faculty.",
        },
        {
            icon: <PathwaysIcon />,
            label: "Player Pathways",
            title: "College & pro exposure",
            description: "Games, showcases, and film help players connect with college coaches and programs at the next level.",
        },
        {
            icon: <CommunityIcon />,
            label: "Community",
            title: "A global locker room",
            description: "Athletes live, study, and compete together on a welcoming campus in rural New Hampshire.",
        },
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* HERO SLIDESHOW */}
            <section className="relative bg-slate-900 text-white overflow-hidden">
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle at 25% 25%, #009FFD 0%, transparent 50%), radial-gradient(circle at 75% 75%, #2AFC98 0%, transparent 50%)`
                    }} />
                </div>

                <div ref={heroRef} className="relative max-w-6xl mx-auto px-4 py-10 md:py-14">
                    <div className="relative h-[340px] md:h-[480px] rounded-3xl overflow-hidden shadow-elevated bg-slate-800">
                        {slides.map((slide, idx) => (
                            <div
                                key={idx}
                                className={`absolute inset-0 transition-opacity duration-700 ${
                                    idx === activeSlide ? "opacity-100" : "opacity-0 pointer-events-none"
                                }`}
                            >
                                <img
                                    src={slide.image}
                                    alt={slide.headline}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-900/40 to-slate-900/10" />

                                {/* Accent bar */}
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-24 bg-primary rounded-r" />

                                <div className="absolute left-6 bottom-8 md:left-10 md:bottom-12 space-y-2 md:space-y-3">
                                    <p className="text-primary font-semibold text-xs md:text-sm uppercase tracking-[0.2em]">
                                        Busche Academy · {slide.label}
                                    </p>
                                    <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight max-w-lg">
                                        {slide.headline}
                                    </h1>
                                    <p className="text-sm md:text-base text-slate-200 max-w-md leading-relaxed">
                                        {slide.sub}
                                    </p>
                                </div>
                            </div>
                        ))}

                        {/* Nav arrows */}
                        <button
                            type="button"
                            onClick={goToPrev}
                            className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 h-10 w-10 md:h-12 md:w-12 rounded-full bg-white/90 text-slate-900 flex items-center justify-center shadow-md hover:bg-white hover:scale-105 transition-all duration-200"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button
                            type="button"
                            onClick={goToNext}
                            className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 h-10 w-10 md:h-12 md:w-12 rounded-full bg-white/90 text-slate-900 flex items-center justify-center shadow-md hover:bg-white hover:scale-105 transition-all duration-200"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>

                        {/* Dots */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                            {slides.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveSlide(idx)}
                                    className={`h-2 rounded-full transition-all duration-300 ${
                                        idx === activeSlide ? "bg-white w-8" : "bg-white/40 w-2 hover:bg-white/60"
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* GAME CENTER SECTION */}
            <section
                ref={gameCenterRef}
                className="bg-white border-t border-slate-200 py-12 md:py-16"
            >
                <div className="max-w-6xl mx-auto px-4">
                    <div className="grid md:grid-cols-[2fr,3fr] gap-8 md:gap-12 items-start">
                        <div>
                            <p className="text-primary font-semibold text-sm uppercase tracking-[0.2em] mb-2">
                                Game Center
                            </p>
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
                                Recent Results & Upcoming Matchups
                            </h2>
                            <p className="text-slate-600 leading-relaxed">
                                Follow both our{" "}
                                <span className="font-semibold text-slate-900">Regional</span> and{" "}
                                <span className="font-semibold text-slate-900">National</span> teams throughout
                                the season with updated scores and upcoming games.
                            </p>
                            <Link
                                to="/schedule"
                                className="inline-flex items-center gap-2 mt-4 text-primary hover:text-sky-600 font-medium transition-colors"
                            >
                                View Full Schedule
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            {/* Last game */}
                            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 hover:border-primary/30 hover:shadow-card-hover transition-all duration-300">
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-3">Last Game</p>
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

                            {/* Next game */}
                            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 hover:border-primary/30 hover:shadow-card-hover transition-all duration-300">
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-3">Next Game</p>
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

            {/* PROGRAM HIGHLIGHTS SECTION */}
            <section className="bg-slate-50 py-16 md:py-20">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
                        <div>
                            <p className="text-primary font-semibold text-sm uppercase tracking-[0.2em] mb-2">
                                Our Program
                            </p>
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                                Why Busche Academy Basketball
                            </h2>
                            <p className="text-lg text-slate-600 leading-relaxed mb-4">
                                A year-round basketball program bringing student-athletes from around
                                the world together to train, compete, and prepare for the next level —
                                while thriving in a rigorous academic environment.
                            </p>
                            <p className="text-slate-600 leading-relaxed">
                                Busche Academy Basketball combines structured skill development,
                                strength and conditioning, and competitive schedules with the academic
                                support of a small boarding school. Our roster includes student-athletes
                                from across the United States and around the world, creating a diverse
                                locker room on a beautiful New Hampshire campus just 40 miles from
                                Boston.
                            </p>
                            <Link
                                to="/about"
                                className="inline-flex items-center gap-2 mt-6 text-primary hover:text-sky-600 font-medium transition-colors"
                            >
                                Learn More About Our Program
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </div>

                        <div ref={programRef} className="grid sm:grid-cols-2 gap-4">
                            {programHighlights.map((highlight, idx) => (
                                <div
                                    key={idx}
                                    className="bg-white border border-slate-200 rounded-2xl p-6 shadow-card hover:shadow-card-hover hover:border-primary/30 transition-all duration-300 group"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                        {highlight.icon}
                                    </div>
                                    <p className="text-[11px] uppercase tracking-wide text-primary font-semibold mb-1">
                                        {highlight.label}
                                    </p>
                                    <p className="font-bold text-slate-900 mb-2">
                                        {highlight.title}
                                    </p>
                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        {highlight.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA SECTION */}
            <section className="bg-slate-900 text-white py-16 md:py-20">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Ready to Take the Next Step?
                    </h2>
                    <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
                        Learn more about Busche Academy Basketball and how we can help you
                        achieve your goals on and off the court.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <a
                            href="mailto:info@buscheacademy.org?subject=Basketball%20Program%20-%20Schedule%20a%20Visit"
                            className="btn-primary px-8 py-3 text-base"
                        >
                            Schedule a Visit
                        </a>
                        <a
                            href="mailto:info@buscheacademy.org?subject=Basketball%20Program%20-%20Admissions%20Inquiry"
                            className="inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-lg border border-slate-500 text-white hover:bg-white/10 hover:border-white transition-all duration-200"
                        >
                            Request Information
                        </a>
                        <a
                            href="https://form.jotform.com/252083454902455"
                            target="_blank"
                            rel="noreferrer"
                            className="btn-primary px-8 py-3 text-base"
                        >
                            Apply Now
                        </a>
                    </div>
                    <p className="mt-8 text-sm text-slate-400">
                        Questions? Email us at{" "}
                        <a href="mailto:info@buscheacademy.org" className="text-primary hover:underline">
                            info@buscheacademy.org
                        </a>{" "}
                        or call{" "}
                        <span className="text-white">(603) 887-0001</span>
                    </p>
                </div>
            </section>

            {/* LOCATION FOOTER SECTION */}
            <section className="bg-slate-50 border-t border-slate-200 py-12">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
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
                        <a
                            href="https://buscheacademy.org"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 text-primary hover:text-sky-600 font-medium transition-colors"
                        >
                            Visit buscheacademy.org
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
};
