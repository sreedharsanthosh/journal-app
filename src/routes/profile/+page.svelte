<script>
	import { supabase } from '$lib/supabaseClient';

	let loading = $state(true);
	let user = $state();

	async function getUser() {
		const data = await supabase.auth.getUser();
		const { data: userData, error: userError } = await supabase
			.from('profiles')
			.select('*')
			.eq('USER', data.data.user?.id);
		user = userData ? userData[0] : null;
		loading = false;
		let { data: journals, error } = await supabase
			.from('journals')
			.select('*')
			.eq('user', data.data.user?.id);
		const journalList = journals ?? [];
	}

	getUser();
</script>

{#if loading}
	<h1>Loading</h1>
{:else}
	<div class="bg-secondary min-h-screen flex items-center flex-col">
		<div class="grid place-items-center my-10">
			<img src={user.avatar_url} alt="Profile" class="h-48 w-48 rounded-full object-cover my-6" />
			<h1 class="font-bold text-2xl md:text-4xl">{user.username}</h1>
			<h2 class="my-1 text-xl">Journaling since 2024</h2>
		</div>
	</div>
{/if}
