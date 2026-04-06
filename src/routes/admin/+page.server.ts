import { getAdminStats, getLeads } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const [stats, recentLeads] = await Promise.all([
		getAdminStats(),
		getLeads(),
	]);
	return { stats, recentLeads: recentLeads.slice(0, 10) };
};
