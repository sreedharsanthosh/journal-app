<script lang="ts">
	// @ts-nocheck
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/supabaseClient';

	let userId = $state();
	let userData = $state(null);
	let username = $state('');
	let avatarFile = $state(null);
	let avatarFilename = $state('');

	async function getUser() {
		const data = await supabase.auth.getUser();
		userId = data.data.user?.id;
		const { data: profileData } = await supabase
			.from('profiles')
			.select('*')
			.eq('USER', data.data.user?.id);
		userData = profileData ? profileData[0] : null;
	}

	getUser();

	async function updateData() {
		let updates: Record<string, string> = {};
		if (username) updates.username = username;

		if (username !== '') {
			const { error } = await supabase
				.from('profiles')
				.update({ username: username })
				.eq('USER', userId);

			if (error) console.log('Error updating profile:', error);
		}

		// get current time
		const now = Date.now();

		if (avatarFile) {
			const fileExt = avatarFilename.split('.').pop();
			// filepath include now time also to avoid caching issues
			const fileName = `${userId}_avatar_time_${now}.${fileExt}`;
			const filePath = `public/avatars/${fileName}`;

			let { error: uploadError } = await supabase.storage
				.from('avatars')
				.upload(filePath, avatarFile, { upsert: true });

			// and update any image if any in storage whose file name starts with the user id but is not the current fileName
			const { data: existingFiles } = await supabase.storage
				.from('avatars')
				.list('public/avatars/', {
					search: `${userId}_avatar_time_`
				});
			if (existingFiles) {
				for (let file of existingFiles) {
					if (file.name !== fileName) {
						const { data: deleteData, error: deleteError } = await supabase.storage
							.from('avatars')
							.remove([`public/avatars/${file.name}`]);
						if (deleteError) console.log('Error deleting old avatar:', deleteError);
					}
				}
			}

			if (uploadError) console.log('Error uploading avatar:', uploadError);

			if (!uploadError) {
				const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
				const avatar_url = publicUrlData.publicUrl;

				console.log('Avatar URL:', avatar_url);

				const { error: profileError } = await supabase
					.from('profiles')
					.update({ avatar_url })
					.eq('USER', userId);

				if (profileError) console.log('Error updating avatar_url:', profileError);

				if (!profileError) goto('/profile');
			}
		}
	}
</script>

<div class="bg-secondary min-h-screen flex justify-center items-center px-4 py-10">
	{#if !userData}
		<h1 class="text-text-primary text-2xl font-semibold animate-pulse">Loading...</h1>
	{:else}
		<form
			class="w-full max-w-xl bg-secondary/90 rounded-3xl p-8 md:p-10 flex flex-col items-center space-y-8"
		>
			<h1 class="font-extrabold text-3xl md:text-4xl text-text-primary tracking-tight">
				Update Profile
			</h1>

			<!-- Username -->
			<label
				for="username"
				class="w-full flex flex-col gap-2 text-text-primary font-semibold text-lg"
			>
				Username:
				<input
					type="text"
					id="username"
					name="username"
					placeholder={userData.username}
					class="p-4 w-full bg-white rounded-2xl text-neutral-800 shadow-md focus:ring-4 focus:ring-primary/40 outline-none transition"
					bind:value={username}
				/>
			</label>

			<!-- Avatar -->
			<label class="w-full flex flex-col gap-2 text-text-primary font-semibold text-lg">
				Profile Picture:
				<input
					type="file"
					id="avatar"
					name="avatar"
					accept="image/*"
					class="p-3 bg-white rounded-2xl shadow-md text-neutral-700 cursor-pointer focus:ring-4 focus:ring-primary/40 transition"
					onchange={(e) => (avatarFile = e.target.files[0])}
					bind:value={avatarFilename}
				/>
			</label>

			<!-- Update button -->
			<button
				onclick={(e) => {
					e.preventDefault();
					updateData();
				}}
				class="bg-primary text-white font-semibold w-full py-3 rounded-xl shadow-lg shadow-primary/40 hover:shadow-xl hover:brightness-110 active:scale-95 transition text-lg"
			>
				Update Profile
			</button>
		</form>
	{/if}
</div>
