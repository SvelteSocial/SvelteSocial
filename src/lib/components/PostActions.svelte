<script lang="ts">
  import { page } from '$app/stores'
  import { Heart, Loader2, MessageCircle, Send } from 'lucide-svelte'
  import { Button } from '$lib/components/ui/button'
  import { createMutation } from '@tanstack/svelte-query'
  import { trpc } from '$lib/trpc/client'
  import { createPostLikesQuery } from '$lib/queries'
  import type { PostLike } from '$lib/types'

  export let postId: string
  $: ({ localUser, queryClient } = $page.data)

  const postLikes = createPostLikesQuery({ postId })
  $: liked = $postLikes.data?.some((like) => like.userId === localUser?.id) ?? false

  const likeMutation = createMutation({
    mutationFn: () => trpc($page).post.like.mutate({ postId }),
    onSuccess: setLikes,
  })

  function setLikes({ liked }: { liked: boolean }) {
    queryClient.setQueryData<PostLike[]>(['post', postId, 'likes'], (old) => {
      if (liked) {
        return [...old!, { postId, userId: localUser!.id, createdAt: new Date() }]
      }
      return old!.filter((like) => like.userId !== localUser!.id)
    })
  }
</script>

<div>
  <div class="flex justify-between">
    <div class="flex gap-2">
      <Button
        variant="ghost"
        size="icon"
        on:click={() => $likeMutation.mutate()}
        disabled={$postLikes.isFetching || $likeMutation.isPending}
      >
        {#if $postLikes.isFetching || $likeMutation.isPending}
          <Loader2 class="animate-spin" />
        {:else}
          <Heart color={liked ? 'red' : undefined} fill={liked ? 'red' : undefined} />
        {/if}
      </Button>
      <Button variant="ghost" size="icon"><MessageCircle /></Button>
      <Button variant="ghost" size="icon"><Send /></Button>
    </div>
    <Button variant="ghost" size="icon">Save</Button>
  </div>
</div>
