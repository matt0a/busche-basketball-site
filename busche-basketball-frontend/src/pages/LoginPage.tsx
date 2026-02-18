// src/pages/LoginPage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api/authApi";
import { useAuth } from "../auth/AuthContext";

export const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const result = await authApi.login({ email, password });
            // Use AuthContext so Layout knows we're logged in
            login(result);

            // go straight to admin dashboard
            navigate("/admin");
        } catch (err) {
            console.error("Login error", err);
            setError("Invalid email or password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl shadow-card p-8">
                <div className="text-center mb-6">
                    <h1 className="text-xl font-semibold text-slate-900 mb-1">
                        Coach Login
                    </h1>
                    <p className="text-sm text-slate-500">
                        Sign in to manage staff, roster, and schedule.
                    </p>
                </div>

                {error && (
                    <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200">
                        <p className="text-sm text-rose-600">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-1.5">
                        <label
                            className="text-xs font-semibold text-slate-700 uppercase tracking-wide"
                            htmlFor="email"
                        >
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            autoComplete="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label
                            className="text-xs font-semibold text-slate-700 uppercase tracking-wide"
                            htmlFor="password"
                        >
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            autoComplete="current-password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {loading ? "Signing in…" : "Sign in"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
