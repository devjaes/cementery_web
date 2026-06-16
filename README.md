# Cementerios — Web

> Cemetery management system: niche lifecycle (inventory, ownership, inheritance, payments, burial procedures). Frontend.

## Problem
Local cemetery operations were still paper-driven: hand-written ledgers tracked who owned which niche, who was buried where, which payments were outstanding, and who inherited a plot after a death. Information lived in different desks and notebooks, niche state was easy to lose between reservation, sale, and burial, and inheritance gaps quietly broke ownership chains over generations.

## Approach
The system models the niche as a domain object with an explicit state machine (available → reserved → sold → occupied, with reversals for exhumations) instead of flat records. The UI is organized around an interactive map of blocks and niches that reflects state live, role-scoped flows for administrators, families and operators, and validation chains that gate sensitive procedures (burials, exhumations) behind payment, ownership and documentation checks. Regular blocks (sold per niche) and mausoleums (sold as a family unit) are first-class concepts.

## Stack
| Layer | Tech |
|---|---|
| Framework | Next.js 15 (App Router, Turbopack) |
| UI | React 19, Tailwind CSS 4, Radix UI, lucide-react |
| Forms & validation | react-hook-form + zod (`@hookform/resolvers`) |
| Auth | NextAuth 4 (JWT sessions, role + accessToken on session) |
| Data fetching | TanStack Query + axios |
| Tables | TanStack Table |
| State | Zustand |
| PDF | jsPDF (receipts) |
| Language | TypeScript 5 |

Backend pair: [`devjaes/cementery_back`](https://github.com/devjaes/cementery_back) — NestJS 11 + PostgreSQL, with AWS S3 for file storage.

## Highlights
- Interactive map of blocks and niches with live state coloring
- Multi-state niche lifecycle with explicit reversal flows (exhumations) instead of destructive edits
- Multi-owner niches and inheritance UI to keep ownership chains intact across generations
- PDF receipt rendering for payments (jsPDF)
- Validation chains that gate burial registration (payment, ownership, documentation)
- Role-scoped surfaces driven by `session.user.role` from NextAuth
- Feature-folder layout (`bloques`, `nichos`, `inhumaciones`, `exhumaciones`, `propietarios-nichos`, `payment`, `requisitos-inhumacion`, `reports`, `map`, …) keeping each domain concept self-contained

## Local setup
Requires Node 20.14.0 (`nvm install 20.14.0 && nvm use 20.14.0`) and Yarn.

```bash
# 1. Start the backend first — see devjaes/cementery_back
# 2. Then in this repo:
cp env.example .env        # set NEXT_PUBLIC_BACKEND_API_URL, AUTH_SECRET, NEXTAUTH_URL
yarn install
yarn dev                   # Next.js dev server with Turbopack
```

The app runs on [http://localhost:3001](http://localhost:3001) and expects the backend on the URL configured by `NEXT_PUBLIC_BACKEND_API_URL` (default `http://localhost:3000/`).

Other scripts:

```bash
yarn build     # next build
yarn start     # next start -p 3001
yarn lint      # next lint
```

## Status & limitations
- Built for a specific Ecuadorian cemetery (single-tenant). No public demo.
- Spanish-language UI, mirroring the domain vocabulary used by operators.
- Some domain flows are still iterated against real operator feedback.
- `next.config.ts` currently sets `typescript.ignoreBuildErrors` and `eslint.ignoreDuringBuilds` to keep deploys unblocked while the type surface stabilizes — a known follow-up, not the target state.

## Team & my role
- **My role:** Tech Lead — technical direction, sprint ceremonies, scope and backlog prioritization, and integration gatekeeper (every PR merged through me). I worked alongside teammates on both frontend and backend.
- **Team:** Cross-functional (frontend, backend, student interns).
- **Backend repo:** [devjaes/cementery_back](https://github.com/devjaes/cementery_back)

For the broader project narrative, see the portfolio entry at [devjaes.dev](https://devjaes.dev) under "More Work".
