import { dev } from '$app/environment'
import { db } from '$lib/server/db'
import { posts as postsSchema } from '$lib/server/schema/schema'
import { faker } from '@faker-js/faker'
import { error, json } from '@sveltejs/kit'

function getRandomImage() {
  const aspectRatios = [
    [4, 3],
    [16, 9],
    [1, 1],
    [9, 16],
  ]
  const aspectRatio = faker.helpers.arrayElement(aspectRatios)
  const width = faker.helpers.rangeToNumber({
    min: 200,
    max: 400,
  })
  const height = Math.round((width * aspectRatio[1]) / aspectRatio[0])
  const imageUrl = faker.image.url({ width, height })
  return imageUrl
}

export async function GET() {
  console.log('GET')
  if (!dev) return
  const user = await db.query.users.findFirst({ columns: { id: true } })
  if (!user) return error(404, 'No users in database')
  const posts = await db
    .insert(postsSchema)
    .values(
      Array.from({ length: 3 }, () => ({
        authorId: user.id,
        caption: faker.lorem.sentence(),
        media: Array.from({ length: 3 }, () => getRandomImage()),
      }))
    )
    .returning()
  return json(posts)
}
