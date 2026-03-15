"use client";
import { useEffect, useState } from "react";
import { Skill } from "@/types";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Field, Input, Select, Toggle, FormActions } from "@/components/admin/FormFields";

const EMPTY: Partial<Skill> = {
  name: "", category: "other", proficiency: 3, iconUrl: "", featured: false,
};

const PROFICIENCY_LABELS: Record<number, string> = {
  1: "Beginner",
  2: "Familiar",
  3: "Intermediate",
  4: "Advanced",
  5: "Expert",
};

export default function AdminSkillsPage() {
  const [items, setItems]     = useState<Skill[]>([]);
  const [form, setForm]       = useState<Partial<Skill>>(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  async function load() {
    const r = await fetch("/api/skills");
    const d = await r.json();
    if (Array.isArray(d)) setItems(d);
  }
  useEffect(() => { load(); }, []);

  function set(key: keyof Skill, value: unknown) {
    setForm(f => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const method = editing ? "PATCH" : "POST";
    const url    = editing ? `/api/skills/${editing}` : "/api/skills";
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setLoading(false);
    setShowForm(false);
    setEditing(null);
    setForm(EMPTY);
    load();
  }

  async function moveItem(id: string, dir: -1 | 1) {
    const arr = items;
    const idx = arr.findIndex(x => x._id === id);
    const other = arr[idx + dir];
    if (!other) return;
    await Promise.all([
      fetch(`/api/skills/${id}`,        { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ order: other.order }) }),
      fetch(`/api/skills/${other._id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ order: arr[idx].order }) }),
    ]);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this skill?")) return;
    await fetch(`/api/skills/${id}`, { method: "DELETE" });
    load();
  }

  function startEdit(s: Skill) {
    setForm(s);
    setEditing(s._id);
    setShowForm(true);
  }

  // Group by category for the list display
  const grouped = items.reduce<Record<string, Skill[]>>((acc, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  }, {});

  const CATEGORY_LABELS: Record<string, string> = {
    "ai-ml":       "AI & ML",
    "full-stack":  "Full Stack",
    "systems":     "Systems & Embedded",
    "power":       "Power Systems",
    "competitive": "Competitive Programming",
    "tools":       "Tools & DevOps",
    "other":       "Other",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-text">Skills</h1>
          <p className="text-muted text-sm">{items.length} total</p>
        </div>
        <button
          onClick={() => { setForm(EMPTY); setEditing(null); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-green text-bg rounded-lg text-sm font-bold hover:opacity-90 transition-opacity"
        >
          <Plus size={14} /> Add Skill
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6 mb-6 space-y-4">
          <h2 className="font-bold text-text mb-4">{editing ? "Edit Skill" : "New Skill"}</h2>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Skill Name *">
              <Input
                value={form.name || ""}
                onChange={v => set("name", v)}
                placeholder="e.g. Python, Next.js, TensorFlow"
                required
              />
            </Field>
            <Field label="Category">
              <Select
                value={form.category || "other"}
                onChange={v => set("category", v)}
                options={[
                  { value: "ai-ml",       label: "AI & Machine Learning" },
                  { value: "full-stack",  label: "Full Stack" },
                  { value: "systems",     label: "Systems & Embedded" },
                  { value: "power",       label: "Power Systems" },
                  { value: "competitive", label: "Competitive Programming" },
                  { value: "tools",       label: "Tools & DevOps" },
                  { value: "other",       label: "Other" },
                ]}
              />
            </Field>
          </div>

          <Field label={`Proficiency — ${PROFICIENCY_LABELS[form.proficiency ?? 3]} (${form.proficiency ?? 3}/5)`}>
            <input
              type="range"
              min={1}
              max={5}
              step={1}
              value={form.proficiency ?? 3}
              onChange={e => set("proficiency", Number(e.target.value))}
              className="w-full accent-green"
            />
            <div className="flex justify-between mt-1">
              {Object.entries(PROFICIENCY_LABELS).map(([n, label]) => (
                <span key={n} className={`font-mono text-[10px] ${Number(n) === (form.proficiency ?? 3) ? "text-green" : "text-dim"}`}>
                  {label}
                </span>
              ))}
            </div>
          </Field>

          <Field label="Icon URL" hint="Optional — paste a small logo image URL (e.g. devicon, simpleicons)">
            <Input
              value={form.iconUrl || ""}
              onChange={v => set("iconUrl", v)}
              placeholder="https://cdn.simpleicons.org/python"
            />
          </Field>

          <Toggle label="Featured" value={form.featured || false} onChange={v => set("featured", v)} />

          <FormActions
            loading={loading}
            onCancel={() => { setShowForm(false); setEditing(null); setForm(EMPTY); }}
          />
        </form>
      )}

      {/* Grouped list */}
      {items.length === 0 ? (
        <div className="bg-card border border-dashed border-border rounded-xl p-12 text-center">
          <p className="text-dim text-sm">No skills yet. Add your first skill above.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([cat, catSkills]) => (
            <div key={cat}>
              <p className="font-mono text-[10px] text-muted mb-2 uppercase tracking-widest">
                {CATEGORY_LABELS[cat] ?? cat}
              </p>
              <div className="space-y-2">
                {catSkills.map(s => (
                  <div key={s._id} className="bg-card border border-border rounded-xl px-4 py-3 flex items-center gap-4">
                    {s.iconUrl && (
                      <img src={s.iconUrl} alt={s.name} className="w-5 h-5 object-contain rounded flex-shrink-0" />
                    )}
                    <span className="font-semibold text-text text-sm flex-1">{s.name}</span>

                    {/* Proficiency dots */}
                    <div className="flex gap-0.5 items-center">
                      {[1, 2, 3, 4, 5].map(i => (
                        <span
                          key={i}
                          className={`block w-2 h-2 rounded-full ${i <= s.proficiency ? "bg-green" : "bg-border"}`}
                        />
                      ))}
                    </div>
                    <span className="font-mono text-[10px] text-dim w-20 text-right">
                      {PROFICIENCY_LABELS[s.proficiency]}
                    </span>

                    <button onClick={() => moveItem(s._id, -1)} disabled={items.indexOf(s) === 0}
                      className="text-dim hover:text-text disabled:opacity-20 transition-colors p-1 font-mono text-[10px]">▲</button>
                    <button onClick={() => moveItem(s._id, 1)} disabled={items.indexOf(s) === items.length - 1}
                      className="text-dim hover:text-text disabled:opacity-20 transition-colors p-1 font-mono text-[10px]">▼</button>
                    <button
                      onClick={() => startEdit(s)}
                      className="text-dim hover:text-green transition-colors p-1"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(s._id)}
                      className="text-dim hover:text-red-400 transition-colors p-1"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
