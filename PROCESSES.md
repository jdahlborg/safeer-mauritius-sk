# Safeer Properties — Website Processes

## 1. Property Search (Visitor)

1. Visitor lands on homepage and uses the search card: selects Buy or Rent, optionally enters a keyword, property type, and minimum bedrooms.
2. Search redirects to `/properties` with URL params pre-filling the filters.
3. On the listings page, visitor refines results using the sticky filter bar: Buy/Rent/All toggle, keyword, property type, min bedrooms, region (North/South/West/Center/East), and scheme (PDS/IRS/RES etc.).
4. Listings are filtered in real-time client-side. A map panel on the right shows geocoded listings; hovering a card highlights the pin and vice versa.
5. Visitor clicks a listing card to go to `/properties/[id]` for the full detail page.

## 2. Contact / Lead Submission (Visitor)

1. Visitor fills in the contact form on the homepage (`#contact` section): name, email, phone/WhatsApp, interest area, and a free-text message.
2. Form submits to `POST /api/contact` which sends a transactional email via Resend.
3. A toast confirmation is shown; Safeer team responds within 24 hours.
4. A floating WhatsApp button is always visible for direct chat.

## 3. Partner Application (Agency / Developer)

1. Agency or developer visits `/partners` to learn about the program and review the buyer audience profile and pricing tiers.
2. Clicks "Get Started as a Partner" and fills in the application form at the bottom of the page: name, company, email, phone, partner type, portfolio description, and agreement to partner terms.
3. Form submits via SvelteKit form action (`POST /partners`), which:
   - Saves the application to the `partners` table in PostgreSQL.
   - Sends a confirmation email to the applicant via Resend with their application summary and a link to the full partner terms.
4. A success state is shown in-page. Safeer admin reviews and follows up within one business day.
5. Partner terms are available at `/partners/terms`.

## 4. Admin: Scraping Listings (Admin)

The admin dashboard is at `/admin` (protected by `ADMIN_SECRET`).

### Standard scrapers (Cheerio-based)
1. Admin selects a source (L'Express Property, Ally's Real Estate, or 2Futures), transaction type, property type, sort order, and number of pages.
2. Clicks "Scrape Listings" which calls `GET /api/scrape` with the chosen params.
3. The server-side scraper (Cheerio) fetches the portal HTML and parses listing data.
4. Results appear as cards. Admin can save individual listings or click "Save All".
5. Saving calls `POST /api/listings`, which inserts into the `saved_listings` table. Duplicates (same URL) are detected and flagged.

### AI scraper (partner sites)
- `POST /api/scrape/partner` accepts a `websiteUrl` and `agency` name.
- The scraper fetches the HTML, strips noise with Cheerio, then passes cleaned HTML to Claude Haiku.
- Claude extracts structured listing data (title, price, location, bedrooms, size, images, scheme, payment type, URL) as a JSON array.
- Pagination is followed automatically up to a configurable `maxPages` limit.
- Results are deduplicated by URL before being returned.

## 5. Admin: Managing Saved Listings

On the "Saved" tab of `/admin`:

- Search saved listings by keyword.
- Assign a property scheme (PDS, IRS, RES, G+2, Smart City) via a dropdown — saved via `PATCH /api/listings/[id]`.
- Add/edit internal notes — saved on input via `PATCH /api/listings/[id]`.
- Delete a listing with the red ✕ button (`DELETE /api/listings/[id]`).
- Export all saved listings as JSON (`/api/export/json`) or CSV (`/api/export/csv`).

## 6. Admin: Geocoding

- Listings without coordinates (lat/lng) cannot appear on the map.
- Clicking "Geocode All" on the admin dashboard calls `POST /api/geocode`.
- The server iterates listings missing coordinates, calls the geocoding service with each listing's `location` string, and updates `lat`/`lng` in the database.
- The results count (updated / total) is shown as a toast notification.

## 7. Admin: Partner Management

At `/admin/partners`:

- View all partner applications with their status, company, type, and contact details.
- Update partner status (pending → approved / rejected) via the partner management interface.
- Updates call `PATCH /api/partners/[id]`.

## 8. Services Pages

Static informational pages at `/services/[slug]`. Available service categories:

- `visa-residency` — Premium Visa, Occupation Permit, Investor Permit, Retired Non-Citizen
- `legal-financial` — company formation, tax planning, banking
- `logistics` — international removals, customs, vehicle/pet import
- `family-lifestyle` — schooling, healthcare, community
- `remote-worker` — visa, co-working, SIM, bank, housing bundle
- `housing` — deal negotiation, lease review, home setup
