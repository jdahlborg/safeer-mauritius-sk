<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { REGIONS, REGION_NAMES, type Region } from '$lib/regions';

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

	let { listings, activeId = $bindable(null), activeRegion = $bindable(null) }: {
		listings: MapListing[];
		activeId?: number | null;
		activeRegion?: Region | null;
	} = $props();

	let mapEl: HTMLDivElement;
	let map: import('leaflet').Map | null = null;
	let markers: Map<number, import('leaflet').Marker> = new Map();
	let regionLayers: Map<Region, import('leaflet').Rectangle> = new Map();

	const MAURITIUS: [number, number] = [-20.25, 57.55];

	onMount(async () => {
		const L = (await import('leaflet')).default;

		map = L.map(mapEl, { zoomControl: true }).setView(MAURITIUS, 10);

		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
			maxZoom: 18,
		}).addTo(map);

		drawRegions(L);
		addMarkers(L);
	});

	onDestroy(() => {
		map?.remove();
	});

	function regionStyle(name: Region, active: boolean) {
		const color = REGIONS[name].color;
		return {
			color,
			weight: active ? 2.5 : 1.5,
			fillColor: color,
			fillOpacity: active ? 0.18 : 0.06,
			opacity: active ? 0.85 : 0.35,
		};
	}

	function drawRegions(L: typeof import('leaflet')) {
		if (!map) return;
		regionLayers.forEach(r => r.remove());
		regionLayers = new Map();

		for (const name of REGION_NAMES) {
			const cfg = REGIONS[name];
			const rect = L.rectangle(cfg.bounds, regionStyle(name, false)).addTo(map!);

			// Label
			L.marker(cfg.center, {
				icon: L.divIcon({
					className: '',
					html: `<div style="font-size:11px;font-weight:700;color:${cfg.color};text-shadow:0 1px 3px rgba(255,255,255,0.9),0 0 6px white;letter-spacing:0.05em;white-space:nowrap;pointer-events:none">${name.toUpperCase()}</div>`,
					iconAnchor: [24, 8],
				}),
				interactive: false,
			}).addTo(map!);

			rect.on('click', () => {
				activeRegion = activeRegion === name ? null : name;
			});
			rect.on('mouseover', () => {
				if (activeRegion !== name) rect.setStyle({ fillOpacity: 0.12, opacity: 0.55 });
			});
			rect.on('mouseout', () => {
				if (activeRegion !== name) rect.setStyle(regionStyle(name, false));
			});

			regionLayers.set(name, rect);
		}
	}

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

	// Re-add markers when listings change
	$effect(() => {
		listings; // track
		if (!map) return;
		import('leaflet').then(({ default: L }) => addMarkers(L));
	});

	// Highlight active marker
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

	// Highlight active region
	$effect(() => {
		const ar = activeRegion; // track
		regionLayers.forEach((rect, name) => {
			rect.setStyle(regionStyle(name, name === ar));
		});
		// Pan to region center when selected
		if (ar && map) {
			const cfg = REGIONS[ar];
			map.fitBounds(cfg.bounds as [[number, number], [number, number]], { padding: [20, 20], animate: true });
		} else if (!ar && map) {
			map.setView(MAURITIUS, 10, { animate: true });
		}
	});
</script>

<svelte:head>
	<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
</svelte:head>

<div bind:this={mapEl} class="w-full h-full rounded-2xl overflow-hidden"></div>
