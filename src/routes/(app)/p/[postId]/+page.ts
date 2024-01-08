import { browser } from '$app/environment'
import { trpc } from '$lib/trpc/client'
import { error } from '@sveltejs/kit'

export async function load(event) {
  const { queryClient } = await event.parent()
  const { postId } = event.params

  await queryClient
    .fetchQuery({
      queryKey: ['post', postId],
      queryFn: () => trpc(event).post.get.query({ postId }),
    })
    .catch(() => error(404, 'Post not found'))
  if (browser) {
    queryClient.prefetchQuery({
      queryKey: ['post', postId, 'comments'],
      queryFn: () => trpc(event).post.comments.query({ postId }),
    })
    queryClient.prefetchQuery({
      queryKey: ['post', postId, 'liked'],
      queryFn: () => trpc(event).post.liked.query({ postId }),
    })
    queryClient.prefetchQuery({
      queryKey: ['post', postId, 'saved'],
      queryFn: () => trpc(event).post.saved.query({ postId }),
    })
  }

  return { postId }
}
