import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { api } from "../../lib/api";
import { Project } from "../../types";
import { Button } from "../../components/ui/Button";
import ProjectForm from "../../components/admin/ProjectForm";

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [editing, setEditing] = useState<Project | "new" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function load() {
    try {
      const data = await api<{ projects: Project[] }>("/api/admin/projects");
      setProjects(data.projects);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't load projects.");
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSave(payload: Omit<Project, "id"> & { id?: string }) {
    if (payload.id) {
      await api(`/api/admin/projects`, { method: "PUT", body: payload });
    } else {
      await api(`/api/admin/projects`, { method: "POST", body: payload });
    }
    setEditing(null);
    await load();
  }

  async function handleDelete(project: Project) {
    if (!confirm(`Delete "${project.title}"? This commits straight to your repo.`)) return;
    setDeletingId(project.id);
    try {
      await api(`/api/admin/projects?id=${encodeURIComponent(project.id)}`, { method: "DELETE" });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't delete project.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <span className="data-caption">// projects.json</span>
          <h1 className="mt-3 font-display text-2xl font-semibold">Projects</h1>
        </div>
        <Button onClick={() => setEditing("new")}>
          <Plus size={16} /> Add project
        </Button>
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <div className="mt-6 space-y-3">
        {projects === null && <p className="text-sm text-muted">Loading…</p>}
        {projects?.length === 0 && (
          <p className="text-sm text-muted">No projects yet. Add your first one above.</p>
        )}
        {projects?.map((project) => (
          <div
            key={project.id}
            className="flex items-start justify-between gap-4 border border-line rounded-xl p-4"
          >
            <div>
              <h3 className="font-display font-semibold">{project.title}</h3>
              <p className="text-sm text-muted mt-1 max-w-xl">{project.description}</p>
              <p className="text-xs font-mono text-muted mt-2">{project.techStack.join(" · ")}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => setEditing(project)}
                aria-label={`Edit ${project.title}`}
                className="text-muted hover:text-ink p-1.5"
              >
                <Pencil size={16} />
              </button>
              <button
                onClick={() => handleDelete(project)}
                disabled={deletingId === project.id}
                aria-label={`Delete ${project.title}`}
                className="text-muted hover:text-red-600 p-1.5 disabled:opacity-50"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <ProjectForm
          initial={editing === "new" ? undefined : editing}
          onCancel={() => setEditing(null)}
          onSubmit={handleSave}
        />
      )}
    </div>
  );
}
