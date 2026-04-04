<script lang="ts">
	import { locale, setLang, setCurrency } from '$lib/locale.svelte';
	import { ts } from '$lib/i18n';

	let mobileOpen = $state(false);

	const links = $derived([
		{ href: '/properties', label: ts('nav_properties') },
		{ href: '/#services', label: ts('nav_services') },
		{ href: '/#why-mauritius', label: ts('nav_why') },
		{ href: '/#faq', label: ts('nav_faq') },
		{ href: '/partners', label: ts('nav_partners') },
	]);

	const LANGS: { code: typeof locale.lang; label: string }[] = [
		{ code: 'en', label: 'EN' },
		{ code: 'fr', label: 'FR' },
		{ code: 'cr', label: 'CR' },
		{ code: 'ru', label: 'RU' },
	];

	const CURRENCIES: { code: typeof locale.currency; label: string }[] = [
		{ code: 'EUR', label: '€' },
		{ code: 'USD', label: '$' },
		{ code: 'GBP', label: '£' },
		{ code: 'MUR', label: '₨' },
		{ code: 'ZAR', label: 'R' },
		{ code: 'RUB', label: '₽' },
	];
</script>

<header class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/95 backdrop-blur-sm shadow-sm">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex items-center justify-between h-20">
			<!-- Logo -->
			<a href="/" class="flex items-center gap-3">
				<div class="w-10 h-10 rounded-full bg-gradient-to-br from-[#0077b6] to-[#00b4d8] flex items-center justify-center">
					<span class="text-white font-bold text-lg" style="font-family:'Playfair Display',serif">S</span>
				</div>
				<div>
					<span class="font-bold text-xl text-[#005f8a]" style="font-family:'Playfair Display',serif">Safeer</span>
					<span class="font-bold text-xl text-[#c9a96e]" style="font-family:'Playfair Display',serif"> Properties</span>
				</div>
			</a>

			<!-- Desktop Nav -->
			<nav class="hidden lg:flex items-center gap-6">
				{#each links as link}
					<a href={link.href} class="nav-link">{link.label}</a>
				{/each}
				<a href="/properties" class="btn-primary text-sm px-4 py-2">{ts('nav_browse')}</a>

				<!-- Language switcher -->
				<div class="flex items-center border border-gray-200 rounded-lg overflow-hidden text-xs">
					{#each LANGS as l}
						<button
							onclick={() => setLang(l.code)}
							class="px-2 py-1.5 font-semibold transition-colors"
							class:bg-[#0077b6]={locale.lang === l.code}
							class:text-white={locale.lang === l.code}
							class:text-gray-500={locale.lang !== l.code}
							class:hover:bg-gray-50={locale.lang !== l.code}
						>{l.label}</button>
					{/each}
				</div>

				<!-- Currency switcher -->
				<div class="flex items-center border border-gray-200 rounded-lg overflow-hidden text-xs">
					{#each CURRENCIES as c}
						<button
							onclick={() => setCurrency(c.code)}
							class="px-2 py-1.5 font-semibold transition-colors"
							class:bg-[#c9a96e]={locale.currency === c.code}
							class:text-white={locale.currency === c.code}
							class:text-gray-500={locale.currency !== c.code}
							class:hover:bg-gray-50={locale.currency !== c.code}
						>{c.label}</button>
					{/each}
				</div>
			</nav>

			<!-- Hamburger -->
			<button
				onclick={() => (mobileOpen = !mobileOpen)}
				class="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
				aria-label="Toggle menu"
			>
				<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					{#if mobileOpen}
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
					{:else}
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
					{/if}
				</svg>
			</button>
		</div>
	</div>

	<!-- Mobile Menu -->
	{#if mobileOpen}
		<div class="lg:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3">
			<a href="/" class="mobile-nav-link" onclick={() => (mobileOpen = false)}>Home</a>
			{#each links as link}
				<a href={link.href} class="mobile-nav-link" onclick={() => (mobileOpen = false)}>{link.label}</a>
			{/each}
			<a href="/#contact" class="mobile-nav-link" onclick={() => (mobileOpen = false)}>Contact</a>

			<!-- Mobile lang/currency -->
			<div class="pt-2 flex gap-3 flex-wrap">
				<div class="flex items-center border border-gray-200 rounded-lg overflow-hidden text-xs">
					{#each LANGS as l}
						<button
							onclick={() => setLang(l.code)}
							class="px-2.5 py-1.5 font-semibold transition-colors"
							class:bg-[#0077b6]={locale.lang === l.code}
							class:text-white={locale.lang === l.code}
							class:text-gray-500={locale.lang !== l.code}
						>{l.label}</button>
					{/each}
				</div>
				<div class="flex items-center border border-gray-200 rounded-lg overflow-hidden text-xs">
					{#each CURRENCIES as c}
						<button
							onclick={() => setCurrency(c.code)}
							class="px-2.5 py-1.5 font-semibold transition-colors"
							class:bg-[#c9a96e]={locale.currency === c.code}
							class:text-white={locale.currency === c.code}
							class:text-gray-500={locale.currency !== c.code}
						>{c.label}</button>
					{/each}
				</div>
			</div>
		</div>
	{/if}
</header>
