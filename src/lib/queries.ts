import { page } from '$app/stores'
import { trpc } from './trpc/client'
import type { PostLike, PageComment, PagePost, PageUser, SavedPost } from './types'
import {
  QueryClient,
  createQuery,
  type CreateQueryResult,
  type DefinedCreateQueryResult,
} from '@tanstack/svelte-query'
import { get, type Unsubscriber } from 'svelte/store'

type GetQueryResult<TDefined, TData> = TDefined extends true
  ? DefinedCreateQueryResult<TData>
  : CreateQueryResult<TData>

let createPostsSubscription: Unsubscriber | undefined
export function createPostsQuery(
  { author }: { author: PageUser },
  { queryClient }: { queryClient: QueryClient }
) {
  const query = createQuery({
    queryKey: ['user', author.username, 'posts'],
    queryFn: () => trpc(get(page)).user.posts.query({ userId: author.id }),
  })
  createPostsSubscription ??= query.subscribe(({ isSuccess, data }) => {
    if (!isSuccess) return
    for (const post of data) {
      console.log('setting post', post.id)
      queryClient.setQueryData(['post', post.id], { ...post, author })
    }
  })
  return query
}

export function createPostQuery<TDefined extends boolean = false>({ postId }: { postId: string }) {
  // TODO: Make a "noAuthor" query option for more efficiency
  const query = createQuery({
    queryKey: ['post', postId],
    queryFn: () => trpc(get(page)).post.get.query({ postId }),
  })
  return query as GetQueryResult<TDefined, PagePost>
}

export function createPostCommentsQuery<TDefined extends boolean = false>({
  postId,
}: {
  postId: string
}) {
  const query = createQuery({
    queryKey: ['post', postId, 'comments'],
    queryFn: () => trpc(get(page)).post.comments.query({ postId }),
  })
  console.log('creating comments query', postId)
  return query as GetQueryResult<TDefined, PageComment[]>
}

export function createPostLikedQuery<TDefined extends boolean = false>({
  postId,
}: {
  postId: string
}) {
  const query = createQuery({
    queryKey: ['post', postId, 'liked'],
    queryFn: () => trpc(get(page)).post.liked.query({ postId }),
  })
  return query as GetQueryResult<TDefined, boolean>
}
export function createPostSavedQuery<TDefined extends boolean = false>({
  postId,
}: {
  postId: string
}) {
  const query = createQuery({
    queryKey: ['post', postId, 'saved'],
    queryFn: () => trpc(get(page)).post.saved.query({ postId }),
  })
  return query as GetQueryResult<TDefined, boolean>
}
// export function createPostLikesQuery<TDefined extends boolean = false>({
//   postId,
// }: {
//   postId: string
// }) {
//   const query = createQuery({
//     queryKey: ['post', postId, 'likes'],
//     queryFn: () => trpc(get(page)).post.likes.query({ postId }),
//   })
//   return query as GetQueryResult<TDefined, PostLike[]>
// }

export function createUserQuery<TDefined extends boolean = false>({
  username,
}: {
  username: string
}) {
  const query = createQuery({
    queryKey: ['user', username],
    queryFn: () => trpc(get(page)).user.get.query({ username }),
  })
  return query as GetQueryResult<TDefined, PageUser>
}

// let createSavedPostsSubscription: Unsubscriber | undefined
// export function createSavedPostsQuery<TDefined extends boolean = false>() {
//   const query = createQuery({
//     queryKey: ['savedPosts'],
//     queryFn: () => trpc(get(page)).user.savedPosts.query(),
//   })
//   createSavedPostsSubscription ??= query.subscribe(({ isSuccess, data }) => {
//     if (!isSuccess) return
//     for (const { postId } of data) {
//       console.log('setting saved post', postId)
//       createPostQuery({ postId })
//     }
//   })
//   return query as GetQueryResult<TDefined, SavedPost[]>
// }

// export function createUserQuery<TDefined extends PageUser | undefined>(
//   { username }: { username: string },
//   { initialData }: { initialData?: TDefined } = {}
// ): GetQueryResult<TDefined, PageUser> {
//   // @ts-expect-error TODO: Fix this
//   const query = createQuery({
//     queryKey: ['user', username],
//     queryFn: () => trpc(get(page)).user.get.query({ username }),
//     ...(initialData && { initialData }),
//   })
//   return query as GetQueryResult<TDefined, PageUser>
// }
