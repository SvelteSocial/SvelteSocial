<script lang="ts">
  import { Button } from '$lib/components/ui/button'
  import { signIn } from '@auth/sveltekit/client'
  import { Smile } from 'lucide-svelte'

  export let data
</script>

<svelte:head>
  <title>Home | Sveltekit</title>
  <meta name="description" content="" />
</svelte:head>

<main>
  <Button>Test</Button>
  <h1 class="flex items-center text-green-500">Welcome<Smile /></h1>
  <button on:click={() => signIn('github')}>hi</button>
  <a href="/mockData">test</a>
  <Button>Test2</Button>
</main>

<style lang="postcss">
</style>
