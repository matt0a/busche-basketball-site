import axios, { type AxiosRequestHeaders } from "axios";
import type { TeamDto, TeamLevel } from "../types";

const apiClient = axios.create({
    baseURL: "http://localhost:8080", // later: import.meta.env.VITE_API_BASE_URL
});

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

export interface TeamInput {
    name: string;
    level: TeamLevel;
    // if later you want season/description editable, add them here
    // season?: string | null;
    // description?: string | null;
}

export const adminTeamApi = {
    listAll: () =>
        apiClient.get<TeamDto[]>("/admin/teams").then((r) => r.data),

    create: (payload: TeamInput) =>
        apiClient.post<TeamDto>("/admin/teams", payload).then((r) => r.data),

    update: (id: number, payload: TeamInput) =>
        apiClient.put<TeamDto>(`/admin/teams/${id}`, payload).then((r) => r.data),

    remove: (id: number) =>
        apiClient.delete<void>(`/admin/teams/${id}`),
};
