export interface Service {
	slug: string;
	title: string;
	tagline: string;
	description: string;
	color: string;
	items: string[];
	faqs: { q: string; a: string }[];
}

export const services: Service[] = [
	{
		slug: 'visa-residency',
		title: 'Visa & Residency',
		tagline: 'Your legal pathway to calling Mauritius home',
		description: 'Navigating Mauritius immigration law can be complex. Our specialists prepare every document, liaise with authorities, and guide you from first application to permit in hand.',
		color: '#0077b6',
		items: [
			'Premium Visa (remote workers & retirees)',
			'Occupation Permit for professionals',
			'Retired Non-Citizen Permit',
			'Investor Permit (from USD 50,000)',
			'Permanent Residence Permit',
			'Document preparation & submission',
			'Authority follow-up & tracking',
		],
		faqs: [
			{ q: 'What is the Premium Visa?', a: 'A 1-year renewable visa for remote workers, self-employed professionals, and retirees. It allows you to live and work in Mauritius without being formally employed by a local company.' },
			{ q: 'How long does approval take?', a: 'The Premium Visa typically takes 2–4 weeks. Occupation and Investor Permits take 4–8 weeks for a complete, well-prepared application.' },
		]
	},
	{
		slug: 'housing',
		title: 'Housing & Settling In',
		tagline: 'Find your perfect home and arrive to comfort',
		description: 'From neighbourhood selection to lease negotiation and home setup, we manage every step of your housing journey so you arrive to a ready home.',
		color: '#c9a96e',
		items: [
			'Curated property search & viewings',
			'Neighbourhood advisory & area guides',
			'Lease & purchase negotiation',
			'Home setup & furnishing coordination',
			'Utility connections (water, electricity, internet)',
			'Domestic staff recruitment',
			'Vehicle rental & purchase assistance',
		],
		faqs: [
			{ q: 'What areas do you recommend?', a: 'It depends on your lifestyle. Grand Baie suits sociable expats; Tamarin/Black River suits beach lovers; Flic en Flac is budget-friendly; Bel Ombre offers luxury and privacy.' },
			{ q: 'Can you help me buy rather than rent?', a: 'Yes. For foreign buyers we work within PDS, IRS, and RES schemes, and connect you with licensed property lawyers for the conveyancing process.' },
		]
	},
	{
		slug: 'logistics',
		title: 'Logistics & Moving',
		tagline: 'Seamless international removals to your island life',
		description: 'International removals, customs clearance, vehicle imports, and even pet relocation — we coordinate with trusted partners to move your life to Mauritius without the headaches.',
		color: '#e76f51',
		items: [
			'International removals coordination',
			'Customs advisory & clearance',
			'Vehicle import assistance',
			'Pet relocation support',
			'Insurance recommendations',
			'Storage solutions',
			'Packing & unpacking services',
		],
		faqs: [
			{ q: 'What are Mauritius customs rules?', a: 'Household effects imported within 6 months of arriving as a new resident are duty-exempt. Vehicles attract import duty and excise tax — we advise on cost optimisation strategies.' },
			{ q: 'Can I bring my pet?', a: 'Yes, but Mauritius has strict quarantine rules. We work with specialist pet relocation agents and veterinary services to prepare all health certificates and minimise quarantine time.' },
		]
	},
	{
		slug: 'legal-financial',
		title: 'Legal & Financial',
		tagline: 'Structure your affairs correctly from day one',
		description: "From company formation to tax planning, we connect you with Mauritius's top lawyers, accountants, and financial advisors to ensure your move is legally and financially sound.",
		color: '#2d6a4f',
		items: [
			'Company formation (GBL & domestic)',
			'Tax advisory & planning',
			'Bank account opening',
			'Legal documentation & notarial services',
			'Double taxation treaty guidance',
			'Estate & succession planning',
			'Compliance & regulatory support',
		],
		faqs: [
			{ q: 'What are the tax benefits?', a: 'Mauritius has a flat 15% income tax, no capital gains tax, no inheritance tax, and 45+ double tax treaties. Many residents significantly reduce their global tax burden after relocating.' },
			{ q: 'Can I open a company in Mauritius?', a: 'Yes. We facilitate both domestic companies and Global Business Licences (GBL) for international holding structures. GBL companies benefit from preferential treaty access and a 3% corporate tax ceiling.' },
		]
	},
	{
		slug: 'family-lifestyle',
		title: 'Family & Lifestyle',
		tagline: 'Help every family member feel at home',
		description: 'We ensure your whole family transitions smoothly — from school enrolment to healthcare orientation, social introductions, and community integration.',
		color: '#00b4d8',
		items: [
			'International school research & tours',
			'School enrolment assistance',
			'Healthcare system orientation',
			'GP & specialist referrals',
			'Expat community introductions',
			'Social & cultural activities',
			'Spousal career support',
		],
		faqs: [
			{ q: 'What international schools exist?', a: 'Key schools include Northfields International High School (British IGCSE/A-Level), Westcoast International School, and École du Nord (French curriculum). We arrange tours and assist with applications.' },
			{ q: 'How is healthcare in Mauritius?', a: 'Mauritius has both public and private healthcare. The private sector (Fortis Clinique Darné, C-Care) offers good quality care. We recommend international health insurance and provide referrals to trusted GPs and specialists.' },
		]
	},
	{
		slug: 'remote-worker',
		title: 'Remote Worker Package',
		tagline: 'Live in paradise, work from anywhere',
		description: 'The complete turnkey solution for digital nomads and remote professionals ready to base themselves in Mauritius. Visa, housing, connectivity, and community — all sorted.',
		color: '#0077b6',
		items: [
			'Premium Visa application end-to-end',
			'Co-working space setup & membership',
			'Tax residency guidance',
			'Housing search & setup',
			'SIM card & high-speed internet',
			'Bank account opening',
			'Expat community welcome',
		],
		faqs: [
			{ q: 'Do I need a local employer?', a: 'No. The Premium Visa is specifically designed for remote workers and self-employed professionals. You work for your existing clients or employer while living in Mauritius.' },
			{ q: "What's the internet like?", a: 'Mauritius has fibre broadband widely available with speeds up to 1Gbps in urban areas. Co-working spaces offer reliable redundant connections. We set everything up before you arrive.' },
		]
	}
];

export function getService(slug: string): Service | undefined {
	return services.find(s => s.slug === slug);
}
