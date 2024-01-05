import { trpc } from '$lib/trpc/client.js'

export async function load(event) {
  const { queryClient } = await event.parent()

  const post = await queryClient.fetchQuery({
    queryKey: ['post', event.params.postId],
    queryFn: () =>
      trpc(event)
        .post.get.query({ postId: event.params.postId })
        .then(async (a) => {
          await new Promise((r) => setTimeout(r, 1500))
          return a
        }),
  })
  return { post }
}
