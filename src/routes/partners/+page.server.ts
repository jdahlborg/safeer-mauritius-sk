import { Resend } from 'resend';
import { env } from '$env/dynamic/private';
import { fail } from '@sveltejs/kit';
import { savePartner } from '$lib/server/db';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request }) => {
		const data = await request.formData();

		const name = String(data.get('name') ?? '').trim();
		const company = String(data.get('company') ?? '').trim();
		const email = String(data.get('email') ?? '').trim();
		const phone = String(data.get('phone') ?? '').trim();
		const partnerType = String(data.get('partner_type') ?? '').trim();
		const message = String(data.get('message') ?? '').trim();
		const agreed = data.get('agree_terms') === 'on';

		if (!name || !company || !email) {
			return fail(400, { error: 'Please fill in all required fields.' });
		}
		if (!agreed) {
			return fail(400, { error: 'You must agree to the partner terms to proceed.' });
		}

		// Save to DB
		await savePartner({ name, company, email, phone, partner_type: partnerType, message, agreed_terms: agreed });

		const resend = new Resend(env.RESEND_API_KEY);

		const partnerTypeLabels: Record<string, string> = {
			developer: 'Property Developer',
			agency: 'Real Estate Agency',
			agent: 'Independent Agent',
			other: 'Other',
		};

		// Notify Safeer
		await resend.emails.send({
			from: 'Safeer Properties <hello@safeer.mu>',
			to: 'hello@safeer.mu',
			replyTo: email,
			subject: `New partner enquiry: ${company}`,
			html: `
				<h2>New Partner Enquiry</h2>
				<table style="border-collapse:collapse;font-family:sans-serif;font-size:14px">
					<tr><td style="padding:6px 12px;color:#666;white-space:nowrap">Name</td><td style="padding:6px 12px;font-weight:600">${name}</td></tr>
					<tr><td style="padding:6px 12px;color:#666">Company</td><td style="padding:6px 12px;font-weight:600">${company}</td></tr>
					<tr><td style="padding:6px 12px;color:#666">Email</td><td style="padding:6px 12px"><a href="mailto:${email}">${email}</a></td></tr>
					<tr><td style="padding:6px 12px;color:#666">Phone</td><td style="padding:6px 12px">${phone || '—'}</td></tr>
					<tr><td style="padding:6px 12px;color:#666">Type</td><td style="padding:6px 12px">${(partnerTypeLabels[partnerType] ?? partnerType) || '—'}</td></tr>
					<tr><td style="padding:6px 12px;color:#666;vertical-align:top">Portfolio</td><td style="padding:6px 12px">${message || '—'}</td></tr>
					<tr><td style="padding:6px 12px;color:#666">Terms agreed</td><td style="padding:6px 12px;color:#2d6a4f;font-weight:600">✓ Yes</td></tr>
				</table>
			`,
		});

		// Confirm to partner
		await resend.emails.send({
			from: 'Safeer Properties <hello@safeer.mu>',
			to: email,
			subject: `Your partner application — Safeer Properties`,
			html: `
				<div style="font-family:Georgia,serif;max-width:560px;color:#1a1a1a">
					<h2 style="font-size:24px;font-weight:700;margin-bottom:8px">Hi ${name},</h2>
					<p style="color:#555;line-height:1.6">Thank you for applying to partner with Safeer Properties. We've received your enquiry and will be in touch within one business day.</p>

					<div style="background:#f8f8f8;border-radius:12px;padding:20px 24px;margin:24px 0;border-left:4px solid #c9a96e">
						<p style="margin:0 0 6px;font-weight:600">Your application summary:</p>
						<p style="margin:4px 0;color:#555;font-size:14px"><strong>Company:</strong> ${company}</p>
						<p style="margin:4px 0;color:#555;font-size:14px"><strong>Type:</strong> ${(partnerTypeLabels[partnerType] ?? partnerType) || '—'}</p>
						<p style="margin:4px 0;color:#2d6a4f;font-size:14px;font-weight:600">✓ Partner terms accepted</p>
					</div>

					<p style="color:#555;line-height:1.6">While you wait, you can review the full partner terms at any time:</p>
					<p><a href="https://safeer.mu/partners/terms" style="color:#0077b6">safeer.mu/partners/terms</a></p>

					<p style="color:#555;line-height:1.6;margin-top:24px">If you have any questions in the meantime, simply reply to this email.</p>

					<p style="margin-top:32px;color:#555">Warm regards,<br/><strong>The Safeer Properties Team</strong><br/><span style="font-size:13px;color:#999">hello@safeer.mu · safeer.mu</span></p>
				</div>
			`,
		});

		return { success: true, name };
	},
};
