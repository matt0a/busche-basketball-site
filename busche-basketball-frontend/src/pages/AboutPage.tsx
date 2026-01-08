import { useEffect, useMemo, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Theme = "light" | "dark";

type AboutSection = {
    id: string;
    kicker: string;
    title: string;
    body: string;
    bullets?: string[];
};

const bgForTheme = (theme: Theme) => (theme === "dark" ? "#0f172a" : "#ffffff"); // slate-900 / white

export const AboutPage: React.FC = () => {
    const pageRef = useRef<HTMLDivElement | null>(null);
    const sectionRefs = useRef<(HTMLElement | null)[]>([]);
    const contentRefs = useRef<(HTMLElement | null)[]>([]);

    const sections: AboutSection[] = useMemo(
        () => [
            {
                id: "overview",
                kicker: "About",
                title: "One program. Two priorities: basketball + academics.",
                body:
                    "This page is a layout placeholder — we’ll plug in your official curriculum, benefits, and program details next. For now, it’s a clean, scrollable About experience with animations and alternating colors.",
                bullets: [
                    "Year-round training & structured development",
                    "Competitive schedules for multiple team levels",
                    "College-prep academics and study support",
                    "A global locker room and leadership culture",
                ],
            },
            {
                id: "training",
                kicker: "Training",
                title: "Skill development that’s consistent and measurable",
                body:
                    "Add your training model here (daily schedule, weekly focuses, strength & conditioning, film, and player evaluations). This section is styled for a dark/blue panel like your homepage.",
                bullets: [
                    "On-court development blocks",
                    "Strength & conditioning",
                    "Film study & IQ",
                    "Individual growth plans",
                ],
            },
            {
                id: "academics",
                kicker: "Academics",
                title: "College-prep curriculum and real support",
                body:
                    "Add the academic structure here (class schedule, tutoring, study hall, GPA support, SAT/ACT, and college advising).",
                bullets: [
                    "Small-school environment",
                    "Study hall / tutoring structure",
                    "College planning & guidance",
                    "Accountability and mentoring",
                ],
            },
            {
                id: "benefits",
                kicker: "Benefits",
                title: "What student-athletes gain beyond the court",
                body:
                    "Add outcomes and benefits here (recruiting exposure, confidence, discipline, leadership, and community).",
                bullets: [
                    "Recruiting / exposure opportunities",
                    "Leadership and character development",
                    "Structured routine and accountability",
                    "Community and belonging",
                ],
            },
            {
                id: "campus-life",
                kicker: "Campus Life",
                title: "A supportive environment to live, learn, and compete",
                body:
                    "Add boarding/day life details here (campus, housing, meals, supervision, weekend activities, and student services).",
                bullets: [
                    "Boarding & day options",
                    "Safe, supervised environment",
                    "Campus resources",
                    "Student activities",
                ],
            },
            {
                id: "cta",
                kicker: "Next Steps",
                title: "Tryouts, admissions, and program info",
                body:
                    "Add your official admissions/tryout details later. This area is designed as a call-to-action.",
                bullets: [
                    "Tryout dates & requirements",
                    "Tuition and scholarship info",
                    "International student guidance",
                    "Contact and application steps",
                ],
            },
        ],
        []
    );

    // Alternate themes: white, blue, white, blue...
    const themeForIndex = (idx: number): Theme => (idx % 2 === 0 ? "light" : "dark");

    useEffect(() => {
        const pageEl = pageRef.current;
        if (!pageEl) return;

        // Start on white.
        pageEl.style.backgroundColor = bgForTheme("light");

        const ctx = gsap.context(() => {
            // Animate each section's content in/out on scroll
            contentRefs.current.forEach((contentEl, idx) => {
                const sectionEl = sectionRefs.current[idx];
                if (!contentEl || !sectionEl) return;

                const fromX = idx % 2 === 0 ? -16 : 16;
                gsap.fromTo(
                    contentEl,
                    { opacity: 0, y: 36, x: fromX },
                    {
                        opacity: 1,
                        y: 0,
                        x: 0,
                        duration: 0.9,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: sectionEl,
                            start: "top 75%",
                            end: "bottom 35%",
                            toggleActions: "play none none reverse",
                        },
                    }
                );
            });

            // Smooth background color changes per section
            sectionRefs.current.forEach((sectionEl, idx) => {
                if (!sectionEl) return;
                const theme = themeForIndex(idx);
                const targetBg = bgForTheme(theme);

                ScrollTrigger.create({
                    trigger: sectionEl,
                    start: "top center",
                    end: "bottom center",
                    onEnter: () =>
                        gsap.to(pageEl, {
                            backgroundColor: targetBg,
                            duration: 0.6,
                            overwrite: true,
                            ease: "power1.out",
                        }),
                    onEnterBack: () =>
                        gsap.to(pageEl, {
                            backgroundColor: targetBg,
                            duration: 0.6,
                            overwrite: true,
                            ease: "power1.out",
                        }),
                });
            });
        }, pageEl);

        return () => ctx.revert();
    }, [sections]);

    return (
        <div ref={pageRef} className="min-h-screen">
            {sections.map((s, idx) => {
                const theme = themeForIndex(idx);
                const isDark = theme === "dark";

                return (
                    <section
                        key={s.id}
                        ref={(el) => {
                            sectionRefs.current[idx] = el;
                        }}
                        id={s.id}
                        className="py-16 md:py-24"
                    >
                        <div
                            ref={(el) => {
                                contentRefs.current[idx] = el;
                            }}
                            className="max-w-6xl mx-auto px-4"
                        >
                            <div className="grid md:grid-cols-[1.4fr,1fr] gap-10 items-start">
                                <div className={isDark ? "text-white" : "text-slate-900"}>
                                    <p
                                        className={
                                            isDark
                                                ? "text-xs tracking-[0.25em] uppercase text-slate-300"
                                                : "text-xs tracking-[0.25em] uppercase text-slate-500"
                                        }
                                    >
                                        {s.kicker}
                                    </p>
                                    <h1
                                        className={
                                            idx === 0
                                                ? "mt-2 text-3xl md:text-5xl font-semibold leading-tight"
                                                : "mt-2 text-2xl md:text-4xl font-semibold leading-tight"
                                        }
                                    >
                                        {s.title}
                                    </h1>
                                    <p
                                        className={
                                            isDark
                                                ? "mt-4 text-sm md:text-base text-slate-200 max-w-2xl"
                                                : "mt-4 text-sm md:text-base text-slate-700 max-w-2xl"
                                        }
                                    >
                                        {s.body}
                                    </p>

                                    {idx === 0 && (
                                        <div className="mt-6 flex flex-wrap gap-3">
                                            <a
                                                href="#cta"
                                                className={
                                                    isDark
                                                        ? "inline-flex items-center justify-center rounded-full bg-white text-slate-900 px-5 py-2 text-sm font-semibold shadow hover:bg-slate-100"
                                                        : "inline-flex items-center justify-center rounded-full bg-slate-900 text-white px-5 py-2 text-sm font-semibold shadow hover:bg-slate-800"
                                                }
                                            >
                                                Jump to next steps
                                            </a>
                                            <a
                                                href="#training"
                                                className={
                                                    isDark
                                                        ? "inline-flex items-center justify-center rounded-full border border-slate-400/60 text-white px-5 py-2 text-sm hover:border-white"
                                                        : "inline-flex items-center justify-center rounded-full border border-slate-300 text-slate-900 px-5 py-2 text-sm hover:border-slate-500"
                                                }
                                            >
                                                Program highlights
                                            </a>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    <div
                                        className={
                                            isDark
                                                ? "rounded-2xl border border-slate-700 bg-slate-950/60 p-5"
                                                : "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                                        }
                                    >
                                        <p
                                            className={
                                                isDark
                                                    ? "text-xs uppercase text-slate-400 mb-3"
                                                    : "text-xs uppercase text-slate-500 mb-3"
                                            }
                                        >
                                            Section outline
                                        </p>
                                        <ul
                                            className={
                                                isDark
                                                    ? "space-y-2 text-sm text-slate-200"
                                                    : "space-y-2 text-sm text-slate-700"
                                            }
                                        >
                                            {(s.bullets ?? [
                                                "Placeholder bullet — add your content later",
                                                "Placeholder bullet — add your content later",
                                                "Placeholder bullet — add your content later",
                                            ]).map((b, i) => (
                                                <li key={i} className="flex gap-2">
                                                    <span className={isDark ? "text-aqua" : "text-primary"}>●</span>
                                                    <span>{b}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div
                                        className={
                                            isDark
                                                ? "rounded-2xl border border-slate-700 bg-slate-950/60 p-5"
                                                : "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                                        }
                                    >
                                        <p
                                            className={
                                                isDark
                                                    ? "text-xs uppercase text-slate-400 mb-2"
                                                    : "text-xs uppercase text-slate-500 mb-2"
                                            }
                                        >
                                            Notes
                                        </p>
                                        <p className={isDark ? "text-sm text-slate-200" : "text-sm text-slate-700"}>
                                            Replace this card with real copy later (curriculum, benefits, admissions,
                                            staff bios, etc.). The layout and animations are ready.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                );
            })}

            {/* Bottom spacer so the last color change feels complete */}
            <div className="h-10" />
        </div>
    );
};
