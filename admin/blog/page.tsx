"use client";
import { useEffect, useState } from "react";
import { Post } from "@/types";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { Field, Input, Textarea, Toggle, TagInput, FormActions } from "@/components/admin/FormFields";

const EMPTY: Partial<Post> = {
  title: "", slug: "", excerpt: "", content: "",
  tags: [], published: false, featured: false, coverUrl: "",
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function AdminBlogPage() {
  const [items,   setItems]   = useState<Post[]>([]);
  const [form,    setForm]    = useState<Partial<Post>>(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [preview,  setPreview]  = useState(false);

  async function load() {
    const r = await fetch("/api/blog?published=false");
    const d = await r.json();
    if (Array.isArray(d)) setItems(d);
  }
  useEffect(() => { load(); }, []);

  function set(key: keyof Post, value: unknown) {
    setForm(f => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const method = editing ? "PATCH" : "POST";
    const url    = editing ? `/api/blog/${editing}` : "/api/blog";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setLoading(false);
    setShowForm(false);
    setEditing(null);
    setForm(EMPTY);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this post?")) return;
    await fetch(`/api/blog/${id}`, { method: "DELETE" });
    load();
  }

  async function togglePublish(post: Post) {
    await fetch(`/api/blog/${post._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !post.published }),
    });
    load();
  }

  async function moveItem(id: string, dir: -1 | 1) {
    const idx = items.findIndex(x => x._id === id);
    const other = items[idx + dir];
    if (!other) return;
    await Promise.all([
      fetch(`/api/blog/${id}`,       { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ order: other.order }) }),
      fetch(`/api/blog/${other._id}`,{ method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ order: items[idx].order }) }),
    ]);
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-text">Blog / Notes</h1>
          <p className="text-muted text-sm">{items.length} total · {items.filter(p => p.published).length} published</p>
        </div>
        <button onClick={() => { setForm(EMPTY); setEditing(null); setShowForm(true); setPreview(false); }}
          className="flex items-center gap-2 px-4 py-2 bg-green text-bg rounded-lg text-sm font-bold hover:opacity-90 transition-opacity">
          <Plus size={14} /> New Post
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6 mb-6 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-bold text-text">{editing ? "Edit Post" : "New Post"}</h2>
            <button type="button" onClick={() => setPreview(v => !v)}
              className="flex items-center gap-1.5 text-xs text-muted hover:text-text font-mono transition-colors">
              {preview ? <EyeOff size={12} /> : <Eye size={12} />}
              {preview ? "Edit" : "Preview content"}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Title *">
              <Input value={form.title || ""} onChange={v => set("title", v)} required />
            </Field>
            <Field label="Slug" hint="Auto-generated if empty">
              <Input value={form.slug || ""} onChange={v => set("slug", v)} placeholder="my-post" />
            </Field>
          </div>

          <Field label="Excerpt" hint="Shown in list and as meta description">
            <Input value={form.excerpt || ""} onChange={v => set("excerpt", v)} placeholder="Short summary..." />
          </Field>

          <Field label="Cover Image URL">
            <Input value={form.coverUrl || ""} onChange={v => set("coverUrl", v)} placeholder="https://..." />
          </Field>

          <Field label="Content (Markdown)" hint="# Heading, **bold**, *italic*, ```code```, - list item">
            {preview ? (
              <div className="bg-surface border border-border rounded-lg p-4 min-h-[240px] text-sm text-muted font-mono whitespace-pre-wrap text-xs">
                {form.content || "(empty)"}
              </div>
            ) : (
              <Textarea value={form.content || ""} onChange={v => set("content", v)} rows={12}
                placeholder={"# My Post\n\nWrite your content here using **markdown**...\n\n```python\nprint('hello')\n```"} />
            )}
          </Field>

          <Field label="Tags">
            <TagInput tags={form.tags || []} onChange={tags => set("tags", tags)} />
          </Field>

          <div className="flex gap-6">
            <Toggle label="Published" value={form.published || false} onChange={v => set("published", v)} />
            <Toggle label="Featured"  value={form.featured  || false} onChange={v => set("featured",  v)} />
          </div>

          <FormActions loading={loading} onCancel={() => { setShowForm(false); setEditing(null); setForm(EMPTY); }} />
        </form>
      )}

      {items.length === 0 ? (
        <div className="bg-card border border-dashed border-border rounded-xl p-12 text-center">
          <p className="text-dim text-sm">No posts yet. Write your first note above.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map(p => (
            <div key={p._id} className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-bold text-text text-sm">{p.title}</span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${p.published ? "bg-green/20 text-green" : "bg-surface text-dim"}`}>
                    {p.published ? "published" : "draft"}
                  </span>
                </div>
                <p className="text-dim text-xs">{fmtDate(p.createdAt)} · {(p.tags || []).join(", ")}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => moveItem(p._id, -1)} disabled={items.indexOf(p) === 0}
                  className="text-dim hover:text-text disabled:opacity-20 transition-colors p-1 font-mono text-[10px]">▲</button>
                <button onClick={() => moveItem(p._id, 1)} disabled={items.indexOf(p) === items.length - 1}
                  className="text-dim hover:text-text disabled:opacity-20 transition-colors p-1 font-mono text-[10px]">▼</button>
                <button onClick={() => togglePublish(p)}
                  className={`p-1 transition-colors ${p.published ? "text-green hover:text-muted" : "text-dim hover:text-green"}`}
                  title={p.published ? "Unpublish" : "Publish"}>
                  {p.published ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
                <button onClick={() => { setForm(p); setEditing(p._id); setShowForm(true); setPreview(false); }}
                  className="text-dim hover:text-green transition-colors p-1"><Pencil size={14} /></button>
                <button onClick={() => handleDelete(p._id)}
                  className="text-dim hover:text-red-400 transition-colors p-1"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
