import { publicProcedure, router } from '../t'
import { z } from 'zod'

export const postsRouter = router({
  get: publicProcedure.input(z.object({ userId: z.string() })).query(async ({ ctx, input }) => {
    const posts = await ctx.db.query.posts.findMany({
      where: (post, { eq }) => eq(post.authorId, input.userId),
    })
    return posts
  }),
})
