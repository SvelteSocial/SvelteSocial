<script lang="ts">
  import { page } from '$app/stores'
  import ProgressBar from '$lib/components/ProgressBar.svelte'
  import { trpc } from '$lib/trpc/client'
  import { createQuery } from '@tanstack/svelte-query'

  //   const userData = createQuery({
  //     queryKey: ['userData'],
  //     queryFn: () => trpc($page).userData.query(),
  //   })
</script>

<ProgressBar />
<div class="container"></div>
<slot />
