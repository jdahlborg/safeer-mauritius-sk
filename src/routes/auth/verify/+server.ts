import { redirect } from '@sveltejs/kit';
import { verifyMagicLink, getOrCreateUser, createSession } from '$lib/server/db';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, cookies }) => {
	const token = url.searchParams.get('token') ?? '';

	const email = await verifyMagicLink(token);
	if (!email) {
		redirect(302, '/login?error=expired');
	}

	const user = await getOrCreateUser(email);
	const sessionToken = await createSession(user.id);

	cookies.set('session', sessionToken, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure: url.protocol === 'https:',
		maxAge: 60 * 60 * 24 * 30 // 30 days
	});

	redirect(302, '/my/favorites');
};
