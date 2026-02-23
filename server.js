const http = require('http');
const { URL } = require('url');

const PORT = process.env.PORT || 3000;
const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || '';

function parseCookies(cookieHeader = '') {
  return cookieHeader
    .split(';')
    .map((part) => part.trim())
    .filter(Boolean)
    .reduce((acc, part) => {
      const [key, ...value] = part.split('=');
      acc[key] = decodeURIComponent(value.join('='));
      return acc;
    }, {});
}

function renderPage(title, body, extra = '') {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <style>
    :root { color-scheme: light dark; }
    body { margin: 0; font-family: Inter, Arial, sans-serif; background: #f4f6fb; color: #111827; }
    .container { max-width: 460px; margin: 60px auto; background: #fff; border-radius: 14px; padding: 28px; box-shadow: 0 10px 30px rgba(0,0,0,.08); }
    h1 { margin-top: 0; font-size: 1.6rem; }
    form { display: grid; gap: 14px; }
    label { font-weight: 600; font-size: .92rem; }
    input { width: 100%; box-sizing: border-box; border: 1px solid #d1d5db; border-radius: 8px; padding: 10px 12px; margin-top: 6px; }
    button { border: 0; border-radius: 8px; padding: 11px 14px; background: #2563eb; color: #fff; font-weight: 700; cursor: pointer; }
    a { color: #2563eb; text-decoration: none; }
    .muted { color: #6b7280; font-size: .92rem; }
    .error { background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; padding: 10px; border-radius: 8px; margin-bottom: 14px; }
    .ok { background: #dcfce7; color: #14532d; border: 1px solid #bbf7d0; padding: 10px; border-radius: 8px; margin-bottom: 14px; }
    code { background: #f3f4f6; padding: 2px 4px; border-radius: 4px; }
    .row { display: flex; gap: 10px; align-items: center; justify-content: space-between; }
  </style>
  ${extra}
</head>
<body>
  <main class="container">${body}</main>
</body>
</html>`;
}

function loginPage(message = '', isError = false) {
  return renderPage(
    'Login',
    `${message ? `<div class="${isError ? 'error' : 'ok'}">${message}</div>` : ''}
    <h1>Log in</h1>
    <p class="muted">Use your Supabase credentials to access the dashboard.</p>
    <form method="POST" action="/login">
      <label>Email<input type="email" name="email" required /></label>
      <label>Password<input type="password" name="password" required minlength="6" /></label>
      <button type="submit">Continue</button>
    </form>
    <p class="muted">No account yet? <a href="/signup">Create one</a></p>`
  );
}

function signupPage(message = '', isError = false) {
  return renderPage(
    'Sign up',
    `${message ? `<div class="${isError ? 'error' : 'ok'}">${message}</div>` : ''}
    <h1>Create account</h1>
    <p class="muted">This calls Supabase Auth sign-up endpoint.</p>
    <form method="POST" action="/signup">
      <label>Email<input type="email" name="email" required /></label>
      <label>Password<input type="password" name="password" required minlength="6" /></label>
      <button type="submit">Sign up</button>
    </form>
    <p class="muted">Already registered? <a href="/login">Log in</a></p>`
  );
}

function dashboardPage(email) {
  return renderPage(
    'Dashboard',
    `<div class="row"><h1>Dashboard</h1><form method="POST" action="/logout"><button type="submit">Log out</button></form></div>
    <p class="muted">Protected route verified through Supabase auth user endpoint.</p>
    <p>Welcome <strong>${email || 'user'}</strong>.</p>
    <p>Env required: <code>SUPABASE_URL</code> and <code>SUPABASE_ANON_KEY</code>.</p>`
  );
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => (data += chunk));
    req.on('end', () => resolve(new URLSearchParams(data)));
    req.on('error', reject);
  });
}

async function supabaseAuth(path, payload, accessToken = null) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return { error: { message: 'Missing SUPABASE_URL or SUPABASE_ANON_KEY env vars.' } };
  }

  const headers = {
    apikey: SUPABASE_ANON_KEY,
    'Content-Type': 'application/json',
  };

  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

  const response = await fetch(`${SUPABASE_URL}/auth/v1/${path}`, {
    method: payload ? 'POST' : 'GET',
    headers,
    body: payload ? JSON.stringify(payload) : undefined,
  });

  const json = await response.json().catch(() => ({}));
  return json;
}

function redirect(res, location) {
  res.writeHead(302, { Location: location });
  res.end();
}

const server = http.createServer(async (req, res) => {
  const requestUrl = new URL(req.url, `http://${req.headers.host}`);
  const cookies = parseCookies(req.headers.cookie);

  if (req.method === 'GET' && requestUrl.pathname === '/') return redirect(res, '/login');

  if (req.method === 'GET' && requestUrl.pathname === '/login') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    return res.end(loginPage(requestUrl.searchParams.get('message') || '', requestUrl.searchParams.get('error') === '1'));
  }

  if (req.method === 'POST' && requestUrl.pathname === '/login') {
    const body = await readBody(req);
    const data = await supabaseAuth('token?grant_type=password', {
      email: body.get('email'),
      password: body.get('password'),
    });

    if (data.error || !data.access_token) {
      const message = encodeURIComponent(data.error?.message || 'Login failed.');
      return redirect(res, `/login?error=1&message=${message}`);
    }

    res.setHeader('Set-Cookie', `sb-access-token=${encodeURIComponent(data.access_token)}; HttpOnly; Path=/; Max-Age=${data.expires_in || 3600}; SameSite=Lax`);
    return redirect(res, '/dashboard');
  }

  if (req.method === 'GET' && requestUrl.pathname === '/signup') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    return res.end(signupPage(requestUrl.searchParams.get('message') || '', requestUrl.searchParams.get('error') === '1'));
  }

  if (req.method === 'POST' && requestUrl.pathname === '/signup') {
    const body = await readBody(req);
    const data = await supabaseAuth('signup', {
      email: body.get('email'),
      password: body.get('password'),
    });

    if (data.error) {
      const message = encodeURIComponent(data.error.message || 'Signup failed.');
      return redirect(res, `/signup?error=1&message=${message}`);
    }

    const message = encodeURIComponent('Signup successful. Check your email confirmation if enabled, then login.');
    return redirect(res, `/login?message=${message}`);
  }

  if (req.method === 'GET' && requestUrl.pathname === '/dashboard') {
    const token = cookies['sb-access-token'];
    if (!token) return redirect(res, '/login?error=1&message=Please+login+first');

    const userData = await supabaseAuth('user', null, token);
    if (userData.error || !userData.email) {
      res.setHeader('Set-Cookie', 'sb-access-token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax');
      return redirect(res, '/login?error=1&message=Session+expired.+Login+again');
    }

    res.writeHead(200, { 'Content-Type': 'text/html' });
    return res.end(dashboardPage(userData.email));
  }

  if (req.method === 'POST' && requestUrl.pathname === '/logout') {
    res.setHeader('Set-Cookie', 'sb-access-token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax');
    return redirect(res, '/login?message=Logged+out');
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not Found');
});

server.listen(PORT, () => {
  console.log(`App running on http://localhost:${PORT}`);
});
