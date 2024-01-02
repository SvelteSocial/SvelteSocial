import { AUTH_SECRET, GITHUB_ID, GITHUB_SECRET } from '$env/static/private'
import { db } from '$lib/server/db'
import { users } from '$lib/server/schema/schema'
import { createContext } from '$lib/trpc/context'
import { appRouter } from '$lib/trpc/routers/_app'
import GitHub from '@auth/core/providers/github'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { SvelteKitAuth } from '@auth/sveltekit'
import type { Handle } from '@sveltejs/kit'
import { sequence } from '@sveltejs/kit/hooks'
import type { InferInsertModel } from 'drizzle-orm'
import { createTRPCHandle } from 'trpc-sveltekit'

const PRELOAD_TYPES = ['js', 'css', 'font']

const preloadHandle = (({ event, resolve }) =>
  resolve(event, {
    preload: ({ type }) => PRELOAD_TYPES.includes(type),
  })) satisfies Handle

function profileHandler({
  email,
  name,
  login,
  avatar_url,
}: {
  email: string | null
  name: string | null
  login: string
  avatar_url: string
}): InferInsertModel<typeof users> {
  const data = {
    id: crypto.randomUUID(),
    email: email!,
    name: name ?? login,
    username: login,
    image: avatar_url,
    bio: 'Hello World!',
  }
  return data
}
const authHandle = SvelteKitAuth({
  adapter: {
    ...DrizzleAdapter(db),
    // @ts-expect-error Custom adapter doesn't follow the interface
    createUser: async (data: ReturnType<typeof profileHandler>) => {
      return await db
        .insert(users)
        .values(data)
        .returning()
        .then((res) => res[0] ?? null)
    },
  },
  trustHost: true,
  secret: AUTH_SECRET,
  providers: [
    GitHub({
      clientId: GITHUB_ID,
      clientSecret: GITHUB_SECRET,
      profile: profileHandler,
    }),
  ],
  callbacks: {
    // @ts-expect-error Using database, not JWT
    session({ session, user }) {
      return { ...session, user }
    },
  },
})

export const handle = sequence(
  preloadHandle,
  authHandle,
  createTRPCHandle({ router: appRouter, createContext })
)
