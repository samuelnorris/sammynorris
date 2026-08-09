import type { APIRoute } from "astro";

// The scoreboard is shared across devices, so this one route runs on demand.
// Every other page in the site stays prerendered.
export const prerender = false;

const KEY = "bmx:scores";
const TOP = 20;          // rows handed back to the board
const KEEP = 100;        // rows kept in Redis
const MAX_SCORE = 50000; // sanity cap - a 30s run can't get near this
const MAX_NAME = 14;     // matches the maxlength on the input
const RATE_LIMIT = 10;   // saves per minute, per IP

// Sorted-set members have to be unique, so each row is stored as a fixed-width
// random id followed by the name. Two riders with the same name and the same
// score therefore stay as separate entries, and no separator character is
// needed (which means no name can be split in the wrong place).
const ID_LEN = 8;

// Strip control characters so a name can't break the board layout.
const CONTROL_CHARS = /\p{Cc}/gu;

// Vercel injects these when the Upstash for Redis integration is added to the
// project. import.meta.env carries them in SSR; process.env is the fallback for
// the Vercel Node runtime.
const env = (key: string): string | undefined =>
  (import.meta.env as Record<string, string | undefined>)[key] ??
  (globalThis as { process?: { env: Record<string, string | undefined> } })
    .process?.env[key];

const REDIS_URL = env("KV_REST_API_URL") ?? env("UPSTASH_REDIS_REST_URL");
const REDIS_TOKEN = env("KV_REST_API_TOKEN") ?? env("UPSTASH_REDIS_REST_TOKEN");

type ScoreRow = { name: string; score: number };

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });

/** Run one or more Redis commands through the Upstash REST API. */
async function redis(commands: (string | number)[][]): Promise<unknown[]> {
  if (!REDIS_URL || !REDIS_TOKEN) throw new Error("Redis is not configured");
  const res = await fetch(REDIS_URL + "/pipeline", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + REDIS_TOKEN,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(commands),
  });
  if (!res.ok) throw new Error("Redis returned " + res.status);
  const out = (await res.json()) as { result?: unknown; error?: string }[];
  const failed = out.find((r) => r.error);
  if (failed) throw new Error(failed.error);
  return out.map((r) => r.result);
}

/** Upstash returns a sorted set as a flat [member, score, member, score] list. */
function toRows(flat: string[]): ScoreRow[] {
  const rows: ScoreRow[] = [];
  for (let i = 0; i < flat.length; i += 2) {
    rows.push({
      name: String(flat[i]).slice(ID_LEN),
      score: Number(flat[i + 1]) || 0,
    });
  }
  return rows;
}

function newId() {
  return Math.random().toString(36).slice(2, 2 + ID_LEN).padEnd(ID_LEN, "0");
}

export const GET: APIRoute = async () => {
  try {
    const [flat] = await redis([
      ["ZRANGE", KEY, 0, TOP - 1, "REV", "WITHSCORES"],
    ]);
    return json({ scores: toRows((flat as string[]) ?? []) });
  } catch {
    return json({ error: "unavailable" }, 503);
  }
};

export const POST: APIRoute = async ({ request }) => {
  let body: { name?: unknown; score?: unknown };
  try {
    body = await request.json();
  } catch {
    return json({ error: "bad request" }, 400);
  }

  const name =
    String(body.name ?? "")
      .replace(CONTROL_CHARS, "")
      .trim()
      .slice(0, MAX_NAME) || "Rider";

  const score = Math.round(Number(body.score));
  if (!Number.isFinite(score) || score < 0 || score > MAX_SCORE) {
    return json({ error: "bad score" }, 400);
  }

  const ip = (request.headers.get("x-forwarded-for") ?? "unknown").split(",")[0].trim();
  const rateKey = "bmx:rate:" + ip;

  try {
    // Anyone can POST here, so cap how fast one address can add rows.
    const [hits] = await redis([
      ["INCR", rateKey],
      ["EXPIRE", rateKey, 60],
    ]);
    if (Number(hits) > RATE_LIMIT) return json({ error: "slow down" }, 429);

    await redis([
      ["ZADD", KEY, score, newId() + name],
      ["ZREMRANGEBYRANK", KEY, 0, -(KEEP + 1)],
    ]);
    return json({ ok: true });
  } catch {
    return json({ error: "unavailable" }, 503);
  }
};
