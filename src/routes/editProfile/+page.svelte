<script lang="ts">
	//@ts-nocheck
	import { supabase } from '$lib/supabaseClient';
	import Alert from '../../Components/Alert.svelte';
	import Message from '../../Components/Message.svelte';

	let { data } = $props();
	let files = $state();
	let message = $state();
	let success = $state();

	const showAlert = (msg: string) => {
		message = msg; // Update the reactive variable directly
		setTimeout(() => {
			message = null; // Clear the message after 4 seconds
		}, 4000);
	};

	const uploadProfile = async () => {
		if (!files) {
			showAlert('Please select a file');
			return;
		}
		if (files[0].size === 0) {
			showAlert('File is empty');
			return;
		}
		const allowedTypes = ['jpg', 'jpeg', 'png', 'webp'];
		const fileExtension = files[0].name.split('.').pop().toLowerCase();

		if (!allowedTypes.includes(fileExtension)) {
			showAlert('Please select a valid file type (jpg, jpeg, png, webp)');
			return;
		}

		const MAX_SIZE = 2 * 1024 * 1024; // 2MB

		if (files[0].size > MAX_SIZE) {
			showAlert('File size exceeds 2MB limit');
			return;
		}
		const { data: uploadData, error } = await supabase.storage
			.from('avatar')
			.upload(`private/users/${data.user.USER}.${fileExtension}`, files[0], {
				cacheControl: '10',
				upsert: true
			});
		if (error) {
			console.log(error);
		} else {
			// Handle success
			success = 'File uploaded successfully!';
			setTimeout(() => {
				success = null; // Clear the message after 4 seconds
			}, 4000);
			console.log(uploadData);
			let { data: url } = await supabase.storage
				.from('avatar')
				.getPublicUrl(`private/users/${data.user.USER}.${fileExtension}`);
			const { data: updateData, error } = await supabase
				.from('profiles')
				.update({ avatar_url: url.publicUrl })
				.eq('USER', data.user.USER);
			if (error) {
				alert('Error while updating profile');
				return;
			}
		}
	};
</script>

<h1>hi</h1>

<input accept="image/png, image/jpeg" bind:files id="avatar" name="avatar" type="file" />
<button onclick={uploadProfile}>Submit</button>

{#if message}
	<Alert {message} />
{/if}

{#if success}
	<Message message={success} />
{/if}
