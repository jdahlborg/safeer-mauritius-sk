<script lang="ts">
	import type { PageData } from './$types';
	import type { Partner } from '$lib/server/db';

	let { data }: { data: PageData } = $props();

	let partners = $state<Partner[]>(data.partners);
	let toast = $state('');

	function showToast(msg: string) {
		toast = msg;
		setTimeout(() => (toast = ''), 3000);
	}

	async function setStatus(id: number, status: string) {
		await fetch(`/api/partners/${id}`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ status })
		});
		partners = partners.map(p => p.id === id ? { ...p, status: status as Partner['status'] } : p);
		showToast(`Marked as ${status}`);
	}

	async function updateNotes(id: number, notes: string) {
		await fetch(`/api/partners/${id}`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ notes })
		});
	}

	async function saveWebsite(id: number, website: string) {
		await fetch(`/api/partners/${id}`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ website })
		});
		partners = partners.map(p => p.id === id ? { ...p, website } : p);
		showToast('Website saved');
	}

	async function remove(id: number) {
		if (!confirm('Delete this partner?')) return;
		await fetch(`/api/partners/${id}`, { method: 'DELETE' });
		partners = partners.filter(p => p.id !== id);
		// Close scrape panel if open
		if (scrapePanel === id) scrapePanel = null;
		showToast('Partner deleted');
	}

	const pending  = $derived(partners.filter(p => p.status === 'pending'));
	const active   = $derived(partners.filter(p => p.status === 'active'));
	const rejected = $derived(partners.filter(p => p.status === 'rejected'));

	const TYPE_LABELS: Record<string, string> = {
		developer: 'Developer', agency: 'Agency', agent: 'Agent', other: 'Other'
	};

	// ── Add partner form ───────────────────────────────────
	let showAddForm = $state(false);
	let adding = $state(false);
	let newPartner = $state({ name: '', company: '', email: '', phone: '', partner_type: '', message: '', website: '' });

	async function addPartner() {
		if (!newPartner.name || !newPartner.company || !newPartner.email) return;
		adding = true;
		const r = await fetch('/api/partners', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(newPartner)
		});
		const d = await r.json();
		if (d.ok) {
			const res = await fetch('/api/partners');
			const fresh = await res.json();
			partners = fresh.partners;
			newPartner = { name: '', company: '', email: '', phone: '', partner_type: '', message: '', website: '' };
			showAddForm = false;
			showToast('Partner added');
		}
		adding = false;
	}

	// ── Scraping ───────────────────────────────────────────
	type ScrapeState = 'idle' | 'scraping' | 'done' | 'error';
	type SaveState = 'saving' | 'saved' | 'duplicate';

	let scrapePanel = $state<number | null>(null);
	let scrapePages = $state<Record<number, number>>({});
	let scrapeStatus = $state<Record<number, ScrapeState>>({});
	let scrapeResults = $state<Record<number, any[]>>({});
	let scrapeErrors = $state<Record<number, string>>({});
	let saveStates = $state<Record<string, SaveState>>({});
	let savingAll = $state<Record<number, boolean>>({});

	function togglePanel(id: number) {
		scrapePanel = scrapePanel === id ? null : id;
		if (!scrapePages[id]) scrapePages[id] = 2;
	}

	async function scrape(partner: Partner) {
		const id = partner.id;
		scrapeStatus = { ...scrapeStatus, [id]: 'scraping' };
		scrapeResults = { ...scrapeResults, [id]: [] };
		scrapeErrors = { ...scrapeErrors, [id]: '' };
		saveStates = {};

		const pages = scrapePages[id] ?? 2;
		const r = await fetch(`/api/scrape/partner?partner_id=${id}&pages=${pages}`);
		const d = await r.json();

		if (d.error && !d.listings?.length) {
			scrapeStatus = { ...scrapeStatus, [id]: 'error' };
			scrapeErrors = { ...scrapeErrors, [id]: d.error };
		} else {
			scrapeStatus = { ...scrapeStatus, [id]: 'done' };
			scrapeResults = { ...scrapeResults, [id]: d.listings ?? [] };
			if (d.error) scrapeErrors = { ...scrapeErrors, [id]: d.error };
		}
	}

	async function saveListing(listing: any, sourceId: string) {
		const key = listing.url;
		saveStates = { ...saveStates, [key]: 'saving' };
		const r = await fetch('/api/listings', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ ...listing, source: sourceId })
		});
		const d = await r.json();
		const isDupe = (d.error ?? '').toLowerCase().includes('already');
		saveStates = { ...saveStates, [key]: d.ok ? 'saved' : isDupe ? 'duplicate' : 'saving' };
		return d.ok;
	}

	async function saveAll(partner: Partner) {
		const id = partner.id;
		const sourceId = `partner_${partner.company.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
		savingAll = { ...savingAll, [id]: true };
		const listings = (scrapeResults[id] ?? []).filter(l => !saveStates[l.url]);
		let count = 0;
		for (const l of listings) {
			const ok = await saveListing(l, sourceId);
			if (ok) count++;
			await new Promise(r => setTimeout(r, 150));
		}
		savingAll = { ...savingAll, [id]: false };
		showToast(`${count} listing${count !== 1 ? 's' : ''} saved`);
	}
</script>

<svelte:head>
	<title>Partners — Safeer Admin</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

	<!-- Header -->
	<div class="mb-8 flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold text-gray-900" style="font-family:'Playfair Display',serif">Partners</h1>
			<p class="text-gray-500 text-sm mt-1">Manage partner applications and scrape their listings</p>
		</div>
		<div class="flex gap-3">
			<a href="/partners" target="_blank" rel="noopener noreferrer" class="btn-outline text-sm px-4 py-2">View partner page ↗</a>
			<button onclick={() => (showAddForm = !showAddForm)} class="btn-primary text-sm px-4 py-2">
				{showAddForm ? 'Cancel' : '+ Add Partner'}
			</button>
		</div>
	</div>

	<!-- Add partner form -->
	{#if showAddForm}
		<div class="bg-white rounded-2xl border border-[#0077b6]/30 shadow-sm p-6 mb-8">
			<h2 class="font-bold text-gray-900 mb-5">Add Partner Manually</h2>
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
				<div>
					<label for="np-name" class="form-label">Name *</label>
					<input id="np-name" type="text" bind:value={newPartner.name} class="form-input text-sm py-2" placeholder="Jean Dupont" />
				</div>
				<div>
					<label for="np-company" class="form-label">Company *</label>
					<input id="np-company" type="text" bind:value={newPartner.company} class="form-input text-sm py-2" placeholder="Ally's Real Estate" />
				</div>
				<div>
					<label for="np-email" class="form-label">Email *</label>
					<input id="np-email" type="email" bind:value={newPartner.email} class="form-input text-sm py-2" placeholder="jean@agency.mu" />
				</div>
				<div>
					<label for="np-phone" class="form-label">Phone / WhatsApp</label>
					<input id="np-phone" type="tel" bind:value={newPartner.phone} class="form-input text-sm py-2" placeholder="+230 5700 0000" />
				</div>
				<div>
					<label for="np-type" class="form-label">Partner Type</label>
					<select id="np-type" bind:value={newPartner.partner_type} class="form-input text-sm py-2">
						<option value="">— select —</option>
						<option value="developer">Developer</option>
						<option value="agency">Agency</option>
						<option value="agent">Agent</option>
						<option value="other">Other</option>
					</select>
				</div>
				<div>
					<label for="np-website" class="form-label">Listings Website URL</label>
					<input id="np-website" type="url" bind:value={newPartner.website} class="form-input text-sm py-2" placeholder="https://agency.mu/properties" />
				</div>
			</div>
			<div class="mb-4">
				<label for="np-message" class="form-label">Notes / Portfolio</label>
				<textarea id="np-message" bind:value={newPartner.message} rows="2" class="form-input text-sm resize-none" placeholder="Number of listings, property types, areas covered…"></textarea>
			</div>
			<button
				onclick={addPartner}
				disabled={adding || !newPartner.name || !newPartner.company || !newPartner.email}
				class="btn-primary text-sm px-6 py-2 disabled:opacity-50"
			>
				{adding ? 'Adding…' : 'Add as Pending Partner'}
			</button>
		</div>
	{/if}

	<!-- Summary -->
	<div class="grid grid-cols-3 gap-4 mb-8">
		{#each [
			{ label: 'Pending review', count: pending.length, color: 'border-amber-300 bg-amber-50', text: 'text-amber-700' },
			{ label: 'Active partners', count: active.length, color: 'border-[#2d6a4f]/40 bg-green-50', text: 'text-[#2d6a4f]' },
			{ label: 'Rejected', count: rejected.length, color: 'border-red-200 bg-red-50', text: 'text-red-600' },
		] as stat}
			<div class="rounded-xl border-2 p-4 {stat.color}">
				<div class="text-3xl font-bold {stat.text}" style="font-family:'Playfair Display',serif">{stat.count}</div>
				<div class="text-sm {stat.text} opacity-80 mt-0.5">{stat.label}</div>
			</div>
		{/each}
	</div>

	{#if partners.length === 0}
		<div class="text-center py-20 text-gray-400 bg-white rounded-2xl border border-gray-100">
			<svg class="w-12 h-12 mx-auto mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
			<p class="text-lg font-medium">No partner applications yet</p>
			<p class="text-sm mt-1">Applications via <a href="/partners" class="text-[#0077b6] hover:underline">/partners</a> will appear here</p>
		</div>
	{:else}
		<div class="space-y-4">
			{#each partners as partner (partner.id)}
				{@const sourceId = `partner_${partner.company.toLowerCase().replace(/[^a-z0-9]/g, '_')}`}
				{@const results = scrapeResults[partner.id] ?? []}
				{@const status = scrapeStatus[partner.id]}
				{@const savedCount = Object.values(saveStates).filter(s => s === 'saved' || s === 'duplicate').length}

				<div class="bg-white rounded-2xl border shadow-sm overflow-hidden transition-all
					{partner.status === 'active' ? 'border-[#2d6a4f]/40' : partner.status === 'rejected' ? 'border-gray-200 opacity-75' : 'border-gray-100'}">

					<div class="p-5 flex flex-col sm:flex-row sm:items-start gap-5">
						<!-- Status stripe -->
						<div class="w-1 self-stretch rounded-full shrink-0 hidden sm:block
							{partner.status === 'active' ? 'bg-[#2d6a4f]' : partner.status === 'rejected' ? 'bg-red-300' : 'bg-amber-400'}"></div>

						<!-- Info block -->
						<div class="flex-1 min-w-0">
							<div class="flex flex-wrap items-center gap-2 mb-1">
								<h3 class="font-bold text-gray-900 text-base">{partner.company}</h3>
								<span class="text-xs px-2.5 py-0.5 rounded-full font-semibold
									{partner.status === 'active' ? 'bg-[#2d6a4f] text-white' : partner.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}">
									{partner.status}
								</span>
								{#if partner.partner_type}
									<span class="text-xs px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600">{TYPE_LABELS[partner.partner_type] ?? partner.partner_type}</span>
								{/if}
								{#if partner.agreed_terms}
									<span class="text-xs text-[#2d6a4f] font-medium">✓ Terms agreed</span>
								{/if}
							</div>

							<div class="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600 mb-3">
								<span>{partner.name}</span>
								<a href="mailto:{partner.email}" class="text-[#0077b6] hover:underline">{partner.email}</a>
								{#if partner.phone}<span>{partner.phone}</span>{/if}
							</div>

							{#if partner.message}
								<p class="text-sm text-gray-500 leading-relaxed mb-3 bg-gray-50 rounded-lg px-3 py-2">{partner.message}</p>
							{/if}

							<!-- Website field -->
							<div class="flex gap-2 items-center">
								<input
									type="url"
									value={partner.website ?? ''}
									onchange={(e) => saveWebsite(partner.id, (e.target as HTMLInputElement).value)}
									placeholder="https://agency.mu/properties  (listings page URL for scraping)"
									class="form-input text-xs py-1.5 flex-1 min-w-0"
								/>
								{#if partner.website}
									<a href={partner.website} target="_blank" rel="noopener noreferrer" class="text-xs text-[#0077b6] hover:underline shrink-0">↗</a>
								{/if}
							</div>

							<p class="text-xs text-gray-400 mt-2">
								Added {new Date(partner.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
							</p>
						</div>

						<!-- Actions -->
						<div class="flex flex-col gap-2 shrink-0 sm:items-end">
							<!-- Status buttons -->
							<div class="flex gap-1.5 flex-wrap sm:justify-end">
								<button onclick={() => setStatus(partner.id, 'active')} disabled={partner.status === 'active'}
									class="text-xs px-3 py-1.5 rounded-lg font-medium transition-colors
										{partner.status === 'active' ? 'bg-[#2d6a4f] text-white cursor-default' : 'bg-[#2d6a4f]/10 text-[#2d6a4f] hover:bg-[#2d6a4f]/20'}">
									✓ Activate
								</button>
								<button onclick={() => setStatus(partner.id, 'pending')} disabled={partner.status === 'pending'}
									class="text-xs px-3 py-1.5 rounded-lg font-medium transition-colors
										{partner.status === 'pending' ? 'bg-amber-500 text-white cursor-default' : 'bg-amber-50 text-amber-700 hover:bg-amber-100'}">
									Pending
								</button>
								<button onclick={() => setStatus(partner.id, 'rejected')} disabled={partner.status === 'rejected'}
									class="text-xs px-3 py-1.5 rounded-lg font-medium transition-colors
										{partner.status === 'rejected' ? 'bg-red-500 text-white cursor-default' : 'bg-red-50 text-red-600 hover:bg-red-100'}">
									Reject
								</button>
							</div>

							<!-- Contact + scrape + delete -->
							<div class="flex gap-1.5 flex-wrap sm:justify-end">
								<a href="mailto:{partner.email}" class="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">Email</a>
								{#if partner.phone}
									<a href="https://wa.me/{partner.phone.replace(/\D/g, '')}" target="_blank" rel="noopener noreferrer" class="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">WhatsApp</a>
								{/if}
								<button
									onclick={() => togglePanel(partner.id)}
									disabled={!partner.website}
									title={partner.website ? 'Scrape listings' : 'Add a website URL first'}
									class="text-xs px-3 py-1.5 rounded-lg font-medium transition-colors
										{scrapePanel === partner.id ? 'bg-[#0077b6] text-white' : 'bg-[#0077b6]/10 text-[#0077b6] hover:bg-[#0077b6]/20'}
										disabled:opacity-40 disabled:cursor-not-allowed">
									Scrape Listings
								</button>
								<button onclick={() => remove(partner.id)} class="text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors">Delete</button>
							</div>
						</div>
					</div>

					<!-- Internal notes -->
					<div class="px-5 pb-4 pt-0 border-t border-gray-50">
						<textarea
							class="form-input text-xs resize-none py-2 w-full mt-3"
							rows="2"
							placeholder="Internal notes (not visible to partner)…"
							value={partner.notes}
							oninput={(e) => updateNotes(partner.id, (e.target as HTMLTextAreaElement).value)}
						></textarea>
					</div>

					<!-- ── Scrape panel ── -->
					{#if scrapePanel === partner.id}
						<div class="border-t border-gray-100 bg-gray-50 p-5">
							<div class="flex items-center justify-between mb-4 flex-wrap gap-3">
								<div class="flex items-center gap-3">
									<span class="text-sm font-semibold text-gray-700">Scrape listings from {partner.company}</span>
									<span class="text-xs text-gray-400">{partner.website}</span>
								</div>
								<div class="flex items-center gap-3">
									<label for="pages-{partner.id}" class="text-xs text-gray-500">Pages:</label>
									<select
										id="pages-{partner.id}"
										bind:value={scrapePages[partner.id]}
										class="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white"
									>
										{#each [1,2,3,5] as n}<option value={n}>{n}</option>{/each}
									</select>
									<button
										onclick={() => scrape(partner)}
										disabled={status === 'scraping'}
										class="text-sm px-4 py-2 rounded-lg bg-[#0077b6] text-white font-medium hover:bg-[#005f8a] disabled:opacity-60 transition-colors flex items-center gap-2"
									>
										{#if status === 'scraping'}
											<span class="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
											Scraping…
										{:else}
											{status === 'done' ? 'Re-scrape' : 'Start Scrape'}
										{/if}
									</button>
								</div>
							</div>

							{#if scrapeErrors[partner.id]}
								<div class="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-4">{scrapeErrors[partner.id]}</div>
							{/if}

							{#if status === 'scraping'}
								<div class="text-center py-12 text-gray-400">
									<div class="animate-spin w-8 h-8 border-2 border-[#0077b6] border-t-transparent rounded-full mx-auto mb-3"></div>
									<p class="text-sm">Fetching and analysing listings with AI…</p>
									<p class="text-xs mt-1 text-gray-300">This may take 15–30 seconds per page</p>
								</div>
							{:else if status === 'done'}
								{#if results.length === 0}
									<p class="text-sm text-gray-500 text-center py-8">No listings found. Try a different URL or page count.</p>
								{:else}
									<div class="flex items-center justify-between mb-3">
										<p class="text-sm text-gray-500">
											{results.length} listing{results.length !== 1 ? 's' : ''} found
											{#if savedCount > 0}<span class="ml-2 text-[#2d6a4f] font-medium">· {savedCount} saved</span>{/if}
										</p>
										<button
											onclick={() => saveAll(partner)}
											disabled={savingAll[partner.id] || results.every(l => saveStates[l.url])}
											class="text-sm px-4 py-2 rounded-lg bg-[#2d6a4f] text-white font-medium hover:bg-[#245a40] disabled:opacity-40 transition-colors flex items-center gap-2"
										>
											{#if savingAll[partner.id]}
												<span class="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
												Saving…
											{:else}
												Save All
											{/if}
										</button>
									</div>

									<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
										{#each results as listing}
											{@const state = saveStates[listing.url]}
											<div class="bg-white rounded-xl overflow-hidden border transition-all
												{state === 'saved' ? 'border-[#2d6a4f] ring-1 ring-[#2d6a4f]/30' : state === 'duplicate' ? 'border-gray-200 opacity-60' : 'border-gray-100'}">
												<div class="relative h-36 bg-gray-100">
													{#if listing.image}
														<img src={listing.image} alt={listing.title} class="w-full h-full object-cover" loading="lazy" />
													{:else}
														<div class="w-full h-full flex items-center justify-center text-gray-300 text-xs">No image</div>
													{/if}
													<span class="absolute top-2 left-2 text-xs font-semibold px-2 py-0.5 rounded-full {listing.transaction_type === 'rent' ? 'bg-[#2d6a4f] text-white' : 'bg-[#0077b6] text-white'}">
														{listing.transaction_type === 'rent' ? 'Rent' : 'Sale'}
													</span>
													{#if state === 'saved'}
														<span class="absolute top-2 right-2 w-6 h-6 bg-[#2d6a4f] text-white rounded-full flex items-center justify-center text-xs shadow">✓</span>
													{:else if state === 'duplicate'}
														<span class="absolute top-2 right-2 text-xs bg-gray-600 text-white px-1.5 py-0.5 rounded-full">Saved</span>
													{/if}
												</div>
												<div class="p-3 flex flex-col gap-1.5">
													<h4 class="font-semibold text-gray-900 text-xs leading-snug line-clamp-2">{listing.title}</h4>
													<p class="text-gray-500 text-xs">{listing.location}</p>
													<p class="font-bold text-[#0077b6] text-sm">{listing.price}</p>
													<div class="flex gap-1.5 mt-1">
														<a href={listing.url} target="_blank" rel="noopener noreferrer" class="flex-1 text-center text-xs py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">View</a>
														<button
															onclick={() => saveListing(listing, sourceId)}
															disabled={!!state}
															class="flex-1 text-xs py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1 disabled:cursor-not-allowed
																{state === 'saved' ? 'bg-[#2d6a4f] text-white' : state === 'duplicate' ? 'bg-gray-200 text-gray-500' : state === 'saving' ? 'bg-[#0077b6]/60 text-white' : 'bg-[#0077b6] text-white hover:bg-[#005f8a]'}"
														>
															{#if state === 'saving'}
																<span class="w-2.5 h-2.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
															{:else if state === 'saved'}✓ Saved
															{:else if state === 'duplicate'}Saved
															{:else}Save{/if}
														</button>
													</div>
												</div>
											</div>
										{/each}
									</div>
								{/if}
							{:else}
								<p class="text-sm text-gray-400 text-center py-8">Click "Start Scrape" to fetch listings from this partner's website using AI.</p>
							{/if}
						</div>
					{/if}

				</div>
			{/each}
		</div>
	{/if}
</div>

{#if toast}
	<div class="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#2d6a4f] text-white px-6 py-3 rounded-xl shadow-lg text-sm font-medium z-50">
		{toast}
	</div>
{/if}
