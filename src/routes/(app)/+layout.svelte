<script lang="ts">
  import ProgressBar from '$lib/components/ProgressBar.svelte'
  import SideNav from '$lib/components/SideNav.svelte'
  import PostModal from '../../lib/components/PostModal.svelte'

</script>

<!-- <PostModal /> -->
<ProgressBar />

<div class=" flex min-h-screen">
  <SideNav />
  <main class="container flex-1">
    <slot />
  </main>
</div>
