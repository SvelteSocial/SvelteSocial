<script lang="ts">
  import * as Dialog from '$lib/components/ui/dialog'
  import { createPostQuery } from '$lib/queries'
  import Post from '$lib/components/Post.svelte'
  import { selectedPostId } from '$lib/stores'
  import { page } from '$app/stores'
  import { onMount } from 'svelte'

  $: postQuery = $selectedPostId ? createPostQuery({ postId: $selectedPostId }) : null
  onMount(() => page.subscribe(() => ($selectedPostId = null)))
  $: open = $postQuery?.isSuccess ?? false
</script>

<Dialog.Root bind:open onOpenChange={() => ($selectedPostId = null)}>
  <Dialog.Content class="max-w-fit p-0">
    {#if $postQuery?.isSuccess}
      <Post postId={$postQuery.data.id} />
    {/if}
  </Dialog.Content>
</Dialog.Root>
