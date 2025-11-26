// src/pages/StaffPage.tsx
import React, { useEffect, useState } from "react";
import { publicApi } from "../api/publicApi";
import type { StaffMemberDto } from "../types";

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

interface StaffSectionProps {
    title: string;
    staff: StaffMemberDto[];
    onSelect: (member: StaffMemberDto) => void;
}

const StaffSection: React.FC<StaffSectionProps> = ({
                                                       title,
                                                       staff,
                                                       onSelect,
                                                   }) => {
    if (!staff.length) {
        return (
            <section className="mt-8">
                <h2 className="text-lg font-semibold text-slate-900">
                    {title}
                </h2>
                <p className="mt-3 text-sm text-slate-500">
                    No staff members listed yet.
                </p>
            </section>
        );
    }

    return (
        <section className="mt-10">
            <div className="flex items-center justify-between gap-4 mb-4">
                <h2 className="text-lg font-semibold text-slate-900">
                    {title}
                </h2>
            </div>

            <div className="flex flex-wrap justify-center gap-8">
                {staff.map((member) => {
                    const teamLabel =
                        member.teamLevel === "NATIONAL"
                            ? "National Team"
                            : "Regional Team";

                    const primarySrc =
                        buildStaffPhotoUrl(
                            member.primaryPhotoUrl || member.secondaryPhotoUrl
                        ) ?? null;
                    const secondarySrc = buildStaffPhotoUrl(
                        member.secondaryPhotoUrl
                    );
                    const hasPhoto = !!(primarySrc || secondarySrc);

                    return (
                        <button
                            key={member.id}
                            type="button"
                            onClick={() => onSelect(member)}
                            className="group relative h-full basis-full sm:basis-1/2 lg:basis-1/3 max-w-xs
                                       rounded-3xl bg-white/70 hover:bg-white
                                       border border-slate-200 hover:border-sky-400/80
                                       shadow-sm hover:shadow-2xl
                                       transform hover:-translate-y-3 hover:scale-[1.04]
                                       transition-all duration-300 ease-out
                                       overflow-hidden text-left flex flex-col items-center px-6 py-6"
                        >
                            {/* Avatar / photo */}
                            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden mb-4 bg-slate-200 flex items-center justify-center">
                                {hasPhoto ? (
                                    <>
                                        {primarySrc && (
                                            <img
                                                src={primarySrc}
                                                alt={member.fullName}
                                                className="w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0"
                                            />
                                        )}
                                        {secondarySrc && (
                                            <img
                                                src={secondarySrc}
                                                alt={member.fullName}
                                                className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                                            />
                                        )}
                                    </>
                                ) : (
                                    <svg
                                        viewBox="0 0 24 24"
                                        aria-hidden="true"
                                        className="w-12 h-12 text-slate-400"
                                    >
                                        <circle
                                            cx="12"
                                            cy="8"
                                            r="3.5"
                                            className="fill-none stroke-current"
                                            strokeWidth="1.8"
                                        />
                                        <path
                                            d="M6 18.5c1.6-2.2 3.5-3.3 6-3.3s4.4 1.1 6 3.3"
                                            className="fill-none stroke-current"
                                            strokeWidth="1.8"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                )}
                            </div>

                            <div className="text-center space-y-1">
                                <p className="text-sm font-semibold tracking-wide text-slate-900">
                                    {member.fullName}
                                </p>
                                <p className="text-xs text-sky-700 font-semibold uppercase tracking-[0.18em]">
                                    {member.position}
                                </p>
                                <p className="text-[11px] text-slate-500 mt-1">
                                    {teamLabel}
                                </p>

                                {(member.email || member.phone) && (
                                    <div className="mt-3 space-y-1 text-[11px] text-slate-600">
                                        {member.email && <p>{member.email}</p>}
                                        {member.phone && <p>{member.phone}</p>}
                                    </div>
                                )}
                            </div>

                            <div className="mt-4 h-px w-16 bg-slate-200 group-hover:bg-sky-400/70 transition-colors" />
                            <p className="mt-2 text-[11px] text-slate-500 group-hover:text-slate-700 transition-colors">
                                Click to view full bio
                            </p>
                        </button>
                    );
                })}
            </div>
        </section>
    );
};

export const StaffPage: React.FC = () => {
    const [nationalStaff, setNationalStaff] = useState<StaffMemberDto[]>([]);
    const [regionalStaff, setRegionalStaff] = useState<StaffMemberDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedStaff, setSelectedStaff] = useState<StaffMemberDto | null>(
        null
    );

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
        ? buildStaffPhotoUrl(
            selectedStaff.primaryPhotoUrl || selectedStaff.secondaryPhotoUrl
        )
        : null;
    const selectedSecondarySrc = selectedStaff
        ? buildStaffPhotoUrl(selectedStaff.secondaryPhotoUrl)
        : null;

    return (
        <div className="py-10">
            <div className="max-w-6xl mx-auto px-4 lg:px-0">
                <header className="text-center mb-10">
                    <p className="text-[11px] font-semibold tracking-[0.3em] text-sky-700 uppercase">
                        Coaching Staff
                    </p>
                    <h1 className="mt-3 text-3xl sm:text-4xl font-semibold text-slate-900">
                        Meet our <span className="italic text-sky-700">staff</span>
                    </h1>
                    <p className="mt-4 text-sm text-slate-600 max-w-2xl mx-auto">
                        Our national and regional coaching staffs work together year-round
                        to develop student-athletes on the court and in the classroom.
                    </p>
                </header>

                {loading && (
                    <p className="text-sm text-slate-600 text-center">
                        Loading staff…
                    </p>
                )}

                {error && !loading && (
                    <p className="text-sm text-rose-500 text-center">{error}</p>
                )}

                {!loading && !error && (
                    <div className="space-y-12">
                        <StaffSection
                            title="National Team Staff"
                            staff={nationalStaff}
                            onSelect={setSelectedStaff}
                        />
                        <StaffSection
                            title="Regional Team Staff"
                            staff={regionalStaff}
                            onSelect={setSelectedStaff}
                        />
                    </div>
                )}
            </div>

            {/* Bio modal */}
            {selectedStaff && (
                <div
                    className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4"
                    onClick={closeModal}
                >
                    <div
                        className="relative max-w-lg w-full rounded-2xl bg-white shadow-xl p-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            onClick={closeModal}
                            className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                        >
                            <span className="sr-only">Close</span>×
                        </button>

                        <div className="flex flex-col items-center text-center mb-4">
                            <div className="relative w-24 h-24 rounded-full overflow-hidden bg-slate-200 mb-3 flex items-center justify-center">
                                {selectedPrimarySrc || selectedSecondarySrc ? (
                                    <>
                                        {selectedPrimarySrc && (
                                            <img
                                                src={selectedPrimarySrc}
                                                alt={selectedStaff.fullName}
                                                className="w-full h-full object-cover"
                                            />
                                        )}
                                    </>
                                ) : (
                                    <svg
                                        viewBox="0 0 24 24"
                                        aria-hidden="true"
                                        className="w-12 h-12 text-slate-400"
                                    >
                                        <circle
                                            cx="12"
                                            cy="8"
                                            r="3.5"
                                            className="fill-none stroke-current"
                                            strokeWidth="1.8"
                                        />
                                        <path
                                            d="M6 18.5c1.6-2.2 3.5-3.3 6-3.3s4.4 1.1 6 3.3"
                                            className="fill-none stroke-current"
                                            strokeWidth="1.8"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                )}
                            </div>

                            <p className="text-base font-semibold text-slate-900">
                                {selectedStaff.fullName}
                            </p>
                            <p className="text-xs text-sky-700 font-semibold uppercase tracking-[0.18em] mt-1">
                                {selectedStaff.position}
                            </p>
                        </div>

                        <div className="text-sm text-slate-700 space-y-3">
                            {selectedStaff.bio ? (
                                <p>{selectedStaff.bio}</p>
                            ) : (
                                <p className="text-slate-500 text-sm">
                                    Bio coming soon.
                                </p>
                            )}

                            {(selectedStaff.email || selectedStaff.phone) && (
                                <div className="pt-2 border-t border-slate-100 text-xs text-slate-600 space-y-1">
                                    {selectedStaff.email && (
                                        <p>Email: {selectedStaff.email}</p>
                                    )}
                                    {selectedStaff.phone && (
                                        <p>Phone: {selectedStaff.phone}</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
