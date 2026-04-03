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

	async function remove(id: number) {
		if (!confirm('Delete this partner?')) return;
		await fetch(`/api/partners/${id}`, { method: 'DELETE' });
		partners = partners.filter(p => p.id !== id);
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
	let newPartner = $state({ name: '', company: '', email: '', phone: '', partner_type: '', message: '' });

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
			// Reload list
			const res = await fetch('/api/partners');
			const data = await res.json();
			partners = data.partners;
			newPartner = { name: '', company: '', email: '', phone: '', partner_type: '', message: '' };
			showAddForm = false;
			showToast('Partner added');
		}
		adding = false;
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
			<p class="text-gray-500 text-sm mt-1">Manage property developer and agency partner applications</p>
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
		<!-- Partner list -->
		<div class="space-y-3">
			{#each partners as partner (partner.id)}
				<div class="bg-white rounded-2xl border shadow-sm overflow-hidden transition-all
					{partner.status === 'active' ? 'border-[#2d6a4f]/40' : partner.status === 'rejected' ? 'border-gray-200 opacity-70' : 'border-gray-100'}">

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

							<p class="text-xs text-gray-400">
								Applied {new Date(partner.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
								at {new Date(partner.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
							</p>
						</div>

						<!-- Actions -->
						<div class="flex flex-col gap-2 shrink-0 sm:items-end">
							<!-- Status buttons -->
							<div class="flex gap-1.5 flex-wrap sm:justify-end">
								<button
									onclick={() => setStatus(partner.id, 'active')}
									disabled={partner.status === 'active'}
									class="text-xs px-3 py-1.5 rounded-lg font-medium transition-colors
										{partner.status === 'active' ? 'bg-[#2d6a4f] text-white cursor-default' : 'bg-[#2d6a4f]/10 text-[#2d6a4f] hover:bg-[#2d6a4f]/20'}">
									✓ Activate
								</button>
								<button
									onclick={() => setStatus(partner.id, 'pending')}
									disabled={partner.status === 'pending'}
									class="text-xs px-3 py-1.5 rounded-lg font-medium transition-colors
										{partner.status === 'pending' ? 'bg-amber-500 text-white cursor-default' : 'bg-amber-50 text-amber-700 hover:bg-amber-100'}">
									Pending
								</button>
								<button
									onclick={() => setStatus(partner.id, 'rejected')}
									disabled={partner.status === 'rejected'}
									class="text-xs px-3 py-1.5 rounded-lg font-medium transition-colors
										{partner.status === 'rejected' ? 'bg-red-500 text-white cursor-default' : 'bg-red-50 text-red-600 hover:bg-red-100'}">
									Reject
								</button>
							</div>

							<!-- Contact + delete -->
							<div class="flex gap-1.5 flex-wrap sm:justify-end">
								<a href="mailto:{partner.email}" class="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">Email</a>
								{#if partner.phone}
									<a href="https://wa.me/{partner.phone.replace(/\D/g, '')}" target="_blank" rel="noopener noreferrer" class="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">WhatsApp</a>
								{/if}
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
