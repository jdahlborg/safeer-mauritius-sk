<script lang="ts">
	import { page } from '$app/stores';

	let mobileOpen = $state(false);

	const links = [
		{ href: '/properties', label: 'Properties' },
		{ href: '/#services', label: 'Services' },
		{ href: '/#why-mauritius', label: 'Why Mauritius' },
		{ href: '/#faq', label: 'FAQ' },
	];
</script>

<header class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/95 backdrop-blur-sm shadow-sm">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex items-center justify-between h-20">
			<!-- Logo -->
			<a href="/" class="flex items-center gap-3">
				<div class="w-10 h-10 rounded-full bg-gradient-to-br from-[#0077b6] to-[#00b4d8] flex items-center justify-center">
					<span class="text-white font-bold text-lg" style="font-family:'Playfair Display',serif">S</span>
				</div>
				<div>
					<span class="font-bold text-xl text-[#005f8a]" style="font-family:'Playfair Display',serif">Live</span>
					<span class="font-bold text-xl text-[#c9a96e]" style="font-family:'Playfair Display',serif"> Mauritius</span>
				</div>
			</a>

			<!-- Desktop Nav -->
			<nav class="hidden lg:flex items-center gap-8">
				{#each links as link}
					<a href={link.href} class="nav-link">{link.label}</a>
				{/each}
				<a href="/properties" class="btn-primary text-sm px-5 py-2.5">Browse Properties</a>
			</nav>

			<!-- Hamburger -->
			<button
				onclick={() => (mobileOpen = !mobileOpen)}
				class="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
				aria-label="Toggle menu"
			>
				<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					{#if mobileOpen}
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
					{:else}
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
					{/if}
				</svg>
			</button>
		</div>
	</div>

	<!-- Mobile Menu -->
	{#if mobileOpen}
		<div class="lg:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3">
			<a href="/" class="mobile-nav-link" onclick={() => (mobileOpen = false)}>Home</a>
			{#each links as link}
				<a href={link.href} class="mobile-nav-link" onclick={() => (mobileOpen = false)}>{link.label}</a>
			{/each}
			<a href="/#contact" class="mobile-nav-link" onclick={() => (mobileOpen = false)}>Contact</a>
		</div>
	{/if}
</header>
