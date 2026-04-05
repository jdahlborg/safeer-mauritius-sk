import { Resend } from 'resend';
import { env } from '$env/dynamic/private';
import { createMagicLink } from './db';

const FROM_EMAIL = 'noreply@safeer.mu';

export async function sendMagicLink(email: string, origin: string): Promise<{ ok: boolean; error?: string }> {
	try {
		const token = await createMagicLink(email);
		const link = `${origin}/auth/verify?token=${token}`;

		const resend = new Resend(env.RESEND_API_KEY);
		await resend.emails.send({
			from: FROM_EMAIL,
			to: email,
			subject: 'Sign in to Safeer Properties',
			html: `
				<div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px">
					<div style="margin-bottom:24px">
						<span style="font-family:'Playfair Display',Georgia,serif;font-size:22px;font-weight:bold;color:#005f8a">Safeer</span>
						<span style="font-family:'Playfair Display',Georgia,serif;font-size:22px;font-weight:bold;color:#c9a96e"> Properties</span>
					</div>
					<h2 style="font-size:20px;font-weight:600;color:#111;margin:0 0 8px">Your sign-in link</h2>
					<p style="color:#666;font-size:15px;margin:0 0 24px;line-height:1.5">
						Click the button below to sign in to your Safeer Properties account. This link expires in 15 minutes and can only be used once.
					</p>
					<a href="${link}" style="display:inline-block;background:#0077b6;color:#fff;font-weight:600;font-size:15px;padding:14px 28px;border-radius:10px;text-decoration:none">
						Sign in to Safeer Properties
					</a>
					<p style="color:#aaa;font-size:12px;margin:24px 0 0;line-height:1.5">
						If you didn't request this, you can safely ignore this email.<br>
						This link will expire at ${new Date(Date.now() + 15 * 60 * 1000).toUTCString()}.
					</p>
				</div>
			`,
		});
		return { ok: true };
	} catch (e) {
		return { ok: false, error: e instanceof Error ? e.message : String(e) };
	}
}
