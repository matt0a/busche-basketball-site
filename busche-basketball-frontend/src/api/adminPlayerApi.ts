import axios, { type AxiosRequestHeaders } from "axios";
import type { PlayerDto } from "../types";

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
                (config.headers as AxiosRequestHeaders).Authorization = `Bearer ${token}`;
            }
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// log auth errors for easier debugging
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (
            error.response &&
            (error.response.status === 401 || error.response.status === 403)
        ) {
            console.warn(
                "adminPlayerApi auth error:",
                error.response.status,
                error.response.data
            );
        }
        return Promise.reject(error);
    }
);

export interface PlayerInput {
    teamId: number;
    firstName: string;
    lastName: string;
    jerseyNumber: number | null;
    position: string | null;
    height: string | null;
    gradYear: number | null;
    country: string | null;
    photoUrl: string | null;
}

export const adminPlayerApi = {
    // GET /admin/players/team/{teamId}
    listByTeam: (teamId: number) =>
        apiClient
            .get<PlayerDto[]>(`/admin/players/team/${teamId}`)
            .then((r) => r.data),

    // POST /admin/players
    create: (payload: PlayerInput) =>
        apiClient.post<PlayerDto>("/admin/players", payload).then((r) => r.data),

    // PUT /admin/players/{id}
    update: (id: number, payload: PlayerInput) =>
        apiClient
            .put<PlayerDto>(`/admin/players/${id}`, payload)
            .then((r) => r.data),

    // DELETE /admin/players/{id}
    remove: (id: number) => apiClient.delete<void>(`/admin/players/${id}`),

    uploadPhoto: (file: File) => {
        const formData = new FormData();
        formData.append("file", file);

        return apiClient
            .post<{ url: string }>("/admin/players/photo", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            })
            .then((r) => r.data.url);
    },
};
