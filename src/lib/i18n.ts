import { locale } from './locale.svelte';

const translations = {
	en: {
		// Nav
		nav_properties: 'Properties',
		nav_services: 'Services',
		nav_why: 'Why Mauritius',
		nav_faq: 'FAQ',
		nav_about: 'About Us',
		nav_browse: 'Browse Properties',
		// Hero search
		search_buy: 'Buy',
		search_rent: 'Rent',
		search_placeholder: 'Area, location or keyword…',
		search_type_label: 'Property type',
		search_all_types: 'All types',
		search_beds_label: 'Bedrooms',
		search_min_beds: 'Min beds',
		search_button: 'Search Properties',
		// Filters
		filter_all: 'All',
		filter_for_sale: 'For Sale',
		filter_to_rent: 'To Rent',
		filter_all_types: 'All Types',
		filter_all_schemes: 'All Schemes',
		filter_search_placeholder: 'Search by area or keyword…',
		filter_clear: 'Clear',
		filter_listings: (n: number) => `${n} listing${n !== 1 ? 's' : ''}`,
		// Property card
		card_for_rent: 'For Rent',
		card_for_sale: 'For Sale',
		// Misc
		no_listings: 'No listings match your filters.',
		clear_filters: 'Clear filters',
	},
	fr: {
		nav_properties: 'Propriétés',
		nav_services: 'Services',
		nav_why: 'Pourquoi Maurice',
		nav_faq: 'FAQ',
		nav_about: 'À Propos',
		nav_browse: 'Voir les Biens',
		search_buy: 'Acheter',
		search_rent: 'Louer',
		search_placeholder: 'Quartier, lieu ou mot-clé…',
		search_type_label: 'Type de bien',
		search_all_types: 'Tous les types',
		search_beds_label: 'Chambres',
		search_min_beds: 'Min chambres',
		search_button: 'Rechercher',
		filter_all: 'Tous',
		filter_for_sale: 'À Vendre',
		filter_to_rent: 'À Louer',
		filter_all_types: 'Tous les Types',
		filter_all_schemes: 'Tous les Régimes',
		filter_search_placeholder: 'Rechercher par quartier…',
		filter_clear: 'Effacer',
		filter_listings: (n: number) => `${n} bien${n !== 1 ? 's' : ''}`,
		card_for_rent: 'À Louer',
		card_for_sale: 'À Vendre',
		no_listings: 'Aucun bien ne correspond à vos filtres.',
		clear_filters: 'Effacer les filtres',
	},
	cr: {
		nav_properties: 'Propriétés',
		nav_services: 'Servis',
		nav_why: 'Pourki Moris',
		nav_faq: 'FAQ',
		nav_about: 'Lor Nou',
		nav_browse: 'Get Propriétés',
		search_buy: 'Asté',
		search_rent: 'Loué',
		search_placeholder: 'Karter, plas ouswa mo-kle…',
		search_type_label: 'Kalité propriété',
		search_all_types: 'Tou kalité',
		search_beds_label: 'Lasam',
		search_min_beds: 'Min lasam',
		search_button: 'Sers Propriétés',
		filter_all: 'Tou',
		filter_for_sale: 'Pou Vann',
		filter_to_rent: 'Pou Loué',
		filter_all_types: 'Tou Kalité',
		filter_all_schemes: 'Tou Sèm',
		filter_search_placeholder: 'Sers par karter…',
		filter_clear: 'Efas',
		filter_listings: (n: number) => `${n} propriété${n !== 1 ? 's' : ''}`,
		card_for_rent: 'Pou Loué',
		card_for_sale: 'Pou Vann',
		no_listings: 'Okenn propriété koresponn ar ou filter.',
		clear_filters: 'Efas filter',
	},
	ru: {
		nav_properties: 'Недвижимость',
		nav_services: 'Услуги',
		nav_why: 'Почему Маврикий',
		nav_faq: 'Вопросы',
		nav_about: 'О нас',
		nav_browse: 'Смотреть объекты',
		search_buy: 'Купить',
		search_rent: 'Арендовать',
		search_placeholder: 'Район, место или ключевое слово…',
		search_type_label: 'Тип недвижимости',
		search_all_types: 'Все типы',
		search_beds_label: 'Спальни',
		search_min_beds: 'Мин. спален',
		search_button: 'Найти объекты',
		filter_all: 'Все',
		filter_for_sale: 'Продажа',
		filter_to_rent: 'Аренда',
		filter_all_types: 'Все типы',
		filter_all_schemes: 'Все схемы',
		filter_search_placeholder: 'Поиск по району…',
		filter_clear: 'Сбросить',
		filter_listings: (n: number) => `${n} объект${n === 1 ? '' : n < 5 ? 'а' : 'ов'}`,
		card_for_rent: 'Аренда',
		card_for_sale: 'Продажа',
		no_listings: 'Нет объектов, соответствующих фильтрам.',
		clear_filters: 'Сбросить фильтры',
	},
} as const;

type TranslationKey = keyof typeof translations.en;

export function t(key: TranslationKey): string | ((n: number) => string) {
	const dict = translations[locale.lang as keyof typeof translations] ?? translations.en;
	return (dict as Record<string, string | ((n: number) => string)>)[key] ??
		(translations.en as Record<string, string | ((n: number) => string)>)[key];
}

export function ts(key: TranslationKey): string {
	return t(key) as string;
}

export function tn(key: TranslationKey, n: number): string {
	const fn = t(key) as (n: number) => string;
	return fn(n);
}
