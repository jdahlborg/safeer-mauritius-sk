# Safeer Properties — Processes

Operational reference for the current app behavior.

## Scope

- Visitor flows: search, listing details, contact, favorites
- User auth: magic link login, sessions, favorites
- Partner flows: partner portal, listing management
- Admin flows: dashboard, scraping, curation, geocoding, leads, partner management

---

## 1) Property Discovery (Visitor)

**Entry point:** `/`
**Trigger:** homepage search card submit
**Result:** redirected to `/properties` with URL params

### Steps

1. User selects buy/rent + optional keyword/type/min bedrooms.
2. App opens `/properties` with query params: `transaction_type`, `q`, `type`, `minBeds`.
3. Listings page applies client-side filtering in real time:
   - Transaction type tab (all/buy/rent)
   - Keyword search
   - Property type
   - Min bedrooms
   - Region (North/South/West/Center/East)
   - Scheme (PDS/IRS/RES/G+2/Smart City)
4. Map with marker clustering and cards stay synchronized.
5. User opens listing detail at `/properties/[id]`.

---

## 2) User Authentication (Magic Link)

**Entry:** `/login`
**Flow:** email → magic link email → `/auth/verify?token=...` → session cookie

### Steps

1. User enters email at `/login`.
2. Server calls `createMagicLink(email)` → stores token (15 min TTL, single-use).
3. Resend sends email from `onboarding@resend.dev` with sign-in button.
4. User clicks link → `GET /auth/verify?token=...`.
5. Token verified → user created or retrieved via `getOrCreateUser(email)`.
6. Session created (`sessions` table, 30-day TTL), `session` cookie set (httpOnly).
7. Redirect:
   - Active partner → `/partner`
   - Regular user → `/my/favorites`
8. Sign out: `POST /logout` → deletes session, clears cookie.

---

## 3) Favorites (Authenticated Users)

**Trigger:** heart icon click on listing cards or detail page
**API:** `POST /api/favorites`
**Data:** `{ listingId }`

### Steps

1. If no user session → redirect to `/login`.
2. Authenticated user gets optimistic UI toggle.
3. Backend updates `favorites` join table via `toggleFavorite(userId, listingId)`.
4. Response: `{ ok, favorited }`.
5. On error, UI reverts optimistic state.
6. Saved listings viewable at `/my/favorites`.

---

## 4) Contact / Lead Flow

**Trigger:** homepage contact form submit
**API:** `POST /api/contact`

### Steps

1. Frontend posts `{ name, email, phone, message, source, listing_id?, partner_id? }`.
2. Server calls `saveLead(...)` → persists to `leads` table.
3. Admin sees new leads at `/admin/leads`.
4. WhatsApp FAB remains available as alternate channel.

---

## 5) Admin Access Control

**Protected area:** `/admin/*`
**Guard:** `ADMIN_SECRET` env var, stored as `admin_session` cookie (8-hour TTL)
**Login:** `/admin/login`

When authenticated as admin, the nav shows an "Admin" link (gear icon).

### Admin sections

| Route | Purpose |
|---|---|
| `/admin` | Dashboard: stats, quick actions, recent leads |
| `/admin/listings` | Scrape portals + manage all saved listings |
| `/admin/partners` | Manage all partners (add, activate, reject) |
| `/admin/leads` | View and manage all contact leads |

---

## 6) Admin Dashboard (`/admin`)

**Loader:** `getAdminStats()` + `getLeads()` (last 10)

Shows:
- Stat cards: total listings, active, sold/rented, active partners, pending partners, unread leads
- Quick-action links to Listings, Partners, Leads sections
- Recent leads table with mark-as-read

---

## 7) Standard Listing Scraping (`/admin/listings`)

**Trigger:** "Scrape Listings" button
**API:** `GET /api/scrape`

### Sources

- `lexpress` — L'Express Property (buy/rent/holiday, sortable)
- `allysmu` — Ally's Real Estate (buy/rent)
- `2futures` — 2Futures (buy only)

### Inputs

- `source`, `transaction_type`, `property_type`, `sort_by`, `pages`

### Steps

1. Backend scraper returns normalized listings.
2. Admin saves individually or via "Save All" → `POST /api/listings`.
3. Duplicate URLs return "Already saved".

---

## 8) Listing Curation (`/admin/listings` — Saved tab)

**Table:** `listings`

### Operations

- Search: `GET /api/listings?search=...`
- Full edit (all fields): opens modal → `PATCH /api/listings/[id]`
- Status toggle: Active / Sold / Rented → `PATCH /api/listings/[id]` with `status`
- Assign to partner: partner dropdown in edit modal → `partner_id`
- Delete: `DELETE /api/listings/[id]`
- Export JSON/CSV: `/api/export/json`, `/api/export/csv`
- Geocode all: `POST /api/geocode`

### Listing fields

`title`, `price`, `location`, `bedrooms`, `size`, `transaction_type`, `property_type`, `status` (active/sold/rented), `scheme`, `agency`, `partner_id`, `available_from`, `image`, `url`, `notes`, `lat`, `lng`

---

## 9) Batch Geocoding

**Trigger:** "Geocode All" button
**API:** `POST /api/geocode`

1. Fetch listings missing `lat/lng`.
2. Geocode each by `location` string.
3. Respect provider rate limit (~1 req/sec).
4. Return `{ updated, total }`.

---

## 10) Partner Management (`/admin/partners`)

### Pipeline

- List all partners with status (`pending` / `active` / `rejected`)
- Add manually or receive via inbound form (deprecated — no public partner page)
- Update status/notes/website: `PATCH /api/partners/[id]`
- Delete: `DELETE /api/partners/[id]`

### AI scraping per partner

**Trigger:** "Start Scrape" button in partner row
**API:** `GET /api/scrape/partner?partner_id=...&pages=...`

1. Admin sets partner website URL.
2. AI scraper processes pages and extracts structured listings.
3. Results saved individually or via "Save All" → `POST /api/listings` (auto-sets `partner_id`).

---

## 11) Partner Portal (`/partner`)

**Access:** active partners only (email must match a `status = 'active'` partner record)
**Auth:** same magic link flow as regular users → redirected to `/partner` instead of `/my/favorites`

### Operations

- View own listings (filtered by `partner_id`)
- Add new listing: form → `POST /api/listings` (auto-injects `partner_id`)
- Edit listing: modal → `PATCH /api/listings/[id]`
- Mark as sold/rented: status dropdown in edit modal
- Delete listing: `DELETE /api/listings/[id]`
- Refresh own listings: `GET /api/partner/listings`

---

## 12) Leads Management (`/admin/leads`)

**Table:** `leads`
**Fields:** `name`, `email`, `phone`, `message`, `source` (general/listing/partner), `listing_id?`, `partner_id?`, `read`, `created_at`

### Operations

- Filter by: All / Unread / General / Listing enquiries / Partner enquiries
- Mark as read: `PATCH /api/leads/[id]` with `{ read: true }`
- Mark all as read: parallel PATCH calls
- Reply by email: mailto link pre-filled with subject

---

## 13) Services Pages

Static pages at `/services/[slug]`:

- `legal-financial`
- `logistics`
- `family-lifestyle`
- `remote-worker`
- `housing`
