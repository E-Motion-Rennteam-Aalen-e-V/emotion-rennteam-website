// ⚠️ AI-assisted – the GitHub API retry logic and race-condition handling
// were developed with AI help. Race conditions are tricky to reason about.
// (GitHub-API-Logik inkl. Race-Condition-Handling – mit KI-Hilfe entwickelt.)

// Saves CMS content directly to GitHub as real commits, not local files.
// Speichert CMS-Inhalte direkt als Git-Commits auf GitHub – nicht lokal.
// Why? Because on serverless hosts like Vercel, the filesystem is read-only
// or at least doesn't persist between deploys. GitHub is our "database".
// (Auf Vercel gibt es kein persistentes Dateisystem – GitHub übernimmt
// daher die Rolle der Datenbank für alle CMS-Inhalte.)

interface GithubConfig {
  token: string;
  owner: string;
  repo: string;
  branch: string;
}

export function getGithubConfig(): GithubConfig | null {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  // "main" does NOT exist on this repo (its actual default branch is
  // "website" - verified via the GitHub API). Falling back to a
  // nonexistent branch made every content read/write fail whenever
  // GITHUB_BRANCH was left unset.
  const branch = process.env.GITHUB_BRANCH || "website";
  if (!token || !owner || !repo) return null;
  return { token, owner, repo, branch };
}

function authHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

/**
 * A raw "(401)"/"(403)" tells a redactor nothing they can act on. The two
 * codes that actually show up in practice both trace back to the same
 * fixable thing (the token in .env.local), so name it and point at the
 * fix instead of leaving them to guess.
 */
function describeGithubError(status: number, owner: string, repo: string, branch: string): string {
  if (status === 401) {
    return (
      "GitHub-Anmeldung fehlgeschlagen (401): Der GITHUB_TOKEN in .env.local ist ungültig, " +
      "falsch eingefügt oder abgelaufen. Einen neuen Token erstellen unter " +
      "https://github.com/settings/tokens (fine-grained, Berechtigung \"Contents: Read and write\" " +
      `für das Repository "${owner}/${repo}") und über den Einrichtungsassistenten (CMS-Zugangsdaten-aendern) neu eintragen.`
    );
  }
  if (status === 403) {
    return (
      "GitHub hat den Zugriff verweigert (403): Entweder hat der GITHUB_TOKEN keine Schreibrechte " +
      `für "${owner}/${repo}" (Berechtigung "Contents: Read and write" fehlt), oder das GitHub-API-Ratenlimit ` +
      "wurde erreicht. Token-Berechtigung unter https://github.com/settings/tokens prüfen."
    );
  }
  if (status === 404) {
    return (
      `GitHub-Repository oder Branch nicht gefunden (404): "${owner}/${repo}" (Branch "${branch}") existiert nicht ` +
      "oder der Token hat keinen Zugriff darauf. GITHUB_OWNER/GITHUB_REPO/GITHUB_BRANCH in .env.local prüfen."
    );
  }
  return `GitHub-Anfrage fehlgeschlagen (${status}).`;
}

async function getFileSha(config: GithubConfig, path: string): Promise<string | undefined> {
  const url = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${encodeURI(path)}?ref=${config.branch}`;
  const res = await fetch(url, { headers: authHeaders(config.token) });
  if (res.status === 404) return undefined;
  if (!res.ok) throw new Error(describeGithubError(res.status, config.owner, config.repo, config.branch));
  const data = await res.json();
  return data.sha as string;
}

async function putFile(
  config: GithubConfig,
  filePath: string,
  bodyContent: string,
  message: string,
  authorName: string,
  sha: string | undefined
): Promise<Response> {
  const url = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${encodeURI(filePath)}`;
  return fetch(url, {
    method: "PUT",
    headers: { ...authHeaders(config.token), "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      content: bodyContent,
      branch: config.branch,
      sha,
      committer: { name: authorName, email: `${authorName.toLowerCase().replace(/\s+/g, "-")}@cms.local` },
    }),
  });
}

// Saves a text file to GitHub and returns the commit URL.
// Speichert eine Textdatei auf GitHub und gibt die Commit-URL zurück.
export async function commitFile(
  path: string,
  content: string,
  message: string,
  authorName: string
): Promise<{ commitUrl: string | null }> {
  const config = getGithubConfig();
  if (!config) throw new Error("GitHub-Anbindung ist nicht konfiguriert (GITHUB_TOKEN/GITHUB_OWNER/GITHUB_REPO fehlen).");

  const b64 = Buffer.from(content, "utf-8").toString("base64");
  let sha = await getFileSha(config, path);
  let res = await putFile(config, path, b64, message, authorName, sha);
  // 422 = "SHA stale" – another save snuck in between our read and write.
  // 422 = "SHA veraltet" – ein anderer Speichervorgang kam uns zuvor.
  // We re-fetch the current SHA and try once more – that's enough for the
  // typical "two admins saving at the same time" scenario.
  if (res.status === 422) {
    sha = await getFileSha(config, path);
    res = await putFile(config, path, b64, message, authorName, sha);
  }
  if (!res.ok) {
    if (res.status === 401 || res.status === 403 || res.status === 404) {
      throw new Error(describeGithubError(res.status, config.owner, config.repo, config.branch));
    }
    const body = await res.text();
    throw new Error(`GitHub-Commit fehlgeschlagen (${res.status}): ${body}`);
  }
  const data = await res.json();
  return { commitUrl: data.commit?.html_url ?? null };
}

/** Creates or updates a binary file (e.g. an uploaded image) given raw bytes. */
export async function commitBinaryFile(
  path: string,
  bytes: Uint8Array,
  message: string,
  authorName: string
): Promise<{ commitUrl: string | null }> {
  const config = getGithubConfig();
  if (!config) throw new Error("GitHub-Anbindung ist nicht konfiguriert (GITHUB_TOKEN/GITHUB_OWNER/GITHUB_REPO fehlen).");

  const b64 = Buffer.from(bytes).toString("base64");
  let sha = await getFileSha(config, path);
  let res = await putFile(config, path, b64, message, authorName, sha);
  if (res.status === 422) {
    sha = await getFileSha(config, path);
    res = await putFile(config, path, b64, message, authorName, sha);
  }
  if (!res.ok) {
    if (res.status === 401 || res.status === 403 || res.status === 404) {
      throw new Error(describeGithubError(res.status, config.owner, config.repo, config.branch));
    }
    const body = await res.text();
    throw new Error(`GitHub-Commit fehlgeschlagen (${res.status}): ${body}`);
  }
  const data = await res.json();
  return { commitUrl: data.commit?.html_url ?? null };
}

export async function deleteFile(path: string, message: string, authorName: string): Promise<void> {
  const config = getGithubConfig();
  if (!config) throw new Error("GitHub-Anbindung ist nicht konfiguriert (GITHUB_TOKEN/GITHUB_OWNER/GITHUB_REPO fehlen).");

  const sha = await getFileSha(config, path);
  if (!sha) return;
  const url = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${encodeURI(path)}`;
  const res = await fetch(url, {
    method: "DELETE",
    headers: { ...authHeaders(config.token), "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      sha,
      branch: config.branch,
      committer: { name: authorName, email: `${authorName.toLowerCase().replace(/\s+/g, "-")}@cms.local` },
    }),
  });
  if (!res.ok) {
    if (res.status === 401 || res.status === 403 || res.status === 404) {
      throw new Error(describeGithubError(res.status, config.owner, config.repo, config.branch));
    }
    const body = await res.text();
    throw new Error(`GitHub-Löschung fehlgeschlagen (${res.status}): ${body}`);
  }
}
