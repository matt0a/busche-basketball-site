// src/api/adminStaffApi.ts
import axios, { type AxiosRequestHeaders } from "axios";
import type { StaffMemberDto, TeamLevel } from "../types";

// IMPORTANT: direct hit to your backend, no "/api" prefix
const apiClient = axios.create({
    baseURL: "http://localhost:8080",
});

// Attach the JWT from localStorage (if present) to every request
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("authToken");

        if (token) {
            // Ensure headers exists and then add Authorization
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

// Optional: log auth errors for easier debugging
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (
            error.response &&
            (error.response.status === 401 || error.response.status === 403)
        ) {
            console.warn(
                "adminStaffApi auth error:",
                error.response.status,
                error.response.data
            );
        }
        return Promise.reject(error);
    }
);

export interface StaffMemberInput {
    fullName: string;
    teamLevel: TeamLevel;
    position: string;
    displayOrder: number | null;
    primaryPhotoUrl: string | null;
    secondaryPhotoUrl: string | null;
    email: string | null;
    phone: string | null;
    bio: string | null;
    active: boolean;
}

export const adminStaffApi = {
    // GET /admin/staff
    list: () =>
        apiClient.get<StaffMemberDto[]>("/admin/staff").then((r) => r.data),

    // POST /admin/staff
    create: (payload: StaffMemberInput) =>
        apiClient.post<StaffMemberDto>("/admin/staff", payload).then((r) => r.data),

    // PUT /admin/staff/{id}
    update: (id: number, payload: StaffMemberInput) =>
        apiClient
            .put<StaffMemberDto>(`/admin/staff/${id}`, payload)
            .then((r) => r.data),

    // DELETE /admin/staff/{id}
    remove: (id: number) => apiClient.delete<void>(`/admin/staff/${id}`),

    // POST /admin/staff/photo  (to be implemented on backend)
    uploadPhoto: (file: File) => {
        const formData = new FormData();
        formData.append("file", file);

        return apiClient
            .post<{ url: string }>("/admin/staff/photo", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            })
            .then((r) => r.data.url);
    },
};
