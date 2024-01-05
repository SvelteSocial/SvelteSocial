import { createContext } from '$lib/trpc/context'
import { appRouter } from '$lib/trpc/routers/_app'
import { authHandle } from './auth'
import { redirect, type Handle } from '@sveltejs/kit'
import { sequence } from '@sveltejs/kit/hooks'
import { createTRPCHandle } from 'trpc-sveltekit'

const PRELOAD_TYPES = ['js', 'css', 'font']

const preloadHandle = (({ event, resolve }) =>
  resolve(event, {
    preload: ({ type }) => PRELOAD_TYPES.includes(type),
  })) satisfies Handle

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
