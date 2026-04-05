<script lang="ts">
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
	const l = data.listing;
	const user = data.user;

	let favorited = $state(data.favorited ?? false);

	async function toggleFav() {
		if (!user) { window.location.href = '/login'; return; }
		favorited = !favorited; // optimistic
		const res = await fetch('/api/favorites', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ listingId: l.id })
		});
		if (!res.ok) favorited = !favorited; // revert on error
	}

	const SOURCE_NAMES: Record<string, string> = {
		lexpress: "L'Express Property",
		allysmu: "Ally's Real Estate",
		'2futures': '2Futures',
		propertymu: 'Property.mu'
	};

	const sourceName = SOURCE_NAMES[l.source] ?? l.source;
	const savedDate = new Date(l.saved_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

	const SCHEME_COLORS: Record<string, string> = {
		PDS: 'bg-[#0077b6] text-white',
		IRS: 'bg-[#2d6a4f] text-white',
		RES: 'bg-[#c9a96e] text-white',
		'G+2': 'bg-purple-600 text-white',
		'Smart City': 'bg-teal-600 text-white',
	};

	// Build deduplicated image list: images[] first, fallback to image
	const allImages = $derived.by(() => {
		const imgs: string[] = [];
		const seen = new Set<string>();
		for (const img of [...(l.images ?? []), ...(l.image ? [l.image] : [])]) {
			if (img && !seen.has(img)) { seen.add(img); imgs.push(img); }
		}
		return imgs;
	});

	let activeImg = $state(0);
</script>

<svelte:head>
	<title>{l.title} — Safeer Properties</title>
	<meta name="description" content="{l.title}{l.location ? ' in ' + l.location : ''}. {l.price}{l.bedrooms ? ' · ' + l.bedrooms : ''}{l.size ? ' · ' + l.size : ''}." />
</svelte:head>

<!-- Breadcrumb -->
<div class="bg-white border-b border-gray-100 pt-24 pb-3">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<nav class="flex items-center gap-2 text-sm text-gray-400">
			<a href="/" class="hover:text-gray-600">Home</a>
			<span>/</span>
			<a href="/properties" class="hover:text-gray-600">Properties</a>
			<span>/</span>
			<span class="text-gray-700 line-clamp-1">{l.title}</span>
		</nav>
	</div>
</div>

<div class="bg-gray-50 min-h-screen pb-20">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
		<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

			<!-- Left: Image + details -->
			<div class="lg:col-span-2 space-y-6">

				<!-- Hero image -->
				<!-- Image gallery -->
				<div class="space-y-2">
					<div class="rounded-2xl overflow-hidden bg-gray-200 aspect-[16/9] relative shadow-sm">
						{#if allImages.length > 0}
							<img src={allImages[activeImg]} alt={l.title} class="w-full h-full object-cover" />
							{#if allImages.length > 1}
								<button
									onclick={() => activeImg = (activeImg - 1 + allImages.length) % allImages.length}
									class="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition-colors backdrop-blur-sm"
									aria-label="Previous image"
								>
									<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
								</button>
								<button
									onclick={() => activeImg = (activeImg + 1) % allImages.length}
									class="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition-colors backdrop-blur-sm"
									aria-label="Next image"
								>
									<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
								</button>
								<span class="absolute bottom-3 right-3 text-xs bg-black/50 text-white px-2.5 py-1 rounded-full backdrop-blur-sm">
									{activeImg + 1} / {allImages.length}
								</span>
							{/if}
						{:else}
							<div class="w-full h-full flex items-center justify-center text-gray-300">
								<svg class="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
							</div>
						{/if}
						<div class="absolute top-4 left-4 flex gap-2">
							<span class="text-xs font-semibold px-3 py-1.5 rounded-full shadow {l.transaction_type === 'rent' ? 'bg-[#2d6a4f] text-white' : 'bg-[#0077b6] text-white'}">
								{l.transaction_type === 'rent' ? 'For Rent' : 'For Sale'}
							</span>
							{#if l.property_type}
								<span class="text-xs font-semibold px-3 py-1.5 rounded-full bg-black/50 text-white shadow">{l.property_type}</span>
							{/if}
							{#if l.scheme}
								<span class="text-xs font-semibold px-3 py-1.5 rounded-full shadow {SCHEME_COLORS[l.scheme] ?? 'bg-gray-700 text-white'}">{l.scheme}</span>
							{/if}
						</div>
					</div>

					<!-- Thumbnail strip -->
					{#if allImages.length > 1}
						<div class="flex gap-2 overflow-x-auto pb-1">
							{#each allImages as img, i}
								<button
									onclick={() => activeImg = i}
									class="flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all {activeImg === i ? 'border-[#0077b6] opacity-100' : 'border-transparent opacity-60 hover:opacity-90'}"
								>
									<img src={img} alt="Photo {i + 1}" class="w-full h-full object-cover" loading="lazy" />
								</button>
							{/each}
						</div>
					{/if}
				</div>
				<!-- Title & price -->
				<div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
					<h1 class="font-bold text-2xl sm:text-3xl text-gray-900 leading-snug mb-3" style="font-family:'Playfair Display',serif">{l.title}</h1>
					{#if l.location}
						<p class="flex items-center gap-1.5 text-gray-500 mb-4">
							<svg class="w-4 h-4 flex-shrink-0 text-[#0077b6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
							{l.location}
						</p>
					{/if}
					<p class="text-3xl font-bold text-[#0077b6]" style="font-family:'Playfair Display',serif">{l.price || 'Price on request'}</p>
				</div>

				<!-- Key stats -->
				<div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
					<h2 class="font-semibold text-gray-900 mb-4">Property Details</h2>
					<div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
						{#if l.bedrooms}
							<div class="flex items-center gap-3">
								<div class="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
									<svg class="w-5 h-5 text-[#0077b6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
								</div>
								<div>
									<div class="text-xs text-gray-400">{l.property_type === 'office' ? 'Rooms' : 'Bedrooms'}</div>
									<div class="font-semibold text-gray-900 text-sm">{l.bedrooms}</div>
								</div>
							</div>
						{/if}
						{#if l.size}
							<div class="flex items-center gap-3">
								<div class="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
									<svg class="w-5 h-5 text-[#c9a96e]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/></svg>
								</div>
								<div>
									<div class="text-xs text-gray-400">Size</div>
									<div class="font-semibold text-gray-900 text-sm">{l.size}</div>
								</div>
							</div>
						{/if}
						{#if l.property_type}
							<div class="flex items-center gap-3">
								<div class="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
									<svg class="w-5 h-5 text-[#2d6a4f]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
								</div>
								<div>
									<div class="text-xs text-gray-400">Type</div>
									<div class="font-semibold text-gray-900 text-sm">{l.property_type}</div>
								</div>
							</div>
						{/if}
						{#if l.agency}
							<div class="flex items-center gap-3">
								<div class="w-9 h-9 rounded-lg bg-sky-50 flex items-center justify-center flex-shrink-0">
									<svg class="w-5 h-5 text-[#00b4d8]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
								</div>
								<div>
									<div class="text-xs text-gray-400">Agency</div>
									<div class="font-semibold text-gray-900 text-sm">{l.agency}</div>
								</div>
							</div>
						{/if}
						<div class="flex items-center gap-3">
							<div class="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
								<svg class="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
							</div>
							<div>
								<div class="text-xs text-gray-400">Transaction</div>
								<div class="font-semibold text-gray-900 text-sm">{l.transaction_type === 'rent' ? 'For Rent' : 'For Sale'}</div>
							</div>
						</div>
						<div class="flex items-center gap-3">
							<div class="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
								<svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
							</div>
							<div>
								<div class="text-xs text-gray-400">Source</div>
								<div class="font-semibold text-gray-900 text-sm">{sourceName}</div>
							</div>
						</div>
						{#if l.scheme}
							<div class="flex items-center gap-3">
								<div class="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 {SCHEME_COLORS[l.scheme] ?? 'bg-gray-100 text-gray-600'}">
									<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
								</div>
								<div>
									<div class="text-xs text-gray-400">Scheme</div>
									<div class="font-semibold text-gray-900 text-sm">{l.scheme}</div>
								</div>
							</div>
						{/if}
						{#if l.available_from}
							<div class="flex items-center gap-3">
								<div class="w-9 h-9 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
									<svg class="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
								</div>
								<div>
									<div class="text-xs text-gray-400">Available From</div>
									<div class="font-semibold text-gray-900 text-sm">{l.available_from}</div>
								</div>
							</div>
						{/if}
					</div>
				</div>

				<!-- Features -->
				{#if l.features?.length}
					<div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
						<h2 class="font-semibold text-gray-900 mb-4">Features & Amenities</h2>
						<div class="flex flex-wrap gap-2">
							{#each l.features as feat}
								<span class="text-sm bg-[#fdf6ec] text-gray-700 px-3 py-1.5 rounded-full border border-[#e8d5b0]">{feat}</span>
							{/each}
						</div>
					</div>
				{/if}

				<!-- Notes -->
				{#if l.notes}
					<div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
						<h2 class="font-semibold text-gray-900 mb-3">Notes</h2>
						<p class="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{l.notes}</p>
					</div>
				{/if}

				<!-- Original listing link -->
				{#if l.url}
					<div class="text-sm text-gray-400 flex items-center gap-2">
						<svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
						Listed on {sourceName} · Added {savedDate} ·
						<a href={l.url} target="_blank" rel="noopener noreferrer" class="text-[#0077b6] hover:underline">View original listing ↗</a>
					</div>
				{/if}

			</div>

			<!-- Right: Contact sidebar -->
			<div class="space-y-5">

				<!-- Price card -->
				<div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
					<div class="flex items-start justify-between gap-2 mb-1">
						<p class="text-2xl font-bold text-[#0077b6]" style="font-family:'Playfair Display',serif">{l.price || 'Price on request'}</p>
						<button onclick={toggleFav} title={favorited ? 'Remove from favourites' : 'Save to favourites'} class="flex-shrink-0 w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all {favorited ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-red-300'}">
							{#if favorited}<svg class="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>{:else}<svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>{/if}
						</button>
					</div>
					{#if l.bedrooms || l.size}
						<p class="text-sm text-gray-500 mb-5">{[l.bedrooms, l.size].filter(Boolean).join(' · ')}</p>
					{:else}
						<div class="mb-5"></div>
					{/if}

					<a
						href="https://wa.me/2305700000?text={encodeURIComponent('Hi, I\'m interested in: ' + l.title + (l.location ? ' in ' + l.location : '') + '. Can you tell me more?')}"
						target="_blank" rel="noopener noreferrer"
						class="w-full flex items-center justify-center gap-2 bg-[#25d366] text-white font-semibold py-3.5 rounded-xl hover:bg-[#1db954] transition-colors mb-3"
					>
						<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
						Ask on WhatsApp
					</a>
					<a
						href="/#contact"
						class="w-full flex items-center justify-center gap-2 border-2 border-[#0077b6] text-[#0077b6] font-semibold py-3.5 rounded-xl hover:bg-[#0077b6] hover:text-white transition-colors mb-3"
					>
						Request Information
					</a>
					{#if l.url}
						<a
							href={l.url}
							target="_blank" rel="noopener noreferrer"
							class="w-full flex items-center justify-center gap-1 text-sm text-gray-400 hover:text-gray-600 transition-colors py-2"
						>
							View on {sourceName} ↗
						</a>
					{/if}

					<div class="border-t border-gray-100 mt-4 pt-4 space-y-2 text-sm text-gray-500">
						<div class="flex items-center gap-2">
							<svg class="w-4 h-4 text-[#0077b6] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
							+230 5700 0000
						</div>
						<div class="flex items-center gap-2">
							<svg class="w-4 h-4 text-[#0077b6] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
							hello@safeer.mu
						</div>
					</div>
				</div>

				<!-- Why use us -->
				<div class="bg-[#fdf6ec] rounded-2xl p-5 border border-[#e8d5b0]">
					<h3 class="font-semibold text-gray-900 mb-3 text-sm">Why use Safeer Properties?</h3>
					<ul class="space-y-2 text-sm text-gray-600">
						{#each [
							'We negotiate on your behalf',
							'Visa & residency handled end-to-end',
							'Legal & financial setup included',
							'Local experts, international clients',
						] as point}
							<li class="flex items-start gap-2">
								<span class="w-4 h-4 rounded-full bg-[#0077b6] text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5">✓</span>
								{point}
							</li>
						{/each}
					</ul>
				</div>

			</div>
		</div>
	</div>
</div>
