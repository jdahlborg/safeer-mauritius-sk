<script lang="ts">
  import type { PageData } from './$types';
  let { data }: { data: PageData } = $props();

  let recentLeads = $state(data.recentLeads);
  let stats = $state(data.stats);
  let toast = $state('');

  function showToast(msg: string) {
    toast = msg;
    setTimeout(() => (toast = ''), 3000);
  }

  async function markRead(id: number) {
    await fetch(`/api/leads/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ read: true }) });
    recentLeads = recentLeads.map(l => l.id === id ? { ...l, read: true } : l);
    stats = { ...stats, unreadLeads: Math.max(0, stats.unreadLeads - 1) };
    showToast('Marked as read');
  }

  const statCards = $derived([
    { label: 'Total Listings', value: stats.totalListings, color: 'text-[#0077b6]', bg: 'bg-blue-50', border: 'border-blue-200' },
    { label: 'Active Listings', value: stats.activeListings, color: 'text-[#2d6a4f]', bg: 'bg-green-50', border: 'border-green-200' },
    { label: 'Sold / Rented', value: stats.soldListings, color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200' },
    { label: 'Active Partners', value: stats.activePartners, color: 'text-[#0077b6]', bg: 'bg-blue-50', border: 'border-blue-200' },
    { label: 'Pending Partners', value: stats.pendingPartners, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
    { label: 'Unread Leads', value: stats.unreadLeads, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
  ]);

  function fmtDate(d: string) {
    return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  }
</script>

<svelte:head>
  <title>Dashboard — Safeer Admin</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

  <!-- Header -->
  <div class="mb-8">
    <h1 class="text-3xl font-bold text-gray-900" style="font-family:'Playfair Display',serif">Dashboard</h1>
    <p class="text-gray-500 text-sm mt-1">Overview of listings, partners and leads</p>
  </div>

  <!-- Stats grid -->
  <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
    {#each statCards as card}
      <div class="rounded-2xl border-2 {card.bg} {card.border} p-4">
        <div class="text-3xl font-bold {card.color}" style="font-family:'Playfair Display',serif">{card.value}</div>
        <div class="text-xs {card.color} opacity-80 mt-1 leading-tight">{card.label}</div>
      </div>
    {/each}
  </div>

  <!-- Quick actions -->
  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
    <a href="/admin/listings" class="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:border-[#0077b6]/40 hover:shadow-md transition-all group">
      <div class="w-10 h-10 rounded-xl bg-[#0077b6]/10 flex items-center justify-center shrink-0">
        <svg class="w-5 h-5 text-[#0077b6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg>
      </div>
      <div class="min-w-0">
        <div class="font-semibold text-gray-900 text-sm">Listings</div>
        <div class="text-xs text-gray-500 mt-0.5">Scrape &amp; manage properties</div>
      </div>
      <svg class="w-4 h-4 text-gray-300 ml-auto group-hover:text-[#0077b6] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
    </a>
    <a href="/admin/partners" class="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:border-[#2d6a4f]/40 hover:shadow-md transition-all group">
      <div class="w-10 h-10 rounded-xl bg-[#2d6a4f]/10 flex items-center justify-center shrink-0">
        <svg class="w-5 h-5 text-[#2d6a4f]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
      </div>
      <div class="min-w-0">
        <div class="font-semibold text-gray-900 text-sm">Partners</div>
        <div class="text-xs text-gray-500 mt-0.5">Manage partner applications</div>
      </div>
      <svg class="w-4 h-4 text-gray-300 ml-auto group-hover:text-[#2d6a4f] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
    </a>
    <a href="/admin/leads" class="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:border-amber-400/50 hover:shadow-md transition-all group">
      <div class="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
        <svg class="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
      </div>
      <div class="min-w-0">
        <div class="font-semibold text-gray-900 text-sm">Leads</div>
        <div class="text-xs text-gray-500 mt-0.5">{stats.unreadLeads} unread enquiries</div>
      </div>
      <svg class="w-4 h-4 text-gray-300 ml-auto group-hover:text-amber-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
    </a>
  </div>

  <!-- Recent Leads -->
  <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
    <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
      <h2 class="font-bold text-gray-900">Recent Leads</h2>
      <a href="/admin/leads" class="text-sm text-[#0077b6] hover:underline">View all →</a>
    </div>
    {#if recentLeads.length === 0}
      <div class="text-center py-16 text-gray-400">
        <svg class="w-10 h-10 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
        <p class="text-sm">No leads yet</p>
      </div>
    {:else}
      <div class="divide-y divide-gray-50">
        {#each recentLeads as lead}
          <div class="px-6 py-4 flex items-start gap-4 {lead.read ? 'opacity-70' : ''}">
            <div class="w-9 h-9 rounded-full bg-[#0077b6]/10 flex items-center justify-center text-[#0077b6] font-bold text-sm shrink-0">
              {lead.name ? lead.name[0].toUpperCase() : lead.email[0].toUpperCase()}
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex flex-wrap items-center gap-2 mb-0.5">
                <span class="font-semibold text-sm text-gray-900">{lead.name || '—'}</span>
                <a href="mailto:{lead.email}" class="text-xs text-[#0077b6] hover:underline">{lead.email}</a>
                {#if lead.phone}<span class="text-xs text-gray-500">{lead.phone}</span>{/if}
                <span class="text-xs px-2 py-0.5 rounded-full {lead.source === 'listing' ? 'bg-blue-100 text-blue-700' : lead.source === 'partner' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}">{lead.source}</span>
                {#if !lead.read}<span class="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-600 font-medium">New</span>{/if}
              </div>
              {#if lead.message}
                <p class="text-xs text-gray-500 line-clamp-2 mt-0.5">{lead.message}</p>
              {/if}
              {#if (lead as any).listing_title}
                <p class="text-xs text-gray-400 mt-0.5">Re: {(lead as any).listing_title}</p>
              {/if}
            </div>
            <div class="shrink-0 text-right">
              <p class="text-xs text-gray-400 mb-1.5">{fmtDate(lead.created_at)}</p>
              {#if !lead.read}
                <button onclick={() => markRead(lead.id)} class="text-xs px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">Mark read</button>
              {/if}
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>

</div>

{#if toast}
  <div class="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#2d6a4f] text-white px-6 py-3 rounded-xl shadow-lg text-sm font-medium z-50">{toast}</div>
{/if}
