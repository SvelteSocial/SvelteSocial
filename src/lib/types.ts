import type { users as usersSchema, followers as followersSchema } from './server/schema'
import type { RouterOutputs } from './trpc/routers/_app'
import type { InferSelectModel } from 'drizzle-orm'

export type UnsafeUser = InferSelectModel<typeof usersSchema>
// export type User = Omit<UnsafeUser, 'email' | 'emailVerified'>
export type PageUser = RouterOutputs['user']['get']
// export type Post = InferSelectModel<typeof posts>
export type PagePost = RouterOutputs['post']['get']
export type Follower = InferSelectModel<typeof followersSchema>
