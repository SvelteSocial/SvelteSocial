import { createContext } from '$lib/trpc/context'
import { createCaller } from '$lib/trpc/routers/_app'
import { error } from '@sveltejs/kit'
import type { TRPCError } from '@trpc/server'

export async function load(event) {
  const caller = createCaller(await createContext(event))
  const user = await caller.user
    .get({ username: event.params.username })
    .catch((err: TRPCError) => error(404, err.message))
  return { user }
  // const msg = await caller.greeting()
  // return { msg }
}
