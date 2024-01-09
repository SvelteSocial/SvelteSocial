<script lang="ts">
  import * as Card from '$lib/components/ui/card'
  import * as Avatar from '$lib/components/ui/avatar'
  import { Separator } from '$lib/components/ui/separator'
  import { createPostCommentsQuery, createPostQuery } from '$lib/queries'
  import { onMount } from 'svelte'
  import { copy } from 'svelte-copy'
  import { toast } from 'svelte-sonner'
  import PostActions from './PostActions.svelte'
  import { DateTime } from 'luxon'

  export let postId: string
  $: postQuery = createPostQuery<true>({ postId })
  $: commentsQuery = createPostCommentsQuery({ postId })

  $: post = $postQuery.data
  $: ({ author } = post)

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
  {#if mounted}
    {@const post = $postQuery.data}
    {@const author = post.author}
    {@const formatted = DateTime.fromJSDate(post.createdAt).toLocaleString(DateTime.DATETIME_MED)}
    <title>SvelteSocial post by {author.name} | {formatted}</title>
    <meta name="description" content="{post.caption} - {author.username}" />
  {/if}
</svelte:head>
<Card.Root class="verflow-hidden flex flex-row">
  <div class="flex flex-1 flex-row">
    <img src={post.media[0]} alt="" class="mx-auto object-contain" />
    <Separator orientation="vertical" />
  </div>
  <div class="">
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
    <ul class="flex h-60 w-80 flex-col gap-6 overflow-auto p-4">
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
        {#each [...$commentsQuery.data, ...$commentsQuery.data, ...$commentsQuery.data] as comment}
          {@const author = comment.author}
          <li class="flex">
            <a href="/{author.username}">
              <Avatar.Root class="mr-3">
                <Avatar.Image src={author.image} alt={author.username} />
                <Avatar.Fallback>{author.username}</Avatar.Fallback>
              </Avatar.Root>
            </a>
            <p>
              <a class="font-medium" href="/{author.username}">{author.username}</a>
              {comment.content}
            </p>
          </li>
        {:else}
          <p>Comments not found!</p>
        {/each}
      {/if}
    </ul>
    <Separator />
    <div class="p-4">
      <PostActions postId={post.id}>
        <svelte:fragment slot="top" />
        <p>{post.likesCount} like{post.likesCount ? '' : 's'}</p>
        <p class="text-sm text-muted-foreground">
          {DateTime.fromJSDate(post.createdAt).toRelative()}
        </p>
        <svelte:fragment slot="bottom" />
      </PostActions>
    </div>
    <!-- <div class="flex gap-4 p-4">
        <button>Comment</button>
        <button
          use:copy={`/p/${post.id}`}
          on:svelte-copy={() =>
            toast.success('Copied link to clipboard!', {
              description: `${window.location.origin}/p/${post.id}`,
              duration: 1750,
            })}
        >
          Share
        </button>
      </div> -->
  </div>
</Card.Root>
