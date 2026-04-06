# Safeer Properties — Processes

Operational reference for the current app behavior.

## Scope

- Visitor flows: search, listing details, contact, favorites
- Partner flows: applications and partner-site ingestion
- Admin flows: scraping, curation, geocoding, exports

## 1) Property Discovery (Visitor)

**Entry point:** `/`  
**Trigger:** user submits homepage search card  
**Result:** redirected to `/properties` with URL params

### Steps

1. User selects buy/rent + optional keyword/type/min bedrooms.
2. App opens `/properties` with query params:
   - `transaction_type`
   - `q`
   - `type`
   - `minBeds`
3. Listings page applies client-side filtering in real time:
   - transaction tab (all/buy/rent)
   - keyword
   - property type
   - min bedrooms
   - region (North/South/West/Center/East)
   - scheme (if present)
4. Map and cards stay synchronized (hover/select state).
5. User opens listing detail at `/properties/[id]`.

## 2) Favorites (Authenticated Users)

**Trigger:** heart icon click on cards/detail page  
**API:** `POST /api/favorites`  
**Data:** `{ listingId }`

### Steps

1. If no user session, redirect to `/login`.
2. If authenticated, UI performs optimistic toggle.
3. Backend updates `favorites` join table.
4. Response returns `{ ok, favorited }`.
5. On error, UI reverts the optimistic state.

## 3) Contact Lead Flow

**Trigger:** homepage contact form submit  
**API:** `POST /api/contact`

### Current behavior

1. Frontend posts submitted data to API.
2. Server logs payload and responds `{ ok: true }`.
3. WhatsApp CTA remains available as alternate channel.

> Note: contact endpoint currently does not send email.

## 4) Partner Application (`/partners`)

**Trigger:** partner form submit  
**Handler:** SvelteKit action in `/partners/+page.server.ts`  
**Storage:** `partners` table

### Steps

1. Validate required fields: `name`, `company`, `email`.
2. Validate `agree_terms`.
3. Persist partner application via `savePartner(...)`.
4. Send internal Resend notification to `hello@safeer.mu`.
5. Send confirmation email to applicant.
6. Render success state in-page.

Related page: `/partners/terms`

## 5) Admin Access Control

**Protected area:** `/admin` and `/admin/partners`  
**Guard:** `ADMIN_SECRET`

Admin sections:
- `/admin`: scrape + saved listings operations
- `/admin/partners`: partner pipeline + partner AI scraping

## 6) Standard Listing Scraping (`/admin`)

**Trigger:** "Scrape Listings" button  
**API:** `GET /api/scrape`

### Inputs

- `source`: `lexpress` | `allysmu` | `2futures`
- `transaction_type`
- `property_type`
- `sort_by`
- `pages` (capped in API)

### Steps

1. Backend scraper returns normalized listings.
2. Admin saves one-by-one or via "Save All".
3. Saving uses `POST /api/listings`.
4. Duplicate URLs return "Already saved".

## 7) Listing Persistence + Curation

**Primary table:** `listings`  


### Save behavior

1. Insert listing record through `POST /api/listings`.
2. If `location` exists and coords are missing, background geocode starts (fire-and-forget).

### Saved tab operations (`/admin`)

- Search: `GET /api/listings?search=...`
- Update scheme: `PATCH /api/listings/[id]` with `scheme`
- Update notes: `PATCH /api/listings/[id]` with `notes`
- Update availability: `PATCH /api/listings/[id]` with `available_from`
- Delete: `DELETE /api/listings/[id]`
- Export JSON: `/api/export/json`
- Export CSV: `/api/export/csv`

## 8) Batch Geocoding

**Trigger:** "Geocode All" in admin  
**API:** `POST /api/geocode`

### Steps

1. Fetch listings missing `lat/lng`.
2. Geocode by `location`.
3. Respect provider rate limit (~1 req/sec).
4. Return and display `{ updated, total }`.

## 9) Partner Management (`/admin/partners`)

### Pipeline operations

- List partners with status (`pending`, `active`, `rejected`)
- Update status/notes/website: `PATCH /api/partners/[id]`
- Delete partner: `DELETE /api/partners/[id]`
- Manual add: `POST /api/partners`

### Partner AI scraping

**Trigger:** "Start Scrape" in partner panel  
**API:** `GET /api/scrape/partner?partner_id=...&pages=...`

1. Admin sets/updates partner website URL.
2. Backend resolves partner by `partner_id`.
3. AI scraper processes pages and extracts structured listings.
4. Results can be saved individually or via "Save All" to `/api/listings`.
5. Source IDs are generated per partner (e.g. `partner_company_name`).

## 10) Services Pages

Static pages at `/services/[slug]`:

- `legal-financial`
- `logistics`
- `family-lifestyle`
- `remote-worker`
- `housing`
