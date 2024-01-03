import type { posts, users as usersSchema } from './server/schema/schema'
import type { RouterOutputs } from './trpc/routers/_app'
import type { InferSelectModel } from 'drizzle-orm'

export type PageUser = RouterOutputs['user']['get']
export type User = InferSelectModel<typeof usersSchema>
export type Post = InferSelectModel<typeof posts>
