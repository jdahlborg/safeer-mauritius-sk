<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { REGIONS, REGION_NAMES, DISTRICT_REGION, type Region } from '$lib/regions';

	interface MapListing {
		id: number;
		title: string;
		price: string;
		location: string;
		transaction_type: string;
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
	let regionLayers: Map<Region, import('leaflet').Layer> = new Map();

	const MAURITIUS: [number, number] = [-20.25, 57.55];

	onMount(async () => {
		const L = (await import('leaflet')).default;

		map = L.map(mapEl, { zoomControl: true }).setView(MAURITIUS, 10);

		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
			maxZoom: 18,
		}).addTo(map);

		await loadGeoJSON(L);
		addMarkers(L);
	});

	onDestroy(() => {
		map?.remove();
	});

	async function loadGeoJSON(L: typeof import('leaflet')) {
		if (!map) return;

		// Collect layers per region so we can style/click them together
		const regionLayerGroups = new Map<Region, import('leaflet').Layer[]>();
		for (const r of REGION_NAMES) regionLayerGroups.set(r, []);

		try {
			// Load outline + districts in parallel
			const [outlineRes, districtsRes] = await Promise.all([
				fetch('/mauritius-outline.geojson'),
				fetch('/mauritius-districts.geojson'),
			]);
			const outlineGeo = await outlineRes.json();
			const districtsGeo = await districtsRes.json();

			// Draw coastline outline (no fill, just the border)
			L.geoJSON(outlineGeo, {
				style: {
					color: '#0077b6',
					weight: 1.5,
					fillOpacity: 0,
					opacity: 0.4,
				},
				interactive: false,
			}).addTo(map!);

			// Draw districts colored by region
			L.geoJSON(districtsGeo, {
				style: (feature) => {
					const districtName = feature?.properties?.name ?? '';
					const region = DISTRICT_REGION[districtName] ?? null;
					const color = region ? REGIONS[region].color : '#888';
					return {
						color,
						weight: 1.5,
						fillColor: color,
						fillOpacity: 0.07,
						opacity: 0.35,
					};
				},
				onEachFeature: (feature, layer) => {
					const districtName = feature?.properties?.name ?? '';
					const region = DISTRICT_REGION[districtName] ?? null;
					if (!region) return;

					regionLayerGroups.get(region)!.push(layer);

					layer.on('click', () => {
						activeRegion = activeRegion === region ? null : region;
					});
					layer.on('mouseover', () => {
						if (activeRegion !== region) {
							(layer as import('leaflet').Path).setStyle({ fillOpacity: 0.14, opacity: 0.55 });
						}
					});
					layer.on('mouseout', () => {
						if (activeRegion !== region) {
							(layer as import('leaflet').Path).setStyle({ fillOpacity: 0.07, opacity: 0.35 });
						}
					});
				},
			}).addTo(map!);

			// Build a "combined layer" handle per region for style updates
			for (const [region, layers] of regionLayerGroups) {
				// Wrap in a fake layer with setStyle
				const regionProxy = {
					setStyle(style: object) {
						layers.forEach(l => (l as import('leaflet').Path).setStyle(style));
					},
					getBounds() {
						const group = L.featureGroup(layers as import('leaflet').Layer[]);
						return group.getBounds();
					},
				} as unknown as import('leaflet').Layer;
				regionLayers.set(region, regionProxy);
			}

			// Add region labels at the center of each region's bounds
			for (const [region, layers] of regionLayerGroups) {
				if (layers.length === 0) continue;
				const group = L.featureGroup(layers as import('leaflet').Layer[]);
				const center = group.getBounds().getCenter();
				const color = REGIONS[region].color;
				L.marker(center, {
					icon: L.divIcon({
						className: '',
						html: `<div style="font-size:11px;font-weight:700;color:${color};text-shadow:0 1px 3px rgba(255,255,255,0.95),0 0 6px white;letter-spacing:0.05em;white-space:nowrap;pointer-events:none">${region.toUpperCase()}</div>`,
						iconAnchor: [24, 8],
					}),
					interactive: false,
				}).addTo(map!);
			}

		} catch (err) {
			console.warn('GeoJSON load failed, falling back to rectangles', err);
			drawFallbackRegions(L);
		}
	}

	/** Rectangle fallback if GeoJSON fetch fails */
	function drawFallbackRegions(L: typeof import('leaflet')) {
		if (!map) return;
		for (const name of REGION_NAMES) {
			const cfg = REGIONS[name];
			const rect = L.rectangle(cfg.bounds, {
				color: cfg.color, weight: 1.5,
				fillColor: cfg.color, fillOpacity: 0.06, opacity: 0.35,
			}).addTo(map!);
			rect.on('click', () => { activeRegion = activeRegion === name ? null : name; });
			regionLayers.set(name, rect as unknown as import('leaflet').Layer);
			L.marker(cfg.center, {
				icon: L.divIcon({
					className: '',
					html: `<div style="font-size:11px;font-weight:700;color:${cfg.color};text-shadow:0 1px 3px rgba(255,255,255,0.9);letter-spacing:0.05em;white-space:nowrap;pointer-events:none">${name.toUpperCase()}</div>`,
					iconAnchor: [24, 8],
				}),
				interactive: false,
			}).addTo(map!);
		}
	}

	function regionStyle(name: Region, active: boolean) {
		const color = REGIONS[name].color;
		return {
			color, fillColor: color,
			weight: active ? 2.5 : 1.5,
			fillOpacity: active ? 0.20 : 0.07,
			opacity: active ? 0.85 : 0.35,
		};
	}

	function makeIcon(L: typeof import('leaflet'), transactionType: string, active = false) {
		const color = transactionType === 'rent' ? '#2d6a4f' : '#0077b6';
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
			const marker = L.marker([l.lat, l.lng], { icon: makeIcon(L, l.transaction_type) })
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
		listings;
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
				marker.setIcon(makeIcon(L, listing.transaction_type, id === activeId));
				if (id === activeId) {
					marker.openPopup();
					map!.panTo(marker.getLatLng(), { animate: true });
				}
			});
		});
	});

	// Highlight active region + zoom
	$effect(() => {
		const ar = activeRegion;
		regionLayers.forEach((layer, name) => {
			(layer as { setStyle(s: object): void }).setStyle(regionStyle(name, name === ar));
		});
		if (ar && map) {
			const layer = regionLayers.get(ar);
			if (layer && 'getBounds' in layer) {
				map.fitBounds((layer as { getBounds(): import('leaflet').LatLngBounds }).getBounds(), { padding: [20, 20], animate: true });
			} else {
				map.fitBounds(REGIONS[ar].bounds as [[number, number], [number, number]], { padding: [20, 20], animate: true });
			}
		} else if (!ar && map) {
			map.setView(MAURITIUS, 10, { animate: true });
		}
	});
</script>

<svelte:head>
	<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
</svelte:head>

<div bind:this={mapEl} class="w-full h-full rounded-2xl overflow-hidden"></div>
