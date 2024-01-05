import { page } from '$app/stores'
import { trpc } from './trpc/client'
import { QueryClient, createQuery } from '@tanstack/svelte-query'
import { get, type Unsubscriber } from 'svelte/store'

let createPostSubscription: Unsubscriber | undefined
export function createPostsQuery(
  { username, userId }: { username: string; userId: string },
  { queryClient }: { queryClient: QueryClient }
) {
  const query = createQuery({
    queryKey: ['user', username, 'posts'],
    queryFn: () => trpc(get(page)).user.posts.query({ userId }),
  })
  createPostSubscription ??= query.subscribe((query) => {
    if (query.isSuccess) {
      for (const post of query.data) {
        console.log('setting post', post.id)
        queryClient.setQueryData(['post', post.id], post)
      }
    }
  })
  return query
}
