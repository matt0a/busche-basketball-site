import React, { useEffect, useMemo, useState } from "react";
import { publicApi } from "../api/publicApi";
import type { GameDto, TeamDto, TeamLevel } from "../types";

type TeamFilter = "ALL" | "REGIONAL" | "NATIONAL";
type ViewTab = "upcoming" | "results";

function parseLocalDateOnly(dateKey: string): Date {
    const [year, month, day] = dateKey.split("-").map(Number);
    return new Date(year, month - 1, day);
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

const formatDate = (iso: string) => {
    const [datePart] = iso.split("T");
    if (!datePart) return "";
    const dateObj = parseLocalDateOnly(datePart);
    return dateObj.toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
    });
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

interface GameCardProps {
    game: GameDto;
    isResult?: boolean;
}

const GameCard: React.FC<GameCardProps> = ({ game, isResult }) => {
    const isHome = game.homeAway === "HOME";
    const hasScore = game.scoreUs != null && game.scoreThem != null;
    const isWin = game.win === true;
    const isLoss = game.win === false;

    return (
        <div className="bg-white border border-slate-200 rounded-xl shadow-card hover:shadow-card-hover transition-all duration-200 overflow-hidden">
            {/* Top accent bar */}
            <div className={`h-1 ${isResult ? (isWin ? "bg-emerald-500" : isLoss ? "bg-rose-500" : "bg-slate-300") : "bg-primary"}`} />

            <div className="p-5">
                {/* Date & Time row */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="text-center">
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                {formatDate(game.gameDateTime)}
                            </p>
                            <p className="text-lg font-bold text-slate-900">
                                {formatTime(game.gameDateTime)}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide ${
                            isHome
                                ? "bg-primary/10 text-primary"
                                : "bg-slate-100 text-slate-600"
                        }`}>
                            {isHome ? "Home" : "Away"}
                        </span>
                        {game.conferenceGame && (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide bg-amber-100 text-amber-700">
                                Conf
                            </span>
                        )}
                    </div>
                </div>

                {/* Matchup */}
                <div className="flex items-center gap-4 mb-4">
                    <div className="flex-1">
                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                            {game.teamName}
                        </p>
                        <p className="text-xl font-bold text-slate-900">
                            {isHome ? "vs" : "@"} {game.opponent}
                        </p>
                    </div>

                    {/* Score display for results */}
                    {isResult && hasScore && (
                        <div className="text-right">
                            <div className={`text-2xl font-bold tabular-nums ${
                                isWin ? "text-emerald-600" : isLoss ? "text-rose-600" : "text-slate-900"
                            }`}>
                                {game.scoreUs} - {game.scoreThem}
                            </div>
                            <p className={`text-xs font-semibold uppercase ${
                                isWin ? "text-emerald-600" : isLoss ? "text-rose-600" : "text-slate-500"
                            }`}>
                                {isWin ? "Win" : isLoss ? "Loss" : "Final"}
                            </p>
                        </div>
                    )}
                </div>

                {/* Location */}
                <div className="flex items-start gap-2 text-sm text-slate-600">
                    <svg className="w-4 h-4 mt-0.5 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{game.location}</span>
                </div>

                {/* Notes if any */}
                {game.notes && (
                    <p className="mt-3 text-xs text-slate-500 italic border-t border-slate-100 pt-3">
                        {game.notes}
                    </p>
                )}
            </div>
        </div>
    );
};

export const SchedulePage: React.FC = () => {
    const [games, setGames] = useState<GameDto[]>([]);
    const [teams, setTeams] = useState<TeamDto[]>([]);
    const [teamFilter, setTeamFilter] = useState<TeamFilter>("ALL");
    const [viewTab, setViewTab] = useState<ViewTab>("upcoming");
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

    const upcomingGames = useMemo(
        () => filteredGames.filter((g) => !isPastGame(g)).sort((a, b) =>
            a.gameDateTime.localeCompare(b.gameDateTime)
        ),
        [filteredGames]
    );

    const pastGames = useMemo(
        () => filteredGames.filter((g) => isPastGame(g)).sort((a, b) =>
            b.gameDateTime.localeCompare(a.gameDateTime)
        ),
        [filteredGames]
    );

    const displayedGames = viewTab === "upcoming" ? upcomingGames : pastGames;

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero header */}
            <div className="bg-slate-900 text-white">
                <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
                    <p className="text-[11px] font-semibold tracking-[0.25em] uppercase text-primary mb-3">
                        2024-25 Season
                    </p>
                    <h1 className="text-3xl md:text-4xl font-bold mb-3">
                        Game Schedule
                    </h1>
                    <p className="text-slate-400 max-w-xl">
                        Follow Busche Academy Basketball through the season.
                        View upcoming matchups and recent results.
                    </p>
                </div>
            </div>

            {/* Controls bar */}
            <div className="bg-white border-b border-slate-200 sticky top-[73px] z-20">
                <div className="max-w-6xl mx-auto px-4 py-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        {/* View tabs */}
                        <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
                            <button
                                type="button"
                                onClick={() => setViewTab("upcoming")}
                                className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                                    viewTab === "upcoming"
                                        ? "bg-white text-slate-900 shadow-sm"
                                        : "text-slate-600 hover:text-slate-900"
                                }`}
                            >
                                Upcoming
                                {upcomingGames.length > 0 && (
                                    <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold rounded-full bg-primary text-white">
                                        {upcomingGames.length}
                                    </span>
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={() => setViewTab("results")}
                                className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                                    viewTab === "results"
                                        ? "bg-white text-slate-900 shadow-sm"
                                        : "text-slate-600 hover:text-slate-900"
                                }`}
                            >
                                Results
                                {pastGames.length > 0 && (
                                    <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold rounded-full bg-slate-300 text-slate-700">
                                        {pastGames.length}
                                    </span>
                                )}
                            </button>
                        </div>

                        {/* Team filter */}
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                                Team:
                            </span>
                            <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
                                {(["ALL", "NATIONAL", "REGIONAL"] as TeamFilter[]).map((value) => {
                                    const isActive = teamFilter === value;
                                    const label = value === "ALL" ? "All" : value === "NATIONAL" ? "National" : "Regional";

                                    return (
                                        <button
                                            key={value}
                                            type="button"
                                            onClick={() => setTeamFilter(value)}
                                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
                                                isActive
                                                    ? "bg-white text-slate-900 shadow-sm"
                                                    : "text-slate-600 hover:text-slate-900"
                                            }`}
                                        >
                                            {label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-6xl mx-auto px-4 py-8">
                {loading && (
                    <div className="flex items-center justify-center py-16">
                        <div className="flex items-center gap-3 text-slate-500">
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            <span>Loading schedule...</span>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="bg-rose-50 border border-rose-200 rounded-xl p-6 text-center">
                        <p className="text-rose-600">{error}</p>
                    </div>
                )}

                {!loading && !error && games.length === 0 && (
                    <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
                        <svg className="w-12 h-12 text-slate-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-slate-600 font-medium">No games scheduled yet</p>
                        <p className="text-sm text-slate-500 mt-1">Check back soon for updates.</p>
                    </div>
                )}

                {!loading && !error && games.length > 0 && (
                    <>
                        {displayedGames.length === 0 ? (
                            <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
                                <p className="text-slate-600 font-medium">
                                    {viewTab === "upcoming"
                                        ? "No upcoming games for this selection"
                                        : "No results yet for this selection"
                                    }
                                </p>
                                <p className="text-sm text-slate-500 mt-1">
                                    Try changing the team filter or check the other tab.
                                </p>
                            </div>
                        ) : (
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {displayedGames.map((game) => (
                                    <GameCard
                                        key={game.id}
                                        game={game}
                                        isResult={viewTab === "results"}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Stats summary */}
                        {viewTab === "results" && pastGames.length > 0 && (() => {
                            const totalWins = pastGames.filter(g => g.win === true).length;
                            const totalLosses = pastGames.filter(g => g.win === false).length;
                            const confGames = pastGames.filter(g => g.conferenceGame);
                            const confWins = confGames.filter(g => g.win === true).length;
                            const confLosses = confGames.filter(g => g.win === false).length;

                            return (
                                <div className="mt-8 bg-slate-900 rounded-xl p-6 text-white">
                                    <div className="grid sm:grid-cols-2 gap-6">
                                        {/* Overall Record */}
                                        <div>
                                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-4">
                                                Season Record
                                            </p>
                                            <div className="flex items-center gap-6">
                                                <div>
                                                    <p className="text-3xl font-bold text-emerald-400">
                                                        {totalWins}
                                                    </p>
                                                    <p className="text-xs text-slate-400 uppercase">Wins</p>
                                                </div>
                                                <div className="text-3xl font-light text-slate-600">-</div>
                                                <div>
                                                    <p className="text-3xl font-bold text-rose-400">
                                                        {totalLosses}
                                                    </p>
                                                    <p className="text-xs text-slate-400 uppercase">Losses</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Conference Record */}
                                        {confGames.length > 0 && (
                                            <div className="sm:border-l sm:border-slate-700 sm:pl-6">
                                                <p className="text-xs font-semibold text-amber-400 uppercase tracking-wide mb-4">
                                                    Conference Record
                                                </p>
                                                <div className="flex items-center gap-6">
                                                    <div>
                                                        <p className="text-3xl font-bold text-emerald-400">
                                                            {confWins}
                                                        </p>
                                                        <p className="text-xs text-slate-400 uppercase">Wins</p>
                                                    </div>
                                                    <div className="text-3xl font-light text-slate-600">-</div>
                                                    <div>
                                                        <p className="text-3xl font-bold text-rose-400">
                                                            {confLosses}
                                                        </p>
                                                        <p className="text-xs text-slate-400 uppercase">Losses</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })()}
                    </>
                )}
            </div>
        </div>
    );
};
