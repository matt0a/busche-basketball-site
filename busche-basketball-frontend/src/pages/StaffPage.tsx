import React, { useEffect, useRef, useState } from "react";
import { publicApi } from "../api/publicApi";
import type { StaffMemberDto } from "../types";
import { gsap } from "gsap";

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

function buildStaffPhotoUrl(path: string | null | undefined): string | null {
    if (!path) return null;
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    if (path.startsWith("/")) return `${API_BASE_URL}${path}`;
    return `${API_BASE_URL}/${path}`;
}

function sortStaff(list: StaffMemberDto[]): StaffMemberDto[] {
    return [...list]
        .filter((s) => s.active)
        .sort((a, b) => {
            const orderA = a.displayOrder ?? 0;
            const orderB = b.displayOrder ?? 0;
            if (orderA !== orderB) return orderA - orderB;
            return a.fullName.localeCompare(b.fullName);
        });
}

interface StaffCardProps {
    member: StaffMemberDto;
    onSelect: (member: StaffMemberDto) => void;
}

const StaffCard: React.FC<StaffCardProps> = ({ member, onSelect }) => {
    const primarySrc = buildStaffPhotoUrl(member.primaryPhotoUrl || member.secondaryPhotoUrl);
    const secondarySrc = buildStaffPhotoUrl(member.secondaryPhotoUrl);
    const hasPhoto = !!(primarySrc || secondarySrc);
    const teamLabel = member.teamLevel === "NATIONAL" ? "National Team" : "Regional Team";

    return (
        <button
            type="button"
            onClick={() => onSelect(member)}
            className="group bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover border border-slate-200 hover:border-primary/30 transition-all duration-300 text-left w-full"
        >
            {/* Photo area */}
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
                {/* Team badge */}
                <div className="absolute top-3 left-3">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide backdrop-blur-sm ${
                        member.teamLevel === "NATIONAL"
                            ? "bg-primary/90 text-white"
                            : "bg-slate-900/80 text-white"
                    }`}>
                        {teamLabel}
                    </span>
                </div>
            </div>

            {/* Info area */}
            <div className="p-5">
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors">
                    {member.fullName}
                </h3>
                <p className="text-primary font-semibold text-sm uppercase tracking-wide mt-1">
                    {member.position}
                </p>

                {(member.email || member.phone) && (
                    <div className="mt-4 pt-4 border-t border-slate-100 space-y-1 text-sm text-slate-600">
                        {member.email && (
                            <p className="truncate">{member.email}</p>
                        )}
                        {member.phone && (
                            <p>{member.phone}</p>
                        )}
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
};

interface StaffSectionProps {
    title: string;
    subtitle: string;
    staff: StaffMemberDto[];
    onSelect: (member: StaffMemberDto) => void;
}

const StaffSection: React.FC<StaffSectionProps> = ({ title, subtitle, staff, onSelect }) => {
    if (!staff.length) return null;

    return (
        <section className="mb-16">
            <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900">{title}</h2>
                <p className="text-slate-600 mt-2">{subtitle}</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {staff.map((member) => (
                    <StaffCard key={member.id} member={member} onSelect={onSelect} />
                ))}
            </div>
        </section>
    );
};

export const StaffPage: React.FC = () => {
    const heroRef = useRef<HTMLDivElement | null>(null);
    const [nationalStaff, setNationalStaff] = useState<StaffMemberDto[]>([]);
    const [regionalStaff, setRegionalStaff] = useState<StaffMemberDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
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
        let isMounted = true;

        const load = async () => {
            try {
                setLoading(true);
                const [nat, reg] = await Promise.all([
                    publicApi.getStaff("NATIONAL"),
                    publicApi.getStaff("REGIONAL"),
                ]);

                if (!isMounted) return;

                setNationalStaff(sortStaff(nat));
                setRegionalStaff(sortStaff(reg));
            } catch (e) {
                console.error(e);
                if (isMounted) {
                    setError("Unable to load staff right now.");
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        load();
        return () => {
            isMounted = false;
        };
    }, []);

    const closeModal = () => setSelectedStaff(null);

    const selectedPrimarySrc = selectedStaff
        ? buildStaffPhotoUrl(selectedStaff.primaryPhotoUrl || selectedStaff.secondaryPhotoUrl)
        : null;

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero Section */}
            <section className="relative bg-slate-900 text-white overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle at 25% 25%, #009FFD 0%, transparent 50%), radial-gradient(circle at 75% 75%, #2AFC98 0%, transparent 50%)`
                    }} />
                </div>

                <div ref={heroRef} className="relative max-w-6xl mx-auto px-4 py-16 md:py-20">
                    <p className="text-primary font-semibold text-sm uppercase tracking-[0.2em] mb-3">
                        Our Team
                    </p>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Coaching Staff
                    </h1>
                    <p className="text-lg text-slate-300 max-w-2xl">
                        Meet the experienced coaches dedicated to developing our student-athletes
                        on and off the court. Our staff brings years of playing and coaching
                        experience at the highest levels.
                    </p>
                </div>
            </section>

            {/* Content */}
            <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
                {loading && (
                    <div className="flex items-center justify-center py-20">
                        <div className="flex items-center gap-3 text-slate-500">
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            <span>Loading staff...</span>
                        </div>
                    </div>
                )}

                {error && !loading && (
                    <div className="bg-rose-50 border border-rose-200 rounded-xl p-6 text-center">
                        <p className="text-rose-600">{error}</p>
                    </div>
                )}

                {!loading && !error && (
                    <>
                        <StaffSection
                            title="National Team Staff"
                            subtitle="Coaching our highest-level competitive team with college exposure and recruiting support."
                            staff={nationalStaff}
                            onSelect={setSelectedStaff}
                        />

                        <StaffSection
                            title="Regional Team Staff"
                            subtitle="Focused on player development and preparing athletes for the next level."
                            staff={regionalStaff}
                            onSelect={setSelectedStaff}
                        />

                        {nationalStaff.length === 0 && regionalStaff.length === 0 && (
                            <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
                                <svg className="w-12 h-12 text-slate-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                <p className="text-slate-600 font-medium">No staff members listed yet</p>
                                <p className="text-sm text-slate-500 mt-1">Check back soon for updates.</p>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Join Our Team CTA */}
            <section className="bg-white border-t border-slate-200 py-12">
                <div className="max-w-6xl mx-auto px-4 text-center">
                    <h2 className="text-2xl font-bold text-slate-900 mb-3">
                        Interested in Joining Our Staff?
                    </h2>
                    <p className="text-slate-600 mb-6 max-w-xl mx-auto">
                        We're always looking for passionate coaches who share our commitment
                        to developing student-athletes.
                    </p>
                    <p className="text-slate-600">
                        For coaching inquiries, email us at{" "}
                        <a href="mailto:info@buscheacademy.org" className="text-primary hover:underline font-medium">
                            info@buscheacademy.org
                        </a>
                    </p>
                </div>
            </section>

            {/* Bio Modal */}
            {selectedStaff && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 py-6"
                    onClick={closeModal}
                >
                    <div
                        className="relative max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-elevated"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header with Photo */}
                        <div className="relative h-48 bg-slate-900">
                            <div className="absolute inset-0 opacity-30">
                                <div className="absolute inset-0" style={{
                                    backgroundImage: `radial-gradient(circle at 50% 50%, #009FFD 0%, transparent 70%)`
                                }} />
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

                            {/* Photo overlapping header */}
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

                        {/* Modal Content */}
                        <div className="pt-20 pb-8 px-8">
                            <div className="mb-6">
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide ${
                                    selectedStaff.teamLevel === "NATIONAL"
                                        ? "bg-primary/10 text-primary"
                                        : "bg-slate-100 text-slate-700"
                                }`}>
                                    {selectedStaff.teamLevel === "NATIONAL" ? "National Team" : "Regional Team"}
                                </span>
                                <h2 className="text-2xl font-bold text-slate-900 mt-2">
                                    {selectedStaff.fullName}
                                </h2>
                                <p className="text-primary font-semibold uppercase tracking-wide">
                                    {selectedStaff.position}
                                </p>
                            </div>

                            <div className="prose prose-slate max-w-none">
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
