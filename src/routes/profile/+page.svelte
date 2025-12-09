<script>
	import { goto } from '$app/navigation';
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
	<div class="min-h-screen bg-secondary flex items-center justify-center">
		<h1 class="text-lg font-semibold animate-pulse text-text-primary">Loading...</h1>
	</div>
{:else}
	<div class="min-h-screen bg-secondary flex items-center justify-center px-3 md:px-6 py-10">
		<div
			class="w-full max-w-5xl bg-secondary rounded-[2rem] shadow-2xl px-6 md:px-12 py-10 md:py-12 flex flex-col items-center"
		>
			<!-- Profile section -->
			<div class="flex flex-col items-center text-center gap-3">
				<div class="relative">
					<img
						src={user?.avatar_url}
						alt="Profile"
						class="h-40 w-40 md:h-48 md:w-48 rounded-full object-cover shadow-lg"
					/>
					<a
						href="/updateprofile"
						class="absolute bottom-3 right-3 bg-primary text-white text-xs px-2.5 py-1 rounded-full shadow-md"
					>
						Edit
					</a>
				</div>

				<div class="space-y-1">
					<h1 class="font-extrabold text-2xl md:text-3xl text-text-primary">
						{user?.username}
					</h1>
					<h2 class="text-sm md:text-base text-text-primary/80">Journaling since 2024</h2>
				</div>
			</div>

			<button
				class="mt-8 bg-red-400 text-white font-semibold w-full md:w-auto px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:brightness-110 active:scale-95 transition text-lg"
				onclick={async () => {
					await supabase.auth.signOut();
					goto('/login');
				}}>Sign out</button
			>
			<!-- Streak cards -->
			<div class="mt-8 flex flex-col md:flex-row gap-4 md:gap-8">
				<div
					class="bg-[#ffd8c5] rounded-2xl shadow-md px-6 py-3 flex items-center justify-between min-w-[220px]"
				>
					<span class="text-sm md:text-base text-neutral-700">Current streak:</span>
					<span class="font-extrabold text-lg md:text-xl flex items-center gap-1">
						{user.streak} <span>🔥</span>
					</span>
				</div>
				<div
					class="bg-[#ffd8c5] rounded-2xl shadow-md px-6 py-3 flex items-center justify-between min-w-[220px]"
				>
					<span class="text-sm md:text-base text-neutral-700">Longest streak:</span>
					<span class="font-extrabold text-lg md:text-xl flex items-center gap-1">
						{user.longest_streak} <span>🔥</span>
					</span>
				</div>
			</div>
			<!-- Pinned journals -->
			<div class="w-full mt-10 md:mt-12">
				<h3 class="text-lg md:text-xl font-extrabold text-center mb-6 text-text-primary">
					Pinned Journals:
				</h3>
			</div>
		</div>
	</div>
{/if}
