<script lang="ts">
  import { goto } from '$app/navigation'
  import * as Dialog from '$lib/components/ui/dialog'
  import type { PagePost } from '$lib/types'

  export let post: PagePost
  export let open: boolean
</script>

<Dialog.Root {open} onOpenChange={() => goto(`/${post.author}`)}>
  <Dialog.Content>
    <img src={post.media[0]} alt={post.caption} />
  </Dialog.Content>
</Dialog.Root>
