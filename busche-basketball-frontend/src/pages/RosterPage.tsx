import React, { useEffect, useMemo, useRef, useState } from "react";
import { publicApi } from "../api/publicApi";
import type { PlayerDto, TeamDto, TeamLevel } from "../types";
import { gsap } from "gsap";

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
                        <svg viewBox="0 0 24 24" className="w-16 h-16" aria-hidden="true">
                            <circle cx="12" cy="8" r="3.5" className="fill-none stroke-current" strokeWidth="1.5" />
                            <path d="M6 18.5c1.6-2.2 3.5-3.3 6-3.3s4.4 1.1 6 3.3" className="fill-none stroke-current" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
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

export const RosterPage: React.FC = () => {
    const heroRef = useRef<HTMLDivElement | null>(null);
    const [teams, setTeams] = useState<TeamDto[]>([]);
    const [playersByTeam, setPlayersByTeam] = useState<Record<number, PlayerDto[]>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeLevel, setActiveLevel] = useState<TeamLevel>("NATIONAL");

    useEffect(() => {
        if (heroRef.current) {
            gsap.fromTo(
                heroRef.current,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
            );
        }
    }, []);

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
        <div className="min-h-screen bg-slate-50">
            {/* Hero Section */}
            <section className="relative bg-slate-900 text-white overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle at 25% 25%, #009FFD 0%, transparent 50%), radial-gradient(circle at 75% 75%, #2AFC98 0%, transparent 50%)`
                    }} />
                </div>

                <div ref={heroRef} className="relative max-w-6xl mx-auto px-4 py-16 md:py-20">
                    <p className="text-primary font-semibold text-sm uppercase tracking-[0.2em] mb-3">
                        2024-25 Season
                    </p>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Team Roster
                    </h1>
                    <p className="text-lg text-slate-300 max-w-2xl">
                        Meet the student-athletes representing Busche Academy Basketball.
                        Our roster includes talented players from across the United States
                        and around the world.
                    </p>
                </div>
            </section>

            {/* Controls bar */}
            <div className="bg-white border-b border-slate-200 sticky top-[73px] z-20">
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
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
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
                                <svg className="w-12 h-12 text-slate-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                <p className="text-slate-600 font-medium">No players on this roster yet</p>
                                <p className="text-sm text-slate-500 mt-1">Check back soon for updates.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Join CTA */}
            <section className="bg-white border-t border-slate-200 py-12">
                <div className="max-w-6xl mx-auto px-4 text-center">
                    <h2 className="text-2xl font-bold text-slate-900 mb-3">
                        Interested in Joining the Team?
                    </h2>
                    <p className="text-slate-600 mb-6 max-w-xl mx-auto">
                        We're always looking for talented, dedicated student-athletes who want
                        to compete at a high level while excelling academically.
                    </p>
                    <p className="text-slate-600">
                        To inquire about tryouts, email our coach at{" "}
                        <a href="mailto:mmason@buscheacademy.org" className="text-primary hover:underline font-medium">
                            mmason@buscheacademy.org
                        </a>
                    </p>
                </div>
            </section>
        </div>
    );
};
