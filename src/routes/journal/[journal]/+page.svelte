<script lang="ts">
	import { supabase } from '$lib/supabaseClient';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let journal = $state({ journal: '' });
	let loaded = $state(false);

	const getData = async () => {
		let { data: retrievedJournal, error } = await supabase
			.from('journals')
			.select('*')
			.eq('id', data.journal);
		if (retrievedJournal && retrievedJournal.length > 0) {
			journal = retrievedJournal[0];
		}
		loaded = true;
	};
	getData();
</script>

<div class="min-w-screen min-h-screen bg-secondary flex justify-center px-8 py-10 md:py-20">
	{#if loaded}
		<div
			class="prose prose-h1:mb-5 prose-h1:my-8 prose-h2:mt-0 prose-h2:mb-4 prose-p:my-4 prose-code:my-3 prose-h1:text-6xl prose-p:text-xl/[40px] min-w-5/12"
		>
			{@html journal.journal}
		</div>
	{/if}
</div>
