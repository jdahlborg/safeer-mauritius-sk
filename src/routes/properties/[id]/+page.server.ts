import { getListing } from '$lib/server/db';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const id = parseInt(params.id);
	if (isNaN(id)) error(404, 'Property not found');
	const listing = await getListing(id);
	if (!listing) error(404, 'Property not found');
	return { listing };
};
