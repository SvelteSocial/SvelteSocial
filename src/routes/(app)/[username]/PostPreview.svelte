<script lang="ts">
  import { goto, pushState } from '$app/navigation'
  import type { Post } from '$lib/types'
  import type { MouseEventHandler } from 'svelte/elements'

  export let post: Post

  const handleClick = ((e) => {
    if (e.metaKey || innerWidth < 640) return
    e.preventDefault()

    const { href } = e.currentTarget
    try {
      pushState(href, { selectedImage: post })
    } catch {
      goto(href)
    }
  }) satisfies MouseEventHandler<HTMLAnchorElement>
</script>

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
