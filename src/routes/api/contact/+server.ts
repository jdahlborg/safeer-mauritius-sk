import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const data = await request.json();
	// In production: send via email service (SendGrid, Resend, etc.)
	console.log('Contact form submission:', data);
	return json({ ok: true });
};
