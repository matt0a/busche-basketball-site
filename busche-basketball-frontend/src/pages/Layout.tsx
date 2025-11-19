import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const navLinkClasses =
    "text-sm tracking-wide hover:text-primary transition-colors px-3 py-1";

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            {/* Top nav - white background for logo */}
            <header className="bg-white border-b border-slate-200 shadow-sm">
                <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-3">
                        {/* Logo on white background */}
                        <img
                            src="/basketball-logo.png" // change if your file has a different name
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

                    <nav className="hidden md:flex items-center gap-2 text-slate-800">
                        <NavLink
                            to="/"
                            end
                            className={({ isActive }) =>
                                `${navLinkClasses} ${
                                    isActive ? "border-b-2 border-primary text-primary" : ""
                                }`
                            }
                        >
                            Home
                        </NavLink>
                        <NavLink
                            to="/staff"
                            className={({ isActive }) =>
                                `${navLinkClasses} ${
                                    isActive ? "border-b-2 border-primary text-primary" : ""
                                }`
                            }
                        >
                            Staff
                        </NavLink>
                        <NavLink
                            to="/roster"
                            className={({ isActive }) =>
                                `${navLinkClasses} ${
                                    isActive ? "border-b-2 border-primary text-primary" : ""
                                }`
                            }
                        >
                            Roster
                        </NavLink>
                        <NavLink
                            to="/schedule"
                            className={({ isActive }) =>
                                `${navLinkClasses} ${
                                    isActive ? "border-b-2 border-primary text-primary" : ""
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
                                            isActive ? "border-b-2 border-primary text-primary" : ""
                                        }`
                                    }
                                >
                                    Admin
                                </NavLink>
                                <button
                                    onClick={handleLogout}
                                    className="ml-2 text-xs px-3 py-1 rounded-full border border-slate-300 hover:border-primary hover:text-primary transition-colors"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <NavLink
                                to="/login"
                                className={({ isActive }) =>
                                    `${navLinkClasses} ${
                                        isActive ? "border-b-2 border-primary text-primary" : ""
                                    }`
                                }
                            >
                                Coach Login
                            </NavLink>
                        )}
                    </nav>
                </div>
            </header>

            {/* Main content */}
            <main className="flex-1">{children}</main>

            {/* Big footer similar to school site */}
            <footer className="bg-white border-t border-slate-200 mt-8">
                <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col items-center text-center text-xs md:text-[13px] text-slate-700 space-y-5">
                    {/* Logo */}
                    <img
                        src="/busche-logo.png"
                        alt="Busche Academy"
                        className="h-16 w-auto mb-2"
                    />

                    {/* Address + contact */}
                    <p className="tracking-wide">
                        40 Chester Street, Chester, New Hampshire 03036 · (603) 887-5200 ·{" "}
                        <a
                            href="mailto:info@buscheacademy.org"
                            className="underline underline-offset-2 hover:text-primary"
                        >
                            info@buscheacademy.org
                        </a>
                    </p>

                    {/* Non-discrimination / about blurb (paraphrased) */}
                    <p className="max-w-3xl leading-snug text-[11px] md:text-xs text-slate-500">
                        Busche Academy is a private coeducational boarding and day school in
                        Chester, New Hampshire, welcoming students from across the United
                        States and around the world. The school follows all applicable
                        federal and state laws and does not discriminate on the basis of
                        race, color, religion, sex, national origin, gender identity or
                        expression, or disability.
                    </p>

                    {/* Social icons */}
                    <div className="flex items-center gap-6 pt-2">
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
                                <path
                                    d="M13.5 4H15.5V7H14C13.17 7 13 7.42 13 8V10H15.5L15 13H13V20H10V13H8V10H10V7.5C10 5.57 11.07 4 13.5 4Z"
                                    fill="currentColor"
                                />
                            </svg>
                        </a>

                        {/* Twitter / X */}
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
                                    d="M6 4L11 11.3L6.2 20H8.8L12.4 13.7L16.3 20H18.9L13.9 12.5L18.5 4H15.9L12.6 9.9L9 4H6Z"
                                    fill="currentColor"
                                />
                            </svg>
                        </a>
                    </div>

                    {/* Bottom line */}
                    <div className="pt-3 text-[11px] md:text-xs text-slate-500 space-y-1">
                        <p>Busche Academy · Chester · New Hampshire, United States</p>
                        <p>
                            Copyright © {new Date().getFullYear()} Busche Academy. All Rights
                            Reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};
