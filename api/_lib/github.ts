const GITHUB_API = "https://api.github.com";

interface GitHubEnv {
  owner: string;
  repo: string;
  branch: string;
  token: string;
}

function getEnv(): GitHubEnv {
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const token = process.env.GITHUB_TOKEN;
  const branch = process.env.GITHUB_BRANCH || "main";

  if (!owner || !repo || !token) {
    throw new Error(
      "Missing GitHub configuration. Set GITHUB_OWNER, GITHUB_REPO and GITHUB_TOKEN in your environment variables."
    );
  }

  return { owner, repo, branch, token };
}

async function githubRequest(path: string, init?: RequestInit) {
  const { token } = getEnv();
  const res = await fetch(`${GITHUB_API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GitHub API error (${res.status}): ${body}`);
  }

  return res.json();
}

export async function getFile(filePath: string): Promise<{ content: string; sha: string }> {
  const { owner, repo, branch } = getEnv();
  const data = await githubRequest(`/repos/${owner}/${repo}/contents/${filePath}?ref=${branch}`);
  const content = Buffer.from(data.content, "base64").toString("utf-8");
  return { content, sha: data.sha };
}

export async function updateFile(filePath: string, newContent: string, message: string): Promise<void> {
  const { owner, repo, branch } = getEnv();
  const { sha } = await getFile(filePath);

  await githubRequest(`/repos/${owner}/${repo}/contents/${filePath}`, {
    method: "PUT",
    body: JSON.stringify({
      message,
      content: Buffer.from(newContent, "utf-8").toString("base64"),
      sha,
      branch,
    }),
  });
}

export async function getJSON<T>(filePath: string): Promise<T> {
  const { content } = await getFile(filePath);
  return JSON.parse(content) as T;
}

export async function updateJSON(filePath: string, data: unknown, message: string): Promise<void> {
  const pretty = `${JSON.stringify(data, null, 2)}\n`;
  await updateFile(filePath, pretty, message);
}
