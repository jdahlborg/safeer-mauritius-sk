<script lang="ts">
	import type { ActionData } from './$types';
	import { enhance } from '$app/forms';

	let { form }: { form: ActionData } = $props();
	let submitting = $state(false);
</script>

<svelte:head>
	<title>Admin Login — Safeer Properties</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
	<div class="w-full max-w-sm">
		<div class="text-center mb-8">
			<h1 class="text-2xl font-bold text-gray-900" style="font-family:'Playfair Display',serif">Admin Access</h1>
			<p class="text-gray-500 text-sm mt-1">Safeer Properties dashboard</p>
		</div>

		<div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
			<form
				method="POST"
				use:enhance={() => {
					submitting = true;
					return async ({ update }) => { submitting = false; update(); };
				}}
				class="space-y-4"
			>
				{#if form?.error}
					<div class="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">{form.error}</div>
				{/if}
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1.5">Admin secret</label>
					<input
						type="password"
						name="secret"
						required
						autofocus
						placeholder="Enter admin secret"
						class="form-input"
					/>
				</div>
				<button type="submit" disabled={submitting} class="btn-primary w-full py-3 disabled:opacity-60">
					{submitting ? 'Signing in…' : 'Sign in'}
				</button>
			</form>
		</div>
	</div>
</div>
