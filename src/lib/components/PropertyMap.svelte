<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	interface MapListing {
		id: number;
		title: string;
		price: string;
		location: string;
		payment: string;
		property_type: string;
		image: string;
		lat: number;
		lng: number;
	}

	let { listings, activeId = $bindable(null) }: {
		listings: MapListing[];
		activeId?: number | null;
	} = $props();

	let mapEl: HTMLDivElement;
	let map: import('leaflet').Map | null = null;
	let markers: Map<number, import('leaflet').Marker> = new Map();

	const MAURITIUS: [number, number] = [-20.2, 57.55];

	onMount(async () => {
		const L = (await import('leaflet')).default;

		map = L.map(mapEl, { zoomControl: true }).setView(MAURITIUS, 10);

		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
			maxZoom: 18,
		}).addTo(map);

		addMarkers(L);
	});

	onDestroy(() => {
		map?.remove();
	});

	function makeIcon(L: typeof import('leaflet'), payment: string, active = false) {
		const color = payment === 'rent' ? '#2d6a4f' : '#0077b6';
		const size = active ? 14 : 10;
		return L.divIcon({
			className: '',
			html: `<div style="width:${size + 6}px;height:${size + 6}px;border-radius:50%;background:${color};border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.35);transition:all 0.15s"></div>`,
			iconSize: [size + 6, size + 6],
			iconAnchor: [(size + 6) / 2, (size + 6) / 2],
		});
	}

	function addMarkers(L: typeof import('leaflet')) {
		if (!map) return;
		markers.forEach(m => m.remove());
		markers = new Map();

		for (const l of listings) {
			if (l.lat == null || l.lng == null) continue;
			const marker = L.marker([l.lat, l.lng], { icon: makeIcon(L, l.payment) })
				.addTo(map!)
				.bindPopup(`
					<a href="/properties/${l.id}" style="text-decoration:none;color:inherit">
						${l.image ? `<img src="${l.image}" style="width:180px;height:100px;object-fit:cover;border-radius:6px;margin-bottom:6px;display:block">` : ''}
						<div style="font-weight:600;font-size:13px;line-height:1.3;margin-bottom:2px">${l.title}</div>
						<div style="color:#6b7280;font-size:11px;margin-bottom:4px">${l.location}</div>
						<div style="color:#0077b6;font-weight:700;font-size:13px">${l.price}</div>
					</a>
				`, { maxWidth: 200 });

			marker.on('click', () => { activeId = l.id; });
			markers.set(l.id, marker);
		}
	}

	// React to activeId changes — highlight marker
	$effect(() => {
		if (!map) return;
		import('leaflet').then(({ default: L }) => {
			markers.forEach((marker, id) => {
				const listing = listings.find(l => l.id === id);
				if (!listing) return;
				marker.setIcon(makeIcon(L, listing.payment, id === activeId));
				if (id === activeId) {
					marker.openPopup();
					map!.panTo(marker.getLatLng(), { animate: true });
				}
			});
		});
	});
</script>

<svelte:head>
	<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
</svelte:head>

<div bind:this={mapEl} class="w-full h-full rounded-2xl overflow-hidden"></div>
