<script lang="ts">
  import * as Dialog from '$lib/components/ui/dialog'
  import type { Post } from '$lib/types'

  export let data: Post
  let open = true

  $: if (!open) {
    console.log('closing')
    history.back()
  }
</script>

<Dialog.Root bind:open>
  <Dialog.Content>
    <img src={data.media[0]} alt={data.caption} />
  </Dialog.Content>
</Dialog.Root>
