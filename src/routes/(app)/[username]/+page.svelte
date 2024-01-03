<script lang="ts">
  import { createMutation, createQuery } from '@tanstack/svelte-query'
  import * as Avatar from '$lib/components/ui/avatar'
  import { trpc } from '$lib/trpc/client.js'
  import { page } from '$app/stores'
  import { Button } from '$lib/components/ui/button'
  import { Loader2 } from 'lucide-svelte'
  import { Skeleton } from '$lib/components/ui/skeleton'
  import PostModal from '$lib/components/PostModal.svelte'
  import { goto, pushState } from '$app/navigation'

  export let data
  $: ({ user, localUser, queryClient } = data)

  $: userQuery = createQuery({
    queryKey: ['user', user.username],
    queryFn: () => trpc($page).user.get.query({ username: user.username }),
    initialData: user,
  })
  $: postsQuery = createQuery({
    queryKey: ['userPosts', user.username],
    queryFn: () => trpc($page).user.posts.query({ userId: user.id }),
  })
  $: if ($postsQuery.isSuccess) {
    for (const post of $postsQuery.data) {
      queryClient.setQueryData(['post', post.id], post)
    }
  }

  $: isOwner = user.id === localUser?.id
  const followMutation = createMutation({
    mutationFn: () => trpc($page).user.follow.mutate({ userId: user.id }),
  })

  const formatter = new Intl.NumberFormat()
</script>

{#if $page.state.selectedImage}
  <PostModal data={$page.state.selectedImage} />
{/if}
<div class="py-8">
  <header class="flex gap-20 pb-8">
    <Avatar.Root class="h-40 w-40">
      <Avatar.Image src={user.image} alt={user.username} />
      <Avatar.Fallback>{user.username}</Avatar.Fallback>
    </Avatar.Root>
    <div class="">
      <div class="mb-4 flex items-center gap-4">
        <h1 class="text-xl font-medium">{user.username}</h1>
        {#if isOwner}
          <Button size="sm">Edit Profile</Button>
        {:else}
          <Button
            on:click={() => $followMutation.mutate()}
            disabled={$followMutation.isPending}
            size="sm"
          >
            {#if $followMutation.isPending}
              <Loader2 class="animate-spin" />
            {:else}
              Follow
            {/if}
          </Button>
        {/if}
      </div>
      <div class="mb-5 flex justify-around gap-8">
        <p>
          {#if $postsQuery.isSuccess}
            <span class="font-medium">{formatter.format($postsQuery.data.length)}</span>
          {:else}
            <Loader2 class="mr-1 inline animate-spin" aria-label="Loading..." size="20" />
          {/if}
          posts
        </p>
        <p>
          <span class="font-medium">{formatter.format(user.followersCount)}</span> followers
        </p>
        <p>
          <span class="font-medium">{formatter.format(user.followingCount)}</span> following
        </p>
      </div>
      <p class="mb-5">{user.bio}</p>
      <p class="text-muted-foreground">Joined {new Date(user.createdAt).toLocaleDateString()}</p>
    </div>
  </header>
  <div class="grid grid-cols-3 gap-4">
    {#if $postsQuery.isSuccess}
      {#each $postsQuery.data as post}
        <div class="aspect-square">
          <a
            href="/p/{post.id}"
            class="group relative"
            on:click={(e) => {
              if (e.metaKey || innerWidth < 640) return
              e.preventDefault()

              const { href } = e.currentTarget
              try {
                pushState(href, { selectedImage: post })
              } catch {
                goto(href)
              }
            }}
          >
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
      {/each}
    {:else}
      {#each Array(9) as _}
        <div class="aspect-square">
          <Skeleton class="h-full w-full rounded-none" />
        </div>
      {/each}
    {/if}
  </div>
  <!-- <code class="block overflow-hidden">{JSON.stringify($postsQuery.data)}</code> -->
</div>
