import { middleware } from './t'

export const logger = middleware(async ({ path, type, next }) => {
  const start = Date.now()
  const result = await next()
  const ms = Date.now() - start
  console.log(`${result.ok ? 'OK' : 'ERR'} ${type} ${path} - ${ms}ms`)
  return result
})
