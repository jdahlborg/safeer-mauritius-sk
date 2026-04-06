import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ locals, url }) => {
	if (!locals.user) redirect(302, `/login?redirect=${url.pathname}`);
	if (!locals.partner) redirect(302, '/');
	return { partner: locals.partner };
};
