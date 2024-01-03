export async function load({ locals }) {
  const session = await locals.getSession()
  const localUser = session?.user
  return { localUser }
}
