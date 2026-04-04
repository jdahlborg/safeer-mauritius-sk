import postgres from 'postgres';
import { env } from '$env/dynamic/private';

function getClient() {
	return postgres(env.DATABASE_URL!, { ssl: 'require', max: 5 });
}

// Run once to create the table
export async function initDb() {
	const sql = getClient();
	await sql`
		CREATE TABLE IF NOT EXISTS saved_listings (
			id            SERIAL PRIMARY KEY,
			title         TEXT,
			price         TEXT,
			location      TEXT,
			bedrooms      TEXT,
			size          TEXT,
			features      TEXT,
			url           TEXT UNIQUE,
			image         TEXT,
			images        TEXT DEFAULT '[]',
			payment       TEXT,
			property_type TEXT,
			agency        TEXT,
			source        TEXT DEFAULT 'lexpress',
			notes         TEXT DEFAULT '',
			saved_at      TIMESTAMPTZ DEFAULT NOW()
		)
	`;
	await sql`ALTER TABLE saved_listings ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'lexpress'`;
	await sql`ALTER TABLE saved_listings ADD COLUMN IF NOT EXISTS images TEXT DEFAULT '[]'`;
	await sql.end();
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
	payment: string;
	property_type: string;
	agency: string;
	source: string;
	notes: string;
	saved_at: string;
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
	} as SavedListing;
}

export async function saveListing(
	data: Record<string, unknown>
): Promise<{ ok: boolean; id?: number; error?: string }> {
	const sql = getClient();
	try {
		const rows = await sql`
			INSERT INTO saved_listings
				(title, price, location, bedrooms, size, features, url, image, images, payment, property_type, agency, source, notes)
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
				${String(data.payment ?? '')},
				${String(data.property_type ?? '')},
				${String(data.agency ?? '')},
				${String(data.source ?? 'lexpress')},
				${String(data.notes ?? '')}
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

export async function getSaved(
	search = '',
	propertyType = '',
	payment = ''
): Promise<SavedListing[]> {
	const sql = getClient();
	try {
		const rows = await sql`
			SELECT * FROM saved_listings
			WHERE 1=1
			${search ? sql`AND (title ILIKE ${'%' + search + '%'} OR location ILIKE ${'%' + search + '%'})` : sql``}
			${propertyType ? sql`AND property_type = ${propertyType}` : sql``}
			${payment ? sql`AND payment = ${payment}` : sql``}
			ORDER BY saved_at DESC
		`;
		return rows.map(r => parseRow(r as Record<string, unknown>));
	} finally {
		await sql.end();
	}
}

export async function getListing(id: number): Promise<SavedListing | null> {
	const sql = getClient();
	try {
		const rows = await sql`SELECT * FROM saved_listings WHERE id = ${id}`;
		return rows.length ? parseRow(rows[0] as Record<string, unknown>) : null;
	} finally {
		await sql.end();
	}
}

export async function deleteListing(id: number): Promise<boolean> {
	const sql = getClient();
	try {
		const result = await sql`DELETE FROM saved_listings WHERE id = ${id}`;
		return result.count > 0;
	} finally {
		await sql.end();
	}
}

export async function updateNotes(id: number, notes: string): Promise<boolean> {
	const sql = getClient();
	try {
		const result = await sql`UPDATE saved_listings SET notes = ${notes} WHERE id = ${id}`;
		return result.count > 0;
	} finally {
		await sql.end();
	}
}

export async function exportAll(): Promise<SavedListing[]> {
	return getSaved();
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
