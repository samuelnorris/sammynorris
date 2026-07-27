import { defineMiddleware } from "astro:middleware";

/**
 * Temporary password gate for the public (Vercel) site.
 *
 * Everything here runs server-side only, so the password is never sent to the
 * browser — an unauthenticated visitor only ever receives the form below.
 * Local development is skipped entirely, so `astro dev` stays open as normal.
 *
 * To remove the gate: delete this file and drop `output: 'server'` from
 * astro.config.mjs to go back to a fully static build.
 */

// The function runs on Node; @types/node isn't a dependency of this project,
// so declare just the bit we read rather than pulling the types in.
declare const process: { env: Record<string, string | undefined> };

/**
 * This repo is public, so anything hardcoded here is readable on GitHub.
 * Set SITE_PASSWORD in the Vercel project's environment variables to use a
 * password that isn't in the source; the fallback below is the default.
 */
const PASSWORD = process.env.SITE_PASSWORD || "BMX";

/** Cookie name and the opaque value we store — never the password itself. */
const COOKIE_NAME = "sn_gate";
const COOKIE_VALUE = "d7f4a1c9e2b84f60";

/** How long a successful unlock lasts. */
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function gatePage(error: boolean): Response {
  return new Response(
    `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex, nofollow" />
    <title>Sammy Norris</title>
    <style>
      :root {
        --bg: #f0f0f0;
        --primary: #212121;
        --secondary: #994c30;
        --line: rgba(33, 33, 33, 0.2);
      }
      @media (prefers-color-scheme: dark) {
        :root {
          --bg: #1e1e1e;
          --primary: #ffffff;
          --secondary: #ff6a00;
          --line: rgba(255, 255, 255, 0.25);
        }
      }
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body {
        background: var(--bg);
        color: var(--primary);
        font-family: system-ui, -apple-system, sans-serif;
        font-weight: 300;
        min-height: 100svh;
        display: grid;
        place-items: center;
        padding: 24px;
      }
      main { width: 100%; max-width: 320px; }
      h1 { font-size: 20px; font-weight: 400; margin-bottom: 8px; }
      p { font-size: 14px; opacity: 0.65; margin-bottom: 28px; line-height: 1.5; }
      label { display: block; font-size: 12px; opacity: 0.65; margin-bottom: 8px; }
      input {
        width: 100%;
        font: inherit;
        font-size: 16px;
        color: var(--primary);
        background: transparent;
        border: 0;
        border-bottom: 1px solid var(--line);
        padding: 8px 0;
        border-radius: 0;
      }
      input:focus-visible { outline: 0; border-bottom-color: var(--secondary); }
      button {
        margin-top: 24px;
        font: inherit;
        font-size: 14px;
        color: var(--bg);
        background: var(--primary);
        border: 0;
        border-radius: 999px;
        padding: 10px 24px;
        cursor: pointer;
      }
      .error { color: var(--secondary); font-size: 13px; margin-top: 16px; }
    </style>
  </head>
  <body>
    <main>
      <h1>Sammy Norris</h1>
      <p>This site is being reworked at the moment. Enter the password to have a look around.</p>
      <form method="post">
        <label for="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          autocomplete="current-password"
          autofocus
          required
        />
        <button type="submit">Enter</button>
        ${error ? '<p class="error">That password is not right. Try again.</p>' : ""}
      </form>
    </main>
  </body>
</html>`,
    {
      status: error ? 401 : 200,
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "no-store",
        "x-robots-tag": "noindex, nofollow",
      },
    },
  );
}

export const onRequest = defineMiddleware(async (context, next) => {
  // Local development is never gated.
  if (import.meta.env.DEV) return next();

  // Vercel's own endpoints (analytics, insights) must stay reachable.
  if (context.url.pathname.startsWith("/_vercel/")) return next();

  if (context.cookies.get(COOKIE_NAME)?.value === COOKIE_VALUE) return next();

  if (context.request.method === "POST") {
    const submitted = (await context.request.formData()).get("password");

    if (typeof submitted === "string" && submitted.trim() === PASSWORD) {
      context.cookies.set(COOKIE_NAME, COOKIE_VALUE, {
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: COOKIE_MAX_AGE,
      });

      // Reload the requested page as a GET so a refresh doesn't re-post.
      return context.redirect(context.url.pathname, 303);
    }

    return gatePage(true);
  }

  return gatePage(false);
});
