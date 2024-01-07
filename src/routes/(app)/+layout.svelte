<script lang="ts">
  import ProgressBar from '$lib/components/ProgressBar.svelte'
  import SideNav from '$lib/components/SideNav.svelte'
  import PostModal from './PostModal.svelte'
  import { Toaster } from '$lib/components/ui/sonner'
</script>

<Toaster />
<PostModal />
<ProgressBar />

<div class="flex min-h-screen">
  <SideNav />
  <main class="mx-auto flex-1 px-10 pt-10 2xl:max-w-5xl">
    <slot />
  </main>
</div>
