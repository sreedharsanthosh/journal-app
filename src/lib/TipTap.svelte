<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import { supabase } from './supabaseClient';
	import { goto } from '$app/navigation';

	let element: HTMLElement;
	let editor: any;
	let content = '';
	let title = '';
	let selectedMood: any = null;
	let user;
	let error;

	let moods = [
		{ emoji: '🙂', mood: 'happy', hover: 'rotate-360' },
		{ emoji: '😌', mood: 'relieved', hover: 'scale-125' },
		{ emoji: '🤯', mood: 'stressed', hover: '-translate-y-1' },
		{ emoji: '😠', mood: 'angry', hover: 'bg-red-400' },
		{ emoji: '☹️', mood: 'sad', hover: 'rotate-z-45' }
	];

	onMount(() => {
		editor = new Editor({
			onUpdate({ editor }) {
				const html = editor.getHTML();
				content = html;
			},
			editorProps: {
				attributes: {
					class:
						'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none border-1 rounded-md border-black bg-white border-2 border-gray-200 p-4 min-w-full my-4 min-h-[60vh]'
				}
			},
			element: element,
			extensions: [StarterKit],
			content: '<p>Hello World! 🌍️ </p>',
			onTransaction: () => {
				// force re-render so `editor.isActive` works as expected
				editor = editor;
			}
		});
	});

	onDestroy(() => {
		if (editor) {
			editor.destroy();
		}
	});

	async function getUser() {
		const data = await supabase.auth.getUser();
		const { data: userData, error: userError } = await supabase
			.from('profiles')
			.select('*')
			.eq('USER', data.data.user?.id);
		user = userData ? userData[0] : null;
		return { user: user, last_active: user.last_active, longest_streak: user.longest_streak };
	}

	const postJournal = async () => {
		let date = new Date();
		date.setDate(date.getDate() - 1);
		const yesterday = date.toISOString().split('T')[0];
		date = new Date();
		date.setDate(date.getDate());
		const today = date.toISOString().split('T')[0];
		let user = await getUser();
		let id = user.user.USER;
		if (!title || !content || !selectedMood) {
			alert('Please fill in all the fields');
			return;
		}

		if (user.last_active == yesterday) {
			const { data, error } = await supabase
				.from('profiles')
				.update({ last_active: today, streak: user.user.streak + 1 })
				.eq('USER', id);
			console.log(error, data);
		}
		const { data, error } = await supabase
			.from('journals')
			.insert([{ title: title, journal: content, user: id, mood: selectedMood }]);
		if (error) {
			alert(error.message);
		} else {
			if (user.last_active == yesterday) {
				await supabase
					.from('profiles')
					.update({ streak: user.user.streak + 1 })
					.eq('USER', id);
				user.user.streak > user.longest_streak
					? await supabase
							.from('profiles')
							.update({ longest_streak: user.user.streak + 1 })
							.eq('USER', id)
					: null;
			}
			await supabase.from('profiles').update({ last_active: today }).eq('USER', id);
			goto('/home');
		}
	};
</script>

<div class="w-full flex flex-col items-center">
	<br />
	<div class="w-full flex justify-around font-bold text-xl">
		<label for="title" class="w-1/2 flex flex-col font-bold text-xl my-2"
			>Title:<input
				class="bg-white border-2 border-gray-200 rounded-md py-3 px-4"
				bind:value={title}
				type="text"
				name="title"
				id="title"
			/></label
		>
		<div class="w-1/2 mx-10 flex flex-col">
			<h1 class="  font-bold text-xl my-2">What's your mood?</h1>
			<div class="flex">
				{#each moods as mood}
					<div
						class={`mx-4 font-light grid place-items-center ${selectedMood == mood ? 'selected' : ''}`}
					>
						<button
							class="none"
							onclick={() => {
								selectedMood = mood;
							}}
						>
							<h1
								class={`text-2xl transition cursor-pointer rounded-full duration-200 hover:${mood.hover}`}
							>
								{mood.emoji}
							</h1>
						</button>
						<h1 class="text-lg">{mood.mood}</h1>
					</div>
				{/each}
			</div>
		</div>
	</div>
	<div class="my-5 w-full">
		<h1 class="text-xl font-bold">Journal:</h1>
		{#if editor}
			<div class="flex w-full justify-center flex-wrap">
				<button
					onclick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
					class:active={editor.isActive('heading', { level: 1 })}
				>
					H1
				</button>
				<button
					onclick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
					class:active={editor.isActive('heading', { level: 2 })}
				>
					H2
				</button>
				<button
					onclick={() => editor.chain().focus().toggleBold().run()}
					class:active={editor.isActive('bold')}
				>
					bold
				</button>
				<button
					onclick={() => editor.chain().focus().toggleBulletList().run()}
					class:active={editor.isActive('bulletList')}
				>
					bulletList
				</button>
				<button
					onclick={() => editor.chain().focus().toggleCodeBlock().run()}
					class:active={editor.isActive('codeBlock')}
				>
					code
				</button>
				<button
					onclick={() => editor.chain().focus().setParagraph().run()}
					class:active={editor.isActive('paragraph')}
				>
					P
				</button>
			</div>
		{/if}

		<div bind:this={element}></div>
	</div>
	<button
		class="bg-primary post rounded-md px-8 py-3 text-white font-bold text-xl"
		onclick={postJournal}>Post</button
	>
</div>

<style>
	.post {
		background: #906234;
		color: white;
	}
	button {
		border-radius: 5px;
		background-color: #e3e3e3;
		padding: 10px 20px;
		color: black;
		margin: 5px 10px;
	}
	button.active {
		background: #906234;
		color: white;
	}
	.none {
		padding: 0;
		background: transparent;
		margin: 0;
	}
	.selected {
		border-radius: 5px;
		background-color: #906234;
		padding: 4px 10px;
		color: rgb(255, 255, 255);
		margin: 2px 5px;
	}
</style>
