import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import type { StaffMemberDto, TeamLevel } from "../types";
import { useAuth } from "../auth/AuthContext";
import { adminStaffApi } from "../api/adminStaffApi";
import type { StaffMemberInput } from "../api/adminStaffApi";
import { AdminRosterManager } from "../components/AdminRosterManager";
import { AdminScheduleManager } from "../components/AdminScheduleManager";
import { AdminTeamManager } from "../components/AdminTeamManager";

const DEFAULT_AVATAR = "/images/default-avatar.svg";

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

/**
 * Turn whatever the backend stored ("/uploads/staff/xyz.webp") into a full URL
 * that the browser can actually load.
 */
function buildStaffPhotoUrl(path: string | null | undefined): string | null {
    if (!path) return null;

    // Already absolute
    if (path.startsWith("http://") || path.startsWith("https://")) {
        return path;
    }

    if (path.startsWith("/")) {
        return `${API_BASE_URL}${path}`;
    }

    return `${API_BASE_URL}/${path}`;
}

/* ---------- Types ---------- */

interface StaffFormValues {
    fullName: string;
    teamLevel: TeamLevel;
    position: string;
    displayOrder: string;
    primaryPhotoUrl: string;
    secondaryPhotoUrl: string;
    email: string;
    phone: string;
    bio: string;
    active: boolean;
}

const emptyForm: StaffFormValues = {
    fullName: "",
    teamLevel: "NATIONAL",
    position: "",
    displayOrder: "",
    primaryPhotoUrl: "",
    secondaryPhotoUrl: "",
    email: "",
    phone: "",
    bio: "",
    active: true,
};

interface ImageDropzoneProps {
    label: string;
    helperText?: string;
    previewUrl: string | null;
    uploading: boolean;
    onFileSelected: (file: File) => void;
}

type AdminTab = "STAFF" | "ROSTER" | "SCHEDULE" | "TEAMS";

/* ---------- Image dropzone ---------- */

const ImageDropzone: React.FC<ImageDropzoneProps> = ({
                                                         label,
                                                         helperText,
                                                         previewUrl,
                                                         uploading,
                                                         onFileSelected,
                                                     }) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleFiles = (files: FileList | null) => {
        if (!files || !files.length) return;
        onFileSelected(files[0]);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        handleFiles(e.dataTransfer.files);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleFiles(e.target.files);
    };

    const openPicker = () => {
        if (uploading) return;
        inputRef.current?.click();
    };

    return (
        <div className="space-y-2">
            <p className="text-sm font-medium text-slate-900">{label}</p>
            <div
                className={`flex flex-col items-center justify-center border-2 border-dashed rounded-md px-4 py-5 text-center cursor-pointer transition-colors ${
                    uploading
                        ? "border-sky-500 bg-sky-50"
                        : isDragging
                            ? "border-sky-400 bg-sky-50"
                            : "border-slate-300 bg-slate-50 hover:border-sky-400"
                }`}
                onClick={openPicker}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
            >
                <input
                    type="file"
                    accept="image/*"
                    ref={inputRef}
                    className="hidden"
                    onChange={handleInputChange}
                />

                {previewUrl ? (
                    <img
                        src={previewUrl}
                        alt="Preview"
                        className="h-24 w-24 rounded-md object-cover mb-3 border border-slate-200 bg-white"
                    />
                ) : (
                    <div className="h-24 w-24 rounded-md bg-white flex items-center justify-center mb-3 border border-slate-200">
                        {/* upload icon: arrow into a tray */}
                        <svg
                            className="h-10 w-10 text-slate-400"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >
                            {/* tray */}
                            <path
                                d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            {/* arrow down */}
                            <path
                                d="M12 4v9m0 0-3-3m3 3 3-3"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>
                )}

                <p className="text-xs font-medium text-slate-900">
                    {uploading ? "Uploading photo…" : "Drag & drop, or click to browse"}
                </p>
                {helperText && (
                    <p className="mt-1 text-[11px] text-slate-500">{helperText}</p>
                )}
            </div>
        </div>
    );
};

/* ---------- Main page ---------- */

export const AdminDashboardPage: React.FC = () => {
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const [staff, setStaff] = useState<StaffMemberDto[]>([]);
    const [form, setForm] = useState<StaffFormValues>(emptyForm);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [status, setStatus] = useState<string | null>(null);

    const [primaryPreview, setPrimaryPreview] = useState<string | null>(null);
    const [secondaryPreview, setSecondaryPreview] = useState<string | null>(null);
    const [uploadingPrimary, setUploadingPrimary] = useState(false);
    const [uploadingSecondary, setUploadingSecondary] = useState(false);

    const [activeTab, setActiveTab] = useState<AdminTab>("STAFF");

    // Also fall back to localStorage in case AuthContext hasn't hydrated yet
    const token =
        typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    const isCoachLoggedIn = isAuthenticated || !!token;

    /* ---------- Data load ---------- */

    useEffect(() => {
        if (!isCoachLoggedIn) {
            setLoading(false);
            return;
        }

        (async () => {
            try {
                setLoading(true);
                const data = await adminStaffApi.list();
                setStaff(data);
            } catch (e) {
                console.error(e);
                setError("Unable to load staff list.");
            } finally {
                setLoading(false);
            }
        })();
    }, [isCoachLoggedIn]);

    /* ---------- Helpers ---------- */

    const resetForm = () => {
        setForm(emptyForm);
        setEditingId(null);
        setPrimaryPreview(null);
        setSecondaryPreview(null);
    };

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const target = e.target;
        const { name, value } = target;

        if (target instanceof HTMLInputElement && target.type === "checkbox") {
            setForm((prev) => ({
                ...prev,
                [name]: target.checked,
            }));
        } else {
            setForm((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const buildPayload = (): StaffMemberInput => ({
        fullName: form.fullName.trim(),
        teamLevel: form.teamLevel,
        position: form.position.trim(),
        displayOrder: form.displayOrder ? Number(form.displayOrder) : null,
        primaryPhotoUrl: form.primaryPhotoUrl.trim() || null,
        secondaryPhotoUrl: form.secondaryPhotoUrl.trim() || null,
        email: form.email.trim() || null,
        phone: form.phone.trim() || null,
        bio: form.bio.trim() || null,
        active: form.active,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setStatus(null);

        if (!form.fullName.trim() || !form.position.trim()) {
            setError("Full name and position are required.");
            return;
        }

        try {
            setSaving(true);
            const payload = buildPayload();

            if (editingId != null) {
                await adminStaffApi.update(editingId, payload);
                setStatus("Staff member updated.");
            } else {
                await adminStaffApi.create(payload);
                setStatus("Staff member created.");
            }

            const updated = await adminStaffApi.list();
            setStaff(updated);
            resetForm();
        } catch (e) {
            console.error(e);
            setError("Unable to save staff member.");
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (member: StaffMemberDto) => {
        setEditingId(member.id);
        setForm({
            fullName: member.fullName ?? "",
            teamLevel: member.teamLevel,
            position: member.position ?? "",
            displayOrder:
                member.displayOrder != null ? String(member.displayOrder) : "",
            primaryPhotoUrl: member.primaryPhotoUrl ?? "",
            secondaryPhotoUrl: member.secondaryPhotoUrl ?? "",
            email: member.email ?? "",
            phone: member.phone ?? "",
            bio: member.bio ?? "",
            active: member.active ?? true,
        });

        const primaryUrl =
            buildStaffPhotoUrl(member.primaryPhotoUrl) ??
            buildStaffPhotoUrl(member.secondaryPhotoUrl);
        const secondaryUrl = buildStaffPhotoUrl(member.secondaryPhotoUrl);

        setPrimaryPreview(primaryUrl);
        setSecondaryPreview(secondaryUrl);

        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Delete this staff member?")) return;

        try {
            await adminStaffApi.remove(id);
            setStaff((prev) => prev.filter((s) => s.id !== id));
        } catch (e) {
            console.error(e);
            setError("Unable to delete staff member.");
        }
    };

    const handlePhotoUpload = async (
        file: File,
        kind: "primary" | "secondary"
    ) => {
        setError(null);
        setStatus(null);

        try {
            if (kind === "primary") setUploadingPrimary(true);
            else setUploadingSecondary(true);

            const url = await adminStaffApi.uploadPhoto(file);

            // Show instant preview from the local file
            const objectUrl = URL.createObjectURL(file);
            if (kind === "primary") {
                setPrimaryPreview(objectUrl);
                setForm((prev) => ({ ...prev, primaryPhotoUrl: url }));
            } else {
                setSecondaryPreview(objectUrl);
                setForm((prev) => ({ ...prev, secondaryPhotoUrl: url }));
            }
        } catch (e) {
            console.error(e);
            setError("Unable to upload image.");
        } finally {
            if (kind === "primary") setUploadingPrimary(false);
            else setUploadingSecondary(false);
        }
    };

    /* ---------- Auth gate ---------- */

    if (!isCoachLoggedIn) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
                <div className="max-w-md w-full bg-white border border-amber-200 rounded-lg shadow-sm p-4">
                    <p className="text-sm text-amber-900">
                        You must be logged in as a coach to view this page.
                    </p>
                    <button
                        type="button"
                        className="mt-3 text-sm text-sky-600 hover:text-sky-700 underline underline-offset-4"
                        onClick={() => navigate("/login")}
                    >
                        Go to login
                    </button>
                </div>
            </div>
        );
    }

    /* ---------- Render ---------- */

    const staffList = Array.isArray(staff) ? staff : [];

    return (
        <div className="min-h-screen bg-slate-50">
            <header className="border-b border-slate-200 bg-white">
                <div className="max-w-6xl mx-auto px-4 lg:px-0 py-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-[11px] font-semibold tracking-[0.3em] text-slate-500 uppercase">
                            Coach Dashboard
                        </p>
                        <h1 className="mt-1 text-xl sm:text-2xl font-semibold text-slate-900">
                            Program administration
                        </h1>
                        <p className="mt-1 text-xs text-slate-500 max-w-xl">
                            Use the tabs on the right to manage coaching staff, player
                            rosters, game schedules, and teams.
                        </p>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                        {/* Tab toggle */}
                        <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 p-1 text-[11px] font-semibold">
                            {(
                                ["STAFF", "ROSTER", "SCHEDULE", "TEAMS"] as AdminTab[]
                            ).map((tab) => {
                                const isActive = activeTab === tab;
                                let label: string;
                                if (tab === "STAFF") label = "Staff";
                                else if (tab === "ROSTER") label = "Roster";
                                else if (tab === "SCHEDULE") label = "Schedule";
                                else label = "Teams";

                                return (
                                    <button
                                        key={tab}
                                        type="button"
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-3 sm:px-4 py-1.5 rounded-full transition-all ${
                                            isActive
                                                ? "bg-sky-600 text-white shadow-sm"
                                                : "text-slate-600 hover:text-slate-900"
                                        }`}
                                    >
                                        {label}
                                    </button>
                                );
                            })}
                        </div>

                        <button
                            type="button"
                            onClick={logout}
                            className="inline-flex items-center rounded-md border border-slate-300 px-3 py-1.5 text-[11px] text-slate-700 hover:bg-slate-100"
                        >
                            Log out
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 lg:px-0 py-8 space-y-10">
                {error && (
                    <div className="rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-700">
                        {error}
                    </div>
                )}

                {status && (
                    <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-700">
                        {status}
                    </div>
                )}

                {/* TAB: STAFF */}
                {activeTab === "STAFF" && (
                    <>
                        {/* Staff form */}
                        <section className="bg-white border border-slate-200 rounded-lg shadow-sm p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-base font-semibold text-slate-900">
                                    {editingId
                                        ? "Edit staff member"
                                        : "Add new staff member"}
                                </h2>
                                {editingId && (
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        className="text-xs text-sky-600 hover:text-sky-700 underline underline-offset-4"
                                    >
                                        Cancel edit
                                    </button>
                                )}
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="block text-xs font-medium text-slate-700 mb-1">
                                            Full name *
                                        </label>
                                        <input
                                            name="fullName"
                                            value={form.fullName}
                                            onChange={handleChange}
                                            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-slate-700 mb-1">
                                            Position / role *
                                        </label>
                                        <input
                                            name="position"
                                            value={form.position}
                                            onChange={handleChange}
                                            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-3">
                                    <div>
                                        <label className="block text-xs font-medium text-slate-700 mb-1">
                                            Team level
                                        </label>
                                        <select
                                            name="teamLevel"
                                            value={form.teamLevel}
                                            onChange={handleChange}
                                            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                                        >
                                            <option value="NATIONAL">National</option>
                                            <option value="REGIONAL">Regional</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-slate-700 mb-1">
                                            Display order
                                        </label>
                                        <input
                                            name="displayOrder"
                                            type="number"
                                            value={form.displayOrder}
                                            onChange={handleChange}
                                            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                                            placeholder="1"
                                        />
                                        <p className="mt-1 text-[10px] text-slate-500">
                                            Lower numbers appear first.
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-2 mt-6 sm:mt-7">
                                        <input
                                            id="active"
                                            name="active"
                                            type="checkbox"
                                            checked={form.active}
                                            onChange={handleChange}
                                            className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                                        />
                                        <label
                                            htmlFor="active"
                                            className="text-xs font-medium text-slate-700"
                                        >
                                            Active (visible on public site)
                                        </label>
                                    </div>
                                </div>

                                {/* Image upload areas */}
                                <div className="grid gap-6 md:grid-cols-2">
                                    <ImageDropzone
                                        label="Primary photo"
                                        helperText="Main image used on the public staff card."
                                        previewUrl={primaryPreview}
                                        uploading={uploadingPrimary}
                                        onFileSelected={(file) =>
                                            handlePhotoUpload(file, "primary")
                                        }
                                    />

                                    <ImageDropzone
                                        label="Secondary photo (hover)"
                                        helperText="Optional image shown when you hover over the staff card."
                                        previewUrl={secondaryPreview}
                                        uploading={uploadingSecondary}
                                        onFileSelected={(file) =>
                                            handlePhotoUpload(file, "secondary")
                                        }
                                    />
                                </div>

                                {/* Contact + bio */}
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="block text-xs font-medium text-slate-700 mb-1">
                                            Email
                                        </label>
                                        <input
                                            name="email"
                                            type="email"
                                            value={form.email}
                                            onChange={handleChange}
                                            placeholder="coach@buscheacademy.org"
                                            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-slate-700 mb-1">
                                            Phone
                                        </label>
                                        <input
                                            name="phone"
                                            value={form.phone}
                                            onChange={handleChange}
                                            placeholder="+1 (555) 123-4567"
                                            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-slate-700 mb-1">
                                        Bio
                                    </label>
                                    <textarea
                                        name="bio"
                                        rows={4}
                                        value={form.bio}
                                        onChange={handleChange}
                                        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                                        placeholder="Background, coaching experience, and role with the program."
                                    />
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="inline-flex items-center rounded-md bg-sky-600 hover:bg-sky-700 disabled:opacity-60 disabled:cursor-not-allowed text-sm font-semibold text-white px-5 py-2.5 transition-colors"
                                    >
                                        {saving
                                            ? "Saving…"
                                            : editingId
                                                ? "Update staff member"
                                                : "Create staff member"}
                                    </button>
                                </div>
                            </form>
                        </section>

                        {/* Staff list */}
                        <section>
                            <h2 className="text-base font-semibold text-slate-900 mb-4">
                                Current staff
                            </h2>

                            {loading ? (
                                <p className="text-sm text-slate-500">
                                    Loading staff…
                                </p>
                            ) : !staffList.length ? (
                                <p className="text-sm text-slate-500">
                                    No staff members yet. Use the form above to
                                    add your first coach.
                                </p>
                            ) : (
                                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                    {staffList.map((member) => {
                                        const primarySrc =
                                            buildStaffPhotoUrl(
                                                member.primaryPhotoUrl ||
                                                member.secondaryPhotoUrl
                                            ) ?? DEFAULT_AVATAR;

                                        const teamLabel =
                                            member.teamLevel === "NATIONAL"
                                                ? "National Team"
                                                : "Regional Team";

                                        return (
                                            <div
                                                key={member.id}
                                                className="flex flex-col rounded-lg bg-white border border-slate-200 shadow-sm p-4"
                                            >
                                                <div className="flex flex-col items-center text-center flex-1">
                                                    <div className="w-20 h-20 rounded-md overflow-hidden bg-slate-100 mb-3">
                                                        <img
                                                            src={primarySrc}
                                                            alt={member.fullName}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <p className="text-sm font-semibold text-slate-900">
                                                        {member.fullName}
                                                    </p>
                                                    <p className="text-xs text-sky-700 font-medium uppercase tracking-[0.18em] mt-1">
                                                        {member.position}
                                                    </p>
                                                    <p className="text-[11px] text-slate-500 mt-1">
                                                        {teamLabel}
                                                    </p>
                                                    {member.email && (
                                                        <p className="mt-2 text-[11px] text-slate-500">
                                                            {member.email}
                                                        </p>
                                                    )}
                                                    {member.phone && (
                                                        <p className="text-[11px] text-slate-500">
                                                            {member.phone}
                                                        </p>
                                                    )}
                                                    {!member.active && (
                                                        <p className="mt-2 text-[10px] font-semibold text-amber-600">
                                                            Inactive (hidden)
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="mt-4 flex items-center justify-between gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleEdit(member)
                                                        }
                                                        className="flex-1 rounded-md border border-sky-500 text-xs text-sky-700 hover:bg-sky-50 px-3 py-1.5"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDelete(
                                                                member.id
                                                            )
                                                        }
                                                        className="flex-1 rounded-md border border-rose-500 text-xs text-rose-700 hover:bg-rose-50 px-3 py-1.5"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </section>
                    </>
                )}

                {/* TAB: ROSTER */}
                {activeTab === "ROSTER" && <AdminRosterManager />}

                {/* TAB: SCHEDULE */}
                {activeTab === "SCHEDULE" && (
                    <section className="bg-white border border-slate-200 rounded-lg shadow-sm p-6">
                        <AdminScheduleManager />
                    </section>
                )}

                {/* TAB: TEAMS */}
                {activeTab === "TEAMS" && (
                    <section className="bg-white border border-slate-200 rounded-lg shadow-sm p-6">
                        <AdminTeamManager />
                    </section>
                )}
            </main>
        </div>
    );
};

export default AdminDashboardPage;
