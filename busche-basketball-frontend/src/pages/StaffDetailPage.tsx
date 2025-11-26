import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { publicApi } from "../api/publicApi";
import type { StaffMemberDto } from "../types";

export const StaffDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [staff, setStaff] = useState<StaffMemberDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        let isMounted = true;

        const load = async () => {
            try {
                setLoading(true);
                const data = await publicApi.getStaffMember(Number(id));
                if (isMounted) setStaff(data);
            } catch (e) {
                console.error(e);
                if (isMounted) setError("Unable to load staff member.");
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        load();
        return () => {
            isMounted = false;
        };
    }, [id]);

    if (loading) {
        return (
            <div className="py-10 max-w-4xl mx-auto px-4 lg:px-0">
                <p className="text-sm text-slate-600">Loading profile…</p>
            </div>
        );
    }

    if (error || !staff) {
        return (
            <div className="py-10 max-w-4xl mx-auto px-4 lg:px-0 space-y-4">
                <p className="text-sm text-rose-500">
                    {error ?? "Not found."}
                </p>
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="text-sm text-sky-600 hover:text-sky-500 underline underline-offset-4"
                >
                    Go back
                </button>
            </div>
        );
    }

    const teamLabel =
        staff.teamLevel === "NATIONAL" ? "National Team" : "Regional Team";

    const mainPhoto =
        staff.primaryPhotoUrl ||
        staff.secondaryPhotoUrl ||
        "/placeholder-staff.jpg";

    const bioParagraphs = staff.bio ? staff.bio.split(/\n\s*\n/) : [];

    return (
        <div className="py-10 bg-white">
            <div className="max-w-4xl mx-auto px-4 lg:px-0">
                {/* breadcrumb + back */}
                <div className="flex items-center justify-between text-xs text-slate-500 mb-6">
                    <div className="space-x-2">
                        <Link
                            to="/staff"
                            className="hover:text-sky-600 transition-colors"
                        >
                            Staff
                        </Link>
                        <span>/</span>
                        <span className="text-slate-700">{staff.fullName}</span>
                    </div>

                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="hover:text-sky-600 transition-colors"
                    >
                        Back
                    </button>
                </div>

                {/* header card */}
                <div className="rounded-3xl border border-slate-200 bg-slate-900/80 sm:bg-slate-900/70 shadow-xl shadow-black/20 px-8 py-8 flex flex-col items-center text-center text-slate-50">
                    <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full overflow-hidden mb-4 bg-slate-800">
                        <img
                            src={mainPhoto}
                            alt={staff.fullName}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <p className="text-[11px] font-semibold tracking-[0.3em] uppercase text-sky-300">
                        {teamLabel}
                    </p>
                    <h1 className="mt-2 text-2xl sm:text-3xl font-semibold">
                        {staff.fullName}
                    </h1>
                    <p className="mt-1 text-sm font-medium text-sky-200">
                        {staff.position}
                    </p>

                    {(staff.email || staff.phone) && (
                        <div className="mt-4 text-xs sm:text-sm text-slate-100 space-y-1">
                            {staff.email && (
                                <p>
                                    <span className="text-slate-300">
                                        Email:&nbsp;
                                    </span>
                                    <a
                                        href={`mailto:${staff.email}`}
                                        className="text-sky-300 hover:text-sky-200"
                                    >
                                        {staff.email}
                                    </a>
                                </p>
                            )}
                            {staff.phone && (
                                <p>
                                    <span className="text-slate-300">
                                        Phone:&nbsp;
                                    </span>
                                    <span>{staff.phone}</span>
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* centered bio text */}
                <article className="mt-8 max-w-3xl mx-auto text-center">
                    {bioParagraphs.length ? (
                        <div className="space-y-4 text-sm leading-relaxed text-slate-700">
                            {bioParagraphs.map((para, idx) => (
                                <p key={idx}>{para}</p>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-slate-600">
                            Bio coming soon.
                        </p>
                    )}
                </article>
            </div>
        </div>
    );
};
