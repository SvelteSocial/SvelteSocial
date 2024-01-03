<script lang="ts">
  import { createQuery } from '@tanstack/svelte-query'
  import * as Avatar from '$lib/components/ui/avatar'
  import { trpc } from '$lib/trpc/client.js'
  import { page } from '$app/stores'

  export let data
  $: ({ user } = data)

  $: userQuery = createQuery({
    queryKey: ['user', user.username],
    queryFn: () => trpc($page).user.get.query({ username: user.username }),
    initialData: user,
  })
  $: postsQuery = createQuery({
    queryKey: ['userPosts', user.username],
    queryFn: () => trpc($page).user.posts.query({ userId: user.id }),
  })

  // $: isOwner = user.id =
</script>

<div class="bg-green-500">
  <header>
    <Avatar.Root>
      <Avatar.Image src={user.image} alt={user.username} />
      <Avatar.Fallback>{user.username}</Avatar.Fallback>
    </Avatar.Root>
  </header>
  <code>{JSON.stringify($postsQuery.data)}</code>
</div>
