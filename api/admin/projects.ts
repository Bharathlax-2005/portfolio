import type { VercelRequest, VercelResponse } from "@vercel/node";
import { requireAuth } from "../_lib/requireAuth";
import { getJSON, updateJSON } from "../_lib/github";

const FILE_PATH = "src/data/projects.json";

interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  githubUrl?: string;
  demoUrl?: string;
  imageUrl?: string;
  featured?: boolean;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!requireAuth(req, res)) return;

  try {
    if (req.method === "GET") {
      const projects = await getJSON<Project[]>(FILE_PATH);
      return res.status(200).json({ projects });
    }

    if (req.method === "POST") {
      const projects = await getJSON<Project[]>(FILE_PATH);
      const body = req.body ?? {};

      if (!body.title || !body.description) {
        return res.status(400).json({ error: "Title and description are required." });
      }

      const newProject: Project = {
        id: `proj-${Date.now()}`,
        title: body.title,
        description: body.description,
        techStack: Array.isArray(body.techStack) ? body.techStack : [],
        githubUrl: body.githubUrl || undefined,
        demoUrl: body.demoUrl || undefined,
        imageUrl: body.imageUrl || undefined,
        featured: Boolean(body.featured),
      };

      const updated = [...projects, newProject];
      await updateJSON(FILE_PATH, updated, `Add project: ${newProject.title}`);
      return res.status(201).json({ project: newProject });
    }

    if (req.method === "PUT") {
      const body = req.body ?? {};
      if (!body.id) return res.status(400).json({ error: "Missing project id." });

      const projects = await getJSON<Project[]>(FILE_PATH);
      const index = projects.findIndex((p) => p.id === body.id);
      if (index === -1) return res.status(404).json({ error: "Project not found." });

      projects[index] = {
        ...projects[index],
        title: body.title ?? projects[index].title,
        description: body.description ?? projects[index].description,
        techStack: Array.isArray(body.techStack) ? body.techStack : projects[index].techStack,
        githubUrl: body.githubUrl || undefined,
        demoUrl: body.demoUrl || undefined,
        imageUrl: body.imageUrl || undefined,
        featured: Boolean(body.featured),
      };

      await updateJSON(FILE_PATH, projects, `Update project: ${projects[index].title}`);
      return res.status(200).json({ project: projects[index] });
    }

    if (req.method === "DELETE") {
      const id = req.query.id as string | undefined;
      if (!id) return res.status(400).json({ error: "Missing project id." });

      const projects = await getJSON<Project[]>(FILE_PATH);
      const target = projects.find((p) => p.id === id);
      const updated = projects.filter((p) => p.id !== id);

      await updateJSON(FILE_PATH, updated, `Delete project: ${target?.title ?? id}`);
      return res.status(200).json({ success: true });
    }

    res.setHeader("Allow", "GET, POST, PUT, DELETE");
    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error("/api/admin/projects error:", err);
    return res.status(500).json({ error: err instanceof Error ? err.message : "Server error." });
  }
}
