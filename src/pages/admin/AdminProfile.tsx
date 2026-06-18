import { FormEvent, ReactNode, useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { api } from "../../lib/api";
import { SiteContent } from "../../types";
import { Button } from "../../components/ui/Button";

type SkillDraft = { category: string; items: string };
type ExperienceDraft = { id: string; company: string; role: string; startDate: string; endDate: string; bullets: string };
type EducationDraft = { id: string; institution: string; degree: string; startDate: string; endDate: string; detail: string };

export default function AdminProfile() {
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [profile, setProfile] = useState({
    name: "", eyebrow: "", headline: "", tagline: "", bio: "", location: "", avatarUrl: "", resumeUrl: "",
  });
  const [socials, setSocials] = useState({ email: "", github: "", linkedin: "", twitter: "" });
  const [skills, setSkills] = useState<SkillDraft[]>([]);
  const [experience, setExperience] = useState<ExperienceDraft[]>([]);
  const [education, setEducation] = useState<EducationDraft[]>([]);

  useEffect(() => {
    api<{ content: SiteContent }>("/api/admin/profile").then(({ content }) => {
      setProfile(content.profile);
      setSocials(content.socials);
      setSkills(content.skills.map((s) => ({ category: s.category, items: s.items.join(", ") })));
      setExperience(
        content.experience.map((e) => ({ ...e, bullets: e.bullets.join("\n") }))
      );
      setEducation(content.education);
      setLoaded(true);
    });
  }, []);

  function updateSkill(i: number, patch: Partial<SkillDraft>) {
    setSkills((prev) => prev.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  }
  function updateExperience(i: number, patch: Partial<ExperienceDraft>) {
    setExperience((prev) => prev.map((e, idx) => (idx === i ? { ...e, ...patch } : e)));
  }
  function updateEducation(i: number, patch: Partial<EducationDraft>) {
    setEducation((prev) => prev.map((e, idx) => (idx === i ? { ...e, ...patch } : e)));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const content: SiteContent = {
        profile,
        socials,
        skills: skills.map((s) => ({
          category: s.category.trim(),
          items: s.items.split(",").map((i) => i.trim()).filter(Boolean),
        })),
        experience: experience.map((exp) => ({
          ...exp,
          bullets: exp.bullets.split("\n").map((b) => b.trim()).filter(Boolean),
        })),
        education,
      };
      await api("/api/admin/profile", { method: "PUT", body: content });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't save changes.");
    } finally {
      setSaving(false);
    }
  }

  if (!loaded) return <p className="text-sm text-muted">Loading…</p>;

  return (
    <form onSubmit={handleSubmit} className="space-y-12 pb-20">
      <div>
        <span className="data-caption">// content.json</span>
        <h1 className="mt-3 font-display text-2xl font-semibold">Profile &amp; content</h1>
        <p className="mt-2 text-sm text-muted">Hero, about, skills, experience, education, and contact info.</p>
      </div>

      <section className="space-y-4">
        <h2 className="font-mono text-sm text-muted">Profile</h2>
        <Grid>
          <TextField label="Name" value={profile.name} onChange={(v) => setProfile({ ...profile, name: v })} />
          <TextField label="Eyebrow" value={profile.eyebrow} onChange={(v) => setProfile({ ...profile, eyebrow: v })} />
        </Grid>
        <TextField label="Headline" value={profile.headline} onChange={(v) => setProfile({ ...profile, headline: v })} />
        <TextAreaField label="Tagline" rows={2} value={profile.tagline} onChange={(v) => setProfile({ ...profile, tagline: v })} />
        <TextAreaField label="Bio" rows={4} value={profile.bio} onChange={(v) => setProfile({ ...profile, bio: v })} />
        <Grid>
          <TextField label="Location" value={profile.location} onChange={(v) => setProfile({ ...profile, location: v })} />
          <TextField label="Résumé URL" value={profile.resumeUrl} onChange={(v) => setProfile({ ...profile, resumeUrl: v })} />
        </Grid>
        <TextField label="Avatar URL" value={profile.avatarUrl} onChange={(v) => setProfile({ ...profile, avatarUrl: v })} />
      </section>

      <section className="space-y-4">
        <h2 className="font-mono text-sm text-muted">Socials</h2>
        <Grid>
          <TextField label="Email" value={socials.email} onChange={(v) => setSocials({ ...socials, email: v })} />
          <TextField label="GitHub" value={socials.github} onChange={(v) => setSocials({ ...socials, github: v })} />
          <TextField label="LinkedIn" value={socials.linkedin} onChange={(v) => setSocials({ ...socials, linkedin: v })} />
          <TextField label="Twitter / X" value={socials.twitter} onChange={(v) => setSocials({ ...socials, twitter: v })} />
        </Grid>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-mono text-sm text-muted">Skills</h2>
          <SmallAddButton onClick={() => setSkills((p) => [...p, { category: "", items: "" }])} label="Add group" />
        </div>
        {skills.map((skill, i) => (
          <div key={i} className="border border-line rounded-xl p-4 grid md:grid-cols-[200px_1fr_auto] gap-3 items-start">
            <input
              placeholder="Category"
              value={skill.category}
              onChange={(e) => updateSkill(i, { category: e.target.value })}
              className="input"
            />
            <input
              placeholder="Python, PyTorch, SQL"
              value={skill.items}
              onChange={(e) => updateSkill(i, { items: e.target.value })}
              className="input"
            />
            <RemoveButton onClick={() => setSkills((p) => p.filter((_, idx) => idx !== i))} />
          </div>
        ))}
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-mono text-sm text-muted">Experience</h2>
          <SmallAddButton
            onClick={() =>
              setExperience((p) => [
                ...p,
                { id: `exp-${Date.now()}`, company: "", role: "", startDate: "", endDate: "", bullets: "" },
              ])
            }
            label="Add role"
          />
        </div>
        {experience.map((exp, i) => (
          <div key={exp.id} className="border border-line rounded-xl p-4 space-y-3">
            <div className="flex justify-end">
              <RemoveButton onClick={() => setExperience((p) => p.filter((_, idx) => idx !== i))} />
            </div>
            <Grid>
              <TextField label="Role" value={exp.role} onChange={(v) => updateExperience(i, { role: v })} />
              <TextField label="Company" value={exp.company} onChange={(v) => updateExperience(i, { company: v })} />
            </Grid>
            <Grid>
              <TextField label="Start (e.g. 2025-06)" value={exp.startDate} onChange={(v) => updateExperience(i, { startDate: v })} />
              <TextField label="End (e.g. Present)" value={exp.endDate} onChange={(v) => updateExperience(i, { endDate: v })} />
            </Grid>
            <TextAreaField
              label="Bullets (one per line)"
              rows={3}
              value={exp.bullets}
              onChange={(v) => updateExperience(i, { bullets: v })}
            />
          </div>
        ))}
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-mono text-sm text-muted">Education</h2>
          <SmallAddButton
            onClick={() =>
              setEducation((p) => [
                ...p,
                { id: `edu-${Date.now()}`, institution: "", degree: "", startDate: "", endDate: "", detail: "" },
              ])
            }
            label="Add entry"
          />
        </div>
        {education.map((edu, i) => (
          <div key={edu.id} className="border border-line rounded-xl p-4 space-y-3">
            <div className="flex justify-end">
              <RemoveButton onClick={() => setEducation((p) => p.filter((_, idx) => idx !== i))} />
            </div>
            <TextField label="Institution" value={edu.institution} onChange={(v) => updateEducation(i, { institution: v })} />
            <TextField label="Degree" value={edu.degree} onChange={(v) => updateEducation(i, { degree: v })} />
            <Grid>
              <TextField label="Start" value={edu.startDate} onChange={(v) => updateEducation(i, { startDate: v })} />
              <TextField label="End" value={edu.endDate} onChange={(v) => updateEducation(i, { endDate: v })} />
            </Grid>
            <TextField label="Detail (GPA, honors)" value={edu.detail} onChange={(v) => updateEducation(i, { detail: v })} />
          </div>
        ))}
      </section>

      <div className="sticky bottom-0 bg-paper border-t border-line py-4 flex items-center gap-4">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save changes"}
        </Button>
        {success && <span className="text-sm text-signal">Saved — redeploying now.</span>}
        {error && <span className="text-sm text-red-600">{error}</span>}
      </div>
    </form>
  );
}

function Grid({ children }: { children: ReactNode }) {
  return <div className="grid md:grid-cols-2 gap-4">{children}</div>;
}

function TextField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="input" />
    </div>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5">{label}</label>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows} className="input resize-none" />
    </div>
  );
}

function SmallAddButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 text-sm text-signal hover:underline"
    >
      <Plus size={14} /> {label}
    </button>
  );
}

function RemoveButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} aria-label="Remove" className="text-muted hover:text-red-600">
      <Trash2 size={15} />
    </button>
  );
}
