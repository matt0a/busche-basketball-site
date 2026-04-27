// src/api/adminDocumentApi.ts
import axios, { type AxiosRequestHeaders } from "axios";
import type { SiteDocumentDto } from "../types";

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
                "adminDocumentApi auth error:",
                error.response.status,
                error.response.data
            );
        }
        return Promise.reject(error);
    }
);

export const adminDocumentApi = {
    // GET /admin/documents
    getAll: (): Promise<SiteDocumentDto[]> =>
        apiClient.get<SiteDocumentDto[]>("/admin/documents").then((r) => r.data),

    // POST /admin/documents/{key}/upload  (multipart/form-data, field name "file")
    upload: (key: string, file: File): Promise<SiteDocumentDto> => {
        const formData = new FormData();
        formData.append("file", file);

        return apiClient
            .post<SiteDocumentDto>(`/admin/documents/${key}/upload`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            })
            .then((r) => r.data);
    },

    // DELETE /admin/documents/{key}
    delete: (key: string): Promise<void> =>
        apiClient.delete<void>(`/admin/documents/${key}`).then(() => undefined),
};
