<script lang="ts">
  import ProgressBar from '$lib/components/ProgressBar.svelte'
  import '../app.postcss'
  import { QueryClientProvider } from '@tanstack/svelte-query'

  export let data
</script>

<ProgressBar />
<QueryClientProvider client={data.queryClient}>
  <slot />
</QueryClientProvider>
