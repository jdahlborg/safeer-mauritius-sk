import Database from 'better-sqlite3';
import { join } from 'path';

const DB_PATH = join(process.cwd(), 'listings.db');

function getDb() {
	const db = new Database(DB_PATH);
	db.pragma('journal_mode = WAL');
	return db;
}

// Initialise table on first import
const _db = getDb();
_db.exec(`
	CREATE TABLE IF NOT EXISTS saved_listings (
		id            INTEGER PRIMARY KEY AUTOINCREMENT,
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
		notes         TEXT DEFAULT '',
		saved_at      TEXT DEFAULT (datetime('now'))
	)
`);
_db.close();

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
	notes: string;
	saved_at: string;
}

function parseRow(row: Record<string, unknown>): SavedListing {
	return {
		...row,
		features: (() => {
			try {
				return JSON.parse(row.features as string);
			} catch {
				return [];
			}
		})()
	} as SavedListing;
}

export function saveListing(data: Record<string, unknown>): { ok: boolean; id?: number; error?: string } {
	const db = getDb();
	try {
		const result = db
			.prepare(`
			INSERT INTO saved_listings
				(title, price, location, bedrooms, size, features, url, image, payment, property_type, agency, notes)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
		`)
			.run(
				data.title ?? '',
				data.price ?? '',
				data.location ?? '',
				data.bedrooms ?? '',
				data.size ?? '',
				JSON.stringify(data.features ?? []),
				data.url ?? '',
				data.image ?? '',
				data.payment ?? '',
				data.property_type ?? '',
				data.agency ?? '',
				data.notes ?? ''
			);
		return { ok: true, id: result.lastInsertRowid as number };
	} catch (e: unknown) {
		const msg = e instanceof Error ? e.message : String(e);
		return { ok: false, error: msg.includes('UNIQUE') ? 'Already saved' : msg };
	} finally {
		db.close();
	}
}

export function getSaved(search = '', propertyType = '', payment = ''): SavedListing[] {
	const db = getDb();
	let query = 'SELECT * FROM saved_listings WHERE 1=1';
	const params: unknown[] = [];

	if (search) {
		query += ' AND (title LIKE ? OR location LIKE ?)';
		params.push(`%${search}%`, `%${search}%`);
	}
	if (propertyType) {
		query += ' AND property_type = ?';
		params.push(propertyType);
	}
	if (payment) {
		query += ' AND payment = ?';
		params.push(payment);
	}
	query += ' ORDER BY saved_at DESC';

	const rows = db.prepare(query).all(...params) as Record<string, unknown>[];
	db.close();
	return rows.map(parseRow);
}

export function deleteListing(id: number): boolean {
	const db = getDb();
	const result = db.prepare('DELETE FROM saved_listings WHERE id = ?').run(id);
	db.close();
	return result.changes > 0;
}

export function updateNotes(id: number, notes: string): boolean {
	const db = getDb();
	const result = db.prepare('UPDATE saved_listings SET notes = ? WHERE id = ?').run(notes, id);
	db.close();
	return result.changes > 0;
}

export function exportAll(): SavedListing[] {
	return getSaved();
}
