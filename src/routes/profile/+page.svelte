<script lang="ts">
	//@ts-nocheck
	import { supabase } from '$lib/supabaseClient';
	import defaultProfile from '../../assets/defaultProfile.png';
	import type { PageProps } from '../$types';
	import { Pencil } from 'lucide-svelte';

	let { data }: PageProps = $props();

	let profile = $state();

	$effect(() => {
		if (data.user.avatar_url) {
			profile = data.user.avatar_url;
		} else {
			profile = defaultProfile;
		}
	});
</script>

<div class="bg-secondary flex flex-col items-center min-h-screen w-full">
	{#if data.user}
		<div class="m-12 flex items-center justify-center flex-col">
			<div class="relative">
				<img src={profile} alt="Profile" class="h-64 w-64 rounded-full object-cover" />
				<a
					href="/editProfile"
					class="absolute right-2 top-3/4 transform rounded-md bg-primary p-2 grid place-items-center"
				>
					<button><Pencil fill="#fffce1" /></button>
				</a>
			</div>
			<h1 class="text-4xl font-poppins font-bold text-center my-5">{data.user.username}</h1>
			<span class="grid grid-rows-1 grid-cols-2 gap-5 my-5">
				<h1 class="bg-[#FFE2D3] rounded-lg py-4 px-8 text-xl font-poppins font-bold">
					Longest streak: {data.user.longest_streak} 🔥
				</h1>
				<h1 class="bg-[#FFE2D3] rounded-lg py-4 px-8 text-xl font-poppins font-bold">
					Current streak: {data.user.streak} 🔥
				</h1>
			</span>
			<h1 class="font-poppins font-bold text-3xl my-5">Pinned Journals</h1>
		</div>
	{:else}
		<div>
			<h1>Loading</h1>
		</div>
	{/if}
</div>
