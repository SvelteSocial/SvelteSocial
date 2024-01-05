<script lang="ts">
  import { createQuery } from '@tanstack/svelte-query'
  import { trpc } from '$lib/trpc/client.js'
  import { page } from '$app/stores'
  import { Skeleton } from '$lib/components/ui/skeleton'
  import Header from './Header.svelte'
  import PostPreview from './PostPreview.svelte'
  import { createPostsQuery } from '$lib/queries'

  export let data
  $: ({ user, localUser, queryClient } = data)

  $: userQuery = createQuery({
    queryKey: ['user', user.username],
    queryFn: () => trpc($page).user.get.query({ username: user.username }),
    initialData: user,
  })

  $: postsQuery = createPostsQuery({ userId: user.id, username: user.username }, { queryClient })
</script>

{#if $userQuery.isSuccess}
  {@const user = $userQuery.data}
  <div class="py-8">
    <Header {queryClient} {user} {localUser} />
    <div class="grid grid-cols-3 gap-4">
      {#if $postsQuery.isSuccess}
        {#each $postsQuery.data as post}
          <PostPreview {post} />
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
{/if}
