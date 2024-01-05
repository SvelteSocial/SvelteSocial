<script lang="ts">
  import { goto, pushState } from '$app/navigation'
  import { page } from '$app/stores'
  import PostModal from '$lib/components/PostModal.svelte'
  import { Skeleton } from '$lib/components/ui/skeleton'
  import { createPostQuery } from '$lib/queries'
  import type { MouseEventHandler } from 'svelte/elements'

  export let postId: string | null
  $: postQuery = postId ? createPostQuery({ postId }, {}) : null

  const handleClick = ((e) => {
    e.preventDefault()
    if (e.metaKey || innerWidth < 640 || !$postQuery?.isSuccess) return
    e.preventDefault()

    const { href } = e.currentTarget
    try {
      pushState(href, { selectedImageId: $postQuery.data.id })
    } catch {
      goto(href)
    }
  }) satisfies MouseEventHandler<HTMLAnchorElement>

  // $: postModalOpen = $page.state.selectedImageId === post.id
  // let postModalOpen = false
</script>

<!-- <button on:click={() => (postModalOpen = true)}>open</button> -->
{#if $postQuery?.isSuccess}
  {@const post = $postQuery.data}
  <PostModal {post} open={$page.state.selectedImageId === post.id} />
  <div class="aspect-square">
    <a href="/p/{post.id}" class="group relative" on:click={handleClick}>
      <img
        src={post.media[0]}
        alt={post.caption}
        class="h-full w-full object-cover transition-opacity duration-150 group-hover:opacity-75"
      />
      <div
        class="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-150 group-hover:opacity-100"
      >
        <p>hi</p>
      </div>
    </a>
  </div>
{:else}
  <Skeleton class="aspect-square h-full w-full rounded-none" />
{/if}
