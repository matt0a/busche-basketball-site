import React, { useEffect, useMemo, useState } from "react";
import { publicApi } from "../api/publicApi";
import type { GameDto, TeamDto, TeamLevel } from "../types";

interface GroupedGames {
    dateKey: string;
    dateLabel: string;
    games: GameDto[];
}

type TeamFilter = "ALL" | "REGIONAL" | "NATIONAL";

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

const formatTime = (iso: string) => {
    const [datePart, timePart] = iso.split("T");
    if (!timePart || !datePart) return "";
    const [h, m] = timePart.split(":");
    if (!h || !m) return "";

    const dateObj = new Date(
        Number(datePart.slice(0, 4)),
        Number(datePart.slice(5, 7)) - 1,
        Number(datePart.slice(8, 10)),
        Number(h),
        Number(m)
    );

    return dateObj.toLocaleTimeString(undefined, {
        hour: "numeric",
        minute: "2-digit",
    });
};

const getMatchupLabel = (game: GameDto) =>
    game.homeAway === "HOME" ? `vs ${game.opponent}` : `@ ${game.opponent}`;

const getResultPill = (game: GameDto) => {
    if (game.scoreUs == null || game.scoreThem == null || game.win == null) {
        return null;
    }

    const label = game.win ? "W" : "L";

    const baseClasses =
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold";
    const colorClasses = game.win
        ? "bg-emerald-100 text-emerald-800"
        : "bg-rose-100 text-rose-800";

    return (
        <span className={`${baseClasses} ${colorClasses}`}>
            {label} {game.scoreUs}–{game.scoreThem}
        </span>
    );
};

const isPastGame = (game: GameDto): boolean => {
    const [datePart, timePart] = game.gameDateTime.split("T");
    if (!datePart || !timePart) return false;
    const [h, m] = timePart.split(":");
    if (!h || !m) return false;

    const dt = new Date(
        Number(datePart.slice(0, 4)),
        Number(datePart.slice(5, 7)) - 1,
        Number(datePart.slice(8, 10)),
        Number(h),
        Number(m)
    );

    return dt < new Date();
};

export const SchedulePage: React.FC = () => {
    const [games, setGames] = useState<GameDto[]>([]);
    const [teams, setTeams] = useState<TeamDto[]>([]);
    const [teamFilter, setTeamFilter] = useState<TeamFilter>("ALL");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const [gamesData, teamsData] = await Promise.all([
                    publicApi.getFullSchedule(),
                    publicApi.getTeams(),
                ]);
                setGames(gamesData);
                setTeams(teamsData);
            } catch (e) {
                console.error("Failed to load schedule", e);
                setError("Unable to load the schedule right now.");
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    const teamLevelById = useMemo(() => {
        const map: Record<number, TeamLevel> = {};
        for (const t of teams) {
            map[t.id] = t.level;
        }
        return map;
    }, [teams]);

    const filteredGames = useMemo(() => {
        if (teamFilter === "ALL") return games;

        return games.filter((g) => {
            const level = teamLevelById[g.teamId];
            if (!level) return false;
            return level === teamFilter;
        });
    }, [games, teamFilter, teamLevelById]);

    const upcomingGroups = useMemo(
        () => groupGamesByDate(filteredGames.filter((g) => !isPastGame(g))),
        [filteredGames]
    );

    const pastGroups = useMemo(
        () =>
            groupGamesByDate(filteredGames.filter((g) => isPastGame(g))).reverse(),
        [filteredGames]
    );

    return (
        <div className="max-w-5xl mx-auto px-4 py-10">
            <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                        Game Schedule
                    </h1>
                    <p className="mt-2 text-sm text-slate-600 max-w-2xl">
                        View upcoming and recent games for Busche Academy basketball.
                        Use the filters to switch between Regional, National, or the
                        full program.
                    </p>
                </div>

                {/* Filter pill buttons */}
                <div className="inline-flex items-center rounded-full bg-slate-100 p-1 text-xs font-medium">
                    {(["ALL", "REGIONAL", "NATIONAL"] as TeamFilter[]).map(
                        (value) => {
                            const isActive = teamFilter === value;
                            const label =
                                value === "ALL"
                                    ? "All teams"
                                    : value === "REGIONAL"
                                        ? "Regional"
                                        : "National";

                            return (
                                <button
                                    key={value}
                                    type="button"
                                    onClick={() => setTeamFilter(value)}
                                    className={[
                                        "px-3 py-1 rounded-full transition-colors",
                                        isActive
                                            ? "bg-white text-slate-900 shadow-sm"
                                            : "text-slate-600 hover:text-slate-900",
                                    ].join(" ")}
                                >
                                    {label}
                                </button>
                            );
                        }
                    )}
                </div>
            </header>

            {loading && (
                <p className="text-sm text-slate-600">Loading schedule…</p>
            )}

            {error && (
                <p className="text-sm text-rose-600 mb-4">{error}</p>
            )}

            {!loading && !error && games.length === 0 && (
                <p className="text-sm text-slate-600">
                    No games have been posted yet. Check back soon.
                </p>
            )}

            {!loading && !error && games.length > 0 && (
                <div className="space-y-10">
                    {/* Upcoming */}
                    <section>
                        <div className="flex items-baseline justify-between mb-3">
                            <h2 className="text-lg font-semibold text-slate-900">
                                Upcoming games
                            </h2>
                            {upcomingGroups.length > 0 && (
                                <span className="text-[11px] uppercase tracking-wide text-slate-500 font-semibold">
                                    {upcomingGroups.reduce(
                                        (sum, g) => sum + g.games.length,
                                        0
                                    )}{" "}
                                    games scheduled
                                </span>
                            )}
                        </div>

                        {upcomingGroups.length === 0 ? (
                            <p className="text-sm text-slate-600">
                                No upcoming games for this team selection.
                            </p>
                        ) : (
                            <div className="space-y-6">
                                {upcomingGroups.map((group) => (
                                    <section
                                        key={group.dateKey}
                                        className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden"
                                    >
                                        <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
                                            <div>
                                                <p className="text-[11px] font-semibold uppercase tracking-wide text-sky-700">
                                                    Game day
                                                </p>
                                                <h3 className="text-lg font-semibold text-slate-900">
                                                    {group.dateLabel}
                                                </h3>
                                            </div>
                                        </div>

                                        <ul className="divide-y divide-slate-100">
                                            {group.games.map((game) => (
                                                <li
                                                    key={game.id}
                                                    className="px-4 py-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
                                                >
                                                    <div>
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <span className="text-sm font-semibold text-slate-900">
                                                                {getMatchupLabel(game)}
                                                            </span>
                                                            <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700">
                                                                {game.teamName}
                                                            </span>
                                                            {game.conferenceGame && (
                                                                <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-800">
                                                                    Conference
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="mt-1 text-xs text-slate-600">
                                                            {game.location}
                                                        </p>
                                                        {game.notes && (
                                                            <p className="mt-1 text-xs text-slate-500">
                                                                {game.notes}
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div className="flex flex-col items-start sm:items-end gap-1 text-sm">
                                                        <span className="font-medium text-slate-900">
                                                            {formatTime(game.gameDateTime)}
                                                        </span>
                                                        <span className="text-xs text-slate-500">
                                                            Score TBA
                                                        </span>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </section>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* Results */}
                    <section>
                        <div className="flex items-baseline justify-between mb-3">
                            <h2 className="text-lg font-semibold text-slate-900">
                                Results
                            </h2>
                            {pastGroups.length > 0 && (
                                <span className="text-[11px] uppercase tracking-wide text-slate-500 font-semibold">
                                    {pastGroups.reduce(
                                        (sum, g) => sum + g.games.length,
                                        0
                                    )}{" "}
                                    games played
                                </span>
                            )}
                        </div>

                        {pastGroups.length === 0 ? (
                            <p className="text-sm text-slate-600">
                                No completed games yet for this team selection.
                            </p>
                        ) : (
                            <div className="space-y-6">
                                {pastGroups.map((group) => (
                                    <section
                                        key={group.dateKey}
                                        className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden"
                                    >
                                        <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
                                            <div>
                                                <p className="text-[11px] font-semibold uppercase tracking-wide text-sky-700">
                                                    Game day
                                                </p>
                                                <h3 className="text-lg font-semibold text-slate-900">
                                                    {group.dateLabel}
                                                </h3>
                                            </div>
                                        </div>

                                        <ul className="divide-y divide-slate-100">
                                            {group.games.map((game) => (
                                                <li
                                                    key={game.id}
                                                    className="px-4 py-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
                                                >
                                                    <div>
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <span className="text-sm font-semibold text-slate-900">
                                                                {getMatchupLabel(game)}
                                                            </span>
                                                            <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700">
                                                                {game.teamName}
                                                            </span>
                                                            {game.conferenceGame && (
                                                                <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-800">
                                                                    Conference
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="mt-1 text-xs text-slate-600">
                                                            {game.location}
                                                        </p>
                                                        {game.notes && (
                                                            <p className="mt-1 text-xs text-slate-500">
                                                                {game.notes}
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div className="flex flex-col items-start sm:items-end gap-1 text-sm">
                                                        <span className="font-medium text-slate-900">
                                                            {formatTime(game.gameDateTime)}
                                                        </span>
                                                        {getResultPill(game) ?? (
                                                            <span className="text-xs text-slate-500">
                                                                Score TBA
                                                            </span>
                                                        )}
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </section>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            )}
        </div>
    );
};
