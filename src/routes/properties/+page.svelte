<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let tab = $state<'all' | 'buy' | 'rent'>('all');
	let filterType = $state('');
	let filterArea = $state('');

	const listings = data.listings;

	const areas = [...new Set(listings.map(l => l.location.split(',')[1]?.trim()).filter(Boolean))].sort();
	const types = [...new Set(listings.map(l => l.property_type).filter(Boolean))].sort();

	const filtered = $derived(
		listings.filter(l => {
			if (tab !== 'all' && l.payment !== tab) return false;
			if (filterType && l.property_type !== filterType) return false;
			if (filterArea && !l.location.includes(filterArea)) return false;
			return true;
		})
	);
</script>

<svelte:head>
	<title>Properties in Mauritius — Safeer Mauritius</title>
	<meta name="description" content="Browse properties for sale and rent in Mauritius. Curated listings from trusted local agents." />
</svelte:head>

<!-- Hero -->
<section class="relative pt-32 pb-20 bg-[#005f8a] text-white overflow-hidden">
	<div class="absolute inset-0">
		<img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80&fit=crop" alt="Mauritius property" class="w-full h-full object-cover opacity-20" />
	</div>
	<div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
		<span class="inline-block bg-white/15 text-white/80 text-sm font-medium px-4 py-1.5 rounded-full mb-4">🏠 Curated Listings</span>
		<h1 class="font-bold text-5xl lg:text-6xl mb-4" style="font-family:'Playfair Display',serif">Properties in Mauritius</h1>
		<p class="text-white/80 text-lg max-w-2xl mx-auto">Handpicked properties for sale and rent across the island — from beachfront apartments to luxury villas.</p>
	</div>
</section>

<!-- Filters -->
<section class="bg-white border-b border-gray-100 sticky top-20 z-30">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center gap-4">
		<!-- Tabs -->
		<div class="flex rounded-lg border border-gray-200 overflow-hidden">
			{#each [['all','All'], ['buy','For Sale'], ['rent','For Rent']] as [val, label]}
				<button
					onclick={() => (tab = val as typeof tab)}
					class="px-4 py-2 text-sm font-medium transition-colors"
					class:bg-[#0077b6]={tab === val}
					class:text-white={tab === val}
					class:text-gray-600={tab !== val}
					class:hover:bg-gray-50={tab !== val}
				>{label}</button>
			{/each}
		</div>

		<select bind:value={filterType} class="form-input w-auto text-sm py-2">
			<option value="">All Types</option>
			{#each types as t}<option value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>{/each}
		</select>

		<select bind:value={filterArea} class="form-input w-auto text-sm py-2">
			<option value="">All Areas</option>
			{#each areas as a}<option value={a}>{a}</option>{/each}
		</select>

		<span class="text-gray-400 text-sm ml-auto">{filtered.length} listings</span>
	</div>
</section>

<!-- Listings Grid -->
<section class="py-16 bg-gray-50">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		{#if filtered.length === 0}
			<div class="text-center py-20 text-gray-400">
				<p class="text-lg">No listings match your filters.</p>
				<button onclick={() => { tab='all'; filterType=''; filterArea=''; }} class="mt-4 text-[#0077b6] hover:underline text-sm">Clear filters</button>
			</div>
		{:else}
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
				{#each filtered as l}
					<a href={l.url} target="_blank" rel="noopener noreferrer" class="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col">
						<div class="relative h-48 bg-gray-100">
							{#if l.image}
								<img src={l.image} alt={l.title} class="w-full h-full object-cover" loading="lazy" />
							{:else}
								<div class="w-full h-full flex items-center justify-center text-gray-300">
									<svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
								</div>
							{/if}
							<div class="absolute top-3 left-3">
								<span class="text-xs font-semibold px-2 py-1 rounded-full {l.payment === 'rent' ? 'bg-[#2d6a4f] text-white' : 'bg-[#0077b6] text-white'}">
									{l.payment === 'rent' ? 'For Rent' : 'For Sale'}
								</span>
							</div>
						</div>
						<div class="p-4 flex flex-col flex-1">
							<h3 class="font-semibold text-gray-900 text-sm leading-snug mb-1 line-clamp-2">{l.title}</h3>
							<p class="text-gray-500 text-xs mb-3 flex items-center gap-1">
								<svg class="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
								{l.location}
							</p>
							{#if l.features.length > 0}
								<div class="flex flex-wrap gap-1 mb-3">
									{#each l.features.slice(0, 3) as feat}
										<span class="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{feat}</span>
									{/each}
								</div>
							{/if}
							<div class="mt-auto">
								<p class="font-bold text-[#0077b6] text-base">{l.price}</p>
								{#if l.agency}
									<p class="text-xs text-gray-400 mt-1">{l.agency}</p>
								{/if}
							</div>
						</div>
					</a>
				{/each}
			</div>
		{/if}
	</div>
</section>

<!-- PDS/IRS/RES Info -->
<section class="py-16 bg-white">
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
