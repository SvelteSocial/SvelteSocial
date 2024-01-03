import { browser } from '$app/environment'
import { trpc } from '$lib/trpc/client'

export async function load(event) {
  if (!browser) return
  const { queryClient, user } = await event.parent()
  queryClient.prefetchQuery({
    queryKey: ['userPosts', user.username],
    queryFn: () => trpc(event).user.posts.query({ userId: user.id }),
  })
}
