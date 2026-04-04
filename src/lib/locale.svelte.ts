// Shared reactive locale state (Svelte 5 universal $state)
export const locale = $state({
	lang: 'en' as 'en' | 'fr' | 'cr' | 'ru',
	currency: 'EUR' as 'EUR' | 'USD' | 'MUR' | 'GBP' | 'ZAR' | 'RUB',
});

export function initLocale() {
	if (typeof localStorage === 'undefined') return;
	const savedLang = localStorage.getItem('lang');
	const savedCurrency = localStorage.getItem('currency');
	if (savedLang === 'en' || savedLang === 'fr' || savedLang === 'cr' || savedLang === 'ru') locale.lang = savedLang;
	if (savedCurrency === 'EUR' || savedCurrency === 'USD' || savedCurrency === 'MUR' || savedCurrency === 'GBP' || savedCurrency === 'ZAR' || savedCurrency === 'RUB') locale.currency = savedCurrency;
}

export function setLang(l: typeof locale.lang) {
	locale.lang = l;
	if (typeof localStorage !== 'undefined') localStorage.setItem('lang', l);
}

export function setCurrency(c: typeof locale.currency) {
	locale.currency = c;
	if (typeof localStorage !== 'undefined') localStorage.setItem('currency', c);
}
