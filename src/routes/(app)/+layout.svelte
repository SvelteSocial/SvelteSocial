<script lang="ts">
  import { page } from '$app/stores'
  import ProgressBar from '$lib/components/ProgressBar.svelte'
  import SideNav from '$lib/components/SideNav.svelte'
  import { trpc } from '$lib/trpc/client'
  import { createQuery } from '@tanstack/svelte-query'

  //   const userData = createQuery({
  //     queryKey: ['userData'],
  //     queryFn: () => trpc($page).userData.query(),
  //   })
  export let data
</script>

<ProgressBar />

<div class=" flex min-h-screen">
  <SideNav />
  <main class="container flex-1">
    <slot />
  </main>
</div>
