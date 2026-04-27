// src/pages/StaffSignupPage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api/authApi";
import { useAuth } from "../auth/AuthContext";

export const StaffSignupPage: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!email.endsWith("@buscheacademy.org")) {
            setError("Email must be a @buscheacademy.org address.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            const result = await authApi.register({ fullName, email, password });
            login(result);
            navigate("/admin");
        } catch (err: unknown) {
            const status =
                err &&
                typeof err === "object" &&
                "response" in err &&
                err.response &&
                typeof err.response === "object" &&
                "status" in err.response
                    ? (err.response as { status: number }).status
                    : null;

            if (status === 400) {
                setError("Email must be a @buscheacademy.org address.");
            } else if (status === 409) {
                setError("An account with this email already exists.");
            } else {
                setError("Registration failed. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl shadow-card p-8">
                <div className="text-center mb-6">
                    <h1 className="text-xl font-semibold text-slate-900 mb-1">
                        Staff Registration
                    </h1>
                    <p className="text-sm text-slate-500">
                        Create a Busche Academy staff account.
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
                            htmlFor="fullName"
                        >
                            Full Name
                        </label>
                        <input
                            id="fullName"
                            type="text"
                            autoComplete="name"
                            placeholder="Jane Smith"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="input"
                            required
                        />
                    </div>

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
                            placeholder="you@buscheacademy.org"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input"
                            required
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label
                            className="text-xs font-semibold text-slate-700 uppercase tracking-wide"
                            htmlFor="password"
                        >
                            Password
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                autoComplete="new-password"
                                placeholder="Min 8 characters"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input pr-10"
                                required
                                minLength={8}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((v) => !v)}
                                className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-slate-600 transition-colors"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? (
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                    </svg>
                                ) : (
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label
                            className="text-xs font-semibold text-slate-700 uppercase tracking-wide"
                            htmlFor="confirmPassword"
                        >
                            Confirm Password
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            autoComplete="new-password"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="input"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {loading ? "Creating account…" : "Create Account"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default StaffSignupPage;
