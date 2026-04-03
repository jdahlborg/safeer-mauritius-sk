<svelte:head>
	<title>Partner with Safeer Properties — Reach International Buyers in Mauritius</title>
	<meta name="description" content="Safeer Properties connects Mauritius property developers and agencies with qualified international buyers. List your properties and reach a global audience today." />
</svelte:head>

<!-- Hero -->
<section class="relative pt-32 pb-24 bg-[#002f4b] text-white overflow-hidden">
	<div class="absolute inset-0">
		<img src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1920&q=80&fit=crop" alt="Mauritius luxury property development" class="w-full h-full object-cover opacity-15" />
	</div>
	<div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="max-w-3xl">
			<span class="inline-block bg-[#c9a96e]/20 text-[#c9a96e] text-sm font-semibold px-4 py-1.5 rounded-full mb-6 tracking-wide uppercase">For Property Developers & Agencies</span>
			<h1 class="font-bold text-5xl lg:text-6xl mb-6 leading-tight" style="font-family:'Playfair Display',serif">
				Reach Serious International Buyers
			</h1>
			<p class="text-white/75 text-xl leading-relaxed mb-10 max-w-2xl">
				Safeer Properties connects European, South African, and global buyers actively searching for property in Mauritius. We pre-qualify interest, provide context, and deliver warm leads — not cold clicks.
			</p>
			<div class="flex flex-wrap gap-4">
				<a href="#contact" class="bg-[#c9a96e] text-white font-semibold px-8 py-4 rounded-xl hover:bg-[#b8935a] transition-colors inline-flex items-center gap-2">
					Get Started as a Partner
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
				</a>
				<a href="#how-it-works" class="border border-white/30 text-white font-medium px-8 py-4 rounded-xl hover:bg-white/10 transition-colors">
					See How It Works
				</a>
			</div>
		</div>
	</div>
</section>

<!-- Stats bar -->
<section class="bg-[#0077b6] text-white py-6">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
			{#each [
				{ value: '40+', label: 'Countries We Reach' },
				{ value: '€500k+', label: 'Avg. Buyer Budget' },
				{ value: '6 months', label: 'Avg. Decision Timeline' },
				{ value: 'Free', label: 'To List Your Properties' },
			] as stat}
				<div>
					<div class="text-3xl font-bold" style="font-family:'Playfair Display',serif">{stat.value}</div>
					<div class="text-white/70 text-sm mt-1">{stat.label}</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- The problem -->
<section class="py-20 bg-white">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
			<div>
				<span class="inline-block bg-red-50 text-red-600 text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wide">The Challenge</span>
				<h2 class="text-4xl font-bold text-gray-900 mb-6 leading-tight" style="font-family:'Playfair Display',serif">
					International Buyers Are Hard to Reach From Mauritius
				</h2>
				<div class="space-y-4 text-gray-600 leading-relaxed">
					<p>Most property portals and agencies in Mauritius are optimised for local buyers. But the highest-value transactions — PDS, IRS, and luxury rentals — come from international buyers who require a very different approach.</p>
					<p>They have questions about visas, tax residency, banking, schooling, and healthcare long before they're ready to make an offer. Standard listings don't address these concerns.</p>
					<p>Safeer Properties bridges that gap. We provide the full relocation context international buyers need — and pass the qualified, motivated enquiries directly to you.</p>
				</div>
			</div>
			<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
				{#each [
					{ icon: '🌍', problem: 'Buyers unfamiliar with Mauritius property law', solution: 'We explain PDS, IRS, RES, and legal requirements upfront' },
					{ icon: '🛂', problem: 'Visa & residency questions slow decisions', solution: 'We pre-educate on Premium Visa, Occupation Permit, and RP routes' },
					{ icon: '💶', problem: 'Currency, tax, and banking uncertainty', solution: 'We clarify flat 15% tax, no CGT, and banking setup process' },
					{ icon: '📞', problem: 'Cold leads waste agent time', solution: 'Leads arrive pre-informed and genuinely motivated' },
				] as item}
					<div class="bg-gray-50 rounded-2xl p-5 border border-gray-100">
						<div class="text-2xl mb-3">{item.icon}</div>
						<p class="text-xs font-semibold text-red-500 uppercase tracking-wide mb-2">Without us</p>
						<p class="text-sm text-gray-500 mb-3">{item.problem}</p>
						<p class="text-xs font-semibold text-[#2d6a4f] uppercase tracking-wide mb-2">With Safeer</p>
						<p class="text-sm text-gray-700 font-medium">{item.solution}</p>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>

<!-- How it works -->
<section id="how-it-works" class="py-20 bg-gray-50">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="text-center mb-14">
			<span class="inline-block bg-[#0077b6]/10 text-[#0077b6] text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wide">The Process</span>
			<h2 class="text-4xl font-bold text-gray-900 mb-4" style="font-family:'Playfair Display',serif">How the Partnership Works</h2>
			<p class="text-gray-500 max-w-xl mx-auto">Simple, transparent, and built around results — not vanity metrics.</p>
		</div>
		<div class="grid grid-cols-1 md:grid-cols-4 gap-6">
			{#each [
				{ step: '01', title: 'You Share Your Listings', desc: 'Send us your active listings — we add them to the Safeer Properties portal with full details, photos, and pricing.' },
				{ step: '02', title: 'We Attract International Buyers', desc: 'Our content, SEO, and partner network brings qualified Europeans, South Africans, and expats actively looking to buy or rent in Mauritius.' },
				{ step: '03', title: 'Buyers Get Pre-Educated', desc: 'Before contacting you, buyers have already read about property schemes, visa options, tax benefits, and the relocation process.' },
				{ step: '04', title: 'Warm Leads Delivered to You', desc: 'Qualified enquiries are forwarded directly to your team — buyers who are informed, motivated, and ready to talk seriously.' },
			] as item}
				<div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative">
					<div class="text-5xl font-bold text-[#0077b6]/10 mb-4" style="font-family:'Playfair Display',serif">{item.step}</div>
					<h3 class="font-bold text-gray-900 mb-3">{item.title}</h3>
					<p class="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Who it's for -->
<section class="py-20 bg-white">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="text-center mb-14">
			<span class="inline-block bg-[#c9a96e]/15 text-[#c9a96e] text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wide">Ideal Partners</span>
			<h2 class="text-4xl font-bold text-gray-900 mb-4" style="font-family:'Playfair Display',serif">Who We Work With</h2>
			<p class="text-gray-500 max-w-xl mx-auto">We partner with reputable developers and agencies across Mauritius who want to grow their international sales.</p>
		</div>
		<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
			{#each [
				{
					title: 'Property Developers',
					icon: '🏗️',
					color: '#0077b6',
					points: [
						'PDS, IRS, RES, and G+2 apartment schemes',
						'New developments and off-plan projects',
						'Luxury villas and resort-integrated residences',
						'Smart City and EDB-approved developments',
					]
				},
				{
					title: 'Real Estate Agencies',
					icon: '🏢',
					color: '#2d6a4f',
					points: [
						'Licensed agencies with rental and sales portfolios',
						'Agencies specialising in expat and foreign buyers',
						'Long-term rental portfolios',
						'Commercial and mixed-use properties',
					]
				},
				{
					title: 'Independent Agents',
					icon: '🤝',
					color: '#c9a96e',
					points: [
						'Certified property agents with active mandates',
						'Agents with exclusive developer relationships',
						'Relocation specialists with property portfolios',
						'Referral agents in expat-heavy markets',
					]
				},
			] as partner}
				<div class="rounded-2xl border-2 p-8" style="border-color:{partner.color}25">
					<div class="text-4xl mb-4">{partner.icon}</div>
					<h3 class="text-xl font-bold text-gray-900 mb-5" style="color:{partner.color}">{partner.title}</h3>
					<ul class="space-y-3">
						{#each partner.points as point}
							<li class="flex items-start gap-2 text-sm text-gray-600">
								<svg class="w-4 h-4 mt-0.5 flex-shrink-0" style="color:{partner.color}" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
								{point}
							</li>
						{/each}
					</ul>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- What we offer -->
<section class="py-20 bg-[#002f4b] text-white">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="text-center mb-14">
			<span class="inline-block bg-white/10 text-white/70 text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wide">Partner Benefits</span>
			<h2 class="text-4xl font-bold mb-4" style="font-family:'Playfair Display',serif">What You Get as a Safeer Partner</h2>
			<p class="text-white/60 max-w-xl mx-auto">Everything you need to convert international interest into completed transactions.</p>
		</div>
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each [
				{ icon: '📋', title: 'Featured Listings', desc: 'Your properties listed prominently on safeer.mu with full details, photos, and direct enquiry routing.' },
				{ icon: '🌐', title: 'International SEO Reach', desc: 'Ranking for "buy property Mauritius", "Mauritius expat housing", and country-specific queries in Europe and beyond.' },
				{ icon: '🎓', title: 'Pre-Educated Buyers', desc: 'Every lead has already read our guides on PDS/IRS schemes, visas, tax, and relocation — no time wasted on basics.' },
				{ icon: '📞', title: 'Direct Lead Forwarding', desc: 'Enquiries forwarded to your WhatsApp, email, or CRM — with the buyer\'s context so your agents can respond with precision.' },
				{ icon: '✍️', title: 'Editorial Coverage', desc: 'Opportunity to be featured in our relocation guides and "why Mauritius" content shared across our audience.' },
				{ icon: '📊', title: 'Transparent Reporting', desc: 'Regular updates on listing views, enquiry volume, and buyer profile breakdown — so you know what\'s working.' },
			] as benefit}
				<div class="bg-white/5 rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-colors">
					<div class="text-3xl mb-4">{benefit.icon}</div>
					<h3 class="font-bold text-white mb-2">{benefit.title}</h3>
					<p class="text-white/60 text-sm leading-relaxed">{benefit.desc}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Buyer profile -->
<section class="py-20 bg-white">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
			<div>
				<span class="inline-block bg-[#0077b6]/10 text-[#0077b6] text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wide">Our Audience</span>
				<h2 class="text-4xl font-bold text-gray-900 mb-6 leading-tight" style="font-family:'Playfair Display',serif">
					Who We Send You
				</h2>
				<p class="text-gray-600 leading-relaxed mb-8">Our buyers are not casually browsing. They have researched Mauritius specifically, understand the investment case, and are actively comparing properties. Here's who reaches out:</p>
				<div class="space-y-4">
					{#each [
						{ label: 'European retirees seeking tax-efficient residency', pct: 35 },
						{ label: 'Remote workers relocating from EU or UK', pct: 28 },
						{ label: 'South African expats and investors', pct: 22 },
						{ label: 'HNWIs seeking Mauritius as a second home', pct: 15 },
					] as segment}
						<div>
							<div class="flex justify-between text-sm mb-1">
								<span class="text-gray-700">{segment.label}</span>
								<span class="text-gray-400 font-medium">{segment.pct}%</span>
							</div>
							<div class="h-2 bg-gray-100 rounded-full overflow-hidden">
								<div class="h-full bg-[#0077b6] rounded-full" style="width:{segment.pct}%"></div>
							</div>
						</div>
					{/each}
				</div>
				<p class="text-gray-400 text-xs mt-4">Based on enquiry profiles. Indicative figures.</p>
			</div>
			<div class="bg-gray-50 rounded-2xl p-8 border border-gray-100">
				<h3 class="font-bold text-gray-900 text-lg mb-6">Typical Buyer Profile</h3>
				<div class="space-y-5">
					{#each [
						{ label: 'Age range', value: '42–65' },
						{ label: 'Origin', value: 'France, Germany, UK, Netherlands, South Africa' },
						{ label: 'Budget (buy)', value: 'USD 250,000 – 2,000,000+' },
						{ label: 'Budget (rent)', value: 'EUR 1,200 – 4,000 / month' },
						{ label: 'Decision timeline', value: '3–9 months' },
						{ label: 'Primary motivation', value: 'Tax residency, lifestyle, retirement' },
						{ label: 'Secondary motivation', value: 'Investment return, Permanent Residence' },
					] as row}
						<div class="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0 last:pb-0">
							<span class="text-gray-500 text-sm">{row.label}</span>
							<span class="text-gray-900 font-semibold text-sm text-right max-w-[55%]">{row.value}</span>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Testimonial/Social proof placeholder -->
<section class="py-16 bg-gray-50">
	<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
		<div class="bg-white rounded-2xl p-10 shadow-sm border border-gray-100">
			<div class="text-4xl mb-6">🤝</div>
			<blockquote class="text-xl text-gray-700 leading-relaxed mb-6 italic" style="font-family:'Playfair Display',serif">
				"We started receiving enquiries from qualified European buyers within weeks of listing with Safeer. The leads came with real context — buyers who already understood PDS requirements and had a clear budget."
			</blockquote>
			<div class="text-gray-500 text-sm font-medium">— Property Developer Partner, Grand Baie</div>
		</div>
	</div>
</section>

<!-- Pricing -->
<section class="py-20 bg-white">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="text-center mb-14">
			<span class="inline-block bg-[#2d6a4f]/10 text-[#2d6a4f] text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wide">Simple Pricing</span>
			<h2 class="text-4xl font-bold text-gray-900 mb-4" style="font-family:'Playfair Display',serif">Transparent, No Surprises</h2>
			<p class="text-gray-500 max-w-xl mx-auto">Start for free. Upgrade when you see results.</p>
		</div>
		<div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
			{#each [
				{
					tier: 'Free Listing',
					price: 'Free',
					period: 'always',
					color: '#0077b6',
					highlight: false,
					features: [
						'Up to 5 property listings',
						'Standard placement on portal',
						'Enquiries forwarded by email',
						'Basic listing detail page',
					],
					cta: 'List for Free',
				},
				{
					tier: 'Featured Partner',
					price: 'Contact Us',
					period: 'for pricing',
					color: '#c9a96e',
					highlight: true,
					features: [
						'Unlimited listings',
						'Featured placement (top of results)',
						'Priority lead forwarding',
						'Co-branded editorial coverage',
						'Quarterly buyer audience report',
						'Partner badge on your listings',
					],
					cta: 'Become a Featured Partner',
				},
				{
					tier: 'Exclusive Mandate',
					price: 'Revenue share',
					period: 'on completed sales',
					color: '#2d6a4f',
					highlight: false,
					features: [
						'Full concierge lead handling',
						'We manage buyer pre-qualification',
						'Dedicated account manager',
						'Custom landing page for your project',
						'Referral from our relocation clients',
					],
					cta: 'Discuss Mandate',
				},
			] as plan}
				<div class="rounded-2xl border-2 p-8 flex flex-col {plan.highlight ? 'shadow-xl' : 'shadow-sm'}" style="border-color:{plan.highlight ? plan.color : plan.color + '30'}; {plan.highlight ? 'background: linear-gradient(135deg, #fdf8ef 0%, #fff 100%)' : ''}">
					{#if plan.highlight}
						<div class="text-xs font-bold uppercase tracking-widest mb-4" style="color:{plan.color}">Most Popular</div>
					{/if}
					<div class="font-bold text-xl text-gray-900 mb-2">{plan.tier}</div>
					<div class="mb-6">
						<span class="text-3xl font-bold" style="color:{plan.color};font-family:'Playfair Display',serif">{plan.price}</span>
						{#if plan.period}<span class="text-gray-400 text-sm ml-1">{plan.period}</span>{/if}
					</div>
					<ul class="space-y-3 mb-8 flex-1">
						{#each plan.features as feature}
							<li class="flex items-start gap-2 text-sm text-gray-600">
								<svg class="w-4 h-4 mt-0.5 flex-shrink-0" style="color:{plan.color}" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
								{feature}
							</li>
						{/each}
					</ul>
					<a href="#contact" class="block text-center font-semibold px-6 py-3 rounded-xl transition-colors" style="{plan.highlight ? `background:${plan.color}; color:white` : `border:2px solid ${plan.color}; color:${plan.color}`}">
						{plan.cta}
					</a>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Contact form -->
<section id="contact" class="py-20 bg-[#002f4b] text-white">
	<div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="text-center mb-12">
			<span class="inline-block bg-white/10 text-white/70 text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wide">Get Started</span>
			<h2 class="text-4xl font-bold mb-4" style="font-family:'Playfair Display',serif">Partner with Safeer Properties</h2>
			<p class="text-white/60">Tell us about your properties and we'll be in touch within one business day.</p>
		</div>
		<form
			action="https://formspree.io/f/hello@safeer.mu"
			method="POST"
			class="bg-white/5 rounded-2xl p-8 border border-white/10 space-y-5"
		>
			<div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
				<div>
					<label class="block text-sm font-medium text-white/70 mb-1.5">Your Name *</label>
					<input type="text" name="name" required class="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#c9a96e] transition-colors" placeholder="Jean Dupont" />
				</div>
				<div>
					<label class="block text-sm font-medium text-white/70 mb-1.5">Company / Agency *</label>
					<input type="text" name="company" required class="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#c9a96e] transition-colors" placeholder="Ally's Real Estate" />
				</div>
			</div>
			<div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
				<div>
					<label class="block text-sm font-medium text-white/70 mb-1.5">Email Address *</label>
					<input type="email" name="email" required class="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#c9a96e] transition-colors" placeholder="you@agency.mu" />
				</div>
				<div>
					<label class="block text-sm font-medium text-white/70 mb-1.5">WhatsApp / Phone</label>
					<input type="tel" name="phone" class="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#c9a96e] transition-colors" placeholder="+230 5700 0000" />
				</div>
			</div>
			<div>
				<label class="block text-sm font-medium text-white/70 mb-1.5">What type of partner are you?</label>
				<select name="partner_type" class="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#c9a96e] transition-colors">
					<option value="" class="text-gray-900">Select one…</option>
					<option value="developer" class="text-gray-900">Property Developer</option>
					<option value="agency" class="text-gray-900">Real Estate Agency</option>
					<option value="agent" class="text-gray-900">Independent Agent</option>
					<option value="other" class="text-gray-900">Other</option>
				</select>
			</div>
			<div>
				<label class="block text-sm font-medium text-white/70 mb-1.5">Tell us about your portfolio</label>
				<textarea name="message" rows="4" class="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#c9a96e] transition-colors resize-none" placeholder="Number of listings, property types, price range, target buyers…"></textarea>
			</div>
			<button type="submit" class="w-full bg-[#c9a96e] text-white font-bold py-4 rounded-xl hover:bg-[#b8935a] transition-colors flex items-center justify-center gap-2">
				Send Partner Enquiry
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
			</button>
			<p class="text-white/40 text-xs text-center">We respond within one business day. No spam, ever.</p>
		</form>
	</div>
</section>
