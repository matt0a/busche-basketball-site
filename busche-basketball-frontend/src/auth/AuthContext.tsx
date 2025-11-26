// src/auth/AuthContext.tsx
import React, {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";
import type { AuthResponse } from "../types";

interface AuthState {
    token: string | null;
    fullName: string | null;
    email: string | null;
}

interface AuthContextValue extends AuthState {
    login: (resp: AuthResponse) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Store the full auth object here
const STORAGE_KEY = "busche_bb_auth";
// Store the bare JWT here (used by axios/adminStaffApi)
const TOKEN_KEY = "authToken";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
                                                                          children,
                                                                      }) => {
    const [state, setState] = useState<AuthState>({
        token: null,
        fullName: null,
        email: null,
    });

    // Rehydrate from localStorage on first load
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                const parsed = JSON.parse(stored) as AuthState;
                setState(parsed);
                if (parsed.token) {
                    localStorage.setItem(TOKEN_KEY, parsed.token);
                }
            } catch {
                // ignore parse errors
            }
        }
    }, []);

    const login = (resp: AuthResponse) => {
        const newState: AuthState = {
            token: resp.token,
            fullName: resp.fullName,
            email: resp.email,
        };
        setState(newState);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
        localStorage.setItem(TOKEN_KEY, resp.token);
    };

    const logout = () => {
        setState({ token: null, fullName: null, email: null });
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(TOKEN_KEY);
    };

    return (
        <AuthContext.Provider
            value={{
                ...state,
                login,
                logout,
                isAuthenticated: !!state.token,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextValue => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
};
