import { readFile } from 'fs/promises';
import { join } from 'path';
import type { PageServerLoad } from './$types';

export interface Listing {
	title: string;
	price: string;
	location: string;
	bedrooms: string;
	size: string;
	features: string[];
	image: string;
	url: string;
	payment: string;
	property_type: string;
	agency: string;
}

export const load: PageServerLoad = async () => {
	try {
		const raw = await readFile(join(process.cwd(), 'static', 'properties.json'), 'utf-8');
		const listings: Listing[] = JSON.parse(raw);
		return { listings };
	} catch {
		return { listings: [] as Listing[] };
	}
};
