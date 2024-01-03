import type { Post } from '$lib/types'

declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    interface PageState {
      selectedImage: Post
    }
    // interface Platform {}
  }
}

export {}
