import React, { useEffect, useMemo, useState } from "react";
import { publicApi } from "../api/publicApi";
import type { PlayerDto, TeamDto, TeamLevel } from "../types";
import { CircleNotch, User, UsersThree } from "@phosphor-icons/react";

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

const PlayerCard: React.FC<PlayerCardProps> = ({ player }) => {
    const imgSrc = buildPlayerPhotoUrl(player.photoUrl);

    return (
        <article className="group bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover border border-slate-200 hover:border-primary/30 transition-all duration-300">
            {/* Photo area */}
            <div className="relative h-56 bg-slate-100 overflow-hidden">
                {imgSrc ? (
                    <img
                        src={imgSrc}
                        alt={`${player.firstName} ${player.lastName}`}
                        className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                        <User size={64} weight="duotone" aria-hidden="true" />
                    </div>
                )}

                {/* Jersey number badge */}
                <div className="absolute top-3 right-3">
                    <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-900/90 backdrop-blur-sm text-white text-xl font-bold">
                        {player.jerseyNumber ?? "—"}
                    </span>
                </div>

                {/* Position badge */}
                {player.position && (
                    <div className="absolute bottom-3 left-3">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide bg-primary/90 text-white backdrop-blur-sm">
                            {player.position}
                        </span>
                    </div>
                )}
            </div>

            {/* Info area */}
            <div className="p-5">
                <div className="mb-4">
                    <p className="text-sm font-medium text-slate-500">{player.firstName}</p>
                    <h3 className="text-xl font-bold text-slate-900 -mt-0.5 group-hover:text-primary transition-colors">
                        {player.lastName}
                    </h3>
                    <p className="text-xs text-primary font-semibold uppercase tracking-wide mt-1">
                        {player.teamName}
                    </p>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100">
                    {player.height && (
                        <div className="text-center">
                            <p className="text-lg font-bold text-slate-900">{player.height}</p>
                            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Height</p>
                        </div>
                    )}
                    {player.gradYear && (
                        <div className="text-center">
                            <p className="text-lg font-bold text-slate-900">{player.gradYear}</p>
                            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Class</p>
                        </div>
                    )}
                    {player.country && (
                        <div className="text-center">
                            <p className="text-lg font-bold text-slate-900">{player.country}</p>
                            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">From</p>
                        </div>
                    )}
                </div>
            </div>
        </article>
    );
};

export const RosterSection: React.FC = () => {
    const [teams, setTeams] = useState<TeamDto[]>([]);
    const [playersByTeam, setPlayersByTeam] = useState<Record<number, PlayerDto[]>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeLevel, setActiveLevel] = useState<TeamLevel>("NATIONAL");

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
                            console.error("Error loading players for team", team.id, e);
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
                if (isMounted) setLoading(false);
            }
        };

        load();
        return () => {
            isMounted = false;
        };
    }, []);

    const nationalTeams = useMemo(
        () => teams.filter((t) => t.level === "NATIONAL"),
        [teams]
    );
    const regionalTeams = useMemo(
        () => teams.filter((t) => t.level === "REGIONAL"),
        [teams]
    );

    const activeTeams = activeLevel === "NATIONAL" ? nationalTeams : regionalTeams;

    const totalPlayers = useMemo(() => {
        return activeTeams.reduce((sum, team) => {
            return sum + (playersByTeam[team.id]?.length ?? 0);
        }, 0);
    }, [activeTeams, playersByTeam]);

    return (
        <>
            {/* Controls bar */}
            <div className="border-b border-slate-200 mb-8">
                <div className="max-w-6xl mx-auto px-4 py-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        {/* Team level toggle */}
                        <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
                            {(["NATIONAL", "REGIONAL"] as TeamLevel[]).map((level) => {
                                const isActive = activeLevel === level;
                                const count = level === "NATIONAL"
                                    ? nationalTeams.reduce((sum, t) => sum + (playersByTeam[t.id]?.length ?? 0), 0)
                                    : regionalTeams.reduce((sum, t) => sum + (playersByTeam[t.id]?.length ?? 0), 0);

                                return (
                                    <button
                                        key={level}
                                        type="button"
                                        onClick={() => setActiveLevel(level)}
                                        className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                                            isActive
                                                ? "bg-white text-slate-900 shadow-sm"
                                                : "text-slate-600 hover:text-slate-900"
                                        }`}
                                    >
                                        {level === "NATIONAL" ? "National" : "Regional"}
                                        {count > 0 && (
                                            <span className={`ml-2 inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold rounded-full ${
                                                isActive ? "bg-primary text-white" : "bg-slate-300 text-slate-700"
                                            }`}>
                                                {count}
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Player count */}
                        <p className="text-sm text-slate-500">
                            <span className="font-semibold text-slate-900">{totalPlayers}</span> players on {activeLevel.toLowerCase()} roster
                        </p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
                {loading && (
                    <div className="flex items-center justify-center py-20">
                        <div className="flex items-center gap-3 text-slate-500">
                            <CircleNotch size={20} weight="bold" className="animate-spin" aria-hidden="true" />
                            <span>Loading roster...</span>
                        </div>
                    </div>
                )}

                {error && !loading && (
                    <div className="bg-rose-50 border border-rose-200 rounded-xl p-6 text-center">
                        <p className="text-rose-600">{error}</p>
                    </div>
                )}

                {!loading && !error && (
                    <div className="space-y-12">
                        {activeTeams.map((team) => {
                            const players = playersByTeam[team.id] ?? [];
                            if (!players.length) return null;

                            return (
                                <section key={team.id}>
                                    {/* Team header */}
                                    <div className="mb-6">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide ${
                                                team.level === "NATIONAL"
                                                    ? "bg-primary/10 text-primary"
                                                    : "bg-slate-200 text-slate-700"
                                            }`}>
                                                {team.level === "NATIONAL" ? "National Team" : "Regional Team"}
                                            </span>
                                            <span className="text-sm text-slate-500">
                                                {players.length} players
                                            </span>
                                        </div>
                                        <h2 className="text-2xl font-bold text-slate-900">
                                            {team.name}
                                        </h2>
                                    </div>

                                    {/* Player cards grid */}
                                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                                        {players.map((player) => (
                                            <PlayerCard key={player.id} player={player} />
                                        ))}
                                    </div>
                                </section>
                            );
                        })}

                        {/* Empty state */}
                        {activeTeams.every((t) => (playersByTeam[t.id] ?? []).length === 0) && (
                            <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
                                <UsersThree size={48} weight="duotone" className="text-slate-300 mx-auto mb-4" aria-hidden="true" />
                                <p className="text-slate-600 font-medium">No players on this roster yet</p>
                                <p className="text-sm text-slate-500 mt-1">Check back soon for updates.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <p className="max-w-6xl mx-auto px-4 pt-8 text-sm text-slate-600">
                To inquire about tryouts, email our coach at{" "}
                <a href="mailto:mmason@buscheacademy.org" className="text-primary hover:underline font-medium">
                    mmason@buscheacademy.org
                </a>
            </p>
        </>
    );
};
