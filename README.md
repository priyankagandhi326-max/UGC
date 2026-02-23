# UGC

Simple Node.js app with Supabase Auth pages:

- `GET /login` + `POST /login`
- `GET /signup` + `POST /signup`
- Protected `GET /dashboard`
- `POST /logout`

## Run locally

```bash
export SUPABASE_URL="https://<your-project-ref>.supabase.co"
export SUPABASE_ANON_KEY="<your-anon-key>"
npm run dev
```

Then open <http://localhost:3000>.
