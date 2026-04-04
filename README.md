# Safeer Properties Mauritius

Full-stack property and relocation platform for Mauritius — helping expats and foreign investors buy, rent, and settle on the island.

## Features

- Property marketplace with filtering (buy/rent, type, area, scheme)
- Individual property pages with image gallery and key stats
- AI-powered scraper for partner agency websites (Claude Haiku)
- Admin dashboard: scrape listings, manage saved properties, manage partners
- Partner program with application form, email confirmation, and referral terms
- Transactional email via Resend
- Services directory: visa/residency, legal & financial, logistics, family support

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | SvelteKit 2 + Svelte 5 runes |
| Styling | Tailwind CSS 4 |
| Database | PostgreSQL (Neon serverless) |
| Email | Resend |
| AI scraping | Anthropic Claude Haiku |
| HTML scraping | Cheerio |
| Deployment | Vercel |

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm
- A PostgreSQL database (e.g. [Neon](https://neon.tech))

### Setup

```bash
pnpm install
cp .env.example .env
# Fill in the required values in .env
pnpm dev
```

### Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `RESEND_API_KEY` | Resend API key for transactional email |
| `ANTHROPIC_API_KEY` | Anthropic API key for AI-powered scraping |
| `ADMIN_SECRET` | Simple secret for admin route access |

### Commands

```bash
pnpm dev          # Start dev server (http://localhost:5173)
pnpm build        # Production build
pnpm preview      # Preview production build locally
pnpm check        # TypeScript type-check
```

## Project Structure

```
src/
├── routes/
│   ├── +page.svelte              # Homepage
│   ├── properties/               # Property listings + detail pages
│   ├── services/                 # Service category pages
│   ├── partners/                 # Partner landing page + terms
│   ├── admin/                    # Admin dashboard (listings + partners)
│   └── api/                      # API endpoints
│       ├── listings/             # CRUD for saved listings
│       ├── partners/             # Partner management
│       ├── scrape/               # Scrape triggers
│       ├── contact/              # Contact form handler
│       └── export/               # JSON/CSV export
└── lib/
    ├── server/
    │   ├── db.ts                 # Database client + all queries
    │   └── scrapers/
    │       ├── ai-scraper.ts     # AI-powered partner site scraper
    │       └── types.ts          # Shared scraper types
    └── components/
        ├── Nav.svelte
        └── Footer.svelte
```

## Database

Tables are created automatically on first use via `CREATE TABLE IF NOT EXISTS` — no migration tool needed.

**`saved_listings`** — scraped and curated property listings
**`partners`** — partner agency applications and contact details

## Property Schemes

Mauritius-specific ownership schemes tracked per listing:

| Scheme | Description |
|---|---|
| PDS | Property Development Scheme — USD 375k+ grants Permanent Residence |
| IRS | Integrated Resort Scheme — legacy luxury resort residences |
| RES | Real Estate Scheme — smaller-scale foreign-ownership developments |
| G+2 | Ground + 2 floors apartment developments |
| Smart City | Mixed-use smart city developments |

## Deployment

Deployed on Vercel via `@sveltejs/adapter-vercel`.

```bash
vercel --prod
```
