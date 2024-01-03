import {
  followers as followersSchema,
  posts as postsSchema,
  users as usersSchema,
} from '$lib/server/schema/schema'
import { protectedProcedure, publicProcedure, router } from '../t'
import { TRPCError } from '@trpc/server'
import { count, eq, getTableColumns, or } from 'drizzle-orm'
import { union } from 'drizzle-orm/pg-core'
import { z } from 'zod'

export const userRouter = router({
  get: publicProcedure.input(z.object({ username: z.string() })).query(async ({ ctx, input }) => {
    const user = await ctx.db.query.users.findFirst({
      where: (user, { eq }) => eq(user.username, input.username),
      columns: {
        id: true,
        username: true,
        image: true,
        bio: true,
        createdAt: true,
      },
    })
    if (!user) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' })
    }
    const followersCountQuery = ctx.db
      .select({ count: count() })
      .from(followersSchema)
      .where(eq(followersSchema.followedId, user.id))
      .then(([followersCount]) => followersCount.count)
    const followingCountQuery = ctx.db
      .select({ count: count() })
      .from(followersSchema)
      .where(eq(followersSchema.followerId, user.id))
      .then(([followingCount]) => followingCount.count)
    const [followersCount, followingCount] = await Promise.all([
      followersCountQuery,
      followingCountQuery,
    ])
    return { ...user, followersCount, followingCount }
  }),
  followers: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const query = ctx.db.query.followers.findMany({
        where: (followers, { eq }) => eq(followers.followedId, input.userId),
        columns: {},
        with: {
          follower: {
            columns: {
              id: true,
              username: true,
              image: true,
              bio: true,
              createdAt: true,
            },
          },
        },
      })
      const followers = (await query).map(({ follower }) => follower)
      return followers
    }),
  posts: publicProcedure.input(z.object({ userId: z.string() })).query(async ({ ctx, input }) => {
    const posts = await union(
      ctx.db.select().from(postsSchema).where(eq(postsSchema.authorId, input.userId)),
      ctx.db
        .select({ ...getTableColumns(postsSchema) })
        .from(postsSchema)
        .innerJoin(followersSchema, eq(followersSchema.followedId, postsSchema.authorId))
        .where(eq(followersSchema.followerId, input.userId))
    )
    return posts
  }),
  follow: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = input
      const local = ctx.session.user
      if (userId === local.id) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Cannot follow yourself' })
      }
      const existingFollow = await ctx.db.query.followers.findFirst({
        where: (followers, { and, eq }) =>
          and(eq(followers.followerId, local.id), eq(followers.followedId, userId)),
      })
      if (existingFollow) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'You are already following this user',
        })
      }
      await ctx.db.insert(followersSchema).values({ followerId: local.id, followedId: userId })
    }),
})
