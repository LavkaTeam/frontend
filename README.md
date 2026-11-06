# Users App 🛒 B2Bar Marketplace

A modern and responsive React application

## 🚀 Features

✅ List and view product details

✅ Create, edit, and browse listings

✅ Efficient data fetching with TanStack React Query

✅ State management with Redux Toolkit

✅ Modular, reusable component architecture

## 🧱 Technologies Used

⚛️ React + TypeScript

⚡️ Vite — for a fast and optimized development experience

🔥 TanStack React Query — for seamless async data fetching

🗄️ Redux Toolkit — for global state management

💻 HTML5, CSS3

🌐 Fetch API for REST requests

## 📦 Getting Started

```bash
git clone https://github.com/Lavka-Team/frontend.git
cd frontend
pnpm install
pnpm run dev
```


## 🎭 Demo deployment

The same code runs as a **demo**: a visitor gets a ready-made buyer or seller
account in one click, with private fictional data that is deleted after a few
hours. The demo is a second deployment (for example `demo.b2bar.tech`) that
talks to a demo backend (`APP_ENV=demo`, see `docs/9-demo-mode.md` of the
backend). A build without `VITE_DEMO_MODE` is the normal site and contains no
demo code.

| Variable | Demo | Production |
|---|---|---|
| `VITE_API_URL` | `https://api.demo.b2bar.tech/api` | the production API |
| `VITE_DEMO_MODE` | `true` | not set |
| `VITE_PROD_URL` | `https://b2bar.tech` (link in the demo footer) | not set |
| `VITE_DEMO_URL` | not set | optional, e.g. `https://demo.b2bar.tech`: adds a "Try the demo" link to the footer |

Set them in the Vercel project of the demo (a second project from the same
repository and the `master` branch; `vercel.json` stays as it is). The demo
build adds `noindex` to the page and a `robots.txt` that disallows everything.
The backend must allow the demo origin (`DEMO_ALLOWED_ORIGINS`), otherwise CORS
blocks every request.

Where the demo code lives: `src/features/demo/**`. Shared files only reach it
through `isDemoMode` checks and lazy imports, so a production build drops it
(check: `grep -r "DEMO ENVIRONMENT" dist` is empty without `VITE_DEMO_MODE`).

Working on the demo UI without a demo backend: set `VITE_DEMO_MODE=true` and
`VITE_DEMO_MOCK=true` in `.env` and run `pnpm run dev`. A fake backend answers
the demo endpoints (dev server only; it is not part of any build). In the
browser console: `__demoMock.delay(15000)` (slow first response),
`__demoMock.fail('DEMO_CAPACITY_REACHED')` (next create fails),
`__demoMock.expire()` (the sandbox ends), `__demoMock.expiresIn(240000)`.

Checks of both builds: `npm run build` and `VITE_DEMO_MODE=true npm run build`.
