import type {
  users as usersSchema,
  followers as followersSchema,
  postLikes as postLikesSchema,
  savedPosts as savedPostsSchema,
} from './server/schema'
import type { RouterOutputs } from './trpc/routers/_app'
import type { InferSelectModel } from 'drizzle-orm'

export type UnsafeUser = InferSelectModel<typeof usersSchema>
// export type User = Omit<UnsafeUser, 'email' | 'emailVerified'>
export type PageUser = RouterOutputs['user']['get']
// export type Post = InferSelectModel<typeof posts>
export type PagePost = RouterOutputs['post']['get']
// export type Comment = InferSelectModel<typeof postComments>
export type PageComment = RouterOutputs['post']['comments'][number]
export type Follower = InferSelectModel<typeof followersSchema>
export type PostLike = InferSelectModel<typeof postLikesSchema>
export type SavedPost = InferSelectModel<typeof savedPostsSchema>
