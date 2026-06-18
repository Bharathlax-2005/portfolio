import { useEffect, useState } from "react";
import { api } from "./api";

interface SessionResponse {
  authenticated: boolean;
  email?: string;
}

export function useAuth() {
  const [status, setStatus] = useState<"loading" | "authed" | "guest">("loading");
  const [email, setEmail] = useState<string | undefined>();

  useEffect(() => {
    api<SessionResponse>("/api/auth/session")
      .then((data) => {
        setStatus(data.authenticated ? "authed" : "guest");
        setEmail(data.email);
      })
      .catch(() => setStatus("guest"));
  }, []);

  return { status, email };
}
