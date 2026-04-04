import { getSaved } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const listings = await getSaved();
	return { listings };
};
