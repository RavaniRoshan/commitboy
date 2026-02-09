import { NextResponse } from "next/server";

const FALLBACK = {
  repos: 48,
  stars: 312,
  changelogs: 1260,
  recent: [
    "Release 1.4.2 — “Authentication Cleanup”",
    "Release 0.9.0 — “Docs + Dependency Refresh”",
    "Release 2.1.0 — “Mobile Fix Pack”",
  ],
};

type GithubResponse = {
  stargazers_count?: number;
};

export async function GET() {
  const owner = process.env.COMMITBOY_REPO_OWNER || "RavaniRoshan";
  const repo = process.env.COMMITBOY_REPO_NAME || "commitboy";
  const token = process.env.GITHUB_TOKEN;

  let stars = FALLBACK.stars;

  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      next: { revalidate: 1800 },
    });
    if (response.ok) {
      const data = (await response.json()) as GithubResponse;
      if (typeof data.stargazers_count === "number") {
        stars = data.stargazers_count;
      }
    }
  } catch {
    // Keep fallback values.
  }

  const payload = {
    ...FALLBACK,
    stars,
  };

  return NextResponse.json(payload, {
    headers: {
      "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=300",
    },
  });
}
