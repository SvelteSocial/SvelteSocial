import { trpc } from '$lib/trpc/client'

export async function load(event) {
  const { queryClient } = await event.parent()
  const { postId } = event.params

  await queryClient.prefetchQuery({
    queryKey: ['post', postId],
    queryFn: () => trpc(event).post.get.query({ postId }),
  })

  return { postId }
}
