import { useState, useEffect, type ReactNode } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const flatLinkClasses =
    "text-sm tracking-wide hover:text-primary transition-all duration-200 px-3 py-1.5 rounded-md hover:bg-slate-50";

interface DropdownItem {
    label: string;
    href: string;
}

interface DropdownNavItemProps {
    label: string;
    href: string;
    items: DropdownItem[];
}

const DropdownNavItem = ({ label, href, items }: DropdownNavItemProps) => {
    const [open, setOpen] = useState(false);

    return (
        <div
            className="relative"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
        >
            <Link
                to={href}
                className={`${flatLinkClasses} flex items-center gap-1 ${
                    open ? "text-primary bg-slate-50" : "text-slate-800"
                }`}
                aria-haspopup="true"
                aria-expanded={open}
            >
                {label}
                <svg
                    className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                >
                    <polyline points="6 9 12 15 18 9" />
                </svg>
            </Link>

            {open && (
                <div className="absolute top-full left-0 pt-1 w-44 z-50">
                    <div className="bg-white border border-slate-200 rounded-xl shadow-lg py-1">
                        {items.map((item) => (
                            <Link
                                key={item.href}
                                to={item.href}
                                className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors"
                                onClick={() => setOpen(false)}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

interface MobileAccordionItemProps {
    label: string;
    items: DropdownItem[];
    openId: string | null;
    setOpenId: (id: string | null) => void;
    onNavClose: () => void;
}

const MobileAccordionItem = ({
    label,
    items,
    openId,
    setOpenId,
    onNavClose,
}: MobileAccordionItemProps) => {
    const isOpen = openId === label;

    return (
        <div>
            <button
                type="button"
                className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-primary"
                onClick={() => setOpenId(isOpen ? null : label)}
                aria-expanded={isOpen}
            >
                {label}
                <svg
                    className={`h-3.5 w-3.5 transition-transform duration-200 ${isOpen ? "rotate-180 text-primary" : ""}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                >
                    <polyline points="6 9 12 15 18 9" />
                </svg>
            </button>

            {isOpen && (
                <div className="ml-4 mt-1 space-y-0.5">
                    {items.map((item) => (
                        <Link
                            key={item.href}
                            to={item.href}
                            className="block rounded-md px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-primary transition-colors"
                            onClick={onNavClose}
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

const ABOUT_ITEMS: DropdownItem[] = [
    { label: "Overview", href: "/about" },
    { label: "Faculty", href: "/about#faculty" },
    { label: "Contact", href: "/about#contact" },
];

const ADMISSIONS_ITEMS: DropdownItem[] = [
    { label: "How to Apply", href: "/admissions" },
    { label: "Tuition & Fees", href: "/admissions#tuition" },
];

const BASKETBALL_ITEMS: DropdownItem[] = [
    { label: "Program", href: "/basketball" },
    { label: "Coaches", href: "/basketball#coaches" },
    { label: "Media", href: "/basketball#media" },
];

export const Layout = ({ children }: { children: ReactNode }) => {
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const [mobileAccordionOpen, setMobileAccordionOpen] = useState<string | null>(null);

    // Body scroll lock — prevents page scroll while sidebar is open
    useEffect(() => {
        document.body.style.overflow = mobileNavOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [mobileNavOpen]);

    const handleLogout = () => {
        logout();
        navigate("/");
        setMobileNavOpen(false);
    };

    const closeMobileNav = () => {
        setMobileNavOpen(false);
        setMobileAccordionOpen(null);
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            {/* Top nav */}
            <header className="bg-white/90 backdrop-blur-md border-b border-slate-200/60 shadow-soft sticky top-0 z-30">
                <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
                    <Link to="/" className="flex items-center gap-3 group">
                        <img
                            src="/busche-logo.png"
                            alt="Busche Academy"
                            className="h-10 w-auto object-contain"
                        />
                        <span className="text-base font-bold text-slate-900 tracking-tight group-hover:text-primary transition-colors duration-200">
                            Busche Academy
                        </span>
                    </Link>

                    {/* Right side: desktop nav + mobile button */}
                    <div className="flex items-center gap-1">
                        {/* Desktop nav */}
                        <nav className="hidden md:flex items-center gap-0.5 text-slate-700">
                            <NavLink
                                to="/"
                                end
                                className={({ isActive }) =>
                                    `${flatLinkClasses} ${
                                        isActive ? "border-b-2 border-primary text-primary" : ""
                                    }`
                                }
                            >
                                Home
                            </NavLink>

                            <DropdownNavItem
                                label="About"
                                href="/about"
                                items={ABOUT_ITEMS}
                            />

                            <DropdownNavItem
                                label="Admissions"
                                href="/admissions"
                                items={ADMISSIONS_ITEMS}
                            />

                            <NavLink
                                to="/academics"
                                className={({ isActive }) =>
                                    `${flatLinkClasses} ${
                                        isActive ? "border-b-2 border-primary text-primary" : ""
                                    }`
                                }
                            >
                                Academics
                            </NavLink>

                            <NavLink
                                to="/student-life"
                                className={({ isActive }) =>
                                    `${flatLinkClasses} ${
                                        isActive ? "border-b-2 border-primary text-primary" : ""
                                    }`
                                }
                            >
                                Student Life
                            </NavLink>

                            <DropdownNavItem
                                label="Basketball"
                                href="/basketball"
                                items={BASKETBALL_ITEMS}
                            />

                            <NavLink
                                to="/roster"
                                className={({ isActive }) =>
                                    `${flatLinkClasses} ${
                                        isActive ? "border-b-2 border-primary text-primary" : ""
                                    }`
                                }
                            >
                                Roster
                            </NavLink>

                            <NavLink
                                to="/schedule"
                                className={({ isActive }) =>
                                    `${flatLinkClasses} ${
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
                                            `${flatLinkClasses} ${
                                                isActive ? "border-b-2 border-primary text-primary" : ""
                                            }`
                                        }
                                    >
                                        Admin
                                    </NavLink>
                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        className="ml-2 text-xs px-3.5 py-1.5 rounded-full border border-slate-300 text-slate-700 hover:border-primary hover:text-primary hover:bg-sky-50 transition-all duration-200"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <NavLink
                                    to="/login"
                                    className={({ isActive }) =>
                                        `${flatLinkClasses} ${
                                            isActive ? "border-b-2 border-primary text-primary" : ""
                                        }`
                                    }
                                >
                                    Faculty Login
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
            </header>

            {/* Mobile slide-over menu — sibling of header, NOT inside it */}
            <div
                className={`fixed inset-0 z-40 flex md:hidden transition-opacity duration-300 ${
                    mobileNavOpen
                        ? "opacity-100 pointer-events-auto"
                        : "opacity-0 pointer-events-none"
                }`}
            >
                {/* Backdrop */}
                <div
                    className="absolute inset-0 bg-slate-900/50"
                    onClick={closeMobileNav}
                />

                {/* Sliding panel — w-72, left accent stripe, dark gradient header */}
                <div
                    className={`relative ml-auto flex h-full w-72 flex-col bg-white shadow-xl border-l-4 border-primary transform transition-transform duration-300 ease-out ${
                        mobileNavOpen ? "translate-x-0" : "translate-x-full"
                    }`}
                >
                    {/* Panel header — dark gradient */}
                    <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-slate-900 to-slate-800">
                        <div className="flex items-center gap-2">
                            <img
                                src="/busche-logo.png"
                                alt="Busche Academy"
                                className="h-8 w-auto object-contain"
                            />
                            <span className="text-sm font-bold text-white">Busche Academy</span>
                        </div>
                        <button
                            type="button"
                            className="inline-flex items-center justify-center rounded-full border border-white/20 p-1.5 text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-slate-900"
                            onClick={closeMobileNav}
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

                    <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1 text-slate-800">
                        <NavLink
                            to="/"
                            end
                            className={({ isActive }) =>
                                `block rounded-md px-3 py-2 text-sm font-medium ${
                                    isActive
                                        ? "bg-primary/10 text-primary font-semibold border-l-2 border-primary pl-[10px]"
                                        : "hover:bg-slate-50 hover:text-primary"
                                }`
                            }
                            onClick={closeMobileNav}
                        >
                            Home
                        </NavLink>

                        <MobileAccordionItem
                            label="About"
                            items={ABOUT_ITEMS}
                            openId={mobileAccordionOpen}
                            setOpenId={setMobileAccordionOpen}
                            onNavClose={closeMobileNav}
                        />

                        <MobileAccordionItem
                            label="Admissions"
                            items={ADMISSIONS_ITEMS}
                            openId={mobileAccordionOpen}
                            setOpenId={setMobileAccordionOpen}
                            onNavClose={closeMobileNav}
                        />

                        <NavLink
                            to="/academics"
                            className={({ isActive }) =>
                                `block rounded-md px-3 py-2 text-sm font-medium ${
                                    isActive
                                        ? "bg-primary/10 text-primary font-semibold border-l-2 border-primary pl-[10px]"
                                        : "hover:bg-slate-50 hover:text-primary"
                                }`
                            }
                            onClick={closeMobileNav}
                        >
                            Academics
                        </NavLink>

                        <NavLink
                            to="/student-life"
                            className={({ isActive }) =>
                                `block rounded-md px-3 py-2 text-sm font-medium ${
                                    isActive
                                        ? "bg-primary/10 text-primary font-semibold border-l-2 border-primary pl-[10px]"
                                        : "hover:bg-slate-50 hover:text-primary"
                                }`
                            }
                            onClick={closeMobileNav}
                        >
                            Student Life
                        </NavLink>

                        <MobileAccordionItem
                            label="Basketball"
                            items={BASKETBALL_ITEMS}
                            openId={mobileAccordionOpen}
                            setOpenId={setMobileAccordionOpen}
                            onNavClose={closeMobileNav}
                        />

                        <NavLink
                            to="/roster"
                            className={({ isActive }) =>
                                `block rounded-md px-3 py-2 text-sm font-medium ${
                                    isActive
                                        ? "bg-primary/10 text-primary font-semibold border-l-2 border-primary pl-[10px]"
                                        : "hover:bg-slate-50 hover:text-primary"
                                }`
                            }
                            onClick={closeMobileNav}
                        >
                            Roster
                        </NavLink>

                        <NavLink
                            to="/schedule"
                            className={({ isActive }) =>
                                `block rounded-md px-3 py-2 text-sm font-medium ${
                                    isActive
                                        ? "bg-primary/10 text-primary font-semibold border-l-2 border-primary pl-[10px]"
                                        : "hover:bg-slate-50 hover:text-primary"
                                }`
                            }
                            onClick={closeMobileNav}
                        >
                            Schedule
                        </NavLink>

                        {/* Bottom auth section */}
                        <div className="mt-4 border-t border-slate-100 pt-4">
                            <div className="bg-slate-50 rounded-xl p-3">
                                {isAuthenticated ? (
                                    <>
                                        <NavLink
                                            to="/admin"
                                            className={({ isActive }) =>
                                                `block rounded-md px-3 py-2 text-sm font-medium ${
                                                    isActive
                                                        ? "bg-primary/10 text-primary font-semibold border-l-2 border-primary pl-[10px]"
                                                        : "hover:bg-white hover:text-primary"
                                                }`
                                            }
                                            onClick={closeMobileNav}
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
                                                    ? "bg-primary/10 text-primary font-semibold border-l-2 border-primary pl-[10px]"
                                                    : "hover:bg-white hover:text-primary"
                                            }`
                                        }
                                        onClick={closeMobileNav}
                                    >
                                        Faculty Login
                                    </NavLink>
                                )}
                            </div>
                        </div>
                    </nav>
                </div>
            </div>

            {/* Main content */}
            <main className="flex-1">{children}</main>

            {/* Footer — white with full content */}
            <footer className="bg-white border-t border-slate-200/80 mt-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
                    {/* Brand column */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <img
                                src="/busche-logo.png"
                                alt="Busche Academy"
                                className="h-10 w-auto"
                            />
                            <span className="text-base font-bold text-slate-900 tracking-tight">Busche Academy</span>
                        </div>
                        <p className="text-sm text-slate-500 leading-relaxed">
                            A private coeducational boarding and day school in Chester, New Hampshire,
                            welcoming students from across the United States and around the world.
                        </p>
                        <div className="flex items-center gap-4 pt-1">
                            <a
                                href="https://www.instagram.com/busche_academy_basketball_?igsh=cHVmbjNyNnRwajdl"
                                target="_blank"
                                rel="noreferrer"
                                aria-label="Instagram"
                                className="text-slate-400 hover:text-primary transition-colors"
                            >
                                <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                                    <rect x="3" y="3" width="18" height="18" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2" />
                                    <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
                                    <circle cx="17" cy="7" r="1.2" fill="currentColor" />
                                </svg>
                            </a>
                            <a
                                href="https://www.facebook.com/BuscheAcademy/?_rdr"
                                target="_blank"
                                rel="noreferrer"
                                aria-label="Facebook"
                                className="text-slate-400 hover:text-primary transition-colors"
                            >
                                <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                                    <rect x="3" y="3" width="18" height="18" rx="4" ry="4" fill="none" stroke="currentColor" strokeWidth="2" />
                                    <path d="M13.5 8H15V6h-1.5C11.57 6 10 7.57 10 9.9V11H8v2h2v5h2.5v-5H15v-2h-2.5V9.75C12.5 8.8 12.93 8 13.5 8z" fill="currentColor" />
                                </svg>
                            </a>
                            <a
                                href="https://x.com/BuscheAcademy?s=20&t=H53KEcbecPURoWMjmTtrcw"
                                target="_blank"
                                rel="noreferrer"
                                aria-label="X (Twitter)"
                                className="text-slate-400 hover:text-primary transition-colors"
                            >
                                <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                                    <path d="M6 4l5.5 7.3L6.2 20h2.8l3.4-5.6L16.3 20h2.8l-5.1-7.5L18.5 4h-2.8l-3.1 5.2L9 4H6z" fill="currentColor" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Quick links */}
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400 mb-4">Explore</p>
                        <ul className="space-y-2">
                            {[
                                { label: "About", href: "/about" },
                                { label: "Admissions", href: "/admissions" },
                                { label: "Academics", href: "/academics" },
                                { label: "Student Life", href: "/student-life" },
                                { label: "Basketball", href: "/basketball" },
                                { label: "Roster", href: "/roster" },
                                { label: "Schedule", href: "/schedule" },
                            ].map((l) => (
                                <li key={l.href}>
                                    <Link to={l.href} className="text-sm text-slate-600 hover:text-primary transition-colors">
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400 mb-4">Contact</p>
                        <address className="not-italic text-sm text-slate-600 space-y-1 leading-relaxed">
                            <p>40 Chester Street</p>
                            <p>Chester, NH 03036 · USA</p>
                            <p className="pt-1">
                                <a href="tel:+16038870001" className="hover:text-slate-900 transition-colors">(603) 887-0001</a>
                            </p>
                            <p>
                                <a href="mailto:info@buscheacademy.org" className="text-primary hover:text-sky-600 transition-colors">
                                    info@buscheacademy.org
                                </a>
                            </p>
                        </address>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="border-t border-slate-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
                        <p className="text-xs text-slate-400">
                            © {new Date().getFullYear()} Busche Academy. All Rights Reserved.
                        </p>
                        <p className="text-xs text-slate-400">
                            Chester · New Hampshire · United States
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};
