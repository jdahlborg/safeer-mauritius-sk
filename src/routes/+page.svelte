<script lang="ts">
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import { ts } from '$lib/i18n';

	let { data }: { data: PageData } = $props();

	let toast = $state(false);
	let submitting = $state(false);

	// ── Search form ────────────────────────────────────────
	let payment = $state('buy');
	let searchQ = $state('');
	let searchType = $state('');
	let searchBeds = $state('');

	function search() {
		const params = new URLSearchParams();
		params.set('payment', payment);
		if (searchQ) params.set('q', searchQ);
		if (searchType) params.set('type', searchType);
		if (searchBeds) params.set('minBeds', searchBeds);
		goto(`/properties?${params.toString()}`);
	}

	const faqs = [
		{
			q: 'Can foreigners buy property in Mauritius?',
			a: 'Yes. Foreigners can purchase property through approved schemes: <strong>PDS (Property Development Scheme)</strong>, <strong>IRS (Integrated Resort Scheme)</strong>, <strong>RES (Real Estate Scheme)</strong>, and apartments above the 2nd floor in certain developments. A purchase of USD 375,000+ under PDS automatically qualifies the buyer for a Permanent Residence Permit.'
		},
		{
			q: 'What are the best areas to live in Mauritius?',
			a: 'Popular expat areas include <strong>Grand Baie</strong> (vibrant, cosmopolitan), <strong>Tamarin / Black River</strong> (surf community, relaxed lifestyle), <strong>Flic en Flac</strong> (affordable, beach-focused), <strong>Pereybere</strong> (family-friendly), and <strong>Bel Ombre</strong> (luxury estates, southern coast).'
		},
		{
			q: 'What visa options are available for relocating to Mauritius?',
			a: 'Mauritius offers several residency pathways: the <strong>Premium Visa</strong> (up to 1 year, renewable, for remote workers and retirees), the <strong>Occupation Permit</strong> (for professionals and self-employed), the <strong>Investor Permit</strong> (minimum USD 50,000 investment), and the <strong>Retired Non-Citizen Permit</strong> (for those 50+ with a monthly income transfer). We assess your profile and recommend the most suitable route.'
		},
		{
			q: 'What are the tax implications of becoming a Mauritius resident?',
			a: 'Mauritius has a <strong>flat 15% income tax rate</strong>, no capital gains tax, no inheritance tax, and no withholding tax on dividends. Tax residency requires spending 183+ days in the country. With 45+ double tax treaties, many residents can significantly reduce their global tax burden.'
		},
		{
			q: 'How much does it cost to live in Mauritius?',
			a: 'A comfortable single expat lifestyle costs <strong>€1,500–€2,500/month</strong>. A family with international schooling and a good villa typically budgets <strong>€4,000–€8,000/month</strong>. Property rentals range from €600/month for an apartment to €5,000+/month for a luxury villa.'
		},
		{
			q: 'How long does the visa / permit process take?',
			a: 'The Premium Visa is typically processed within <strong>2–4 weeks</strong>. Occupation and Investor Permits take <strong>4–8 weeks</strong> once a complete application is submitted. We prepare your documents meticulously to avoid delays.'
		},
	];

	let openFaq = $state<number | null>(null);
	function toggleFaq(i: number) { openFaq = openFaq === i ? null : i; }

	async function handleContact(e: SubmitEvent) {
		e.preventDefault();
		submitting = true;
		const form = e.target as HTMLFormElement;
		const data = Object.fromEntries(new FormData(form));
		try {
			await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
		} catch {}
		form.reset();
		submitting = false;
		toast = true;
		setTimeout(() => (toast = false), 4000);
	}
</script>
<svelte:head>
	<title>Safeer Properties — Properties &amp; Relocation</title>
	<meta name="description" content="Safeer Properties Mauritius — curated properties for sale and rent across the island. Villas, apartments, land, with full relocation support." />
</svelte:head>

<!-- ===================== HERO ===================== -->
<section id="home" class="relative min-h-screen flex flex-col justify-center overflow-hidden">
	<div class="absolute inset-0">
		<img
			src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=85&fit=crop"
			alt="Mauritius villa"
			class="w-full h-full object-cover"
		/>
		<div class="absolute inset-0 bg-gradient-to-b from-[#001f3f]/65 via-[#003366]/55 to-[#001f3f]/75"></div>
	</div>

	<div class="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 w-full">

		<!-- Title -->
		<div class="text-center mb-8">
			<span class="inline-block bg-white/15 backdrop-blur-sm text-white/90 text-sm font-medium px-4 py-1.5 rounded-full mb-5 border border-white/25">
				🏠 Curated Mauritius Properties
			</span>
			<h1 class="font-bold text-5xl sm:text-6xl text-white leading-tight mb-4" style="font-family:'Playfair Display',serif">
				Find Your Home<br/>in <span class="text-[#f4e4c1]">Mauritius</span>
			</h1>
			<p class="text-lg text-white/80 max-w-xl mx-auto">
				Villas, apartments &amp; land across the island — handpicked by local experts
			</p>
		</div>

		<!-- Search card -->
		<div class="bg-white rounded-2xl shadow-2xl overflow-hidden">
			<!-- Buy / Rent tabs -->
			<div class="flex border-b border-gray-100">
				{#each [['buy', ts('search_buy')], ['rent', ts('search_rent')]] as [val, label]}
					<button
						onclick={() => (payment = val)}
						class="flex-1 py-3.5 text-sm font-semibold transition-colors relative"
						class:text-[#0077b6]={payment === val}
						class:text-gray-400={payment !== val}
						class:bg-white={payment === val}
						class:bg-gray-50={payment !== val}
					>
						{label}
						{#if payment === val}
							<span class="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0077b6]"></span>
						{/if}
					</button>
				{/each}
			</div>
			<!-- Inputs -->
			<div class="p-4 flex flex-wrap gap-3">
				<div class="relative flex-1 min-w-[200px]">
					<svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
					<input
						type="text"
						bind:value={searchQ}
						onkeydown={(e) => e.key === 'Enter' && search()}
						placeholder={ts('search_placeholder')}
						class="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0077b6]/30 focus:border-[#0077b6]"
					/>
				</div>
				<select bind:value={searchType} class="border border-gray-200 rounded-xl px-3 py-3 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#0077b6]/30 bg-white">
					<option value="">{ts('search_all_types')}</option>
					{#each ['apartment','villa','house','penthouse','land','office'] as t}
						<option value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
					{/each}
				</select>
				<select bind:value={searchBeds} class="border border-gray-200 rounded-xl px-3 py-3 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#0077b6]/30 bg-white">
					<option value="">{ts('search_min_beds')}</option>
					{#each ['1','2','3','4','5'] as b}
						<option value={b}>{b}+</option>
					{/each}
				</select>
				<button onclick={search} class="btn-primary px-7 py-3 text-sm whitespace-nowrap">
					{ts('search_button')}
				</button>
			</div>
		</div>

		<!-- Stats -->
		<div class="mt-8 flex justify-center flex-wrap gap-8">
			<div class="text-center text-white">
				<div class="text-3xl font-bold text-[#f4e4c1]" style="font-family:'Playfair Display',serif">500+</div>
				<div class="text-white/60 text-xs mt-1">Families Relocated</div>
			</div>
			<div class="text-center text-white">
				<div class="text-3xl font-bold text-[#f4e4c1]" style="font-family:'Playfair Display',serif">15%</div>
				<div class="text-white/60 text-xs mt-1">Flat Income Tax</div>
			</div>
			<div class="text-center text-white">
				<div class="text-3xl font-bold text-[#f4e4c1]" style="font-family:'Playfair Display',serif">12+</div>
				<div class="text-white/60 text-xs mt-1">Years Local Expertise</div>
			</div>
		</div>
	</div>
</section>

<!-- ===================== WHY MAURITIUS ===================== -->
<section id="why-mauritius" class="py-20 bg-[#fdf6ec]">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="text-center mb-12">
			<span class="section-tag">Why Mauritius?</span>
			<h2 class="section-title mt-3">Paradise Meets Opportunity</h2>
		</div>
		<div class="grid grid-cols-2 lg:grid-cols-4 gap-5">
			{#each [
				{ icon: '💰', title: 'Low Taxation', desc: '15% flat income tax, no capital gains, no inheritance tax.' },
				{ icon: '🌊', title: 'Island Lifestyle', desc: 'Year-round warmth, world-class beaches, fine dining.' },
				{ icon: '🛡️', title: 'Safe & Stable', desc: "Africa's most stable democracy with strong infrastructure." },
				{ icon: '✈️', title: 'Global Gateway', desc: '45+ tax treaties, fast company formation, dual-language.' },
			] as w}
				<div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
					<div class="text-4xl mb-3">{w.icon}</div>
					<h3 class="font-bold text-gray-900 mb-2" style="font-family:'Playfair Display',serif">{w.title}</h3>
					<p class="text-gray-500 text-sm leading-relaxed">{w.desc}</p>
				</div>
			{/each}
		</div>
	</div>
</section>


<!-- ===================== HOW WE HELP ===================== -->
<section id="services" class="py-20 bg-white">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="text-center mb-12">
			<span class="section-tag">Full Support</span>
			<h2 class="section-title mt-3">More Than Just Property</h2>
			<p class="section-subtitle">Once you've found your home, we handle everything it takes to actually live there</p>
		</div>

		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each [
				{ href: '/services/visa-residency', icon: '🛂', color: '#0077b6', bg: 'bg-blue-50', title: 'Visa & Residency', desc: 'Premium Visa, Occupation Permit, Investor Permit, Retired Non-Citizen. We handle every document.' },
				{ href: '/services/legal-financial', icon: '⚖️', color: '#2d6a4f', bg: 'bg-green-50', title: 'Legal & Financial', desc: 'Company formation, tax planning, bank accounts, and legal documentation — done right from day one.' },
				{ href: '/services/logistics', icon: '📦', color: '#e76f51', bg: 'bg-orange-50', title: 'Logistics & Moving', desc: 'International removals, customs clearance, vehicle and pet import — fully coordinated.' },
				{ href: '/services/family-lifestyle', icon: '👨‍👩‍👧', color: '#00b4d8', bg: 'bg-sky-50', title: 'Family & Lifestyle', desc: 'School search, healthcare, community integration, and expat introductions.' },
				{ href: '/services/remote-worker', icon: '💻', color: '#0077b6', bg: 'bg-blue-50', title: 'Remote Worker Package', desc: 'The complete solution for digital nomads: visa, co-working, SIM, bank, and housing.' },
				{ href: '/services/housing', icon: '🏡', color: '#c9a96e', bg: 'bg-amber-50', title: 'Housing Support', desc: "Don't just find a property — we negotiate the deal, review the lease, and set up your home." },
			] as s}
				<a href={s.href} class="group flex gap-4 p-5 rounded-2xl border border-gray-100 hover:border-[{s.color}]/30 hover:shadow-md transition-all duration-200 bg-white">
					<div class="w-12 h-12 rounded-xl {s.bg} flex items-center justify-center text-2xl flex-shrink-0">{s.icon}</div>
					<div>
						<h3 class="font-semibold text-gray-900 mb-1 group-hover:text-[{s.color}] transition-colors">{s.title}</h3>
						<p class="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
					</div>
				</a>
			{/each}
		</div>
	</div>
</section>


<!-- ===================== TESTIMONIALS ===================== -->
<section class="py-20 bg-[#005f8a] text-white">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="text-center mb-12">
			<span class="inline-block bg-white/10 text-white/80 text-sm font-medium px-4 py-1.5 rounded-full mb-3">Client Stories</span>
			<h2 class="font-bold text-4xl" style="font-family:'Playfair Display',serif">What Our Clients Say</h2>
		</div>
		<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
			{#each [
				{ initials: 'JB', name: 'James & Sarah B.', from: 'London → Grand Baie, 2024', quote: "Moving our family from London seemed overwhelming. Safeer Properties handled everything — permits, the villa in Tamarin, full setup. We arrived to a home ready to live in." },
				{ initials: 'MK', name: 'Martin K.', from: 'Amsterdam → Flic en Flac, 2025', quote: "I needed the Premium Visa fast. Safeer Properties had my application ready in days. I was living in Flic en Flac within 6 weeks of my first call. Incredible team." },
				{ initials: 'PD', name: 'Patricia D.', from: 'Cape Town → Bel Ombre, 2024', quote: "They found me the perfect retirement property and handled the permit. What felt impossible became completely manageable. I wish I'd done this years ago." },
			] as t}
				<div class="testimonial-card">
					<div class="flex text-[#c9a96e] mb-3">★★★★★</div>
					<p class="text-white/80 text-sm leading-relaxed mb-5">"{t.quote}"</p>
					<div class="flex items-center gap-3">
						<div class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-[#c9a96e]" style="background:rgba(201,169,110,0.3)">{t.initials}</div>
						<div>
							<div class="font-semibold text-sm">{t.name}</div>
							<div class="text-white/50 text-xs">{t.from}</div>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>


<!-- ===================== FAQ ===================== -->
<section id="faq" class="py-20 bg-[#fdf6ec]">
	<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="text-center mb-12">
			<span class="section-tag">FAQs</span>
			<h2 class="section-title mt-3">Common Questions</h2>
			<p class="section-subtitle">Everything you need to know about buying or renting in Mauritius</p>
		</div>
		<div class="space-y-3">
			{#each faqs as faq, i}
				<div class="faq-item" class:open={openFaq === i}>
					<button class="faq-btn" onclick={() => toggleFaq(i)}>
						<span>{faq.q}</span>
						<svg class="faq-arrow w-5 h-5 text-[#0077b6] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
						</svg>
					</button>
					<div class="faq-answer"><p>{@html faq.a}</p></div>
				</div>
			{/each}
		</div>
	</div>
</section>


<!-- ===================== CONTACT ===================== -->
<section id="contact" class="py-20 bg-white">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-16">

			<div>
				<span class="section-tag">Get in Touch</span>
				<h2 class="section-title mt-3">Ready to Make<br/>the Move?</h2>
				<p class="text-gray-600 leading-relaxed mt-6">
					Whether you're browsing listings or ready to commit — our team is here. We offer a <strong>free 30-minute consultation</strong> to understand your situation and outline the best path forward.
				</p>
				<div class="mt-8 space-y-5">
					<div class="flex items-start gap-4">
						<div class="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
							<svg class="w-5 h-5 text-[#0077b6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
						</div>
						<div>
							<div class="font-semibold text-gray-900">Address</div>
							<div class="text-gray-600 text-sm">Port Louis, Republic of Mauritius</div>
						</div>
					</div>
					<div class="flex items-start gap-4">
						<div class="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
							<svg class="w-5 h-5 text-[#0077b6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
						</div>
						<div>
							<div class="font-semibold text-gray-900">Email</div>
							<div class="text-gray-600 text-sm">hello@safeer.mu</div>
						</div>
					</div>
					<div class="flex items-start gap-4">
						<div class="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
							<svg class="w-5 h-5 text-[#0077b6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
						</div>
						<div>
							<div class="font-semibold text-gray-900">WhatsApp</div>
							<div class="text-gray-600 text-sm">+230 5700 0000</div>
						</div>
					</div>
				</div>
			</div>

			<div>
				<form onsubmit={handleContact} class="bg-[#fdf6ec] rounded-2xl p-8 shadow-sm space-y-5">
					<div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
						<div>
							<label class="form-label">Full Name *</label>
							<input type="text" name="name" required class="form-input" placeholder="Your name" />
						</div>
						<div>
							<label class="form-label">Email *</label>
							<input type="email" name="email" required class="form-input" placeholder="you@email.com" />
						</div>
					</div>
					<div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
						<div>
							<label class="form-label">Phone / WhatsApp</label>
							<input type="tel" name="phone" class="form-input" placeholder="+44 7700 000000" />
						</div>
						<div>
							<label class="form-label">I'm interested in</label>
							<select name="interest" class="form-input">
								<option value="">— select —</option>
								<option>Buying a property</option>
								<option>Renting a property</option>
								<option>Visa & Residency</option>
								<option>Full relocation package</option>
								<option>Just exploring options</option>
							</select>
						</div>
					</div>
					<div>
						<label class="form-label">Message</label>
						<textarea name="message" rows="4" class="form-input resize-none" placeholder="Tell us about your situation — where you're moving from, timeline, budget, family size..."></textarea>
					</div>
					<button type="submit" disabled={submitting} class="btn-primary w-full py-4 disabled:opacity-60">
						{submitting ? 'Sending...' : 'Send Message'}
					</button>
					<p class="text-gray-400 text-xs text-center">We'll get back to you within 24 hours.</p>
				</form>
			</div>
		</div>
	</div>
</section>


<!-- WhatsApp FAB -->
<a href="https://wa.me/2305700000" target="_blank" rel="noopener noreferrer" class="whatsapp-fab" aria-label="Chat on WhatsApp">
	<svg class="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
</a>


<!-- Toast -->
{#if toast}
	<div class="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#2d6a4f] text-white px-6 py-3 rounded-xl shadow-lg text-sm font-medium z-50">
		Message sent! We'll be in touch within 24 hours.
	</div>
{/if}
