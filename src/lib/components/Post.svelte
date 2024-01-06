<script lang="ts">
  import * as Card from '$lib/components/ui/card'
  import * as Avatar from '$lib/components/ui/avatar'
  import { Separator } from '$lib/components/ui/separator'
  import { createPostQuery } from '$lib/queries'
  import { onMount } from 'svelte'

  export let postId: string
  $: postQuery = createPostQuery({ postId })

  const formatter = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  })

  let mounted = false
  onMount(() => {
    mounted = true
    return () => (mounted = false)
  })
</script>

<!-- <Card.Root>
  <Card.Content></Card.Content>
</Card.Root> -->

<svelte:head>
  {#if $postQuery.isSuccess && mounted}
    {@const post = $postQuery.data}
    {@const author = post.author}
    {@const formatted = formatter.format(post.createdAt)}
    <title>SvelteSocial post by {author.name} | {formatted}</title>
    <meta name="description" content="{post.caption} - {author.username}" />
  {/if}
</svelte:head>
{#if $postQuery.isSuccess}
  {@const post = $postQuery.data}
  {@const author = post.author}
  <Card.Root class="flex max-w-2xl">
    <img src={post.media[0]} alt="" />
    <div class="p-4">
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
        <p>hi</p>
      </header>
      <p>{post.caption}</p>
    </div>
  </Card.Root>
{/if}
