<script lang="ts">
	import type { ActionData } from './$types';
	import { enhance } from '$app/forms';

	let { form }: { form: ActionData } = $props();
	let submitting = $state(false);
</script>

<svelte:head>
	<title>Sign In — Safeer Properties</title>
</svelte:head>

<div class="min-h-screen bg-[#fdf6ec] flex items-center justify-center px-4 pt-24 pb-16">
	<div class="w-full max-w-md">

		<!-- Logo -->
		<div class="text-center mb-8">
			<a href="/" class="inline-flex items-center gap-3 mb-6">
				<div class="w-12 h-12 rounded-full bg-gradient-to-br from-[#0077b6] to-[#00b4d8] flex items-center justify-center">
					<span class="text-white font-bold text-xl" style="font-family:'Playfair Display',serif">S</span>
				</div>
			</a>
			<h1 class="text-3xl font-bold text-gray-900" style="font-family:'Playfair Display',serif">Welcome back</h1>
			<p class="text-gray-500 mt-2">Sign in to save properties and track your search</p>
		</div>

		<!-- Card -->
		<div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">

			{#if form?.sent}
				<!-- Success state -->
				<div class="text-center">
					<div class="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
						<svg class="w-8 h-8 text-[#2d6a4f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
						</svg>
					</div>
					<h2 class="text-xl font-bold text-gray-900 mb-2">Check your email</h2>
					<p class="text-gray-500 text-sm leading-relaxed">
						We sent a sign-in link to <strong class="text-gray-700">{form.email}</strong>.<br>
						The link expires in 15 minutes.
					</p>
					<p class="text-gray-400 text-xs mt-4">Didn't receive it? Check your spam folder or <a href="/login" class="text-[#0077b6] hover:underline">try again</a>.</p>
				</div>
			{:else}
				<form
					method="POST"
					use:enhance={() => {
						submitting = true;
						return async ({ update }) => { submitting = false; update(); };
					}}
					class="space-y-5"
				>
					{#if form?.error}
						<div class="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">{form.error}</div>
					{/if}

					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
						<input
							type="email"
							name="email"
							required
							autofocus
							placeholder="you@email.com"
							class="form-input"
						/>
					</div>

					<button
						type="submit"
						disabled={submitting}
						class="btn-primary w-full py-3.5 disabled:opacity-60"
					>
						{submitting ? 'Sending link…' : 'Send sign-in link'}
					</button>

					<p class="text-center text-xs text-gray-400 leading-relaxed">
						We'll email you a magic link — no password needed.<br>
						New users are registered automatically.
					</p>
				</form>
			{/if}
		</div>

		<p class="text-center text-sm text-gray-400 mt-6">
			<a href="/" class="hover:text-gray-600">← Back to Safeer Properties</a>
		</p>
	</div>
</div>
