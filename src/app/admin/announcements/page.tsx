"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";

type Category = "General" | "Deadline" | "Results" | "Venue" | "Sponsors";

interface AnnouncementItem {
  _id: string;
  category: Category;
  date: string;
  title: string;
  copy: string;
  action?: string;
  href?: string;
  featured: boolean;
  closed: boolean;
  createdAt?: string;
}

const categories: Category[] = ["General", "Deadline", "Results", "Venue", "Sponsors"];

const categoryBadgeStyles: Record<Category, string> = {
  General: "bg-ink text-bg",
  Deadline: "bg-[#eabf48] text-ink",
  Results: "bg-accent text-ink",
  Venue: "bg-[#b6d8c0] text-ink",
  Sponsors: "bg-[#d8c1e8] text-ink",
};

export default function AdminAnnouncementsPage() {
  const [adminKey, setAdminKey] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [authChecking, setAuthChecking] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [items, setItems] = useState<AnnouncementItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; error?: boolean } | null>(null);

  // Form states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [category, setCategory] = useState<Category>("General");
  const [title, setTitle] = useState("");
  const [copy, setCopy] = useState("");
  const [date, setDate] = useState("");
  const [action, setAction] = useState("");
  const [href, setHref] = useState("");
  const [featured, setFeatured] = useState(false);
  const [closed, setClosed] = useState(false);
  const [isPending, startTransition] = useTransition();

  const verifyKey = async (key: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "x-admin-key": key.trim() },
      });
      const json = await res.json();
      return json;
    } catch {
      return { success: false, error: "Network error verifying passcode" };
    }
  };

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminKey.trim()) return;
    setAuthChecking(true);
    setAuthError(null);

    const res = await verifyKey(adminKey.trim());
    if (res.success) {
      localStorage.setItem("whackiest_admin_key", adminKey.trim());
      setIsUnlocked(true);
      fetchAnnouncements();
    } else {
      setAuthError(res.error || "Incorrect admin passcode. Access denied.");
    }
    setAuthChecking(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("whackiest_admin_key");
    setAdminKey("");
    setIsUnlocked(false);
    setAuthError(null);
  };

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/announcements");
      const json = await res.json();
      if (json.success) {
        setItems(json.data);
      } else {
        setStatusMessage({ text: json.error || "Failed to load announcements", error: true });
      }
    } catch {
      setStatusMessage({ text: "Network error loading announcements", error: true });
    } finally {
      setLoading(false);
    }
  };

  // Verify saved admin key on page load
  useEffect(() => {
    const saved = localStorage.getItem("whackiest_admin_key");
    if (saved) {
      verifyKey(saved).then((res) => {
        if (res.success) {
          setAdminKey(saved);
          setIsUnlocked(true);
          fetchAnnouncements();
        } else {
          localStorage.removeItem("whackiest_admin_key");
        }
      });
    }
    // runs once on mount; fetchAnnouncements only reads stable setters
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setCategory("General");
    setTitle("");
    setCopy("");
    setDate("");
    setAction("");
    setHref("");
    setFeatured(false);
    setClosed(false);
  };

  const startEdit = (item: AnnouncementItem) => {
    setEditingId(item._id);
    setCategory(item.category);
    setTitle(item.title);
    setCopy(item.copy);
    setDate(item.date);
    setAction(item.action || "");
    setHref(item.href || "");
    setFeatured(item.featured);
    setClosed(item.closed);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !copy.trim()) {
      setStatusMessage({ text: "Title and description are required.", error: true });
      return;
    }

    startTransition(async () => {
      try {
        const payload = {
          category,
          title: title.trim(),
          copy: copy.trim(),
          date: date.trim() || undefined,
          action: action.trim() || undefined,
          href: href.trim() || undefined,
          featured,
          closed,
        };

        const url = editingId
          ? `/api/announcements/${editingId}`
          : "/api/announcements";
        const method = editingId ? "PATCH" : "POST";

        const res = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
            "x-admin-key": adminKey.trim(),
          },
          body: JSON.stringify(payload),
        });

        const json = await res.json();
        if (json.success) {
          setStatusMessage({
            text: editingId ? "Announcement updated successfully!" : "Announcement published!",
          });
          resetForm();
          fetchAnnouncements();
        } else {
          setStatusMessage({ text: json.error || "Operation failed", error: true });
        }
      } catch {
        setStatusMessage({ text: "An error occurred while saving.", error: true });
      }
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this announcement?")) return;

    try {
      const res = await fetch(`/api/announcements/${id}`, {
        method: "DELETE",
        headers: { "x-admin-key": adminKey.trim() },
      });
      const json = await res.json();
      if (json.success) {
        setStatusMessage({ text: "Announcement deleted." });
        fetchAnnouncements();
      } else {
        setStatusMessage({ text: json.error || "Failed to delete", error: true });
      }
    } catch {
      setStatusMessage({ text: "Network error on delete", error: true });
    }
  };

  const handleToggleClosed = async (item: AnnouncementItem) => {
    try {
      const res = await fetch(`/api/announcements/${item._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey.trim(),
        },
        body: JSON.stringify({ closed: !item.closed }),
      });
      const json = await res.json();
      if (json.success) {
        fetchAnnouncements();
      }
    } catch {
      // silent
    }
  };

  const handleToggleFeatured = async (item: AnnouncementItem) => {
    try {
      const res = await fetch(`/api/announcements/${item._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey.trim(),
        },
        body: JSON.stringify({ featured: !item.featured }),
      });
      const json = await res.json();
      if (json.success) {
        fetchAnnouncements();
      }
    } catch {
      // silent
    }
  };

  const handleSeed = async () => {
    try {
      const res = await fetch("/api/announcements/seed", {
        method: "POST",
        headers: { "x-admin-key": adminKey.trim() },
      });
      const json = await res.json();
      setStatusMessage({ text: json.message || "Seeding complete!", error: !json.success });
      fetchAnnouncements();
    } catch {
      setStatusMessage({ text: "Error seeding announcements", error: true });
    }
  };

  // Lock Screen
  if (!isUnlocked) {
    return (
      <main className="min-h-screen bg-bg px-6 py-20 text-ink">
        <div className="mx-auto max-w-md border border-ink bg-bg p-8 shadow-[6px_6px_0_0_var(--color-accent)]">
          <p className="text-xs font-bold uppercase tracking-widest text-accent">Admin Portal</p>
          <h1 className="mt-2 text-2xl font-black uppercase tracking-tight">Announcements Manager</h1>
          <p className="mt-2 text-sm text-muted">
            Enter the admin secret key to publish or manage announcements.
          </p>
          {authError && (
            <div className="mt-4 border border-red-600 bg-red-100 p-3 text-xs font-bold text-red-900 shadow-[2px_2px_0_0_#1a1a1a]">
              {authError}
            </div>
          )}
          <form onSubmit={handleUnlock} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted">Admin Passcode</label>
              <input
                type="password"
                value={adminKey}
                onChange={(e) => {
                  setAdminKey(e.target.value);
                  if (authError) setAuthError(null);
                }}
                placeholder="Enter ADMIN_SECRET_KEY..."
                className="mt-2 w-full border border-ink bg-white/70 px-4 py-2.5 font-mono text-sm outline-none focus:bg-white focus:ring-2 focus:ring-accent"
                required
              />
            </div>
            <button
              type="submit"
              disabled={authChecking}
              className="w-full border border-ink bg-accent py-3 font-bold uppercase tracking-wider text-ink shadow-[3px_3px_0_0_var(--color-ink)] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 disabled:opacity-50"
            >
              {authChecking ? "Verifying..." : "Unlock Dashboard"}
            </button>
          </form>
          <div className="mt-6 text-center">
            <Link href="/announcements" className="text-xs font-bold uppercase tracking-wider text-muted hover:text-accent">
              ← Return to public site
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-bg px-6 py-12 text-ink">
      <div className="mx-auto max-w-6xl">
        {/* Top Header */}
        <div className="flex flex-col justify-between gap-4 border-b border-line pb-6 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
              <p className="text-xs font-bold uppercase tracking-widest text-accent">Admin Dispatch</p>
            </div>
            <h1 className="text-3xl font-black uppercase tracking-tight md:text-5xl">
              Announcements Manager
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/announcements"
              target="_blank"
              className="border border-ink bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors hover:bg-white"
            >
              View Public Page ↗
            </Link>
            <button
              onClick={handleLogout}
              className="border border-line px-3 py-2 text-xs font-bold uppercase tracking-wider text-muted hover:border-ink hover:text-ink"
            >
              Lock / Exit
            </button>
          </div>
        </div>

        {/* Status Toast */}
        {statusMessage && (
          <div
            className={`mt-6 flex items-center justify-between border p-4 text-sm font-semibold shadow-[3px_3px_0_0_#1a1a1a] ${
              statusMessage.error
                ? "border-red-600 bg-red-100 text-red-900"
                : "border-green-600 bg-green-100 text-green-900"
            }`}
          >
            <span>{statusMessage.text}</span>
            <button
              onClick={() => setStatusMessage(null)}
              className="text-xs font-bold uppercase hover:opacity-75"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Form Section */}
          <div className="lg:col-span-6">
            <div className="border border-ink bg-bg p-6 shadow-[5px_5px_0_0_var(--color-accent)]">
              <div className="flex items-center justify-between border-b border-line pb-4">
                <h2 className="text-lg font-black uppercase tracking-tight">
                  {editingId ? "Edit Announcement" : "Create New Announcement"}
                </h2>
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="text-xs font-bold text-accent underline"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                {/* Category & Date */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as Category)}
                      className="mt-1.5 w-full border border-ink bg-white px-3 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-accent"
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted">
                      Display Date (Optional)
                    </label>
                    <input
                      type="text"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      placeholder="for example, 29 October 2026 · 10:00 AM"
                      className="mt-1.5 w-full border border-ink bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent"
                    />
                    <span className="text-[10px] text-muted">Leave empty to auto-set current time</span>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Registrations for wHACKiest 2026 are now open"
                    className="mt-1.5 w-full border border-ink bg-white px-3 py-2 text-sm font-semibold outline-none focus:ring-2 focus:ring-accent"
                    required
                  />
                </div>

                {/* Copy */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted">
                    Description / Copy *
                  </label>
                  <textarea
                    rows={4}
                    value={copy}
                    onChange={(e) => setCopy(e.target.value)}
                    placeholder="Provide full details or instructions for hackathon participants..."
                    className="mt-1.5 w-full border border-ink bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent"
                    required
                  />
                </div>

                {/* Action Button & Link */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted">
                      Button Label (Optional)
                    </label>
                    <input
                      type="text"
                      value={action}
                      onChange={(e) => setAction(e.target.value)}
                      placeholder="e.g. Register now"
                      className="mt-1.5 w-full border border-ink bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted">
                      Button Link (Optional)
                    </label>
                    <input
                      type="text"
                      value={href}
                      onChange={(e) => setHref(e.target.value)}
                      placeholder="e.g. /register or https://..."
                      className="mt-1.5 w-full border border-ink bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                </div>

                {/* Toggles */}
                <div className="flex flex-wrap items-center gap-6 border-t border-line pt-4">
                  <label className="flex items-center gap-2 cursor-pointer text-sm font-bold">
                    <input
                      type="checkbox"
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                      className="h-4 w-4 accent-accent"
                    />
                    Featured / Pinned
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-sm font-bold">
                    <input
                      type="checkbox"
                      checked={closed}
                      onChange={(e) => setClosed(e.target.checked)}
                      className="h-4 w-4 accent-accent"
                    />
                    Mark as Closed / Past
                  </label>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full border border-ink bg-accent py-3 font-bold uppercase tracking-wider text-ink shadow-[4px_4px_0_0_var(--color-ink)] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 disabled:opacity-50"
                >
                  {isPending ? "Saving..." : editingId ? "Update Announcement" : "Publish Announcement"}
                </button>
              </form>
            </div>
          </div>

          {/* Live Preview & Existing Items Section */}
          <div className="space-y-8 lg:col-span-6">
            {/* Live Preview Card */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted">
                Live Preview
              </p>
              <div className="mt-3 border border-ink bg-bg p-6 shadow-[4px_4px_0_0_#1a1a1a]">
                <div className="flex items-center justify-between gap-4">
                  <span className={`inline-block px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${categoryBadgeStyles[category]}`}>
                    {category}
                  </span>
                  <span className="text-xs text-muted">
                    {date || "Just now"}
                  </span>
                </div>
                <h3 className="mt-3 text-lg font-bold tracking-tight">
                  {title || "Your Announcement Title Here"}
                </h3>
                <p className="mt-2 text-sm text-muted">
                  {copy || "Your announcement description will appear here as you type."}
                </p>
                {action && (
                  <div className="mt-4 inline-flex items-center gap-1.5 border border-ink bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-wider">
                    {action} ↗
                  </div>
                )}
                {featured && (
                  <div className="mt-3 inline-block rounded bg-accent/20 px-2 py-0.5 text-[10px] font-black uppercase text-accent">
                    ★ Featured
                  </div>
                )}
              </div>
            </div>

            {/* Existing Announcements List */}
            <div>
              <div className="flex items-center justify-between border-b border-line pb-3">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black uppercase tracking-tight">
                    Published Announcements ({items.length})
                  </h2>
                </div>
                {items.length === 0 && (
                  <button
                    onClick={handleSeed}
                    className="border border-ink bg-white px-2.5 py-1 text-xs font-bold uppercase tracking-wider hover:bg-accent"
                  >
                    Seed Initial Data
                  </button>
                )}
              </div>

              {loading ? (
                <p className="py-8 text-center text-sm text-muted">Loading announcements...</p>
              ) : items.length === 0 ? (
                <div className="border border-dashed border-line p-8 text-center">
                  <p className="text-sm font-semibold text-muted">No announcements in database yet.</p>
                  <p className="mt-1 text-xs text-muted">
                    Create one above, or click &quot;Seed Initial Data&quot; to import the existing sample announcements.
                  </p>
                </div>
              ) : (
                <div className="mt-4 space-y-4 max-h-[600px] overflow-y-auto pr-2">
                  {items.map((item) => (
                    <div
                      key={item._id}
                      className={`border border-ink p-4 transition-all ${
                        item.featured
                          ? "bg-white/70 shadow-[3px_3px_0_0_var(--color-accent)]"
                          : "bg-white/40"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${categoryBadgeStyles[item.category]}`}>
                            {item.category}
                          </span>
                          {item.featured && (
                            <span className="text-[10px] font-bold uppercase text-accent">
                              ★ Featured
                            </span>
                          )}
                          {item.closed && (
                            <span className="text-[10px] font-bold uppercase text-muted line-through">
                              Closed
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-muted">{item.date}</span>
                      </div>

                      <h4 className="mt-2 text-sm font-bold tracking-tight">{item.title}</h4>
                      <p className="mt-1 line-clamp-2 text-xs text-muted">{item.copy}</p>

                      <div className="mt-3 flex items-center justify-between border-t border-line/60 pt-2 text-xs">
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleToggleFeatured(item)}
                            className="font-bold text-muted hover:text-accent"
                          >
                            {item.featured ? "Unfeature" : "Feature"}
                          </button>
                          <button
                            onClick={() => handleToggleClosed(item)}
                            className="font-bold text-muted hover:text-ink"
                          >
                            {item.closed ? "Reopen" : "Close"}
                          </button>
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={() => startEdit(item)}
                            className="font-bold text-ink underline hover:text-accent"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="font-bold text-red-600 hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
