import { postLikes as postLikesSchema, savedPosts as savedPostsSchema } from '$lib/server/schema'
import type { Context } from '../context'
import { protectedProcedure, publicProcedure, router } from '../t'
import { TRPCError } from '@trpc/server'
import { and, count, eq } from 'drizzle-orm'
import { z } from 'zod'

export const postRouter = router({
  get: publicProcedure.input(z.object({ postId: z.string() })).query(async ({ ctx, input }) => {
    const post = await ctx.db.query.posts.findFirst({
      where: (post, { eq }) => eq(post.id, input.postId),
      with: {
        author: {
          columns: {
            email: false,
            emailVerified: false,
            isAdmin: false,
          },
        },
      },
    })
    if (!post) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `Post with id ${input.postId} was not found`,
      })
    }
    const [{ count: likesCount }] = await ctx.db
      .select({ count: count() })
      .from(postLikesSchema)
      .where(eq(postLikesSchema.postId, input.postId))

    return { ...post, likesCount }
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
      const liked = await ctx.db.query.postLikes.findFirst({
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
      const likes = await ctx.db.query.postLikes.findMany({
        where: (like, { eq }) => eq(like.postId, input.postId),
      })
      const hasLiked = likes.some((like) => like.userId === user.id)
      if (hasLiked) {
        await ctx.db
          .delete(postLikesSchema)
          .where(and(eq(postLikesSchema.postId, input.postId), eq(postLikesSchema.userId, user.id)))
      } else {
        await ctx.db.insert(postLikesSchema).values({
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
