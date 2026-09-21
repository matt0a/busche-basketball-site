import { useEffect, useRef, useState } from "react";
import { publicApi } from "../api/publicApi";
import { SectionNav } from "../components/SectionNav";
import { TopoBackground } from "../components/TopoBackground";
import { RosterSection } from "../components/RosterSection";
import { ScheduleSection } from "../components/ScheduleSection";
import type { StaffMemberDto } from "../types";
import {
    CaretRight,
    CircleNotch,
    EnvelopeSimple,
    Globe,
    GraduationCap,
    InstagramLogo,
    Phone,
    SealCheck,
    User,
    UsersThree,
    X,
} from "@phosphor-icons/react";

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
    { id: "roster", label: "Roster" },
    { id: "schedule", label: "Schedule" },
    { id: "coaches", label: "Coaches" },
    { id: "media", label: "Media" },
    { id: "follow", label: "Follow" },
];

const BASKETBALL_INSTAGRAM = "https://www.instagram.com/buschebasketball";

const HIGHLIGHT_CARDS = [
    {
        Icon: UsersThree,
        title: "3 Teams",
        body: "National and Regional squads allow athletes to compete at the right level for their development.",
    },
    {
        Icon: SealCheck,
        title: "College Exposure",
        body: "Games, showcases, and film help players connect with college coaches at all levels.",
    },
    {
        Icon: GraduationCap,
        title: "60+ College Credits",
        body: "Through CMCC, student-athletes have opportunities to earn college credits in high school, helping reduce time and cost in college.",
    },
    {
        Icon: Globe,
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
                        Develop. Compete. Advance.
                    </h1>
                    <p className="text-lg text-slate-300 max-w-2xl mb-8 leading-relaxed">
                        Busche Academy fields National and Regional teams competing against the best prep
                        programs in New England, offering elite coaching, college recruiting support, and
                        an unmatched academic environment.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <a
                            href="#roster"
                            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
                        >
                            View Roster
                        </a>
                        <a
                            href="#schedule"
                            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-lg border border-white/20 transition-colors"
                        >
                            View Schedule
                        </a>
                    </div>
                </div>
            </section>

            {/* ── Section Nav ───────────────────────────── */}
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
                    Elite Basketball, Exceptional Academics
                </h2>

                {/* Prose */}
                <div className="grid md:grid-cols-2 gap-x-12 gap-y-5 text-slate-600 leading-relaxed mb-12">
                    <p>
                        Busche Academy Basketball combines year-round elite training with a rigorous
                        college-preparatory education. Our student-athletes balance structured
                        on-court development, strength and conditioning, and competitive schedules
                        with the academic support of a small boarding school.
                    </p>
                    <div className="space-y-5">
                        <p>
                            Our diverse roster includes student-athletes from across the United States
                            and around the world &mdash; a global locker room on a beautiful New Hampshire
                            campus just 40 miles from Boston.
                        </p>
                        <p>
                            Through the CMCC partnership, basketball players have opportunities to
                            earn college credits in high school, helping reduce time and cost in college.
                        </p>
                    </div>
                </div>

                {/* NCAA info + court photo */}
                <div className="grid md:grid-cols-2 gap-6 items-stretch">
                    <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 flex flex-col justify-center">
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
                    <div className="rounded-2xl overflow-hidden h-56">
                        <img
                            src="/dorm-basketball-1.jpg"
                            alt="Busche Academy basketball court"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </section>

            {/* ── By the numbers ─────────────────────────── */}
            <section className="relative bg-slate-900 text-white overflow-hidden">
                <div className="absolute inset-0 opacity-10" aria-hidden="true">
                    <div
                        className="absolute inset-0"
                        style={{ backgroundImage: "radial-gradient(circle at 25% 25%, #009FFD 0%, transparent 50%), radial-gradient(circle at 75% 75%, #2AFC98 0%, transparent 50%)" }}
                    />
                </div>
                <TopoBackground opacity={0.05} />

                <div className="relative max-w-6xl mx-auto px-4 py-14 md:py-16">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10 lg:gap-x-0 lg:divide-x lg:divide-white/10">
                        {HIGHLIGHT_CARDS.map((card) => (
                            <div key={card.title} className="lg:px-7 lg:first:pl-0 lg:last:pr-0">
                                <div className="w-11 h-11 rounded-xl bg-primary/20 text-primary flex items-center justify-center mb-4">
                                    <card.Icon size={24} weight="duotone" />
                                </div>
                                <p className="text-2xl md:text-3xl font-bold text-white leading-tight mb-2">
                                    {card.title}
                                </p>
                                <p className="text-sm text-slate-300 leading-relaxed">{card.body}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Roster ─────────────────────────────────────── */}
            <section
                id="roster"
                className="bg-white border-t border-slate-200 py-16 md:py-20"
                style={{ scrollMarginTop: "80px" }}
            >
                <div className="max-w-6xl mx-auto px-4 mb-8">
                    <p className="text-primary font-semibold text-sm uppercase tracking-[0.2em] mb-2">
                        2026-27 SEASON
                    </p>
                    <div className="w-12 h-1 rounded-full bg-gradient-to-r from-primary to-aqua mb-3 mt-1" />
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                        Team Roster
                    </h2>
                    <p className="text-slate-600 leading-relaxed max-w-2xl">
                        Meet the student-athletes representing Busche Academy Basketball. Our roster
                        includes talented players from across the United States and around the world.
                    </p>
                </div>

                <RosterSection />
            </section>

            {/* ── Schedule ────────────────────────────────── */}
            <section
                id="schedule"
                className="border-t border-slate-200 py-16 md:py-20"
                style={{ scrollMarginTop: "80px" }}
            >
                <div className="max-w-6xl mx-auto px-4 mb-8">
                    <p className="text-primary font-semibold text-sm uppercase tracking-[0.2em] mb-2">
                        GAME SCHEDULE
                    </p>
                    <div className="w-12 h-1 rounded-full bg-gradient-to-r from-primary to-aqua mb-3 mt-1" />
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                        Upcoming Games &amp; Results
                    </h2>
                    <p className="text-slate-600 leading-relaxed max-w-2xl">
                        Follow Busche Academy Basketball through the season. View upcoming matchups
                        and recent results.
                    </p>
                </div>

                <ScheduleSection />
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
                    <div className="w-12 h-1 rounded-full bg-gradient-to-r from-primary to-aqua mb-3 mt-1" />
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-10">
                        Meet the Coaches
                    </h2>

                    {staffLoading && (
                        <div className="flex items-center gap-3 text-slate-500 py-12">
                            <CircleNotch size={20} weight="bold" className="animate-spin" />
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
                                                    <User size={64} weight="duotone" />
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
                                                <CaretRight size={12} weight="bold" className="transition-transform group-hover:translate-x-1" />
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
                <div className="w-12 h-1 rounded-full bg-gradient-to-r from-primary to-aqua mb-3 mt-1" />
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-10">
                    Photos &amp; Highlights
                </h2>

                {/* Featured row: photo 1 (large) + photo 2 (tall) */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                    <div className="col-span-2 sm:col-span-2 rounded-xl overflow-hidden h-64">
                        <img
                            src="/highlight-1.jpg"
                            alt="Busche Academy team in the gym"
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                    </div>
                    <div className="col-span-2 sm:col-span-1 rounded-xl overflow-hidden h-64">
                        <img
                            src="/highlight-2.jpg"
                            alt="Busche Academy at Manchester Ballers"
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                    </div>
                </div>

                {/* Bottom row: 3 equal photos */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="rounded-xl overflow-hidden h-48">
                        <img
                            src="/highlight-3.jpg"
                            alt="Team road trip"
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                    </div>
                    <div className="rounded-xl overflow-hidden h-48">
                        <img
                            src="/highlight-4.jpg"
                            alt="Graduation ceremony"
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                    </div>
                    <div className="rounded-xl overflow-hidden h-48">
                        <img
                            src="/highlight-5.jpg"
                            alt="Team celebration"
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                    </div>
                </div>

            </section>

            {/* ── Follow ───────────────────────────────────────── */}
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
                                <InstagramLogo size={20} weight="fill" className="shrink-0 text-primary" />
                                <span className="font-bold">@buschebasketball</span>
                            </div>
                            <p className="text-slate-600 text-sm leading-relaxed max-w-xl">
                                Latest photos, highlights, game results and behind-the-scenes
                                content from Busche Academy Basketball.
                            </p>
                        </div>
                        <a
                            href={BASKETBALL_INSTAGRAM}
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
                        Ready to Join the Team?
                    </h2>
                    <p className="text-slate-300 mb-8 max-w-xl mx-auto">
                        Explore our roster and take the next step toward becoming a Busche Academy
                        student-athlete.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <a
                            href="#roster"
                            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
                        >
                            View Roster
                        </a>
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
                                <X size={20} weight="bold" />
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
                                            <User size={48} weight="duotone" />
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
                                                <EnvelopeSimple size={16} weight="duotone" />
                                                {selectedStaff.email}
                                            </a>
                                        )}
                                        {selectedStaff.phone && (
                                            <p className="flex items-center gap-2 text-sm text-slate-700">
                                                <Phone size={16} weight="duotone" />
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
