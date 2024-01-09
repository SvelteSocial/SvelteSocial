<script lang="ts">
  import { page } from '$app/stores'
  import { Bookmark, Heart, Loader2, MessageCircle, SendHorizonal } from 'lucide-svelte'
  import { Button } from '$lib/components/ui/button'
  import { createMutation } from '@tanstack/svelte-query'
  import { trpc } from '$lib/trpc/client'
  import { createLikedPostQuery, createPostSavedQuery } from '$lib/queries'
  import type { PagePost } from '$lib/types'

  export let postId: string
  $: ({ localUser, queryClient } = $page.data)

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
</script>

<slot name="top">
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
      <Button variant="ghost" size="icon"><SendHorizonal /></Button>
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
</slot>
<slot />
<slot name="bottom">
  <p>Create a comment</p>
</slot>
