<script lang="ts">
  import * as Dialog from '$lib/components/ui/dialog'
  import type { Post } from '$lib/types'
  import { createEventDispatcher } from 'svelte'

  export let post: Post
  export let open: boolean
</script>

<Dialog.Root {open} onOpenChange={() => history.back()}>
  <Dialog.Content>
    <img src={post.media[0]} alt={post.caption} />
  </Dialog.Content>
</Dialog.Root>
