import {
  users as usersSchema,
  followers as followersSchema,
  posts as postsSchema,
  likedPosts as likedPostsSchema,
  postComments as postCommentsSchema,
} from '$lib/server/schema'
import type { Follower } from '$lib/types'
import { omit } from '$lib/utils'
import { protectedProcedure, publicProcedure, router } from '../t'
import { TRPCError } from '@trpc/server'
import { count, countDistinct, eq, getTableColumns, or } from 'drizzle-orm'
import { union } from 'drizzle-orm/pg-core'
import { z } from 'zod'

export const userRouter = router({
  get: publicProcedure.input(z.object({ username: z.string() })).query(async ({ ctx, input }) => {
    const session = await ctx.getSession()
    const localUser = session?.user
    const [user] = await ctx.db
      .select({
        ...omit(getTableColumns(usersSchema), 'email', 'emailVerified', 'isAdmin'),
        postsCount: countDistinct(postsSchema),
        followersCount: countDistinct(eq(followersSchema.followedId, usersSchema.id)),
        followingCount: countDistinct(eq(followersSchema.followerId, usersSchema.id)),
        ...(localUser && {
          isFollowing: count(eq(followersSchema.followerId, localUser.id)),
          isFollowedBy: count(eq(followersSchema.followedId, localUser.id)),
        }),
      })
      .from(usersSchema)
      .leftJoin(postsSchema, eq(postsSchema.authorId, usersSchema.id))
      .leftJoin(
        followersSchema,
        or(
          eq(followersSchema.followerId, usersSchema.id),
          eq(followersSchema.followedId, usersSchema.id)
        )
      )
      .where(eq(usersSchema.username, input.username))
      .groupBy(usersSchema.id)
    return { ...user, isFollowing: !!user.isFollowing, isFollowedBy: !!user.isFollowedBy }
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
    const posts = await ctx.db
      .select({
        ...getTableColumns(postsSchema),
        likesCount: countDistinct(likedPostsSchema),
        commentsCount: countDistinct(postCommentsSchema),
      })
      .from(postsSchema)
      .leftJoin(likedPostsSchema, eq(likedPostsSchema.postId, postsSchema.id))
      .leftJoin(postCommentsSchema, eq(postCommentsSchema.postId, postsSchema.id))
      .where(eq(postsSchema.authorId, input.userId))
      .groupBy(postsSchema.id)
      .orderBy(postsSchema.createdAt)

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
