<script lang="ts">
	import { page } from '$app/stores';
	let { children } = $props();

	const navItems = [
		{ href: '/admin', label: 'Listings', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
		{ href: '/admin/partners', label: 'Partners', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
	];
</script>

<div class="min-h-screen bg-gray-50">
	<!-- Admin top bar -->
	<div class="fixed top-20 left-0 right-0 z-40 bg-white border-b border-gray-200 shadow-sm">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<nav class="flex gap-1">
				{#each navItems as item}
					{@const active = $page.url.pathname === item.href}
					<a
						href={item.href}
						class="flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors"
						class:border-[#0077b6]={active}
						class:text-[#0077b6]={active}
						class:border-transparent={!active}
						class:text-gray-500={!active}
						class:hover:text-gray-700={!active}
					>
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={item.icon}/>
						</svg>
						{item.label}
					</a>
				{/each}
			</nav>
		</div>
	</div>

	<!-- Content pushed below both navbars -->
	<div class="pt-[128px]">
		{@render children()}
	</div>
</div>
