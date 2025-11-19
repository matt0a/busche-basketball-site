import { apiClient } from "./client";
import type { AuthResponse } from "../types";

export interface LoginRequest {
    email: string;
    password: string;
}

export const authApi = {
    login: (payload: LoginRequest) =>
        apiClient.post<AuthResponse>("/auth/login", payload).then((r) => r.data),
};
