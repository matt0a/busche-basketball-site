import React, { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import type { TeamDto, TeamLevel } from "../types";
import { adminTeamApi, type TeamInput } from "../api/adminTeamApi";

type Mode = "CREATE" | "EDIT";

interface TeamFormState {
    id: number | null;
    name: string;
    level: TeamLevel;
}

const initialForm: TeamFormState = {
    id: null,
    name: "",
    level: "REGIONAL", // default; must match your TeamLevel enum
};

export const AdminTeamManager: React.FC = () => {
    const [teams, setTeams] = useState<TeamDto[]>([]);
    const [form, setForm] = useState<TeamFormState>(initialForm);
    const [mode, setMode] = useState<Mode>("CREATE");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const data = await adminTeamApi.listAll();
                setTeams(data);
            } catch (e) {
                console.error("Failed to load teams", e);
                setError("Unable to load team list.");
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const resetForm = () => {
        setForm(initialForm);
        setMode("CREATE");
        setStatus(null);
    };

    const startEdit = (team: TeamDto) => {
        setForm({
            id: team.id ?? null,
            name: team.name,
            level: team.level,
        });
        setMode("EDIT");
        setStatus("Loaded team into form. Update name or level, then save.");
    };

    const buildPayload = (): TeamInput | null => {
        if (!form.name.trim()) {
            setStatus("Please enter a team name.");
            return null;
        }

        return {
            name: form.name.trim(),
            level: form.level,
            // If you later expose season/description on the form,
            // you can add them here and to TeamInput.
        };
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setStatus(null);

        const payload = buildPayload();
        if (!payload) return;

        try {
            setSaving(true);

            if (mode === "CREATE") {
                const created = await adminTeamApi.create(payload);
                setTeams((prev) => [...prev, created]);
                setStatus("Team created.");
                resetForm();
            } else if (mode === "EDIT" && form.id != null) {
                const updated = await adminTeamApi.update(form.id, payload);
                setTeams((prev) =>
                    prev.map((t) => (t.id === updated.id ? updated : t))
                );
                setStatus("Team updated.");
            }
        } catch (e) {
            console.error("Failed to save team", e);
            setError("Unable to save team. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (team: TeamDto) => {
        const ok = window.confirm(
            `Delete team "${team.name}"?\n\nThis will not remove any players or games already linked in the database, but the team will no longer be available for new assignments.`
        );
        if (!ok) return;

        try {
            await adminTeamApi.remove(team.id!);
            setTeams((prev) => prev.filter((t) => t.id !== team.id));
            if (form.id === team.id) {
                resetForm();
            }
        } catch (e) {
            console.error("Failed to delete team", e);
            setError("Unable to delete team.");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h2 className="text-base font-semibold text-slate-900">
                        Team management
                    </h2>
                    <p className="mt-1 text-xs text-slate-600">
                        Add or edit teams so the program can grow over future
                        seasons (for example, adding new Regional or National teams).
                    </p>
                </div>
            </div>

            {error && (
                <div className="rounded-md bg-rose-50 border border-rose-200 px-3 py-2 text-xs text-rose-700">
                    {error}
                </div>
            )}

            {/* Form */}
            <form
                onSubmit={handleSubmit}
                className="grid gap-4 md:grid-cols-3 bg-slate-50 border border-slate-200 rounded-lg p-4"
            >
                <div className="md:col-span-2 space-y-3">
                    <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                            Team name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className="block w-full rounded-md border-slate-300 bg-white text-sm shadow-sm focus:border-sky-500 focus:ring-sky-500"
                            placeholder="e.g., Regional Varsity, National Prep"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">
                                Level
                            </label>
                            <select
                                name="level"
                                value={form.level}
                                onChange={handleChange}
                                className="block w-full rounded-md border-slate-300 bg-white text-sm shadow-sm focus:border-sky-500 focus:ring-sky-500"
                            >
                                <option value="REGIONAL">Regional</option>
                                <option value="NATIONAL">National</option>
                                {/* Add more if your TeamLevel enum has them */}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-1 flex flex-col justify-between gap-3">
                    <div className="space-y-2">
                        <button
                            type="submit"
                            disabled={saving || loading}
                            className="inline-flex items-center justify-center rounded-md bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-700 disabled:opacity-60 disabled:cursor-not-allowed w-full"
                        >
                            {saving
                                ? "Saving…"
                                : mode === "CREATE"
                                    ? "Add team"
                                    : "Update team"}
                        </button>
                        {mode === "EDIT" && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="inline-flex items-center justify-center rounded-md border border-slate-300 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 w-full"
                            >
                                Cancel edit
                            </button>
                        )}
                    </div>

                    {status && (
                        <p className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md px-3 py-2">
                            {status}
                        </p>
                    )}

                    <p className="text-[11px] text-slate-500">
                        Tip: Teams created here will appear anywhere the program
                        selects a team (for example, when adding games to the schedule).
                    </p>
                </div>
            </form>

            {/* Existing teams list */}
            <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-900">
                    Existing teams
                </h3>

                {loading && (
                    <p className="text-xs text-slate-600">
                        Loading teams…
                    </p>
                )}

                {!loading && teams.length === 0 && (
                    <p className="text-xs text-slate-600">
                        No teams found. Add your first team above.
                    </p>
                )}

                {!loading && teams.length > 0 && (
                    <div className="border border-slate-200 rounded-lg overflow-hidden">
                        <ul className="divide-y divide-slate-100">
                            {teams.map((team) => (
                                <li
                                    key={team.id}
                                    className="px-3 py-2 text-xs flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between"
                                >
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-slate-900">
                                                {team.name}
                                            </span>
                                            <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-700">
                                                {team.level === "REGIONAL"
                                                    ? "Regional"
                                                    : "National"}
                                            </span>
                                            {team.season && (
                                                <span className="inline-flex items-center rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-medium text-sky-700">
                                                    {team.season}
                                                </span>
                                            )}
                                        </div>
                                        {team.description && (
                                            <p className="text-[11px] text-slate-500 mt-0.5">
                                                {team.description}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2 mt-1 sm:mt-0">
                                        <button
                                            type="button"
                                            onClick={() => startEdit(team)}
                                            className="inline-flex items-center rounded-md border border-slate-300 px-2 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-50"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(team)}
                                            className="inline-flex items-center rounded-md border border-rose-300 px-2 py-1 text-[11px] font-medium text-rose-700 hover:bg-rose-50"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};
