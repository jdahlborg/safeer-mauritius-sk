import { fail, redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = ({ locals }) => {
	if (locals.adminAuthed) redirect(302, '/admin');
	return {};
};

export const actions: Actions = {
	default: async ({ request, cookies, url }) => {
		const data = await request.formData();
		const secret = String(data.get('secret') ?? '');

		if (!env.ADMIN_SECRET || secret !== env.ADMIN_SECRET) {
			return fail(401, { error: 'Incorrect admin secret.' });
		}

		cookies.set('admin_session', env.ADMIN_SECRET, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: url.protocol === 'https:',
			maxAge: 60 * 60 * 8 // 8 hours
		});

		redirect(302, '/admin');
	}
};
