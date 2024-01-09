import {
  users as usersSchema,
  likedPosts as likedPostsSchema,
  savedPosts as savedPostsSchema,
  posts as postsSchema,
  postComments as postCommentsSchema,
} from '$lib/server/schema'
import { omit } from '$lib/utils'
import type { Context } from '../context'
import { protectedProcedure, publicProcedure, router } from '../t'
import { TRPCError } from '@trpc/server'
import { and, countDistinct, eq, getTableColumns } from 'drizzle-orm'
import { z } from 'zod'

export const postRouter = router({
  get: publicProcedure.input(z.object({ postId: z.string() })).query(async ({ ctx, input }) => {
    const [post] = await ctx.db
      .select({
        ...getTableColumns(postsSchema),
        author: omit(getTableColumns(usersSchema), 'email', 'emailVerified', 'isAdmin'),
        likesCount: countDistinct(likedPostsSchema),
        commentsCount: countDistinct(postCommentsSchema),
      })
      .from(postsSchema)
      .innerJoin(usersSchema, eq(usersSchema.id, postsSchema.authorId))
      .leftJoin(likedPostsSchema, eq(likedPostsSchema.postId, postsSchema.id))
      .leftJoin(postCommentsSchema, eq(postCommentsSchema.postId, postsSchema.id))
      .where(eq(postsSchema.id, input.postId))
      .groupBy(postsSchema.id, usersSchema.id)

    if (!post) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `Post with id ${input.postId} was not found`,
      })
    }

    return post
  }),
  comments: publicProcedure
    .input(z.object({ postId: z.string() }))
    .query(async ({ ctx, input }) => {
      const comments = await ctx.db.query.postComments.findMany({
        where: (comment, { eq }) => eq(comment.postId, input.postId),
        with: {
          author: {
            columns: {
              username: true,
              image: true,
            },
          },
        },
      })
      return comments
    }),
  liked: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { user } = ctx.session
      const liked = await ctx.db.query.likedPosts.findFirst({
        where: (like, { eq }) => and(eq(like.postId, input.postId), eq(like.userId, user.id)),
      })
      return !!liked
    }),
  saved: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { user } = ctx.session
      const saved = await ctx.db.query.savedPosts.findFirst({
        where: (savedPost, { eq }) =>
          and(eq(savedPost.postId, input.postId), eq(savedPost.userId, user.id)),
      })
      return !!saved
    }),
  toggleLike: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx.session
      const likes = await ctx.db.query.likedPosts.findMany({
        where: (like, { eq }) => eq(like.postId, input.postId),
      })
      const hasLiked = likes.some((like) => like.userId === user.id)
      if (hasLiked) {
        await ctx.db
          .delete(likedPostsSchema)
          .where(
            and(eq(likedPostsSchema.postId, input.postId), eq(likedPostsSchema.userId, user.id))
          )
      } else {
        await ctx.db.insert(likedPostsSchema).values({
          postId: input.postId,
          userId: user.id,
        })
      }
      return { liked: !hasLiked }
    }),
  toggleSave: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx.session
      const savedPosts = await ctx.db.query.savedPosts.findMany({
        where: (savedPost, { eq }) => eq(savedPost.postId, input.postId),
      })
      const hasSaved = savedPosts.some((savedPost) => savedPost.userId === user.id)
      if (hasSaved) {
        await ctx.db
          .delete(savedPostsSchema)
          .where(
            and(eq(savedPostsSchema.postId, input.postId), eq(savedPostsSchema.userId, user.id))
          )
      } else {
        await ctx.db.insert(savedPostsSchema).values({
          postId: input.postId,
          userId: user.id,
        })
      }
      return { saved: !hasSaved }
    }),
})
