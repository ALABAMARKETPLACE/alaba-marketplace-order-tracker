# Alaba Marketplace Frontend

A modern Next.js frontend for the Alaba Marketplace delivery and e‑commerce platform. This app provides customer, seller, driver, and delivery‑company flows, talking to the Alaba NestJS backend.

## Tech Stack

- **Framework:** Next.js 15 (App Router, TypeScript)
- **UI:** Tailwind CSS, Radix UI, shadcn/ui components
- **State & Data:** React, React Query (@tanstack/react-query)
- **Charts & Visuals:** Recharts, lucide-react icons
- **Validation:** Zod, React Hook Form

## Project Structure

- `src/app` – App Router pages (auth, dashboard, products, checkout, tracking, etc.)
- `src/components` – Reusable UI and layout components
- `src/lib` – API client, hooks, and utilities
- `src/schemas` – Zod schemas for forms and API payloads
- `src/types` – Shared TypeScript types

## Requirements

- Node.js 18+ (LTS recommended)
- pnpm or npm
- Running **backend API** (NestJS) instance
  - Local: `http://localhost:3002` (default in `.env`)
  - Production: Render URL (e.g. `https://alaba-backend.onrender.com`)

The frontend uses `NEXT_PUBLIC_API_BASE_URL` to know where the backend lives.

## Getting Started (Local Development)

1. Install dependencies:

   ```bash path=null start=null
   pnpm install
   # or
   npm install
   ```

2. Create a `.env.local` at the project root (or use your preferred env file):

   ```bash path=null start=null
   NEXT_PUBLIC_API_BASE_URL=http://localhost:3002
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

3. Start the dev server:

   ```bash path=null start=null
   pnpm dev
   # or
   npm run dev
   ```

4. Open the app at `http://localhost:3000`.

## Building & Production

Build the app:

```bash path=null start=null
pnpm build
# or
npm run build
```

Start the production server:

```bash path=null start=null
pnpm start
# or
npm start
```

## Deployment

### Frontend on Vercel

1. Push this project to GitHub.
2. In Vercel, **Import Project** and select the repo.
3. Build settings (adjust if you use npm):
   - Install Command: `pnpm install`
   - Build Command: `pnpm build`
   - Output Directory: `.next`
4. Add environment variables in Vercel → Project → Settings → Environment Variables:
   - `NEXT_PUBLIC_API_BASE_URL` = your backend URL (e.g. `https://alaba-backend.onrender.com`)
   - `NEXT_PUBLIC_APP_URL` = your Vercel URL (e.g. `https://alaba-frontend.vercel.app`)
5. Redeploy.

### Backend on Render (overview)

The backend lives in a separate NestJS project (e.g. `new-alaba-marketplace`). In Render:

1. Create a **Web Service** from the backend GitHub repo.
2. Use:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run start:prod`
3. Set environment variables (database, JWT, mail, Paystack, etc.) matching your local `.env`.
4. Copy the Render URL (e.g. `https://alaba-backend.onrender.com`) and set it as `NEXT_PUBLIC_API_BASE_URL` in Vercel.

## Linting & Type Checking

```bash path=null start=null
pnpm lint
pnpm type-check
# or
npm run lint
npm run type-check
```

## Notes

- All API calls use the configured `NEXT_PUBLIC_API_BASE_URL` via the shared Axios client in `src/lib/api/client.ts`.
- Make sure CORS on the backend allows the frontend origin (e.g. Vercel URL) via `FRONTEND_URL` in the backend `.env`.