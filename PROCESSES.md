# Safeer Properties — Website Processes

This document describes the current live flows in the app (visitor, partner, and admin).

## 1) Property discovery flow (visitor)

1. Visitor lands on `/` and uses the search card (buy/rent, keyword, type, min bedrooms).
2. The app redirects to `/properties` with query params (`transaction_type`, `q`, `type`, `minBeds`).
3. On `/properties`, filters are applied client-side in real time:
   - buy/rent/all toggle
   - keyword
   - property type
   - min bedrooms
   - region (North/South/West/Center/East)
   - scheme (when available on listings)
4. Listing cards and the map are linked; hover/select states sync between card and marker.
5. Clicking a card opens `/properties/[id]` for the full listing detail page.

## 2) Favorites flow (logged-in users)

1. User clicks heart icon on listing cards or on a listing detail page.
2. If not signed in, user is redirected to `/login`.
3. If signed in, UI updates optimistically and sends `POST /api/favorites` with `listingId`.
4. API toggles favorite state in the `favorites` table and returns `{ ok, favorited }`.
5. If request fails, UI rolls back to previous state.

## 3) Contact / lead flow (homepage)

1. Visitor fills the contact section on `/` and submits.
2. Frontend posts to `POST /api/contact`.
3. Current server behavior: request data is logged server-side and `{ ok: true }` is returned.
4. WhatsApp CTA remains available for direct chat.

Note: this endpoint currently does not send transactional email.

## 4) Partner application flow (`/partners`)

1. Agency/developer/agent fills partner form on `/partners`.
2. Server action validates required fields (`name`, `company`, `email`) and terms acceptance.
3. Application is persisted in PostgreSQL `partners` via `savePartner(...)`.
4. Two Resend emails are sent:
   - internal notification to `hello@safeer.mu`
   - confirmation email to applicant
5. UI returns success state; partner terms are available at `/partners/terms`.

## 5) Admin authentication gate

1. Admin routes are behind `/admin` layout.
2. Access is protected using `ADMIN_SECRET`.
3. Main admin sections:
   - `/admin` for listing scraping + saved listings ops
   - `/admin/partners` for partner pipeline + partner-site AI scraping

## 6) Admin listing scraping (`/admin`)

### A. Standard portal scraping

1. Admin selects source (`lexpress`, `allysmu`, `2futures`), transaction type, property type, sorting, and pages.
2. UI calls `GET /api/scrape`.
3. Scraper returns normalized listing objects.
4. Admin saves one-by-one or uses "Save All".
5. Save calls `POST /api/listings`; duplicates by URL are flagged as "Already saved".

### B. Data persistence details

- Listings are saved to table `listings` (legacy `saved_listings` is migrated/renamed).
- On successful save, if coordinates are missing, background geocoding is triggered (fire-and-forget).

## 7) Saved listings operations (`/admin` "Saved" tab)

- Search saved listings (`GET /api/listings?search=...`).
- Update scheme via `PATCH /api/listings/[id]` with `scheme`.
- Update internal notes via `PATCH /api/listings/[id]` with `notes`.
- Update availability via `PATCH /api/listings/[id]` with `available_from`.
- Delete listing via `DELETE /api/listings/[id]`.
- Export all listings:
  - JSON: `/api/export/json`
  - CSV: `/api/export/csv`

## 8) Geocoding process

1. Manual batch: admin clicks "Geocode All" -> `POST /api/geocode`.
2. Server processes listings without `lat/lng` and geocodes by `location`.
3. Rate limiting is respected (~1 request/sec).
4. UI shows result counts (`updated` vs `total missing`).

## 9) Partner management + partner AI scraping (`/admin/partners`)

### A. Partner pipeline management

- View all partner records and status (`pending`, `active`, `rejected`).
- Update status/notes/website via `PATCH /api/partners/[id]`.
- Delete partner via `DELETE /api/partners/[id]`.
- Add partner manually via `POST /api/partners`.

### B. Partner website AI scraping

1. Admin sets a partner website URL in partner record.
2. Admin starts scrape from panel -> `GET /api/scrape/partner?partner_id=...&pages=...`.
3. Backend loads partner URL, then runs AI scraper (Claude Haiku + HTML cleaning/parsing).
4. Results are shown in panel and can be saved individually or "Save All" to `/api/listings`.
5. Saved partner listings use generated source IDs like `partner_company_name`.

## 10) Services pages

Static service pages exist at `/services/[slug]`:

- `visa-residency`
- `legal-financial`
- `logistics`
- `family-lifestyle`
- `remote-worker`
- `housing`
