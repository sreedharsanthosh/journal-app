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
	let selectedMood = {};

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
	const postJournal = async () => {
		let user = await supabase.auth.getUser();
		let id = user.data.user?.id;
		const { data, error } = await supabase
			.from('journals')
			.insert([{ title: title, journal: content, user: id, mood: selectedMood }]);
		if (error) {
			alert(error.message);
		} else {
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
