import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ locals }) => {
	return {
		user: locals.user,
		adminAuthed: locals.adminAuthed,
		partner: locals.partner ? { id: locals.partner.id, company: locals.partner.company } : null,
	};
};
