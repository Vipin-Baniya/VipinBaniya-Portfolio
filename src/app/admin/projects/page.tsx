"use client";
import { useEffect, useState } from "react";
import { Project } from "@/types";
import { Plus, Pencil, Trash2, Star, Github, ExternalLink, Eye } from "lucide-react";
import { Field, Input, Textarea, Select, Toggle, TagInput, FormActions } from "@/components/admin/FormFields";

const EMPTY: Partial<Project> = {
  title: "", slug: "", description: "", longDescription: "",
  githubOwner: "", githubRepo: "", branch: "main",
  techStack: [], banner: "", liveUrl: "",
  architectureUrl: "", architectureDiagram: "",
  featured: false, status: "active",
};

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [form, setForm] = useState<Partial<Project>>(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  async function load() {
    const r = await fetch("/api/projects");
    const d = await r.json(); if (Array.isArray(d)) setProjects(d);
  }
  useEffect(() => { load(); }, []);

  function set(key: keyof Project, value: unknown) {
    setForm(f => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const method = editing ? "PATCH" : "POST";
    const url = editing ? `/api/projects/${editing}` : "/api/projects";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setLoading(false);
    setShowForm(false);
    setEditing(null);
    setForm(EMPTY);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this project?")) return;
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    load();
  }

  async function moveItem(id: string, dir: -1 | 1) {
    const idx = projects.findIndex(p => p._id === id);
    const other = projects[idx + dir];
    if (!other) return;
    await Promise.all([
      fetch(`/api/projects/${id}`,       { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ order: other.order }) }),
      fetch(`/api/projects/${other._id}`,{ method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ order: projects[idx].order }) }),
    ]);
    load();
  }

  function startEdit(p: Project) {
    setForm(p);
    setEditing(p._id);
    setShowForm(true);
  }

  const STATUS_COLOR: Record<string, string> = {
    active: "text-green", completed: "text-blue-400", research: "text-purple-400",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-text">Projects</h1>
          <p className="text-muted text-sm">{projects.length} total</p>
        </div>
        <button onClick={() => { setForm(EMPTY); setEditing(null); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-green text-bg rounded-lg text-sm font-bold hover:opacity-90 transition-opacity">
          <Plus size={14} /> Add Project
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6 mb-6 space-y-4">
          <h2 className="font-bold text-text mb-4">{editing ? "Edit Project" : "New Project"}</h2>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Title *">
              <Input value={form.title || ""} onChange={v => set("title", v)} required />
            </Field>
            <Field label="Slug" hint="Auto-generated if empty">
              <Input value={form.slug || ""} onChange={v => set("slug", v)} placeholder="my-project" />
            </Field>
          </div>

          <Field label="Description">
            <Input value={form.description || ""} onChange={v => set("description", v)} placeholder="Short description" />
          </Field>

          <Field label="Long Description">
            <Textarea value={form.longDescription || ""} onChange={v => set("longDescription", v)} rows={4} placeholder="Detailed description, architecture notes..." />
          </Field>

          <div className="grid grid-cols-3 gap-4">
            <Field label="GitHub Owner">
              <Input value={form.githubOwner || ""} onChange={v => set("githubOwner", v)} placeholder="username" />
            </Field>
            <Field label="GitHub Repo">
              <Input value={form.githubRepo || ""} onChange={v => set("githubRepo", v)} placeholder="repo-name" />
            </Field>
            <Field label="Branch">
              <Input value={form.branch || "main"} onChange={v => set("branch", v)} placeholder="main" />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Live URL">
              <Input value={form.liveUrl || ""} onChange={v => set("liveUrl", v)} placeholder="https://..." />
            </Field>
            <Field label="Banner URL">
              <Input value={form.banner || ""} onChange={v => set("banner", v)} placeholder="https://..." />
            </Field>
          </div>

          <Field label="Tech Stack" hint="Type and press Enter to add">
            <TagInput tags={form.techStack || []} onChange={tags => set("techStack", tags)} placeholder="e.g. Next.js" />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Architecture Image URL" hint="System diagram image (optional)">
              <Input value={form.architectureUrl || ""} onChange={v => set("architectureUrl", v)} placeholder="https://..." />
            </Field>
            <Field label="Architecture Description" hint="Mermaid code or plain text system description">
              <Input value={form.architectureDiagram || ""} onChange={v => set("architectureDiagram", v)} placeholder="Frontend → API → MongoDB..." />
            </Field>
          </div>

          <div className="flex gap-6">
            <Field label="Status">
              <Select value={form.status || "active"} onChange={v => set("status", v)} options={[
                { value: "active", label: "Active" },
                { value: "completed", label: "Completed" },
                { value: "research", label: "Research" },
              ]} />
            </Field>
            <div className="flex items-end pb-2">
              <Toggle label="Featured" value={form.featured || false} onChange={v => set("featured", v)} />
            </div>
          </div>

          <FormActions loading={loading} onCancel={() => { setShowForm(false); setEditing(null); setForm(EMPTY); }} />
        </form>
      )}

      {/* List */}
      {projects.length === 0 ? (
        <div className="bg-card border border-dashed border-border rounded-xl p-12 text-center">
          <p className="text-dim text-sm">No projects yet. Add your first project above.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map(p => (
            <div key={p._id} className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
              {p.banner
                ? <img src={p.banner} alt={p.title} className="w-14 h-10 rounded-lg object-cover shrink-0" />
                : <div className="w-14 h-10 rounded-lg bg-green/10 flex items-center justify-center shrink-0 font-mono text-green/30 text-xs">{"{}"}</div>
              }
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-text text-sm">{p.title}</span>
                  {p.featured && <Star size={12} className="text-yellow-400 fill-yellow-400" />}
                  <span className={`font-mono text-[10px] capitalize ${STATUS_COLOR[p.status]}`}>{p.status}</span>
                </div>
                <p className="text-dim text-xs truncate">{p.description}</p>
              </div>
              <div className="flex items-center gap-1.5 text-dim shrink-0">
                <Eye size={12} />
                <span className="font-mono text-[11px]">{(p.views || 0).toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {p.githubRepo && (
                  <a href={`https://github.com/${p.githubOwner}/${p.githubRepo}`} target="_blank" rel="noreferrer"
                    className="text-dim hover:text-text transition-colors"><Github size={14} /></a>
                )}
                {p.liveUrl && (
                  <a href={p.liveUrl} target="_blank" rel="noreferrer"
                    className="text-dim hover:text-text transition-colors"><ExternalLink size={14} /></a>
                )}
                <button onClick={() => moveItem(p._id, -1)} disabled={projects.indexOf(p) === 0} title="Move up"
                  className="text-dim hover:text-text disabled:opacity-20 transition-colors p-1 font-mono text-[10px]">▲</button>
                <button onClick={() => moveItem(p._id, 1)} disabled={projects.indexOf(p) === projects.length - 1} title="Move down"
                  className="text-dim hover:text-text disabled:opacity-20 transition-colors p-1 font-mono text-[10px]">▼</button>
                <button onClick={() => startEdit(p)} className="text-dim hover:text-green transition-colors p-1">
                  <Pencil size={14} />
                </button>
                <button onClick={() => handleDelete(p._id)} className="text-dim hover:text-red-400 transition-colors p-1">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
