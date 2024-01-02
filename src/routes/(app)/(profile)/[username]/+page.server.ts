import { createContext } from '$lib/trpc/context'
import { createCaller } from '$lib/trpc/routers/_app'

export async function load(event) {
  const caller = createCaller(await createContext(event))
  const user = await caller.user.get({ username: '1' })
  const followerCount = await caller.user.followersCount({ userId: user.id })
  return { user, followerCount }
  // const msg = await caller.greeting()
  // return { msg }
}
