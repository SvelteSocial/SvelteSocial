import { db } from '$lib/server/db'
import { postLikes } from '$lib/server/schema'
import type { Context } from '../context'
import { protectedProcedure, publicProcedure, router } from '../t'
import { TRPCError } from '@trpc/server'
import { and, count, eq } from 'drizzle-orm'
import { z } from 'zod'

async function getLikes(postId: string, db: Context['db']) {
  return await db.query.postLikes.findMany({
    where: (like, { eq }) => eq(like.postId, postId),
  })
}

export const postRouter = router({
  get: publicProcedure.input(z.object({ postId: z.string() })).query(async ({ ctx, input }) => {
    const post = await ctx.db.query.posts.findFirst({
      where: (post, { eq }) => eq(post.id, input.postId),
      with: {
        author: {
          columns: {
            email: false,
            emailVerified: false,
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
      .select({
        count: count(),
      })
      .from(postLikes)
      .where(eq(postLikes.postId, input.postId))

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
  likes: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .query(async ({ ctx, input }) => {
      const likes = await getLikes(input.postId, ctx.db)
      return likes
    }),
  like: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx.session
      const likes = await getLikes(input.postId, ctx.db)
      const hasLiked = likes.some((like) => like.userId === user.id)
      if (hasLiked) {
        await ctx.db
          .delete(postLikes)
          .where(and(eq(postLikes.postId, input.postId), eq(postLikes.userId, user.id)))
        return { liked: false }
      }

      await ctx.db.insert(postLikes).values({
        postId: input.postId,
        userId: user.id,
      })
      return { liked: true }
    }),
})
