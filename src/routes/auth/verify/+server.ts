import { redirect } from '@sveltejs/kit';
import { verifyMagicLink, getOrCreateUser, createSession, getPartnerByEmail } from '$lib/server/db';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, cookies, request }) => {
	const token = url.searchParams.get('token') ?? '';

	const email = await verifyMagicLink(token);
	if (!email) {
		redirect(302, '/login?error=expired');
	}

	const user = await getOrCreateUser(email);
	const userAgent = request.headers.get('user-agent') ?? '';
	const sessionToken = await createSession(user.id, userAgent);

	cookies.set('session', sessionToken, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure: url.protocol === 'https:',
		maxAge: 60 * 60 * 24 * 30 // 30 days
	});

	// Redirect partners to their portal
	const partner = await getPartnerByEmail(email);
	redirect(302, partner ? '/partner' : '/my/favorites');
};
