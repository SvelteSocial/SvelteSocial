import { dev } from '$app/environment'
import { db } from '$lib/server/db'
import { posts, users } from '$lib/server/schema/schema'
import { faker } from '@faker-js/faker'
import { error, json } from '@sveltejs/kit'

export async function GET() {
  console.log('GET')
  if (!dev) return
  const user = await db.query.users.findFirst({ columns: { id: true } })
  if (!user) return error(404, 'No users in database')
  const [post] = await db
    .insert(posts)
    .values({
      authorId: user.id,
      caption: faker.lorem.sentence(),
      media: Array.from({ length: 3 }, () => faker.image.urlPicsumPhotos()),
    })
    .returning()
  return json(post)
}
