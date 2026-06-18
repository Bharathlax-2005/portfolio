import type { VercelRequest, VercelResponse } from "@vercel/node";
import { requireAuth } from "../_lib/requireAuth";
import { getJSON, updateJSON } from "../_lib/github";

const FILE_PATH = "src/data/certificates.json";

interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  credentialUrl?: string;
  imageUrl?: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!requireAuth(req, res)) return;

  try {
    if (req.method === "GET") {
      const certificates = await getJSON<Certificate[]>(FILE_PATH);
      return res.status(200).json({ certificates });
    }

    if (req.method === "POST") {
      const certificates = await getJSON<Certificate[]>(FILE_PATH);
      const body = req.body ?? {};

      if (!body.title || !body.issuer) {
        return res.status(400).json({ error: "Title and issuer are required." });
      }

      const newCert: Certificate = {
        id: `cert-${Date.now()}`,
        title: body.title,
        issuer: body.issuer,
        date: body.date || "",
        credentialUrl: body.credentialUrl || undefined,
        imageUrl: body.imageUrl || undefined,
      };

      const updated = [...certificates, newCert];
      await updateJSON(FILE_PATH, updated, `Add certificate: ${newCert.title}`);
      return res.status(201).json({ certificate: newCert });
    }

    if (req.method === "PUT") {
      const body = req.body ?? {};
      if (!body.id) return res.status(400).json({ error: "Missing certificate id." });

      const certificates = await getJSON<Certificate[]>(FILE_PATH);
      const index = certificates.findIndex((c) => c.id === body.id);
      if (index === -1) return res.status(404).json({ error: "Certificate not found." });

      certificates[index] = {
        ...certificates[index],
        title: body.title ?? certificates[index].title,
        issuer: body.issuer ?? certificates[index].issuer,
        date: body.date ?? certificates[index].date,
        credentialUrl: body.credentialUrl || undefined,
        imageUrl: body.imageUrl || undefined,
      };

      await updateJSON(FILE_PATH, certificates, `Update certificate: ${certificates[index].title}`);
      return res.status(200).json({ certificate: certificates[index] });
    }

    if (req.method === "DELETE") {
      const id = req.query.id as string | undefined;
      if (!id) return res.status(400).json({ error: "Missing certificate id." });

      const certificates = await getJSON<Certificate[]>(FILE_PATH);
      const target = certificates.find((c) => c.id === id);
      const updated = certificates.filter((c) => c.id !== id);

      await updateJSON(FILE_PATH, updated, `Delete certificate: ${target?.title ?? id}`);
      return res.status(200).json({ success: true });
    }

    res.setHeader("Allow", "GET, POST, PUT, DELETE");
    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error("/api/admin/certificates error:", err);
    return res.status(500).json({ error: err instanceof Error ? err.message : "Server error." });
  }
}
