import { relations } from 'drizzle-orm'
import { timestamp, pgTable, text, primaryKey } from 'drizzle-orm/pg-core'
import { nanoid } from 'nanoid'

export * from './auth'

export const users = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  username: text('username').unique().notNull(),
  bio: text('bio').notNull(),
  email: text('email').unique().notNull(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  image: text('image').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})
export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  followers: many(followers),
}))

export const followers = pgTable(
  'follower',
  {
    followerId: text('follower_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    followedId: text('followed_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  ({ followerId, followedId }) => ({
    pk: primaryKey({ columns: [followerId, followedId] }),
  })
)
export const followersRelations = relations(followers, ({ one }) => ({
  follower: one(users, {
    fields: [followers.followerId],
    references: [users.id],
  }),
  followed: one(users, {
    fields: [followers.followedId],
    references: [users.id],
  }),
}))

export const posts = pgTable('post', {
  id: text('id')
    .$defaultFn(() => nanoid(12))
    .primaryKey(),
  media: text('media').array().notNull(),
  caption: text('caption').notNull(),
  authorId: text('author_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})
export const postsRelations = relations(posts, ({ one }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
}))

export const postLikes = pgTable(
  'post_like',
  {
    postId: text('post_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    userId: text('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  ({ postId, userId }) => ({
    pk: primaryKey({ columns: [postId, userId] }),
  })
)
export const postLikesRelations = relations(postLikes, ({ one }) => ({
  post: one(posts, {
    fields: [postLikes.postId],
    references: [posts.id],
  }),
  user: one(users, {
    fields: [postLikes.userId],
    references: [users.id],
  }),
}))
