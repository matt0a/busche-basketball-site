import { useEffect, useRef } from "react";
import { SectionNav } from "../components/SectionNav";
import { VideoEmbed } from "../components/VideoEmbed";

const SECTIONS = [
    { id: "overview", label: "Overview" },
    { id: "training", label: "Training" },
    { id: "watch", label: "Watch" },
    { id: "follow", label: "Follow" },
];

const SPA_INSTAGRAM = "https://www.instagram.com/seacoastperformanceacademy";
const APPLY_URL = "https://bit.ly/gobuscheacademy";

const HIGHLIGHT_CARDS = [
    {
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        ),
        title: "65–70 Games",
        body: "A full season from mid-August through the end of March, including national championships.",
    },
    {
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
        title: "5 Teams",
        body: "U14, U15, U16 and U18 squads plus a U20 junior team, so players compete at the right level.",
    },
    {
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
        ),
        title: "116 Beds",
        body: "On-campus housing in Adams Hall and Preston Hall, minutes from the classroom and dining hall.",
    },
    {
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            </svg>
        ),
        title: "13 Classrooms",
        body: "Ten on the Chester campus and three at the rink, so school never stops for the season.",
    },
];

const TRAINING_CARDS = [
    {
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
        ),
        title: "Power Skating",
        body: "Two edge work and power skating sessions every week with professional skills coach Mark Farrington.",
    },
    {
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
        ),
        title: "Position Skills",
        body: "Two position-specific sessions per week, with separate work for forwards, defensemen and goaltenders.",
    },
    {
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.5 6.5v11m11-11v11M4 9v6m16-6v6M6.5 12h11" />
            </svg>
        ),
        title: "Strength & Conditioning",
        body: "A fully equipped weight room at the rink. Every team trains one to two times per week, with unlimited player access.",
    },
    {
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
        ),
        title: "Goaltending & Video",
        body: "A dedicated goalie centre with video review, led by two-time Stanley Cup champion Mike Buckley.",
    },
];

const VIDEOS = [
    {
        videoId: "wlrhFYMYqe0",
        title: "Be Ready! — Program Film",
        caption: "A short film following the team from the locker room to the final horn.",
    },
    {
        videoId: "3C6VpJX_cAs",
        title: "Facility Tour",
        caption: "A full walkthrough of the rinks, weight room, goalie centre, classrooms and dorms.",
    },
    {
        videoId: "yDbWFDJj0SM",
        title: "Goaltending with GDS",
        caption: "Inside the goalie development system and how it builds each goaltender's own style.",
    },
];

export const HockeyPage = () => {
    const heroRef = useRef<HTMLDivElement | null>(null);

    // Simple fade-in on hero mount
    useEffect(() => {
        if (heroRef.current) {
            heroRef.current.style.opacity = "0";
            heroRef.current.style.transform = "translateY(20px)";
            requestAnimationFrame(() => {
                if (heroRef.current) {
                    heroRef.current.style.transition = "opacity 0.8s ease, transform 0.8s ease";
                    heroRef.current.style.opacity = "1";
                    heroRef.current.style.transform = "translateY(0)";
                }
            });
        }
    }, []);

    return (
        <div className="min-h-screen bg-slate-50">

            {/* ── Hero ──────────────────────────────────────────────────── */}
            <section className="relative bg-slate-900 text-white overflow-hidden">
                <div className="absolute inset-0 opacity-10" aria-hidden="true">
                    <div
                        className="absolute inset-0"
                        style={{
                            backgroundImage:
                                "radial-gradient(circle at 25% 25%, #009FFD 0%, transparent 50%), radial-gradient(circle at 75% 75%, #2AFC98 0%, transparent 50%)",
                        }}
                    />
                </div>

                <div ref={heroRef} className="relative max-w-6xl mx-auto px-4 py-20 md:py-28">
                    <p className="text-primary font-semibold text-sm uppercase tracking-[0.2em] mb-3">
                        HOCKEY PROGRAM
                    </p>
                    <h1 className="text-4xl md:text-6xl font-bold mb-5 leading-tight">
                        Develop. Compete. Advance.
                    </h1>
                    <p className="text-lg text-slate-300 max-w-2xl mb-8 leading-relaxed">
                        Busche Academy hockey is operated jointly with Seacoast Performance Academy
                        at The Rinks at Exeter &mdash; elite on-ice development, a college-preparatory
                        classroom, and a pathway to the next level.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <a
                            href={APPLY_URL}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
                        >
                            Inquire About Hockey
                        </a>
                        <a
                            href="#watch"
                            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-lg border border-white/20 transition-colors"
                        >
                            Watch the Program
                        </a>
                    </div>
                </div>
            </section>

            {/* ── Section Nav ───────────────────────────────────────────── */}
            <SectionNav sections={SECTIONS} />

            {/* ── Overview ─────────────────────────────────────────────── */}
            <section
                id="overview"
                className="max-w-6xl mx-auto px-4 py-16 md:py-20"
                style={{ scrollMarginTop: "80px" }}
            >
                <p className="text-primary font-semibold text-sm uppercase tracking-[0.2em] mb-2">
                    THE PROGRAM
                </p>
                <div className="w-12 h-1 rounded-full bg-gradient-to-r from-primary to-aqua mb-3 mt-1" />
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-10">
                    Elite Hockey, Exceptional Academics
                </h2>

                <div className="grid md:grid-cols-2 gap-12 mb-12">
                    {/* Left — text */}
                    <div className="space-y-5 text-slate-600 leading-relaxed">
                        <p>
                            Our hockey program is operated jointly with Seacoast Performance Academy
                            (SPA), based at The Rinks at Exeter in Exeter, New Hampshire.
                            Student-athletes train on two sheets of ice, live on the Busche Academy
                            campus in Chester, and follow a full college-preparatory curriculum.
                        </p>
                        <p>
                            The rink was built by the NHL in 1999 to grow the game, and Bauer
                            Hockey&apos;s global headquarters sits one mile down the street. Alongside
                            the two sheets are a dedicated goaltending centre, a weight room and
                            classrooms &mdash; so training, school and recovery all happen in the same
                            place.
                        </p>
                        <p>
                            Teams compete against the strongest programs in the country, including
                            Shattuck St. Mary&apos;s, Mount St. Charles and Bishop Kearney. Players come
                            from across the United States and around the world, and move on to NCAA
                            college hockey and Canadian major junior.
                        </p>
                    </div>

                    {/* Right — 2×2 highlight cards */}
                    <div className="grid grid-cols-2 gap-4">
                        {HIGHLIGHT_CARDS.map((card) => (
                            <div
                                key={card.title}
                                className="bg-white rounded-2xl border border-slate-200 shadow-card p-5 hover:border-primary/30 hover:shadow-card-hover transition-all duration-300"
                            >
                                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                                    {card.icon}
                                </div>
                                <h3 className="font-bold text-slate-900 mb-2">{card.title}</h3>
                                <p className="text-slate-600 text-sm leading-relaxed">{card.body}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Training ─────────────────────────────────────────────── */}
            <section
                id="training"
                className="bg-white border-y border-slate-200"
                style={{ scrollMarginTop: "80px" }}
            >
                <div className="max-w-6xl mx-auto px-4 py-16 md:py-20">
                    <p className="text-primary font-semibold text-sm uppercase tracking-[0.2em] mb-2">
                        THE TRAINING PROGRAM
                    </p>
                    <div className="w-12 h-1 rounded-full bg-gradient-to-r from-primary to-aqua mb-3 mt-1" />
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                        Develop Every Part of Your Game
                    </h2>
                    <p className="text-slate-600 leading-relaxed max-w-2xl mb-10">
                        Two to three hours on the ice every day, backed by strength work, video
                        sessions and position-specific coaching.
                    </p>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {TRAINING_CARDS.map((card) => (
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
                </div>
            </section>

            {/* ── Watch ────────────────────────────────────────────────── */}
            <section
                id="watch"
                className="max-w-6xl mx-auto px-4 py-16 md:py-20"
                style={{ scrollMarginTop: "80px" }}
            >
                <p className="text-primary font-semibold text-sm uppercase tracking-[0.2em] mb-2">
                    WATCH
                </p>
                <div className="w-12 h-1 rounded-full bg-gradient-to-r from-primary to-aqua mb-3 mt-1" />
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-10">
                    Hockey at Busche
                </h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {VIDEOS.map((video) => (
                        <VideoEmbed
                            key={video.videoId}
                            videoId={video.videoId}
                            title={video.title}
                            caption={video.caption}
                        />
                    ))}
                </div>
            </section>

            {/* ── Follow ───────────────────────────────────────────────── */}
            <section
                id="follow"
                className="bg-white border-y border-slate-200"
                style={{ scrollMarginTop: "80px" }}
            >
                <div className="max-w-6xl mx-auto px-4 py-16 md:py-20">
                    <p className="text-primary font-semibold text-sm uppercase tracking-[0.2em] mb-2">
                        STAY CONNECTED
                    </p>
                    <div className="w-12 h-1 rounded-full bg-gradient-to-r from-primary to-aqua mb-3 mt-1" />
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                        Follow the Program
                    </h2>

                    <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-2 text-slate-900 mb-2">
                                <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-primary" aria-hidden="true">
                                    <rect x="3" y="3" width="18" height="18" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2" />
                                    <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
                                    <circle cx="17" cy="7" r="1.2" fill="currentColor" />
                                </svg>
                                <span className="font-bold">@seacoastperformanceacademy</span>
                            </div>
                            <p className="text-slate-600 text-sm leading-relaxed max-w-xl">
                                Latest news, highlights, player development and behind-the-scenes
                                content from Seacoast Performance Academy.
                            </p>
                        </div>
                        <a
                            href={SPA_INSTAGRAM}
                            target="_blank"
                            rel="noreferrer"
                            className="btn-primary px-6 py-3 text-base shrink-0"
                        >
                            Follow on Instagram
                        </a>
                    </div>
                </div>
            </section>

            {/* ── Bottom CTA ───────────────────────────────────────────── */}
            <section className="bg-[#264653] text-white py-16">
                <div className="max-w-6xl mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Ready to Take the Next Step?
                    </h2>
                    <p className="text-slate-300 mb-8 max-w-xl mx-auto">
                        Learn more about joining the hockey program at Busche Academy and Seacoast
                        Performance Academy.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <a
                            href={APPLY_URL}
                            target="_blank"
                            rel="noreferrer"
                            className="btn-primary px-8 py-3 text-base"
                        >
                            Apply Now
                        </a>
                    </div>
                    <p className="text-slate-400 text-sm mt-6">
                        Questions? Email us at{" "}
                        <a href="mailto:info@buscheacademy.org" className="text-primary hover:underline">
                            info@buscheacademy.org
                        </a>
                    </p>
                </div>
            </section>
        </div>
    );
};
