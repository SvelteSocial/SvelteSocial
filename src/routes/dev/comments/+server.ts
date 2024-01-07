import { dev } from '$app/environment'
import { db } from '$lib/server/db'
import { postComments as commentsSchema } from '$lib/server/schema'
import { faker } from '@faker-js/faker'
import { error, json } from '@sveltejs/kit'

export async function GET() {
  // console.log('GET')
  // if (!dev) return
  const posts = await db.query.posts.findMany()
  if (!posts.length) return error(404, 'No posts in database')

  const comments = posts
    .map((post) =>
      Array.from({ length: 3 }, () => ({
        postId: post.id,
        authorId: post.authorId,
        content: faker.lorem.paragraph(),
      }))
    )
    .flat()
  const created = await db.insert(commentsSchema).values(comments).returning()
  return json(created)
}
