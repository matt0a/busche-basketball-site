import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import { AuthProvider } from "./auth/AuthContext";
import { Layout } from "./pages/Layout";
import { HomePage } from "./pages/HomePage";
import { StaffPage } from "./pages/StaffPage";
import { RosterPage } from "./pages/RosterPage";
import { SchedulePage } from "./pages/SchedulePage";
import { LoginPage } from "./pages/LoginPage";
import { AdminDashboardPage } from "./pages/AdminDashboardPage";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <AuthProvider>
            <BrowserRouter>
                <Layout>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/staff" element={<StaffPage />} />
                        <Route path="/roster" element={<RosterPage />} />
                        <Route path="/schedule" element={<SchedulePage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/admin" element={<AdminDashboardPage />} />
                    </Routes>
                </Layout>
            </BrowserRouter>
        </AuthProvider>
    </React.StrictMode>
);
