import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { publicApi } from "../api/publicApi";
import { SectionNav } from "../components/SectionNav";
import type { StaffMemberDto } from "../types";

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

function buildStaffPhotoUrl(path: string | null | undefined): string | null {
    if (!path) return null;
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    if (path.startsWith("/")) return `${API_BASE_URL}${path}`;
    return `${API_BASE_URL}/${path}`;
}

const SECTIONS = [
    { id: "overview", label: "Overview" },
    { id: "coaches", label: "Coaches" },
    { id: "media", label: "Media" },
];

const HIGHLIGHT_CARDS = [
    {
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
        title: "2 Teams",
        body: "National and Regional squads allow athletes to compete at the right level for their development.",
    },
    {
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
        ),
        title: "College Exposure",
        body: "Games, showcases, and film help players connect with college coaches at all levels.",
    },
    {
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            </svg>
        ),
        title: "60+ College Credits",
        body: "Through CMCC, student-athletes can earn an Associate's Degree alongside their high school diploma.",
    },
    {
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        title: "Global Roster",
        body: "Players from the US and around the world create a diverse, competitive locker room environment.",
    },
];

export const BasketballPage = () => {
    const heroRef = useRef<HTMLDivElement | null>(null);
    const [staff, setStaff] = useState<StaffMemberDto[]>([]);
    const [staffLoading, setStaffLoading] = useState(true);
    const [selectedStaff, setSelectedStaff] = useState<StaffMemberDto | null>(null);

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

    useEffect(() => {
        let isMounted = true;

        const load = async () => {
            try {
                const all = await publicApi.getStaff();
                if (!isMounted) return;
                const basketball = all
                    .filter((s) => s.staffCategory === "BASKETBALL" && s.active)
                    .sort((a, b) => {
                        const orderA = a.displayOrder ?? 0;
                        const orderB = b.displayOrder ?? 0;
                        if (orderA !== orderB) return orderA - orderB;
                        return a.fullName.localeCompare(b.fullName);
                    });
                setStaff(basketball);
            } catch {
                // Non-fatal — empty state is shown below
            } finally {
                if (isMounted) setStaffLoading(false);
            }
        };

        load();
        return () => { isMounted = false; };
    }, []);

    const closeModal = () => setSelectedStaff(null);
    const selectedPrimarySrc = selectedStaff
        ? buildStaffPhotoUrl(selectedStaff.primaryPhotoUrl || selectedStaff.secondaryPhotoUrl)
        : null;

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
                        BASKETBALL PROGRAM
                    </p>
                    <h1 className="text-4xl md:text-6xl font-bold mb-5 leading-tight">
                        Compete. Develop. Advance.
                    </h1>
                    <p className="text-lg text-slate-300 max-w-2xl mb-8 leading-relaxed">
                        Busche Academy fields National and Regional teams competing against the best prep
                        programs in New England, offering elite coaching, college recruiting support, and
                        an unmatched academic environment.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <Link
                            to="/roster"
                            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
                        >
                            View Roster
                        </Link>
                        <Link
                            to="/schedule"
                            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-lg border border-white/20 transition-colors"
                        >
                            View Schedule
                        </Link>
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
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-10">
                    Elite Basketball, Exceptional Academics
                </h2>

                {/* 2-column */}
                <div className="grid md:grid-cols-2 gap-12 mb-12">
                    {/* Left — text */}
                    <div className="space-y-5 text-slate-600 leading-relaxed">
                        <p>
                            Busche Academy Basketball combines year-round elite training with a rigorous
                            college-preparatory education. Our student-athletes balance structured
                            on-court development, strength and conditioning, and competitive schedules
                            with the academic support of a small boarding school.
                        </p>
                        <p>
                            Our diverse roster includes student-athletes from across the United States
                            and around the world — a global locker room on a beautiful New Hampshire
                            campus just 40 miles from Boston.
                        </p>
                        <p>
                            Through the CMCC partnership, basketball players can also earn college
                            credits and graduate with an Associate's Degree.
                        </p>
                    </div>

                    {/* Right — 2×2 highlight cards */}
                    <div className="grid grid-cols-2 gap-4">
                        {HIGHLIGHT_CARDS.map((card) => (
                            <div
                                key={card.title}
                                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm"
                            >
                                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                                    {card.icon}
                                </div>
                                <p className="font-bold text-slate-900 text-sm mb-1">{card.title}</p>
                                <p className="text-xs text-slate-500 leading-relaxed">{card.body}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Wide info box */}
                <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
                    <p className="text-primary font-semibold text-xs uppercase tracking-[0.15em] mb-2">
                        NCAA-Certified Program
                    </p>
                    <p className="text-slate-700 leading-relaxed mb-3">
                        Busche Academy is an NCAA-certified program. Our student-athletes meet
                        eligibility requirements for collegiate athletics.
                    </p>
                    <a
                        href="mailto:info@buscheacademy.org?subject=Basketball%20Program%20Inquiry"
                        className="text-primary font-semibold text-sm hover:underline"
                    >
                        Contact us to learn more &rarr;
                    </a>
                </div>
            </section>

            {/* ── Coaches ──────────────────────────────────────────────── */}
            <section
                id="coaches"
                className="bg-white border-t border-slate-200"
                style={{ scrollMarginTop: "80px" }}
            >
                <div className="max-w-6xl mx-auto px-4 py-16 md:py-20">
                    <p className="text-primary font-semibold text-sm uppercase tracking-[0.2em] mb-2">
                        COACHING STAFF
                    </p>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-10">
                        Meet the Coaches
                    </h2>

                    {staffLoading && (
                        <div className="flex items-center gap-3 text-slate-500 py-12">
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            <span>Loading coaches...</span>
                        </div>
                    )}

                    {!staffLoading && staff.length === 0 && (
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-12 text-center">
                            <p className="text-slate-600 font-medium">Coaching staff profiles coming soon.</p>
                        </div>
                    )}

                    {!staffLoading && staff.length > 0 && (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {staff.map((member) => {
                                const primarySrc = buildStaffPhotoUrl(
                                    member.primaryPhotoUrl || member.secondaryPhotoUrl,
                                );
                                const secondarySrc = buildStaffPhotoUrl(member.secondaryPhotoUrl);
                                const hasPhoto = !!(primarySrc || secondarySrc);
                                const teamLabel =
                                    member.teamLevel === "NATIONAL" ? "National Team" : "Regional Team";

                                return (
                                    <button
                                        key={member.id}
                                        type="button"
                                        onClick={() => setSelectedStaff(member)}
                                        className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-slate-200 hover:border-primary/30 transition-all duration-300 text-left w-full"
                                    >
                                        {/* Photo */}
                                        <div className="relative h-64 bg-slate-100 overflow-hidden">
                                            {hasPhoto ? (
                                                <>
                                                    {primarySrc && (
                                                        <img
                                                            src={primarySrc}
                                                            alt={member.fullName}
                                                            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                                                        />
                                                    )}
                                                    {secondarySrc && primarySrc !== secondarySrc && (
                                                        <img
                                                            src={secondarySrc}
                                                            alt={member.fullName}
                                                            className="absolute inset-0 w-full h-full object-cover object-top opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                                                        />
                                                    )}
                                                </>
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                                                    <svg viewBox="0 0 24 24" className="w-16 h-16" aria-hidden="true">
                                                        <circle cx="12" cy="8" r="3.5" className="fill-none stroke-current" strokeWidth="1.5" />
                                                        <path d="M6 18.5c1.6-2.2 3.5-3.3 6-3.3s4.4 1.1 6 3.3" className="fill-none stroke-current" strokeWidth="1.5" strokeLinecap="round" />
                                                    </svg>
                                                </div>
                                            )}
                                            <div className="absolute top-3 left-3">
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide backdrop-blur-sm ${
                                                        member.teamLevel === "NATIONAL"
                                                            ? "bg-primary/90 text-white"
                                                            : "bg-slate-900/80 text-white"
                                                    }`}
                                                >
                                                    {teamLabel}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Info */}
                                        <div className="p-5">
                                            <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors">
                                                {member.fullName}
                                            </h3>
                                            <p className="text-primary font-semibold text-sm uppercase tracking-wide mt-1">
                                                {member.position}
                                            </p>
                                            {(member.email || member.phone) && (
                                                <div className="mt-4 pt-4 border-t border-slate-100 space-y-1 text-sm text-slate-600">
                                                    {member.email && <p className="truncate">{member.email}</p>}
                                                    {member.phone && <p>{member.phone}</p>}
                                                </div>
                                            )}
                                            <p className="mt-4 text-xs text-slate-500 group-hover:text-primary transition-colors flex items-center gap-1">
                                                View full profile
                                                <svg className="w-3 h-3 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

            {/* ── Media ────────────────────────────────────────────────── */}
            <section
                id="media"
                className="max-w-6xl mx-auto px-4 py-16 md:py-20"
                style={{ scrollMarginTop: "80px" }}
            >
                <p className="text-primary font-semibold text-sm uppercase tracking-[0.2em] mb-2">
                    MEDIA
                </p>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-10">
                    Photos &amp; Highlights
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div
                            key={i}
                            className="bg-slate-100 rounded-xl h-48 flex items-center justify-center"
                        >
                            <svg
                                className="w-10 h-10 text-slate-300"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                aria-hidden="true"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                            </svg>
                        </div>
                    ))}
                </div>

                <p className="text-center text-slate-500 text-sm mt-4">
                    Media gallery coming soon. Check back for game highlights, photos, and more.
                </p>

                <p className="text-center text-slate-600 text-sm mt-3">
                    Follow us on{" "}
                    <a
                        href="https://www.instagram.com/busche_academy_basketball_?igsh=cHVmbjNyNnRwajdl"
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary font-semibold hover:underline"
                    >
                        Instagram
                    </a>{" "}
                    for the latest photos.
                </p>
            </section>

            {/* ── Bottom CTA ───────────────────────────────────────────── */}
            <section className="bg-[#264653] text-white py-16">
                <div className="max-w-6xl mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Ready to Join the Team?
                    </h2>
                    <p className="text-slate-300 mb-8 max-w-xl mx-auto">
                        Explore our roster and take the next step toward becoming a Busche Academy
                        student-athlete.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link
                            to="/roster"
                            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
                        >
                            View Roster
                        </Link>
                        <a
                            href="https://bit.ly/gobuscheacademy"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-lg border border-white/20 transition-colors"
                        >
                            Apply Now
                        </a>
                    </div>
                </div>
            </section>

            {/* ── Staff Bio Modal ──────────────────────────────────────── */}
            {selectedStaff && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 py-6"
                    onClick={closeModal}
                >
                    <div
                        className="relative max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal header */}
                        <div className="relative h-48 bg-slate-900">
                            <div className="absolute inset-0 opacity-30" aria-hidden="true">
                                <div
                                    className="absolute inset-0"
                                    style={{
                                        backgroundImage:
                                            "radial-gradient(circle at 50% 50%, #009FFD 0%, transparent 70%)",
                                    }}
                                />
                            </div>
                            <button
                                type="button"
                                onClick={closeModal}
                                className="absolute right-4 top-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-10"
                            >
                                <span className="sr-only">Close</span>
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            <div className="absolute -bottom-16 left-8">
                                <div className="w-32 h-32 rounded-2xl overflow-hidden bg-slate-200 border-4 border-white shadow-lg">
                                    {selectedPrimarySrc ? (
                                        <img
                                            src={selectedPrimarySrc}
                                            alt={selectedStaff.fullName}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                                            <svg viewBox="0 0 24 24" className="w-12 h-12" aria-hidden="true">
                                                <circle cx="12" cy="8" r="3.5" className="fill-none stroke-current" strokeWidth="1.5" />
                                                <path d="M6 18.5c1.6-2.2 3.5-3.3 6-3.3s4.4 1.1 6 3.3" className="fill-none stroke-current" strokeWidth="1.5" strokeLinecap="round" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Modal content */}
                        <div className="pt-20 pb-8 px-8">
                            <div className="mb-6">
                                <span
                                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide ${
                                        selectedStaff.teamLevel === "NATIONAL"
                                            ? "bg-primary/10 text-primary"
                                            : "bg-slate-100 text-slate-700"
                                    }`}
                                >
                                    {selectedStaff.teamLevel === "NATIONAL" ? "National Team" : "Regional Team"}
                                </span>
                                <h2 className="text-2xl font-bold text-slate-900 mt-2">
                                    {selectedStaff.fullName}
                                </h2>
                                <p className="text-primary font-semibold uppercase tracking-wide">
                                    {selectedStaff.position}
                                </p>
                            </div>

                            <div>
                                {selectedStaff.bio ? (
                                    <p className="text-slate-600 leading-relaxed">{selectedStaff.bio}</p>
                                ) : (
                                    <p className="text-slate-500 italic">Bio coming soon.</p>
                                )}
                            </div>

                            {(selectedStaff.email || selectedStaff.phone) && (
                                <div className="mt-6 pt-6 border-t border-slate-200">
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                                        Contact Information
                                    </p>
                                    <div className="space-y-2">
                                        {selectedStaff.email && (
                                            <a
                                                href={`mailto:${selectedStaff.email}`}
                                                className="flex items-center gap-2 text-sm text-slate-700 hover:text-primary transition-colors"
                                            >
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
        </div>
    );
};
