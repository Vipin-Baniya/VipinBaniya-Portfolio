"use client";
import { useEffect, useState } from "react";
import { Experience } from "@/types";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Field, Input, Textarea, Select, Toggle, TagInput, FormActions } from "@/components/admin/FormFields";

const EMPTY: Partial<Experience> = {
  organization: "", role: "", type: "internship",
  description: "", technologies: [], impactMetrics: [],
  current: false, logoUrl: "",
};

function fmt(d?: string) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export default function AdminExperiencePage() {
  const [items, setItems] = useState<Experience[]>([]);
  const [form, setForm] = useState<Partial<Experience>>(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [metricsInput, setMetricsInput] = useState("");

  async function load() {
    const r = await fetch("/api/experience");
    const d = await r.json(); if (Array.isArray(d)) setItems(d);
  }
  useEffect(() => { load(); }, []);

  function set(key: keyof Experience, value: unknown) {
    setForm(f => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const metrics = metricsInput.trim()
      ? metricsInput.split("\n").map(s => s.trim()).filter(Boolean)
      : [];
    const method = editing ? "PATCH" : "POST";
    const url = editing ? `/api/experience/${editing}` : "/api/experience";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, impactMetrics: metrics }) });
    setLoading(false);
    setShowForm(false);
    setEditing(null);
    setForm(EMPTY);
    setMetricsInput("");
    load();
  }

  async function moveItem(id: string, dir: -1 | 1) {
    const arr = items;
    const idx = arr.findIndex((x: any) => x._id === id);
    const other = arr[idx + dir];
    if (!other) return;
    await Promise.all([
      fetch(`/api/experience/${id}`,        { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ order: other.order }) }),
      fetch(`/api/experience/${other._id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ order: arr[idx].order }) }),
    ]);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete?")) return;
    await fetch(`/api/experience/${id}`, { method: "DELETE" });
    load();
  }

  function startEdit(e: Experience) {
    setForm(e);
    setEditing(e._id);
    setMetricsInput(e.impactMetrics.join("\n"));
    setShowForm(true);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-text">Experience</h1>
          <p className="text-muted text-sm">{items.length} total</p>
        </div>
        <button onClick={() => { setForm(EMPTY); setEditing(null); setMetricsInput(""); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-green text-bg rounded-lg text-sm font-bold hover:opacity-90 transition-opacity">
          <Plus size={14} /> Add Experience
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6 mb-6 space-y-4">
          <h2 className="font-bold text-text mb-4">{editing ? "Edit Experience" : "New Experience"}</h2>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Organization *">
              <Input value={form.organization || ""} onChange={v => set("organization", v)} required />
            </Field>
            <Field label="Role *">
              <Input value={form.role || ""} onChange={v => set("role", v)} required />
            </Field>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Field label="Type">
              <Select value={form.type || "internship"} onChange={v => set("type", v)} options={[
                { value: "internship", label: "Internship" },
                { value: "full-time", label: "Full-time" },
                { value: "part-time", label: "Part-time" },
                { value: "freelance", label: "Freelance" },
                { value: "research", label: "Research" },
                { value: "volunteer", label: "Volunteer" },
              ]} />
            </Field>
            <Field label="Start Date">
              <Input type="date" value={form.startDate ? form.startDate.slice(0, 10) : ""} onChange={v => set("startDate", v)} />
            </Field>
            <Field label="End Date">
              <Input type="date" value={form.endDate ? form.endDate.slice(0, 10) : ""} onChange={v => set("endDate", v)} />
            </Field>
          </div>

          <Toggle label="Currently working here" value={form.current || false} onChange={v => set("current", v)} />

          <Field label="Description">
            <Textarea value={form.description || ""} onChange={v => set("description", v)} rows={3} />
          </Field>

          <Field label="Impact Metrics" hint="One per line, e.g. Reduced latency by 40%">
            <Textarea value={metricsInput} onChange={setMetricsInput} rows={3} placeholder={"Improved X by Y%\nBuilt Z feature..."} />
          </Field>

          <Field label="Technologies">
            <TagInput tags={form.technologies || []} onChange={tags => set("technologies", tags)} />
          </Field>

          <Field label="Logo URL">
            <Input value={form.logoUrl || ""} onChange={v => set("logoUrl", v)} placeholder="https://..." />
          </Field>

          <FormActions loading={loading} onCancel={() => { setShowForm(false); setEditing(null); setForm(EMPTY); setMetricsInput(""); }} />
        </form>
      )}

      {items.length === 0 ? (
        <div className="bg-card border border-dashed border-border rounded-xl p-12 text-center">
          <p className="text-dim text-sm">No experience entries yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map(e => (
            <div key={e._id} className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-bold text-text text-sm">{e.role}</p>
                <p className="text-muted text-xs">{e.organization} · {fmt(e.startDate)} — {e.current ? "Present" : fmt(e.endDate)}</p>
              </div>
              <span className="font-mono text-[10px] bg-surface text-dim px-2 py-0.5 rounded capitalize">{e.type}</span>
              <div className="flex items-center gap-2">
                <button onClick={() => moveItem(e._id, -1)} disabled={items.indexOf(e) === 0}
                  className="text-dim hover:text-text disabled:opacity-20 transition-colors p-1 font-mono text-[10px]">▲</button>
                <button onClick={() => moveItem(e._id, 1)} disabled={items.indexOf(e) === items.length - 1}
                  className="text-dim hover:text-text disabled:opacity-20 transition-colors p-1 font-mono text-[10px]">▼</button>
                <button onClick={() => startEdit(e)} className="text-dim hover:text-green transition-colors p-1"><Pencil size={14} /></button>
                <button onClick={() => handleDelete(e._id)} className="text-dim hover:text-red-400 transition-colors p-1"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
