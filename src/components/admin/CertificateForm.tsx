import { FormEvent, ReactNode, useState } from "react";
import { X } from "lucide-react";
import { Certificate } from "../../types";
import { Button } from "../ui/Button";

interface CertificateFormProps {
  initial?: Certificate;
  onCancel: () => void;
  onSubmit: (cert: Omit<Certificate, "id"> & { id?: string }) => Promise<void>;
}

const empty = { title: "", issuer: "", date: "", credentialUrl: "", imageUrl: "" };

export default function CertificateForm({ initial, onCancel, onSubmit }: CertificateFormProps) {
  const [form, setForm] = useState(
    initial
      ? {
          title: initial.title,
          issuer: initial.issuer,
          date: initial.date,
          credentialUrl: initial.credentialUrl ?? "",
          imageUrl: initial.imageUrl ?? "",
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
        issuer: form.issuer.trim(),
        date: form.date.trim(),
        credentialUrl: form.credentialUrl.trim() || undefined,
        imageUrl: form.imageUrl.trim() || undefined,
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
          <h2 className="font-display text-lg font-semibold">
            {initial ? "Edit certificate" : "Add certificate"}
          </h2>
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
          <Field label="Issuer">
            <input
              required
              value={form.issuer}
              onChange={(e) => setForm({ ...form, issuer: e.target.value })}
              className="input"
            />
          </Field>
          <Field label="Date (e.g. 2025-08)">
            <input
              required
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="input"
            />
          </Field>
          <Field label="Credential URL (optional)">
            <input
              value={form.credentialUrl}
              onChange={(e) => setForm({ ...form, credentialUrl: e.target.value })}
              className="input"
            />
          </Field>
          <Field label="Image URL (optional)">
            <input
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              className="input"
            />
          </Field>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={saving}>
              {saving ? "Saving…" : "Save certificate"}
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
