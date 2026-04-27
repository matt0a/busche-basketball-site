import { useState, useEffect, useRef } from "react";

/**
 * SectionNav — sticky quick-link bar for smooth autoscroll within a long page.
 *
 * Usage:
 *   <SectionNav sections={[{ id: "overview", label: "Overview" }, ...]} />
 *
 * Target sections should have style={{ scrollMarginTop: "80px" }} so the
 * sticky header does not overlap the section heading on scroll.
 */

interface Section {
    id: string;
    label: string;
}

interface SectionNavProps {
    sections: Section[];
}

export const SectionNav = ({ sections }: SectionNavProps) => {
    const [activeId, setActiveId] = useState<string | null>(
        sections.length > 0 ? sections[0].id : null,
    );
    const observerRef = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
        observerRef.current?.disconnect();

        observerRef.current = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                        break;
                    }
                }
            },
            { threshold: 0.3 },
        );

        sections.forEach(({ id }) => {
            const el = document.getElementById(id);
            if (el) observerRef.current?.observe(el);
        });

        return () => observerRef.current?.disconnect();
    }, [sections]);

    const handleClick = (id: string) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <nav className="sticky top-[64px] z-20 bg-white border-b border-slate-200">
            <div className="max-w-6xl mx-auto px-4 flex items-center gap-0 overflow-x-auto">
                {sections.map(({ id, label }) => {
                    const isActive = activeId === id;
                    return (
                        <button
                            key={id}
                            type="button"
                            onClick={() => handleClick(id)}
                            className={`text-sm font-medium px-4 py-3 whitespace-nowrap transition-colors ${
                                isActive
                                    ? "text-primary border-b-2 border-primary"
                                    : "text-slate-600 hover:text-primary"
                            }`}
                        >
                            {label}
                        </button>
                    );
                })}
            </div>
        </nav>
    );
};
