import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import type { StaffMemberDto, TeamLevel } from "../types";
import { useAuth } from "../auth/AuthContext";
import { adminStaffApi } from "../api/adminStaffApi";
import type { StaffMemberInput } from "../api/adminStaffApi";
import { AdminRosterManager } from "../components/AdminRosterManager";
import { AdminScheduleManager } from "../components/AdminScheduleManager";
import { AdminTeamManager } from "../components/AdminTeamManager";
import { AdminDocumentManager } from "../components/AdminDocumentManager";
import { clearStaffCache } from "../lib/ttlCache";

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
    adminStaff: boolean;
    staffCategory: string;
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
    adminStaff: false,
    staffCategory: "",
};

interface ImageDropzoneProps {
    label: string;
    helperText?: string;
    previewUrl: string | null;
    uploading: boolean;
    onFileSelected: (file: File) => void;
}

type AdminTab = "STAFF" | "ROSTER" | "SCHEDULE" | "TEAMS" | "DOCUMENTS";

/* ---------- Image dropzone ---------- */

const ImageDropzone = ({
    label,
    helperText,
    previewUrl,
    uploading,
    onFileSelected,
}: ImageDropzoneProps) => {
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

export const AdminDashboardPage = () => {
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const [staff, setStaff] = useState<StaffMemberDto[]>([]);
    const [selectedStaffMember, setSelectedStaffMember] = useState<StaffMemberDto | null>(null);
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
        teamLevel: form.staffCategory === "BASKETBALL" ? form.teamLevel : null,
        position: form.position.trim(),
        displayOrder: form.displayOrder ? Number(form.displayOrder) : null,
        primaryPhotoUrl: form.primaryPhotoUrl.trim() || null,
        secondaryPhotoUrl: form.secondaryPhotoUrl.trim() || null,
        email: form.email.trim() || null,
        phone: form.phone.trim() || null,
        bio: form.bio.trim() || null,
        active: form.active,
        adminStaff: form.adminStaff,
        staffCategory: (form.staffCategory as StaffMemberInput["staffCategory"]) || undefined,
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

            clearStaffCache();
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
            teamLevel: member.teamLevel ?? "NATIONAL",
            position: member.position ?? "",
            displayOrder:
                member.displayOrder != null ? String(member.displayOrder) : "",
            primaryPhotoUrl: member.primaryPhotoUrl ?? "",
            secondaryPhotoUrl: member.secondaryPhotoUrl ?? "",
            email: member.email ?? "",
            phone: member.phone ?? "",
            bio: member.bio ?? "",
            active: member.active ?? true,
            adminStaff: member.adminStaff ?? false,
            staffCategory: member.staffCategory ?? "",
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
            clearStaffCache();
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
                                ["STAFF", "ROSTER", "SCHEDULE", "TEAMS", "DOCUMENTS"] as AdminTab[]
                            ).map((tab) => {
                                const isActive = activeTab === tab;
                                let label: string;
                                if (tab === "STAFF") label = "Staff";
                                else if (tab === "ROSTER") label = "Roster";
                                else if (tab === "SCHEDULE") label = "Schedule";
                                else if (tab === "TEAMS") label = "Teams";
                                else label = "Documents";

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

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="block text-xs font-medium text-slate-700 mb-1">
                                            Category
                                        </label>
                                        <select
                                            name="staffCategory"
                                            value={form.staffCategory}
                                            onChange={handleChange}
                                            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                                        >
                                            <option value="" disabled>
                                                — Select Category —
                                            </option>
                                            <option value="BASKETBALL">Basketball Program</option>
                                            <option value="ACADEMIC">Academic Faculty</option>
                                            <option value="DINING">Dining Services</option>
                                            <option value="FACILITIES">Facilities</option>
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
                                </div>

                                {form.staffCategory === "BASKETBALL" && (
                                    <div className="max-w-xs">
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
                                )}

                                <div className="flex flex-wrap items-center gap-6">
                                    <div className="flex items-center gap-2">
                                        <input
                                            id="active"
                                            name="active"
                                            type="checkbox"
                                            checked={form.active}
                                            onChange={handleChange}
                                            className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                                        />
                                        <label htmlFor="active" className="text-xs font-medium text-slate-700">
                                            Active (visible on public site)
                                        </label>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input
                                            id="adminStaff"
                                            name="adminStaff"
                                            type="checkbox"
                                            checked={form.adminStaff}
                                            onChange={handleChange}
                                            className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                                        />
                                        <label htmlFor="adminStaff" className="text-xs font-medium text-slate-700">
                                            Admin staff (appears in admin section on faculty page)
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
                                                : member.teamLevel === "REGIONAL"
                                                    ? "Regional Team"
                                                    : null;

                                        return (
                                            <div
                                                key={member.id}
                                                onClick={() => setSelectedStaffMember(member)}
                                                className="flex flex-col rounded-lg bg-white border border-slate-200 shadow-sm p-4 cursor-pointer hover:border-sky-300 hover:shadow-md transition-all"
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
                                                    {teamLabel && (
                                                        <p className="text-[11px] text-slate-500 mt-1">
                                                            {teamLabel}
                                                        </p>
                                                    )}
                                                    {member.staffCategory && (
                                                        <p className="text-[11px] text-slate-400 mt-0.5">
                                                            {member.staffCategory}
                                                        </p>
                                                    )}
                                                    {member.adminStaff && (
                                                        <span className="mt-1.5 inline-block text-[10px] font-semibold text-sky-700 bg-sky-50 border border-sky-200 rounded px-1.5 py-0.5">
                                                            Admin Staff
                                                        </span>
                                                    )}
                                                    {!member.active && (
                                                        <p className="mt-1 text-[10px] font-semibold text-amber-600">
                                                            Inactive (hidden)
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="mt-4 flex items-center justify-between gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={(e) => { e.stopPropagation(); handleEdit(member); }}
                                                        className="flex-1 rounded-md border border-sky-500 text-xs text-sky-700 hover:bg-sky-50 px-3 py-1.5"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={(e) => { e.stopPropagation(); handleDelete(member.id); }}
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

                {/* TAB: DOCUMENTS */}
                {activeTab === "DOCUMENTS" && (
                    <div className="space-y-6">
                        <AdminDocumentManager />
                    </div>
                )}
            </main>

            {/* Staff detail modal */}
            {selectedStaffMember && (() => {
                const m = selectedStaffMember;
                const photoSrc = buildStaffPhotoUrl(m.primaryPhotoUrl || m.secondaryPhotoUrl) ?? DEFAULT_AVATAR;
                const categoryLabel: Record<string, string> = {
                    BASKETBALL: "Basketball Program",
                    ACADEMIC: "Academic Faculty",
                    DINING: "Dining Services",
                    ADMINISTRATION: "Administration",
                    FACILITIES: "Facilities",
                };
                return (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 py-6"
                        onClick={() => setSelectedStaffMember(null)}
                    >
                        <div
                            className="relative max-w-md w-full max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-start gap-4 p-6 border-b border-slate-100">
                                <div className="w-20 h-20 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                                    <img src={photoSrc} alt={m.fullName} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-slate-900 text-base">{m.fullName}</p>
                                    <p className="text-xs text-sky-700 font-semibold uppercase tracking-wide mt-0.5">{m.position}</p>
                                    {m.staffCategory && (
                                        <p className="text-xs text-slate-500 mt-1">{categoryLabel[m.staffCategory] ?? m.staffCategory}</p>
                                    )}
                                    {m.teamLevel && (
                                        <p className="text-xs text-slate-400 mt-0.5">{m.teamLevel === "NATIONAL" ? "National Team" : "Regional Team"}</p>
                                    )}
                                    {m.adminStaff && (
                                        <span className="mt-1 inline-block text-[10px] font-semibold text-sky-700 bg-sky-50 border border-sky-200 rounded px-1.5 py-0.5">
                                            Admin Staff
                                        </span>
                                    )}
                                    {!m.active && (
                                        <span className="mt-1 inline-block text-[10px] font-semibold text-amber-600 bg-amber-50 border border-amber-200 rounded px-1.5 py-0.5">
                                            Inactive
                                        </span>
                                    )}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setSelectedStaffMember(null)}
                                    className="shrink-0 w-7 h-7 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {(m.email || m.phone) && (
                                <div className="px-6 py-4 border-b border-slate-100 space-y-2">
                                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Contact</p>
                                    {m.email && (
                                        <a href={`mailto:${m.email}`} className="flex items-center gap-2 text-sm text-slate-700 hover:text-sky-600 transition-colors">
                                            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                            {m.email}
                                        </a>
                                    )}
                                    {m.phone && (
                                        <p className="flex items-center gap-2 text-sm text-slate-700">
                                            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                            {m.phone}
                                        </p>
                                    )}
                                </div>
                            )}

                            <div className="px-6 py-4">
                                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Bio</p>
                                {m.bio ? (
                                    <p className="text-sm text-slate-600 leading-relaxed">{m.bio}</p>
                                ) : (
                                    <p className="text-sm text-slate-400 italic">Bio coming soon.</p>
                                )}
                            </div>

                            <div className="px-6 pb-6 flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => { setSelectedStaffMember(null); handleEdit(m); }}
                                    className="flex-1 rounded-md border border-sky-500 text-xs text-sky-700 hover:bg-sky-50 px-3 py-2"
                                >
                                    Edit
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setSelectedStaffMember(null); handleDelete(m.id); }}
                                    className="flex-1 rounded-md border border-rose-500 text-xs text-rose-700 hover:bg-rose-50 px-3 py-2"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })()}
        </div>
    );
};

export default AdminDashboardPage;
