import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const navLinkClasses =
    "text-sm tracking-wide hover:text-primary transition-colors px-3 py-1";

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const [mobileNavOpen, setMobileNavOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/");
        setMobileNavOpen(false);
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            {/* Top nav - white background for logo */}
            <header className="bg-white border-b border-slate-200 shadow-sm">
                <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-3">
                        {/* Logo on white background */}
                        <img
                            src="/basketball-logo.png"
                            alt="Busche Academy Basketball"
                            className="h-10 w-auto object-contain"
                        />
                        <div className="leading-tight">
                            <div className="text-xs uppercase tracking-[0.2em] text-slate-500">
                                Busche Academy
                            </div>
                            <div className="text-sm font-semibold text-slate-900">
                                Basketball Program
                            </div>
                        </div>
                    </div>

                    {/* Right side: desktop nav + mobile button */}
                    <div className="flex items-center gap-2">
                        {/* Desktop nav */}
                        <nav className="hidden md:flex items-center gap-2 text-slate-800">
                            <NavLink
                                to="/"
                                end
                                className={({ isActive }) =>
                                    `${navLinkClasses} ${
                                        isActive
                                            ? "border-b-2 border-primary text-primary"
                                            : ""
                                    }`
                                }
                            >
                                Home
                            </NavLink>
                            <NavLink
                                to="/staff"
                                className={({ isActive }) =>
                                    `${navLinkClasses} ${
                                        isActive
                                            ? "border-b-2 border-primary text-primary"
                                            : ""
                                    }`
                                }
                            >
                                Staff
                            </NavLink>
                            <NavLink
                                to="/roster"
                                className={({ isActive }) =>
                                    `${navLinkClasses} ${
                                        isActive
                                            ? "border-b-2 border-primary text-primary"
                                            : ""
                                    }`
                                }
                            >
                                Roster
                            </NavLink>
                            <NavLink
                                to="/schedule"
                                className={({ isActive }) =>
                                    `${navLinkClasses} ${
                                        isActive
                                            ? "border-b-2 border-primary text-primary"
                                            : ""
                                    }`
                                }
                            >
                                Schedule
                            </NavLink>

                            {isAuthenticated ? (
                                <>
                                    <NavLink
                                        to="/admin"
                                        className={({ isActive }) =>
                                            `${navLinkClasses} ${
                                                isActive
                                                    ? "border-b-2 border-primary text-primary"
                                                    : ""
                                            }`
                                        }
                                    >
                                        Admin
                                    </NavLink>
                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        className="ml-2 text-xs px-3 py-1 rounded-full border border-slate-300 text-slate-700 hover:border-primary hover:text-primary transition-colors"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <NavLink
                                    to="/login"
                                    className={({ isActive }) =>
                                        `${navLinkClasses} ${
                                            isActive
                                                ? "border-b-2 border-primary text-primary"
                                                : ""
                                        }`
                                    }
                                >
                                    Coach Login
                                </NavLink>
                            )}
                        </nav>

                        {/* Mobile menu button (shows on < md) */}
                        <button
                            type="button"
                            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-white"
                            onClick={() => setMobileNavOpen(true)}
                            aria-label="Open navigation menu"
                        >
                            <span className="sr-only">Open main menu</span>
                            <svg
                                className="h-5 w-5"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M4 7H20M4 12H20M4 17H20"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>

                    </div>
                </div>

                {/* Mobile slide-over menu with slide animation */}
                <div
                    className={`fixed inset-0 z-40 flex md:hidden transition-opacity duration-300 ${
                        mobileNavOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    }`}
                >
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-slate-900/50"
                        onClick={() => setMobileNavOpen(false)}
                    />

                    {/* Sliding panel */}
                    <div
                        className={`relative ml-auto flex h-full w-64 flex-col bg-white shadow-xl transform transition-transform duration-300 ease-out ${
                            mobileNavOpen ? "translate-x-0" : "translate-x-full"
                        }`}
                    >
                        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
                            <div className="text-sm font-semibold text-slate-900">
                                Busche Basketball
                            </div>
                            <button
                                type="button"
                                className="inline-flex items-center justify-center rounded-full border border-slate-300 p-1.5 text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-white"
                                onClick={() => setMobileNavOpen(false)}
                                aria-label="Close navigation menu"
                            >
                                <svg
                                    className="h-4 w-4"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M6 6L18 18M6 18L18 6"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                    />
                                </svg>
                            </button>
                        </div>

                        <nav className="flex-1 px-4 py-4 space-y-1 text-slate-800">
                            <NavLink
                                to="/"
                                end
                                className={({ isActive }) =>
                                    `block rounded-md px-3 py-2 text-sm font-medium ${
                                        isActive
                                            ? "bg-slate-100 text-primary"
                                            : "hover:bg-slate-50 hover:text-primary"
                                    }`
                                }
                                onClick={() => setMobileNavOpen(false)}
                            >
                                Home
                            </NavLink>
                            <NavLink
                                to="/staff"
                                className={({ isActive }) =>
                                    `block rounded-md px-3 py-2 text-sm font-medium ${
                                        isActive
                                            ? "bg-slate-100 text-primary"
                                            : "hover:bg-slate-50 hover:text-primary"
                                    }`
                                }
                                onClick={() => setMobileNavOpen(false)}
                            >
                                Staff
                            </NavLink>
                            <NavLink
                                to="/roster"
                                className={({ isActive }) =>
                                    `block rounded-md px-3 py-2 text-sm font-medium ${
                                        isActive
                                            ? "bg-slate-100 text-primary"
                                            : "hover:bg-slate-50 hover:text-primary"
                                    }`
                                }
                                onClick={() => setMobileNavOpen(false)}
                            >
                                Roster
                            </NavLink>
                            <NavLink
                                to="/schedule"
                                className={({ isActive }) =>
                                    `block rounded-md px-3 py-2 text-sm font-medium ${
                                        isActive
                                            ? "bg-slate-100 text-primary"
                                            : "hover:bg-slate-50 hover:text-primary"
                                    }`
                                }
                                onClick={() => setMobileNavOpen(false)}
                            >
                                Schedule
                            </NavLink>

                            <div className="mt-4 border-t border-slate-200 pt-4">
                                {isAuthenticated ? (
                                    <>
                                        <NavLink
                                            to="/admin"
                                            className={({ isActive }) =>
                                                `block rounded-md px-3 py-2 text-sm font-medium ${
                                                    isActive
                                                        ? "bg-slate-100 text-primary"
                                                        : "hover:bg-slate-50 hover:text-primary"
                                                }`
                                            }
                                            onClick={() => setMobileNavOpen(false)}
                                        >
                                            Admin
                                        </NavLink>
                                        <button
                                            type="button"
                                            onClick={handleLogout}
                                            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:border-primary hover:text-primary transition-colors"
                                        >
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <NavLink
                                        to="/login"
                                        className={({ isActive }) =>
                                            `block rounded-md px-3 py-2 text-sm font-medium ${
                                                isActive
                                                    ? "bg-slate-100 text-primary"
                                                    : "hover:bg-slate-50 hover:text-primary"
                                            }`
                                        }
                                        onClick={() => setMobileNavOpen(false)}
                                    >
                                        Coach Login
                                    </NavLink>
                                )}
                            </div>
                        </nav>
                    </div>
                </div>
                )
            </header>

            {/* Main content */}
            <main className="flex-1">{children}</main>

            {/* Big footer similar to school site */}
            <footer className="bg-white border-t border-slate-200 mt-8">
                <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col gap-8 md:flex-row md:justify-between">
                    {/* Left column */}
                    <div className="space-y-4 max-w-md">
                        <div className="flex items-center gap-3">
                            <img
                                src="/busche-logo.png"
                                alt="Busche Academy"
                                className="h-10 w-auto"
                            />
                            <div>
                                <div className="uppercase text-xs tracking-[0.2em] text-slate-500">
                                    Busche Academy
                                </div>
                                <div className="text-sm font-semibold text-slate-900">
                                    Basketball Program
                                </div>
                            </div>
                        </div>
                        <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                            Busche Academy is a small, college-preparatory boarding and day
                            school located in Chester, New Hampshire. Our basketball program
                            combines high-level training and competition with a rigorous
                            academic environment.
                        </p>
                        <p className="max-w-3xl leading-snug text-[11px] md:text-xs text-slate-500">
                            Busche Academy is a private coeducational boarding and day school in
                            Chester, New Hampshire, welcoming students from across the United
                            States and around the world. The school follows all applicable
                            federal and state laws and does not discriminate on the basis of
                            race, color, religion, sex, national origin, gender identity or
                            expression, or disability.
                        </p>
                    </div>

                    {/* Right column */}
                    <div className="space-y-4 text-xs md:text-sm text-slate-600">
                        <div>
                            <div className="font-semibold text-slate-900 mb-1">
                                Contact
                            </div>
                            <p>Busche Academy Basketball</p>
                            <p>40 Chester Street</p>
                            <p>Chester, NH 03036 · USA</p>
                            <p className="mt-1">
                                Phone: <span className="font-medium">(603) 887-0001</span>
                            </p>
                            <p>
                                Email:{" "}
                                <a
                                    href="mailto:info@buscheacademy.org"
                                    className="text-primary hover:underline"
                                >
                                    info@buscheacademy.org
                                </a>
                            </p>
                        </div>

                        <div>
                            <div className="font-semibold text-slate-900 mb-1">
                                Admissions & Program Info
                            </div>
                            <p>
                                For details about tryouts, tuition, scholarships, or admissions,
                                please contact the Busche Academy Office of Admissions or the
                                basketball program director, or visit{" "}
                                <a
                                    href="https://buscheacademy.org"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-primary hover:underline"
                                >
                                    buscheacademy.org
                                </a>.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Social + bottom line */}
                <div className="border-t border-slate-200">
                    <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        {/* Social icons */}
                        <div className="flex items-center gap-4">
        <span className="text-[11px] md:text-xs text-slate-500">
          Follow Busche Academy
        </span>
                            <div className="flex items-center gap-4">
                                {/* Instagram */}
                                <a
                                    href="https://www.instagram.com/busche_academy_basketball_?igsh=cHVmbjNyNnRwajdl"
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label="Busche Academy Basketball on Instagram"
                                    className="text-slate-700 hover:text-primary transition-colors"
                                >
                                    <svg
                                        viewBox="0 0 24 24"
                                        className="h-6 w-6"
                                        aria-hidden="true"
                                    >
                                        <rect
                                            x="3"
                                            y="3"
                                            width="18"
                                            height="18"
                                            rx="5"
                                            ry="5"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        />
                                        <circle
                                            cx="12"
                                            cy="12"
                                            r="4"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        />
                                        <circle cx="17" cy="7" r="1.2" fill="currentColor" />
                                    </svg>
                                </a>

                                {/* Facebook */}
                                <a
                                    href="https://www.facebook.com/BuscheAcademy/?_rdr"
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label="Busche Academy on Facebook"
                                    className="text-slate-700 hover:text-primary transition-colors"
                                >
                                    <svg
                                        viewBox="0 0 24 24"
                                        className="h-6 w-6"
                                        aria-hidden="true"
                                    >
                                        {/* outer rounded square */}
                                        <rect
                                            x="3"
                                            y="3"
                                            width="18"
                                            height="18"
                                            rx="4"
                                            ry="4"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        />
                                        {/* bold "f" */}
                                        <path
                                            d="M13.5 8H15V6h-1.5C11.57 6 10 7.57 10 9.9V11H8v2h2v5h2.5v-5H15v-2h-2.5V9.75C12.5 8.8 12.93 8 13.5 8z"
                                            fill="currentColor"
                                        />
                                    </svg>
                                </a>


                                {/* X / Twitter */}
                                <a
                                    href="https://x.com/BuscheAcademy?s=20&t=H53KEcbecPURoWMjmTtrcw"
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label="Busche Academy on X (Twitter)"
                                    className="text-slate-700 hover:text-primary transition-colors"
                                >
                                    <svg
                                        viewBox="0 0 24 24"
                                        className="h-6 w-6"
                                        aria-hidden="true"
                                    >
                                        <path
                                            d="M6 4l5.5 7.3L6.2 20h2.8l3.4-5.6L16.3 20h2.8l-5.1-7.5L18.5 4h-2.8l-3.1 5.2L9 4H6z"
                                            fill="currentColor"
                                        />
                                    </svg>
                                </a>
                            </div>
                        </div>

                        {/* Bottom line text */}
                        <div className="text-[11px] md:text-xs text-slate-500 text-left md:text-right space-y-1">
                            <p>Busche Academy · Chester · New Hampshire, United States</p>
                            <p>
                                Copyright © {new Date().getFullYear()} Busche Academy. All Rights
                                Reserved.
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};
