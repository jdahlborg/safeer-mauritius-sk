<script lang="ts">
	import type { PageData } from './$types';
	import PropertyMap from '$lib/components/PropertyMap.svelte';
	import { page } from '$app/state';
	import { REGION_NAMES, getRegion, getRegionFromLocation, type Region } from '$lib/regions';
	import { ts, tn } from '$lib/i18n';
	import { formatPrice } from '$lib/currency';

	let { data }: { data: PageData } = $props();

	const listings = data.listings;

	// Initialise from URL params (set by homepage search form)
	let tab = $state<'all' | 'buy' | 'rent'>(
		(page.url.searchParams.get('payment') as 'buy' | 'rent') ?? 'all'
	);
	let filterQ = $state(page.url.searchParams.get('q') ?? '');
	let filterType = $state(page.url.searchParams.get('type') ?? '');
	let filterScheme = $state('');
	let filterMinBeds = $state(page.url.searchParams.get('minBeds') ?? '');
	let activeId = $state<number | null>(null);
	let filterRegion = $state<Region | null>(null);
	let activeRegion = $state<Region | null>(null);

	// Keep filter and map region in sync
	$effect(() => { filterRegion = activeRegion; });
	$effect(() => { activeRegion = filterRegion; });

	const types = [...new Set(listings.map(l => l.property_type).filter(Boolean))].sort();
	const schemes = [...new Set(listings.map(l => l.scheme).filter(Boolean))].sort();

	const filtered = $derived(
		listings.filter(l => {
			if (tab !== 'all' && l.payment !== tab) return false;
			if (filterType && l.property_type !== filterType) return false;
			if (filterScheme && l.scheme !== filterScheme) return false;
			if (filterQ) {
				const q = filterQ.toLowerCase();
				if (!l.title.toLowerCase().includes(q) && !l.location.toLowerCase().includes(q)) return false;
			}
			if (filterMinBeds && l.bedrooms) {
				const beds = parseInt(l.bedrooms);
				if (!isNaN(beds) && beds < parseInt(filterMinBeds)) return false;
			}
			if (filterRegion) {
				const region = l.lat != null && l.lng != null
					? getRegion(l.lat, l.lng)
					: getRegionFromLocation(l.location);
				if (region !== filterRegion) return false;
			}
			return true;
		})
	);

	const mappable = $derived(filtered.filter(l => l.lat != null && l.lng != null));

	function clearFilters() {
		tab = 'all'; filterQ = ''; filterType = ''; filterScheme = ''; filterMinBeds = ''; filterRegion = null; activeRegion = null;
	}
</script>

<svelte:head>
	<title>Properties in Mauritius — Safeer Properties</title>
	<meta name="description" content="Browse properties for sale and rent in Mauritius. Curated listings from trusted local agents." />
</svelte:head>

<!-- pt-20 pushes all content below the fixed nav -->
<div class="pt-20">

<!-- Filters bar (sticky) -->
<section class="bg-white border-b border-gray-200 sticky top-20 z-30 shadow-sm">
	<div class="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 overflow-x-auto scrollbar-hide min-w-0">

		<!-- Buy / Rent toggle -->
		<div class="flex rounded-lg border border-gray-200 overflow-hidden text-sm">
			{#each [['all', ts('filter_all')], ['buy', ts('filter_for_sale')], ['rent', ts('filter_to_rent')]] as [val, label]}
				<button
					onclick={() => (tab = val as typeof tab)}
					class="px-3 py-1.5 font-medium transition-colors"
					class:bg-[#0077b6]={tab === val}
					class:text-white={tab === val}
					class:text-gray-600={tab !== val}
					class:hover:bg-gray-50={tab !== val}
				>{label}</button>
			{/each}
		</div>

		<!-- Keyword / location search -->
		<div class="relative">
			<svg class="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
			<input
				type="search"
				bind:value={filterQ}
				placeholder={ts('filter_search_placeholder')}
				class="pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg w-56 focus:outline-none focus:ring-1 focus:ring-[#0077b6] focus:border-[#0077b6]"
			/>
		</div>

		<!-- Type -->
		<select bind:value={filterType} class="text-sm border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#0077b6]">
			<option value="">{ts('filter_all_types')}</option>
			{#each types as t}<option value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>{/each}
		</select>


		<!-- Min beds -->
		<select bind:value={filterMinBeds} class="text-sm border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#0077b6]">
			<option value="">{ts('search_min_beds')}</option>
			{#each ['1','2','3','4','5'] as b}<option value={b}>{b}+</option>{/each}
		</select>

		<!-- Region -->
		<div class="flex rounded-lg border border-gray-200 overflow-hidden text-sm">
			<button
				onclick={() => { filterRegion = null; activeRegion = null; }}
				class="px-2.5 py-1.5 font-medium transition-colors"
				class:bg-[#0077b6]={filterRegion === null}
				class:text-white={filterRegion === null}
				class:text-gray-600={filterRegion !== null}
				class:hover:bg-gray-50={filterRegion !== null}
			>All</button>
			{#each REGION_NAMES as r}
				{@const cfg = { North: '#0077b6', South: '#e76f51', West: '#2d6a4f', Center: '#8b5cf6', East: '#c9a96e' }[r]}
				<button
					onclick={() => { filterRegion = filterRegion === r ? null : r; activeRegion = filterRegion; }}
					class="px-2.5 py-1.5 font-medium transition-colors border-l border-gray-200"
					style={filterRegion === r ? `background:${cfg};color:white` : ''}
					class:text-gray-600={filterRegion !== r}
					class:hover:bg-gray-50={filterRegion !== r}
				>{r}</button>
			{/each}
		</div>

		<!-- Scheme -->
		{#if schemes.length > 0}
			<select bind:value={filterScheme} class="text-sm border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#0077b6]">
				<option value="">{ts('filter_all_schemes')}</option>
				{#each schemes as s}<option value={s}>{s}</option>{/each}
			</select>
		{/if}

		<span class="text-gray-400 text-xs ml-auto">{tn('filter_listings', filtered.length)}</span>
		{#if filterQ || filterType || filterScheme || filterMinBeds || tab !== 'all' || filterRegion}
			<button onclick={clearFilters} class="text-xs text-[#0077b6] hover:underline">{ts('filter_clear')}</button>
		{/if}
	</div>
</section>

<!-- Main content: fixed viewport height so left panel scrolls independently -->
<div class="flex" style="height: calc(100vh - 132px)">

	<!-- Left: scrollable cards panel -->
	<div class="flex-1 min-w-0 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6">
		{#if filtered.length === 0}
			<div class="text-center py-20 text-gray-400">
				<p class="text-lg font-medium">{ts('no_listings')}</p>
				<button onclick={clearFilters} class="mt-4 text-[#0077b6] hover:underline text-sm">{ts('clear_filters')}</button>
			</div>
		{:else}
			<div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
				{#each filtered as l}
					<a
						href="/properties/{l.id}"
						onmouseenter={() => (activeId = l.id)}
						onmouseleave={() => (activeId = null)}
						class="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col {activeId === l.id ? 'ring-2 ring-[#0077b6]' : ''}"
					>
						<div class="relative h-48 bg-gray-100">
							{#if l.image}
								<img src={l.image} alt={l.title} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
							{:else}
								<div class="w-full h-full flex items-center justify-center text-gray-300">
									<svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
								</div>
							{/if}
							<div class="absolute top-3 left-3 flex gap-1">
								<span class="text-xs font-semibold px-2 py-1 rounded-full {l.payment === 'rent' ? 'bg-[#2d6a4f] text-white' : 'bg-[#0077b6] text-white'}">
									{l.payment === 'rent' ? ts('card_for_rent') : ts('card_for_sale')}
								</span>
								{#if l.scheme}
									<span class="text-xs font-semibold px-2 py-1 rounded-full bg-[#c9a96e] text-white">{l.scheme}</span>
								{/if}
							</div>
							{#if l.property_type}
								<span class="absolute top-3 right-3 text-xs font-medium px-2 py-1 rounded-full bg-black/40 text-white backdrop-blur-sm">{l.property_type}</span>
							{/if}
						</div>
						<div class="p-4 flex flex-col flex-1">
							<h3 class="font-semibold text-gray-900 text-sm leading-snug mb-1 line-clamp-2">{l.title}</h3>
							<p class="text-gray-500 text-xs mb-2 flex items-center gap-1">
								<svg class="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
								{l.location}
							</p>
							{#if l.features.length > 0}
								<div class="flex flex-wrap gap-1 mb-2">
									{#each l.features.slice(0, 3) as feat}
										<span class="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{feat}</span>
									{/each}
								</div>
							{/if}
							<div class="mt-auto">
								<p class="font-bold text-[#0077b6] text-sm">{formatPrice(l.price)}</p>
								{#if l.bedrooms || l.size}
									<p class="text-gray-400 text-xs mt-0.5">{[l.bedrooms, l.size].filter(Boolean).join(' · ')}</p>
								{/if}
								{#if l.agency}
									<p class="text-xs text-gray-400 mt-0.5">{l.agency}</p>
								{/if}
							</div>
						</div>
					</a>
				{/each}
			</div>
		{/if}
	</div>

	<!-- Right: map panel (fills height naturally) -->
	<div class="hidden lg:flex lg:flex-col w-[420px] xl:w-[500px] flex-shrink-0 p-4">
		<div class="flex-1 min-h-0">
			<PropertyMap listings={mappable} bind:activeId bind:activeRegion />
		</div>
		{#if mappable.length < filtered.length}
			<p class="text-xs text-gray-400 text-center mt-2 flex-shrink-0">{mappable.length} of {filtered.length} listings mapped — <a href="/admin" class="text-[#0077b6] hover:underline">geocode more</a></p>
		{/if}
	</div>

</div>

</div><!-- end pt-20 wrapper -->

<!-- PDS/IRS/RES Info -->
<section class="py-16 bg-white border-t border-gray-100">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="text-center mb-10">
			<span class="section-tag">Foreign Ownership</span>
			<h2 class="section-title mt-3">Can Foreigners Buy Property?</h2>
			<p class="section-subtitle">Yes — through government-approved property schemes</p>
		</div>
		<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
			{#each [
				{ name: 'PDS', full: 'Property Development Scheme', desc: 'High-end integrated developments. Purchases of USD 375,000+ grant a Permanent Residence Permit automatically.', color: '#0077b6' },
				{ name: 'IRS', full: 'Integrated Resort Scheme', desc: 'Luxury resort-style residences. Legacy scheme still active for existing developments. Permits linked to purchase.', color: '#2d6a4f' },
				{ name: 'RES', full: 'Real Estate Scheme', desc: 'Smaller-scale high-quality developments. More affordable entry points with full foreign ownership rights.', color: '#c9a96e' },
			] as scheme}
				<div class="rounded-2xl border-2 p-6" style="border-color:{scheme.color}20">
					<div class="text-2xl font-bold mb-1" style="color:{scheme.color};font-family:'Playfair Display',serif">{scheme.name}</div>
					<div class="text-sm font-semibold text-gray-700 mb-3">{scheme.full}</div>
					<p class="text-gray-600 text-sm leading-relaxed">{scheme.desc}</p>
				</div>
			{/each}
		</div>
		<div class="text-center mt-10">
			<a href="/#contact" class="btn-primary px-8 py-4 inline-flex items-center gap-2">
				Get Property Advice
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
			</a>
		</div>
	</div>
</section>
