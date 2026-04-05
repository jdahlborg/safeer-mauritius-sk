import { redirect } from '@sveltejs/kit';
import { getFavoriteListings } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) redirect(302, '/login');
	const listings = await getFavoriteListings(locals.user.id);
	return { listings };
};
