<script lang="ts">
  import { createQuery } from '@tanstack/svelte-query'
  import { trpc } from '$lib/trpc/client.js'
  import { page } from '$app/stores'
  import { Skeleton } from '$lib/components/ui/skeleton'
  import PostModal from '$lib/components/PostModal.svelte'
  import Header from './Header.svelte'
  import PostPreview from './PostPreview.svelte'

  export let data
  $: ({ user, localUser, queryClient } = data)

  $: postsQuery = createQuery({
    queryKey: ['userPosts', user.username],
    queryFn: () => trpc($page).user.posts.query({ userId: user.id }),
  })
  $: if ($postsQuery.isSuccess) {
    for (const post of $postsQuery.data) {
      queryClient.setQueryData(['post', post.id], post)
    }
  }
</script>

{#if $page.state.selectedImage}
  <PostModal data={$page.state.selectedImage} />
{/if}
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
