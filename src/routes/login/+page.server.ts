import { fail, redirect } from '@sveltejs/kit';
import { sendMagicLink } from '$lib/server/auth';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = ({ locals }) => {
	if (locals.user) redirect(302, '/my/favorites');
	return {};
};

export const actions: Actions = {
	default: async ({ request, url }) => {
		const data = await request.formData();
		const email = String(data.get('email') ?? '').trim().toLowerCase();

		if (!email || !email.includes('@')) {
			return fail(400, { error: 'Please enter a valid email address.' });
		}

		const result = await sendMagicLink(email, url.origin);
		if (!result.ok) {
			return fail(500, { error: 'Failed to send email. Please try again.' });
		}

		return { sent: true, email };
	}
};
