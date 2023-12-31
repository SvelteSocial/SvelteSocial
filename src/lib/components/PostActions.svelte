<script lang="ts">
  import { page } from '$app/stores'
  import { Bookmark, Heart, Loader2, MessageCircle, Send } from 'lucide-svelte'
  import { Button } from '$lib/components/ui/button'
  import { createMutation } from '@tanstack/svelte-query'
  import { trpc } from '$lib/trpc/client'
  import { createLikedPostQuery, createPostSavedQuery } from '$lib/queries'
  import type { PagePost } from '$lib/types'
  import { copyText } from 'svelte-copy'
  import { toast } from 'svelte-sonner'

  export let postId: string
  $: ({ queryClient } = $page.data)

  const hasLikedQuery = createLikedPostQuery({ postId })
  const hasSavedQuery = createPostSavedQuery({ postId })
  $: hasLiked = $hasLikedQuery.data ?? false
  $: hasSaved = $hasSavedQuery.data ?? false

  const toggleLikeMutation = createMutation({
    mutationFn: () => trpc($page).post.toggleLike.mutate({ postId }),
    onSuccess: setLiked,
  })
  const savedPostMutation = createMutation({
    mutationFn: () => trpc($page).post.toggleSave.mutate({ postId }),
    onSuccess: setSaved,
  })

  function setLiked({ liked }: { liked: boolean }) {
    queryClient.setQueryData<boolean>(['post', postId, 'liked'], liked)
    queryClient.setQueryData<PagePost>(['post', postId], (old) => {
      const previousLikesCount = old!.likesCount
      const likesCount = previousLikesCount + (liked ? 1 : -1)
      return { ...old!, likesCount }
    })
  }
  function setSaved({ saved }: { saved: boolean }) {
    queryClient.setQueryData<boolean>(['post', postId, 'saved'], saved)
  }

  async function sendHandler() {
    await copyText(`${location.origin}/p/${postId}`)
    toast.success('Copied to clipboard', {
      duration: 2000,
      description: 'Share this post with your friends',
    })
  }
</script>

<div class="flex justify-between">
  <div class="flex gap-2">
    <Button
      variant="ghost"
      size="icon"
      on:click={() => $toggleLikeMutation.mutate()}
      disabled={$hasLikedQuery.isFetching || $toggleLikeMutation.isPending}
    >
      {#if $hasLikedQuery.isFetching || $toggleLikeMutation.isPending}
        <Loader2 class="animate-spin" />
      {:else}
        <!-- red-600 -->
        <Heart color={hasLiked ? '#dc2626' : undefined} fill={hasLiked ? '#dc2626' : undefined} />
      {/if}
    </Button>
    <Button variant="ghost" size="icon"><MessageCircle /></Button>
    <Button variant="ghost" size="icon" on:click={sendHandler}><Send /></Button>
  </div>
  <Button
    variant="ghost"
    size="icon"
    on:click={() => $savedPostMutation.mutate()}
    disabled={$hasSavedQuery.isFetching || $savedPostMutation.isPending}
  >
    {#if $hasSavedQuery.isFetching || $savedPostMutation.isPending}
      <Loader2 class="animate-spin" />
    {:else}
      <Bookmark color={hasSaved ? 'white' : undefined} fill={hasSaved ? 'white' : undefined} />
    {/if}
  </Button>
</div>
