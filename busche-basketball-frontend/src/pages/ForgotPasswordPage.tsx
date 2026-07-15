// src/pages/ForgotPasswordPage.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { authApi } from "../api/authApi";

export const ForgotPasswordPage: React.FC = () => {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await authApi.forgotPassword(email);
            // Always show the same confirmation, regardless of whether the account exists.
            setSubmitted(true);
        } catch (err) {
            console.error("Forgot password error", err);
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl shadow-card p-8">
                <div className="text-center mb-6">
                    <h1 className="text-xl font-semibold text-slate-900 mb-1">
                        Reset your password
                    </h1>
                    <p className="text-sm text-slate-500">
                        Enter your email and we'll send you a reset link.
                    </p>
                </div>

                {submitted ? (
                    <div className="space-y-6">
                        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                            <p className="text-sm text-emerald-700">
                                If an account exists for that email, we've sent a link to reset your
                                password. The link expires in 30 minutes.
                            </p>
                        </div>
                        <Link to="/login" className="btn-primary w-full block text-center">
                            Back to sign in
                        </Link>
                    </div>
                ) : (
                    <>
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
                                    placeholder="you@buscheacademy.org"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="input"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary w-full mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {loading ? "Sending…" : "Send reset link"}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <Link
                                to="/login"
                                className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
                            >
                                Back to sign in
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
