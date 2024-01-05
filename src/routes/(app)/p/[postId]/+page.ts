import { trpc } from '$lib/trpc/client.js'

export async function load(event) {
  const { queryClient, post } = await event.parent()

  queryClient.prefetchQuery({
    queryKey: ['post', event.params.postId],
    queryFn: () => trpc(event).post.get.query({ postId: event.params.postId }),
    initialData: post,
  })
}
