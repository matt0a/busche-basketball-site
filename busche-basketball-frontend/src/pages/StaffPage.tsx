import React, { useEffect, useRef, useState } from "react";
import { publicApi } from "../api/publicApi";
import type { StaffMemberDto } from "../types";
import { gsap } from "gsap";
import {
    CaretRight,
    CircleNotch,
    EnvelopeSimple,
    Phone,
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
            <div className="relative h-24 sm:h-36 lg:h-48 bg-slate-100 overflow-hidden">
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
                {/* Team badge */}
                <div className="absolute top-1.5 left-1.5 sm:top-3 sm:left-3">
                    <span className={`inline-flex items-center px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[8px] sm:text-[10px] font-semibold uppercase tracking-wide backdrop-blur-sm ${
                        member.teamLevel === "NATIONAL"
                            ? "bg-primary/90 text-white"
                            : "bg-slate-900/80 text-white"
                    }`}>
                        {teamLabel}
                    </span>
                </div>
            </div>

            {/* Info area */}
            <div className="p-2 sm:p-3 lg:p-4">
                <h3 className="text-[10px] sm:text-sm lg:text-base font-bold text-slate-900 group-hover:text-primary transition-colors leading-tight">
                    {member.fullName}
                </h3>
                <p className="text-primary font-semibold text-[9px] sm:text-xs lg:text-sm uppercase tracking-wide mt-0.5">
                    {member.position}
                </p>

                {(member.email || member.phone) && (
                    <div className="hidden sm:block mt-4 pt-4 border-t border-slate-100 space-y-1 text-sm text-slate-600">
                        {member.email && (
                            <p className="truncate">{member.email}</p>
                        )}
                        {member.phone && (
                            <p>{member.phone}</p>
                        )}
                    </div>
                )}

                <p className="hidden sm:flex mt-4 text-xs text-slate-500 group-hover:text-primary transition-colors items-center gap-1">
                    View full profile
                    <CaretRight size={12} weight="bold" className="transition-transform group-hover:translate-x-1" />
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

            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                {staff.map((member) => (
                    <div key={member.id} className="w-[30%] lg:w-[18%] min-w-0">
                        <StaffCard member={member} onSelect={onSelect} />
                    </div>
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
                            <CircleNotch size={20} weight="bold" className="animate-spin" />
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
                                <UsersThree size={48} weight="duotone" className="text-slate-300 mx-auto mb-4" />
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
                                <X size={20} weight="bold" />
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
                                            <User size={48} weight="duotone" />
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
