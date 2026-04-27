// src/components/AdminDocumentManager.tsx
import { useEffect, useState } from "react";
import { adminDocumentApi } from "../api/adminDocumentApi";
import type { SiteDocumentDto } from "../types";

const DOCUMENT_SLOTS = [
    { key: "HS_CURRICULUM", label: "High School Curriculum" },
    { key: "PG_CURRICULUM", label: "PG / Postgraduate Curriculum" },
    { key: "CALENDAR", label: "Academic Calendar" },
    { key: "CATALOG", label: "Course Catalog" },
    { key: "DORM_POLICIES", label: "Dorm Policies & Guidelines" },
] as const;

type DocumentKey = (typeof DOCUMENT_SLOTS)[number]["key"];

export const AdminDocumentManager = () => {
    const [documents, setDocuments] = useState<SiteDocumentDto[]>([]);
    const [uploading, setUploading] = useState<string | null>(null);
    const [slotErrors, setSlotErrors] = useState<Record<string, string>>({});
    const [loadError, setLoadError] = useState<string | null>(null);

    const fetchDocuments = async () => {
        try {
            const data = await adminDocumentApi.getAll();
            setDocuments(data);
        } catch {
            setLoadError("Unable to load documents.");
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    const clearSlotError = (key: string) => {
        setSlotErrors((prev) => {
            const next = { ...prev };
            delete next[key];
            return next;
        });
    };

    const handleFileSelected = async (key: DocumentKey, file: File) => {
        clearSlotError(key);
        setUploading(key);

        try {
            await adminDocumentApi.upload(key, file);
            await fetchDocuments();
        } catch {
            setSlotErrors((prev) => ({
                ...prev,
                [key]: "Upload failed. Please try again.",
            }));
        } finally {
            setUploading(null);
        }
    };

    const handleDelete = async (key: DocumentKey) => {
        if (!window.confirm("Remove this document?")) return;

        clearSlotError(key);

        try {
            await adminDocumentApi.delete(key);
            await fetchDocuments();
        } catch {
            setSlotErrors((prev) => ({
                ...prev,
                [key]: "Delete failed. Please try again.",
            }));
        }
    };

    const getDoc = (key: string): SiteDocumentDto | undefined =>
        documents.find((d) => d.documentKey === key);

    const formatDate = (iso: string): string => {
        try {
            return new Date(iso).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
            });
        } catch {
            return iso;
        }
    };

    const truncateUrl = (url: string): string => {
        if (url.length <= 60) return url;
        return url.slice(0, 30) + "…" + url.slice(-20);
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-lg font-semibold text-slate-900">
                    Site Documents
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                    Upload PDF files for curriculum, calendar, catalog, and dorm
                    policies. Files are served directly to public visitors.
                </p>
            </div>

            {loadError && (
                <div className="rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-700">
                    {loadError}
                </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {DOCUMENT_SLOTS.map(({ key, label }) => {
                    const doc = getDoc(key);
                    const isUploaded = !!doc && !!doc.fileUrl;
                    const isCurrentlyUploading = uploading === key;
                    const slotError = slotErrors[key];

                    return (
                        <div
                            key={key}
                            className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col gap-2"
                        >
                            <p className="font-semibold text-slate-900 text-sm">
                                {label}
                            </p>

                            {isUploaded ? (
                                <>
                                    <p className="text-xs text-emerald-600 font-medium">
                                        Uploaded — {formatDate(doc.uploadedAt)}
                                    </p>
                                    <a
                                        href={doc.fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[11px] text-sky-600 hover:text-sky-700 underline underline-offset-2 break-all"
                                        title={doc.fileUrl}
                                    >
                                        {truncateUrl(doc.fileUrl)}
                                    </a>
                                </>
                            ) : (
                                <p className="text-xs text-slate-400">
                                    Not yet uploaded
                                </p>
                            )}

                            {slotError && (
                                <p className="text-[11px] text-rose-600">
                                    {slotError}
                                </p>
                            )}

                            <div className="flex items-center gap-2 mt-1">
                                <label
                                    className={`inline-flex items-center rounded-md border px-3 py-1.5 text-xs font-medium cursor-pointer transition-colors ${
                                        isCurrentlyUploading
                                            ? "border-sky-300 bg-sky-50 text-sky-500 cursor-not-allowed"
                                            : "border-sky-500 text-sky-700 hover:bg-sky-50"
                                    }`}
                                >
                                    <input
                                        type="file"
                                        accept=".pdf,application/pdf"
                                        className="hidden"
                                        disabled={isCurrentlyUploading}
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                handleFileSelected(key, file);
                                            }
                                            // Reset so the same file can be re-selected
                                            e.target.value = "";
                                        }}
                                    />
                                    {isCurrentlyUploading
                                        ? "Uploading…"
                                        : isUploaded
                                        ? "Replace"
                                        : "Upload PDF"}
                                </label>

                                {isUploaded && (
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(key)}
                                        disabled={isCurrentlyUploading}
                                        className="inline-flex items-center rounded-md border border-rose-500 text-xs text-rose-700 hover:bg-rose-50 px-3 py-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
