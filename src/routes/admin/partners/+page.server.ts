import { getPartners } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const partners = await getPartners();
	return { partners };
};
