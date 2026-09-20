// src/api/adminDiningMenuApi.ts
import axios, { type AxiosRequestHeaders } from "axios";
import type { DiningMenuDto } from "../types";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080",
});

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("authToken");

        if (token) {
            if (!config.headers) {
                config.headers = { Authorization: `Bearer ${token}` } as AxiosRequestHeaders;
            } else {
                (config.headers as AxiosRequestHeaders).Authorization = `Bearer ${token}`;
            }
        }

        return config;
    },
    (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (
            error.response &&
            (error.response.status === 401 || error.response.status === 403)
        ) {
            console.warn(
                "adminDiningMenuApi auth error:",
                error.response.status,
                error.response.data
            );
        }
        return Promise.reject(error);
    }
);

export const adminDiningMenuApi = {
    // GET /admin/dining-menus
    getAll: (): Promise<DiningMenuDto[]> =>
        apiClient.get<DiningMenuDto[]>("/admin/dining-menus").then((r) => r.data),

    // POST /admin/dining-menus  (multipart/form-data)
    create: (title: string, file: File, displayOrder?: number): Promise<DiningMenuDto> => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("title", title);
        if (displayOrder != null) {
            formData.append("displayOrder", String(displayOrder));
        }

        return apiClient
            .post<DiningMenuDto>("/admin/dining-menus", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            })
            .then((r) => r.data);
    },

    // DELETE /admin/dining-menus/{id}
    delete: (id: number): Promise<void> =>
        apiClient.delete<void>(`/admin/dining-menus/${id}`).then(() => undefined),
};
