import { FormEvent, ReactNode, useState } from "react";
import { X } from "lucide-react";
import { Project } from "../../types";
import { Button } from "../ui/Button";

interface ProjectFormProps {
  initial?: Project;
  onCancel: () => void;
  onSubmit: (project: Omit<Project, "id"> & { id?: string }) => Promise<void>;
}

const empty = {
  title: "",
  description: "",
  techStack: "",
  githubUrl: "",
  demoUrl: "",
  imageUrl: "",
  featured: false,
};

export default function ProjectForm({ initial, onCancel, onSubmit }: ProjectFormProps) {
  const [form, setForm] = useState(
    initial
      ? {
          title: initial.title,
          description: initial.description,
          techStack: initial.techStack.join(", "),
          githubUrl: initial.githubUrl ?? "",
          demoUrl: initial.demoUrl ?? "",
          imageUrl: initial.imageUrl ?? "",
          featured: initial.featured ?? false,
        }
      : empty
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await onSubmit({
        id: initial?.id,
        title: form.title.trim(),
        description: form.description.trim(),
        techStack: form.techStack
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        githubUrl: form.githubUrl.trim() || undefined,
        demoUrl: form.demoUrl.trim() || undefined,
        imageUrl: form.imageUrl.trim() || undefined,
        featured: form.featured,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't save. Try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-ink/40 flex items-center justify-center p-6 z-50">
      <div className="bg-paper rounded-2xl border border-line w-full max-w-lg max-h-[85vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-lg font-semibold">{initial ? "Edit project" : "Add project"}</h2>
          <button onClick={onCancel} aria-label="Close" className="text-muted hover:text-ink">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Title">
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="input"
            />
          </Field>
          <Field label="Description">
            <textarea
              required
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="input resize-none"
            />
          </Field>
          <Field label="Tech stack (comma separated)">
            <input
              required
              placeholder="Python, PyTorch, Docker"
              value={form.techStack}
              onChange={(e) => setForm({ ...form, techStack: e.target.value })}
              className="input"
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="GitHub URL">
              <input
                value={form.githubUrl}
                onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
                className="input"
              />
            </Field>
            <Field label="Live demo URL">
              <input
                value={form.demoUrl}
                onChange={(e) => setForm({ ...form, demoUrl: e.target.value })}
                className="input"
              />
            </Field>
          </div>
          <Field label="Image URL (optional)">
            <input
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              className="input"
              placeholder="/images/project-1.png or an external URL"
            />
          </Field>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
            />
            Featured
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={saving}>
              {saving ? "Saving…" : "Save project"}
            </Button>
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5">{label}</label>
      {children}
    </div>
  );
}
