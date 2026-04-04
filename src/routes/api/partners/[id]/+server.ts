import { json } from '@sveltejs/kit';
import { updatePartnerStatus, updatePartnerNotes, updatePartnerWebsite, deletePartner } from '$lib/server/db';
import type { RequestHandler } from './$types';

export const PATCH: RequestHandler = async ({ params, request }) => {
	const id = parseInt(params.id);
	if (isNaN(id)) return json({ ok: false }, { status: 400 });

	const body = await request.json();
	if (body.status !== undefined) await updatePartnerStatus(id, body.status);
	if (body.notes !== undefined) await updatePartnerNotes(id, body.notes);
	if (body.website !== undefined) await updatePartnerWebsite(id, body.website);
	return json({ ok: true });
};

export const DELETE: RequestHandler = async ({ params }) => {
	const id = parseInt(params.id);
	if (isNaN(id)) return json({ ok: false }, { status: 400 });
	await deletePartner(id);
	return json({ ok: true });
};
