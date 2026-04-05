import { getListing, getFavoriteIds } from '$lib/server/db';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	const id = parseInt(params.id);
	if (isNaN(id)) error(404, 'Property not found');
	const listing = await getListing(id);
	if (!listing) error(404, 'Property not found');

	const favorited = locals.user
		? (await getFavoriteIds(locals.user.id)).has(id)
		: false;

	return { listing, favorited, user: locals.user };
};
