import { browser } from '$app/environment'
import { trpc } from '$lib/trpc/client'
import { preloadImage } from '$lib/utils'

export async function load(event) {
  const { queryClient } = await event.parent()
  const { username } = event.params

  const user = await queryClient.fetchQuery({
    queryKey: ['user', username],
    queryFn: () => trpc(event).user.get.query({ username: username }),
  })
  preloadImage(user.image)

  queryClient
    .fetchQuery({
      queryKey: ['user', user.username, 'posts'],
      queryFn: () => trpc(event).user.posts.query({ userId: user.id }),
    })
    .then((posts) => posts.map((post) => preloadImage(post.media[0])))

  return { username }
}
