import { createContext } from '$lib/trpc/context'
import { createCaller } from '$lib/trpc/routers/_app'
import { error } from '@sveltejs/kit'
import type { TRPCError } from '@trpc/server'

export async function load(event) {
  const caller = createCaller(await createContext(event))
  const post = await caller.post.get({
    postId: event.params.postId,
  })

  return { post }
}
