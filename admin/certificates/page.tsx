"use client";
import { useEffect, useRef, useState } from "react";
import { Certificate } from "@/types";
import { Plus, Pencil, Trash2, Upload } from "lucide-react";
import { Field, Input, Select, Toggle, TagInput, FormActions } from "@/components/admin/FormFields";

const EMPTY: Partial<Certificate> = {
  title: "", issuer: "", category: "other", skills: [],
  imageUrl: "", pdfUrl: "", verificationUrl: "", featured: false,
};

export default function AdminCertificatesPage() {
  const [items, setItems] = useState<Certificate[]>([]);
  const [form, setForm] = useState<Partial<Certificate>>(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageBase64, setImageBase64] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function load() {
    const r = await fetch("/api/certificates");
    const d = await r.json(); if (Array.isArray(d)) setItems(d);
  }
  useEffect(() => { load(); }, []);

  function set(key: keyof Certificate, value: unknown) {
    setForm(f => ({ ...f, [key]: value }));
  }

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setImageBase64(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const payload = { ...form, imageBase64 };
    const method = editing ? "PATCH" : "POST";
    const url = editing ? `/api/certificates/${editing}` : "/api/certificates";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    setLoading(false);
    setShowForm(false);
    setEditing(null);
    setForm(EMPTY);
    setImageBase64("");
    load();
  }

  async function moveItem(id: string, dir: -1 | 1) {
    const arr = items;
    const idx = arr.findIndex((x: any) => x._id === id);
    const other = arr[idx + dir];
    if (!other) return;
    await Promise.all([
      fetch(`/api/certificates/${id}`,        { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ order: other.order }) }),
      fetch(`/api/certificates/${other._id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ order: arr[idx].order }) }),
    ]);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete?")) return;
    await fetch(`/api/certificates/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-text">Certificates</h1>
          <p className="text-muted text-sm">{items.length} total</p>
        </div>
        <button onClick={() => { setForm(EMPTY); setEditing(null); setImageBase64(""); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-green text-bg rounded-lg text-sm font-bold hover:opacity-90 transition-opacity">
          <Plus size={14} /> Add Certificate
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6 mb-6 space-y-4">
          <h2 className="font-bold text-text mb-4">{editing ? "Edit Certificate" : "New Certificate"}</h2>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Title *">
              <Input value={form.title || ""} onChange={v => set("title", v)} required />
            </Field>
            <Field label="Issuer">
              <Input value={form.issuer || ""} onChange={v => set("issuer", v)} />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Category">
              <Select value={form.category || "other"} onChange={v => set("category", v)} options={[
                { value: "programming", label: "Programming" },
                { value: "ai", label: "AI/ML" },
                { value: "cloud", label: "Cloud" },
                { value: "systems", label: "Systems" },
                { value: "design", label: "Design" },
                { value: "other", label: "Other" },
              ]} />
            </Field>
            <Field label="Issue Date">
              <Input type="date" value={form.issueDate ? form.issueDate.slice(0, 10) : ""} onChange={v => set("issueDate", v)} />
            </Field>
          </div>

          <Field label="Certificate Image">
            <input ref={fileRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
            <div className="flex gap-3 items-center">
              <button type="button" onClick={() => fileRef.current?.click()}
                className="flex items-center gap-2 px-3 py-2 bg-surface border border-border rounded-lg text-xs text-muted hover:text-text transition-colors">
                <Upload size={12} /> Upload Image
              </button>
              {(imageBase64 || form.imageUrl) && (
                <img src={imageBase64 || form.imageUrl} alt="" className="h-12 rounded border border-border" />
              )}
            </div>
            <p className="text-[10px] text-dim mt-1">Or paste URL:</p>
            <Input value={form.imageUrl || ""} onChange={v => set("imageUrl", v)} placeholder="https://..." />
          </Field>

          <Field label="Verification URL">
            <Input value={form.verificationUrl || ""} onChange={v => set("verificationUrl", v)} placeholder="https://..." />
          </Field>

          <Field label="PDF URL">
            <Input value={form.pdfUrl || ""} onChange={v => set("pdfUrl", v)} placeholder="https://..." />
          </Field>

          <Field label="Skills">
            <TagInput tags={form.skills || []} onChange={tags => set("skills", tags)} />
          </Field>

          <Toggle label="Featured" value={form.featured || false} onChange={v => set("featured", v)} />

          <FormActions loading={loading} onCancel={() => { setShowForm(false); setEditing(null); setForm(EMPTY); setImageBase64(""); }} />
        </form>
      )}

      {items.length === 0 ? (
        <div className="bg-card border border-dashed border-border rounded-xl p-12 text-center">
          <p className="text-dim text-sm">No certificates yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {items.map(c => (
            <div key={c._id} className="bg-card border border-border rounded-xl overflow-hidden">
              {c.imageUrl
                ? <img src={c.imageUrl} alt={c.title} className="w-full h-24 object-cover" />
                : <div className="w-full h-24 bg-surface" />
              }
              <div className="p-3">
                <p className="font-bold text-text text-sm truncate">{c.title}</p>
                <p className="text-dim text-xs">{c.issuer}</p>
                <div className="flex gap-2 mt-2">
                  <button onClick={() => moveItem(c._id, -1)} disabled={items.indexOf(c) === 0}
                    className="text-dim hover:text-text disabled:opacity-20 transition-colors p-1 font-mono text-[10px]">▲</button>
                  <button onClick={() => moveItem(c._id, 1)} disabled={items.indexOf(c) === items.length - 1}
                    className="text-dim hover:text-text disabled:opacity-20 transition-colors p-1 font-mono text-[10px]">▼</button>
                  <button onClick={() => { setForm(c); setEditing(c._id); setImageBase64(""); setShowForm(true); }}
                    className="text-dim hover:text-green transition-colors p-1"><Pencil size={13} /></button>
                  <button onClick={() => handleDelete(c._id)}
                    className="text-dim hover:text-red-400 transition-colors p-1"><Trash2 size={13} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
