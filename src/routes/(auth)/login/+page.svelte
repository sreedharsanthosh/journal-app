<script lang="ts">
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/supabaseClient';
	import Icon from '@iconify/svelte';
	import { z } from 'zod';
	import Alert from '../../../Components/Alert.svelte';

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
			flattened.email
				? (error = flattened.email[0])
				: (error = flattened.password?.[0] ?? 'Unknown error');
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
			console.log('here reached');
			const { data, error: loginError } = await supabase.auth.signInWithPassword({
				email: email,
				password: password
			});
			if (loginError) {
				console.log(loginError.message);
				error = loginError.message;
			}
			loginError ? (error = loginError.message) : goto('/home');
			setTimeout(() => {
				error = '';
			}, 4000);
		}
	}
</script>

<div
	class="min-h-screen w-screen bg-gradient-to-br from-primary via-primary/90 to-primary flex items-center justify-center px-4 relative overflow-hidden"
>
	<form
		onsubmit={(e) => e.preventDefault()}
		class="relative z-10 bg-secondary/95 text-text-primary rounded-2xl shadow-2xl border border-white/10
			w-full max-w-md px-6 py-8 md:px-10 md:py-10 flex flex-col items-center space-y-6 backdrop-blur"
	>
		<!-- header -->
		<div class="w-full flex flex-col items-center space-y-2">
			<div
				class="flex items-center justify-center h-12 w-12 rounded-2xl bg-primary/90 shadow-md mb-1"
			>
				<Icon icon="mdi:shield-lock-outline" width="26" class="text-white" />
			</div>
			<h1 class="text-3xl md:text-4xl font-extrabold tracking-tight text-center">Welcome back</h1>
			<h4 class="text-sm md:text-base text-text-primary/80">We missed you ✨</h4>
		</div>

		<!-- inputs -->
		<div class="w-full space-y-4 mt-2">
			<label for="email" class="flex flex-col text-sm font-medium gap-1">
				<span>Email</span>
				<input
					class="bg-white/95 border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/60 outline-none
						px-4 rounded-lg w-full h-11 text-sm shadow-sm transition-all"
					type="email"
					name="email"
					id="email"
					placeholder="you@example.com"
					bind:value={email}
				/>
			</label>

			<label for="password" class="flex flex-col text-sm font-medium gap-1">
				<span>Password</span>
				<input
					class="bg-white/95 border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/60 outline-none
						px-4 rounded-lg w-full h-11 text-sm shadow-sm transition-all"
					type="password"
					name="password"
					id="password"
					placeholder="••••••••"
					bind:value={password}
				/>
			</label>

			<!-- extra small helper row -->
			<div class="flex items-center justify-between text-xs md:text-sm text-text-primary/70">
				<span>Use your registered email & password</span>
			</div>
		</div>

		<!-- primary button -->
		<button
			class="w-full rounded-lg py-3.5 text-white font-semibold mt-2 bg-primary
				shadow-lg shadow-primary/40 hover:shadow-xl hover:shadow-primary/50
				hover:brightness-110 active:scale-[0.98] duration-150"
			type="submit"
			onclick={onSubmit}
		>
			Login
		</button>

		<!-- register link -->
		<h6 class="text-sm md:text-base text-text-primary/80">
			Don't have an account?
			<a href="/register" class="font-semibold text-primary hover:underline">Create one</a>
		</h6>

		<!-- divider -->
		<div class="flex items-center w-full gap-3 pt-2">
			<div class="flex-1 h-px bg-text-primary/20"></div>
			<h1 class="text-xs md:text-sm font-semibold uppercase tracking-[0.18em] text-text-primary/70">
				Or continue with
			</h1>
			<div class="flex-1 h-px bg-text-primary/20"></div>
		</div>

		<!-- social buttons -->
		<div class="flex justify-center gap-4 pt-1 w-full">
			<button
				type="button"
				class="flex items-center justify-center w-11 h-11 rounded-full bg-primary shadow-md shadow-primary/40
					hover:brightness-110 active:scale-95 transition-transform"
			>
				<Icon width="22" color="white" icon="mingcute:google-fill" />
			</button>
			<button
				type="button"
				class="flex items-center justify-center w-11 h-11 rounded-full bg-primary shadow-md shadow-primary/40
					hover:brightness-110 active:scale-95 transition-transform"
			>
				<Icon width="22" color="white" icon="mdi:facebook" />
			</button>
		</div>
	</form>

	{#if error}
		<Alert message={error} />
	{/if}
</div>
