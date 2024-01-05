<script lang="ts">
  import type { PagePost } from '$lib/types'
  import * as Card from '$lib/components/ui/card'
  import * as Avatar from '$lib/components/ui/avatar'
  import { Separator } from '$lib/components/ui/separator'
  import { createQuery } from '@tanstack/svelte-query'
  import { trpc } from '$lib/trpc/client'
  import { page } from '$app/stores'

  export let postId: string

  const postQuery = createQuery({
    queryKey: ['post', postId],
    queryFn: () => trpc($page).post.get.query({ postId }),
  })
</script>

<!-- <Card.Root>
  <Card.Content></Card.Content>
</Card.Root> -->

{#if $postQuery.isSuccess}
  {@const post = $postQuery.data}
  {@const author = post.author}
  <Card.Root class="flex max-w-2xl">
    <img src={post.media[0]} alt="" />
    <header class="flex h-min items-center">
      <a href="/{author.username}" class="flex items-center">
        <Avatar.Root>
          <Avatar.Image src={author.image} alt={author.name} />
          <Avatar.Fallback>{author.name}</Avatar.Fallback>
        </Avatar.Root>
        {author.username}
      </a>
      <!-- height should be as tall as tallest element -->
      <Separator orientation="vertical" class="m-4 h-4" />
      <h1>hi</h1>
    </header>
  </Card.Root>
{/if}
