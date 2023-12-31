<script lang="ts">
  import { createMutation } from '@tanstack/svelte-query'
  import * as Avatar from '$lib/components/ui/avatar'
  import { trpc } from '$lib/trpc/client'
  import { page } from '$app/stores'
  import { Button } from '$lib/components/ui/button'
  import { Loader2 } from 'lucide-svelte'
  import type { PageUser } from '$lib/types'

  export let user: PageUser

  $: isOwner = user.id === $page.data.localUser?.id

  const followMutation = createMutation({
    mutationFn: () => trpc($page).user.follow.mutate({ userId: user.id }),
  })
  const formatter = new Intl.NumberFormat()
</script>

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
        <span class="font-medium">{formatter.format(user.postsCount)}</span>
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
