import {
  followers as followersSchema,
  posts as postsSchema,
  users as usersSchema,
} from '$lib/server/schema'
import { omit } from '$lib/utils'
import { protectedProcedure, publicProcedure, router } from '../t'
import { TRPCError } from '@trpc/server'
import { count, eq, getTableColumns, or } from 'drizzle-orm'
import { union } from 'drizzle-orm/pg-core'
import { z } from 'zod'

export const userRouter = router({
  get: publicProcedure.input(z.object({ username: z.string() })).query(async ({ ctx, input }) => {
    const session = await ctx.getSession()
    const localUser = session?.user
    const user = await ctx.db.query.users.findFirst({
      where: (user, { eq }) => eq(user.username, input.username),
      columns: {
        email: false,
        emailVerified: false,
      },
      with: {
        followers: {
          where:
            localUser && localUser.username === input.username
              ? (followers, { eq, or }) =>
                  or(eq(followers.followerId, localUser.id), eq(followers.followedId, localUser.id))
              : undefined,
        },
      },
    })
    if (!user) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' })
    }

    const isFollowing =
      !!localUser && user.followers.map(({ followerId }) => followerId).includes(localUser.id)
    const isFollowedBy =
      !!localUser && user.followers.map(({ followedId }) => followedId).includes(localUser.id)
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
    return { ...omit(user, 'followers'), followersCount, followingCount, isFollowing, isFollowedBy }
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
    ).orderBy(postsSchema.createdAt)
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
