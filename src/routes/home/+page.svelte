<script lang="ts">
	// @ts-nocheck
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/supabaseClient';
	let loading = $state(true);
	import bluenoise from '../../assets/noise.png';
	import greennoise from '../../assets/greennoise.png';
	import rednoise from '../../assets/rednoise.png';
	import { quintOut } from 'svelte/easing';
	import { fade, fly } from 'svelte/transition';
	import { inview } from 'svelte-inview';

	let isInViewMap = $state({});
	let journalList: any[] = $state([]);
	let user = $state();
	let moodImg = {
		happy: greennoise,
		relieved: greennoise,
		stressed: bluenoise,
		sad: rednoise,
		angry: rednoise
	};

	let colorArr = [bluenoise, greennoise, rednoise];
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
		journalList = journals ?? [];
	}
	function formatDate(isoString: string, timeZone: string) {
		const date = new Date(isoString);

		// Convert to the given timezone
		const options = { timeZone, day: 'numeric', month: 'long', year: 'numeric' };
		const formatter = new Intl.DateTimeFormat('en-US', options);
		const parts = formatter.formatToParts(date);

		// Extract day, month, and year
		const day = parts.find((p) => p.type === 'day').value;
		const month = parts.find((p) => p.type === 'month').value;
		const year = parts.find((p) => p.type === 'year').value;

		// Function to add ordinal suffix
		const getOrdinal = (d) => {
			if (d > 3 && d < 21) return 'th';
			switch (d % 10) {
				case 1:
					return 'st';
				case 2:
					return 'nd';
				case 3:
					return 'rd';
				default:
					return 'th';
			}
		};

		return `${day}${getOrdinal(day)} ${month} ${year}`;
	}

	getUser();
</script>

{#if loading}
	<h1>Loading</h1>
{:else}
	<div class="bg-secondary min-h-screen p-2 lg:p-10 font-poppins">
		<h1 class="text-5xl font-bold my-4 heading" transition:fade={{ duration: 500 }}>
			Hey {user.username},
		</h1>
		<h1 class="text-xl font-light" transition:fade={{ duration: 500 }}>
			Welcome back to your humble abode
		</h1>
		<h1 class="text-primary underline text-xl font-light my-2" transition:fade={{ duration: 500 }}>
			<a href="/"> Your commitment </a>
		</h1>
		<a
			href="/create"
			class="fixed right-1/2 translate-x-1/2 md:translate-x-0 bottom-10 shadow-box md:right-8 bg-primary py-4 px-6 rounded-md font-bold font-poppins z-10 hover:scale-[1.05] transition ease-in duration-100"
		>
			<h1 class="text-secondary">Create new</h1>
		</a>
		<div class="flex items-center flex-wrap justify-center my-24">
			{#each journalList as journal (journal.id)}
				<div
					use:inview
					oninview_enter={(event) => {
						isInViewMap[journal.id] = true;
					}}
					oninview_leave={(event) => (isInViewMap[journal.id] = false)}
					class={`relative w-10/12 mx-0 lg:w-3/12 xl:w-[20%] md:w-5/12 md:mx-20 rounded-lg bg-primary px-6 py-6 h-[350px] my-5 ${isInViewMap[journal.id] ? 'visible' : ''} transition duration-200 delay-100 opacity-0 scale-75`}
				>
					<img
						src={moodImg[journal.mood.mood]}
						alt="noise"
						class="absolute w-full h-full top-0 left-0 rounded-lg"
					/>
					<a href="/journal/{journal.id}" class="relative">
						<h1 class="text-secondary text-4xl font-poppins font-bold">
							{journal.title}
						</h1>
					</a>
					<h1 class="absolute bottom-12 text-2xl">{journal.mood.emoji}</h1>
					<h1 class="absolute bottom-0 text-secondary font-bold my-5">
						{formatDate(journal.created_at, 'Asia/Kolkata')}
					</h1>
				</div>
			{/each}
		</div>
		<button
			onclick={async () => {
				await supabase.auth.signOut();
				goto('/login');
			}}>Sign out</button
		>
	</div>
{/if}

<style>
	.shadow-box {
		-webkit-box-shadow: -1px 3px 13px 0px rgba(255, 255, 255, 0.75);
		-moz-box-shadow: -1px 3px 13px 0px rgba(0, 0, 0, 0.75);
		box-shadow: -1px 3px 13px 0px #906234;
	}
	.visible {
		opacity: 1;
		scale: 1;
	}
</style>
