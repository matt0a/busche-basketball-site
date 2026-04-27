// src/main.tsx or src/index.tsx

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import { AuthProvider } from "./auth/AuthContext";
import { Layout } from "./pages/Layout";
import { HomePage } from "./pages/HomePage";
import { RosterPage } from "./pages/RosterPage";
import { SchedulePage } from "./pages/SchedulePage";
import { LoginPage } from "./pages/LoginPage";
import { StaffSignupPage } from "./pages/StaffSignupPage";
import { AdminDashboardPage } from "./pages/AdminDashboardPage";
import { AboutPage } from "./pages/AboutPage";
import { AdmissionsPage } from "./pages/AdmissionsPage";
import { AcademicsPage } from "./pages/AcademicsPage";
import { StudentLifePage } from "./pages/StudentLifePage";
import { BasketballPage } from "./pages/BasketballPage";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <AuthProvider>
            <BrowserRouter>
                <Layout>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/staff" element={<Navigate to="/about" replace />} />
                        <Route path="/roster" element={<RosterPage />} />
                        <Route path="/schedule" element={<SchedulePage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/staffsignup123" element={<StaffSignupPage />} />
                        <Route path="/admissions" element={<AdmissionsPage />} />
                        <Route path="/academics" element={<AcademicsPage />} />
                        <Route path="/student-life" element={<StudentLifePage />} />
                        <Route path="/basketball" element={<BasketballPage />} />

                        {/* Admin / coach dashboard */}
                        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
                        {/* optional short alias */}
                        <Route path="/admin" element={<AdminDashboardPage />} />
                    </Routes>
                </Layout>
            </BrowserRouter>
        </AuthProvider>
    </React.StrictMode>
);
