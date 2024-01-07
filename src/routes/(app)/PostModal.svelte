<script lang="ts">
  import * as Dialog from '$lib/components/ui/dialog'
  import { createPostQuery } from '$lib/queries'
  import Post from '$lib/components/Post.svelte'
  import { selectedPostId } from '$lib/stores'

  $: postQuery = $selectedPostId ? createPostQuery({ postId: $selectedPostId }) : null
</script>

<Dialog.Root open={$postQuery?.isSuccess} onOpenChange={() => ($selectedPostId = null)}>
  <Dialog.Content class="max-w-fit p-0">
    {#if $postQuery?.isSuccess}
      <Post postId={$postQuery.data.id} />
    {/if}
  </Dialog.Content>
</Dialog.Root>
