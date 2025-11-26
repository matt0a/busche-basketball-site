import axios from "axios";
import type {
    GameDto,
    PlayerDto,
    StaffMemberDto,
    TeamDto,
    TeamLevel,
} from "../types";

const apiClient = axios.create({
    // talks directly to Spring Boot on 8080
    baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080",
});

export const publicApi = {
    // ---------- Teams ----------
    getTeams: () =>
        apiClient.get<TeamDto[]>("/public/teams").then((r) => r.data),

    getPlayersByTeam: (teamId: number) =>
        apiClient
            .get<PlayerDto[]>(`/public/teams/${teamId}/players`)
            .then((r) => r.data),

    // ---------- Games ----------
    getFullSchedule: () =>
        apiClient.get<GameDto[]>("/public/games").then((r) => r.data),

    getUpcomingGames: (limit = 3) =>
        apiClient
            .get<GameDto[]>(`/public/games/upcoming?limit=${limit}`)
            .then((r) => r.data),

    getRecentGames: (limit = 5) =>
        apiClient
            .get<GameDto[]>(`/public/games/recent?limit=${limit}`)
            .then((r) => r.data),

    // ---------- Staff ----------
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
};
