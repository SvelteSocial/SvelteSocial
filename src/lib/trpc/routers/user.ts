import { followers as followersSchema, posts as postsSchema } from '$lib/server/schema'
import type { Follower } from '$lib/types'
import { omit } from '$lib/utils'
import { protectedProcedure, publicProcedure, router } from '../t'
import { TRPCError } from '@trpc/server'
import { count, eq, getTableColumns } from 'drizzle-orm'
import { union } from 'drizzle-orm/pg-core'
import { z } from 'zod'

export const userRouter = router({
  get: publicProcedure.input(z.object({ username: z.string() })).query(async ({ ctx, input }) => {
    const session = await ctx.getSession()
    const localUser = session?.user
    const _user = await ctx.db.query.users.findFirst({
      where: (user, { eq }) => eq(user.username, input.username),
      columns: {
        email: false,
        emailVerified: false,
        isAdmin: false,
      },
      with:
        localUser && localUser.username !== input.username
          ? {
              followers: {
                where: (followers, { eq, or }) =>
                  or(
                    eq(followers.followerId, localUser.id),
                    eq(followers.followedId, localUser.id)
                  ),
              },
            }
          : {},
    })
    // we need to do this because conditional `with` is not supported yet
    const user = _user as typeof _user & { followers?: Follower[] }
    if (!user) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' })
    }

    const isFollowing =
      !!localUser && user.followers?.map(({ followerId }) => followerId).includes(localUser.id)
    const isFollowedBy =
      !!localUser && user.followers?.map(({ followedId }) => followedId).includes(localUser.id)
    const postsCountQuery = await ctx.db
      .select({ count: count() })
      .from(postsSchema)
      .where(eq(postsSchema.authorId, user.id))
    const followersCountQuery = ctx.db
      .select({ count: count() })
      .from(followersSchema)
      .where(eq(followersSchema.followedId, user.id))
    const followingCountQuery = ctx.db
      .select({ count: count() })
      .from(followersSchema)
      .where(eq(followersSchema.followerId, user.id))
    const [postsCount, followersCount, followingCount] = await Promise.all([
      postsCountQuery,
      followersCountQuery,
      followingCountQuery,
      // each query return looks like [{ count: 1 }], so we need to map it to [0].count
    ]).then((counts) => counts.map((count) => count[0].count))

    return {
      ...omit(user, 'followers'),
      postsCount,
      followersCount,
      followingCount,
      isFollowing,
      isFollowedBy,
    }
  }),
  followers: protectedProcedure.query(async ({ ctx }) => {
    const { user } = ctx.session
    const query = ctx.db.query.followers.findMany({
      where: (followers, { eq }) => eq(followers.followedId, user.id),
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
      const local = ctx.session.user
      if (input.userId === local.id) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Cannot follow yourself' })
      }
      const existingFollow = await ctx.db.query.followers.findFirst({
        where: (followers, { and, eq }) =>
          and(eq(followers.followerId, local.id), eq(followers.followedId, input.userId)),
      })
      if (existingFollow) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'You are already following this user',
        })
      }
      await ctx.db
        .insert(followersSchema)
        .values({ followerId: local.id, followedId: input.userId })
    }),
  // savedPosts: protectedProcedure.query(async ({ ctx }) => {
  //   const { user } = ctx.session
  //   const saved = await ctx.db.query.savedPosts.findMany({
  //     where: (saved, { eq }) => eq(saved.userId, user.id),
  //   })
  //   return saved
  // }),
})
