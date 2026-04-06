<script lang="ts">
  import type { PageData } from './$types';
  import type { Lead } from '$lib/server/db';

  let { data }: { data: PageData } = $props();
  let leads = $state<(Lead & { listing_title?: string; partner_company?: string })[]>(data.leads);
  let filter = $state<'all' | 'unread' | 'general' | 'listing' | 'partner'>('all');
  let toast = $state('');

  const filtered = $derived(
    filter === 'all' ? leads
    : filter === 'unread' ? leads.filter(l => !l.read)
    : leads.filter(l => l.source === filter)
  );

  const unreadCount = $derived(leads.filter(l => !l.read).length);

  function showToast(msg: string) { toast = msg; setTimeout(() => (toast = ''), 3000); }

  async function markRead(id: number) {
    await fetch(`/api/leads/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ read: true }) });
    leads = leads.map(l => l.id === id ? { ...l, read: true } : l);
    showToast('Marked as read');
  }

  async function markAllRead() {
    const unread = leads.filter(l => !l.read);
    await Promise.all(unread.map(l => fetch(`/api/leads/${l.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ read: true }) })));
    leads = leads.map(l => ({ ...l, read: true }));
    showToast('All leads marked as read');
  }

  function fmtDate(d: string) {
    return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  }
</script>

<svelte:head><title>Leads — Safeer Admin</title></svelte:head>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

  <div class="mb-8 flex items-center justify-between flex-wrap gap-4">
    <div>
      <h1 class="text-3xl font-bold text-gray-900" style="font-family:'Playfair Display',serif">Leads</h1>
      <p class="text-gray-500 text-sm mt-1">{leads.length} total · {unreadCount} unread</p>
    </div>
    {#if unreadCount > 0}
      <button onclick={markAllRead} class="btn-outline text-sm px-4 py-2">Mark all as read</button>
    {/if}
  </div>

  <!-- Filter tabs -->
  <div class="flex gap-1 mb-6 border-b border-gray-200 overflow-x-auto">
    {#each [
      { key: 'all', label: `All (${leads.length})` },
      { key: 'unread', label: `Unread (${unreadCount})` },
      { key: 'general', label: 'General' },
      { key: 'listing', label: 'Listing enquiries' },
      { key: 'partner', label: 'Partner enquiries' },
    ] as tab}
      <button
        onclick={() => (filter = tab.key as typeof filter)}
        class="px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors"
        class:border-[#0077b6]={filter === tab.key}
        class:text-[#0077b6]={filter === tab.key}
        class:border-transparent={filter !== tab.key}
        class:text-gray-500={filter !== tab.key}
      >{tab.label}</button>
    {/each}
  </div>

  {#if filtered.length === 0}
    <div class="text-center py-20 text-gray-400 bg-white rounded-2xl border border-gray-100">
      <svg class="w-10 h-10 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
      <p class="text-sm font-medium">No leads</p>
    </div>
  {:else}
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div class="divide-y divide-gray-50">
        {#each filtered as lead}
          <div class="px-6 py-5 flex items-start gap-4 {lead.read ? '' : 'bg-blue-50/30'}">
            <div class="w-10 h-10 rounded-full bg-[#0077b6]/10 flex items-center justify-center text-[#0077b6] font-bold shrink-0">
              {lead.name ? lead.name[0].toUpperCase() : lead.email[0].toUpperCase()}
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex flex-wrap items-center gap-2 mb-1">
                <span class="font-semibold text-sm text-gray-900">{lead.name || '(no name)'}</span>
                <a href="mailto:{lead.email}" class="text-sm text-[#0077b6] hover:underline">{lead.email}</a>
                {#if lead.phone}<span class="text-sm text-gray-500">{lead.phone}</span>{/if}
                <span class="text-xs px-2 py-0.5 rounded-full font-medium {lead.source === 'listing' ? 'bg-blue-100 text-blue-700' : lead.source === 'partner' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}">{lead.source}</span>
                {#if !lead.read}<span class="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-semibold">New</span>{/if}
              </div>
              {#if lead.message}
                <p class="text-sm text-gray-600 mt-1 leading-relaxed">{lead.message}</p>
              {/if}
              {#if lead.listing_title}
                <p class="text-xs text-gray-400 mt-1">Re listing: <span class="text-gray-600">{lead.listing_title}</span></p>
              {/if}
              {#if lead.partner_company}
                <p class="text-xs text-gray-400 mt-1">Partner: <span class="text-gray-600">{lead.partner_company}</span></p>
              {/if}
            </div>
            <div class="shrink-0 text-right flex flex-col items-end gap-2">
              <p class="text-xs text-gray-400">{fmtDate(lead.created_at)}</p>
              <a href="mailto:{lead.email}?subject=Re your enquiry on Safeer Properties" class="text-xs px-3 py-1.5 rounded-lg bg-[#0077b6]/10 text-[#0077b6] hover:bg-[#0077b6]/20 transition-colors font-medium">Reply</a>
              {#if !lead.read}
                <button onclick={() => markRead(lead.id)} class="text-xs px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">Mark read</button>
              {/if}
            </div>
          </div>
        {/each}
      </div>
    </div>
  {/if}

</div>

{#if toast}
  <div class="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#2d6a4f] text-white px-6 py-3 rounded-xl shadow-lg text-sm font-medium z-50">{toast}</div>
{/if}
