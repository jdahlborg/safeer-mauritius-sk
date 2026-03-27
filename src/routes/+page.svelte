<script lang="ts">
	import { onMount } from 'svelte';

	let toast = $state(false);
	let submitting = $state(false);

	const faqs = [
		{
			q: 'What visa options are available for relocating to Mauritius?',
			a: 'Mauritius offers several residency pathways: the <strong>Premium Visa</strong> (up to 1 year, renewable, for remote workers and retirees), the <strong>Occupation Permit</strong> (for professionals and self-employed), the <strong>Investor Permit</strong> (minimum USD 50,000 investment), and the <strong>Retired Non-Citizen Permit</strong> (for those 50+ with a monthly income transfer). We assess your profile and recommend the most suitable route.'
		},
		{
			q: 'How long does the visa / permit process take?',
			a: 'The Premium Visa is typically processed within <strong>2–4 weeks</strong>. Occupation and Investor Permits take <strong>4–8 weeks</strong> once a complete application is submitted. We prepare your documents meticulously to avoid delays.'
		},
		{
			q: 'Can foreigners buy property in Mauritius?',
			a: 'Yes. Foreigners can purchase property through approved schemes: <strong>PDS (Property Development Scheme)</strong>, <strong>IRS (Integrated Resort Scheme)</strong>, <strong>RES (Real Estate Scheme)</strong>, and apartments above the 2nd floor in certain developments. A purchase of USD 375,000+ under PDS automatically qualifies the buyer for a Permanent Residence Permit.'
		},
		{
			q: 'What are the tax implications of becoming a Mauritius resident?',
			a: 'Mauritius has a <strong>flat 15% income tax rate</strong>, no capital gains tax, no inheritance tax, and no withholding tax on dividends. Tax residency requires spending 183+ days in the country. With 45+ double tax treaties, many residents can significantly reduce their global tax burden.'
		},
		{
			q: 'What are the best areas to live in Mauritius?',
			a: 'Popular expat areas include <strong>Grand Baie</strong> (vibrant, cosmopolitan), <strong>Tamarin / Black River</strong> (surf community, relaxed lifestyle), <strong>Flic en Flac</strong> (affordable, beach-focused), <strong>Pereybere</strong> (family-friendly), and <strong>Bel Ombre</strong> (luxury estates, southern coast).'
		},
		{
			q: 'How much does it cost to live in Mauritius?',
			a: 'A comfortable single expat lifestyle costs <strong>€1,500–€2,500/month</strong>. A family with international schooling and a good villa typically budgets <strong>€4,000–€8,000/month</strong>. Property rentals range from €600/month for an apartment to €5,000+/month for a luxury villa.'
		},
		{
			q: 'Are international schools available in Mauritius?',
			a: 'Yes. Mauritius has several well-regarded international schools offering British (IGCSE/A-Level), French (Baccalauréat), and IB curricula. Key institutions include <strong>Northfields International High School</strong>, <strong>Westcoast International School</strong>, and <strong>École du Nord</strong>.'
		}
	];

	let openFaq = $state<number | null>(null);

	function toggleFaq(i: number) {
		openFaq = openFaq === i ? null : i;
	}

	async function handleContact(e: SubmitEvent) {
		e.preventDefault();
		submitting = true;
		const form = e.target as HTMLFormElement;
		const data = Object.fromEntries(new FormData(form));
		try {
			await fetch('/api/contact', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data)
			});
		} catch {}
		form.reset();
		submitting = false;
		toast = true;
		setTimeout(() => (toast = false), 4000);
	}
</script>

<svelte:head>
	<title>Live Mauritius — Relocation Consulting</title>
	<meta name="description" content="Expert relocation consulting for Mauritius. Visas, housing, legal setup, and lifestyle integration — we handle the complexity so you don't have to." />
</svelte:head>

<!-- ===================== HERO ===================== -->
<section id="home" class="relative min-h-screen flex items-center overflow-hidden">
	<div class="absolute inset-0">
		<img
			src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1920&q=85&fit=crop"
			alt="Mauritius coastline"
			class="w-full h-full object-cover"
		/>
		<div class="absolute inset-0 bg-gradient-to-r from-[#1a3a2a]/85 via-[#2d5a3a]/55 to-transparent"></div>
	</div>

	<div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
		<div class="max-w-2xl">
			<span class="inline-block bg-white/20 backdrop-blur-sm text-white text-sm font-medium px-4 py-1.5 rounded-full mb-6 border border-white/30">
				🌴 Mauritius Relocation Specialists
			</span>
			<h1 class="font-bold text-5xl sm:text-6xl lg:text-7xl text-white leading-tight mb-6" style="font-family:'Playfair Display',serif">
				Your New Life in<br/>
				<span class="text-[#f4e4c1]">Mauritius</span><br/>
				Starts Here
			</h1>
			<p class="text-lg sm:text-xl text-white/85 leading-relaxed mb-10 max-w-xl">
				We handle the complexity so you don't have to. From visa applications to finding your dream home — our local experts guide you every step of the way.
			</p>
			<div class="flex flex-wrap gap-4">
				<a href="#contact" class="btn-primary text-base px-8 py-4 inline-flex items-center gap-2">
					Start Your Journey
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
				</a>
				<a href="#services" class="btn-outline-white text-base px-8 py-4">Explore Services</a>
			</div>

			<div class="mt-16 flex flex-wrap gap-8">
				<div class="text-white">
					<div class="text-4xl font-bold text-[#f4e4c1]" style="font-family:'Playfair Display',serif">500+</div>
					<div class="text-white/70 text-sm mt-1">Families Relocated</div>
				</div>
				<div class="text-white">
					<div class="text-4xl font-bold text-[#f4e4c1]" style="font-family:'Playfair Display',serif">12+</div>
					<div class="text-white/70 text-sm mt-1">Years Experience</div>
				</div>
				<div class="text-white">
					<div class="text-4xl font-bold text-[#f4e4c1]" style="font-family:'Playfair Display',serif">98%</div>
					<div class="text-white/70 text-sm mt-1">Client Satisfaction</div>
				</div>
			</div>
		</div>
	</div>

	<div class="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
		<svg class="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
		</svg>
	</div>
</section>


<!-- ===================== WHY MAURITIUS ===================== -->
<section id="why-mauritius" class="py-24 bg-[#fdf6ec]">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="text-center mb-16">
			<span class="section-tag">Why Mauritius?</span>
			<h2 class="section-title mt-3">Paradise Meets Opportunity</h2>
			<p class="section-subtitle">A unique island nation offering the perfect blend of lifestyle, tax efficiency, and opportunity</p>
		</div>

		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
			<div class="why-card">
				<div class="why-icon bg-blue-50 text-[#0077b6]">
					<svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
				</div>
				<h3 class="font-bold text-xl text-gray-900 mb-2" style="font-family:'Playfair Display',serif">Low Taxation</h3>
				<p class="text-gray-600 text-sm leading-relaxed">Flat 15% income tax, no capital gains tax, no inheritance tax. One of Africa's most favourable tax regimes.</p>
			</div>

			<div class="why-card">
				<div class="why-icon bg-green-50 text-[#2d6a4f]">
					<svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
				</div>
				<h3 class="font-bold text-xl text-gray-900 mb-2" style="font-family:'Playfair Display',serif">Indian Ocean Lifestyle</h3>
				<p class="text-gray-600 text-sm leading-relaxed">Year-round tropical climate, world-class beaches, fine dining, and a vibrant multicultural society.</p>
			</div>

			<div class="why-card">
				<div class="why-icon text-[#c9a96e]" style="background:rgba(201,169,110,0.1)">
					<svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
				</div>
				<h3 class="font-bold text-xl text-gray-900 mb-2" style="font-family:'Playfair Display',serif">Safe &amp; Stable</h3>
				<p class="text-gray-600 text-sm leading-relaxed">Ranked among Africa's safest countries with a stable democracy, strong rule of law, and excellent infrastructure.</p>
			</div>

			<div class="why-card">
				<div class="why-icon text-[#e76f51]" style="background:rgba(231,111,81,0.1)">
					<svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
				</div>
				<h3 class="font-bold text-xl text-gray-900 mb-2" style="font-family:'Playfair Display',serif">Business Hub</h3>
				<p class="text-gray-600 text-sm leading-relaxed">Gateway to Africa with 45+ tax treaties, fast company formation, and a business-friendly English &amp; French environment.</p>
			</div>
		</div>

		<div class="mt-16 grid grid-cols-3 gap-4 rounded-2xl overflow-hidden">
			<img src="https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&q=80&fit=crop" alt="Mauritius beach" class="w-full h-48 object-cover rounded-xl" />
			<img src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&q=80&fit=crop" alt="Mauritius lagoon" class="w-full h-48 object-cover rounded-xl" />
			<img src="https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=80&fit=crop" alt="Mauritius landscape" class="w-full h-48 object-cover rounded-xl" />
		</div>
	</div>
</section>


<!-- ===================== HOW IT WORKS ===================== -->
<section id="how-it-works" class="py-24 bg-white">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="text-center mb-16">
			<span class="section-tag">The Process</span>
			<h2 class="section-title mt-3">How It Works</h2>
			<p class="section-subtitle">A clear, guided journey from your first question to settling into your new Mauritian home</p>
		</div>

		<div class="relative">
			<div class="hidden lg:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-[#00b4d8] via-[#c9a96e] to-[#40916c]"></div>
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
				{#each [
					{ n: 1, bg: '#0077b6', title: 'Free Consultation', desc: 'We assess your profile, goals, and the best visa or permit pathway for you.' },
					{ n: 2, bg: '#00b4d8', title: 'Custom Roadmap', desc: 'We build a personalised relocation plan covering all services you need.' },
					{ n: 3, bg: '#c9a96e', title: 'Visa & Permits', desc: 'We prepare and submit all documentation for a smooth, fast approval.' },
					{ n: 4, bg: '#40916c', title: 'Arrival Support', desc: 'Housing, logistics, banking, schools — we handle every detail on the ground.' },
					{ n: 5, bg: '#2d6a4f', title: 'Settled & Thriving', desc: "You're home. Enjoy your new Mauritian lifestyle with ongoing support." },
				] as step}
					<div class="step-card">
						<div class="step-number text-white" style="background:{step.bg}">{step.n}</div>
						<h3 class="font-bold text-lg text-gray-900 mb-2" style="font-family:'Playfair Display',serif">{step.title}</h3>
						<p class="text-gray-500 text-sm">{step.desc}</p>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>


<!-- ===================== SERVICES ===================== -->
<section id="services" class="py-24 bg-[#fdf6ec]">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="text-center mb-16">
			<span class="section-tag">What We Do</span>
			<h2 class="section-title mt-3">Full-Service Relocation</h2>
			<p class="section-subtitle">Every aspect of your move — handled by specialists who know Mauritius inside out</p>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

			<div class="service-card">
				<div class="service-icon-wrap bg-blue-50">
					<svg class="w-8 h-8 text-[#0077b6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"/></svg>
				</div>
				<h3 class="font-bold text-xl text-gray-900 mb-3" style="font-family:'Playfair Display',serif">
					<a href="/services/visa-residency" class="hover:text-[#0077b6] transition-colors">Visa &amp; Residency</a>
				</h3>
				<p class="text-gray-600 text-sm mb-4 leading-relaxed">Expert guidance through Mauritius's permit system — we handle every document, application, and follow-up.</p>
				<ul class="space-y-2 text-sm text-gray-600">
					<li class="flex items-start gap-2"><span class="check-dot bg-[#0077b6]"></span>Premium Visa (remote workers &amp; retirees)</li>
					<li class="flex items-start gap-2"><span class="check-dot bg-[#0077b6]"></span>Occupation Permit (professionals)</li>
					<li class="flex items-start gap-2"><span class="check-dot bg-[#0077b6]"></span>Retired Non-Citizen Permit</li>
					<li class="flex items-start gap-2"><span class="check-dot bg-[#0077b6]"></span>Investor Permit</li>
				</ul>
				<a href="/services/visa-residency" class="mt-4 inline-flex items-center gap-1 text-sm text-[#0077b6] font-medium hover:underline">Learn more <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg></a>
			</div>

			<div class="service-card">
				<div class="service-icon-wrap" style="background:rgba(201,169,110,0.2)">
					<svg class="w-8 h-8 text-[#c9a96e]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
				</div>
				<h3 class="font-bold text-xl text-gray-900 mb-3" style="font-family:'Playfair Display',serif">
					<a href="/services/housing" class="hover:text-[#c9a96e] transition-colors">Housing &amp; Settling In</a>
				</h3>
				<p class="text-gray-600 text-sm mb-4 leading-relaxed">We find your perfect home in the right neighbourhood, and set it up so you arrive to comfort.</p>
				<ul class="space-y-2 text-sm text-gray-600">
					<li class="flex items-start gap-2"><span class="check-dot bg-[#c9a96e]"></span>Property search &amp; viewings</li>
					<li class="flex items-start gap-2"><span class="check-dot bg-[#c9a96e]"></span>Neighbourhood advisory</li>
					<li class="flex items-start gap-2"><span class="check-dot bg-[#c9a96e]"></span>Lease &amp; purchase negotiation</li>
					<li class="flex items-start gap-2"><span class="check-dot bg-[#c9a96e]"></span>Home setup &amp; furnishing</li>
				</ul>
				<a href="/services/housing" class="mt-4 inline-flex items-center gap-1 text-sm text-[#0077b6] font-medium hover:underline">Learn more <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg></a>
			</div>

			<div class="service-card">
				<div class="service-icon-wrap" style="background:rgba(231,111,81,0.1)">
					<svg class="w-8 h-8 text-[#e76f51]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
				</div>
				<h3 class="font-bold text-xl text-gray-900 mb-3" style="font-family:'Playfair Display',serif">
					<a href="/services/logistics" class="hover:text-[#e76f51] transition-colors">Logistics &amp; Moving</a>
				</h3>
				<p class="text-gray-600 text-sm mb-4 leading-relaxed">International removals, customs clearance, and everything in between — coordinated seamlessly.</p>
				<ul class="space-y-2 text-sm text-gray-600">
					<li class="flex items-start gap-2"><span class="check-dot bg-[#e76f51]"></span>International removals coordination</li>
					<li class="flex items-start gap-2"><span class="check-dot bg-[#e76f51]"></span>Customs advisory &amp; clearance</li>
					<li class="flex items-start gap-2"><span class="check-dot bg-[#e76f51]"></span>Vehicle import assistance</li>
					<li class="flex items-start gap-2"><span class="check-dot bg-[#e76f51]"></span>Pet relocation support</li>
				</ul>
				<a href="/services/logistics" class="mt-4 inline-flex items-center gap-1 text-sm text-[#0077b6] font-medium hover:underline">Learn more <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg></a>
			</div>

			<div class="service-card">
				<div class="service-icon-wrap bg-green-50">
					<svg class="w-8 h-8 text-[#2d6a4f]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
				</div>
				<h3 class="font-bold text-xl text-gray-900 mb-3" style="font-family:'Playfair Display',serif">
					<a href="/services/legal-financial" class="hover:text-[#2d6a4f] transition-colors">Legal &amp; Financial</a>
				</h3>
				<p class="text-gray-600 text-sm mb-4 leading-relaxed">Structuring your affairs correctly from day one. We connect you with Mauritius's top professionals.</p>
				<ul class="space-y-2 text-sm text-gray-600">
					<li class="flex items-start gap-2"><span class="check-dot bg-[#2d6a4f]"></span>Company formation</li>
					<li class="flex items-start gap-2"><span class="check-dot bg-[#2d6a4f]"></span>Tax advisory &amp; planning</li>
					<li class="flex items-start gap-2"><span class="check-dot bg-[#2d6a4f]"></span>Bank account opening</li>
					<li class="flex items-start gap-2"><span class="check-dot bg-[#2d6a4f]"></span>Legal documentation</li>
				</ul>
				<a href="/services/legal-financial" class="mt-4 inline-flex items-center gap-1 text-sm text-[#0077b6] font-medium hover:underline">Learn more <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg></a>
			</div>

			<div class="service-card">
				<div class="service-icon-wrap bg-blue-50">
					<svg class="w-8 h-8 text-[#00b4d8]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
				</div>
				<h3 class="font-bold text-xl text-gray-900 mb-3" style="font-family:'Playfair Display',serif">
					<a href="/services/family-lifestyle" class="hover:text-[#00b4d8] transition-colors">Family &amp; Lifestyle</a>
				</h3>
				<p class="text-gray-600 text-sm mb-4 leading-relaxed">Helping every family member feel at home — from school enrolment to healthcare and community.</p>
				<ul class="space-y-2 text-sm text-gray-600">
					<li class="flex items-start gap-2"><span class="check-dot bg-[#00b4d8]"></span>International school search</li>
					<li class="flex items-start gap-2"><span class="check-dot bg-[#00b4d8]"></span>Healthcare orientation</li>
					<li class="flex items-start gap-2"><span class="check-dot bg-[#00b4d8]"></span>Community integration</li>
					<li class="flex items-start gap-2"><span class="check-dot bg-[#00b4d8]"></span>Expat social introductions</li>
				</ul>
				<a href="/services/family-lifestyle" class="mt-4 inline-flex items-center gap-1 text-sm text-[#0077b6] font-medium hover:underline">Learn more <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg></a>
			</div>

			<div class="service-card border-2 border-[#0077b6] relative overflow-hidden">
				<div class="absolute top-4 right-4 bg-[#0077b6] text-white text-xs font-semibold px-3 py-1 rounded-full">Popular</div>
				<div class="service-icon-wrap bg-blue-50">
					<svg class="w-8 h-8 text-[#0077b6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-2M12 3v1m0 0v.5"/></svg>
				</div>
				<h3 class="font-bold text-xl text-gray-900 mb-3" style="font-family:'Playfair Display',serif">
					<a href="/services/remote-worker" class="hover:text-[#0077b6] transition-colors">Remote Worker Package</a>
				</h3>
				<p class="text-gray-600 text-sm mb-4 leading-relaxed">The complete solution for digital nomads and remote workers ready to base themselves in paradise.</p>
				<ul class="space-y-2 text-sm text-gray-600">
					<li class="flex items-start gap-2"><span class="check-dot bg-[#0077b6]"></span>Premium Visa application</li>
					<li class="flex items-start gap-2"><span class="check-dot bg-[#0077b6]"></span>Co-working space setup</li>
					<li class="flex items-start gap-2"><span class="check-dot bg-[#0077b6]"></span>Tax residency guidance</li>
					<li class="flex items-start gap-2"><span class="check-dot bg-[#0077b6]"></span>Housing &amp; SIM card setup</li>
				</ul>
				<a href="/services/remote-worker" class="mt-4 inline-flex items-center gap-1 text-sm text-[#0077b6] font-medium hover:underline">Learn more <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg></a>
			</div>

		</div>
	</div>
</section>


<!-- ===================== PACKAGES ===================== -->
<section id="packages" class="py-24 bg-white">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="text-center mb-16">
			<span class="section-tag">Pricing</span>
			<h2 class="section-title mt-3">Choose Your Package</h2>
			<p class="section-subtitle">Transparent, all-inclusive relocation packages designed for every type of mover</p>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

			<div class="package-card">
				<div class="package-header bg-blue-50">
					<span class="package-icon">🌐</span>
					<h3 class="font-bold text-xl text-gray-900 mt-3" style="font-family:'Playfair Display',serif">Starter Pack</h3>
					<p class="text-gray-500 text-sm mt-1">Solo movers &amp; remote workers</p>
				</div>
				<div class="p-6">
					<div class="flex items-baseline gap-1 mb-6">
						<span class="text-gray-400 text-sm">From</span>
						<span class="text-3xl font-bold text-[#0077b6]" style="font-family:'Playfair Display',serif">€1,500</span>
					</div>
					<ul class="space-y-3 text-sm text-gray-600 mb-8">
						<li class="package-feature"><span class="feature-check">✓</span> Visa / Premium Visa application</li>
						<li class="package-feature"><span class="feature-check">✓</span> Document checklist &amp; preparation</li>
						<li class="package-feature"><span class="feature-check">✓</span> Housing orientation (1 week)</li>
						<li class="package-feature"><span class="feature-check">✓</span> Bank account setup assistance</li>
						<li class="package-feature"><span class="feature-check">✓</span> SIM card &amp; internet setup</li>
						<li class="package-feature text-gray-300"><span>✗</span> Family school search</li>
						<li class="package-feature text-gray-300"><span>✗</span> Company formation</li>
					</ul>
					<a href="#contact" class="btn-outline w-full text-center block py-3 rounded-xl">Get Started</a>
				</div>
			</div>

			<div class="package-card ring-2 ring-[#0077b6] relative">
				<div class="absolute -top-4 left-1/2 -translate-x-1/2">
					<span class="bg-[#0077b6] text-white text-xs font-bold px-4 py-1.5 rounded-full">Most Popular</span>
				</div>
				<div class="package-header bg-[#0077b6] text-white">
					<span class="package-icon">👨‍👩‍👧‍👦</span>
					<h3 class="font-bold text-xl mt-3" style="font-family:'Playfair Display',serif">Family Relocation</h3>
					<p class="text-white/70 text-sm mt-1">Complete family move</p>
				</div>
				<div class="p-6">
					<div class="flex items-baseline gap-1 mb-6">
						<span class="text-gray-400 text-sm">From</span>
						<span class="text-3xl font-bold text-[#0077b6]" style="font-family:'Playfair Display',serif">€4,500</span>
					</div>
					<ul class="space-y-3 text-sm text-gray-600 mb-8">
						<li class="package-feature"><span class="feature-check">✓</span> Full visa &amp; permit handling</li>
						<li class="package-feature"><span class="feature-check">✓</span> Property search &amp; lease</li>
						<li class="package-feature"><span class="feature-check">✓</span> Removals coordination</li>
						<li class="package-feature"><span class="feature-check">✓</span> School search &amp; enrolment</li>
						<li class="package-feature"><span class="feature-check">✓</span> Healthcare orientation</li>
						<li class="package-feature"><span class="feature-check">✓</span> Banking &amp; utilities setup</li>
						<li class="package-feature"><span class="feature-check">✓</span> 3-month aftercare support</li>
					</ul>
					<a href="#contact" class="btn-primary w-full text-center block py-3 rounded-xl">Get Started</a>
				</div>
			</div>

			<div class="package-card">
				<div class="package-header bg-green-50">
					<span class="package-icon">💼</span>
					<h3 class="font-bold text-xl text-gray-900 mt-3" style="font-family:'Playfair Display',serif">Investor &amp; Entrepreneur</h3>
					<p class="text-gray-500 text-sm mt-1">Business-focused movers</p>
				</div>
				<div class="p-6">
					<div class="flex items-baseline gap-1 mb-6">
						<span class="text-gray-400 text-sm">From</span>
						<span class="text-3xl font-bold text-[#2d6a4f]" style="font-family:'Playfair Display',serif">€6,000</span>
					</div>
					<ul class="space-y-3 text-sm text-gray-600 mb-8">
						<li class="package-feature"><span class="feature-check text-[#2d6a4f]">✓</span> Investor / Occupation Permit</li>
						<li class="package-feature"><span class="feature-check text-[#2d6a4f]">✓</span> Company formation (GBL/domestic)</li>
						<li class="package-feature"><span class="feature-check text-[#2d6a4f]">✓</span> Tax &amp; legal advisory</li>
						<li class="package-feature"><span class="feature-check text-[#2d6a4f]">✓</span> Corporate bank account</li>
						<li class="package-feature"><span class="feature-check text-[#2d6a4f]">✓</span> Premium property search</li>
						<li class="package-feature"><span class="feature-check text-[#2d6a4f]">✓</span> Full family relocation</li>
						<li class="package-feature"><span class="feature-check text-[#2d6a4f]">✓</span> 6-month concierge support</li>
					</ul>
					<a href="#contact" class="btn-outline-green w-full text-center block py-3 rounded-xl">Get Started</a>
				</div>
			</div>

			<div class="package-card">
				<div class="package-header" style="background:rgba(244,228,193,0.3)">
					<span class="package-icon">🌅</span>
					<h3 class="font-bold text-xl text-gray-900 mt-3" style="font-family:'Playfair Display',serif">Retirement Escape</h3>
					<p class="text-gray-500 text-sm mt-1">Retirees &amp; lifestyle seekers</p>
				</div>
				<div class="p-6">
					<div class="flex items-baseline gap-1 mb-6">
						<span class="text-gray-400 text-sm">From</span>
						<span class="text-3xl font-bold text-[#c9a96e]" style="font-family:'Playfair Display',serif">€2,800</span>
					</div>
					<ul class="space-y-3 text-sm text-gray-600 mb-8">
						<li class="package-feature"><span class="feature-check text-[#c9a96e]">✓</span> Retired Non-Citizen Permit</li>
						<li class="package-feature"><span class="feature-check text-[#c9a96e]">✓</span> Property &amp; rental search</li>
						<li class="package-feature"><span class="feature-check text-[#c9a96e]">✓</span> Healthcare &amp; insurance setup</li>
						<li class="package-feature"><span class="feature-check text-[#c9a96e]">✓</span> Removals coordination</li>
						<li class="package-feature"><span class="feature-check text-[#c9a96e]">✓</span> Social &amp; lifestyle integration</li>
						<li class="package-feature"><span class="feature-check text-[#c9a96e]">✓</span> Banking &amp; pension setup</li>
						<li class="package-feature"><span class="feature-check text-[#c9a96e]">✓</span> Ongoing concierge access</li>
					</ul>
					<a href="#contact" class="btn-outline-sand w-full text-center block py-3 rounded-xl">Get Started</a>
				</div>
			</div>

		</div>
		<p class="text-center text-gray-500 text-sm mt-10">
			All packages are customisable. <a href="#contact" class="text-[#0077b6] hover:underline">Contact us</a> to build a bespoke plan for your situation.
		</p>
	</div>
</section>


<!-- ===================== TESTIMONIALS ===================== -->
<section id="testimonials" class="py-24 bg-[#005f8a] text-white overflow-hidden">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="text-center mb-16">
			<span class="inline-block bg-white/10 text-white/80 text-sm font-medium px-4 py-1.5 rounded-full mb-3">Client Stories</span>
			<h2 class="font-bold text-4xl lg:text-5xl" style="font-family:'Playfair Display',serif">What Our Clients Say</h2>
		</div>
		<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
			{#each [
				{ initials: 'JB', name: 'James & Sarah B.', from: 'London → Grand Baie, 2024', quote: "Moving our family of four from London to Mauritius seemed overwhelming. Live Mauritius handled everything — from our permits to finding the perfect villa in Tamarin. We arrived to a fully set-up home. Absolutely seamless." },
				{ initials: 'MK', name: 'Martin K.', from: 'Amsterdam → Flic en Flac, 2025', quote: "As a remote consultant, I needed the Premium Visa fast. Live Mauritius had my application ready in days and walked me through every step. I was living in Flic en Flac within 6 weeks of my first call. Incredible team." },
				{ initials: 'PD', name: 'Patricia D.', from: 'Cape Town → Bel Ombre, 2024', quote: "Retiring to Mauritius was my dream, but the paperwork felt impossible. Live Mauritius turned a complex process into a clear, manageable journey. They even helped me find a wonderful community of expats. I wish I'd done this years ago." },
			] as t}
				<div class="testimonial-card">
					<div class="flex text-[#c9a96e] mb-4">★★★★★</div>
					<p class="text-white/80 text-sm leading-relaxed mb-6">"{t.quote}"</p>
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


<!-- ===================== ABOUT ===================== -->
<section id="about" class="py-24 bg-white">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
			<div class="relative">
				<img
					src="https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?w=800&q=80&fit=crop"
					alt="Port Louis Mauritius"
					class="rounded-2xl w-full h-[500px] object-cover shadow-xl"
				/>
				<div class="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-lg p-5 w-52">
					<div class="font-bold text-3xl text-[#0077b6]" style="font-family:'Playfair Display',serif">12+</div>
					<div class="text-gray-600 text-sm mt-1">Years based in Port Louis, Mauritius</div>
				</div>
			</div>

			<div>
				<span class="section-tag">Who We Are</span>
				<h2 class="section-title mt-3">Local Experts,<br/>Global Experience</h2>
				<p class="text-gray-600 leading-relaxed mt-6">
					Live Mauritius was founded by a team of relocation specialists, lawyers, and local advisors who believe that moving to a new country should be an exciting adventure — not a bureaucratic nightmare.
				</p>
				<p class="text-gray-600 leading-relaxed mt-4">
					Based in Port Louis, we combine deep local knowledge with international expertise to serve clients from Europe, the Middle East, Africa, and beyond.
				</p>

				<div class="mt-8 grid grid-cols-2 gap-4">
					{#each [
						{ val: '40+', label: 'Nationalities served' },
						{ val: 'Port Louis', label: 'Headquartered locally' },
						{ val: 'EN / FR / AR', label: 'Languages spoken' },
						{ val: 'End-to-end', label: 'Relocation coverage' },
					] as stat}
						<div class="rounded-xl p-4 bg-[#fdf6ec]">
							<div class="font-bold text-2xl text-[#0077b6]" style="font-family:'Playfair Display',serif">{stat.val}</div>
							<div class="text-gray-600 text-sm mt-1">{stat.label}</div>
						</div>
					{/each}
				</div>

				<a href="#contact" class="btn-primary mt-8 inline-flex items-center gap-2 px-8 py-4">
					Talk to Our Team
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
				</a>
			</div>
		</div>
	</div>
</section>


<!-- ===================== FAQ ===================== -->
<section id="faq" class="py-24 bg-[#fdf6ec]">
	<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="text-center mb-16">
			<span class="section-tag">FAQs</span>
			<h2 class="section-title mt-3">Common Questions</h2>
			<p class="section-subtitle">Everything you need to know before starting your Mauritius journey</p>
		</div>

		<div class="space-y-4">
			{#each faqs as faq, i}
				<div class="faq-item" class:open={openFaq === i}>
					<button class="faq-btn" onclick={() => toggleFaq(i)}>
						<span>{faq.q}</span>
						<svg class="faq-arrow w-5 h-5 text-[#0077b6] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
						</svg>
					</button>
					<div class="faq-answer">
						<p>{@html faq.a}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>


<!-- ===================== CONTACT ===================== -->
<section id="contact" class="py-24 bg-white">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-16">

			<div>
				<span class="section-tag">Contact Us</span>
				<h2 class="section-title mt-3">Start Your Journey<br/>to Mauritius</h2>
				<p class="text-gray-600 leading-relaxed mt-6">
					Whether you have a specific question or just want to explore your options, our team is here to help. We offer a <strong>free 30-minute consultation</strong> to assess your profile and outline the best path forward.
				</p>

				<div class="mt-10 space-y-5">
					<div class="flex items-start gap-4">
						<div class="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
							<svg class="w-5 h-5 text-[#0077b6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
						</div>
						<div>
							<div class="font-semibold text-gray-900">Address</div>
							<div class="text-gray-600 text-sm">Level 5, Ebene Esplanade, Port Louis, Mauritius</div>
						</div>
					</div>
					<div class="flex items-start gap-4">
						<div class="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
							<svg class="w-5 h-5 text-[#0077b6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
						</div>
						<div>
							<div class="font-semibold text-gray-900">Email</div>
							<div class="text-gray-600 text-sm">hello@livemauritius.com</div>
						</div>
					</div>
					<div class="flex items-start gap-4">
						<div class="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
							<svg class="w-5 h-5 text-[#0077b6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
						</div>
						<div>
							<div class="font-semibold text-gray-900">Phone / WhatsApp</div>
							<div class="text-gray-600 text-sm">+230 5700 0000</div>
						</div>
					</div>
				</div>

				<img
					src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=700&q=80&fit=crop"
					alt="Modern Mauritius home"
					class="mt-10 rounded-2xl w-full h-52 object-cover shadow-md"
				/>
			</div>

			<div>
				<form onsubmit={handleContact} class="bg-[#fdf6ec] rounded-2xl p-8 shadow-sm space-y-5">
					<div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
						<div>
							<label class="form-label">Full Name *</label>
							<input type="text" name="name" required class="form-input" placeholder="Your name" />
						</div>
						<div>
							<label class="form-label">Email Address *</label>
							<input type="email" name="email" required class="form-input" placeholder="you@email.com" />
						</div>
					</div>
					<div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
						<div>
							<label class="form-label">Phone / WhatsApp</label>
							<input type="tel" name="phone" class="form-input" placeholder="+44 7700 000000" />
						</div>
						<div>
							<label class="form-label">Nationality *</label>
							<input type="text" name="nationality" required class="form-input" placeholder="e.g. British, French..." />
						</div>
					</div>
					<div>
						<label class="form-label">Service of Interest</label>
						<select name="service" class="form-input">
							<option value="">— Select a service —</option>
							<option>Visa &amp; Residency</option>
							<option>Housing &amp; Settling In</option>
							<option>Logistics &amp; Moving</option>
							<option>Legal &amp; Financial</option>
							<option>Family &amp; Lifestyle</option>
							<option>Remote Worker Package</option>
							<option>Starter Pack</option>
							<option>Family Relocation Package</option>
							<option>Investor &amp; Entrepreneur Package</option>
							<option>Retirement Escape Package</option>
							<option>Not sure yet</option>
						</select>
					</div>
					<div>
						<label class="form-label">Message</label>
						<textarea name="message" rows="4" class="form-input resize-none" placeholder="Tell us about your plans and any questions you have..."></textarea>
					</div>
					<button type="submit" class="btn-primary w-full py-4 text-base" disabled={submitting}>
						{submitting ? 'Sending…' : "Send Message — It's Free"}
					</button>
					<p class="text-center text-gray-400 text-xs">We respond within 24 hours. No spam, ever.</p>
				</form>
			</div>
		</div>
	</div>
</section>

<!-- Toast -->
{#if toast}
	<div class="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#2d6a4f] text-white px-6 py-3 rounded-xl shadow-lg text-sm font-medium z-50">
		✓ Message sent! We'll be in touch within 24 hours.
	</div>
{/if}
