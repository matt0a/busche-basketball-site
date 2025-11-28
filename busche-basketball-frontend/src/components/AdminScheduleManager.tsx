import React, { useEffect, useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { publicApi } from "../api/publicApi";
import type { GameDto, HomeAway, TeamDto } from "../types";
import { adminGameApi, type GameInput } from "../api/adminGameApi";

interface GroupedGames {
    dateKey: string;
    dateLabel: string;
    games: GameDto[];
}

type Mode = "CREATE" | "EDIT";

interface GameFormState {
    teamId: number | "";
    opponent: string;
    date: string; // YYYY-MM-DD
    time: string; // HH:MM
    homeAway: HomeAway;
    location: string;
    scoreUs: string;
    scoreThem: string;
    conferenceGame: boolean;
    notes: string;
}

const initialForm: GameFormState = {
    teamId: "",
    opponent: "",
    date: "",
    time: "",
    homeAway: "HOME",
    location: "",
    scoreUs: "",
    scoreThem: "",
    conferenceGame: false,
    notes: "",
};

function parseLocalDateOnly(dateKey: string): Date {
    const [year, month, day] = dateKey.split("-").map(Number);
    return new Date(year, month - 1, day);
}

function groupGamesByDate(games: GameDto[]): GroupedGames[] {
    const sorted = [...games].sort((a, b) =>
        a.gameDateTime.localeCompare(b.gameDateTime)
    );

    const map = new Map<string, GameDto[]>();

    for (const game of sorted) {
        const [datePart] = game.gameDateTime.split("T");
        if (!datePart) continue;
        const list = map.get(datePart) ?? [];
        list.push(game);
        map.set(datePart, list);
    }

    return Array.from(map.entries()).map(([dateKey, gamesForDay]) => {
        const dateObj = parseLocalDateOnly(dateKey);

        const dateLabel = dateObj.toLocaleDateString(undefined, {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
        });
        return { dateKey, dateLabel, games: gamesForDay };
    });
}

const getResultPill = (game: GameDto) => {
    if (game.scoreUs == null || game.scoreThem == null || game.win == null) {
        return null;
    }

    const label = game.win ? "W" : "L";

    const baseClasses =
        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold";
    const colorClasses = game.win
        ? "bg-emerald-100 text-emerald-800"
        : "bg-rose-100 text-rose-800";

    return (
        <span className={`${baseClasses} ${colorClasses}`}>
            {label} {game.scoreUs}–{game.scoreThem}
        </span>
    );
};

export const AdminScheduleManager: React.FC = () => {
    const [teams, setTeams] = useState<TeamDto[]>([]);
    const [games, setGames] = useState<GameDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [status, setStatus] = useState<string | null>(null);

    const [mode, setMode] = useState<Mode>("CREATE");
    const [editingId, setEditingId] = useState<number | null>(null);
    const [form, setForm] = useState<GameFormState>(initialForm);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const [teamsData, gamesData] = await Promise.all([
                    publicApi.getTeams(),
                    adminGameApi.listAll(),
                ]);
                setTeams(teamsData);
                setGames(gamesData);

                if (teamsData.length && form.teamId === "") {
                    setForm((prev) => ({
                        ...prev,
                        teamId: teamsData[0].id,
                    }));
                }
            } catch (e) {
                console.error("Failed to load schedule data", e);
                setError("Unable to load schedule data.");
            } finally {
                setLoading(false);
            }
        };

        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const grouped = useMemo(() => groupGamesByDate(games), [games]);

    const handleInputChange = (
        e: ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => {
        const target = e.target;
        const name = target.name;

        let value: string | boolean;

        if (target instanceof HTMLInputElement && target.type === "checkbox") {
            value = target.checked;
        } else {
            value = target.value;
        }

        setForm((prev) => ({
            ...prev,
            [name]: value as any,
        }));
    };

    const resetForm = (): void => {
        setForm(() => ({
            ...initialForm,
            teamId: teams.length ? teams[0].id : "",
        }));
        setMode("CREATE");
        setEditingId(null);
        setStatus(null);
    };

    const startEdit = (game: GameDto) => {
        const [datePart, timePartRaw] = game.gameDateTime.split("T");
        const timePart = timePartRaw ? timePartRaw.slice(0, 5) : "";

        setForm({
            teamId: game.teamId,
            opponent: game.opponent,
            date: datePart ?? "",
            time: timePart ?? "",
            homeAway: game.homeAway,
            location: game.location,
            scoreUs: game.scoreUs != null ? String(game.scoreUs) : "",
            scoreThem: game.scoreThem != null ? String(game.scoreThem) : "",
            conferenceGame: game.conferenceGame,
            notes: game.notes ?? "",
        });
        setMode("EDIT");
        setEditingId(game.id);
        setStatus("Loaded game into form. Update scores or details, then save.");
    };

    const buildPayload = (): GameInput | null => {
        if (!form.teamId || !form.opponent || !form.date || !form.time || !form.location) {
            setStatus("Please fill in team, opponent, date, time, and location.");
            return null;
        }

        const gameDateTime = `${form.date}T${form.time}:00`;

        return {
            teamId: Number(form.teamId),
            opponent: form.opponent.trim(),
            gameDateTime,
            homeAway: form.homeAway,
            location: form.location.trim(),
            scoreUs: form.scoreUs ? Number(form.scoreUs) : null,
            scoreThem: form.scoreThem ? Number(form.scoreThem) : null,
            conferenceGame: form.conferenceGame,
            notes: form.notes.trim() || null,
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
                const created = await adminGameApi.create(payload);
                setGames((prev) => [...prev, created]);
                setStatus("Game added to schedule.");
                resetForm();
            } else if (mode === "EDIT" && editingId != null) {
                const updated = await adminGameApi.update(editingId, payload);
                setGames((prev) =>
                    prev.map((g) => (g.id === updated.id ? updated : g))
                );
                setStatus(
                    payload.scoreUs != null && payload.scoreThem != null
                        ? "Game updated. Result will now show on the public schedule."
                        : "Game updated."
                );
            }
        } catch (e) {
            console.error("Failed to save game", e);
            setError("Unable to save game. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (game: GameDto) => {
        const ok = window.confirm(
            `Remove this game from the schedule?\n\n${game.teamName} ${game.homeAway === "HOME" ? "vs" : "@"
            } ${game.opponent}`
        );
        if (!ok) return;

        try {
            await adminGameApi.remove(game.id);
            setGames((prev) => prev.filter((g) => g.id !== game.id));
            if (editingId === game.id) {
                resetForm();
            }
        } catch (e) {
            console.error("Failed to delete game", e);
            setError("Unable to delete game.");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h2 className="text-base font-semibold text-slate-900">
                        Schedule management
                    </h2>
                    <p className="mt-1 text-xs text-slate-600">
                        Add or edit games. To update results after a game, load it
                        below, enter scores, and save. W/L is calculated
                        automatically from the scores.
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
                <div className="md:col-span-1 space-y-3">
                    <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                            Team
                        </label>
                        <select
                            name="teamId"
                            value={form.teamId}
                            onChange={handleInputChange}
                            className="block w-full rounded-md border-slate-300 bg-white text-sm shadow-sm focus:border-sky-500 focus:ring-sky-500"
                        >
                            {teams.map((team) => (
                                <option key={team.id} value={team.id}>
                                    {team.name} ({team.level})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                            Opponent
                        </label>
                        <input
                            type="text"
                            name="opponent"
                            value={form.opponent}
                            onChange={handleInputChange}
                            className="block w-full rounded-md border-slate-300 bg-white text-sm shadow-sm focus:border-sky-500 focus:ring-sky-500"
                            placeholder="e.g., St. John’s Prep"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">
                                Date
                            </label>
                            <input
                                type="date"
                                name="date"
                                value={form.date}
                                onChange={handleInputChange}
                                className="block w-full rounded-md border-slate-300 bg-white text-sm shadow-sm focus:border-sky-500 focus:ring-sky-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">
                                Time
                            </label>
                            <input
                                type="time"
                                name="time"
                                value={form.time}
                                onChange={handleInputChange}
                                className="block w-full rounded-md border-slate-300 bg-white text-sm shadow-sm focus:border-sky-500 focus:ring-sky-500"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">
                                Home / Away
                            </label>
                            <select
                                name="homeAway"
                                value={form.homeAway}
                                onChange={handleInputChange}
                                className="block w-full rounded-md border-slate-300 bg-white text-sm shadow-sm focus:border-sky-500 focus:ring-sky-500"
                            >
                                <option value="HOME">Home</option>
                                <option value="AWAY">Away</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">
                                Location
                            </label>
                            <input
                                type="text"
                                name="location"
                                value={form.location}
                                onChange={handleInputChange}
                                className="block w-full rounded-md border-slate-300 bg-white text-sm shadow-sm focus:border-sky-500 focus:ring-sky-500"
                                placeholder="Gym / School name"
                            />
                        </div>
                    </div>
                </div>

                <div className="md:col-span-1 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">
                                Our score
                            </label>
                            <input
                                type="number"
                                name="scoreUs"
                                value={form.scoreUs}
                                onChange={handleInputChange}
                                className="block w-full rounded-md border-slate-300 bg-white text-sm shadow-sm focus:border-sky-500 focus:ring-sky-500"
                                min={0}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">
                                Opponent score
                            </label>
                            <input
                                type="number"
                                name="scoreThem"
                                value={form.scoreThem}
                                onChange={handleInputChange}
                                className="block w-full rounded-md border-slate-300 bg-white text-sm shadow-sm focus:border-sky-500 focus:ring-sky-500"
                                min={0}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            id="conferenceGame"
                            type="checkbox"
                            name="conferenceGame"
                            checked={form.conferenceGame}
                            onChange={handleInputChange}
                            className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                        />
                        <label
                            htmlFor="conferenceGame"
                            className="text-xs text-slate-700"
                        >
                            Conference game
                        </label>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                            Notes (optional)
                        </label>
                        <textarea
                            name="notes"
                            value={form.notes}
                            onChange={handleInputChange}
                            rows={3}
                            className="block w-full rounded-md border-slate-300 bg-white text-sm shadow-sm focus:border-sky-500 focus:ring-sky-500"
                            placeholder="Tournament name, showcase, etc."
                        />
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
                                    ? "Add game"
                                    : "Update game / scores"}
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
                        Tip: To update results, select the game below, enter both
                        scores, and click &quot;Update game / scores&quot;. The
                        public schedule will automatically show W/L.
                    </p>
                </div>
            </form>

            {/* List of games */}
            <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-900">
                    Existing games
                </h3>

                {loading && (
                    <p className="text-xs text-slate-600">
                        Loading existing games…
                    </p>
                )}

                {!loading && grouped.length === 0 && (
                    <p className="text-xs text-slate-600">
                        No games on the schedule yet.
                    </p>
                )}

                {!loading &&
                    grouped.length > 0 &&
                    grouped.map((group) => (
                        <div
                            key={group.dateKey}
                            className="border border-slate-200 rounded-lg overflow-hidden"
                        >
                            <div className="px-3 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                                <span className="text-xs font-semibold text-slate-800">
                                    {group.dateLabel}
                                </span>
                                <span className="text-[11px] text-slate-500">
                                    {group.games.length} game
                                    {group.games.length > 1 ? "s" : ""}
                                </span>
                            </div>
                            <ul className="divide-y divide-slate-100">
                                {group.games.map((game) => (
                                    <li
                                        key={game.id}
                                        className="px-3 py-2 text-xs flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between"
                                    >
                                        <div className="space-y-0.5">
                                            <div className="flex flex-wrap items-center gap-1.5">
                                                <span className="font-semibold text-slate-900">
                                                    {game.teamName}
                                                </span>
                                                <span className="text-[11px] text-slate-500">
                                                    {game.homeAway === "HOME"
                                                        ? "vs"
                                                        : "@"}{" "}
                                                    {game.opponent}
                                                </span>
                                                {game.conferenceGame && (
                                                    <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
                                                        Conf.
                                                    </span>
                                                )}
                                                {getResultPill(game)}
                                            </div>
                                            <p className="text-[11px] text-slate-500">
                                                {game.location}
                                            </p>
                                            {game.notes && (
                                                <p className="text-[11px] text-slate-500">
                                                    {game.notes}
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-2 mt-1 sm:mt-0">
                                            <button
                                                type="button"
                                                onClick={() => startEdit(game)}
                                                className="inline-flex items-center rounded-md border border-slate-300 px-2 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-50"
                                            >
                                                Edit game / scores
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(game)}
                                                className="inline-flex items-center rounded-md border border-rose-300 px-2 py-1 text-[11px] font-medium text-rose-700 hover:bg-rose-50"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
            </div>
        </div>
    );
};
