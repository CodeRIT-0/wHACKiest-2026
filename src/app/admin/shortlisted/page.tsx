"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { TRACKS } from "@/components/sections/tracks/track-data";

type Status = "Shortlisted" | "Waitlisted";

interface TeamItem {
  _id: string;
  teamName: string;
  institution: string;
  city?: string;
  track?: string;
  leader?: string;
  status: Status;
  published: boolean;
}

type Draft = Omit<TeamItem, "_id">;

const EMPTY: Draft = { teamName: "", institution: "", city: "", track: "", leader: "", status: "Shortlisted", published: false };
const TRACK_NAMES = TRACKS.map((t) => t.title);
const KEY_STORAGE = "whackiest_admin_key";

const input = "mt-1.5 w-full border border-ink bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent";
const label = "block text-xs font-bold uppercase tracking-wider text-muted";

// "Team, Institution, City, Track, Leader" per line; only the first two are required
function parseBulk(text: string, status: Status) {
  const teams: Draft[] = [];
  const errors: number[] = [];
  text.split(/\r?\n/).forEach((line, i) => {
    if (!line.trim()) return;
    const [teamName = "", institution = "", city = "", track = "", leader = ""] = line.split(/\t|,/).map((s) => s.trim());
    if (!teamName || !institution) errors.push(i + 1);
    else teams.push({ teamName, institution, city, track, leader, status, published: false });
  });
  return { teams, errors };
}

export default function AdminShortlistedPage() {
  const [adminKey, setAdminKey] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [authChecking, setAuthChecking] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [items, setItems] = useState<TeamItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; error?: boolean } | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [bulk, setBulk] = useState("");
  const [bulkStatus, setBulkStatus] = useState<Status>("Shortlisted");
  const [isPending, startTransition] = useTransition();

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => setDraft((d) => ({ ...d, [key]: value }));

  const api = (url: string, init: RequestInit = {}, key = adminKey) =>
    fetch(url, { ...init, headers: { "Content-Type": "application/json", "x-admin-key": key.trim(), ...init.headers } }).then((r) => r.json());

  const verifyKey = async (key: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch("/api/admin/verify", { method: "POST", headers: { "x-admin-key": key.trim() } });
      return await res.json();
    } catch {
      return { success: false, error: "Network error verifying passcode" };
    }
  };

  const fetchTeams = async (key = adminKey) => {
    setLoading(true);
    try {
      const json = await api("/api/shortlisted", {}, key);
      if (json.success) setItems(json.data);
      else setStatusMessage({ text: json.error || "Failed to load teams", error: true });
    } catch {
      setStatusMessage({ text: "Network error loading teams", error: true });
    } finally {
      setLoading(false);
    }
  };

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminKey.trim()) return;
    setAuthChecking(true);
    setAuthError(null);
    const res = await verifyKey(adminKey);
    if (res.success) {
      localStorage.setItem(KEY_STORAGE, adminKey.trim());
      setIsUnlocked(true);
      fetchTeams();
    } else {
      setAuthError(res.error || "Incorrect admin passcode. Access denied.");
    }
    setAuthChecking(false);
  };

  const handleLogout = () => {
    localStorage.removeItem(KEY_STORAGE);
    setAdminKey("");
    setIsUnlocked(false);
    setAuthError(null);
  };

  // reuse the passcode saved by either admin page
  useEffect(() => {
    const saved = localStorage.getItem(KEY_STORAGE);
    if (!saved) return;
    verifyKey(saved).then((res) => {
      if (res.success) {
        setAdminKey(saved);
        setIsUnlocked(true);
        fetchTeams(saved);
      } else {
        localStorage.removeItem(KEY_STORAGE);
      }
    });
    // runs once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setDraft(EMPTY);
  };

  const startEdit = (item: TeamItem) => {
    setEditingId(item._id);
    setDraft({
      teamName: item.teamName,
      institution: item.institution,
      city: item.city || "",
      track: item.track || "",
      leader: item.leader || "",
      status: item.status,
      published: item.published,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.teamName.trim() || !draft.institution.trim()) {
      setStatusMessage({ text: "Team name and institution are required.", error: true });
      return;
    }
    startTransition(async () => {
      try {
        const json = await api(editingId ? `/api/shortlisted/${editingId}` : "/api/shortlisted", {
          method: editingId ? "PATCH" : "POST",
          body: JSON.stringify(draft),
        });
        if (json.success) {
          setStatusMessage({ text: editingId ? "Team updated." : "Team added." });
          resetForm();
          fetchTeams();
        } else setStatusMessage({ text: json.error || "Operation failed", error: true });
      } catch {
        setStatusMessage({ text: "An error occurred while saving.", error: true });
      }
    });
  };

  const handleBulk = () => {
    const { teams, errors } = parseBulk(bulk, bulkStatus);
    if (errors.length) {
      setStatusMessage({ text: `Line ${errors.join(", ")} needs at least a team name and an institution.`, error: true });
      return;
    }
    if (!teams.length) return;
    startTransition(async () => {
      try {
        const json = await api("/api/shortlisted", { method: "POST", body: JSON.stringify({ teams }) });
        if (json.success) {
          setStatusMessage({ text: `Added ${teams.length} teams (hidden until published).` });
          setBulk("");
          fetchTeams();
        } else setStatusMessage({ text: json.error || "Bulk add failed", error: true });
      } catch {
        setStatusMessage({ text: "An error occurred while adding teams.", error: true });
      }
    });
  };

  const patchTeam = async (id: string, body: Partial<Draft>) => {
    try {
      const json = await api(`/api/shortlisted/${id}`, { method: "PATCH", body: JSON.stringify(body) });
      if (json.success) fetchTeams();
      else setStatusMessage({ text: json.error || "Update failed", error: true });
    } catch {
      setStatusMessage({ text: "Network error on update", error: true });
    }
  };

  const handleDelete = async (item: TeamItem) => {
    if (!confirm(`Remove "${item.teamName}" from the list?`)) return;
    try {
      const json = await api(`/api/shortlisted/${item._id}`, { method: "DELETE" });
      if (json.success) {
        setStatusMessage({ text: "Team removed." });
        fetchTeams();
      } else setStatusMessage({ text: json.error || "Failed to delete", error: true });
    } catch {
      setStatusMessage({ text: "Network error on delete", error: true });
    }
  };

  const publishAll = async (published: boolean) => {
    if (!confirm(published ? "Publish every team on the public /shortlisted page?" : "Hide every team from the public page?")) return;
    try {
      const json = await api("/api/shortlisted", { method: "PATCH", body: JSON.stringify({ published }) });
      if (json.success) {
        setStatusMessage({ text: published ? "All teams are now public." : "All teams are now hidden." });
        fetchTeams();
      } else setStatusMessage({ text: json.error || "Update failed", error: true });
    } catch {
      setStatusMessage({ text: "Network error on update", error: true });
    }
  };

  const publishedCount = items.filter((t) => t.published).length;
  const bulkPreview = bulk.trim() ? parseBulk(bulk, bulkStatus) : null;

  if (!isUnlocked) {
    return (
      <main className="min-h-screen bg-bg px-6 py-20 text-ink">
        <div className="mx-auto max-w-md border border-ink bg-bg p-8 shadow-[6px_6px_0_0_var(--color-accent)]">
          <p className="text-xs font-bold uppercase tracking-widest text-accent">Admin Portal</p>
          <h1 className="mt-2 text-2xl font-black uppercase tracking-tight">Shortlist Manager</h1>
          <p className="mt-2 text-sm text-muted">Enter the admin secret key to add, publish or manage shortlisted teams.</p>
          {authError && (
            <div className="mt-4 border border-red-600 bg-red-100 p-3 text-xs font-bold text-red-900 shadow-[2px_2px_0_0_#1a1a1a]">{authError}</div>
          )}
          <form onSubmit={handleUnlock} className="mt-6 space-y-4">
            <div>
              <label className={label}>Admin Passcode</label>
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
            <Link href="/shortlisted" className="text-xs font-bold uppercase tracking-wider text-muted hover:text-accent">
              ← Return to public page
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-bg px-6 py-12 text-ink">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-4 border-b border-line pb-6 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-accent" />
              <p className="text-xs font-bold uppercase tracking-widest text-accent">Admin Results</p>
            </div>
            <h1 className="text-3xl font-black uppercase tracking-tight md:text-5xl">Shortlist Manager</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/shortlisted" target="_blank" className="border border-ink bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors hover:bg-white">
              View Public Page ↗
            </Link>
            <button onClick={handleLogout} className="border border-line px-3 py-2 text-xs font-bold uppercase tracking-wider text-muted hover:border-ink hover:text-ink">
              Lock / Exit
            </button>
          </div>
        </div>

        {statusMessage && (
          <div
            className={`mt-6 flex items-center justify-between border p-4 text-sm font-semibold shadow-[3px_3px_0_0_#1a1a1a] ${
              statusMessage.error ? "border-red-600 bg-red-100 text-red-900" : "border-green-600 bg-green-100 text-green-900"
            }`}
          >
            <span>{statusMessage.text}</span>
            <button onClick={() => setStatusMessage(null)} className="text-xs font-bold uppercase hover:opacity-75">
              Dismiss
            </button>
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="space-y-8 lg:col-span-6">
            {/* single team */}
            <div className="border border-ink bg-bg p-6 shadow-[5px_5px_0_0_var(--color-accent)]">
              <div className="flex items-center justify-between border-b border-line pb-4">
                <h2 className="text-lg font-black uppercase tracking-tight">{editingId ? "Edit Team" : "Add a Team"}</h2>
                {editingId && (
                  <button type="button" onClick={resetForm} className="text-xs font-bold text-accent underline">
                    Cancel Edit
                  </button>
                )}
              </div>
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className={label}>Team Name *</label>
                    <input value={draft.teamName} onChange={(e) => set("teamName", e.target.value)} placeholder="e.g. Null Pointers" className={`${input} font-semibold`} required />
                  </div>
                  <div>
                    <label className={label}>Team Leader</label>
                    <input value={draft.leader} onChange={(e) => set("leader", e.target.value)} placeholder="Optional" className={input} />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className={label}>Institution *</label>
                    <input value={draft.institution} onChange={(e) => set("institution", e.target.value)} placeholder="e.g. Ramaiah Institute of Technology" className={input} required />
                  </div>
                  <div>
                    <label className={label}>City</label>
                    <input value={draft.city} onChange={(e) => set("city", e.target.value)} placeholder="e.g. Bengaluru" className={input} />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className={label}>Track</label>
                    <select value={draft.track} onChange={(e) => set("track", e.target.value)} className={`${input} font-bold`}>
                      <option value="">No track</option>
                      {TRACK_NAMES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                      {draft.track && !TRACK_NAMES.includes(draft.track) && <option value={draft.track}>{draft.track}</option>}
                    </select>
                  </div>
                  <div>
                    <label className={label}>Status</label>
                    <select value={draft.status} onChange={(e) => set("status", e.target.value as Status)} className={`${input} font-bold`}>
                      <option value="Shortlisted">Shortlisted</option>
                      <option value="Waitlisted">Waitlisted</option>
                    </select>
                  </div>
                </div>
                <label className="flex cursor-pointer items-center gap-2 border-t border-line pt-4 text-sm font-bold">
                  <input type="checkbox" checked={draft.published} onChange={(e) => set("published", e.target.checked)} className="h-4 w-4 accent-accent" />
                  Show on the public page
                </label>
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full border border-ink bg-accent py-3 font-bold uppercase tracking-wider text-ink shadow-[4px_4px_0_0_var(--color-ink)] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 disabled:opacity-50"
                >
                  {isPending ? "Saving..." : editingId ? "Update Team" : "Add Team"}
                </button>
              </form>
            </div>

            {/* many teams at once */}
            <div className="border border-ink bg-bg p-6">
              <h2 className="border-b border-line pb-4 text-lg font-black uppercase tracking-tight">Bulk Add</h2>
              <p className="mt-4 text-sm text-muted">
                One team per line: <span className="font-mono text-xs text-ink">Team, Institution, City, Track, Leader</span>. Only the first two are required.
                Columns pasted from a spreadsheet work too. Teams added here stay hidden until you publish them.
              </p>
              <textarea
                rows={6}
                value={bulk}
                onChange={(e) => setBulk(e.target.value)}
                placeholder={"Null Pointers, Ramaiah Institute of Technology, Bengaluru, AI & Beyond, Asha Rao\nByte Club, PES University, Bengaluru"}
                className={`${input} font-mono text-xs`}
              />
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted">
                  Add as
                  <select value={bulkStatus} onChange={(e) => setBulkStatus(e.target.value as Status)} className="border border-ink bg-white px-2 py-1 text-xs font-bold text-ink outline-none">
                    <option value="Shortlisted">Shortlisted</option>
                    <option value="Waitlisted">Waitlisted</option>
                  </select>
                </label>
                <button
                  type="button"
                  onClick={handleBulk}
                  disabled={isPending || !bulkPreview?.teams.length}
                  className="border border-ink bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors hover:bg-accent disabled:opacity-50"
                >
                  {bulkPreview?.teams.length ? `Add ${bulkPreview.teams.length} teams` : "Add teams"}
                </button>
              </div>
              {bulkPreview && bulkPreview.errors.length > 0 && (
                <p className="mt-3 text-xs font-bold text-red-700">Line {bulkPreview.errors.join(", ")} is missing a team name or institution.</p>
              )}
            </div>
          </div>

          {/* the list */}
          <div className="lg:col-span-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3">
              <h2 className="text-lg font-black uppercase tracking-tight">
                Teams ({items.length}) <span className="text-sm font-bold text-muted">· {publishedCount} public</span>
              </h2>
              {items.length > 0 && (
                <div className="flex gap-2">
                  <button onClick={() => publishAll(true)} className="border border-ink bg-accent px-2.5 py-1 text-xs font-bold uppercase tracking-wider">
                    Publish all
                  </button>
                  <button onClick={() => publishAll(false)} className="border border-ink bg-white px-2.5 py-1 text-xs font-bold uppercase tracking-wider hover:bg-[#e7dfd0]">
                    Hide all
                  </button>
                </div>
              )}
            </div>

            {loading && items.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted">Loading teams...</p>
            ) : items.length === 0 ? (
              <div className="mt-4 border border-dashed border-line p-8 text-center">
                <p className="text-sm font-semibold text-muted">No teams yet.</p>
                <p className="mt-1 text-xs text-muted">Add one with the form, or paste the whole list into Bulk Add.</p>
              </div>
            ) : (
              <div className="mt-4 max-h-[900px] space-y-3 overflow-y-auto pr-2">
                {items.map((item) => (
                  <div key={item._id} className={`border p-4 ${item.published ? "border-ink bg-white/70" : "border-dashed border-line bg-white/30"}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-bold tracking-tight">{item.teamName}</h3>
                        <p className="truncate text-xs text-muted">
                          {item.institution}
                          {item.city && `, ${item.city}`}
                          {item.leader && ` · ${item.leader}`}
                        </p>
                      </div>
                      <div className="flex shrink-0 flex-wrap justify-end gap-1.5">
                        {item.track && <span className="border border-ink px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">{item.track}</span>}
                        <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${item.status === "Shortlisted" ? "bg-accent text-ink" : "bg-[#eabf48] text-ink"}`}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between border-t border-line/60 pt-2 text-xs">
                      <div className="flex gap-3">
                        <button onClick={() => patchTeam(item._id, { published: !item.published })} className="font-bold text-muted hover:text-accent">
                          {item.published ? "● Public · Hide" : "○ Hidden · Publish"}
                        </button>
                        <button
                          onClick={() => patchTeam(item._id, { status: item.status === "Shortlisted" ? "Waitlisted" : "Shortlisted" })}
                          className="font-bold text-muted hover:text-ink"
                        >
                          {item.status === "Shortlisted" ? "Move to waitlist" : "Move to shortlist"}
                        </button>
                      </div>
                      <div className="flex gap-3">
                        <button onClick={() => startEdit(item)} className="font-bold text-ink underline hover:text-accent">
                          Edit
                        </button>
                        <button onClick={() => handleDelete(item)} className="font-bold text-red-600 hover:underline">
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
    </main>
  );
}
