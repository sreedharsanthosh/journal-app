<script lang="ts">
	import type { PageData } from './$types';
	import TipTap from '$lib/TipTap.svelte';

	let { data }: { data: PageData } = $props();
</script>

<div class="font-poppins bg-secondary py-2 md:py-10 px-4 md:px-10 min-h-screen">
	<h1 class="text-4xl font-bold">Create new journal</h1>
	<TipTap />
</div>
