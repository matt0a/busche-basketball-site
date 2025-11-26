import React, { useEffect, useMemo, useState } from "react";
import { publicApi } from "../api/publicApi";
import type { PlayerDto, TeamDto, TeamLevel } from "../types";

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

function buildPlayerPhotoUrl(path: string | null | undefined): string | null {
    if (!path) return null;
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    if (path.startsWith("/")) return `${API_BASE_URL}${path}`;
    return `${API_BASE_URL}/${path}`;
}

interface PlayerCardProps {
    player: PlayerDto;
}

/**
 * Public-facing roster card:
 * - Big jersey number
 * - Name, position
 * - Photo
 * - Height / Grad Year / Country
 */
const PlayerCard: React.FC<PlayerCardProps> = ({ player }) => {
    const imgSrc = buildPlayerPhotoUrl(player.photoUrl);

    return (
        <article className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
            {/* Top: name, position, jersey number */}
            <div className="px-5 pt-4 pb-2 flex-1">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <div className="leading-tight">
                            <p className="text-xs font-semibold text-slate-700">
                                {player.firstName}
                            </p>
                            <p className="text-2xl font-semibold text-slate-900 -mt-0.5">
                                {player.lastName}
                            </p>
                        </div>
                        <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                            {player.position || "Player"}
                        </p>
                        <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-sky-700">
                            {player.teamName}
                        </p>
                    </div>

                    <div className="text-3xl font-semibold text-slate-900 leading-none">
                        {player.jerseyNumber ?? "—"}
                    </div>
                </div>

                {/* Player photo */}
                <div className="mt-4 flex justify-center">
                    <div className="w-32 h-32 sm:w-36 sm:h-36">
                        {imgSrc ? (
                            <img
                                src={imgSrc}
                                alt={`${player.firstName} ${player.lastName}`}
                                className="w-full h-full object-cover object-top"
                            />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400">
                                <svg
                                    viewBox="0 0 24 24"
                                    className="h-8 w-8 mb-1"
                                    aria-hidden="true"
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
                                <p className="text-[10px] tracking-[0.18em] uppercase">
                                    No Photo
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom: simple details row */}
            <div className="border-t border-slate-200 bg-slate-50 px-5 py-3">
                <dl className="grid grid-cols-2 gap-y-2 text-[11px] uppercase text-slate-600">
                    {player.height && (
                        <>
                            <dt className="font-semibold text-slate-500">
                                Height
                            </dt>
                            <dd className="text-slate-800">{player.height}</dd>
                        </>
                    )}
                    {player.gradYear && (
                        <>
                            <dt className="font-semibold text-slate-500">
                                Grad Year
                            </dt>
                            <dd className="text-slate-800">{player.gradYear}</dd>
                        </>
                    )}
                    {player.country && (
                        <>
                            <dt className="font-semibold text-slate-500">
                                Country
                            </dt>
                            <dd className="text-slate-800">{player.country}</dd>
                        </>
                    )}
                </dl>
            </div>
        </article>
    );
};

export const RosterPage: React.FC = () => {
    const [teams, setTeams] = useState<TeamDto[]>([]);
    const [playersByTeam, setPlayersByTeam] = useState<
        Record<number, PlayerDto[]>
    >({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeLevel, setActiveLevel] = useState<TeamLevel>("NATIONAL");

    // controls fade / slide animation of the sections
    const [listVisible, setListVisible] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const load = async () => {
            try {
                setLoading(true);
                setError(null);

                const allTeams = await publicApi.getTeams();
                if (!isMounted) return;

                setTeams(allTeams);

                const playersMap: Record<number, PlayerDto[]> = {};

                await Promise.all(
                    allTeams.map(async (team) => {
                        try {
                            const players = await publicApi.getPlayersByTeam(team.id);
                            if (!isMounted) return;
                            playersMap[team.id] = players;
                        } catch (e) {
                            console.error(
                                "Error loading players for team",
                                team.id,
                                e
                            );
                        }
                    })
                );

                if (!isMounted) return;
                setPlayersByTeam(playersMap);
            } catch (e) {
                console.error(e);
                if (isMounted) {
                    setError("Unable to load roster right now.");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                    // fade in on initial load
                    setListVisible(true);
                }
            }
        };

        load();
        return () => {
            isMounted = false;
        };
    }, []);

    // when switching National ↔ Regional, re-trigger fade in
    useEffect(() => {
        if (loading || error) return;
        setListVisible(false);
        const id = window.setTimeout(() => setListVisible(true), 30);
        return () => window.clearTimeout(id);
    }, [activeLevel, loading, error]);

    const nationalTeams = useMemo(
        () => teams.filter((t) => t.level === "NATIONAL"),
        [teams]
    );
    const regionalTeams = useMemo(
        () => teams.filter((t) => t.level === "REGIONAL"),
        [teams]
    );

    const activeTeams = activeLevel === "NATIONAL" ? nationalTeams : regionalTeams;

    return (
        <div className="py-10">
            <div className="max-w-6xl mx-auto px-4 lg:px-0">
                {/* Header */}
                <header className="mb-10">
                    <div className="flex items-center justify-between gap-4">
                        <h1 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-[0.14em] text-slate-900">
                            ROSTER
                        </h1>
                    </div>
                    <div className="mt-3 h-[2px] w-full bg-slate-200">
                        <div className="h-full w-24 bg-sky-600" />
                    </div>

                    <div className="mt-6">
                        <h2 className="text-xl font-semibold text-slate-900">
                            Players
                        </h2>
                        <div className="mt-2 h-[2px] bg-slate-200" />
                    </div>
                </header>

                {/* National / Regional toggle */}
                <div className="flex flex-col items-center gap-3 mb-8">
                    <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 p-1">
                        {(["NATIONAL", "REGIONAL"] as TeamLevel[]).map((level) => {
                            const isActive = activeLevel === level;
                            return (
                                <button
                                    key={level}
                                    type="button"
                                    onClick={() => setActiveLevel(level)}
                                    className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all duration-300 ease-out ${
                                        isActive
                                            ? "bg-sky-700 text-white shadow-sm scale-[1.03]"
                                            : "text-slate-600 hover:text-slate-900"
                                    }`}
                                >
                                    {level === "NATIONAL"
                                        ? "National Roster"
                                        : "Regional Roster"}
                                </button>
                            );
                        })}
                    </div>
                    <p className="text-[11px] text-slate-500">
                        Switch between National and Regional player groups.
                    </p>
                </div>

                {/* Loading / error */}
                {loading && (
                    <p className="text-sm text-slate-500 text-center">
                        Loading roster…
                    </p>
                )}

                {error && !loading && (
                    <p className="text-sm text-rose-500 text-center">{error}</p>
                )}

                {/* Team sections + player cards */}
                {!loading && !error && (
                    <div
                        className={`space-y-10 transform transition-all duration-400 ease-out ${
                            listVisible
                                ? "opacity-100 translate-y-0"
                                : "opacity-0 translate-y-3"
                        }`}
                    >
                        {activeTeams.map((team) => {
                            const players = playersByTeam[team.id] ?? [];
                            if (!players.length) return null;

                            return (
                                <section key={team.id} className="space-y-4">
                                    {/* Team header */}
                                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
                                        <div>
                                            <p className="text-[11px] uppercase font-semibold tracking-[0.18em] text-slate-500">
                                                {team.level === "NATIONAL"
                                                    ? "National Team"
                                                    : "Regional Team"}
                                            </p>
                                            <p className="text-lg font-semibold text-slate-900">
                                                {team.name}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Player cards:
                                        - mobile: full width
                                        - sm+: fixed width cards, centered, wrapping
                                     */}
                                    <div className="flex flex-wrap justify-center gap-6">
                                        {players.map((player) => (
                                            <div
                                                key={player.id}
                                                className="w-full sm:w-[320px] md:w-[300px] max-w-md"
                                            >
                                                <PlayerCard player={player} />
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            );
                        })}

                        {/* If there are no players at all for this level */}
                        {activeTeams.every(
                            (t) => (playersByTeam[t.id] ?? []).length === 0
                        ) && (
                            <p className="text-sm text-slate-500 text-center">
                                No players listed yet for this roster.
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
