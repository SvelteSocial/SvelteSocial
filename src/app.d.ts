import type { UnsafeUser } from '$lib/types'
import type { QueryClient } from '@tanstack/svelte-query'

declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    interface PageData {
      localUser: UnsafeUser | undefined
      queryClient: QueryClient
    }
    // interface PageState {}
    // interface Platform {}
  }
}

export {}
