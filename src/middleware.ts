import { defineMiddleware } from "astro:middleware";

const PASSWORD = "bmx";
const COOKIE_NAME = "site-auth";

export const onRequest = defineMiddleware(async (context, next) => {
  const cookie = context.cookies.get(COOKIE_NAME);

  if (cookie?.value === PASSWORD) {
    return next();
  }

  const url = new URL(context.request.url);
  const attempt = url.searchParams.get("pw");

  if (attempt === PASSWORD) {
    context.cookies.set(COOKIE_NAME, PASSWORD, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return context.redirect("/");
  }

  const wrong = attempt !== null && attempt !== PASSWORD;

  return new Response(
    `<!doctype html>
<html lang="en-GB">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Password Required</title>
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link rel="icon" type="image/png" href="/favicon-32.png" sizes="32x32" />
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Geist:wght@200;300;400&family=Instrument+Serif&display=swap" rel="stylesheet" />
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 64px;
      padding: 24px;
      background: #1E1E1E;
      color: #ffffff;
      font-family: "Geist", system-ui, sans-serif;
      font-weight: 200;
    }
    .typewriter {
      font-family: "Instrument Serif", serif;
      font-size: clamp(3rem, 10vw, 6rem);
      line-height: 0.85;
      letter-spacing: -0.01em;
      white-space: nowrap;
      padding-bottom: 0.15em;
      font-weight: 400;
      text-align: center;
    }
    .typewriter::after {
      content: "";
      display: inline-block;
      width: 2px;
      height: 0.85em;
      background: #ffffff;
      margin-left: 4px;
      vertical-align: baseline;
      animation: blink 1s ease-in-out infinite;
    }
    .typewriter.done::after {
      animation: fadeOut 1.2s ease forwards;
    }
    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }
    @keyframes fadeOut {
      to { opacity: 0; }
    }
    .gate {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }
    .gate label {
      font-size: 14px;
      opacity: 0.6;
    }
    .gate input {
      padding: 10px 16px;
      border-radius: 8px;
      border: 1px solid #575656;
      background: #292929;
      color: #ffffff;
      font-size: 16px;
      font-family: inherit;
      font-weight: 200;
      outline: none;
      text-align: center;
      width: 240px;
    }
    .gate input:focus {
      border-color: #FF6A00;
    }
    .gate button {
      padding: 8px 24px;
      border-radius: 99px;
      border: 1px solid #575656;
      background: transparent;
      color: #ffffff;
      font-size: 14px;
      font-family: inherit;
      cursor: pointer;
    }
    .gate button:hover {
      border-color: #ffffff;
    }
    .error {
      color: #FF6A00;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <h1 class="typewriter" id="typewriter" aria-label="Sammy Norris"></h1>
  <div class="gate">
    <label>Password</label>
    <input type="password" id="pw" autofocus />
    ${wrong ? '<p class="error">Wrong password</p>' : ''}
    <button id="submit">Enter</button>
  </div>
  <script>
    document.getElementById('submit').addEventListener('click', function() {
      var pw = document.getElementById('pw').value;
      window.location.href = '/?pw=' + encodeURIComponent(pw);
    });
    document.getElementById('pw').addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        var pw = document.getElementById('pw').value;
        window.location.href = '/?pw=' + encodeURIComponent(pw);
      }
    });

    (function () {
      var el = document.getElementById('typewriter');
      if (!el) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        el.textContent = 'Sammy Norris';
        el.classList.add('done');
        return;
      }
      var typeSpeed = 200;
      var deleteSpeed = 100;
      var startDelay = 400;
      var pauseBeforeDelete = 800;
      var pauseBeforeRetype = 400;
      function typeText(text, i, cb) {
        if (i < text.length) {
          el.textContent += text[i];
          setTimeout(function () { typeText(text, i + 1, cb); }, typeSpeed);
        } else if (cb) { cb(); }
      }
      function deleteChars(count, cb) {
        var current = el.textContent || '';
        if (count > 0 && current.length > 0) {
          el.textContent = current.slice(0, -1);
          setTimeout(function () { deleteChars(count - 1, cb); }, deleteSpeed);
        } else if (cb) { cb(); }
      }
      setTimeout(function () {
        typeText('Samuel', 0, function () {
          setTimeout(function () {
            deleteChars(3, function () {
              setTimeout(function () {
                typeText('my Norris', 0, function () {
                  el.classList.add('done');
                });
              }, pauseBeforeRetype);
            });
          }, pauseBeforeDelete);
        });
      }, startDelay);
    })();
  </script>
</body>
</html>`,
    {
      status: 200,
      headers: { "Content-Type": "text/html" },
    }
  );
});