// src/components/AdminRosterManager.tsx
import React, { useEffect, useRef, useState } from "react";
import { publicApi } from "../api/publicApi";
import { adminPlayerApi, type PlayerInput } from "../api/adminPlayerApi";
import type { PlayerDto, TeamDto } from "../types";

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

function buildPlayerPhotoUrl(path: string | null | undefined): string | null {
    if (!path) return null;
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    if (path.startsWith("/")) return `${API_BASE_URL}${path}`;
    return `${API_BASE_URL}/${path}`;
}

/* ---------- Types ---------- */

interface PlayerFormValues {
    teamId: string;
    firstName: string;
    lastName: string;
    jerseyNumber: string;
    position: string;
    height: string;
    gradYear: string;
    country: string;
    photoUrl: string;
}

interface ImageDropzoneProps {
    label: string;
    helperText?: string;
    previewUrl: string | null;
    uploading: boolean;
    onFileSelected: (file: File) => void;
}

/* ---------- Image dropzone (like staff) ---------- */

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
            <p className="text-xs font-medium text-slate-700">{label}</p>
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
                        alt="Player preview"
                        className="h-24 w-24 rounded-md object-cover mb-3 border border-slate-200 bg-white"
                    />
                ) : (
                    <div className="h-24 w-24 rounded-md bg-white flex items-center justify-center mb-3 border border-slate-200">
                        <svg
                            className="h-10 w-10 text-slate-400"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >
                            <path
                                d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
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

/* ---------- Main admin roster manager ---------- */

export const AdminRosterManager: React.FC = () => {
    // teams
    const [teams, setTeams] = useState<TeamDto[]>([]);
    const [teamsLoading, setTeamsLoading] = useState(true);
    const [teamsError, setTeamsError] = useState<string | null>(null);

    // admin-player state
    const [adminSelectedTeamId, setAdminSelectedTeamId] = useState<number | null>(
        null
    );
    const [adminPlayers, setAdminPlayers] = useState<PlayerDto[]>([]);
    const [adminLoading, setAdminLoading] = useState(false);
    const [adminError, setAdminError] = useState<string | null>(null);

    const [editingPlayerId, setEditingPlayerId] = useState<number | null>(null);
    const [saving, setSaving] = useState(false);

    const [formValues, setFormValues] = useState<PlayerFormValues>({
        teamId: "",
        firstName: "",
        lastName: "",
        jerseyNumber: "",
        position: "",
        height: "",
        gradYear: "",
        country: "",
        photoUrl: "",
    });

    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [uploadingPhoto, setUploadingPhoto] = useState(false);

    /* ---------- Load teams ---------- */

    useEffect(() => {
        let isMounted = true;

        (async () => {
            try {
                setTeamsLoading(true);
                setTeamsError(null);
                const data = await publicApi.getTeams();
                if (!isMounted) return;
                setTeams(data);

                // default team selection
                if (data.length && adminSelectedTeamId == null) {
                    const defaultId = data[0].id;
                    setAdminSelectedTeamId(defaultId);
                    setFormValues((prev) => ({
                        ...prev,
                        teamId: String(defaultId),
                    }));
                }
            } catch (e) {
                console.error(e);
                if (isMounted) {
                    setTeamsError("Unable to load teams.");
                }
            } finally {
                if (isMounted) setTeamsLoading(false);
            }
        })();

        return () => {
            isMounted = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /* ---------- Load players for selected team ---------- */

    useEffect(() => {
        if (adminSelectedTeamId == null) return;

        let isMounted = true;

        (async () => {
            try {
                setAdminLoading(true);
                setAdminError(null);
                const list = await adminPlayerApi.listByTeam(adminSelectedTeamId);
                if (!isMounted) return;
                setAdminPlayers(list);
            } catch (e) {
                console.error(e);
                if (isMounted) {
                    setAdminError("Unable to load players for this team.");
                }
            } finally {
                if (isMounted) setAdminLoading(false);
            }
        })();

        return () => {
            isMounted = false;
        };
    }, [adminSelectedTeamId]);

    /* ---------- Handlers ---------- */

    const handleFormChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormValues((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (name === "teamId") {
            const id = value ? Number(value) : null;
            setAdminSelectedTeamId(id);
            setEditingPlayerId(null);
            setAdminPlayers([]); // clear list until reload
        }
    };

    const resetForm = () => {
        const defaultTeamId =
            adminSelectedTeamId ?? (teams.length ? teams[0].id : null);
        setEditingPlayerId(null);
        setPhotoPreview(null);
        setFormValues({
            teamId: defaultTeamId ? String(defaultTeamId) : "",
            firstName: "",
            lastName: "",
            jerseyNumber: "",
            position: "",
            height: "",
            gradYear: "",
            country: "",
            photoUrl: "",
        });
    };

    const handleEditPlayer = (player: PlayerDto) => {
        setEditingPlayerId(player.id);
        setAdminSelectedTeamId(player.teamId);
        setFormValues({
            teamId: String(player.teamId),
            firstName: player.firstName,
            lastName: player.lastName,
            jerseyNumber: player.jerseyNumber?.toString() ?? "",
            position: player.position ?? "",
            height: player.height ?? "",
            gradYear: player.gradYear?.toString() ?? "",
            country: player.country ?? "",
            photoUrl: player.photoUrl ?? "",
        });

        const src = buildPlayerPhotoUrl(player.photoUrl);
        setPhotoPreview(src);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDeletePlayer = async (player: PlayerDto) => {
        const confirm = window.confirm(
            `Remove ${player.firstName} ${player.lastName} from the roster?`
        );
        if (!confirm) return;

        try {
            setSaving(true);
            await adminPlayerApi.remove(player.id);
            if (adminSelectedTeamId != null) {
                const list = await adminPlayerApi.listByTeam(adminSelectedTeamId);
                setAdminPlayers(list);
            }
        } catch (e) {
            console.error(e);
            alert("Unable to delete player. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    const handlePhotoUpload = async (file: File) => {
        try {
            setUploadingPhoto(true);
            // backend returns a URL string
            const url = await adminPlayerApi.uploadPhoto(file);

            const localPreview = URL.createObjectURL(file);
            setPhotoPreview(localPreview);
            setFormValues((prev) => ({
                ...prev,
                photoUrl: url,
            }));
        } catch (e) {
            console.error(e);
            alert("Unable to upload photo. Please try again.");
        } finally {
            setUploadingPhoto(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formValues.teamId) {
            alert("Please select a team.");
            return;
        }

        const payload: PlayerInput = {
            teamId: Number(formValues.teamId),
            firstName: formValues.firstName.trim(),
            lastName: formValues.lastName.trim(),
            jerseyNumber: formValues.jerseyNumber
                ? Number(formValues.jerseyNumber)
                : null,
            position: formValues.position.trim() || null,
            height: formValues.height.trim() || null,
            gradYear: formValues.gradYear ? Number(formValues.gradYear) : null,
            country: formValues.country.trim() || null,
            photoUrl: formValues.photoUrl.trim() || null,
        };

        try {
            setSaving(true);

            if (editingPlayerId) {
                await adminPlayerApi.update(editingPlayerId, payload);
            } else {
                await adminPlayerApi.create(payload);
            }

            const currentTeamId = Number(formValues.teamId);
            setAdminSelectedTeamId(currentTeamId);
            const list = await adminPlayerApi.listByTeam(currentTeamId);
            setAdminPlayers(list);

            resetForm();
        } catch (e) {
            console.error(e);
            alert("Unable to save player. Please check the form and try again.");
        } finally {
            setSaving(false);
        }
    };

    /* ---------- Render ---------- */

    return (
        <section className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 sm:p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <div>
                    <h2 className="text-sm font-semibold text-slate-900">
                        Admin: Manage Roster
                    </h2>
                    <p className="text-xs text-slate-600 mt-1 max-w-xl">
                        Add, edit, or remove players. Changes appear on the public roster
                        once saved.
                    </p>
                    {teamsError && (
                        <p className="mt-1 text-[11px] text-rose-500">{teamsError}</p>
                    )}
                    {!teamsLoading && !teams.length && (
                        <p className="mt-1 text-[11px] text-amber-600">
                            No teams found yet. Create National / Regional teams in the
                            backend so you can assign players to them.
                        </p>
                    )}
                </div>

                <button
                    type="button"
                    onClick={resetForm}
                    className="self-start inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-3 py-1.5 text-[11px] font-medium text-slate-700 hover:border-sky-400 hover:text-sky-700 transition-colors"
                >
                    Clear form
                </button>
            </div>

            <div className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="space-y-4 bg-white rounded-xl border border-slate-200 p-4"
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-700">
                                Team
                            </label>
                            <select
                                name="teamId"
                                value={formValues.teamId}
                                onChange={handleFormChange}
                                className="w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white"
                            >
                                {/* placeholder */}
                                <option value="" className="text-slate-400">
                                    Select team
                                </option>

                                {/* real teams */}
                                {teams.map((team) => (
                                    <option
                                        key={team.id}
                                        value={team.id}
                                        className="text-slate-900"
                                    >
                                        {team.name}{" "}
                                        {team.level === "NATIONAL" ? "(National)" : "(Regional)"}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-700">
                                Jersey #
                            </label>
                            <input
                                type="number"
                                name="jerseyNumber"
                                value={formValues.jerseyNumber}
                                onChange={handleFormChange}
                                className="w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                                placeholder="Optional"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-700">
                                First name
                            </label>
                            <input
                                type="text"
                                name="firstName"
                                value={formValues.firstName}
                                onChange={handleFormChange}
                                className="w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                                required
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-700">
                                Last name
                            </label>
                            <input
                                type="text"
                                name="lastName"
                                value={formValues.lastName}
                                onChange={handleFormChange}
                                className="w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                                required
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-700">
                                Position
                            </label>
                            <input
                                type="text"
                                name="position"
                                value={formValues.position}
                                onChange={handleFormChange}
                                className="w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                                placeholder="G / F / C etc."
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-700">
                                Height
                            </label>
                            <input
                                type="text"
                                name="height"
                                value={formValues.height}
                                onChange={handleFormChange}
                                className="w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                                placeholder='e.g. 6&apos;2"'
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-700">
                                Grad year
                            </label>
                            <input
                                type="number"
                                name="gradYear"
                                value={formValues.gradYear}
                                onChange={handleFormChange}
                                className="w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                                placeholder="YYYY"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-700">
                                Country
                            </label>
                            <input
                                type="text"
                                name="country"
                                value={formValues.country}
                                onChange={handleFormChange}
                                className="w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                                placeholder="Optional"
                            />
                        </div>

                        {/* Photo upload */}
                        <div className="sm:col-span-2">
                            <ImageDropzone
                                label="Player photo"
                                helperText="This will automatically set the player's photo URL."
                                previewUrl={photoPreview}
                                uploading={uploadingPhoto}
                                onFileSelected={handlePhotoUpload}
                            />
                            <p className="mt-1 text-[11px] text-slate-500">
                                Stored URL:{" "}
                                <span className="font-mono break-all">
                  {formValues.photoUrl || "—"}
                </span>
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-2">
                        {editingPlayerId ? (
                            <p className="text-[11px] text-slate-500">
                                Editing player ID {editingPlayerId}
                            </p>
                        ) : (
                            <p className="text-[11px] text-slate-500">
                                Fill out the form then click Save to add a player.
                            </p>
                        )}
                        <button
                            type="submit"
                            disabled={saving}
                            className="inline-flex items-center justify-center rounded-full bg-sky-600 px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-sky-700 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {saving
                                ? "Saving…"
                                : editingPlayerId
                                    ? "Update player"
                                    : "Save player"}
                        </button>
                    </div>
                </form>

                {/* Existing players list */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xs font-semibold tracking-[0.2em] uppercase text-slate-700">
                            Current players
                        </h3>
                        {adminLoading && (
                            <p className="text-[11px] text-slate-500">Loading…</p>
                        )}
                    </div>

                    {adminError && (
                        <p className="text-xs text-rose-500">{adminError}</p>
                    )}

                    {!adminLoading && !adminError && (
                        <>
                            {!adminPlayers.length ? (
                                <p className="text-xs text-slate-500">
                                    No players listed for this team yet.
                                </p>
                            ) : (
                                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                                    {adminPlayers.map((p) => (
                                        <div
                                            key={p.id}
                                            className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 text-[11px]"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="h-9 w-9 rounded-full overflow-hidden bg-slate-100">
                                                    {p.photoUrl ? (
                                                        <img
                                                            src={buildPlayerPhotoUrl(p.photoUrl) ?? undefined}
                                                            alt={`${p.firstName} ${p.lastName}`}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400">
                                                            No photo
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-900">
                                                        #{p.jerseyNumber ?? "—"} {p.firstName} {p.lastName}
                                                    </p>
                                                    <p className="text-slate-500">
                                                        {p.position || "Player"}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => handleEditPlayer(p)}
                                                    className="rounded-full border border-sky-500 px-3 py-1 text-[10px] font-semibold text-sky-700 hover:bg-sky-50"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeletePlayer(p)}
                                                    className="rounded-full border border-rose-400 px-3 py-1 text-[10px] font-semibold text-rose-600 hover:bg-rose-50"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </section>
    );
};

export default AdminRosterManager;
