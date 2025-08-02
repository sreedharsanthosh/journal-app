<script lang="ts">
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/supabaseClient';
	import bg from '../../../assets/bg.png';
	import Icon from '@iconify/svelte';
	import { z } from 'zod';
	import Alert from '../../../Components/Alert.svelte';

	let username = $state('');
	let email = $state('');
	let password = $state('');
	let error = $state('');

	const User = z.object({
		email: z.string().email(),
		password: z.string().min(8, { message: 'password must be atleast 8 characters long' })
	});

	const validate = (data: { email: string; password: string }) => {
		let parseResult = User.safeParse(data);
		if (!parseResult.success) {
			const flattened = parseResult.error.flatten().fieldErrors;
			if (flattened.email) {
				error = flattened.email[0];
			} else if (flattened.password) {
				error = flattened.password[0];
			} else {
				error = 'unknown error';
			}
			setTimeout(() => {
				error = '';
			}, 4000);
		}
	};

	async function onSubmit() {
		await validate({
			email: email,
			password: password
		});
		if (!error) {
			const { data, error: signUpError } = await supabase.auth.signUp({
				email: email,
				password: password
			});
			signUpError ? (error = signUpError.message) : null;
			if (data.user) {
				const { data: enteredUser, error: profileError } = await supabase.from('profiles').insert({
					USER: data.user?.id,
					username: username,
					email: email
				});
				profileError ? (error = profileError.message) : goto('/login');
			}
			setTimeout(() => {
				error = '';
			}, 4000);
		}
	}
</script>

<img src={bg} class="absolute top-0 left-0 h-screen w-screen object-contain" alt="bg" />
<div class="h-screen w-screen flex items-center justify-center bg-primary">
	<form
		onsubmit={(e) => e.preventDefault()}
		class="bg-secondary py-8 text-text-primary rounded-xl z-10 h-3/5 md:h-3/5 lg:h-[65%] w-11/12 md:w-1/2 lg:w-2/5 xl:w-[25%] flex flex-col items-center"
	>
		<h1 class="text-4xl md:text-5xl font-bold">Welcome to blah</h1>
		<h4 class="text-lg">we are glad to have you!</h4>
		<div class="flex flex-col w-full items-center my-2 md:my-4">
			<label for="username" class="flex flex-col w-4/5 md:w-4/5">
				Username
				<input
					class="bg-white border-2 px-4 border-gray-300 rounded-lg w-full h-12"
					type="gmail"
					name="username"
					id="username"
					placeholder="Username"
					min="8"
					bind:value={username}
				/>
			</label>
			<label for="email" class="flex flex-col w-4/5 md:w-4/5">
				Email
				<input
					class="bg-white border-2 px-4 border-gray-300 rounded-lg w-full h-12"
					type="gmail"
					name="email"
					id="email"
					placeholder="Email"
					bind:value={email}
				/>
			</label>
			<label for="password" class="flex flex-col w-4/5 md:w-4/5">
				Password<input
					class="bg-white border-2 px-4 border-gray-300 rounded-lg w-full h-12"
					type="password"
					name="password"
					id="password"
					placeholder="Password"
					bind:value={password}
				/></label
			>
			<button
				class="w-4/5 md:w-4/5 rounded-lg py-3 text-white font-bold my-4 md:my-7 bg-primary"
				type="submit"
				onclick={onSubmit}>Login</button
			>
			<h6 class="text-md md:text-lg">Already have an account? <a href="/login">Login</a></h6>
		</div>
		<div class="flex justify-around items-center">
			<div class="bg-black w-12 h-0.5 mx-2"></div>
			<h1 class="text-md md:text-lg font-bold">Or sign in with</h1>
			<div class="bg-black w-12 h-0.5 mx-2"></div>
		</div>
		<div class="py-2 flex justify-between w-1/4 md:w-1/5">
			<div class="font-2xl p-2 bg-primary rounded-full">
				<Icon width="25" color="white" icon="mingcute:google-fill" />
			</div>
			<div class="font-2xl p-2 bg-primary rounded-full">
				<Icon width="25" color="white" icon="mdi:facebook" />
			</div>
		</div>
	</form>
	{#if error}
		<Alert message={error} />
	{/if}
</div>

<style>
	label {
		margin-top: 4px;
		margin-bottom: 4px;
	}
</style>
