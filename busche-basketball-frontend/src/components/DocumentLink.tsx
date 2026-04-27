import { useState, useEffect, type ReactNode } from "react";
import { publicApi } from "../api/publicApi";
import type { SiteDocumentDto } from "../types";

interface DocumentLinkProps {
    documentKey: string;
    label: string;
    icon?: ReactNode;
}

const PdfIcon = () => (
    <svg
        className="h-4 w-4 shrink-0"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="9" y1="13" x2="15" y2="13" />
        <line x1="9" y1="17" x2="15" y2="17" />
        <line x1="9" y1="9" x2="12" y2="9" />
    </svg>
);

export const DocumentLink = ({
    documentKey,
    label,
    icon,
}: DocumentLinkProps) => {
    const [doc, setDoc] = useState<SiteDocumentDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setError(false);

        publicApi
            .getDocument(documentKey)
            .then((result) => {
                if (!cancelled) setDoc(result);
            })
            .catch(() => {
                if (!cancelled) setError(true);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [documentKey]);

    if (loading) {
        return (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 animate-pulse">
                <div className="h-4 w-4 rounded bg-slate-200" />
                <div className="h-4 w-32 rounded bg-slate-200" />
            </div>
        );
    }

    const hasFile = !error && doc && doc.fileUrl && doc.fileUrl.trim() !== "";

    if (!hasFile) {
        return (
            <button
                type="button"
                disabled
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 text-slate-400 text-sm font-medium cursor-not-allowed"
            >
                {icon ?? <PdfIcon />}
                <span>{label}</span>
                <span className="text-xs text-slate-400">— Not yet available</span>
            </button>
        );
    }

    return (
        <a
            href={doc.fileUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
        >
            {icon ?? <PdfIcon />}
            <span>{label}</span>
        </a>
    );
};
