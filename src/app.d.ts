import type { UnsafeUser } from '$lib/types'

declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    interface PageData {
      localUser: UnsafeUser | undefined
    }
    interface PageState {
      selectedImageId: string | undefined
    }
    // interface Platform {}
  }
}

export {}
