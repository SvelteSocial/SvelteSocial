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
  queryClient
    .fetchQuery({
      queryKey: ['userPosts', user.username],
      queryFn: () => trpc(event).user.posts.query({ userId: user.id }),
    })
    .then((posts) => posts.map((post) => preloadImage(post.media[0])))
}
