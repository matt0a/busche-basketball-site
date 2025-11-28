// src/api/adminGameApi.ts
import axios, { type AxiosRequestHeaders } from "axios";
import type { GameDto, HomeAway } from "../types";

// IMPORTANT: direct hit to your backend, no "/api" prefix
const apiClient = axios.create({
    baseURL: "http://localhost:8080",
});

// Attach the JWT from localStorage (if present) to every request
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("authToken");

        if (token) {
            if (!config.headers) {
                config.headers = {
                    Authorization: `Bearer ${token}`,
                } as AxiosRequestHeaders;
            } else {
                (config.headers as AxiosRequestHeaders).Authorization =
                    `Bearer ${token}`;
            }
        }

        return config;
    },
    (error) => Promise.reject(error)
);

export interface GameInput {
    teamId: number;
    opponent: string;
    gameDateTime: string; // "YYYY-MM-DDTHH:mm:ss"
    homeAway: HomeAway;
    location: string;
    scoreUs: number | null;
    scoreThem: number | null;
    conferenceGame: boolean;
    notes: string | null;
}

export const adminGameApi = {
    // GET /admin/games
    listAll: () =>
        apiClient.get<GameDto[]>("/admin/games").then((r) => r.data),

    // POST /admin/games
    create: (payload: GameInput) =>
        apiClient.post<GameDto>("/admin/games", payload).then((r) => r.data),

    // PUT /admin/games/{id}
    update: (id: number, payload: GameInput) =>
        apiClient
            .put<GameDto>(`/admin/games/${id}`, payload)
            .then((r) => r.data),

    // DELETE /admin/games/{id}
    remove: (id: number) => apiClient.delete<void>(`/admin/games/${id}`),
};
