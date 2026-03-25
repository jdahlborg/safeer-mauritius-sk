import { exportAll } from '$lib/server/db';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	const rows = await exportAll();
	if (!rows.length) {
		return new Response('', {
			headers: { 'Content-Type': 'text/csv', 'Content-Disposition': 'attachment; filename="lexpress_saved.csv"' }
		});
	}

	const keys = Object.keys(rows[0]).filter(k => k !== 'features');
	const escape = (v: unknown) => {
		const s = Array.isArray(v) ? v.join('; ') : String(v ?? '');
		return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s.replace(/"/g, '""')}"` : s;
	};

	const lines = [
		keys.join(','),
		...rows.map(row => keys.map(k => escape((row as unknown as Record<string, unknown>)[k])).join(','))
	];

	return new Response(lines.join('\n'), {
		headers: {
			'Content-Type': 'text/csv',
			'Content-Disposition': 'attachment; filename="lexpress_saved.csv"'
		}
	});
};
