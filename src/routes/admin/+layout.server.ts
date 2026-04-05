import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ locals, url }) => {
	// Allow the login page itself through
	if (url.pathname === '/admin/login') return {};

	if (!locals.adminAuthed) {
		redirect(302, '/admin/login');
	}

	return {};
};
