import { exportAll } from '$lib/server/db';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = () => {
	const rows = exportAll();
	return new Response(JSON.stringify(rows, null, 2), {
		headers: {
			'Content-Type': 'application/json',
			'Content-Disposition': 'attachment; filename="lexpress_saved.json"'
		}
	});
};
