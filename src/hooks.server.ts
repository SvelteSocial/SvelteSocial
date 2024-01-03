import { AUTH_SECRET, GITHUB_ID, GITHUB_SECRET } from '$env/static/private'
import { db } from '$lib/server/db'
import { users } from '$lib/server/schema/schema'
import { createContext } from '$lib/trpc/context'
import { appRouter } from '$lib/trpc/routers/_app'
import GitHub from '@auth/core/providers/github'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { SvelteKitAuth } from '@auth/sveltekit'
import { redirect, type Handle } from '@sveltejs/kit'
import { sequence } from '@sveltejs/kit/hooks'
import type { InferInsertModel } from 'drizzle-orm'
import { createTRPCHandle } from 'trpc-sveltekit'

const PRELOAD_TYPES = ['js', 'css', 'font']

const preloadHandle = (({ event, resolve }) =>
  resolve(event, {
    preload: ({ type }) => PRELOAD_TYPES.includes(type),
  })) satisfies Handle

function profileHandler({
  id,
  email,
  name,
  login,
  avatar_url,
}: {
  id: number
  email: string | null
  name: string | null
  login: string
  avatar_url: string
}): InferInsertModel<typeof users> {
  const data = {
    id: id + '',
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

const protectHandle = (async ({ event, resolve }) => {
  const route = event.route.id
  const isDev = route?.startsWith('/dev')
  const isApp = route?.startsWith('/(app)')
  const isProtected = route?.startsWith('/(app)/(protected)')

  if (isDev) return resolve(event)
  if (isApp && !isProtected) return resolve(event)

  console.log('Got session for checking auth in protectHandle')
  const session = await event.locals.getSession()
  const user = session?.user

  function getClientIp() {
    return event.request.headers.get('cf-connecting-ip') || 'LOCALHOST'
  }
  if (!isProtected && user) {
    console.log(`${getClientIp()} ${route} failed because user`)
    redirect(302, '/explore')
  }
  if (isProtected && !user) {
    console.log(`${getClientIp()} ${route} failed because no user`)
    redirect(302, '/')
  }
  return resolve(event)
}) satisfies Handle

export const handle = sequence(
  preloadHandle,
  authHandle,
  createTRPCHandle({ router: appRouter, createContext }),
  protectHandle
)
