<script lang="ts">
  import ProgressBar from '$lib/components/ProgressBar.svelte'
  import SideNav from '$lib/components/SideNav.svelte'
  import { page } from '$app/stores'

  //   const userData = createQuery({
  //     queryKey: ['userData'],
  //     queryFn: () => trpc($page).userData.query(),
  //   })
</script>

<ProgressBar />

<div class=" flex min-h-screen">
  <SideNav />
  <main class="container flex-1">
    <slot />
  </main>
</div>
