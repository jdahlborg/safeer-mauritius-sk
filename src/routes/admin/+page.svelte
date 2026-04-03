<script lang="ts">
	import type { SavedListing, Partner } from '$lib/server/db';

	type Listing = {
		title: string; url: string; location: string; price: string;
		features: string[]; bedrooms: string; size: string;
		image: string; agency: string; payment: string; property_type: string;
	};

	const SOURCES = [
		{ id: 'lexpress', name: "L'Express Property", payments: ['buy', 'rent', 'holiday'], propertyTypes: ['apartment', 'villa', 'house', 'land', 'office', 'penthouse'], sortable: true },
		{ id: 'allysmu', name: "Ally's Real Estate", payments: ['buy', 'rent'], propertyTypes: ['any'], sortable: false },
		{ id: '2futures', name: '2Futures', payments: ['buy'], propertyTypes: ['any'], sortable: false },
		{ id: 'propertymu', name: 'Property.mu', payments: ['buy', 'rent'], propertyTypes: ['any'], sortable: false }
	];

	// ── Scraper state ──────────────────────────────────────
	let source = $state('lexpress');
	let payment = $state('buy');
	let propertyType = $state('apartment');
	let sortBy = $state('most_recent');
	let pages = $state(1);
	let scraping = $state(false);
	let scrapeResults = $state<Listing[]>([]);
	let scrapeError = $state('');

	// Track save state per listing URL: 'idle' | 'saving' | 'saved' | 'duplicate'
	let saveState = $state<Record<string, 'saving' | 'saved' | 'duplicate'>>({});
	let savingAll = $state(false);

	let currentSource = $derived(SOURCES.find(s => s.id === source) ?? SOURCES[0]);
	let savedCount = $derived(Object.values(saveState).filter(s => s === 'saved' || s === 'duplicate').length);

	// ── Saved state ────────────────────────────────────────
	let savedListings = $state<SavedListing[]>([]);
	let savedSearch = $state('');
	let activeTab = $state<'search' | 'saved' | 'partners'>('search');
	let toast = $state('');

	// ── Partners state ─────────────────────────────────────
	let partners = $state<Partner[]>([]);
	let partnersLoaded = $state(false);

	// ── Load saved on mount ────────────────────────────────
	async function loadSaved() {
		const params = new URLSearchParams({ search: savedSearch });
		const r = await fetch(`/api/listings?${params}`);
		const d = await r.json();
		savedListings = d.listings;
	}

	// ── Scrape ────────────────────────────────────────────
	async function scrape() {
		scraping = true; scrapeResults = []; scrapeError = ''; saveState = {};
		const params = new URLSearchParams({ source, payment, property_type: propertyType, sort_by: sortBy, pages: String(pages) });
		const r = await fetch(`/api/scrape?${params}`);
		const d = await r.json();
		scrapeResults = d.listings;
		if (d.error) scrapeError = d.error;
		scraping = false;
	}

	// ── Save listing ──────────────────────────────────────
	async function save(listing: Listing): Promise<boolean> {
		saveState = { ...saveState, [listing.url]: 'saving' };
		const r = await fetch('/api/listings', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ ...listing, source })
		});
		const d = await r.json();
		if (d.ok) {
			saveState = { ...saveState, [listing.url]: 'saved' };
			loadSaved();
			return true;
		} else {
			const isDupe = (d.error ?? '').toLowerCase().includes('already');
			saveState = { ...saveState, [listing.url]: isDupe ? 'duplicate' : 'saving' };
			if (!isDupe) {
				saveState = { ...saveState };
				delete saveState[listing.url];
			}
			return false;
		}
	}

	// ── Save all ──────────────────────────────────────────
	async function saveAll() {
		savingAll = true;
		const unsaved = scrapeResults.filter(l => !saveState[l.url]);
		let count = 0;
		for (const listing of unsaved) {
			const ok = await save(listing);
			if (ok) count++;
			await new Promise(r => setTimeout(r, 150)); // small delay to avoid hammering
		}
		savingAll = false;
		showToast(`${count} listing${count !== 1 ? 's' : ''} saved`);
	}

	// ── Delete listing ────────────────────────────────────
	async function remove(id: number) {
		await fetch(`/api/listings/${id}`, { method: 'DELETE' });
		savedListings = savedListings.filter(l => l.id !== id);
		showToast('Removed');
	}

	// ── Update notes ──────────────────────────────────────
	async function updateNotes(id: number, notes: string) {
		await fetch(`/api/listings/${id}`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ notes })
		});
	}

	function showToast(msg: string) {
		toast = msg;
		setTimeout(() => (toast = ''), 3000);
	}

	// ── Partners ───────────────────────────────────────────
	async function loadPartners() {
		const r = await fetch('/api/partners');
		const d = await r.json();
		partners = d.partners;
		partnersLoaded = true;
	}

	async function setPartnerStatus(id: number, status: string) {
		await fetch(`/api/partners/${id}`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ status })
		});
		partners = partners.map(p => p.id === id ? { ...p, status: status as Partner['status'] } : p);
	}

	async function updatePartnerNotes(id: number, notes: string) {
		await fetch(`/api/partners/${id}`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ notes })
		});
	}

	async function removePartner(id: number) {
		await fetch(`/api/partners/${id}`, { method: 'DELETE' });
		partners = partners.filter(p => p.id !== id);
		showToast('Partner removed');
	}

	// Load saved on initial render
	$effect(() => {
		loadSaved();
	});
</script>

<svelte:head>
	<title>Property Dashboard — Safeer Properties</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 pt-24 pb-16">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

		<!-- Header -->
		<div class="mb-8 flex items-center justify-between">
			<div>
				<h1 class="text-3xl font-bold text-gray-900" style="font-family:'Playfair Display',serif">Property Dashboard</h1>
				<p class="text-gray-500 text-sm mt-1">Scrape Mauritius property portals and manage saved listings</p>
			</div>
			<div class="flex gap-3">
				<a href="/api/export/json" class="btn-outline text-sm px-4 py-2">Export JSON</a>
				<a href="/api/export/csv" class="btn-outline text-sm px-4 py-2">Export CSV</a>
			</div>
		</div>

		<!-- Tabs -->
		<div class="flex gap-1 mb-6 border-b border-gray-200">
			<button
				onclick={() => (activeTab = 'search')}
				class="px-5 py-3 text-sm font-medium border-b-2 transition-colors"
				class:border-[#0077b6]={activeTab === 'search'}
				class:text-[#0077b6]={activeTab === 'search'}
				class:border-transparent={activeTab !== 'search'}
				class:text-gray-500={activeTab !== 'search'}
			>Search &amp; Scrape</button>
			<button
				onclick={() => { activeTab = 'saved'; loadSaved(); }}
				class="px-5 py-3 text-sm font-medium border-b-2 transition-colors"
				class:border-[#0077b6]={activeTab === 'saved'}
				class:text-[#0077b6]={activeTab === 'saved'}
				class:border-transparent={activeTab !== 'saved'}
				class:text-gray-500={activeTab !== 'saved'}
			>Saved ({savedListings.length})</button>
		<button
			onclick={() => { activeTab = 'partners'; if (!partnersLoaded) loadPartners(); }}
			class="px-5 py-3 text-sm font-medium border-b-2 transition-colors"
			class:border-[#0077b6]={activeTab === 'partners'}
			class:text-[#0077b6]={activeTab === 'partners'}
			class:border-transparent={activeTab !== 'partners'}
			class:text-gray-500={activeTab !== 'partners'}
		>Partners {#if partnersLoaded}({partners.length}){/if}</button>
		</div>

		<!-- ── SEARCH TAB ── -->
		{#if activeTab === 'search'}
			<!-- Filter bar -->
			<div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
				<div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
					<div>
						<label class="form-label">Source</label>
						<select bind:value={source} class="form-input text-sm py-2">
							{#each SOURCES as s}
								<option value={s.id}>{s.name}</option>
							{/each}
						</select>
					</div>
					<div>
						<label class="form-label">Transaction</label>
						<select bind:value={payment} class="form-input text-sm py-2">
							{#each currentSource.payments as p}
								<option value={p}>{p === 'buy' ? 'For Sale' : p === 'rent' ? 'For Rent' : 'Holiday'}</option>
							{/each}
						</select>
					</div>
					{#if currentSource.propertyTypes[0] !== 'any'}
						<div>
							<label class="form-label">Property Type</label>
							<select bind:value={propertyType} class="form-input text-sm py-2">
								{#each currentSource.propertyTypes as t}
									<option value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
								{/each}
							</select>
						</div>
					{/if}
					{#if currentSource.sortable}
						<div>
							<label class="form-label">Sort By</label>
							<select bind:value={sortBy} class="form-input text-sm py-2">
								<option value="most_recent">Most Recent</option>
								<option value="least_expensive">Cheapest</option>
								<option value="most_expensive">Most Expensive</option>
							</select>
						</div>
					{/if}
					<div>
						<label class="form-label">Pages</label>
						<input type="number" bind:value={pages} min="1" max="5" class="form-input text-sm py-2" />
					</div>
					<div class="flex items-end">
						<button onclick={scrape} disabled={scraping} class="btn-primary w-full py-2 text-sm disabled:opacity-60">
							{scraping ? 'Scraping...' : 'Scrape Listings'}
						</button>
					</div>
				</div>
			</div>

			{#if scrapeError}
				<div class="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-6">{scrapeError}</div>
			{/if}

			{#if scraping}
				<div class="text-center py-20 text-gray-400">
					<div class="animate-spin w-8 h-8 border-2 border-[#0077b6] border-t-transparent rounded-full mx-auto mb-4"></div>
					Fetching listings from {currentSource.name}...
				</div>
			{:else if scrapeResults.length === 0 && !scrapeError}
				<div class="text-center py-20 text-gray-400">
					<p class="text-lg font-medium">No results yet</p>
					<p class="text-sm mt-1">Set your filters and click Scrape Listings</p>
				</div>
			{:else}
				<div class="flex items-center justify-between mb-4">
					<p class="text-sm text-gray-500">
						{scrapeResults.length} listing{scrapeResults.length !== 1 ? 's' : ''} found
						{#if savedCount > 0}
							<span class="ml-2 text-[#2d6a4f] font-medium">· {savedCount} saved</span>
						{/if}
					</p>
					<button
						onclick={saveAll}
						disabled={savingAll || scrapeResults.every(l => saveState[l.url])}
						class="text-sm px-4 py-2 rounded-lg bg-[#2d6a4f] text-white font-medium hover:bg-[#245a40] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
					>
						{#if savingAll}
							<span class="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
							Saving…
						{:else}
							Save All
						{/if}
					</button>
				</div>
				<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
					{#each scrapeResults as listing}
						{@const state = saveState[listing.url]}
						<div class="bg-white rounded-2xl overflow-hidden shadow-sm border transition-all duration-200 flex flex-col
							{state === 'saved' ? 'border-[#2d6a4f] ring-1 ring-[#2d6a4f]/30' : state === 'duplicate' ? 'border-gray-300 opacity-70' : 'border-gray-100'}">
							<div class="relative h-44 bg-gray-100">
								{#if listing.image}
									<img src={listing.image} alt={listing.title} class="w-full h-full object-cover" loading="lazy" />
								{:else}
									<div class="w-full h-full flex items-center justify-center text-gray-300 text-xs">No image</div>
								{/if}
								<span class="absolute top-2 left-2 text-xs font-semibold px-2 py-1 rounded-full {listing.payment === 'rent' ? 'bg-[#2d6a4f] text-white' : 'bg-[#0077b6] text-white'}">
									{listing.payment === 'rent' ? 'Rent' : 'Sale'}
								</span>
								{#if state === 'saved'}
									<span class="absolute top-2 right-2 w-7 h-7 bg-[#2d6a4f] text-white rounded-full flex items-center justify-center text-sm shadow">✓</span>
								{:else if state === 'duplicate'}
									<span class="absolute top-2 right-2 text-xs bg-gray-600 text-white px-2 py-0.5 rounded-full">Saved</span>
								{/if}
							</div>
							<div class="p-4 flex flex-col flex-1">
								<h3 class="font-semibold text-gray-900 text-sm leading-snug mb-1 line-clamp-2">{listing.title}</h3>
								<p class="text-gray-500 text-xs mb-2">{listing.location}</p>
								{#if listing.features.length}
									<div class="flex flex-wrap gap-1 mb-2">
										{#each listing.features.slice(0, 3) as f}
											<span class="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{f}</span>
										{/each}
									</div>
								{/if}
								<p class="font-bold text-[#0077b6] mt-auto mb-3">{listing.price}</p>
								<div class="flex gap-2">
									<a href={listing.url} target="_blank" rel="noopener noreferrer" class="flex-1 text-center text-xs py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">View</a>
									<button
										onclick={() => save(listing)}
										disabled={!!state}
										class="flex-1 text-xs py-2 rounded-lg transition-colors flex items-center justify-center gap-1 disabled:cursor-not-allowed
											{state === 'saved' ? 'bg-[#2d6a4f] text-white' : state === 'duplicate' ? 'bg-gray-200 text-gray-500' : state === 'saving' ? 'bg-[#0077b6]/60 text-white' : 'bg-[#0077b6] text-white hover:bg-[#005f8a]'}"
									>
										{#if state === 'saving'}
											<span class="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
										{:else if state === 'saved'}
											✓ Saved
										{:else if state === 'duplicate'}
											Already saved
										{:else}
											Save
										{/if}
									</button>
								</div>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		{/if}

		<!-- ── SAVED TAB ── -->
		{#if activeTab === 'saved'}
			<div class="flex gap-3 mb-6">
				<input
					type="search"
					bind:value={savedSearch}
					oninput={loadSaved}
					placeholder="Search saved listings..."
					class="form-input max-w-xs text-sm py-2"
				/>
			</div>

			{#if savedListings.length === 0}
				<div class="text-center py-20 text-gray-400">
					<p class="text-lg font-medium">No saved listings</p>
					<p class="text-sm mt-1">Save listings from the Search tab</p>
				</div>
			{:else}
				<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
					{#each savedListings as listing}
						<div class="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col">
							<div class="relative h-44 bg-gray-100">
								{#if listing.image}
									<img src={listing.image} alt={listing.title} class="w-full h-full object-cover" loading="lazy" />
								{:else}
									<div class="w-full h-full flex items-center justify-center text-gray-300 text-xs">No image</div>
								{/if}
								<span class="absolute top-2 left-2 text-xs font-semibold px-2 py-1 rounded-full {listing.payment === 'rent' ? 'bg-[#2d6a4f] text-white' : 'bg-[#0077b6] text-white'}">
									{listing.payment === 'rent' ? 'Rent' : 'Sale'}
								</span>
								<button onclick={() => remove(listing.id)} class="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 transition-colors flex items-center justify-center">✕</button>
							</div>
							<div class="p-4 flex flex-col flex-1">
								<h3 class="font-semibold text-gray-900 text-sm leading-snug mb-1 line-clamp-2">{listing.title}</h3>
								<p class="text-gray-500 text-xs mb-2">{listing.location}</p>
								{#if listing.features?.length}
									<div class="flex flex-wrap gap-1 mb-2">
										{#each listing.features.slice(0, 3) as f}
											<span class="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{f}</span>
										{/each}
									</div>
								{/if}
								<p class="font-bold text-[#0077b6] mb-2">{listing.price}</p>
								{#if listing.source && listing.source !== "lexpress"}
									<span class="text-xs text-gray-400 mb-2 block">{SOURCES.find(s => s.id === listing.source)?.name ?? listing.source}</span>
								{/if}
								<textarea
									class="form-input text-xs resize-none mb-2 py-2"
									rows="2"
									placeholder="Notes..."
									value={listing.notes}
									oninput={(e) => updateNotes(listing.id, (e.target as HTMLTextAreaElement).value)}
								></textarea>
								<div class="flex gap-2">
									<a href={listing.url} target="_blank" rel="noopener noreferrer" class="flex-1 text-center text-xs py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">View listing</a>
								</div>
								<p class="text-gray-400 text-xs mt-2">Saved {new Date(listing.saved_at).toLocaleDateString()}</p>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		{/if}

		<!-- ── PARTNERS TAB ── -->
		{#if activeTab === 'partners'}
			{#if !partnersLoaded}
				<div class="text-center py-20 text-gray-400">
					<div class="animate-spin w-8 h-8 border-2 border-[#0077b6] border-t-transparent rounded-full mx-auto mb-4"></div>
					Loading partners…
				</div>
			{:else if partners.length === 0}
				<div class="text-center py-20 text-gray-400">
					<p class="text-lg font-medium">No partner applications yet</p>
					<p class="text-sm mt-1">Applications submitted via <a href="/partners" class="text-[#0077b6] hover:underline">/partners</a> will appear here</p>
				</div>
			{:else}
				<!-- Summary counts -->
				<div class="flex gap-4 mb-6">
					{#each [
						{ label: 'Pending', status: 'pending', color: 'text-amber-600 bg-amber-50 border-amber-200' },
						{ label: 'Active', status: 'active', color: 'text-[#2d6a4f] bg-green-50 border-green-200' },
						{ label: 'Rejected', status: 'rejected', color: 'text-red-600 bg-red-50 border-red-200' },
					] as badge}
						{@const count = partners.filter(p => p.status === badge.status).length}
						<div class="px-4 py-2 rounded-lg border text-sm font-semibold {badge.color}">
							{badge.label}: {count}
						</div>
					{/each}
				</div>

				<div class="space-y-4">
					{#each partners as partner}
						<div class="bg-white rounded-2xl border shadow-sm overflow-hidden
							{partner.status === 'active' ? 'border-[#2d6a4f]/40' : partner.status === 'rejected' ? 'border-red-200 opacity-75' : 'border-gray-100'}">
							<div class="p-5 flex flex-col sm:flex-row sm:items-start gap-4">

								<!-- Info -->
								<div class="flex-1 min-w-0">
									<div class="flex items-center gap-2 flex-wrap mb-1">
										<h3 class="font-semibold text-gray-900">{partner.company}</h3>
										<span class="text-xs px-2 py-0.5 rounded-full font-medium
											{partner.status === 'active' ? 'bg-[#2d6a4f] text-white' : partner.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}">
											{partner.status}
										</span>
										{#if partner.partner_type}
											<span class="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
												{partner.partner_type === 'developer' ? 'Developer' : partner.partner_type === 'agency' ? 'Agency' : partner.partner_type === 'agent' ? 'Agent' : partner.partner_type}
											</span>
										{/if}
										{#if partner.agreed_terms}
											<span class="text-xs text-[#2d6a4f] font-medium">✓ Terms agreed</span>
										{/if}
									</div>
									<p class="text-sm text-gray-600 mb-0.5">{partner.name} · <a href="mailto:{partner.email}" class="text-[#0077b6] hover:underline">{partner.email}</a>{partner.phone ? ` · ${partner.phone}` : ''}</p>
									{#if partner.message}
										<p class="text-sm text-gray-500 mt-2 leading-relaxed">{partner.message}</p>
									{/if}
									<p class="text-xs text-gray-400 mt-2">{new Date(partner.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
								</div>

								<!-- Actions -->
								<div class="flex flex-col gap-2 sm:items-end shrink-0">
									<div class="flex gap-2">
										<button
											onclick={() => setPartnerStatus(partner.id, 'active')}
											disabled={partner.status === 'active'}
											class="text-xs px-3 py-1.5 rounded-lg font-medium transition-colors
												{partner.status === 'active' ? 'bg-[#2d6a4f] text-white cursor-default' : 'bg-[#2d6a4f]/10 text-[#2d6a4f] hover:bg-[#2d6a4f]/20'}">
											Activate
										</button>
										<button
											onclick={() => setPartnerStatus(partner.id, 'pending')}
											disabled={partner.status === 'pending'}
											class="text-xs px-3 py-1.5 rounded-lg font-medium transition-colors
												{partner.status === 'pending' ? 'bg-amber-500 text-white cursor-default' : 'bg-amber-50 text-amber-700 hover:bg-amber-100'}">
											Pending
										</button>
										<button
											onclick={() => setPartnerStatus(partner.id, 'rejected')}
											disabled={partner.status === 'rejected'}
											class="text-xs px-3 py-1.5 rounded-lg font-medium transition-colors
												{partner.status === 'rejected' ? 'bg-red-500 text-white cursor-default' : 'bg-red-50 text-red-600 hover:bg-red-100'}">
											Reject
										</button>
									</div>
									<div class="flex gap-2">
										<a href="mailto:{partner.email}" class="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">Email</a>
										{#if partner.phone}
											<a href="https://wa.me/{partner.phone.replace(/\D/g,'')}" target="_blank" rel="noopener noreferrer" class="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">WhatsApp</a>
										{/if}
										<button onclick={() => removePartner(partner.id)} class="text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors">Delete</button>
									</div>
								</div>
							</div>

							<!-- Notes -->
							<div class="px-5 pb-4 border-t border-gray-50 pt-3">
								<textarea
									class="form-input text-xs resize-none py-2 w-full"
									rows="2"
									placeholder="Internal notes about this partner…"
									value={partner.notes}
									oninput={(e) => updatePartnerNotes(partner.id, (e.target as HTMLTextAreaElement).value)}
								></textarea>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		{/if}

	</div>
</div>

<!-- Toast -->
{#if toast}
	<div class="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#2d6a4f] text-white px-6 py-3 rounded-xl shadow-lg text-sm font-medium z-50">
		{toast}
	</div>
{/if}
