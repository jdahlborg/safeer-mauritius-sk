/** Geocode a location string using Nominatim (OpenStreetMap). Returns null on failure. */
export async function geocodeLocation(location: string): Promise<{ lat: number; lng: number } | null> {
	const query = encodeURIComponent(`${location}, Mauritius`);
	try {
		const resp = await fetch(
			`https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1&countrycodes=mu`,
			{ headers: { 'User-Agent': 'SafeerProperties/1.0 (hello@safeer.mu)' } }
		);
		if (!resp.ok) return null;
		const data = await resp.json();
		if (!Array.isArray(data) || data.length === 0) return null;
		return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
	} catch {
		return null;
	}
}
