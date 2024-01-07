<script lang="ts">
  import * as Card from '$lib/components/ui/card'
  import * as Avatar from '$lib/components/ui/avatar'
  import { Separator } from '$lib/components/ui/separator'
  import { createPostCommentsQuery, createPostQuery } from '$lib/queries'
  import { onMount } from 'svelte'

  export let postId: string
  $: postQuery = createPostQuery({ postId })
  $: commentsQuery = createPostCommentsQuery({ postId })

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
  <Card.Root class="flex">
    <img src={post.media[0]} alt="" />
    <Separator orientation="vertical" />
    <div>
      <header class="p-4">
        <a href="/{author.username}" class="flex items-center font-medium">
          <Avatar.Root class="mr-3">
            <Avatar.Image src={author.image} alt={author.username} />
            <Avatar.Fallback>{author.username}</Avatar.Fallback>
          </Avatar.Root>
          {author.username}
        </a>
      </header>
      <Separator />
      <ul class="flex flex-col gap-6 p-4">
        {#if post.caption}
          <div class="flex">
            <Avatar.Root class="mr-3">
              <Avatar.Image src={author.image} alt={author.name} />
              <Avatar.Fallback>{author.name}</Avatar.Fallback>
            </Avatar.Root>
            <p>
              <span class="font-medium">{author.name}</span>
              {post.caption}
            </p>
          </div>
        {/if}
        {#if $commentsQuery.isSuccess}
          {#each $commentsQuery.data as comment}
            {@const author = comment.author}
            <li class="flex">
              <Avatar.Root class="mr-3">
                <Avatar.Image src={author.image} alt={author.username} />
                <Avatar.Fallback>{author.username}</Avatar.Fallback>
              </Avatar.Root>
              <p>
                <span class="font-medium">{author.username}</span>
                {comment.content}
              </p>
            </li>
          {:else}
            <p>Comments not found!</p>
          {/each}
        {/if}
      </ul>
    </div>
  </Card.Root>
{/if}
