import { apiClient } from "./client";
import type { GameDto, TeamDto, PlayerDto, StaffMemberDto } from "../types";

export const publicApi = {
    getTeams: () =>
        apiClient.get<TeamDto[]>("/public/teams").then((r) => r.data),

    getPlayersByTeam: (teamId: number) =>
        apiClient.get<PlayerDto[]>(`/public/teams/${teamId}/players`).then((r) => r.data),

    getFullSchedule: () =>
        apiClient.get<GameDto[]>("/public/games").then((r) => r.data),

    getUpcomingGames: (limit = 3) =>
        apiClient
            .get<GameDto[]>(`/public/games/upcoming?limit=${limit}`)
            .then((r) => r.data),

    getRecentGames: (limit = 3) =>
        apiClient
            .get<GameDto[]>(`/public/games/recent?limit=${limit}`)
            .then((r) => r.data),

    getStaff: () =>
        apiClient.get<StaffMemberDto[]>("/public/staff").then((r) => r.data),
};
