import { getPartnerListings } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const listings = await getPartnerListings(locals.partner!.id);
	return { listings };
};
