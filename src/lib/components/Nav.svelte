<script lang="ts">
	import { locale, setLang, setCurrency } from '$lib/locale.svelte';
	import { ts } from '$lib/i18n';

	let { user = null, adminAuthed = false }: { user?: { id: number; email: string; name: string } | null; adminAuthed?: boolean } = $props();

	let mobileOpen = $state(false);
	let userMenuOpen = $state(false);

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
		{ code: 'EUR', label: '€ EUR' },
		{ code: 'USD', label: '$ USD' },
		{ code: 'GBP', label: '£ GBP' },
		{ code: 'MUR', label: '₨ MUR' },
		{ code: 'ZAR', label: 'R ZAR' },
		{ code: 'RUB', label: '₽ RUB' },
	];

	const initials = $derived(
		user?.name ? user.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
		: user?.email ? user.email[0].toUpperCase()
		: ''
	);
</script>

<svelte:window onclick={(e) => { if (!(e.target as HTMLElement).closest('.user-menu')) userMenuOpen = false; }} />

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

				<!-- Compact lang + currency dropdowns -->
				<div class="flex items-center gap-1.5">
					<select
						value={locale.lang}
						onchange={(e) => setLang((e.target as HTMLSelectElement).value as typeof locale.lang)}
						class="border border-gray-200 rounded-md px-1.5 py-1 text-xs font-medium text-gray-600 bg-white focus:outline-none focus:ring-1 focus:ring-[#0077b6] cursor-pointer"
					>
						{#each LANGS as l}<option value={l.code}>{l.label}</option>{/each}
					</select>
					<select
						value={locale.currency}
						onchange={(e) => setCurrency((e.target as HTMLSelectElement).value as typeof locale.currency)}
						class="border border-gray-200 rounded-md px-1.5 py-1 text-xs font-medium text-gray-600 bg-white focus:outline-none focus:ring-1 focus:ring-[#c9a96e] cursor-pointer"
					>
						{#each CURRENCIES as c}<option value={c.code}>{c.label}</option>{/each}
					</select>
				</div>

				<!-- Auth -->
				{#if user}
					<div class="relative user-menu">
						<button
							onclick={() => (userMenuOpen = !userMenuOpen)}
							class="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border border-gray-200 hover:border-[#0077b6] transition-colors"
						>
							<div class="w-7 h-7 rounded-full bg-[#0077b6] flex items-center justify-center text-white text-xs font-bold">
								{initials}
							</div>
							<span class="text-sm text-gray-700 max-w-[100px] truncate">{user.name || user.email.split('@')[0]}</span>
							<svg class="w-3.5 h-3.5 text-gray-400 transition-transform {userMenuOpen ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
							</svg>
						</button>
						{#if userMenuOpen}
							<div class="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
								<div class="px-4 py-2 border-b border-gray-100">
									<p class="text-xs text-gray-400 truncate">{user.email}</p>
								</div>
								<a href="/my/favorites" class="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50" onclick={() => (userMenuOpen = false)}>
									<svg class="w-4 h-4 text-[#0077b6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
									My Favourites
								</a>
								<form method="POST" action="/logout">
									<button type="submit" class="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
										<svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
										Sign out
									</button>
								</form>
							</div>
						{/if}
					</div>
				{:else if adminAuthed}
					<a href="/admin" class="flex items-center gap-1.5 text-sm font-medium text-[#0077b6] hover:text-[#005f8a] transition-colors">
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
						Admin
					</a>
				{:else}
					<a href="/login" class="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-[#0077b6] transition-colors">
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
						Sign in
					</a>
				{/if}
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

			{#if user}
				<a href="/my/favorites" class="mobile-nav-link" onclick={() => (mobileOpen = false)}>My Favourites</a>
				<form method="POST" action="/logout">
					<button type="submit" class="mobile-nav-link w-full text-left">Sign out</button>
				</form>
			{:else}
				<a href="/login" class="mobile-nav-link" onclick={() => (mobileOpen = false)}>Sign in</a>
			{/if}

			<!-- Mobile lang/currency -->
			<div class="pt-2 flex gap-2">
				<select
					value={locale.lang}
					onchange={(e) => setLang((e.target as HTMLSelectElement).value as typeof locale.lang)}
					class="border border-gray-200 rounded-md px-2 py-1.5 text-sm text-gray-600 bg-white focus:outline-none"
				>
					{#each LANGS as l}<option value={l.code}>{l.label}</option>{/each}
				</select>
				<select
					value={locale.currency}
					onchange={(e) => setCurrency((e.target as HTMLSelectElement).value as typeof locale.currency)}
					class="border border-gray-200 rounded-md px-2 py-1.5 text-sm text-gray-600 bg-white focus:outline-none"
				>
					{#each CURRENCIES as c}<option value={c.code}>{c.label}</option>{/each}
				</select>
			</div>
		</div>
	{/if}
</header>
