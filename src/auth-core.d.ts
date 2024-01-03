import type { User as UserType } from '$lib/types'

declare module '@auth/core/types' {
  interface Session {
    user: UserType
  }
}
