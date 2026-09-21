import { useState, useEffect, type ReactNode } from "react";
import { publicApi } from "../api/publicApi";
import type { SiteDocumentDto } from "../types";
import { FileText } from "@phosphor-icons/react";

interface DocumentLinkProps {
    documentKey: string;
    label: string;
    icon?: ReactNode;
}


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
                {icon ?? <FileText size={16} weight="duotone" className="shrink-0" aria-hidden="true" />}
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
            {icon ?? <FileText size={16} weight="duotone" className="shrink-0" aria-hidden="true" />}
            <span>{label}</span>
        </a>
    );
};
