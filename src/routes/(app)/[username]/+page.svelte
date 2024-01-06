<script lang="ts">
  import { Skeleton } from '$lib/components/ui/skeleton'
  import Header from './Header.svelte'
  import PostPreview from './PostPreview.svelte'
  import { createPostsQuery, createUserQuery } from '$lib/queries'

  export let data
  $: ({ username, queryClient } = data)

  $: userQuery = createUserQuery<true>({ username })
  $: user = $userQuery.data
  $: postsQuery = createPostsQuery({ author: user }, { queryClient })
  $: posts = $postsQuery.data || Array.from({ length: 9 }, () => ({ id: null }))
</script>

<svelte:head>
  <title>{user.name} ({user.username}) | SvelteSocial</title>
  <meta name="description" content="View {user.name}'s posts on SvelteSocial." />
</svelte:head>
<div class="py-8">
  <Header {user} />
  <div class="grid grid-cols-3 gap-4">
    {#each posts as { id }}
      <PostPreview postId={id} />
    {/each}
  </div>
  <!-- <code class="block overflow-hidden">{JSON.stringify($postsQuery.data)}</code> -->
</div>
