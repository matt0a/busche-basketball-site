import { apiClient } from "./client";
import type { AuthResponse } from "../types";

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    fullName: string;
    email: string;
    password: string;
}

export const authApi = {
    login: (payload: LoginRequest) =>
        apiClient.post<AuthResponse>("/auth/login", payload).then((r) => r.data),

    register: (payload: RegisterRequest) =>
        apiClient.post<AuthResponse>("/auth/register", payload).then((r) => r.data),
};
