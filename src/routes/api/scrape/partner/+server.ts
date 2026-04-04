import { json } from '@sveltejs/kit';
import { scrapePartnerSite } from '$lib/server/scrapers/ai-scraper';
import { getPartners } from '$lib/server/db';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	const partnerId = parseInt(url.searchParams.get('partner_id') ?? '');
	const maxPages = Math.min(parseInt(url.searchParams.get('pages') ?? '2'), 5);

	if (isNaN(partnerId)) {
		return json({ listings: [], error: 'Missing partner_id' }, { status: 400 });
	}

	const partners = await getPartners();
	const partner = partners.find(p => p.id === partnerId);

	if (!partner) return json({ listings: [], error: 'Partner not found' }, { status: 404 });
	if (!partner.website) return json({ listings: [], error: 'Partner has no website URL configured' }, { status: 400 });

	const result = await scrapePartnerSite(partner.website, partner.company, maxPages);

	return json({ ...result, partner: { id: partner.id, company: partner.company } });
};
