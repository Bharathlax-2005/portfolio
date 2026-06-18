import type { VercelRequest, VercelResponse } from "@vercel/node";
import { requireAuth } from "../_lib/requireAuth";
import { getJSON, updateJSON } from "../_lib/github";

const FILE_PATH = "src/data/content.json";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!requireAuth(req, res)) return;

  try {
    if (req.method === "GET") {
      const content = await getJSON(FILE_PATH);
      return res.status(200).json({ content });
    }

    if (req.method === "PUT") {
      const body = req.body;
      if (!body || !body.profile || !body.socials) {
        return res.status(400).json({ error: "Invalid content payload." });
      }
      await updateJSON(FILE_PATH, body, "Update profile content via admin dashboard");
      return res.status(200).json({ content: body });
    }

    res.setHeader("Allow", "GET, PUT");
    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    return res.status(500).json({ error: err instanceof Error ? err.message : "Server error." });
  }
}
