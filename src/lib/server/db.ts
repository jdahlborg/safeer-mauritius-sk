import postgres from 'postgres';
import { env } from '$env/dynamic/private';

function getClient() {
	return postgres(env.DATABASE_URL!, { ssl: 'require', max: 5 });
}

// Run once to create/migrate the table
export async function initDb() {
	const sql = getClient();

	// Rename table if still using old name
	await sql`
		DO $$ BEGIN
			IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'saved_listings') THEN
				ALTER TABLE saved_listings RENAME TO listings;
			END IF;
		END $$
	`;

	await sql`
		CREATE TABLE IF NOT EXISTS listings (
			id               SERIAL PRIMARY KEY,
			title            TEXT,
			price            TEXT,
			location         TEXT,
			bedrooms         TEXT,
			size             TEXT,
			features         TEXT,
			url              TEXT UNIQUE,
			image            TEXT,
			images           TEXT DEFAULT '[]',
			scheme           TEXT DEFAULT '',
			transaction_type TEXT,
			property_type    TEXT,
			agency           TEXT,
			source           TEXT DEFAULT 'lexpress',
			notes            TEXT DEFAULT '',
			available_from   TEXT DEFAULT '',
			lat              FLOAT,
			lng              FLOAT,
			saved_at         TIMESTAMPTZ DEFAULT NOW()
		)
	`;

	// Column migrations for existing installs
	await sql`ALTER TABLE listings ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'lexpress'`;
	await sql`ALTER TABLE listings ADD COLUMN IF NOT EXISTS images TEXT DEFAULT '[]'`;
	await sql`ALTER TABLE listings ADD COLUMN IF NOT EXISTS scheme TEXT DEFAULT ''`;
	await sql`ALTER TABLE listings ADD COLUMN IF NOT EXISTS lat FLOAT`;
	await sql`ALTER TABLE listings ADD COLUMN IF NOT EXISTS lng FLOAT`;
	await sql`ALTER TABLE listings ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active'`;

	// Rename year_built → available_from
	await sql`
		DO $$ BEGIN
			IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'year_built') THEN
				ALTER TABLE listings RENAME COLUMN year_built TO available_from;
			ELSE
				-- Add if missing entirely
				BEGIN
					ALTER TABLE listings ADD COLUMN available_from TEXT DEFAULT '';
				EXCEPTION WHEN duplicate_column THEN NULL;
				END;
			END IF;
		END $$
	`;

	// Rename payment → transaction_type
	await sql`
		DO $$ BEGIN
			IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'payment') THEN
				ALTER TABLE listings RENAME COLUMN payment TO transaction_type;
			ELSE
				BEGIN
					ALTER TABLE listings ADD COLUMN transaction_type TEXT;
				EXCEPTION WHEN duplicate_column THEN NULL;
				END;
			END IF;
		END $$
	`;

	// ── User / session / favorites tables ───────────────────────────────────
	await sql`
		CREATE TABLE IF NOT EXISTS users (
			id         SERIAL PRIMARY KEY,
			email      TEXT UNIQUE NOT NULL,
			name       TEXT DEFAULT '',
			created_at TIMESTAMPTZ DEFAULT NOW()
		)
	`;
	await sql`
		CREATE TABLE IF NOT EXISTS sessions (
			token      TEXT PRIMARY KEY,
			user_id    INTEGER REFERENCES users(id) ON DELETE CASCADE,
			expires_at TIMESTAMPTZ NOT NULL,
			created_at TIMESTAMPTZ DEFAULT NOW()
		)
	`;
	await sql`
		CREATE TABLE IF NOT EXISTS magic_links (
			token      TEXT PRIMARY KEY,
			email      TEXT NOT NULL,
			expires_at TIMESTAMPTZ NOT NULL,
			used       BOOLEAN DEFAULT false
		)
	`;
	await sql`
		CREATE TABLE IF NOT EXISTS favorites (
			id         SERIAL PRIMARY KEY,
			user_id    INTEGER REFERENCES users(id) ON DELETE CASCADE,
			listing_id INTEGER REFERENCES listings(id) ON DELETE CASCADE,
			created_at TIMESTAMPTZ DEFAULT NOW(),
			UNIQUE(user_id, listing_id)
		)
	`;

	// ── Leads table ──────────────────────────────────────────────────────────────
	await sql`
		CREATE TABLE IF NOT EXISTS leads (
			id         SERIAL PRIMARY KEY,
			name       TEXT DEFAULT '',
			email      TEXT NOT NULL,
			phone      TEXT DEFAULT '',
			message    TEXT DEFAULT '',
			listing_id INTEGER REFERENCES listings(id) ON DELETE SET NULL,
			partner_id INTEGER REFERENCES partners(id) ON DELETE SET NULL,
			source     TEXT DEFAULT 'general',
			read       BOOLEAN DEFAULT false,
			created_at TIMESTAMPTZ DEFAULT NOW()
		)
	`;

	await sql.end();
}

// ── User types ────────────────────────────────────────────────────────────────

export interface User {
	id: number;
	email: string;
	name: string;
	created_at: string;
}

export async function getOrCreateUser(email: string, name = ''): Promise<User> {
	const sql = getClient();
	try {
		const existing = await sql`SELECT * FROM users WHERE email = ${email}`;
		if (existing.length) return existing[0] as unknown as User;
		const rows = await sql`INSERT INTO users (email, name) VALUES (${email}, ${name}) RETURNING *`;
		return rows[0] as unknown as User;
	} finally {
		await sql.end();
	}
}

export async function createSession(userId: number): Promise<string> {
	const sql = getClient();
	const { randomBytes } = await import('node:crypto');
	const token = randomBytes(32).toString('hex');
	const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
	try {
		await sql`INSERT INTO sessions (token, user_id, expires_at) VALUES (${token}, ${userId}, ${expiresAt})`;
		return token;
	} finally {
		await sql.end();
	}
}

export async function validateSession(token: string): Promise<User | null> {
	const sql = getClient();
	try {
		const rows = await sql`
			SELECT u.* FROM sessions s
			JOIN users u ON u.id = s.user_id
			WHERE s.token = ${token} AND s.expires_at > NOW()
		`;
		return rows.length ? rows[0] as unknown as User : null;
	} finally {
		await sql.end();
	}
}

export async function deleteSession(token: string): Promise<void> {
	const sql = getClient();
	try {
		await sql`DELETE FROM sessions WHERE token = ${token}`;
	} finally {
		await sql.end();
	}
}

export async function createMagicLink(email: string): Promise<string> {
	const sql = getClient();
	const { randomBytes } = await import('node:crypto');
	const token = randomBytes(32).toString('hex');
	const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
	try {
		// Invalidate any existing unused tokens for this email
		await sql`DELETE FROM magic_links WHERE email = ${email} AND used = false`;
		await sql`INSERT INTO magic_links (token, email, expires_at) VALUES (${token}, ${email}, ${expiresAt})`;
		return token;
	} finally {
		await sql.end();
	}
}

export async function verifyMagicLink(token: string): Promise<string | null> {
	const sql = getClient();
	try {
		const rows = await sql`
			SELECT email FROM magic_links
			WHERE token = ${token} AND expires_at > NOW() AND used = false
		`;
		if (!rows.length) return null;
		await sql`UPDATE magic_links SET used = true WHERE token = ${token}`;
		return rows[0].email as string;
	} finally {
		await sql.end();
	}
}

// ── Favorites ─────────────────────────────────────────────────────────────────

export async function getFavoriteIds(userId: number): Promise<Set<number>> {
	const sql = getClient();
	try {
		const rows = await sql`SELECT listing_id FROM favorites WHERE user_id = ${userId}`;
		return new Set(rows.map(r => r.listing_id as number));
	} finally {
		await sql.end();
	}
}

export async function toggleFavorite(userId: number, listingId: number): Promise<boolean> {
	const sql = getClient();
	try {
		const existing = await sql`SELECT id FROM favorites WHERE user_id = ${userId} AND listing_id = ${listingId}`;
		if (existing.length) {
			await sql`DELETE FROM favorites WHERE user_id = ${userId} AND listing_id = ${listingId}`;
			return false; // removed
		} else {
			await sql`INSERT INTO favorites (user_id, listing_id) VALUES (${userId}, ${listingId})`;
			return true; // added
		}
	} finally {
		await sql.end();
	}
}

export async function getFavoriteListings(userId: number): Promise<SavedListing[]> {
	const sql = getClient();
	try {
		const rows = await sql`
			SELECT l.* FROM listings l
			JOIN favorites f ON f.listing_id = l.id
			WHERE f.user_id = ${userId}
			ORDER BY f.created_at DESC
		`;
		return rows.map(r => parseRow(r as Record<string, unknown>));
	} finally {
		await sql.end();
	}
}

export interface SavedListing {
	id: number;
	title: string;
	price: string;
	location: string;
	bedrooms: string;
	size: string;
	features: string[];
	url: string;
	image: string;
	images: string[];
	scheme: string;
	transaction_type: string;
	property_type: string;
	agency: string;
	source: string;
	notes: string;
	available_from: string;
	lat: number | null;
	lng: number | null;
	saved_at: string;
	status: string;
}

function parseRow(row: Record<string, unknown>): SavedListing {
	return {
		...row,
		features: (() => {
			try { return JSON.parse(row.features as string); } catch { return []; }
		})(),
		images: (() => {
			try { return JSON.parse(row.images as string); } catch { return []; }
		})(),
		status: String(row.status ?? 'active'),
	} as SavedListing;
}

export async function saveListing(
	data: Record<string, unknown>
): Promise<{ ok: boolean; id?: number; error?: string }> {
	const sql = getClient();
	try {
		const rows = await sql`
			INSERT INTO listings
				(title, price, location, bedrooms, size, features, url, image, images, scheme, transaction_type, property_type, agency, source, notes, available_from, lat, lng)
			VALUES (
				${String(data.title ?? '')},
				${String(data.price ?? '')},
				${String(data.location ?? '')},
				${String(data.bedrooms ?? '')},
				${String(data.size ?? '')},
				${JSON.stringify(data.features ?? [])},
				${String(data.url ?? '')},
				${String(data.image ?? '')},
				${JSON.stringify(data.images ?? [])},
				${String(data.scheme ?? '')},
				${String(data.transaction_type ?? data.payment ?? '')},
				${String(data.property_type ?? '')},
				${String(data.agency ?? '')},
				${String(data.source ?? 'lexpress')},
				${String(data.notes ?? '')},
				${String(data.available_from ?? data.year_built ?? '')},
				${data.lat != null ? Number(data.lat) : null},
				${data.lng != null ? Number(data.lng) : null}
			)
			RETURNING id
		`;
		return { ok: true, id: rows[0].id as number };
	} catch (e: unknown) {
		const msg = e instanceof Error ? e.message : String(e);
		return { ok: false, error: msg.includes('unique') || msg.includes('duplicate') ? 'Already saved' : msg };
	} finally {
		await sql.end();
	}
}

export async function getListings(
	search = '',
	propertyType = '',
	transactionType = ''
): Promise<SavedListing[]> {
	const sql = getClient();
	try {
		const rows = await sql`
			SELECT * FROM listings
			WHERE 1=1
			${search ? sql`AND (title ILIKE ${'%' + search + '%'} OR location ILIKE ${'%' + search + '%'})` : sql``}
			${propertyType ? sql`AND property_type = ${propertyType}` : sql``}
			${transactionType ? sql`AND transaction_type = ${transactionType}` : sql``}
			ORDER BY saved_at DESC
		`;
		return rows.map(r => parseRow(r as Record<string, unknown>));
	} finally {
		await sql.end();
	}
}

// Keep old name as alias for backwards compatibility
export const getSaved = getListings;

export async function getListing(id: number): Promise<SavedListing | null> {
	const sql = getClient();
	try {
		const rows = await sql`SELECT * FROM listings WHERE id = ${id}`;
		return rows.length ? parseRow(rows[0] as Record<string, unknown>) : null;
	} finally {
		await sql.end();
	}
}

export async function updateListingCoords(id: number, lat: number, lng: number): Promise<boolean> {
	const sql = getClient();
	try {
		const result = await sql`UPDATE listings SET lat = ${lat}, lng = ${lng} WHERE id = ${id}`;
		return result.count > 0;
	} finally {
		await sql.end();
	}
}

export async function deleteListing(id: number): Promise<boolean> {
	const sql = getClient();
	try {
		const result = await sql`DELETE FROM listings WHERE id = ${id}`;
		return result.count > 0;
	} finally {
		await sql.end();
	}
}

export async function updateListingAvailableFrom(id: number, available_from: string): Promise<boolean> {
	const sql = getClient();
	try {
		const result = await sql`UPDATE listings SET available_from = ${available_from} WHERE id = ${id}`;
		return result.count > 0;
	} finally {
		await sql.end();
	}
}

export async function updateListingFull(id: number, data: Partial<SavedListing>): Promise<boolean> {
	const sql = getClient();
	try {
		const result = await sql`
			UPDATE listings SET
				title            = COALESCE(${data.title ?? null}, title),
				price            = COALESCE(${data.price ?? null}, price),
				location         = COALESCE(${data.location ?? null}, location),
				bedrooms         = COALESCE(${data.bedrooms ?? null}, bedrooms),
				size             = COALESCE(${data.size ?? null}, size),
				image            = COALESCE(${data.image ?? null}, image),
				transaction_type = COALESCE(${data.transaction_type ?? null}, transaction_type),
				property_type    = COALESCE(${data.property_type ?? null}, property_type),
				agency           = COALESCE(${data.agency ?? null}, agency),
				available_from   = COALESCE(${data.available_from ?? null}, available_from),
				scheme           = COALESCE(${data.scheme ?? null}, scheme),
				status           = COALESCE(${data.status ?? null}, status),
				notes            = COALESCE(${data.notes ?? null}, notes),
				url              = COALESCE(${data.url ?? null}, url)
			WHERE id = ${id}
		`;
		return result.count > 0;
	} finally {
		await sql.end();
	}
}

export async function updateListingStatus(id: number, status: string): Promise<boolean> {
	const sql = getClient();
	try {
		const result = await sql`UPDATE listings SET status = ${status} WHERE id = ${id}`;
		return result.count > 0;
	} finally {
		await sql.end();
	}
}

export async function updateListingScheme(id: number, scheme: string): Promise<boolean> {
	const sql = getClient();
	try {
		const result = await sql`UPDATE listings SET scheme = ${scheme} WHERE id = ${id}`;
		return result.count > 0;
	} finally {
		await sql.end();
	}
}

export async function updateNotes(id: number, notes: string): Promise<boolean> {
	const sql = getClient();
	try {
		const result = await sql`UPDATE listings SET notes = ${notes} WHERE id = ${id}`;
		return result.count > 0;
	} finally {
		await sql.end();
	}
}

export async function exportAll(): Promise<SavedListing[]> {
	return getListings();
}

// ── Partners ─────────────────────────────────────────────────────────────────

export interface Partner {
	id: number;
	name: string;
	company: string;
	email: string;
	phone: string;
	partner_type: string;
	message: string;
	agreed_terms: boolean;
	status: 'pending' | 'active' | 'rejected';
	notes: string;
	website: string;
	created_at: string;
}

export async function initPartnersTable() {
	const sql = getClient();
	try {
		await sql`
			CREATE TABLE IF NOT EXISTS partners (
				id           SERIAL PRIMARY KEY,
				name         TEXT NOT NULL,
				company      TEXT NOT NULL,
				email        TEXT NOT NULL,
				phone        TEXT DEFAULT '',
				partner_type TEXT DEFAULT '',
				message      TEXT DEFAULT '',
				agreed_terms BOOLEAN DEFAULT false,
				status       TEXT DEFAULT 'pending',
				notes        TEXT DEFAULT '',
				created_at   TIMESTAMPTZ DEFAULT NOW()
			)
		`;
	} finally {
		await sql.end();
	}
}

export async function savePartner(data: {
	name: string; company: string; email: string; phone: string;
	partner_type: string; message: string; agreed_terms: boolean; website?: string;
}): Promise<{ ok: boolean; id?: number; error?: string }> {
	const sql = getClient();
	try {
		// ensure table exists
		await sql`
			CREATE TABLE IF NOT EXISTS partners (
				id           SERIAL PRIMARY KEY,
				name         TEXT NOT NULL,
				company      TEXT NOT NULL,
				email        TEXT NOT NULL,
				phone        TEXT DEFAULT '',
				partner_type TEXT DEFAULT '',
				message      TEXT DEFAULT '',
				agreed_terms BOOLEAN DEFAULT false,
				status       TEXT DEFAULT 'pending',
				notes        TEXT DEFAULT '',
				created_at   TIMESTAMPTZ DEFAULT NOW()
			)
		`;
		const rows = await sql`
			INSERT INTO partners (name, company, email, phone, partner_type, message, agreed_terms, website)
			VALUES (${data.name}, ${data.company}, ${data.email}, ${data.phone},
			        ${data.partner_type}, ${data.message}, ${data.agreed_terms}, ${data.website ?? ''})
			RETURNING id
		`;
		return { ok: true, id: rows[0].id as number };
	} catch (e: unknown) {
		return { ok: false, error: e instanceof Error ? e.message : String(e) };
	} finally {
		await sql.end();
	}
}

export async function getPartners(): Promise<Partner[]> {
	const sql = getClient();
	try {
		await sql`
			CREATE TABLE IF NOT EXISTS partners (
				id           SERIAL PRIMARY KEY,
				name         TEXT NOT NULL,
				company      TEXT NOT NULL,
				email        TEXT NOT NULL,
				phone        TEXT DEFAULT '',
				partner_type TEXT DEFAULT '',
				message      TEXT DEFAULT '',
				agreed_terms BOOLEAN DEFAULT false,
				status       TEXT DEFAULT 'pending',
				notes        TEXT DEFAULT '',
				website      TEXT DEFAULT '',
				created_at   TIMESTAMPTZ DEFAULT NOW()
			)
		`;
		await sql`ALTER TABLE partners ADD COLUMN IF NOT EXISTS website TEXT DEFAULT ''`;
		const rows = await sql`SELECT * FROM partners ORDER BY created_at DESC`;
		return rows as unknown as Partner[];
	} finally {
		await sql.end();
	}
}

export async function updatePartnerWebsite(id: number, website: string): Promise<boolean> {
	const sql = getClient();
	try {
		const result = await sql`UPDATE partners SET website = ${website} WHERE id = ${id}`;
		return result.count > 0;
	} finally {
		await sql.end();
	}
}

export async function updatePartnerStatus(id: number, status: string): Promise<boolean> {
	const sql = getClient();
	try {
		const result = await sql`UPDATE partners SET status = ${status} WHERE id = ${id}`;
		return result.count > 0;
	} finally {
		await sql.end();
	}
}

export async function updatePartnerNotes(id: number, notes: string): Promise<boolean> {
	const sql = getClient();
	try {
		const result = await sql`UPDATE partners SET notes = ${notes} WHERE id = ${id}`;
		return result.count > 0;
	} finally {
		await sql.end();
	}
}

export async function deletePartner(id: number): Promise<boolean> {
	const sql = getClient();
	try {
		const result = await sql`DELETE FROM partners WHERE id = ${id}`;
		return result.count > 0;
	} finally {
		await sql.end();
	}
}

// ── Leads ─────────────────────────────────────────────────────────────────────

export interface Lead {
	id: number;
	name: string;
	email: string;
	phone: string;
	message: string;
	listing_id: number | null;
	partner_id: number | null;
	source: string;
	read: boolean;
	created_at: string;
}

export async function saveLead(data: {
	name?: string; email: string; phone?: string; message?: string;
	listing_id?: number | null; partner_id?: number | null; source?: string;
}): Promise<{ ok: boolean; id?: number; error?: string }> {
	const sql = getClient();
	try {
		const rows = await sql`
			INSERT INTO leads (name, email, phone, message, listing_id, partner_id, source)
			VALUES (${data.name ?? ''}, ${data.email}, ${data.phone ?? ''}, ${data.message ?? ''},
			        ${data.listing_id ?? null}, ${data.partner_id ?? null}, ${data.source ?? 'general'})
			RETURNING id
		`;
		return { ok: true, id: rows[0].id as number };
	} catch (e: unknown) {
		return { ok: false, error: e instanceof Error ? e.message : String(e) };
	} finally {
		await sql.end();
	}
}

export async function getLeads(options: { source?: string; read?: boolean } = {}): Promise<Lead[]> {
	const sql = getClient();
	try {
		const rows = await sql`
			SELECT l.*,
				li.title as listing_title,
				p.company as partner_company
			FROM leads l
			LEFT JOIN listings li ON li.id = l.listing_id
			LEFT JOIN partners p ON p.id = l.partner_id
			${options.source ? sql`WHERE l.source = ${options.source}` : sql``}
			ORDER BY l.created_at DESC
			LIMIT 200
		`;
		return rows as unknown as Lead[];
	} finally {
		await sql.end();
	}
}

export async function markLeadRead(id: number): Promise<void> {
	const sql = getClient();
	try {
		await sql`UPDATE leads SET read = true WHERE id = ${id}`;
	} finally {
		await sql.end();
	}
}

export async function getAdminStats(): Promise<{
	totalListings: number; activeListings: number; soldListings: number;
	totalPartners: number; activePartners: number; pendingPartners: number;
	totalLeads: number; unreadLeads: number;
}> {
	const sql = getClient();
	try {
		const [listings, partners, leads] = await Promise.all([
			sql`SELECT COUNT(*) as total, COUNT(*) FILTER (WHERE status = 'active' OR status IS NULL OR status = '') as active, COUNT(*) FILTER (WHERE status IN ('sold','rented')) as sold FROM listings`,
			sql`SELECT COUNT(*) as total, COUNT(*) FILTER (WHERE status = 'active') as active, COUNT(*) FILTER (WHERE status = 'pending') as pending FROM partners`,
			sql`SELECT COUNT(*) as total, COUNT(*) FILTER (WHERE read = false) as unread FROM leads`,
		]);
		return {
			totalListings: Number(listings[0].total),
			activeListings: Number(listings[0].active),
			soldListings: Number(listings[0].sold),
			totalPartners: Number(partners[0].total),
			activePartners: Number(partners[0].active),
			pendingPartners: Number(partners[0].pending),
			totalLeads: Number(leads[0].total),
			unreadLeads: Number(leads[0].unread),
		};
	} finally {
		await sql.end();
	}
}
