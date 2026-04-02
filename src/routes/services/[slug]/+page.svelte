<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const s = data.service;

	let openFaq = $state<number | null>(null);
</script>

<svelte:head>
	<title>{s.title} — Safeer Properties Mauritius</title>
	<meta name="description" content={s.tagline} />
</svelte:head>

<!-- Hero -->
<section class="relative pt-32 pb-20 text-white overflow-hidden" style="background:{s.color}">
	<div class="absolute inset-0 bg-black/30"></div>
	<div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<nav class="flex items-center gap-2 text-white/60 text-sm mb-8">
			<a href="/" class="hover:text-white">Home</a>
			<span>/</span>
			<a href="/#services" class="hover:text-white">Services</a>
			<span>/</span>
			<span class="text-white">{s.title}</span>
		</nav>
		<span class="inline-block bg-white/15 text-white/80 text-sm font-medium px-4 py-1.5 rounded-full mb-4">Our Services</span>
		<h1 class="font-bold text-5xl lg:text-6xl mb-4" style="font-family:'Playfair Display',serif">{s.title}</h1>
		<p class="text-white/80 text-xl max-w-2xl">{s.tagline}</p>
	</div>
</section>

<!-- Content -->
<section class="py-20 bg-white">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="grid grid-cols-1 lg:grid-cols-3 gap-16">

			<!-- Main -->
			<div class="lg:col-span-2">
				<h2 class="section-title mb-6">What's Included</h2>
				<p class="text-gray-600 leading-relaxed mb-8">{s.description}</p>

				<ul class="space-y-3 mb-12">
					{#each s.items as item}
						<li class="flex items-start gap-3">
							<span class="mt-1 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold" style="background:{s.color}">✓</span>
							<span class="text-gray-700">{item}</span>
						</li>
					{/each}
				</ul>

				{#if s.faqs.length > 0}
					<h2 class="section-title mb-6">Common Questions</h2>
					<div class="space-y-4">
						{#each s.faqs as faq, i}
							<div class="faq-item" class:open={openFaq === i}>
								<button class="faq-btn" onclick={() => (openFaq = openFaq === i ? null : i)}>
									<span>{faq.q}</span>
									<svg class="faq-arrow w-5 h-5 flex-shrink-0" style="color:{s.color}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
									</svg>
								</button>
								<div class="faq-answer">
									<p>{faq.a}</p>
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</div>

			<!-- Sidebar CTA -->
			<div>
				<div class="rounded-2xl p-8 text-white sticky top-28" style="background:{s.color}">
					<h3 class="font-bold text-2xl mb-3" style="font-family:'Playfair Display',serif">Ready to Get Started?</h3>
					<p class="text-white/80 text-sm leading-relaxed mb-6">Book your free 30-minute consultation and we'll assess your profile and outline the best path forward.</p>
					<a href="/#contact" class="block w-full text-center py-3 rounded-xl font-semibold bg-white hover:bg-gray-50 transition-colors" style="color:{s.color}">
						Book Free Consultation
					</a>
					<a href="https://wa.me/2305700000" target="_blank" rel="noopener noreferrer" class="mt-3 flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold border-2 border-white/50 text-white hover:bg-white/10 transition-colors text-sm">
						<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
						WhatsApp Us
					</a>

					<div class="mt-8 pt-6 border-t border-white/20 space-y-3 text-sm text-white/70">
						<p>📍 Port Louis, Mauritius</p>
						<p>📧 hello@safeerproperties.mu</p>
						<p>📞 +230 5700 0000</p>
					</div>
				</div>
			</div>

		</div>
	</div>
</section>

<!-- Related services -->
<section class="py-16 bg-[#fdf6ec]">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<h2 class="section-title mb-8 text-center">Explore Other Services</h2>
		<div class="flex flex-wrap justify-center gap-4">
			{#each [
				{ slug: 'visa-residency', label: 'Visa & Residency' },
				{ slug: 'housing', label: 'Housing' },
				{ slug: 'logistics', label: 'Logistics' },
				{ slug: 'legal-financial', label: 'Legal & Financial' },
				{ slug: 'family-lifestyle', label: 'Family & Lifestyle' },
				{ slug: 'remote-worker', label: 'Remote Worker' },
			].filter(sv => sv.slug !== s.slug) as sv}
				<a href="/services/{sv.slug}" class="px-5 py-2.5 rounded-full border-2 border-gray-200 text-gray-700 text-sm font-medium hover:border-[#0077b6] hover:text-[#0077b6] transition-colors">
					{sv.label}
				</a>
			{/each}
		</div>
	</div>
</section>
