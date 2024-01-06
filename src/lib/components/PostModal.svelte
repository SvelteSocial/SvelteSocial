<script lang="ts">
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import * as Dialog from '$lib/components/ui/dialog'
  import { createPostQuery } from '$lib/queries'
  import type { PagePost } from '$lib/types'

  $: ({ selectedImageId } = $page.state)
  $: postQuery = selectedImageId ? createPostQuery({ postId: selectedImageId }) : null
  $: post = $postQuery?.data
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
  <Dialog.Content>
    {#if post}
      <img src={post.media[0]} alt={post.caption} />
    {/if}
  </Dialog.Content>
</Dialog.Root>
