import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { api } from "../../lib/api";
import { Certificate } from "../../types";
import { Button } from "../../components/ui/Button";
import CertificateForm from "../../components/admin/CertificateForm";

export default function AdminCertificates() {
  const [certificates, setCertificates] = useState<Certificate[] | null>(null);
  const [editing, setEditing] = useState<Certificate | "new" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function load() {
    try {
      const data = await api<{ certificates: Certificate[] }>("/api/admin/certificates");
      setCertificates(data.certificates);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't load certificates.");
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSave(payload: Omit<Certificate, "id"> & { id?: string }) {
    if (payload.id) {
      await api(`/api/admin/certificates`, { method: "PUT", body: payload });
    } else {
      await api(`/api/admin/certificates`, { method: "POST", body: payload });
    }
    setEditing(null);
    await load();
  }

  async function handleDelete(cert: Certificate) {
    if (!confirm(`Delete "${cert.title}"? This commits straight to your repo.`)) return;
    setDeletingId(cert.id);
    try {
      await api(`/api/admin/certificates?id=${encodeURIComponent(cert.id)}`, { method: "DELETE" });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't delete certificate.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <span className="data-caption">// certificates.json</span>
          <h1 className="mt-3 font-display text-2xl font-semibold">Certificates</h1>
        </div>
        <Button onClick={() => setEditing("new")}>
          <Plus size={16} /> Add certificate
        </Button>
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <div className="mt-6 space-y-3">
        {certificates === null && <p className="text-sm text-muted">Loading…</p>}
        {certificates?.length === 0 && (
          <p className="text-sm text-muted">No certificates yet. Add your first one above.</p>
        )}
        {certificates?.map((cert) => (
          <div key={cert.id} className="flex items-start justify-between gap-4 border border-line rounded-xl p-4">
            <div>
              <h3 className="font-display font-semibold">{cert.title}</h3>
              <p className="text-sm text-muted mt-1">
                {cert.issuer} · {cert.date}
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => setEditing(cert)}
                aria-label={`Edit ${cert.title}`}
                className="text-muted hover:text-ink p-1.5"
              >
                <Pencil size={16} />
              </button>
              <button
                onClick={() => handleDelete(cert)}
                disabled={deletingId === cert.id}
                aria-label={`Delete ${cert.title}`}
                className="text-muted hover:text-red-600 p-1.5 disabled:opacity-50"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <CertificateForm
          initial={editing === "new" ? undefined : editing}
          onCancel={() => setEditing(null)}
          onSubmit={handleSave}
        />
      )}
    </div>
  );
}
