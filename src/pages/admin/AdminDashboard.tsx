import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../lib/api";
import { Project, Certificate } from "../../types";

export default function AdminDashboard() {
  const [projectCount, setProjectCount] = useState<number | null>(null);
  const [certCount, setCertCount] = useState<number | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    Promise.all([
      api<{ projects: Project[] }>("/api/admin/projects"),
      api<{ certificates: Certificate[] }>("/api/admin/certificates"),
    ])
      .then(([p, c]) => {
        setProjectCount(p.projects.length);
        setCertCount(c.certificates.length);
      })
      .catch(() => setError(true));
  }, []);

  return (
    <div>
      <span className="data-caption">// overview</span>
      <h1 className="mt-3 font-display text-2xl font-semibold">Welcome back</h1>
      <p className="mt-2 text-sm text-muted max-w-md">
        Changes you make here are committed directly to your GitHub repository, which triggers a fresh
        Vercel deployment automatically. Expect updates to go live within about a minute.
      </p>

      {error && (
        <p className="mt-6 text-sm text-red-600">
          Couldn't reach GitHub. Double-check GITHUB_TOKEN, GITHUB_OWNER and GITHUB_REPO in your
          environment variables.
        </p>
      )}

      <div className="mt-8 grid sm:grid-cols-2 gap-4 max-w-lg">
        <Link to="/admin/projects" className="border border-line rounded-xl p-5 hover:border-ink transition-colors">
          <p className="font-mono text-xs text-muted">projects.json</p>
          <p className="mt-1 font-display text-3xl font-semibold">{projectCount ?? "–"}</p>
          <p className="mt-1 text-sm text-muted">entries</p>
        </Link>
        <Link
          to="/admin/certificates"
          className="border border-line rounded-xl p-5 hover:border-ink transition-colors"
        >
          <p className="font-mono text-xs text-muted">certificates.json</p>
          <p className="mt-1 font-display text-3xl font-semibold">{certCount ?? "–"}</p>
          <p className="mt-1 text-sm text-muted">entries</p>
        </Link>
      </div>
    </div>
  );
}
