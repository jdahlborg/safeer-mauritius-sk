import { getLeads } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const leads = await getLeads();
	return { leads };
};
