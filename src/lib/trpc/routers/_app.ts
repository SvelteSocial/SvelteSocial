import { router, createCallerFactory } from '../t'
import { mockData } from './mockData'
import { postRouter } from './post'
import { userRouter } from './user'
import { type inferRouterInputs, type inferRouterOutputs } from '@trpc/server'

export const appRouter = router({
  user: userRouter,
  post: postRouter,
  mockData,
})
export const createCaller = createCallerFactory(appRouter)

export type Router = typeof appRouter

export type RouterInputs = inferRouterInputs<Router>
export type RouterOutputs = inferRouterOutputs<Router>
