import { users } from '$lib/server/schema/schema'
import { logger } from '../middleware'
import { protectedProcedure, publicProcedure, router } from '../t'
import { TRPCError } from '@trpc/server'
import { count, eq } from 'drizzle-orm'
import { z } from 'zod'

export const userRouter = router({
  // followerNumber: publicProcedure.input(z.object({ userId: z.string() })).query(async ({ ctx }) => {
  //   // const fullUser = await ctx.db.select({ value: count() }).from(users)
  //   const count = ctx.db.
  // }),
  followers: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.query.users.findFirst({
        where: eq(users.id, input.userId),
        columns: {},
        with: {
          followers: {
            with: {
              follower: true,
              following: true,
            },
          },
        },
      })
      if (!user)
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'User not found',
        })
      return user.followers
    }),
})
