import { AUTH_SECRET, GITHUB_ID, GITHUB_SECRET } from '$env/static/private'
import { db } from '$lib/server/db'
import * as schema from '$lib/server/schema'
import GitHub from '@auth/core/providers/github'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { SvelteKitAuth } from '@auth/sveltekit'
import type { InferInsertModel } from 'drizzle-orm'
import type { PgTableFn } from 'drizzle-orm/pg-core'

const map = {
  user: schema.users,
  account: schema.accounts,
  session: schema.sessions,
  verification_token: schema.verificationTokens,
}
const tableFn = <T extends keyof typeof map>(name: T, ..._: unknown[]) => {
  return map[name]
}

export default SvelteKitAuth({
  adapter: DrizzleAdapter(db, tableFn as PgTableFn),
  trustHost: true,
  secret: AUTH_SECRET,
  providers: [
    GitHub({
      clientId: GITHUB_ID,
      clientSecret: GITHUB_SECRET,
      profile: ({ id, email, name, login, avatar_url }) => {
        return {
          id: id + '',
          email: email!,
          name: name ?? login,
          username: login,
          image: avatar_url,
          bio: 'Hello world!',
        } satisfies InferInsertModel<typeof schema.users>
      },
    }),
  ],
  callbacks: {
    // @ts-expect-error Using database, not JWT
    session({ session, user }) {
      return { ...session, user }
    },
  },
})
