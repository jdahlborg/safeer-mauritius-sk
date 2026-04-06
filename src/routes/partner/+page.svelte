<script lang="ts">
  import type { PageData } from './$types';
  import type { SavedListing } from '$lib/server/db';

  let { data }: { data: PageData } = $props();
  let listings = $state<SavedListing[]>(data.listings);
  let toast = $state('');
  let editListing = $state<SavedListing | null>(null);
  let editDraft = $state<Partial<SavedListing>>({});
  let saving = $state(false);
  let showAddForm = $state(false);
  let adding = $state(false);

  // New listing form
  let newListing = $state({
    title: '', price: '', location: '', bedrooms: '', size: '',
    transaction_type: 'buy', property_type: '', available_from: '',
    image: '', url: '', notes: ''
  });

  function showToast(msg: string) { toast = msg; setTimeout(() => (toast = ''), 3000); }

  function openEdit(l: SavedListing) { editListing = l; editDraft = { ...l }; }
  function closeEdit() { editListing = null; editDraft = {}; }

  async function saveEdit() {
    if (!editListing) return;
    saving = true;
    await fetch(`/api/listings/${editListing.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editDraft),
    });
    listings = listings.map(l => l.id === editListing!.id ? { ...l, ...editDraft } as SavedListing : l);
    saving = false;
    closeEdit();
    showToast('Listing updated');
  }

  async function addListing() {
    if (!newListing.title || !newListing.price) return;
    adding = true;
    const r = await fetch('/api/listings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newListing),
    });
    const d = await r.json();
    if (d.ok) {
      // Reload listings
      const res = await fetch('/api/partner/listings');
      const fresh = await res.json();
      listings = fresh.listings ?? listings;
      newListing = { title: '', price: '', location: '', bedrooms: '', size: '', transaction_type: 'buy', property_type: '', available_from: '', image: '', url: '', notes: '' };
      showAddForm = false;
      showToast('Listing added');
    }
    adding = false;
  }

  async function remove(id: number) {
    if (!confirm('Remove this listing?')) return;
    await fetch(`/api/listings/${id}`, { method: 'DELETE' });
    listings = listings.filter(l => l.id !== id);
    showToast('Removed');
  }

  const statusColor = (s: string) =>
    s === 'sold' ? 'bg-gray-800 text-white' :
    s === 'rented' ? 'bg-purple-600 text-white' :
    'bg-[#2d6a4f] text-white';
</script>

<svelte:head><title>Partner Portal — Safeer Properties</title></svelte:head>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

  <!-- Header -->
  <div class="mb-8 flex items-center justify-between flex-wrap gap-4">
    <div>
      <h1 class="text-3xl font-bold text-gray-900" style="font-family:'Playfair Display',serif">My Listings</h1>
      <p class="text-gray-500 text-sm mt-1">{listings.length} listing{listings.length !== 1 ? 's' : ''} published</p>
    </div>
    <button onclick={() => (showAddForm = !showAddForm)} class="btn-primary text-sm px-5 py-2">
      {showAddForm ? 'Cancel' : '+ Add Listing'}
    </button>
  </div>

  <!-- Add listing form -->
  {#if showAddForm}
    <div class="bg-white rounded-2xl border border-[#0077b6]/30 shadow-sm p-6 mb-8">
      <h2 class="font-bold text-gray-900 mb-5">New Listing</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        <div class="lg:col-span-3">
          <label class="form-label">Title *</label>
          <input type="text" bind:value={newListing.title} class="form-input text-sm py-2" placeholder="3-bedroom villa in Grand Baie" />
        </div>
        <div>
          <label class="form-label">Price *</label>
          <input type="text" bind:value={newListing.price} class="form-input text-sm py-2" placeholder="€ 250,000" />
        </div>
        <div>
          <label class="form-label">Location</label>
          <input type="text" bind:value={newListing.location} class="form-input text-sm py-2" placeholder="Grand Baie, North" />
        </div>
        <div>
          <label class="form-label">Transaction Type</label>
          <select bind:value={newListing.transaction_type} class="form-input text-sm py-2">
            <option value="buy">For Sale</option>
            <option value="rent">For Rent</option>
            <option value="holiday">Holiday</option>
          </select>
        </div>
        <div>
          <label class="form-label">Property Type</label>
          <select bind:value={newListing.property_type} class="form-input text-sm py-2">
            <option value="">— select —</option>
            {#each ['apartment','villa','house','land','office','penthouse','other'] as t}
              <option value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
            {/each}
          </select>
        </div>
        <div>
          <label class="form-label">Bedrooms</label>
          <input type="text" bind:value={newListing.bedrooms} class="form-input text-sm py-2" placeholder="3 Bedrooms" />
        </div>
        <div>
          <label class="form-label">Size</label>
          <input type="text" bind:value={newListing.size} class="form-input text-sm py-2" placeholder="180 m²" />
        </div>
        <div>
          <label class="form-label">Available From</label>
          <input type="text" bind:value={newListing.available_from} class="form-input text-sm py-2" placeholder="Q3 2026" />
        </div>
        <div class="lg:col-span-2">
          <label class="form-label">Image URL</label>
          <input type="url" bind:value={newListing.image} class="form-input text-sm py-2" />
        </div>
        <div class="lg:col-span-3">
          <label class="form-label">Listing URL (your website)</label>
          <input type="url" bind:value={newListing.url} class="form-input text-sm py-2" />
        </div>
        <div class="lg:col-span-3">
          <label class="form-label">Notes</label>
          <textarea bind:value={newListing.notes} rows="2" class="form-input text-sm resize-none"></textarea>
        </div>
      </div>
      <button
        onclick={addListing}
        disabled={adding || !newListing.title || !newListing.price}
        class="btn-primary text-sm px-6 py-2 disabled:opacity-50"
      >{adding ? 'Adding…' : 'Add Listing'}</button>
    </div>
  {/if}

  <!-- Listings -->
  {#if listings.length === 0}
    <div class="text-center py-24 text-gray-400 bg-white rounded-2xl border border-gray-100">
      <svg class="w-12 h-12 mx-auto mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
      <p class="text-lg font-medium">No listings yet</p>
      <p class="text-sm mt-1">Add your first listing above</p>
    </div>
  {:else}
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {#each listings as listing}
        <div class="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col">
          <div class="relative h-44 bg-gray-100">
            {#if listing.image}
              <img src={listing.image} alt={listing.title} class="w-full h-full object-cover" loading="lazy" />
            {:else}
              <div class="w-full h-full flex items-center justify-center text-gray-300 text-xs">No image</div>
            {/if}
            <span class="absolute top-2 left-2 text-xs font-semibold px-2 py-0.5 rounded-full
              {listing.transaction_type === 'rent' ? 'bg-[#2d6a4f] text-white' : 'bg-[#0077b6] text-white'}">
              {listing.transaction_type === 'rent' ? 'Rent' : listing.transaction_type === 'holiday' ? 'Holiday' : 'Sale'}
            </span>
            {#if listing.status !== 'active'}
              <span class="absolute bottom-2 left-2 text-xs font-bold px-2 py-0.5 rounded-full {statusColor(listing.status)}">
                {listing.status.toUpperCase()}
              </span>
            {/if}
          </div>
          <div class="p-4 flex flex-col flex-1">
            <h3 class="font-semibold text-gray-900 text-sm leading-snug mb-1 line-clamp-2">{listing.title}</h3>
            <p class="text-gray-500 text-xs mb-1">{listing.location}</p>
            <p class="font-bold text-[#0077b6] mb-auto">{listing.price}</p>
            <div class="flex gap-2 mt-3">
              <button onclick={() => openEdit(listing)} class="flex-1 text-xs py-2 rounded-lg bg-[#0077b6]/10 text-[#0077b6] hover:bg-[#0077b6]/20 transition-colors font-medium">Edit</button>
              <button onclick={() => remove(listing.id)} class="text-xs px-3 py-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}

</div>

<!-- Edit Modal -->
{#if editListing}
  <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4" onclick={(e) => { if (e.target === e.currentTarget) closeEdit(); }}>
    <div class="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
    <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <h2 class="font-bold text-gray-900 text-lg">Edit Listing</h2>
        <button onclick={closeEdit} class="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors">✕</button>
      </div>
      <div class="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="sm:col-span-2">
          <label class="form-label">Title</label>
          <input type="text" bind:value={editDraft.title} class="form-input text-sm py-2" />
        </div>
        <div>
          <label class="form-label">Price</label>
          <input type="text" bind:value={editDraft.price} class="form-input text-sm py-2" />
        </div>
        <div>
          <label class="form-label">Location</label>
          <input type="text" bind:value={editDraft.location} class="form-input text-sm py-2" />
        </div>
        <div>
          <label class="form-label">Bedrooms</label>
          <input type="text" bind:value={editDraft.bedrooms} class="form-input text-sm py-2" />
        </div>
        <div>
          <label class="form-label">Size</label>
          <input type="text" bind:value={editDraft.size} class="form-input text-sm py-2" />
        </div>
        <div>
          <label class="form-label">Transaction Type</label>
          <select bind:value={editDraft.transaction_type} class="form-input text-sm py-2">
            <option value="buy">For Sale</option>
            <option value="rent">For Rent</option>
            <option value="holiday">Holiday</option>
          </select>
        </div>
        <div>
          <label class="form-label">Property Type</label>
          <select bind:value={editDraft.property_type} class="form-input text-sm py-2">
            <option value="">— select —</option>
            {#each ['apartment','villa','house','land','office','penthouse','other'] as t}
              <option value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
            {/each}
          </select>
        </div>
        <div>
          <label class="form-label">Status</label>
          <select bind:value={editDraft.status} class="form-input text-sm py-2">
            <option value="active">Active</option>
            <option value="sold">Sold</option>
            <option value="rented">Rented</option>
          </select>
        </div>
        <div>
          <label class="form-label">Available From</label>
          <input type="text" bind:value={editDraft.available_from} class="form-input text-sm py-2" placeholder="e.g. Q3 2026" />
        </div>
        <div class="sm:col-span-2">
          <label class="form-label">Image URL</label>
          <input type="url" bind:value={editDraft.image} class="form-input text-sm py-2" />
        </div>
        <div class="sm:col-span-2">
          <label class="form-label">Listing URL</label>
          <input type="url" bind:value={editDraft.url} class="form-input text-sm py-2" />
        </div>
        <div class="sm:col-span-2">
          <label class="form-label">Notes</label>
          <textarea bind:value={editDraft.notes} rows="3" class="form-input text-sm resize-none"></textarea>
        </div>
      </div>
      <div class="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
        <button onclick={closeEdit} class="btn-outline text-sm px-5 py-2">Cancel</button>
        <button onclick={saveEdit} disabled={saving} class="btn-primary text-sm px-5 py-2 disabled:opacity-60">
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    </div>
  </div>
{/if}

{#if toast}
  <div class="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#2d6a4f] text-white px-6 py-3 rounded-xl shadow-lg text-sm font-medium z-50">{toast}</div>
{/if}
