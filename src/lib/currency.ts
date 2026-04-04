import { locale } from './locale.svelte';

// Approximate exchange rates relative to EUR
const RATES: Record<string, number> = {
	EUR: 1,
	USD: 1.08,
	GBP: 0.86,
	MUR: 50.5,
	ZAR: 21.2,
	RUB: 98.0,
};

const SYMBOLS: Record<string, string> = {
	EUR: '€',
	USD: '$',
	GBP: '£',
	MUR: '₨',
	ZAR: 'R',
	RUB: '₽',
};

const LOCALES: Record<string, string> = {
	EUR: 'fr-FR',
	USD: 'en-US',
	GBP: 'en-GB',
	MUR: 'en-MU',
	ZAR: 'en-ZA',
	RUB: 'ru-RU',
};

/**
 * Try to parse a price string into a number in EUR.
 * Handles formats like "€450,000", "MUR 12,000,000", "$750,000", "POA", etc.
 */
export function parsePrice(raw: string): number | null {
	if (!raw) return null;
	const cleaned = raw.replace(/[€$£₨R₽]/g, '').replace(/,/g, '').trim();
	// strip currency codes
	const stripped = cleaned.replace(/^(EUR|USD|GBP|MUR|ZAR|RUB)\s*/i, '').trim();
	const num = parseFloat(stripped);
	if (isNaN(num)) return null;

	// Detect original currency from the raw string
	let srcCurrency = 'EUR';
	if (/MUR|₨/i.test(raw)) srcCurrency = 'MUR';
	else if (/USD|\$/i.test(raw)) srcCurrency = 'USD';
	else if (/GBP|£/i.test(raw)) srcCurrency = 'GBP';
	else if (/ZAR|\bR\b/i.test(raw)) srcCurrency = 'ZAR';
	else if (/RUB|₽/i.test(raw)) srcCurrency = 'RUB';

	// Convert to EUR first
	return num / RATES[srcCurrency];
}

/**
 * Convert and format a price for display in the active currency.
 * Returns original string if unparseable (e.g. "POA", "Price on request").
 */
export function formatPrice(raw: string): string {
	const eur = parsePrice(raw);
	if (eur === null) return raw;

	const cur = locale.currency as string;
	const converted = eur * RATES[cur];
	const symbol = SYMBOLS[cur] ?? cur;
	const locale = LOCALES[cur] ?? 'en-US';

	const formatted = new Intl.NumberFormat(locale, {
		maximumFractionDigits: 0,
	}).format(Math.round(converted));

	// Put symbol before or after based on convention
	const postfix = ['MUR', 'ZAR'].includes(cur);
	return postfix ? `${formatted} ${symbol}` : `${symbol}${formatted}`;
}

export function currencySymbol(): string {
	return SYMBOLS[locale.currency] ?? locale.currency;
}
