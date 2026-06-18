# Portfolio

A personal portfolio built with React, TypeScript, Tailwind CSS, Framer Motion, and React Router —
deployed on Vercel. Content (projects, certificates, profile, skills, experience, education) lives in
plain JSON files in this repo. A private `/admin` dashboard lets you add, edit, and delete content from
the live site without touching code — every change is committed straight to this GitHub repository,
which triggers an automatic Vercel redeploy.

No database. No CMS. No Firebase. Your repo *is* the content store.

## How content updates actually work

1. You sign in at `yourdomain.com/admin` with the email/password you configured.
2. You add, edit, or delete a project/certificate, or update your profile info.
3. A serverless function (`/api/admin/*`) uses the GitHub API to commit the updated JSON file directly
   to this repo, on your behalf.
4. That push triggers Vercel's normal Git integration, which rebuilds and redeploys the site.
5. The live site reflects your change in roughly 30–60 seconds.

This is intentional: it keeps "no database" true while still letting you edit from anywhere, on the
deployed site itself, not just from your dev machine.

## Project structure

```
src/
  data/            content.json, projects.json, certificates.json — the single source of truth
  components/      shared UI, layout, and section components
  pages/           Home + all /admin pages
  lib/              client-side API helper + auth hook
  types/           shared TypeScript interfaces
api/
  auth/            login, logout, session check
  admin/           projects / certificates / profile CRUD (all GitHub-backed)
  _lib/            GitHub Contents API helper + JWT/cookie helpers
scripts/
  generate-password-hash.mjs   utility to generate your ADMIN_PASSWORD_HASH
```

## 1. Install dependencies

```bash
npm install
```

## 2. Set up environment variables

Copy `.env.example` to `.env.local` and fill it in:

```bash
cp .env.example .env.local
```

| Variable | What it's for | How to get it |
|---|---|---|
| `ADMIN_EMAIL` | The only email allowed to sign in to `/admin` | Just pick your email |
| `ADMIN_PASSWORD_HASH` | Bcrypt hash of your admin password (never store it in plain text) | Run `npm run hash-password -- "your-strong-password"` and copy the output |
| `JWT_SECRET` | Signs admin session cookies | Run `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"` |
| `GITHUB_TOKEN` | Lets the admin dashboard commit content changes | Create at github.com/settings/tokens — needs **Contents: Read and write** access on this repo (fine-grained token) or the classic `repo` scope |
| `GITHUB_OWNER` | Your GitHub username or org | — |
| `GITHUB_REPO` | This repo's name | — |
| `GITHUB_BRANCH` | Branch the site deploys from | Usually `main` |

## 3. Run it locally

The public site works with plain `npm run dev`. To test the **admin dashboard** locally (it needs the
serverless functions), use the Vercel CLI instead, which runs both together:

```bash
npm install -g vercel
vercel dev
```

## 4. Add your real content

Either fill in placeholder content directly in `src/data/*.json` and commit, or — once deployed — just
use the `/admin` dashboard itself. Add a real headshot/resume to `public/` and point `avatarUrl` /
`resumeUrl` at them.

A note on images: there's no file-upload feature in the admin (that would need its own storage service).
Add image files to `public/images/` and reference them as `/images/your-file.png` in the relevant form
field, or just paste an external image URL.

## 5. Deploy to Vercel

1. Push this repo to GitHub.
2. In Vercel, "Add New Project" → import the repo. Vercel auto-detects the Vite framework preset.
3. Add every variable from the table above under **Project Settings → Environment Variables**.
4. Deploy. Your site is live, and `/admin` is ready to use immediately.

## Security notes

- There's exactly one admin account, defined by environment variables — there's no sign-up flow and no
  user table to worry about.
- Passwords are never stored in plain text, only as a bcrypt hash.
- Sessions are signed JWTs stored in an `HttpOnly`, `SameSite=Strict` cookie — not readable by
  JavaScript, not sent cross-site.
- Your `GITHUB_TOKEN` only needs write access to *this one repo*. Scope it that narrowly if you're using
  a fine-grained token.
- Rotate `JWT_SECRET` any time you want to invalidate all existing sessions.

## Customizing the design

Colors, fonts, and spacing live in `tailwind.config.js` under `theme.extend`. The type pairing is Space
Grotesk (display) + Inter (body) + IBM Plex Mono (the small dataset-style captions above each section) —
loaded via Google Fonts in `index.html`.
