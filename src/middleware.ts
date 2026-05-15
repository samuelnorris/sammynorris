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
  <link href="https://fonts.googleapis.com/css2?family=Geist:wght@200;300;400&display=swap" rel="stylesheet" />
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #1E1E1E;
      color: #ffffff;
      font-family: "Geist", system-ui, sans-serif;
      font-weight: 200;
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
  </script>
</body>
</html>`,
    {
      status: 200,
      headers: { "Content-Type": "text/html" },
    }
  );
});