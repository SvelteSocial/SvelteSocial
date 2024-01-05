import { browser } from '$app/environment'
import { trpc } from '$lib/trpc/client'

function preloadImage(url: string) {
  return new Promise<void>((resolve) => {
    const img = new Image()
    img.src = url
    img.onload = () => resolve()
  })
}

export async function load(event) {
  if (!browser) return
  const { queryClient, user } = await event.parent()
  preloadImage(user.image)

  queryClient
    .fetchQuery({
      queryKey: ['user', user.username, 'posts'],
      queryFn: () => trpc(event).user.posts.query({ userId: user.id }),
    })
    .then((posts) => posts.map((post) => preloadImage(post.media[0])))
  queryClient.prefetchQuery({
    queryKey: ['user', user.username],
    queryFn: () => trpc(event).user.get.query({ username: user.username }),
    initialData: user,
  })
}
