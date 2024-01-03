import type { posts as postsSchema } from '$lib/server/schema/schema'
import type { InferSelectModel } from 'drizzle-orm'

declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    interface PageState {
      selectedImage: InferSelectModel<typeof postsSchema>
    }
    // interface Platform {}
  }
}

export {}
