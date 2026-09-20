import { useEffect, useState } from "react";
import { adminDiningMenuApi } from "../api/adminDiningMenuApi";
import { clearDiningMenusCache } from "../lib/ttlCache";
import type { DiningMenuDto } from "../types";

export const AdminDiningMenuManager = () => {
    const [menus, setMenus] = useState<DiningMenuDto[]>([]);
    const [loadError, setLoadError] = useState<string | null>(null);

    const [title, setTitle] = useState("");
    const [displayOrder, setDisplayOrder] = useState("");
    const [file, setFile] = useState<File | null>(null);

    const [uploading, setUploading] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);
    const [status, setStatus] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const loadMenus = () =>
        adminDiningMenuApi
            .getAll()
            .then((data) => {
                setMenus(data);
                setLoadError(null);
            })
            .catch(() => setLoadError("Could not load dining menus."));

    useEffect(() => {
        void loadMenus();
    }, []);

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

    const handleUpload = async () => {
        if (!file || !title.trim()) return;

        setUploading(true);
        setFormError(null);
        setStatus(null);

        try {
            await adminDiningMenuApi.create(
                title.trim(),
                file,
                displayOrder.trim() ? Number(displayOrder) : undefined,
            );
            clearDiningMenusCache();
            await loadMenus();
            setTitle("");
            setDisplayOrder("");
            setFile(null);
            setStatus("Menu uploaded.");
        } catch {
            setFormError(
                "Upload failed. Check that the file is a JPEG, PNG, or WebP image under 10MB.",
            );
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (menu: DiningMenuDto) => {
        if (!window.confirm(`Remove "${menu.title}"?`)) return;

        setDeletingId(menu.id);
        setFormError(null);

        try {
            await adminDiningMenuApi.delete(menu.id);
            clearDiningMenusCache();
            await loadMenus();
            setStatus("Menu removed.");
        } catch {
            setFormError("Could not remove that menu. Please try again.");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-lg font-semibold text-slate-900">Dining Menus</h2>
                <p className="mt-1 text-sm text-slate-500">
                    Upload the weekly dinner menu and any special event menus. These
                    appear in the Dining section of the Student Life page as soon as they
                    are uploaded.
                </p>
            </div>

            {loadError && (
                <div className="rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-700">
                    {loadError}
                </div>
            )}

            {/* Add a menu */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-4">
                <h3 className="text-sm font-semibold text-slate-900">Add a menu</h3>

                <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                        Title
                    </label>
                    <input
                        type="text"
                        className="input"
                        value={title}
                        maxLength={120}
                        placeholder="Week Ending 9/20/26"
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                        Display order
                    </label>
                    <input
                        type="number"
                        className="input"
                        value={displayOrder}
                        placeholder="0"
                        onChange={(e) => setDisplayOrder(e.target.value)}
                    />
                    <p className="mt-1 text-xs text-slate-500">
                        Lower numbers appear first. Leave blank for 0.
                    </p>
                </div>

                <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                        Menu image
                    </label>
                    <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                        className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-slate-700 hover:file:bg-slate-200"
                    />
                    <p className="mt-1 text-xs text-slate-500">
                        JPEG, PNG, or WebP. Landscape menu graphics display best.
                    </p>
                </div>

                {formError && (
                    <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
                        {formError}
                    </div>
                )}

                {status && !formError && (
                    <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
                        {status}
                    </div>
                )}

                <button
                    type="button"
                    className="btn-primary"
                    disabled={uploading || !file || !title.trim()}
                    onClick={() => void handleUpload()}
                >
                    {uploading ? "Uploading…" : "Add menu"}
                </button>
            </div>

            {/* Existing menus */}
            <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-3">
                    Posted menus
                </h3>

                {menus.length === 0 ? (
                    <p className="text-sm text-slate-500">No menus uploaded yet.</p>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2">
                        {menus.map((menu) => (
                            <div
                                key={menu.id}
                                className="bg-white border border-slate-200 rounded-xl p-4 space-y-3"
                            >
                                <img
                                    src={menu.imageUrl}
                                    alt={menu.title}
                                    className="w-full h-32 object-contain bg-slate-50 rounded-lg border border-slate-200"
                                />
                                <div>
                                    <p className="text-sm font-semibold text-slate-900">
                                        {menu.title}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        Order {menu.displayOrder} · Uploaded{" "}
                                        {formatDate(menu.uploadedAt)}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <a
                                        href={menu.imageUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-xs font-medium text-primary hover:underline"
                                    >
                                        View
                                    </a>
                                    <button
                                        type="button"
                                        className="text-xs font-medium text-rose-600 hover:underline disabled:opacity-50"
                                        disabled={deletingId === menu.id}
                                        onClick={() => void handleDelete(menu)}
                                    >
                                        {deletingId === menu.id ? "Removing…" : "Remove"}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
