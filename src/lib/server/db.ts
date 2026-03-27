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
			payment       TEXT,
			property_type TEXT,
			agency        TEXT,
			source        TEXT DEFAULT 'lexpress',
			notes         TEXT DEFAULT '',
			saved_at      TIMESTAMPTZ DEFAULT NOW()
		)
	`;
	// Add source column to existing tables that predate this schema
	await sql`
		ALTER TABLE saved_listings ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'lexpress'
	`;
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
		})()
	} as SavedListing;
}

export async function saveListing(
	data: Record<string, unknown>
): Promise<{ ok: boolean; id?: number; error?: string }> {
	const sql = getClient();
	try {
		const rows = await sql`
			INSERT INTO saved_listings
				(title, price, location, bedrooms, size, features, url, image, payment, property_type, agency, source, notes)
			VALUES (
				${String(data.title ?? '')},
				${String(data.price ?? '')},
				${String(data.location ?? '')},
				${String(data.bedrooms ?? '')},
				${String(data.size ?? '')},
				${JSON.stringify(data.features ?? [])},
				${String(data.url ?? '')},
				${String(data.image ?? '')},
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
