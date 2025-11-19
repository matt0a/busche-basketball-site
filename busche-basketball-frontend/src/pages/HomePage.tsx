import { useEffect, useRef, useState } from "react";
import { publicApi } from "../api/publicApi";
import type { GameDto } from "../types";
import { gsap } from "gsap";

// Simple hero slides – swap image paths & captions for your real photos
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

export const HomePage: React.FC = () => {
    const heroRef = useRef<HTMLDivElement | null>(null);
    const gameCenterRef = useRef<HTMLDivElement | null>(null);

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
        <div className="bg-white">
            {/* HERO SLIDESHOW */}
            <section ref={heroRef} className="relative bg-slate-900 text-white">
                <div className="max-w-6xl mx-auto px-4 py-8 md:py-10">
                    <div className="relative h-[260px] md:h-[360px] rounded-3xl overflow-hidden shadow-xl bg-slate-800">
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
                                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/75 via-slate-900/30 to-slate-900/5" />
                                <div className="absolute left-6 bottom-6 md:left-8 md:bottom-8 space-y-1 md:space-y-2">
                                    <p className="text-[10px] md:text-xs tracking-[0.22em] uppercase text-slate-300">
                                        Busche Academy · Athletics
                                    </p>
                                    <h1 className="text-xl md:text-3xl font-semibold">
                                        {slide.headline}
                                    </h1>
                                    <p className="text-xs md:text-sm text-slate-100 max-w-md">
                                        {slide.sub}
                                    </p>
                                </div>
                            </div>
                        ))}

                        {/* Nav arrows */}
                        <button
                            type="button"
                            onClick={goToPrev}
                            className="absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 md:h-10 md:w-10 rounded-full bg-white/85 text-slate-900 flex items-center justify-center shadow hover:bg-white"
                        >
                            ‹
                        </button>
                        <button
                            type="button"
                            onClick={goToNext}
                            className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 md:h-10 md:w-10 rounded-full bg-white/85 text-slate-900 flex items-center justify-center shadow hover:bg-white"
                        >
                            ›
                        </button>

                        {/* Dots */}
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                            {slides.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveSlide(idx)}
                                    className={`h-1.5 w-4 rounded-full transition-colors ${
                                        idx === activeSlide ? "bg-white" : "bg-white/40"
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* GAME CENTER STRIP */}
            <section
                ref={gameCenterRef}
                className="bg-slate-900 text-white py-8 md:py-10"
            >
                <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-[2fr,3fr] gap-8 items-center">
                    <div>
                        <p className="text-xs tracking-[0.25em] uppercase text-slate-400 mb-2">
                            Game Center
                        </p>
                        <h2 className="text-xl md:text-2xl font-semibold mb-2">
                            Recent results & upcoming matchups
                        </h2>
                        <p className="text-sm text-slate-300">
                            Follow both our{" "}
                            <span className="font-semibold">Regional</span> and{" "}
                            <span className="font-semibold">National</span> teams throughout
                            the season with updated scores and upcoming games.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        {/* Last game */}
                        <div className="bg-slate-950/60 border border-slate-700 rounded-xl p-4">
                            <p className="text-xs uppercase text-slate-400 mb-1">Last Game</p>
                            {loading ? (
                                <p className="text-sm text-slate-400">Loading…</p>
                            ) : lastGame ? (
                                <>
                                    <p className="font-semibold text-sm">
                                        {lastGame.teamName} vs {lastGame.opponent}
                                    </p>
                                    <p className="text-xs text-slate-300">
                                        {formatDateTime(lastGame.gameDateTime)} · {lastGame.location}
                                    </p>
                                    {lastGame.scoreUs != null && lastGame.scoreThem != null && (
                                        <p className="mt-2 text-sm">
                                            Final:{" "}
                                            <span className="font-semibold">
                        {lastGame.scoreUs} – {lastGame.scoreThem}
                      </span>{" "}
                                            {lastGame.win === true && (
                                                <span className="text-aqua font-semibold ml-1">WIN</span>
                                            )}
                                            {lastGame.win === false && (
                                                <span className="text-red-400 font-semibold ml-1">
                          LOSS
                        </span>
                                            )}
                                        </p>
                                    )}
                                </>
                            ) : (
                                <p className="text-sm text-slate-400">
                                    No completed games recorded yet.
                                </p>
                            )}
                        </div>

                        {/* Next game */}
                        <div className="bg-slate-950/60 border border-slate-700 rounded-xl p-4">
                            <p className="text-xs uppercase text-slate-400 mb-1">Next Game</p>
                            {loading ? (
                                <p className="text-sm text-slate-400">Loading…</p>
                            ) : nextGame ? (
                                <>
                                    <p className="font-semibold text-sm">
                                        {nextGame.teamName} vs {nextGame.opponent}
                                    </p>
                                    <p className="text-xs text-slate-300">
                                        {formatDateTime(nextGame.gameDateTime)} · {nextGame.location} ·{" "}
                                        {nextGame.homeAway === "HOME" ? "Home" : "Away"}
                                    </p>
                                    {nextGame.conferenceGame && (
                                        <p className="mt-2 text-xs uppercase text-primary font-semibold">
                                            Conference game
                                        </p>
                                    )}
                                </>
                            ) : (
                                <p className="text-sm text-slate-400">
                                    No upcoming games scheduled yet.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* ABOUT THE PROGRAM */}
            <section className="max-w-6xl mx-auto px-4 py-12 md:py-16 grid md:grid-cols-2 gap-10">
                <div>
                    <p className="text-xs tracking-[0.25em] uppercase text-slate-500 mb-2">
                        Our Program
                    </p>
                    <h2 className="text-2xl font-semibold text-slate-900 mb-4">
                        Busche Academy Basketball
                    </h2>
                    <p className="text-sm md:text-base text-slate-700 mb-3">
                        A year-round basketball program bringing student-athletes from around
                        the world together to train, compete, and prepare for the next level —
                        while thriving in a rigorous academic environment.
                    </p>
                    <p className="text-sm md:text-base text-slate-700">
                        Busche Academy Basketball combines structured skill development,
                        strength and conditioning, and competitive schedules with the academic
                        support of a small boarding school. Our roster includes student-athletes
                        from across the United States and around the world, creating a diverse
                        locker room on a beautiful New Hampshire campus just 40 miles from
                        Boston.
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                        <p className="text-xs uppercase text-slate-500 mb-1">Teams</p>
                        <p className="font-semibold text-slate-900 mb-2">
                            National & Regional squads
                        </p>
                        <p className="text-slate-700">
                            Multiple teams allow players to compete at the level that best fits
                            their development while gaining real game experience.
                        </p>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                        <p className="text-xs uppercase text-slate-500 mb-1">Academics</p>
                        <p className="font-semibold text-slate-900 mb-2">
                            College-prep curriculum
                        </p>
                        <p className="text-slate-700">
                            Student-athletes balance training with rigorous coursework and
                            personalized academic support from Busche Academy faculty.
                        </p>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                        <p className="text-xs uppercase text-slate-500 mb-1">Player Pathways</p>
                        <p className="font-semibold text-slate-900 mb-2">
                            College & pro exposure
                        </p>
                        <p className="text-slate-700">
                            Games, showcases, and film help players connect with college coaches
                            and programs at the next level.
                        </p>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                        <p className="text-xs uppercase text-slate-500 mb-1">Community</p>
                        <p className="font-semibold text-slate-900 mb-2">
                            A global locker room
                        </p>
                        <p className="text-slate-700">
                            Athletes live, study, and compete together on a welcoming campus in
                            rural New Hampshire.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};
