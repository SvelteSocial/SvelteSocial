<script lang="ts">
  import * as Dialog from '$lib/components/ui/dialog'
  import type { InferInsertModel } from 'drizzle-orm'
  import type { posts as postsSchema } from '$lib/server/schema/schema'

  export let data: InferInsertModel<typeof postsSchema>
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
