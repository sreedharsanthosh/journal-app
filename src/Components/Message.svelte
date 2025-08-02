<script lang="ts">
	let message = $props();
</script>

<div
	class="absolute overflow-hidden error bottom-10 right-10 bg-amber-300 px-12 w-10/12 text-center left-1/2 -translate-x-1/2 md:px-24 py-4 rounded-md text-white text-xl font-bold lg:w-2/5"
>
	<h1>Message: {message.message}</h1>
</div>

<style>
	.error::before {
		content: '';
		height: 100%;
		width: 100%;
		background: rgba(92, 92, 92, 0.16);
		position: absolute;
		top: 0;
		left: -100%;
		animation: animate 4s ease-in-out;
	}

	@keyframes animate {
		from {
			left: -100%;
		}
		to {
			left: 0;
		}
	}
</style>
