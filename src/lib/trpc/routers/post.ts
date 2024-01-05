import { publicProcedure, router } from '../t'
import { TRPCError } from '@trpc/server'
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
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return post
  }),
})
