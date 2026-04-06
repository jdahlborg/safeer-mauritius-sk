import { initDb, validateSession, getPartnerByEmail } from '$lib/server/db';
import { env } from '$env/dynamic/private';

let initialized = false;

export async function handle({ event, resolve }) {
	if (!initialized) {
		await initDb();
		initialized = true;
	}

	// Resolve user from session cookie
	const sessionToken = event.cookies.get('session');
	if (sessionToken) {
		event.locals.user = await validateSession(sessionToken);
	} else {
		event.locals.user = null;
	}

	// Check if logged-in user is an active partner
	if (event.locals.user) {
		event.locals.partner = await getPartnerByEmail(event.locals.user.email);
	} else {
		event.locals.partner = null;
	}

	// Admin access via ADMIN_SECRET cookie
	const adminToken = event.cookies.get('admin_session');
	event.locals.adminAuthed = !!(env.ADMIN_SECRET && adminToken === env.ADMIN_SECRET);

	return resolve(event);
}
