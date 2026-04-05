import { getListings, getFavoriteIds } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const [listings, favoriteIds] = await Promise.all([
		getListings(),
		locals.user ? getFavoriteIds(locals.user.id) : Promise.resolve(new Set<number>()),
	]);
	return { listings, favoriteIds: [...favoriteIds], user: locals.user };
};
