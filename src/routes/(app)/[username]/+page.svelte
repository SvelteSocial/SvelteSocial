<script lang="ts">
  import { Skeleton } from '$lib/components/ui/skeleton'
  import Header from './Header.svelte'
  import PostPreview from './PostPreview.svelte'
  import { createPostsQuery, createUserQuery } from '$lib/queries'

  export let data
  $: ({ user, localUser, queryClient } = data)

  $: userQuery = createUserQuery({ username: user.username }, { initialData: user })
  $: postsQuery = createPostsQuery({ author: user }, { queryClient })
  $: posts = $postsQuery.data || Array.from({ length: 9 }, () => ({ id: null }))
</script>

{#if $userQuery.isSuccess}
  {@const user = $userQuery.data}
  <div class="py-8">
    <Header {queryClient} {user} {localUser} />
    <div class="grid grid-cols-3 gap-4">
      {#each posts as { id }}
        <PostPreview postId={id} />
      {/each}
    </div>
    <!-- <code class="block overflow-hidden">{JSON.stringify($postsQuery.data)}</code> -->
  </div>
{/if}
