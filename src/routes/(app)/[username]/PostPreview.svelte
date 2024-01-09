<script lang="ts">
  import { goto, pushState } from '$app/navigation'
  import { Skeleton } from '$lib/components/ui/skeleton'
  import { createPostQuery } from '$lib/queries'
  import type { MouseEventHandler } from 'svelte/elements'
  import * as Card from '$lib/components/ui/card'
  import { selectedPostId } from '$lib/stores'
  import { Heart, MessageCircle } from 'lucide-svelte'

  export let postId: string | null
  $: postQuery = postId ? createPostQuery({ postId }) : null

  const handleClick = ((e) => {
    e.preventDefault()
    if (e.metaKey || innerWidth < 640 || !$postQuery?.isSuccess) return
    e.preventDefault()

    $selectedPostId = postId
  }) satisfies MouseEventHandler<HTMLAnchorElement>
</script>

<!-- <button on:click={() => (postModalOpen = true)}>open</button> -->
{#if $postQuery?.isSuccess}
  {@const post = $postQuery.data}
  <Card.Root class="aspect-square overflow-hidden">
    <a href="/p/{post.id}" class="group relative" on:click={handleClick}>
      <img
        src={post.media[0]}
        alt={post.caption}
        class="h-full w-full object-cover transition-opacity duration-150 group-hover:opacity-75"
      />
      <div
        class="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-150 group-hover:opacity-100"
      >
        <div class="flex gap-6 font-bold">
          <div class="flex">
            <Heart fill="white" class="mr-1" />
            {post.likesCount}
          </div>
          <div class="flex">
            <MessageCircle fill="white" class="mr-1" />
            {post.commentsCount}
          </div>
        </div>
      </div>
    </a>
  </Card.Root>
{:else}
  <Skeleton class="aspect-square h-full w-full" />
{/if}
