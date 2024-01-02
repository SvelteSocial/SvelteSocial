import { followers } from '$lib/server/schema/schema'
import { protectedProcedure, publicProcedure, router } from '../t'
import { TRPCError } from '@trpc/server'
import { count, eq } from 'drizzle-orm'
import { z } from 'zod'

export const userRouter = router({
  followersCount: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const [followersCount] = await ctx.db
        .select({ count: count() })
        .from(followers)
        .where(eq(followers.followedId, input.userId))
      return { count: followersCount.count }
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
})
