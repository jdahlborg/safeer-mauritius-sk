<svelte:head>
	<title>About Us — Safeer Properties</title>
	<meta name="description" content="Learn about Safeer Properties — who we are, our mission, and how we help people relocate to Mauritius." />
</svelte:head>

<!-- Hero -->
<section class="pt-32 pb-16 bg-gradient-to-b from-[#f0f7ff] to-white">
	<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
		<span class="section-tag">Our Story</span>
		<h1 class="mt-4 text-4xl sm:text-5xl font-bold text-gray-900 leading-tight" style="font-family:'Playfair Display',serif">
			Making Mauritius <span class="text-[#0077b6]">Home</span>
		</h1>
		<p class="mt-6 text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
			Safeer Properties was born from a simple conviction: relocating to Mauritius should be exciting, not overwhelming. We bring together local expertise and personalised service so every client arrives with confidence.
		</p>
	</div>
</section>

<!-- Mission & Values -->
<section class="py-20 bg-white">
	<div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
			<div>
				<span class="section-tag">Mission</span>
				<h2 class="mt-3 text-3xl font-bold text-gray-900" style="font-family:'Playfair Display',serif">
					More than a property portal
				</h2>
				<p class="mt-5 text-gray-600 leading-relaxed">
					We don't just list properties — we guide you through every step of the relocation journey. From your first property search to the day you pick up your keys (and beyond), our team is with you.
				</p>
				<p class="mt-4 text-gray-600 leading-relaxed">
					Mauritius offers an exceptional quality of life: a stable economy, favourable tax regime, year-round sunshine, and a welcoming multicultural society. Our job is to make sure nothing stands between you and that life.
				</p>
			</div>
			<div class="grid grid-cols-2 gap-4">
				{#each [
					{ icon: '🏡', title: 'Curated Listings', desc: 'Hand-picked properties from trusted sources and partner agencies across the island.' },
					{ icon: '🤝', title: 'Personal Guidance', desc: 'Dedicated advisors who know the local market, regulations, and community.' },
					{ icon: '⚖️', title: 'End-to-End Support', desc: 'Legal, financial, logistics, and lifestyle — we coordinate the full picture.' },
					{ icon: '🔒', title: 'Trusted & Transparent', desc: 'No hidden fees, clear advice, and honest recommendations at every stage.' },
				] as v}
					<div class="bg-gray-50 rounded-2xl p-5">
						<div class="text-3xl mb-3">{v.icon}</div>
						<h3 class="font-semibold text-gray-900 text-sm mb-1">{v.title}</h3>
						<p class="text-gray-500 text-xs leading-relaxed">{v.desc}</p>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>

<!-- Why Mauritius snapshot -->
<section class="py-20 bg-[#f8fafc]">
	<div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="text-center mb-12">
			<span class="section-tag">The Island</span>
			<h2 class="mt-3 text-3xl font-bold text-gray-900" style="font-family:'Playfair Display',serif">Why Mauritius?</h2>
		</div>
		<div class="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
			{#each [
				{ stat: '0%', label: 'Capital gains tax' },
				{ stat: '15%', label: 'Flat income tax' },
				{ stat: '330+', label: 'Sunny days per year' },
				{ stat: '1.3M', label: 'Population, diverse & welcoming' },
			] as s}
				<div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
					<div class="text-3xl font-bold text-[#0077b6]" style="font-family:'Playfair Display',serif">{s.stat}</div>
					<div class="text-sm text-gray-500 mt-2 leading-snug">{s.label}</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Team / Contact CTA -->
<section class="py-20 bg-white">
	<div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
		<span class="section-tag">Get in Touch</span>
		<h2 class="mt-3 text-3xl font-bold text-gray-900" style="font-family:'Playfair Display',serif">
			Ready to make the move?
		</h2>
		<p class="mt-5 text-gray-500 leading-relaxed">
			Whether you have a question, need advice, or are ready to start your property search — we'd love to hear from you.
		</p>
		<div class="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
			<a href="/#contact" class="btn-primary px-8 py-3">Contact us</a>
			<a href="/properties" class="btn-outline px-8 py-3">Browse properties</a>
		</div>
	</div>
</section>
