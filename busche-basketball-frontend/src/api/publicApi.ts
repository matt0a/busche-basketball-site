import axios from "axios";
import type {
    GameDto,
    PlayerDto,
    SiteDocumentDto,
    StaffMemberDto,
    TeamDto,
    TeamLevel,
} from "../types";
import { cachedFetch } from "../lib/ttlCache";

const apiClient = axios.create({
    // talks directly to Spring Boot on 8080
    baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080",
});

const HOURS = 3_600_000;
const MINUTES = 60_000;

const TTL = {
    teams: 24 * HOURS,
    playersByTeam: 12 * HOURS,
    staff: 12 * HOURS,
    scheduleFull: 10 * MINUTES,
    scheduleShort: 5 * MINUTES,
    documents: 30 * MINUTES,
} as const;

// Raw fetchers (private)
const raw = {
    getTeams: () =>
        apiClient.get<TeamDto[]>("/public/teams").then((r) => r.data),

    getPlayersByTeam: (teamId: number) =>
        apiClient
            .get<PlayerDto[]>(`/public/teams/${teamId}/players`)
            .then((r) => r.data),

    getFullSchedule: () =>
        apiClient.get<GameDto[]>("/public/games").then((r) => r.data),

    getUpcomingGames: (limit: number) =>
        apiClient
            .get<GameDto[]>(`/public/games/upcoming?limit=${limit}`)
            .then((r) => r.data),

    getRecentGames: (limit: number) =>
        apiClient
            .get<GameDto[]>(`/public/games/recent?limit=${limit}`)
            .then((r) => r.data),

    getStaff: (teamLevel?: TeamLevel) => {
        const params = teamLevel ? `?teamLevel=${teamLevel}` : "";
        return apiClient
            .get<StaffMemberDto[]>(`/public/staff${params}`)
            .then((r) => r.data);
    },

    getStaffMember: (id: number) =>
        apiClient
            .get<StaffMemberDto>(`/public/staff/${id}`)
            .then((r) => r.data),

    getDocuments: () =>
        apiClient.get<SiteDocumentDto[]>("/public/documents").then((r) => r.data),

    getDocument: (key: string) =>
        apiClient.get<SiteDocumentDto>(`/public/documents/${key}`).then((r) => r.data),
};

// Cached public API
export const publicApi = {
    getTeams: () =>
        cachedFetch("teams", TTL.teams, raw.getTeams),

    getPlayersByTeam: (teamId: number) =>
        cachedFetch(`playersByTeam:${teamId}`, TTL.playersByTeam, () =>
            raw.getPlayersByTeam(teamId),
        ),

    getFullSchedule: () =>
        cachedFetch("scheduleFull", TTL.scheduleFull, raw.getFullSchedule),

    getUpcomingGames: (limit = 3) =>
        cachedFetch(`scheduleUpcoming:${limit}`, TTL.scheduleShort, () =>
            raw.getUpcomingGames(limit),
        ),

    getRecentGames: (limit = 5) =>
        cachedFetch(`scheduleRecent:${limit}`, TTL.scheduleShort, () =>
            raw.getRecentGames(limit),
        ),

    getStaff: (teamLevel?: TeamLevel) =>
        cachedFetch(
            `publicStaff:${teamLevel ?? "ALL"}`,
            TTL.staff,
            () => raw.getStaff(teamLevel),
        ),

    getStaffMember: (id: number) =>
        cachedFetch(`publicStaffMember:${id}`, TTL.staff, () =>
            raw.getStaffMember(id),
        ),

    getDocuments: () =>
        cachedFetch("documents", TTL.documents, raw.getDocuments),

    getDocument: (key: string) =>
        cachedFetch(`document:${key}`, TTL.documents, () => raw.getDocument(key)),
};
