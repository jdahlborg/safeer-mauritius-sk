<script lang="ts">
	import type { PageData } from './$types';
	import { formatPrice } from '$lib/currency';
	import { ts } from '$lib/i18n';

	let { data }: { data: PageData } = $props();
	const listings = data.listings;
</script>

<svelte:head>
	<title>My Favourites — Safeer Properties</title>
</svelte:head>

<div class="pt-24 pb-20 min-h-screen bg-[#fdf6ec]">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

		<div class="mb-8">
			<h1 class="text-3xl font-bold text-gray-900" style="font-family:'Playfair Display',serif">My Favourites</h1>
			<p class="text-gray-500 mt-1">{listings.length} saved {listings.length === 1 ? 'property' : 'properties'}</p>
		</div>

		{#if listings.length === 0}
			<div class="bg-white rounded-2xl border border-gray-100 p-16 text-center shadow-sm">
				<div class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
					<svg class="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
					</svg>
				</div>
				<h2 class="text-lg font-semibold text-gray-700 mb-2">No favourites yet</h2>
				<p class="text-gray-400 text-sm mb-6">Browse properties and tap the heart icon to save ones you like.</p>
				<a href="/properties" class="btn-primary px-6 py-3 inline-block">Browse Properties</a>
			</div>
		{:else}
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
				{#each listings as l}
					<a
						href="/properties/{l.id}"
						class="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col"
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
								<span class="text-xs font-semibold px-2 py-1 rounded-full {l.transaction_type === 'rent' ? 'bg-[#2d6a4f] text-white' : 'bg-[#0077b6] text-white'}">
									{l.transaction_type === 'rent' ? ts('card_for_rent') : ts('card_for_sale')}
								</span>
								{#if l.scheme}
									<span class="text-xs font-semibold px-2 py-1 rounded-full bg-[#c9a96e] text-white">{l.scheme}</span>
								{/if}
							</div>
							<!-- Filled heart to indicate saved -->
							<div class="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm">
								<svg class="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
									<path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
								</svg>
							</div>
						</div>
						<div class="p-4 flex flex-col flex-1">
							<h3 class="font-semibold text-gray-900 text-sm leading-snug mb-1 line-clamp-2">{l.title}</h3>
							<p class="text-gray-500 text-xs mb-2 flex items-center gap-1">
								<svg class="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
								{l.location}
							</p>
							<div class="mt-auto">
								<p class="font-bold text-[#0077b6] text-sm">{formatPrice(l.price)}</p>
								{#if l.bedrooms || l.size}
									<p class="text-gray-400 text-xs mt-0.5">{[l.bedrooms, l.size].filter(Boolean).join(' · ')}</p>
								{/if}
							</div>
						</div>
					</a>
				{/each}
			</div>
		{/if}
	</div>
</div>
