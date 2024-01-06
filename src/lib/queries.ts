import { page } from '$app/stores'
import { trpc } from './trpc/client'
import type { RouterOutputs } from './trpc/routers/_app'
import type { PageUser } from './types'
import {
  QueryClient,
  createQuery,
  type CreateQueryResult,
  type DefinedCreateQueryResult,
} from '@tanstack/svelte-query'
import { get, type Unsubscriber } from 'svelte/store'

let createPostsSubscription: Unsubscriber | undefined
export function createPostsQuery(
  { author }: { author: PageUser },
  { queryClient }: { queryClient: QueryClient }
) {
  const query = createQuery({
    queryKey: ['user', author.username, 'posts'],
    queryFn: () => trpc(get(page)).user.posts.query({ userId: author.id }),
  })
  createPostsSubscription ??= query.subscribe((query) => {
    if (query.isSuccess) {
      for (const post of query.data) {
        console.log('setting post', post.id)
        queryClient.setQueryData(['post', post.id], { ...post, author })
      }
    }
  })
  return query
}

export function createPostQuery(
  { postId }: { postId: string },
  { initialData }: { initialData?: RouterOutputs['post']['get'] }
) {
  // const query = createQuery({
  //   queryKey: ['post', postId],
  //   queryFn: () => trpc(get(page)).post.get.query({ postId }),
  // })
  // return query
  // TODO: Make a "noAuthor" query option for more efficiency
  if (initialData) {
    const query = createQuery({
      queryKey: ['post', postId],
      queryFn: () => trpc(get(page)).post.get.query({ postId }),
      initialData,
    })
    return query
  }
  const query = createQuery({
    queryKey: ['post', postId],
    queryFn: () => trpc(get(page)).post.get.query({ postId }),
  })
  return query
}

type GetQueryResult<TDefined, TData> = TDefined extends TData
  ? DefinedCreateQueryResult<TData>
  : CreateQueryResult<TData>
export function createUserQuery<TDefined extends PageUser | undefined>(
  { username }: { username: string },
  { initialData }: { initialData?: TDefined } = {}
): GetQueryResult<TDefined, PageUser> {
  // @ts-expect-error TODO: Fix this
  const query = createQuery({
    queryKey: ['user', username],
    queryFn: () => trpc(get(page)).user.get.query({ username }),
    ...(initialData && { initialData }),
  })
  return query as GetQueryResult<TDefined, PageUser>
}
