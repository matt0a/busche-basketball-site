import { useEffect, useState } from "react";
import { publicApi } from "../api/publicApi";
import type { DiningMenuDto } from "../types";

const UtensilsIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 3v7a2 2 0 002 2h0a2 2 0 002-2V3M6 12v9M15 3c-1.5 2-1.5 6 0 8v10" />
    </svg>
);

/**
 * Weekly and special-event dining menus, uploaded by staff via the admin dashboard.
 *
 * Self-fetching so that StudentLifePage can remain a pure JSX expression, matching
 * the approach already used by DocumentLink.
 */
export const DiningMenuBoard = () => {
    const [menus, setMenus] = useState<DiningMenuDto[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        publicApi
            .getDiningMenus()
            .then((result) => {
                if (!cancelled) setMenus(result);
            })
            .catch(() => {
                // Non-fatal: the section simply renders without a menu.
                if (!cancelled) setMenus([]);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, []);

    // Render nothing while loading, on error, or before the first menu is posted.
    if (loading || menus.length === 0) return null;

    return (
        <div className="mt-10">
            <div className="flex items-center gap-3 mb-5">
                <div className="bg-primary/10 text-primary rounded-xl p-2.5">
                    <UtensilsIcon />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Current Menus</h3>
            </div>

            <div className={`grid gap-6 ${menus.length > 1 ? "md:grid-cols-2" : "max-w-3xl"}`}>
                {menus.map((menu) => (
                    <a
                        key={menu.id}
                        href={menu.imageUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="group block rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-card hover:shadow-card-hover transition-shadow duration-250"
                    >
                        {/* object-contain and no fixed height: menu graphics are text-heavy
                            and must never be cropped the way the photos below are. */}
                        <img
                            src={menu.imageUrl}
                            alt={menu.title}
                            loading="lazy"
                            className="w-full h-auto object-contain bg-white"
                        />
                        <div className="flex items-center justify-between gap-3 px-4 py-3 border-t border-slate-100">
                            <p className="text-sm font-semibold text-slate-900">{menu.title}</p>
                            <span className="text-xs text-primary font-medium shrink-0 group-hover:underline">
                                View full size
                            </span>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
};
