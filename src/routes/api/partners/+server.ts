import { json } from '@sveltejs/kit';
import { getPartners } from '$lib/server/db';

export async function GET() {
	const partners = await getPartners();
	return json({ partners });
}
