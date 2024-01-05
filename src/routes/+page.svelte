<script lang="ts">
  import { Button } from '$lib/components/ui/button'
  import { signIn } from '@auth/sveltekit/client'
  import { Smile } from 'lucide-svelte'
</script>

<svelte:head>
  <title>Home | SvelteSocial</title>
  <meta
    name="description"
    content="SvelteSocial is a social media platform built with SvelteKit."
  />
</svelte:head>

<main>
  <Button>Test</Button>
  <h1 class="flex items-center text-green-500">Welcome<Smile /></h1>
  <button on:click={() => signIn('github')}>SIGN IN</button>
  <Button>Test2</Button>
</main>

<style lang="postcss">
</style>
