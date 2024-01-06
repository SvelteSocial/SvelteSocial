<script lang="ts">
  import { page } from '$app/stores'
  import * as Dialog from '$lib/components/ui/dialog'
  import { createPostQuery } from '$lib/queries'
  import Post from './Post.svelte'

  $: ({ selectedImageId } = $page.state)
  $: postQuery = selectedImageId ? createPostQuery({ postId: selectedImageId }) : null
</script>

<Dialog.Root
  open={$postQuery?.isSuccess}
  onOpenChange={() =>
    // goto(`/${$postQuery?.data?.author.username}`, {
    //   noScroll: true,
    //   state: { selectedImageId: undefined },
    // })}
    history.back()}
>
  <Dialog.Content class="max-w-fit p-0">
    {#if $postQuery?.isSuccess}
      <Post postId={$postQuery.data.id} />
    {/if}
  </Dialog.Content>
</Dialog.Root>
